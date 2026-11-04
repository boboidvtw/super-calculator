# 架構說明

這份文件說明 Super Calculator 怎麼組成、資料怎麼流動，以及幾個重要的設計決策和背後的原因。使用方式和開發指令見 [README](../README.md)，貢獻流程見 [CONTRIBUTING](../CONTRIBUTING.md)。

## 目錄

- [總覽](#總覽)
- [分層](#分層)
- [路由與程式碼分割](#路由與程式碼分割)
- [狀態與輸入](#狀態與輸入)
- [匯率服務](#匯率服務)
- [多語系](#多語系)
- [PWA 與離線](#pwa-與離線)
- [部署與網址](#部署與網址)
- [和主站 Service Worker 共存](#和主站-service-worker-共存)
- [設計決策紀錄](#設計決策紀錄)

---

## 總覽

這是一個**純前端的靜態網站**：沒有後端，也沒有資料庫。唯一的外部依賴是匯率 API。

```
瀏覽器
 ├─ index.html ─▶ main.tsx ─▶ i18n/config.ts（初始化語言）
 │                    └──▶ App.tsx（HashRouter）
 │                           ├─ RootLayout（選單、語言切換）
 │                           │    └─ pages/*（lazy-load）
 │                           │         ├─ hooks/*（輸入、鍵盤、匯率）
 │                           │         └─ utils/*（純計算）
 │                           └─ services/currencyService ──▶ open.er-api.com
 ├─ registerSW.js ─▶ sw.js（Workbox：預先快取 + 匯率快取）
 └─ localStorage：語言選擇、匯率快取
```

---

## 分層

| 層 | 位置 | 職責 | 可以依賴 |
|----|------|------|----------|
| 頁面 | `src/pages/` | 排版、顯示結果、收集輸入 | layouts、components、hooks、utils、i18n |
| 版面 | `src/layouts/` | 共用的外框、選單、標題區 | components、i18n |
| 元件 | `src/components/` | `Button`、`Display`、`NumPad` | 只依賴 React |
| Hooks | `src/hooks/` | 輸入狀態、鍵盤事件、匯率載入 | utils、services |
| 服務 | `src/services/` | 外部 API、快取、資料驗證 | 無 |
| 邏輯 | `src/utils/` | 純函式計算 | 無（不碰 React、DOM、storage） |

依賴只能往下指。最重要的規則是：**`utils/` 不依賴任何東西**。所有會出錯的計算（浮點、時區、大數、IRR 求解）都集中在這裡，用單元測試保護，覆蓋率門檻也只算這一層加上 `services/`。

---

## 路由與程式碼分割

- `src/features.ts` 的 `FEATURES` 陣列是**唯一的計算機清單**。`App.tsx` 的路由、`Home` 的格子、`RootLayout` 的側邊選單都從它產生，所以新增計算機時不會漏掉其中一處。
- 每個頁面都用 `React.lazy()` 載入，在 `<Suspense>` 裡顯示「載入中」。打包時每個計算機會拆成獨立的 chunk，第一次開啟只需要下載首頁。
- 未知的路徑會 `<Navigate to="/" replace />` 導回首頁。

---

## 狀態與輸入

- **沒有全域狀態管理**（Redux、Zustand 等）。每個計算機的狀態都在自己的頁面裡，彼此不共用。
- **標準計算機**用 `useReducer` 搭配 `utils/calculator.ts` 的 `calculatorReducer`。reducer 是純函式，所以四則運算、錯誤狀態、歷史紀錄都可以直接測試，不需要渲染畫面。
- **數字輸入**統一用 `useNumericInput`，背後是 `utils/numericInput.ts` 的 `appendDigit`、`appendDot`、`removeLast`，預設最多 12 個字元；標準計算機最多 16 位數。
- **實體鍵盤**由 `useKeyboardInput` 處理：在 `window` 上監聽 `keydown`，焦點在 `input`、`textarea`、`select` 或可編輯元素時不處理，按著 Ctrl、Cmd、Alt 時也不處理，以免蓋掉瀏覽器的快捷鍵。handler 存在 `ref` 裡，所以只會註冊一次監聽。

---

## 匯率服務

`src/services/currencyService.ts`：

| 項目 | 設定 |
|------|------|
| 端點 | `https://open.er-api.com/v6/latest/<BASE>`（不需要 API key） |
| 應用層快取 | `localStorage`，key 是 `currency_rates_v2_<BASE>`，24 小時有效 |
| 驗證 | `parseApiResponse` 確認 `result === 'success'`，而且每個匯率都是有限的數字；格式不對就丟出錯誤 |
| 失敗處理 | 網路或 API 失敗時，即使快取已過期也先拿來用；完全沒有快取才顯示錯誤 |
| 容錯 | `localStorage` 被停用（例如無痕模式）或已滿時，照常運作，只是沒有快取；快取內容損壞時當作沒有快取 |
| 更新時間 | 顯示 API 回傳的 `time_last_update_unix`，不是查詢的時間 |

離線時有兩層備援：上面的 `localStorage` 快取，以及 Service Worker 的 `exchange-rates` 快取（見 [PWA 與離線](#pwa-與離線)）。

---

## 多語系

- **基準語系**是 `zh-TW.ts`，它匯出 `Translation = typeof zhTw`。其他語系都宣告成 `Translation`，key 少了或多了都會**編譯失敗**；`i18n.test.ts` 再檢查 key 是否一致、沒有空字串、保留 `{{date}}` 佔位符。
- **偵測順序**：`?lng=` 網址參數 → `localStorage`（`i18nextLng`）→ 瀏覽器語言。偵測到的代碼會先經過 `normalizeLanguage` 對應到支援的語言（例如 `en-GB` 對應 `en-US`，`zh-HK` 對應 `zh-TW`，`zh-SG` 對應 `zh-CN`）。
- **備援語言**：`zh-CN` 缺字時先用 `zh-TW`，再用 `en-US`；其他語言都用 `en-US`。
- 切換語言時會同步更新 `<html lang>`，讓螢幕閱讀器使用正確的發音，瀏覽器也會選對中日韓字型。

---

## PWA 與離線

由 `vite-plugin-pwa`（`generateSW` 模式）在 build 時產生 `sw.js` 和 `registerSW.js`：

| 項目 | 設定 | 效果 |
|------|------|------|
| `registerType` | `autoUpdate` | 偵測到新版就在背景安裝，下次開啟時生效，不會跳出提示 |
| 預先快取（precache） | 所有 build 產物（約 46 個檔案、425 KiB） | 第一次開啟後，所有頁面都能離線使用 |
| 執行期快取 | `open.er-api.com` 使用 `NetworkFirst`，cache 名稱 `exchange-rates`，最多 10 筆、7 天 | 有網路時拿最新的匯率；離線時用快取 |
| Manifest | `start_url` 和 `scope` 都是 `./`，`display: standalone` | 安裝後以獨立視窗開啟，範圍限制在 `/super-calculator/` |

開發模式（`npm run dev`）不啟用 Service Worker。要測離線行為，請用 `npm run build && npm run preview`。

---

## 部署與網址

| 項目 | 設定 |
|------|------|
| 主機 | GitHub Pages，專案頁面 |
| 網址 | `https://boboidvtw.github.io/super-calculator/` |
| Pages 來源 | GitHub Actions（`build_type: workflow`） |
| 觸發 | `ci.yml`：`main` 的 `verify` job 通過後，由 `deploy` job 使用 `actions/deploy-pages` 部署 |
| `vite.config.ts` 的 `base` | `'./'`（相對路徑） |
| 路由 | `HashRouter` |

`base: './'` 讓所有資源都用相對路徑引用，所以同一份 `dist/` 放在任何子路徑都能運作。以後要換網址（例如自訂網域或其他子路徑）不需要重新設定。

---

## 和主站 Service Worker 共存

這個專案和使用者的主站 `boboidvtw.github.io` 屬於**同一個 origin**（`https://boboidvtw.github.io`），所以兩邊共用同一份 Cache Storage 和 `localStorage`。

| | 主站 | Super Calculator |
|--|------|------------------|
| SW 範圍 | `/` | `/super-calculator/` |
| Cache 名稱 | `sigma-calc-v*` | `workbox-precache-v2-…/super-calculator/`、`exchange-rates` |

瀏覽器會讓 scope 比較精確的 SW 負責對應的頁面，所以 `/super-calculator/` 底下的請求由本專案的 SW 處理。2026-11-04 之前，主站的 SW 有兩個問題：

1. 每次改版時，`activate` 會**刪掉同一個 origin 下的所有快取**，導致本專案的離線快取被清掉。
2. scope 是 `/` 的 cache-first 策略，在本專案的 SW 還沒註冊之前，會攔截並快取 `/super-calculator/*` 的請求。

主站 v3.11.3（[boboidvtw/boboidvtw.github.io#1](https://github.com/boboidvtw/boboidvtw.github.io/pull/1)）已經修正：只刪除 `sigma-calc-` 開頭的快取，並且不攔截 `EXCLUDED_PATH_PREFIXES` 裡列出的子路徑。線上實測確認兩邊的快取可以共存。

> [!IMPORTANT]
> 以後在同一個網域底下新增其他子路徑 App 時，記得把路徑加進主站 `sw.js` 的 `EXCLUDED_PATH_PREFIXES`。

---

## 設計決策紀錄

| 決策 | 選擇 | 原因 | 放棄的方案 |
|------|------|------|------------|
| 路由 | `HashRouter` | GitHub Pages 無法把所有路徑改寫到 `index.html`；hash 路由在重新整理和分享連結時都正常 | `BrowserRouter` 加 `404.html` 轉址：會多一次跳轉，SEO 和 PWA scope 也比較麻煩 |
| 資源路徑 | `base: './'` | 可以放在任何子路徑，不需要寫死 repo 名稱 | `base: '/super-calculator/'`：換網址就要重新 build |
| 部署方式 | 專案頁面 + Actions | 和主站 repo 分開部署，互不影響；只有 CI 通過才會部署 | 把 `dist/` 複製進主站 repo：兩個專案會綁在一起，也要手動同步 |
| 計算邏輯 | 純函式放在 `utils/` | 可以單獨測試，覆蓋率門檻也有意義 | 把邏輯寫在元件裡：需要渲染才能測，邊界情況很難涵蓋 |
| 進位轉換 | `BigInt` | `Number` 超過 2^53 會失去精度 | `Number` 加 `parseInt` |
| 日期 | 一律用當地時區解析 `YYYY-MM-DD`，用日曆日相減 | `new Date('2026-01-01')` 會被當成 UTC，在 UTC 以西（或台灣早上 8 點前）會差一天；日光節約時間也會讓毫秒相減出錯 | 直接用 `Date` 的毫秒相減 |
| IRR 求解 | 二分法，範圍每月 −99.9% 到 +100% | 一定會收斂，也能明確判斷「無解」 | 牛頓法：速度快，但遇到極端的現金流可能發散 |
| 翻譯一致性 | 用 TypeScript 型別強制 | 缺 key 在編譯時就會發現，不用等到上線 | 只在執行時 fallback：缺字很難發現 |
| 匯率 API | `open.er-api.com/v6` | 不需要金鑰，靜態網站不用藏 secret | 需要金鑰的 API：純前端無法安全保存金鑰 |
| 分支保護 | 必須通過 `verify`，不要求 review | 只有一位維護者；要求 review 會擋住自己，但 CI 門檻能保證 `main` 一定可以部署 | 不設保護：`gh pr merge --auto` 無法使用，也可能誤推壞掉的 `main` |

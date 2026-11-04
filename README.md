# Super Calculator（萬能計算機）

[![CI](https://github.com/boboidvtw/super-calculator/actions/workflows/ci.yml/badge.svg)](https://github.com/boboidvtw/super-calculator/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-offline_ready-5A0FC8.svg)](https://web.dev/progressive-web-apps/)

🔗 **線上使用**：<https://boboidvtw.github.io/super-calculator/>

**Super Calculator** 是一個把 13 種日常計算工具整合在一起的 Web App：標準計算機、匯率、單位、時間、進位、尺寸、小費、折扣、利息、保險 IRR、油耗、健康、紀念日。它可以安裝到手機或桌面，離線時照樣能用，介面支援 8 種語言。

> [!NOTE]
> 計算邏輯都寫成純函式，放在 `src/utils/`，每個都有單元測試，CI 會檢查覆蓋率不能低於 80%。健康與保險的結果只供參考，不構成醫療或財務建議。

---

## 目錄

- [功能一覽](#-功能一覽)
- [使用說明](#-使用說明)
- [技術棧](#️-技術棧)
- [專案結構](#️-專案結構)
- [本機開發](#-本機開發)
- [測試與品質門檻](#-測試與品質門檻)
- [CI/CD 與部署](#-cicd-與部署)
- [貢獻](#-貢獻)
- [常見問題](#-常見問題)
- [更多文件](#-更多文件)
- [贊助](#-贊助)
- [授權](#-授權)

---

## ✨ 功能一覽

| # | 功能 | 路由 | 說明 |
|---|------|------|------|
| 1 | 🧮 標準計算機 | `#/standard` | 四則運算、百分比、正負號、歷史紀錄；除以 0 會顯示 `Error`；`0.1 + 0.2` 會正確顯示 `0.3`；最多可輸入 16 位數 |
| 2 | 💱 貨幣兌換 | `#/currency` | 使用 [ExchangeRate-API](https://www.exchangerate-api.com/) 不需金鑰的 `open.er-api.com/v6` 端點；匯率在本機快取 24 小時，離線或 API 失敗時改用上次的匯率 |
| 3 | 📏 單位換算 | `#/unit` | 長度、重量、溫度、體積、面積 |
| 4 | ⏰ 時間計算 | `#/time` | 兩段時間（天、時、分、秒）相加或相減 |
| 5 | 🔢 進位轉換 | `#/number` | 二、八、十、十六進位互轉；用 `BigInt` 計算，超過 2^53 也不會失去精度；會擋下不合法的位數（例如十六進位裡的 `G`） |
| 6 | 👕 尺寸轉換 | `#/size` | 男鞋、女鞋、男 T 恤，對照美、英、歐、日四地尺寸 |
| 7 | 🧾 小費計算 | `#/tip` | 小費金額、總額、多人分帳 |
| 8 | 🏷️ 折扣計算 | `#/discount` | 折扣後的價格與省下的金額 |
| 9 | ％ 利息計算 | `#/interest` | 單利：本利和與利息 |
| 10 | 🛡️ 保險 IRR | `#/insurance` | 輸入每月繳費、繳費年數、領回年份與領回金額，算出年化內部報酬率；求解範圍是每月 −99.9% 到 +100%，沒有解時會明確告訴你 |
| 11 | ⛽ 油耗計算 | `#/fuel` | 用距離、油耗（km/L）、油價算出用油量與油錢 |
| 12 | ❤️ 健康計算 | `#/health` | BMI（WHO 分級）；成人可看體脂率**估算**（Deurenberg 1991 公式），未滿 18 歲不顯示 |
| 13 | 📅 紀念日 | `#/anniversary` | 倒數或已經過的天數、第 100 天、滿一年的日期；以當地時區計算，不會因時區差一天 |

**其他功能**

- **🌐 8 種語言**：繁體中文（預設）、English、Deutsch、Français、Español、日本語、한국어、简体中文，全部完整翻譯。
- **📱 PWA**：可安裝，離線可用，有新版本時自動更新。
- **⌨️ 實體鍵盤**：每個有數字鍵盤的頁面都支援，按鍵對照見[鍵盤快捷鍵](#鍵盤快捷鍵)。

---

## 📖 使用說明

### 安裝成 App

| 平台 | 步驟 |
|------|------|
| iPhone / iPad（Safari） | 分享按鈕 → 「加入主畫面」 |
| Android（Chrome） | 選單 → 「安裝應用程式」或「加到主畫面」 |
| 桌面（Chrome / Edge） | 網址列右側的安裝圖示 |

安裝後，第一次開啟時會把所有頁面存到本機，之後沒有網路也能用。匯率會使用最後一次連線時取得的資料。

### 鍵盤快捷鍵

焦點在輸入框裡時，這些快捷鍵不會作用，避免干擾輸入。

| 按鍵 | 動作 |
|------|------|
| `0`–`9` | 輸入數字 |
| `.` 或 `,` | 小數點 |
| `+` `-` | 加、減 |
| `*` 或 `x` | 乘 |
| `/` | 除 |
| `%` | 百分比 |
| `Enter` 或 `=` | 計算結果 |
| `Backspace` | 刪除最後一位 |
| `Esc` 或 `Delete` | 清除 |

### 指定語言

語言的決定順序：網址參數 → 上次的選擇（`localStorage`）→ 瀏覽器語言。要分享特定語言的連結，把 `?lng=` 放在 `#` **前面**：

```
https://boboidvtw.github.io/super-calculator/?lng=en-US#/currency
```

可用的代碼：`zh-TW`、`en-US`、`de-DE`、`fr-FR`、`es-ES`、`ja-JP`、`ko-KR`、`zh-CN`。瀏覽器語言是 `en`、`zh-HK` 這類代碼時，會自動對應到最接近的語言（`zh-Hant`、`zh-TW`、`zh-HK`、`zh-MO` 對應繁體中文，其他 `zh-*` 對應簡體中文）。

---

## 🛠️ 技術棧

| 類別 | 使用 |
|------|------|
| Framework | [React 19](https://react.dev/)、[React Router 7](https://reactrouter.com/)（`HashRouter`） |
| Build | [Vite 7](https://vitejs.dev/)、[vite-plugin-pwa 2](https://github.com/vite-pwa/vite-plugin-pwa)（Workbox `generateSW`） |
| Language | [TypeScript 5.9](https://www.typescriptlang.org/)（strict） |
| Styling | CSS Modules、[clsx](https://github.com/lukeed/clsx)、[Framer Motion](https://motion.dev/) |
| Icons | [Lucide React](https://lucide.dev/) |
| i18n | [i18next](https://www.i18next.com/) + react-i18next + browser language detector |
| Test | [Vitest 4](https://vitest.dev/)、`@vitest/coverage-v8` |
| Lint | [ESLint 10](https://eslint.org/)（flat config）、typescript-eslint、react-hooks、react-refresh |
| CI/CD | GitHub Actions → GitHub Pages |

---

## 🗂️ 專案結構

```
.github/workflows/ci.yml   # CI：lint → 測試覆蓋率 → build →（main）部署到 Pages
public/                    # PWA 圖示、favicon（由 scripts/generate-icons.mjs 產生）
scripts/
  generate-icons.mjs       # 重新產生 public/ 裡的圖示
src/
  main.tsx                 # 進入點：掛上 React、初始化 i18n
  App.tsx                  # HashRouter；路由從 features.ts 自動產生，未知路徑導回首頁
  features.ts              # ★ 計算機清單：路由、首頁格子、側邊選單都從這裡來
  layouts/                 # RootLayout（選單、語言切換）、CalculatorLayout
  pages/<功能>/            # 各計算機頁面（lazy-load，各自拆成獨立 chunk）
  components/              # Button、Display、NumPad
  hooks/                   # useCalculator、useNumericInput、useKeyboardInput、useCurrency
  utils/                   # ★ 純函式計算邏輯，全部有 *.test.ts
  services/                # currencyService：匯率 API、驗證、localStorage 快取
  i18n/
    config.ts              # i18next 初始化、語言偵測、<html lang> 同步
    languages.ts           # 支援的語言清單、BCP 47 代碼對應
    locales/zh-TW.ts       # ★ 定義 Translation 型別；其他 7 個語系的 key 必須完全一樣
  styles/theme.css         # 顏色、字型等 CSS 變數
vite.config.ts             # base './'、PWA manifest、Workbox 匯率快取、Vitest 設定
```

Service Worker 不是在 `main.tsx` 註冊的，而是由 vite-plugin-pwa 在 build 時注入 `registerSW.js` 來註冊。架構與設計決策的細節（為什麼用 HashRouter、PWA 快取策略、和主站 Service Worker 共存等）見 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。

---

## 🚀 本機開發

需要 [Node.js](https://nodejs.org/) **20.19 以上**（Vite 7 的要求），CI 使用 Node 22。

```bash
git clone https://github.com/boboidvtw/super-calculator.git
cd super-calculator
npm ci             # 依 package-lock.json 安裝
npm run dev        # http://localhost:5173
```

### 常用指令

| 指令 | 用途 |
|------|------|
| `npm run dev` | 開發伺服器（開發模式不會啟用 Service Worker） |
| `npm run build` | `tsc -b` 型別檢查，再建置到 `dist/` |
| `npm run preview` | 在本機預覽 `dist/`（可以測 PWA 和離線） |
| `npm test` | 執行單元測試 |
| `npm run test:watch` | 監看模式 |
| `npm run coverage` | 測試加覆蓋率報告（低於 80% 會失敗，HTML 報告在 `coverage/`） |
| `npm run lint` | ESLint |
| `npm run typecheck` | 只做型別檢查 |
| `node scripts/generate-icons.mjs` | 重新產生 PWA 圖示 |

---

## ✅ 測試與品質門檻

| 檢查 | 標準 | 在哪裡執行 |
|------|------|------------|
| ESLint | 0 error | 本機 `npm run lint`、CI |
| 單元測試 | 全部通過 | 本機 `npm test`、CI |
| 覆蓋率 | lines / functions / branches / statements 都 ≥ 80% | `npm run coverage`、CI |
| 型別與建置 | `tsc -b` 和 `vite build` 成功 | `npm run build`、CI |
| 語系一致 | 8 個語系的 key 完全相同 | TypeScript 編譯時檢查，加上 `src/i18n/i18n.test.ts` |

覆蓋率只計算邏輯層：`src/utils/`、`src/services/`、`src/i18n/languages.ts`。畫面元件不計入，因為計算邏輯都已經從元件抽到 `utils/`。

---

## 🔄 CI/CD 與部署

全部流程都在 [`.github/workflows/ci.yml`](.github/workflows/ci.yml)：

```
PR 或 push ──▶ verify job：npm ci → lint → coverage → build
                       │
                       └─（只在 main）上傳 dist/ 成為 Pages artifact
                                   │
                                   ▼
                       deploy job：部署到 GitHub Pages
```

| 事件 | verify | deploy |
|------|--------|--------|
| 開 PR、PR 有新 commit | ✅ 執行 | ⏭️ 跳過 |
| push 到 `main`（PR 合併） | ✅ 執行 | ✅ verify 通過才執行 |
| Actions 頁面手動觸發（`workflow_dispatch`，選 main） | ✅ 執行 | ✅ verify 通過才執行 |

- 部署網址：<https://boboidvtw.github.io/super-calculator/>
- 同時只會有一個部署在跑（`concurrency: pages`），新的部署會排隊，不會中斷進行中的部署。
- PR 有新的 commit 時，舊的 CI run 會自動取消；`main` 的 run 一定會跑完，避免部署到一半被取消。
- **回滾**：在 `main` 上 `git revert` 有問題的 commit，開 PR 合併即可，CI 會自動部署上一個正確的版本。急的話，也可以在 Actions 頁面選上一次成功的 run，按 **Re-run jobs**。

### 分支保護

`main` 的保護規則：

| 規則 | 設定 |
|------|------|
| 必須通過的檢查 | `verify` |
| 必須先更新到最新的 main | 否 |
| 必須有 review | 否 |
| 禁止 force push、禁止刪除 | 是 |
| 合併後自動刪除分支 | 是 |

---

## 🤝 貢獻

歡迎提 Issue 或 Pull Request。完整流程（commit 格式、如何新增計算機、如何新增翻譯）見 [CONTRIBUTING.md](CONTRIBUTING.md)。快速版：

```bash
git checkout -b feat/my-change
# ...修改...
npm run lint && npm run coverage && npm run build
git commit -m "feat: 新增 XXX"
git push -u origin feat/my-change
gh pr create --fill
gh pr merge --auto --squash    # CI 通過後自動 squash merge，並自動刪除分支
```

---

## ❓ 常見問題

**部署後畫面還是舊的？**
Service Worker 會在背景下載新版本，下次開啟時才會換上（`registerType: 'autoUpdate'`）。要立刻看到新版，關掉所有分頁再重新開啟，或在開發者工具的 Application → Service Workers 按 *Update*。

**匯率顯示的時間不是現在？**
顯示的是 API 提供者的更新時間，不是你查詢的時間。免費端點大約每天更新一次，本機也會快取 24 小時。

**為什麼網址裡有 `#`？**
GitHub Pages 不支援 SPA 的伺服器端路由改寫，用 `HashRouter` 才能讓 `#/currency` 這類連結在重新整理或直接分享時正常開啟。

**保險 IRR 出現錯誤訊息？**

| 訊息 | 原因 |
|------|------|
| 請輸入大於 0 的數值 | 有欄位是空的、0 或負數 |
| 領回年期不能小於繳款年限 | 領回年份早於繳費結束 |
| 此組數值無法求得合理的 IRR | 在每月 −99.9% 到 +100% 的範圍內，找不到能讓繳費與領回現值相等的利率，通常是金額差距極端（例如領回金額遠小於或遠大於總繳費） |

沒填領回年份時，預設等於繳費年數。

---

## 📚 更多文件

| 文件 | 內容 |
|------|------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | 開發流程、commit 規範、新增計算機與翻譯的步驟 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 架構、資料流、PWA 快取、部署與設計決策 |
| [CHANGELOG.md](CHANGELOG.md) | 版本紀錄 |

---

## 💖 贊助

如果您喜歡這個專案，歡迎贊助作者一杯咖啡 ☕：

<a href="https://paypal.me/boboidvtw168">
  <img src="https://img.shields.io/badge/Donate-PayPal-ff3333.svg?style=for-the-badge&logo=paypal" alt="Donate via PayPal" />
</a>

## 📄 授權

此專案採用 [MIT License](LICENSE) 授權。

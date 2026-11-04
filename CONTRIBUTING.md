# 貢獻指南

謝謝你願意幫忙改進 Super Calculator！這份文件說明開發流程、規範，以及常見修改（新增計算機、新增翻譯）的具體步驟。

## 目錄

- [開發環境](#開發環境)
- [工作流程](#工作流程)
- [Commit 規範](#commit-規範)
- [程式風格](#程式風格)
- [測試](#測試)
- [新增一個計算機](#新增一個計算機)
- [新增或修改翻譯](#新增或修改翻譯)
- [更新 PWA 圖示](#更新-pwa-圖示)
- [依賴套件](#依賴套件)
- [回報問題](#回報問題)

---

## 開發環境

| 項目 | 需求 |
|------|------|
| Node.js | ≥ 20.19（CI 使用 22） |
| 套件管理 | npm（請用 `npm ci`，並提交 `package-lock.json` 的變更） |
| 編輯器 | 建議 VS Code，裝 ESLint 擴充套件 |

```bash
git clone https://github.com/boboidvtw/super-calculator.git
cd super-calculator
npm ci
npm run dev
```

---

## 工作流程

`main` 有分支保護：**一定要透過 PR 合併，而且 CI 的 `verify` 檢查必須通過**。

1. **從最新的 `main` 開分支**，名稱用 `<type>/<簡短描述>`：

   ```bash
   git checkout main && git pull
   git checkout -b feat/bmr-calculator
   ```

2. **修改程式**。修 bug 或加功能時，先寫一個會失敗的測試，再寫實作讓它通過。

3. **送出前在本機跑一次 CI 會跑的檢查**：

   ```bash
   npm run lint
   npm run coverage   # 覆蓋率 < 80% 會失敗
   npm run build
   ```

4. **Commit、推送、開 PR**：

   ```bash
   git commit -m "feat: add BMR calculator"
   git push -u origin feat/bmr-calculator
   gh pr create --fill
   ```

   PR 描述請寫：改了什麼、為什麼改、怎麼驗證（測試計畫）。

5. **開啟自動合併**：

   ```bash
   gh pr merge --auto --squash
   ```

   CI 通過後 GitHub 會自動 squash merge，並刪除遠端分支。合併到 `main` 後會自動部署到 GitHub Pages，通常 1–2 分鐘後上線。

6. **清理本機分支**：

   ```bash
   git checkout main && git pull && git branch -d feat/bmr-calculator
   git fetch --prune
   ```

> [!TIP]
> CI 失敗時，點 PR 上的 **Details** 看是哪一步失敗。修好後 push 到同一個分支，CI 會重新執行，auto-merge 的設定會保留。

---

## Commit 規範

格式：`<type>: <描述>`，一個 commit 只做一件事。

| type | 用途 | 例子 |
|------|------|------|
| `feat` | 新功能 | `feat: add BMR calculator` |
| `fix` | 修 bug | `fix: anniversary off by one day west of UTC` |
| `refactor` | 重構，不改變行為 | `refactor: extract IRR solver to utils/finance` |
| `perf` | 效能 | `perf: lazy-load calculator pages` |
| `test` | 只改測試 | `test: cover hex input edge cases` |
| `docs` | 文件 | `docs: expand README` |
| `ci` | CI / 部署設定 | `ci: deploy to GitHub Pages` |
| `chore` | 雜項、依賴升級 | `chore: upgrade ESLint 10` |

使用者看得到的變更，請同時在 [CHANGELOG.md](CHANGELOG.md) 的 `## Unreleased` 加一行。

---

## 程式風格

- **計算邏輯放在 `src/utils/`，寫成純函式**：輸入數字、回傳結果，不碰 React、DOM 或 `localStorage`。頁面元件只負責顯示和收集輸入。這樣邏輯才能單獨測試，也能被不同頁面共用。
- **不要就地修改**：回傳新的物件或陣列，不要改傳入的參數（reducer 也一樣）。
- **錯誤要明確處理**：無法計算時回傳 `null`，或用 `{ ok: false, reason }` 這類有區分的結果（參考 `calculateInsuranceIrr`），由畫面顯示對應的翻譯訊息。不要默默回傳 `0` 或 `NaN`。
- **畫面上的文字一律用 `t('key')`**，不要把中文或英文寫死在元件裡。
- **樣式用 CSS Modules**（`Foo.module.css`），顏色等變數用 `src/styles/theme.css` 裡的 CSS 變數。
- **路徑別名**：`@/` 指向 `src/`。
- ESLint 會檢查 React hooks 的規則，以及 react-refresh 的匯出限制；`npm run lint` 必須 0 error。

---

## 測試

| 項目 | 說明 |
|------|------|
| 框架 | Vitest |
| 位置 | 跟被測檔案放在一起：`foo.ts` 配 `foo.test.ts` |
| 範圍 | `vite.config.ts` 的 `test.include` 是 `src/**/*.test.ts` |
| 覆蓋率 | 只計算 `src/utils/`、`src/services/`、`src/i18n/languages.ts`，四項都要 ≥ 80% |

寫測試的原則：

- **期望值要有獨立的來源**：手算的值、公式的公開範例、已知正確的數字。不要用和實作一樣的公式再算一次當答案，那樣實作錯了測試也會跟著錯。
- **一定要測邊界**：0、負數、空字串、極大值、除以 0、時區、浮點誤差（例如 `0.1 + 0.2`）。
- **修 bug 一定要附回歸測試**：測試要能在修正前重現這個 bug。

```bash
npm test               # 跑一次
npm run test:watch     # 監看模式
npm run coverage       # 加上覆蓋率；HTML 報告在 coverage/index.html
```

---

## 新增一個計算機

以新增「基礎代謝率（BMR）」為例。路由、首頁格子、側邊選單都由 `src/features.ts` 產生，所以**只需要登記一次**。

### 1. 計算邏輯和測試

`src/utils/health.ts`（或新增 `src/utils/bmr.ts`）：

```ts
/** Mifflin-St Jeor BMR in kcal/day; null when input is not positive. */
export function bmr(weightKg: number, heightCm: number, age: number, sex: 'male' | 'female'): number | null {
    if (!(weightKg > 0 && heightCm > 0 && age > 0)) return null;
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return sex === 'male' ? base + 5 : base - 161;
}
```

`src/utils/bmr.test.ts`：用公式文獻裡的範例當期望值，並測試無效的輸入。

### 2. 頁面

建立 `src/pages/bmr/BmrCalculator.tsx`，以及需要的話 `BmrCalculator.module.css`。參考既有的頁面（例如 `pages/financial/FuelCalculator.tsx`）：

- 外層用 `CalculatorLayout`，傳入 `title`、`description`、`display`。
- 數字輸入用 `useNumericInput` 搭配 `NumPad`；這樣實體鍵盤和輸入長度限制會自動生效。
- 用 **named export**：`export function BmrCalculator() { ... }`。

### 3. 登記到 `src/features.ts`

```ts
import { Flame } from 'lucide-react';

const BmrCalculator = lazy(() => import('./pages/bmr/BmrCalculator').then((m) => ({ default: m.BmrCalculator })));

export const FEATURES: Feature[] = [
    // ...
    { path: 'bmr', labelKey: 'menu.bmr', icon: Flame, color: '#ff9f0a', component: BmrCalculator },
];
```

用 `lazy()` 載入，頁面會拆成獨立的 chunk，不會增加首頁的載入量。

### 4. 翻譯

在 `src/i18n/locales/zh-TW.ts` 的 `menu` 加 `bmr`，再新增一個 `bmr: { title, desc, ... }` 區塊。接著照[新增或修改翻譯](#新增或修改翻譯)的步驟，補齊其他 7 個語系。

### 5. 驗證

```bash
npm run lint && npm run coverage && npm run build
npm run dev   # 打開 http://localhost:5173/#/bmr，切換幾個語言看看
```

---

## 新增或修改翻譯

`src/i18n/locales/zh-TW.ts` 是**唯一的基準**，它匯出的 `Translation` 型別定義了所有 key 的結構。其他 7 個語系檔都宣告為 `Translation`：

```ts
import type { Translation } from './zh-TW';
export const enUs: Translation = { ... };
```

所以：

1. **先改 `zh-TW.ts`**：新增、改名或刪除 key。
2. 執行 `npm run typecheck`，TypeScript 會列出其他語系檔缺少或多出的 key。
3. 逐一補上 `en-US`、`zh-CN`、`ja-JP`、`ko-KR`、`de-DE`、`fr-FR`、`es-ES` 的翻譯。
4. `npm test` 時，`src/i18n/i18n.test.ts` 會再檢查一次 8 個語系的 key 是否完全一致，以及是否有空字串。

### 新增一種語言

1. 在 `src/i18n/locales/` 新增 `xx-YY.ts`（宣告為 `Translation`），並從 `locales/index.ts` 匯出。
2. 在 `src/i18n/languages.ts` 的 `LANGUAGES` 加上 `{ code, label }`；如果要讓 `xx` 這類只有主語言的代碼也能對應，加到 `PRIMARY_TO_SUPPORTED`。
3. 在 `src/i18n/config.ts` 的 `resources` 加上這個語言。
4. 在 `src/i18n/i18n.test.ts` 的 `ALL` 加上這個語言。

---

## 更新 PWA 圖示

`public/` 裡的圖示由腳本產生，不要手動編輯：

```bash
node scripts/generate-icons.mjs
```

PWA manifest 的設定（名稱、顏色、圖示清單）在 `vite.config.ts` 的 `VitePWA({ manifest })`。

---

## 依賴套件

- 新增套件前，先確認它還有人維護、授權相容（MIT / Apache-2.0 / BSD），而且沒有已知的漏洞。
- 只在 build 或開發時用到的套件，請裝成 `devDependencies`。
- 升級後跑 `npm audit`，並在 PR 描述寫出 audit 結果的變化。
- `package.json` 的 `overrides` 用來把有漏洞的間接依賴鎖到修正版（目前是 `minimatch`、`glob`）。上游套件修好後，可以移除對應的 override。

---

## 回報問題

到 [Issues](https://github.com/boboidvtw/super-calculator/issues) 開一個新 issue，請附上：

- 哪一個計算機、輸入了什麼、預期的結果、實際的結果
- 瀏覽器與作業系統；是否是安裝後的 App
- 介面語言
- 有錯誤的話，附上瀏覽器 Console 的訊息

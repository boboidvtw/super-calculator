# Super Calculator (萬能計算機)

[![CI](https://github.com/boboidvtw/super-calculator/actions/workflows/ci.yml/badge.svg)](https://github.com/boboidvtw/super-calculator/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)](https://vitejs.dev/)

🔗 **線上使用**：<https://boboidvtw.github.io/super-calculator/>

**Super Calculator** 是一個現代化、全功能的 Web 計算機應用程式。除了標準計算機，還整合了生活中常用的各種換算與計算工具。

> [!NOTE]
> 本專案採用 **React + TypeScript + Vite** 開發，並支援 **PWA (Progressive Web App)**，可安裝於手機或桌面離線使用。

## ✨ 主要功能 (Features)

1.  **🧮 標準計算機 (Standard)**：四則運算、百分比、正負號，支援實體鍵盤。
2.  **💱 貨幣兌換 (Currency)**：每日匯率換算（[ExchangeRate-API](https://www.exchangerate-api.com/) 免費端點，離線時使用快取）。
3.  **📏 單位換算 (Unit)**：長度、重量、溫度、體積、面積。
4.  **⏰ 時間計算 (Time)**：兩段時間（天、時、分、秒）的加減。
5.  **🔢 進位轉換 (Number Base)**：二、八、十、十六進位互轉，支援超過 2^53 的大數。
6.  **👕 尺寸轉換 (Size)**：各國服飾、鞋碼對照。
7.  **💰 理財工具 (Financial)**：小費分帳、折扣、單利利息、保險 IRR、油耗。
8.  **❤️ 健康計算 (Health)**：BMI（WHO 分級）與體脂率**估算**（Deurenberg 公式，僅限成人，僅供參考）。
9.  **📅 紀念日 (Anniversary)**：倒數或經過天數、第 100 天、滿一年日期。
10. **🌐 多語系 (i18n)**：繁體中文、English、日本語、한국어、简体中文、Deutsch、Français、Español（8 種語言完整翻譯）。

## 🛠️ 技術棧 (Tech Stack)

| 類別 | 使用 |
|------|------|
| Framework | [React 19](https://react.dev/)、[React Router 7](https://reactrouter.com/)（HashRouter） |
| Build | [Vite 7](https://vitejs.dev/)、[vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) |
| Language | [TypeScript 5.9](https://www.typescriptlang.org/)（strict） |
| Styling | CSS Modules、[clsx](https://github.com/lukeed/clsx) |
| Icons | [Lucide React](https://lucide.dev/) |
| i18n | [i18next](https://www.i18next.com/) |
| Test | [Vitest](https://vitest.dev/)（覆蓋率門檻 80%） |

## 🗂️ 專案結構

```
src/
  features.ts        # 功能清單：路由、首頁、選單共用
  pages/             # 各計算機頁面（lazy-loaded）
  components/        # Button、Display、NumPad
  hooks/             # useCalculator、useNumericInput、useKeyboardInput、useCurrency
  utils/             # 純函式計算邏輯（皆有單元測試）
  services/          # 匯率 API 與快取
  i18n/              # 語系設定；locales/zh-TW.ts 定義 Translation 型別，其他語系必須完全對齊
scripts/
  generate-icons.mjs # 產生 public/ 的 PWA 圖示
```

## 🚀 快速開始 (Getting Started)

需要 [Node.js](https://nodejs.org/) **20.19 以上**（Vite 7 的需求）。

```bash
git clone https://github.com/boboidvtw/super-calculator.git
cd super-calculator
npm install
npm run dev        # http://localhost:5173
```

### 常用指令

| 指令 | 用途 |
|------|------|
| `npm run dev` | 開發伺服器 |
| `npm run build` | 型別檢查 + 建置到 `dist/` |
| `npm run preview` | 預覽建置結果 |
| `npm test` | 執行單元測試 |
| `npm run coverage` | 測試 + 覆蓋率報告（低於 80% 會失敗） |
| `npm run lint` | ESLint |
| `node scripts/generate-icons.mjs` | 重新產生 PWA 圖示 |

### 部署

push 到 `main` 且 CI（lint、測試、build）全綠後，`ci.yml` 的 `deploy` job 會自動把 `dist/` 部署到 GitHub Pages。也可以在 Actions 頁面手動觸發（`workflow_dispatch`）。

CI（GitHub Actions）會在每個 PR 與 push 到 `main` 時執行 lint、測試覆蓋率與建置。

### 新增語系字串

在 `src/i18n/locales/zh-TW.ts` 加入新 key 後，TypeScript 會要求其他 7 個語系檔補上同一個 key，`src/i18n/i18n.test.ts` 也會檢查 key 是否一致。

## 🤝 貢獻 (Contributing)

歡迎提交 Pull Request 或 Issue！送 PR 前請確認 `npm run lint`、`npm run coverage`、`npm run build` 都通過。

## 💖 贊助 (Sponsor)

如果您喜歡這個專案，歡迎贊助作者一杯咖啡 ☕：

<a href="https://paypal.me/boboidvtw168">
  <img src="https://img.shields.io/badge/Donate-PayPal-ff3333.svg?style=for-the-badge&logo=paypal" alt="Donate via PayPal" />
</a>

## 📄 授權 (License)

此專案採用 [MIT License](LICENSE) 授權。

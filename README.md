# ARNGREN 網站完整檔案

整理日期：2026-10-23
版本：精細坦克模型版（線上版本 12）
原始碼版本：103652dd88a7d12b96973473905217cbb1a30879

線上公開網址：https://arngren-redesign-study.lemonypear64.chatgpt.site/

## 在電腦預覽

1. 將 ZIP 完整解壓縮。
2. 電腦安裝 Node.js（官方下載：https://nodejs.org/）。
3. Windows 雙擊 `START-WEBSITE.cmd`，保留命令視窗。
4. 在瀏覽器開啟 http://127.0.0.1:4173/#home 。
5. 結束時按 Ctrl+C 或關閉命令視窗。

成品已編譯，預覽不用安裝 npm 套件。也可以直接使用線上公開網址。

## 資料夾內容

- `dist/`：可部署與預覽的成品，包含全部圖片、JavaScript 與 CSS。
- `src/`：React 原始碼、樣式與 Three.js 模型。
- `src/components/TankExperience/`：首頁 tank 模型。
- `package.json`、`package-lock.json`：套件清單與版本鎖定。
- `scripts/preview.cjs`：不依賴額外套件的本機預覽工具。
- `ASSET_SOURCES.md`：素材來源說明。
- `DESIGN_REFERENCES.md`：設計參考與歷次迭代紀錄；最終畫面以本包成品為準。

## 修改原始碼

安裝 Node.js 後，在本資料夾開啟終端機，依序執行：

```text
npm ci
npm run build
node scripts/preview.cjs
```

重新整理本機網頁即可查看修改。修改本機檔案後，需另外部署才會更新線上網站。

## 本版內容

銀灰產品展示首頁、坦克滾動拆解與組裝、章節切換與重播、靜態預覽、石墨灰／沙岩色配色。模型細節包含輪圈、履帶鉸接、車殼接縫、艙蓋把手、格柵及概念馬達與線材。另含商品搜尋、篩選、比較、購物車與示意訂購流程。

本網站為課堂設計原型。坦克是原創概念模型，未經驗證為 Torro 真實商品或實際組裝圖；商品圖片與部分資料為示意。訂購操作不會向原網站下單或付款。

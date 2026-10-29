# 小動物點心工坊

純靜態、繁體中文的因數／倍數操作遊戲。適合剛接觸這兩個概念的孩子；先分餅乾、烤餅乾，再出現數學名稱。沒有倒數、生命或扣分，也沒有公因數。

## 遊玩與上線

不需安裝套件、不需建置、不載入外部字型或圖片。把本資料夾原樣放到任何靜態網站（含 GitHub Pages 專案子路徑）即可。

本機請使用 HTTP 伺服器，而不是直接雙擊 HTML，因為瀏覽器對 `file://` 的 ES 模組有限制。此 Windows 環境可用：

```bash
python -m http.server 8766 --bind 127.0.0.1
```

開啟 `http://127.0.0.1:8766/`。所有網站資源均使用相對路徑。沒有後端、追蹤、登入或網路服務；不含 Service Worker，未承諾離線快取。

## 六站學習路線

| 站 | 操作 | 具體目標 | 新數量預測 |
|---|---|---|---|
| 1 兔兔的野餐袋 | 12 片重新分袋 | 每袋 3 片，剛好 4 袋 | 16 片分 4 袋，每袋 4 片 |
| 2 熊熊的分享盒 | 18 片重新分袋 | 每袋 6 片，剛好 3 袋 | 15 片分 3 袋，每袋 5 片 |
| 3 狐狸的剛好挑戰 | 20 片重新分袋 | 每袋 4 片，剛好 5 袋 | 24 片分 4 袋，每袋 6 片 |
| 4 兔兔的烤盤 | 每盤固定 3 片 | 加到 4 盤，共 12 片 | 15 片需 5 盤 |
| 5 熊熊的下午茶 | 每盤固定 4 片 | 加到 5 盤，共 20 片 | 12 片需 3 盤 |
| 6 森林點心派對 | 每盤固定 5 片 | 加到 6 盤，共 30 片 | 20 片需 4 盤 |

每次操作會實際重排餅乾：每袋／每盤都有可數的餅乾，剩餘另外呈現。倍數操作每按一次只增加或移除一盤，並保留每盤的累積片數。完成具體操作後才解釋因數／倍數；不是選任何因數就算完成。

提示 → 一步一步示範 → 自己重做 → 全新預測。**示範不會發印章**，也不能直接跳到預測。新預測不顯示已分好的答案，必須答對才記錄完成。地圖可自由選站，建議依序玩。

## 完整操作／瀏覽器驗收選擇器

1. 首頁開始：`[data-action="start"]`；地圖任意站：`[data-level="0"]` 到 `5`。
2. 第 1 站先點 `[data-choice="5"]`：看見 2 袋各 5 片、剩下 2 片。
3. `[data-action="hint"]` 顯示提示，再點 `[data-action="demo"]`。
4. `[data-action="demo-next"]` 每點一次裝一袋／加一盤。不能取得印章；點 `.workbench [data-action="retry"]` 自己重做。
5. 前 3 站依序點 `[data-choice="3"]`、`[data-choice="6"]`、`[data-choice="4"]`，每站再按 `[data-action="predict"]`。
6. 新任務依序點 `[data-verify="4"]`、`[data-verify="5"]`、`[data-verify="6"]`。先選錯也可繼續，不扣分。
7. 每次完成按 `[data-action="next"]` 前進。
8. 第 4、5、6 站，分別點 `[data-action="add"]` 4、5、6 次；可用 `[data-action="remove"]` 拿走一盤。
9. 每站按預測，新任務依序選 `[data-verify="5"]`、`[data-verify="3"]`、`[data-verify="4"]`。
10. 最後按 `.workbench [data-action="map"]`，`#progress` 為 `6 / 6`。重整後保留。
11. `[data-action="guide"]` 開啟大人小紙條，`.primary[data-close="guide-dialog"]` 關閉。
12. `[data-action="reset"]` 開確認；`[data-close="reset-dialog"]` 取消不改紀錄；`[data-action="confirm-reset"]` 才清除。

注意：頁首與工作臺可能各有返回／重新試試按鈕，因此自動化請使用上面帶 `.workbench` 的選擇器，避免嚴格模式遇到重複符合。

## 測試

Node 內建測試器，無專案測試套件依賴：

```bash
node.exe --test tests/*.test.js
# 或 npm test
```

一般環境會跑 5 個單元／畫面測試，略過 1 個選用的真實瀏覽器測試。要執行完整測試，需另有 Playwright 與 Chromium／Edge（只用於開發測試，網站不需要它們）：

```bash
PLAYWRIGHT_MODULE='C:/Users/power/AppData/Local/hermes/cache/scratch/snack-browser/node_modules/playwright/index.mjs' node.exe --test tests/*.test.js
```

可用 `BROWSER_EXE` 指定瀏覽器執行檔；預設為 Windows Edge。測試自行開啟並關閉隨機連接埠的靜態伺服器，使用獨立瀏覽器資料，不改正常瀏覽器紀錄。

驗證涵蓋：整數／零／負數／餘數、六站資料、具體成功條件、提示與示範不可完成、獨立預測閘門、儲存拒絕／壞資料／去重、實際餅乾數、360px 真瀏覽器六站完整通關、錯誤預測、重整保存、重設取消與確認、指南對話框、1280px 不水平溢出，以及無頁面 JavaScript 錯誤。

開發採垂直 TDD：數學 → 關卡 → 狀態轉換 → 紀錄 → 操作畫面 → 瀏覽器整合，各切片先執行失敗測試再實作，最後全套驗證。初次失敗分別為缺少 `group`、`LEVELS`、`createState`、`loadProgress`、`workbench`，以及首頁 HTTP 404。瀏覽器整合時另外修正測試內重複選擇器的範圍。

## 設計與可及性

- 自製 SVG 兔兔、熊熊、狐狸，CSS 餅乾與森林場景，無授權素材依賴。
- 暖薄荷／奶油／珊瑚色；360px 到桌面響應式排版。
- 點按而非拖曳限定，原生按鈕可用鍵盤，焦點樣式、跳到內容連結、狀態播報、原生模態對話框。
- 支援 `prefers-reduced-motion`，示範用手動步進，不強迫等待動畫。
- localStorage 僅存完成站號，使用鍵 `forest-snack-progress-v1`；不可用時保留本次記憶體進度並提示，不阻止遊玩。
- 未加入聲音，避免以非必要功能犧牲操作及教學品質。

## 檔案

- `index.html`：靜態入口、指南與重設對話框。
- `style.css`：響應式介面、場景、餅乾、動態減量。
- `app.js`：首頁／地圖、事件、儲存、鍵盤焦點。
- `core.js`：關卡資料、數學、純狀態機與安全紀錄。
- `view.js`：自製動物 SVG 與工作臺渲染。
- `favicon.svg`：自製餅乾圖示。
- `tests/*.test.js`：單元與選用瀏覽器整合測試。
- `package.json`：測試快捷命令，沒有套件相依。

## 線上遊玩

GitHub Pages：https://powertalk1-glitch.github.io/forest-snack-lab/

原始碼：https://github.com/powertalk1-glitch/forest-snack-lab

使用 `main` 分支根目錄部署，修改後推送即可更新。

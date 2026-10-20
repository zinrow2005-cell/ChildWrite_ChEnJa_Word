# V1.33 臺灣繁體逐筆參考使用說明

國字五級現在均可載入從 AnimCJK `graphicsZhHant.txt` 解析取得的臺灣繁體逐筆圖形與中線資料。上游 graphics 圖形文字資料的再利用應保留來源與 Arphic Public License，專案隨附 `licenses/ARPHIC_PUBLIC_LICENSE.txt`；詳細上游授權仍以該專案實際檔案條款為準。

本版基礎 ZIP 不包括從外站抓取的真實 200 字逐筆資料。只有使用者成功匯入或 GitHub Actions 實際建置後，才會把可用逐筆資料放進網站。允許**部分來源覆蓋**，沒有來源的字不會聲稱有標準筆順。幾何檢查絕不代表教育部或人工逐字認證。

- AnimCJK: https://github.com/parsimonhi/animCJK
- 原始臺灣繁體來源: https://github.com/parsimonhi/animCJK/blob/master/graphicsZhHant.txt
- 教育部國字標準字體筆順學習網（僅供另行對照，不將官方素材直接改寫打包）: https://stroke-order.learningweb.moe.edu.tw/

---

V1.25 新增瀏覽器內匯入 graphicsZhHant.txt、結構檢查及完整離線網站封裝。原始筆畫依 AnimCJK 來源授權使用，保留原專案來源與 Arphic Public License。筆順資料不視為教育部官方認證。

# V1.21 筆順與授權說明

- 網站基礎包只內建日文「**あ**」的 3 筆 AnimCJK 衍生假名參考，其餘 91 字尚未打包。
- 主要整套來源：AnimCJK `graphicsJaKana.txt`，由官方 GitHub 原始檔讀取。其 `graphics` 字形文字檔依上游 COPYING.txt 可能適用 **Arphic Public License**。因此隨附 `licenses/ARPHIC_PUBLIC_LICENSE.txt` 並保留來源註記。
- 備援來源：`kana-svg-data` 的平假名及片假名 JSON，由 AnimCJK 假名 SVG 衍生，依上游標註的 **LGPL-3.0-or-later**；隨附 `licenses/LGPL-3.0.txt`。
- AnimCJK: https://github.com/parsimonhi/animCJK （FM&SH）
- kana-svg-data: https://github.com/hy2k/kana-svg-data （Yusuke Higuchi）
- AnimCJK 授權頁：https://github.com/parsimonhi/animCJK/blob/master/licenses/COPYING.txt
- 程式修改原始圖形資料的方式：針對 `graphicsJaKana.txt` 的 y 軸倒置、將原始筆畫多邊形轉換為 SVG path，`app.js` 有公開轉換函式 `parseGraphicsJaKana` / `mirrorKanaSvgPath`；針對 JSON 來源，依筆畫分段 ID 合併 `3a`、`3b`，保留可編輯路徑。
- 因原始圖形與版本來源可能有不同的筆畫分段，正式筆順請再依小朋友學校教材核對；**結構通過檢查不是官方或人工逐字認證**。
- 尚未下載的聲音可能需要網路，網站的日文離線筆順 ZIP 不代表真人發音可離線。

## V1.22 自動建置

此專案加入開放原始碼來源下載與轉換腳本 `scripts/build_offline.py`，腳本產生的檔案（`assets/kana-pack.js`）直接衍生自 AnimCJK 假名字形及中線資訊。若使用 `graphicsJaKana.txt`，依上游 COPYING.txt 保留 Arphic Public License；若使用 `kana-svg-data`，保留 LGPL-3.0-or-later。自動部署包含原本 `licenses/` 的完整授權文本及來源資訊。資料完整性檢查不代表官方筆順認證。


## 教育部《國語注音符號手冊》獨立可下載素材（V1.23）
- 原作者／提供機關：中華民國教育部（Ministry of Education, Taiwan）。
- 來源：https://language.moe.gov.tw/001/Upload/files/site_content/M0001/juyin/
- 下載：https://language.moe.gov.tw/001/Upload/files/site_content/M0001/juyin/bopomofo_materials_20170213.zip
- 授權：**Creative Commons Attribution 4.0 International (CC BY 4.0)**，適用於官網所明示獨立下載的注音動畫 XML、SVG 與音檔。
- 條款：https://creativecommons.org/licenses/by/4.0/
- 使用方式：僅在建置成功時把教育部原始 SVG 與音訊複製到 `assets/zhuyin-official/`；主頁另外展示教育部名稱、授權及來源網址。SVG 作為獨立筆順示範，不將舊版 AnimCJK 畫板路徑冒稱教育部官方筆順。
- **不是**整本手冊採用同一授權：官網說明整本手冊另有 CC BY-ND 3.0 TW 授權。


## V1.24 臺灣繁體國字逐筆參考（選配，自動建置產生）
- 來源：AnimCJK，`graphicsZhHant.txt`。https://github.com/parsimonhi/animCJK
- 授權：**Arphic Public License**（本專案附有 `licenses/ARPHIC_PUBLIC_LICENSE.txt`）。
- 自動建置只在完整驗證入門 40 個字的逐筆路徑後，才會將經過 y 座標轉換的向量資料寫入 `assets/hanzi-pack.js`，並產生 `OFFLINE_HANZI_BUILD_REPORT.json`。
- 路徑數量與有效性檢查屬**結構驗證**，不代表符合教育部國字標準字體筆順。教育部筆順動畫與筆順提示有另外的 CC BY-NC-ND 3.0 TW 條款，不在本應用重新繪製、改作或打包。
- 基礎 ZIP 的 `hanzi-pack.js` 為空物件，絕無假冒完整 40 字開源筆順的內容；舊版 40 字人工離線方向示意仍保留，並明示不是正式筆順。


### V1.28 固定國字 SVG 輪廓
新增的 40 個中等級國字使用 Noto Sans CJK TC 原始字形輪廓，依 SIL Open Font License 1.1 使用及保留授權註記。本封裝只有相應字元的 SVG path 指令，不包含任何字型二進位。


### V1.30 困難級固定字形
新增 40 個繁體國字 SVG 向量外框由 Noto Sans CJK TC 的字型輪廓生成，使用 SIL Open Font License 1.1；僅封裝每字輪廓 path，不含字型檔。這些圖形不是標準筆順，沒有使用官方筆順動畫改作。詳見 `OFL-Noto.txt`。


### V1.31 精深級固定字形
新增 40 個繁體國字的 SVG 輪廓來自 Noto Sans CJK TC，依 SIL Open Font License 1.1 整合，詳 `OFL-Noto.txt`。這些輪廓不含筆順資訊，並非官方筆畫動畫。


## V1.40 新增100字固定輪廓
- 字形由 Noto Sans CJK TC Regular 向量輪廓轉製，SIL Open Font License 1.1。
- 保留 OFL-Noto.txt 授權文字。ZIP 中沒有原始字型檔。
- 固定空心字形用於描寫，並非筆畫順序動畫。

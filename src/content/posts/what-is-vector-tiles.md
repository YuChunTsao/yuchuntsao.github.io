---
title: 什麼是向量圖磚?
date: '2024-10-03'
tags: ['Vector Tiles']
draft: true
---

TODO: 使用 protomaps 產生 vector tiles
TODO: 將 vector tiles 產生的 raster tiles 上傳至 custom-raster-tiles 上面

TODO: 將以下圖片，對應的 pmtiles 展示於地圖上，設定 zoom level, 呈現出 raster tile 在高解析度下的模糊問題
TODO: 將 vector tile 同時展示，並且設定相同 zoom level

<MaplibreGL isPMTiles={true} PMTILES_URL="/static/files/2024/what-is-vector-tiles/14_13724_7014.pmtiles"/>

![14/13724/7014](/static/images/2024/what-is-vector-tiles/7014.png)

將 tileserver-gl 的 raster tiles 下載下來儲存為 pmtiles

使用 tileserver-gl 下載對應的 z/x/y 圖磚，展示出 raster tile 於高解析度下的模糊問題

- raster tile 會在高解析度下模糊 (如果沒有產生對應的 zoom level 圖磚)
- raster tile 在旋轉時, label, symbol 不會正對著你
- vector tile 可以在客戶端進行即時的樣式修改, 更改語言
- vector tile 可以存取到 features, 可以開發更多的使用者互動
- vector tile 更小的儲存空間需求
- vector tile 可以平滑的縮放 (因為是使用 webgl 繪製, 依照比例視覺化)

---

<MaplibreGL />

向量圖磚，是將空間資料預先處理成一個一個近似於矩形的「圖磚」，相較於網格圖磚
(raster tiles)，向量圖磚是從伺服器回傳向量資料，而不是一張預先渲染好的地圖圖片。

---

向量圖磚優缺點

- 更小的硬碟儲存空間
- 平滑的縮放
- 動態的客製化文字、樣式
- 更快的產生速度

---

地圖是一種傳遞資訊的工具，不論是過去的紙本地圖，或是現在的數位地圖，都是為了讓使用者從中獲取空間資訊, 然而我們若是一次性的將所有資訊都放置於地圖上，可能會讓地圖變得過於複雜，而使用者無法從中獲取所需的資訊。因此適度的簡化(Simplify)以及概括化(Generalization)地圖資訊，是地圖設計的重要一環。

在網路地圖服務中的「圖磚」，就是將地圖分割成一個一個的小方塊，並當我們縮放地圖時，會根據縮放層級來載入不同的圖磚，在不同層級的圖磚中，使用者可以看到不同的地理資訊，這樣可以讓地圖更加簡潔，並且可以讓使用者更容易地獲取所需的資訊。

在過去，地圖服務中使用的是「影像圖磚 (raster tile)」，這是一種將空間資料預先製作成一張一張的圖片，並將其儲存到伺服器中，當使用者瀏覽地圖時，會從伺服器中載入圖片，並且在客戶端進行繪製。
不過網格圖磚存在了一些缺點，例如在不同縮放層級下，需要儲存大量的圖片，這樣會佔用大量的空間，並且在瀏覽地圖時，需要不斷地從伺服器中載入圖片，這樣會增加網路的負擔，並且會影響地圖的繪製速度。
又或者是因為這些地圖圖片是預先製作好的，當我們旋轉地圖時，地圖上的標籤可能會不正確，這樣會影響使用者的使用體驗。
又或者我們需要不同語言的地圖，這樣就需要製作不同語言的地圖圖片，這樣會增加地圖製作的成本。

而「向量圖磚 (vector tile)」則是將空間資料以向量格式儲存於一個一個的圖磚中，向量圖磚可以在客戶端進行即時的樣式修改，這樣可以讓我們更容易地進行地圖的設計，並且可以更快地進行地圖的繪製。

TODO: compare vector tiles and raster tiles in high zoom level
TODO: rotate map to show the label is not facing to you
TODO: different languages map

## 比較圖表

---

向量圖磚早在 2010 年 12 月，Google Maps Android 用戶端就已經開始使用，

---

demos:

- Rotation (label)
- Styling
- Different languages

---

向量圖磚最早是由 Mapbox 所提出，他是一種儲存地理資訊的格式，相比於影像圖磚，向量圖磚可以更有效率地儲存地理資訊，並且可以在客戶端進行即時的樣式修改。

向量資料是由一個個的點、線、面所組成，這些資料可以透過 GeoJSON、MVT、PBF 等格式來儲存，而向量圖磚則是將這些向量資料切割成一個個的圖磚，這些圖磚可以透過網路傳輸到客戶端，並且在客戶端進行解碼，最後透過 WebGL 進行繪製。

向量圖磚將向量資料以 Protocol Buffers 格式進行壓縮，這樣可以減少傳輸的大小，並且可以更快地解碼。而影像圖磚則是將地理資訊以圖片的方式進行儲存，這樣可以減少解碼的時間，但是在傳輸的過程中會比較佔用頻寬。

在使用向量圖磚時，我們可以透過 Mapbox GL JS、Maplibre GL JS 等地圖庫來進行繪製，並且可以透過 Mapbox Style Specification 來設定樣式。在設定樣式時，我們可以透過 CSS 的方式來設定樣式，這樣可以更容易地進行樣式的修改。

總結來說，向量圖磚是一種儲存地理資訊的格式，相比於影像圖磚，向量圖磚可以更有效率地儲存地理資訊，並且可以在客戶端進行即時的樣式修改。這樣可以讓我們更容易地進行地圖的設計，並且可以更快地進行地圖的繪製。

---

向量圖磚是將空間資料預先處理成一個一個的圖磚
`tiles`，這些圖磚的大小及範圍都是預先被定應好的，相比於 raster tiles，伺服器端是回傳依照範圍切割的向量資料，而不是一張預先渲染好的地圖圖片

相比於未圖磚化的向量資料，向量圖磚可以降低資料傳輸量，因為僅有當前視窗內的資料，以及當前縮放層級的資料需要被傳輸。GIS 的裁剪操作可以提前進行，因為圖磚的邊界是預先定義好的。這意味著向量資料可以被打包並分發，而不需要任何 GIS 系統來提供資料。

相比於瓦片化的影像地圖，向量圖磚也大大降低了資料傳輸量，因為向量資料通常比渲染的位圖要小得多。此外，樣式可以在後續的過程中應用，甚至可以在瀏覽器中進行，這樣可以更靈活地呈現資料。與地圖功能互動也變得容易，因為它們的向量表示已經存在於客戶端中。另一個好處是需要更少的集中式伺服器處理能力，因為光柵化可以直接在客戶端進行。這被描述為使「渲染...成為一個最後一哩問題，每個人的口袋中都有快速、高質量的 GPU」。

2015 年初，還沒有一個主導的向量圖磚標準。不同的方法在 URL 格式、數據序列化格式、樣式信息的打包以及對 Web Mercator 以外的投影的支持方面可能有所不同。

Mapbox 定義了一個名為「vector-tile-spec」的向量地圖磚的開放標準，該標準使用 Google protocol buffers 進行高效的數據序列化。Web Mercator 是參考投影，但向量圖磚可以用於表示任何投影和瓦片範圍方案的數據。它也與 Mapnik 渲染引擎相關聯，使用 Mapnik 使用的內部數據的「序列化版本」。

In March 2015, Esri, the dominant geospatial software maker, announced that they would be supporting Mapbox's vector tiles standard in both server and client platforms.[9]

在 2015 年 3 月，主導地理空間軟件製造商 Esri 宣布他們將在服務器和客戶端平台上支持 Mapbox 的向量圖磚標準。

Services and applications
Vector tiles have been used by the Google Maps Android client since December 2010[11] and on the desktop client since 2013.[12] Vector tiles for rendering OpenStreetMap data were first proposed in March 2013[1] and are supported by Mapnik,[13] the most widely used renderer of OpenStreetMap data. Mapbox, a commercial provider of custom cartography tools and hosting, has focused its cartography tool, Mapbox Studio, around vector tiles.[14]

The popular, and very powerful, Android client for OpenStreetMap data, osmAnd supports vector tiles, which it calls "vector maps".[15]

向量圖磚於 Google Maps Android 用戶端自 2010 年 12 月開始使用，並於 2013 年開始在桌面用戶端上使用。用於渲染 OpenStreetMap 數據的向量圖磚首次於 2013 年 3 月提出，並得到了 OpenStreetMap 數據最廣泛使用的渲染器 Mapnik 的支持。商業提供商 Mapbox 提供定製地圖製作工具和主機，並將其地圖製作工具 Mapbox Studio 圍繞向量圖磚進行了重點設計。

The tile server pipeline TileStache supports several flavours of JSON natively.[16] There is also a plugin vector tile provider called VecTiles[17] which converts PostGIS data into vector tiles in Mapnik Vector Tile format (incompatible with the Mapbox specification[18]) or TopoJSON.

PGRestAPI (also known as Chubbs Spatial Server) is a standalone NodeJS server which can also generate vector tiles on the fly from a PostGIS data source, as well as serving pre-generated vector tiles from sources such as Mapbox Studio.[19]

pg_tileserv is an open source PostGIS-only tile server written in Golang that takes in HTTP tile requests and form and executes SQL. [20]

ESRI ArcGIS Server 10.4[21] and ArcGIS Pro 1.2[22] released in February 2016 added support for vector tiles.

TileStache 瓦片服務器管道原生支持幾種 JSON 變體。還有一個名為 VecTiles 的插件向量圖磚提供程序，它將 PostGIS 數據轉換為 Mapnik 向量圖磚格式的向量圖磚（與 Mapbox 規範不兼容）或 TopoJSON。

PGRestAPI（也稱為 Chubbs 空間服務器）是一個獨立的 NodeJS 服務器，它可以從 PostGIS 數據源動態生成向量圖磚，並從 Mapbox Studio 等源提供預生成的向量圖磚。

pg_tileserv 是一個用 Golang 編寫的開源 PostGIS 專用瓦片服務器，它接收 HTTP 瓦片請求和表單並執行 SQL。

2016 年 2 月發布的 ESRI ArcGIS Server 10.4 和 ArcGIS Pro 1.2 添加了對向量圖磚的支持。

## References

- [wikipedia - Vector tiles](https://en.wikipedia.org/wiki/Vector_tiles)
- [Vector tiles introduction](https://docs.mapbox.com/data/tilesets/guides/vector-tiles-introduction/)
- [Everything You Wanted to Know About Vector Tiles (But Were Afraid to Ask)](https://www.openstreetmap.org/user/daniel-j-h/diary/404061)
- [Under the hood of Google Maps 5.0 for Android](https://googlemobile.blogspot.com/2010/12/under-hood-of-google-maps-50-for.html)

---

地圖旋轉後，label 不會正對著你
不同語言的地圖，需要個別產生，wikipedia 產生了兩百多種語言的地圖
raster tile zoom level 20 下，需要極大的空間來儲存
raster tile 只能縮放到整數的 zoom level (Math.round)
vector tile 讓 label 不再會被幾何遮擋 (因為可以動態調整 label 的位置)
vector tile 可以快速的切換白天、夜晚模式
vector tile 離線使用，可減少使用者所需要儲存的檔案大小, 讓使用者可以快取更大範圍的地圖資料
離線導航功能

---

為什麼要使用向量圖磚？

主要有兩個原因，向量圖磚可能對你的實現有用：

- 效率，特別是對於大型數據集
- 更流暢的用戶交互動畫

向量圖磚可以無限縮放，允許用戶在地圖上放大和縮小而無需渲染新的圖像集，並在用戶漫遊地圖時冒著地圖保真度的風險。

這使得動畫更流暢，加載時間更快，因為你的地圖使用的是更輕量級的數據。樣式是直接計算並渲染到您的瀏覽器中，而不是存儲和渲染圖像，這使您可以在實現中使用和存儲更少的數據。

例如，向量圖磚將存儲數據點而不是大型圖像文件，這使您可以使用類似的環境而不使用昂貴的策略。

為什麼不使用向量圖磚？

如果您需要逼真的地圖，例如展示衛星數據或渲染特定圖像而不是計算路線和地圖，我們建議您使用光柵圖像而不是向量圖磚。

---

向量圖磚的歷史

Google 先使用，但是 Mapbox 釋出 vector tile spec，並且使用 Google Protocol Buffers 進行高效的數據序列化

後來 OpenStreetMap 也開始使用向量圖磚，並且 Mapnik 也支援向量圖磚, ESRI ArcGIS Server 10.4 和 ArcGIS Pro 1.2 也支援向量圖磚

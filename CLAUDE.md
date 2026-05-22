# CLAUDE.md - Three Kingdoms Map

## ⚠️ 最重要規則

**Git commit 訊息絕對不可包含 `Co-Authored-By: Claude` 或任何 AI 署名資訊。** 只寫功能描述，不附加任何尾行。

## 專案概述

**Three Kingdoms Map** 是一個互動式歷史地理應用，類似 [cap-map](https://github.com/raybird/cap-map)，但專注於三國時期（184-280 年）的歷史事件。透過將歷史時間軸與地理空間深度結合，幫助使用者建立跨區域史觀。

## 參考架構

詳細 Angular/NgRx 架構請參考：[cap-map CLAUDE.md](https://github.com/raybird/cap-map/blob/main/CLAUDE.md)

## 技術對應

| cap-map | Three Kingdoms Map |
|---------|-------------------|
| Taiwan History Events | Three Kingdoms Events |
| 8 Periods (臺灣史分期) | 4 Periods (三國分期) |
| 106 events | 100+ events (target) |
| 會考重要性標籤 | 正史/演義對照標籤 |
| 七上・七下... (國中教科書) | 魏/蜀/吳陣營標籤 |

## 事件資料格式

```json
{
  "id": "lk-001",
  "title": "洛陽會盟",
  "description": "三國初期曹操與袁紹等諸侯在洛陽會盟討伐董卓",
  "date": {
    "start": -190,
    "end": -190,
    "era": "東漢末年",
    "periodId": "turbulent-times"
  },
  "location": {
    "name": "洛陽",
    "coordinates": [34.75, 112.45],
    "adminDivisions": ["司隸校尉部", "河南尹"]
  },
  "factions": ["曹操", "袁紹"],
  "categories": ["軍事", "政治"],
  "keywords": ["曹操", "袁紹", "董卓", "會盟", "關東諸侯"],
  "relatedEvents": ["lk-002"],
  "sourceType": "正史",
  "examRelevance": "高"
}
```

## 分期定義

| ID | 名稱 | 年代 | 顏色 |
|-----|------|------|------|
| huangjin-luanshi | 黃巾之亂與軍閥崛起 | 184-220 | #8B0000 |
| turbulent-times | 群雄逐鹿 | 190-220 | #CD5C5C |
| three-kingdoms | 三國鼎立 | 220-280 | #4169E1 |
| jin-unification | 晉統一 | 280-420 | #2E8B57 |

## NgRx State（三個 slices）

| Slice | Key State | Purpose |
|-------|-----------|---------|
| `event` | `events[]`, `selectedEventId` | 主事件列表，追踪選中事件 |
| `map` | `events[]`, `selectedEventId`, `activeLayers[]` | 地圖顯示的篩選視圖 |
| `timeline` | `periods[]`, `currentPeriodId` | 分期定義，驱动事件篩選 |

**關鍵資料流**：`TimelineComponent` 訂閱 `selectEvents` 和 `selectCurrentPeriodId`，透過 `combineLatest` 過濾主事件列表，然後 dispatch `MapActions.setMapEvents`。

## 元件結構

- **`AppComponent`** — 根容器
- **`MapContainerComponent`** — Leaflet 地圖，渲染標記
- **`TimelineComponent`** — 橫向時間軸，-5000 至 2025（px/年）
- **`EventSidebarComponent`** — 事件詳情與測驗
- **`SearchBarComponent`** — Fuse.js 模糊搜尋
- **`LayerControlComponent`** — 圖層切換面板

## 重要約定

- **所有元件使用 `standalone: false`**（NgModule pattern）
- 事件選取需同時 dispatch 兩個 action：`EventActions.selectEvent` 和 `MapActions.selectEvent`
- 地圖座標格式：`[lat, lng]`（非 GeoJSON 的 `[lng, lat]`）
- 時間軸年份位置：`pixelX = (year - minYear) * pixelsPerYear`
- **Commit 訊息**：絕對不添加 `Co-Authored-By: Claude`

## 開發命令

```bash
cd webapp
npm install
npm start          # 開發伺服器 http://localhost:4200
npm run build      # 生產建置（輸出至 dist/）
npm test           # 單元測試（Karma + Jasmine）
npm run test:data  # 驗證事件資料完整性
```

## 自動排程

本專案設定了 GitHub Actions 排程工作流（`.github/workflows/autonomous-dev.yml`）：
- **執行頻率**：每週三、六凌晨 2:00
- **職責**：研究、規劃、開發、產出進度報告
- **手動觸發**：可透過 GitHub Actions 頁面以不同強度（light/medium/heavy）手動觸發
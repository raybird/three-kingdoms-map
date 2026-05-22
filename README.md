# 三國地圖 (Three Kingdoms Map)

> **"論天下大事，分久必合，合久必分。"**

專為三國歷史愛好者設計的互動式時空地圖，結合歷史時間軸與地理空間，呈現三國時期的重要事件與人物。

## 專案狀態

建構中（Skeleton）— v26.0523.0630

---

## 開發藍圖

### Phase 1 - 基礎架構 ✅
- [x] 專案初始化與 GitHub Repo 建立
- [x] Autonomous Dev Workflow 排程設定
- [ ] Angular 框架搭建
- [ ] NgRx 狀態管理設定
- [ ] Leaflet 地圖整合

### Phase 2 - 核心功能
- [ ] 事件資料庫建立（目標 100+ 事件）
- [ ] 時間軸元件開發
- [ ] 地圖標記與彈出視窗
- [ ] 事件詳情側邊欄

### Phase 3 - 進階功能
- [ ] 自動解題測驗
- [ ] 模糊搜尋（Fuse.js）
- [ ] 圖層篩選
- [ ] CI/CD 部署至 GitHub Pages

## 技術棧

| 層面 | 技術 |
|------|------|
| 前端框架 | Angular 20 (NgModule pattern) |
| 狀態管理 | NgRx Store 20 |
| 地圖引擎 | Leaflet + @types/leaflet |
| 搜尋引擎 | Fuse.js |
| 部署 | GitHub Actions → GitHub Pages |

## 資料範圍

- **時間跨度**：東漢末年（184年）至晉朝統一（280年）
- **目標事件數**：100+ 筆
- **地理範圍**：涵蓋魏、蜀、吳三國疆域

## 分期定義

| ID | 名稱 | 年代 | 顏色 |
|-----|------|------|------|
| huangjin-luanshi | 黃巾之亂與軍閥崛起 | 184-220 | #8B0000 |
| turbulent-times | 群雄逐鹿 | 190-220 | #CD5C5C |
| three-kingdoms | 三國鼎立 | 220-280 | #4169E1 |
| jin-unification | 晉統一 | 280-420 | #2E8B57 |

## 快速開始

```bash
git clone https://github.com/raybird/three-kingdoms-map.git
cd three-kingdoms-map/webapp
npm install
npm start        # 開發伺服器 http://localhost:4200
npm run build    # 生產建置
```

## 線上預覽

建造中...

---

*TeleNexus Studio | Raybird*
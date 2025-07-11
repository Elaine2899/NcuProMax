# frontend

## 第一次使用步驟

### 1. 安裝依賴套件

```sh
npm install
```

### 2. 抓取課程資料

```sh
npm run get
```

## 開發相關指令

### Vue 開發伺服器（熱更新）

```sh
npm run dev
```

### 編譯生產版本

```sh
npm run build
```

## 注意事項

- 第一次使用必須先執行 `npm install`
- 抓取課程資料使用 `npm run get`
- 不需要執行 `npm run build`（除非要部署網站）

===

## 專案架構

frontend/
├── src/ # 原始程式碼
│ ├── Courses/ # 課程爬蟲模組
│ │ └── getCourses.js # 課程爬蟲
│ └── core/ # 核心功能
│ └── getCourse.js # 主要執行檔案
├── data/ # 輸出資料目錄
│ ├── courses.json # 所有課程資料
│ ├── courses_by_college.json # 按學院分類的課程資料
│ └── colleges.json # 學院和科系基本資料
├── package.json # 專案配置和依賴
├── .gitattributes # Git 行尾符號設定
└── README.md # 專案說明文件

### 🎨 **前端開發相關**

- `src/components/`: 可重複使用的 Vue 組件
- `src/views/`: 頁面級組件
- `src/assets/`: CSS、圖片等靜態資源
- `src/router/`: Vue Router 路由配置
- `public/`: 不需要編譯的靜態檔案

#### 只有這些情況才需要 useRouter：

- 按鈕點擊後跳轉
- 表單提交後跳轉
- 條件判斷後跳轉（如登入驗證）
- 定時跳轉
- 任何需要用 JavaScript 控制的跳轉

#### 不需要的情況：

- 純展示頁面
- 使用 <router-link> 的頁面
- 沒有跳轉邏輯的頁面

### 資源怎麼決定放哪

public/
├── favicon.ico
├── logo.png # 網站主 Logo
├── images/
│ ├── backgrounds/
│ │ ├── login-bg.jpg # 登入頁背景
│ │ └── home-bg.jpg # 首頁背景
│ ├── courses/ # 課程相關圖片
│ │ ├── default-course.png
│ │ └── ncu-building.jpg
│ └── users/ # 用戶相關圖片
│ └── default-avatar.png
└── icons/
├── menu.svg
├── search.svg
└── course.svg

src/assets/
├── logo.svg # 組件用的小 Logo
└── icons/
├── arrow.svg # UI 小圖標
└── close.svg

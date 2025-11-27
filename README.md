# 🎰 推銀仔遊戲 | 3D Coin Pusher Casino

一個使用 **Three.js + Cannon-es** 物理引擎的 3D 推銀仔遊戲，結合 Casino 老虎機元素，專為手機優化。

![Casino Style](https://img.shields.io/badge/Style-Casino-ff0080?style=for-the-badge)
![Mobile First](https://img.shields.io/badge/Mobile-First-00ff88?style=for-the-badge)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-ffd700?style=for-the-badge)

## 🚀 即時遊玩

### 線上版（Netlify 部署後）
👉 **[點此遊玩](#)** 👈

---

## ✨ 功能特點

### 🎮 遊戲系統
- 🎰 **老虎機系統**：30% 中獲機率
- 🪙 **真實物理**：Cannon-es 引擎模擬真實銀仔碰撞
- 📦 **雙層推板**：上層較窄（紫色）、下層較寬，持續移動
- 🏆 **獎勱系統**：中獲時掉落 20-50 個銀仔
- ♻️ **無限遊玩**：無限銀仔，盡情享受

### 🎨 視覺設計
- 🌈 **Casino 風格**：鮮艷的游戲色彩（金、紫、橙、粉）
- ✨ **3D 渲染**：Three.js 高品質圖形
- 💡 **動態燈光**：彩色燈光與陰影效果
- 🌟 **金屬質感**：銀仔金屬反光效果

### 📱 手機優化
- 👍 **觸控優先**：大按鈕、流暢操作
- 📱 **響應式**：自動適應不同螢幕尺寸
- 🔄 **橫直支援**：橫屏、直屏均完美顯示
- ⚡ **效能優化**：物理休眠、物件清理

### 📦 PWA 功能
- 📲 **可安裝**：加入手機主畫面
- 🚫 **離線支援**：Service Worker 快取
- 🚀 **快速載入**：優化資源加載

---

## 🎯 遊戲規則

1. 👆 **點擊「投幣」按鈕**
   - 銀仔從上層推板最後方掉落（隨機左右偏移）
   - 同時觸發老虎機旋轉

2. 🎰 **老虎機中獲**
   - 3 個相同符號 = 中獲！
   - 獲獎金額：
     - 7️⃣ 7️⃣ 7️⃣ = 50 銀仔
     - 💎 💎 💎 = 40 銀仔
     - ⭐ ⭐ ⭐ = 30 銀仔
     - 🍉 🍉 🍉 = 25 銀仔
     - 🍊 🍊 🍊 = 20 銀仔
     - 🍋 🍋 🍋 = 20 銀仔
     - 🍒 🍒 🍒 = 20 銀仔

3. 📦 **推板移動**
   - 上層與下層推板持續來回移動
   - 銀仔被推到前端掉落 = 得分！

4. 🏆 **計分**
   - 每個掉落的銀仔 = 1 分
   - 無限遊玩，挑戰高分！

---

## 🛠️ 技術架構

```
│ 前端
├─ Three.js (0.160.0)      # 3D 圖形渲染引擎
├─ Cannon-es (0.20.0)     # 物理引擎
├─ HTML5 / CSS3          # 跨平台結構與樣式
└─ ES6 Modules           # 現代 JavaScript

│ PWA
├─ Service Worker        # 離線支援
├─ Web App Manifest      # 安裝配置
└─ Cache API             # 資源快取

│ 部署
└─ Netlify               # 自動化 CI/CD + HTTPS
```

---

## 🚀 部署指南

### 方法 1：Netlify （建議）

1. **登入 Netlify**
   - 前往 [netlify.com](https://netlify.com)
   - 使用 GitHub 帳號登入

2. **匯入儲存庫**
   - 點擊 **Add new site** → **Import an existing project**
   - 選擇 **GitHub**
   - 授權並選擇 `coin-pusher-game` 儲存庫

3. **設定部署**
   - **Branch to deploy**: `main`
   - **Build command**: (留空)
   - **Publish directory**: (留空或 `/`)
   - 點擊 **Deploy site**

4. **完成！**
   - 等待 30-60 秒部署完成
   - 獲得免費的 `.netlify.app` 網址
   - 可自訂網域名稱

### 方法 2：GitHub Pages

1. **開啟 GitHub Pages**
   - 前往儲存庫 **Settings**
   - 選擇 **Pages**
   - **Source**: Deploy from a branch
   - **Branch**: `main` / `root`
   - **Save**

2. **等待部署**
   - 約 1-2 分鐘
   - 網址：`https://monicawwy.github.io/coin-pusher-game/`

---

## 📱 安裝 PWA 到手機

### iOS (Safari)
1. 在 Safari 中開啟遊戲網址
2. 點擊 **分享** 按鈕 📤
3. 滾動選擇 **加入主畫面**
4. 點擊 **加入**
5. ✅ 完成！在主畫面找到圖示

### Android (Chrome)
1. 在 Chrome 中開啟遊戲網址
2. 點擊右上角 **選單** ⋮
3. 選擇 **安裝應用程式** / **加入主畫面**
4. 點擊 **安裝**
5. ✅ 完成！像原生 App 一樣使用

---

## 📝 檔案結構

```
coin-pusher-game/
├── index.html           # 主 HTML 檔案
├── style.css            # 樣式表（Casino 風格）
├── game.js              # 遊戲主程式 (Three.js + Cannon-es)
├── manifest.json        # PWA 配置
├── sw.js                # Service Worker
├── sw-register.js       # Service Worker 註冊
├── netlify.toml         # Netlify 部署配置
├── .gitignore
└── README.md
```

---

## ⚙️ 自訂設定

### 修改遊戲參數

在 `game.js` 中修改 `config` 物件：

```javascript
const config = {
    // 老虎機符號
    symbols: ['🍒', '🍋', '🍊', '🍉', '⭐', '💎', '7️⃣'],
    
    // 中獲機率 (0-1)
    winChance: 0.3,  // 30%
    
    // 各符號獎勵銀仔數
    coinRewards: {
        '7️⃣': 50,
        '💎': 40,
        '⭐': 30,
        // ...
    },
    
    // 物理參數
    physics: {
        gravity: -30,           // 重力
        coinRadius: 0.15,       // 銀仔半徑
        coinHeight: 0.08,       // 銀仔厚度
        coinMass: 0.5,          // 銀仔質量
        restitution: 0.3,       // 彈性
        friction: 0.4           // 摩擦力
    }
};
```

### 調整推板速度

在 `createPushers()` 函數中：

```javascript
pusherTop = {
    // ...
    speed: 0.02,        // 速度（越大越快）
    maxDistance: 1.2    // 移動距離
};
```

---

## 🐛 已知問題 & 解決

### 問題 1：手機上卡頓
**解決**：
- 減少初始銀仔數量（`fillInitialCoins`）
- 降低獎勵銀仔數（`coinRewards`）
- 使用 `InstancedMesh` 優化（進階）

### 問題 2：銀仔穿模（Tunneling）
**解決**：
```javascript
// 在 initPhysics() 中加入
 world.solver.iterations = 10;  // 增加計算精度
```

### 問題 3：iOS Safari 無法播放音效
**解決**：需要使用者互動後才能播放（已在代碼中處理）

---

## 🔮 未來規劃

- [ ] 🎵 加入真實背景音樂與音效
- [ ] 🎮 多人排行榜系統
- [ ] 🎁 每日簽到獎勵
- [ ] 🏵️ 多主題面板解鎖
- [ ] 💥 特殊道具（震動、加速等）
- [ ] 🌎 多語言支援 (EN/ZH)
- [ ] 📊 遊戲統計分析

---

## 💬 問題回報

如果遇到任何問題，請在 [GitHub Issues](https://github.com/monicawwy/coin-pusher-game/issues) 提出。

---

## 📜 授權

MIT License - 自由使用、修改、分發

---

## ❤️ 感謝

如果你喜歡這個遊戲，請給個 Star ⭐！

---

<div align="center">

**🎰 Enjoy the Game! 🎰**

由 [Monica](https://github.com/monicawwy) 使用 Three.js & Cannon-es 開發

</div>
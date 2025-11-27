# Icons Folder

## 生成 PWA 圖示

由於 GitHub 無法直接上傳二進位檔案，請使用以下方法生成圖示：

### 方法 1：線上生成器（最簡單）

1. 前往 [Favicon Generator](https://favicon.io/favicon-generator/)
2. 設定：
   - Text: 🎰 或 🪙
   - Background: Radial Gradient
   - Font: Arial Black
   - Colors: #FFD700 (gold) background
3. 下載並重命名：
   - `android-chrome-192x192.png` → `icon-192.png`
   - `android-chrome-512x512.png` → `icon-512.png`
4. 上傳到這個 `icons/` 資料夾

### 方法 2：使用 Figma/Canva

創建 512x512px 的正方形圖案：
- 背景：金色游層 (#FFD700)
- 圖示：🎰 或 🪙 emoji
- 輸出 PNG

### 方法 3：使用 Python 生成

```python
from PIL import Image, ImageDraw, ImageFont

# Create 512x512 image
img = Image.new('RGB', (512, 512), color='#FFD700')
draw = ImageDraw.Draw(img)

# Add emoji text
font = ImageFont.truetype('Arial.ttf', 300)
draw.text((256, 256), '🎰', font=font, anchor='mm', fill='white')

img.save('icon-512.png')

# Resize for 192x192
img_small = img.resize((192, 192), Image.LANCZOS)
img_small.save('icon-192.png')
```

### 檔案清單

必需檔案：
- [ ] `icon-192.png` (192x192px)
- [ ] `icon-512.png` (512x512px)
- [ ] `screenshot.png` (540x720px, optional)

---

**注意**：如果沒有圖示，PWA 仍然可以運行，但安裝時會顯示預設圖示。
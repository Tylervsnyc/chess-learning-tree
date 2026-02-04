# Chess Path Brand Assets

## Logo Package Contents

### Icons (Queen shape - 22 colorful dots)
- `icon-96.svg` - Full size icon (96×96px) - Use for app icons, social media
- `icon-48.svg` - Medium icon (48×48px) - Use for navigation, smaller displays
- `icon-32-favicon.svg` - Small icon (32×32px) - Use for favicons

### Horizontal Lockups
- `logo-horizontal-dark.svg` - For dark backgrounds (520×120px)
- `logo-horizontal-light.svg` - For light backgrounds (520×120px)

### Stacked Lockups
- `logo-stacked-dark.svg` - For dark backgrounds, icon above text (200×240px)
- `logo-stacked-light.svg` - For light backgrounds, icon above text (200×240px)

---

## Brand Specifications

### Icon Structure (Queen Shape)
- **Grid**: 5 columns × 6 rows
- **Squares**: 14px with 4px gap (18px step) in horizontal logo
- **Corner radius**: 2px (rx=2)
- **22 total dots** forming a stylized chess queen

### Icon Colors
| Row | Dots | Colors |
|-----|------|--------|
| 0 (Crown points) | 3 | Blue, Cyan, Purple |
| 1 (Crown rim) | 5 | Green, Yellow, Orange, Coral, Red |
| 2 (Head) | 3 | Blue, Cyan, Purple |
| 3 (Neck) | 3 | Green, Yellow, Orange |
| 4 (Body) | 3 | Coral, Red, Blue |
| 5 (Base) | 5 | Cyan, Purple, Green, Yellow, Orange |

### Color Palette
| Name | Hex | Usage |
|------|-----|-------|
| Blue | #1CB0F6 | Crown, head, body, gradient end |
| Cyan | #2FCBEF | Crown, head, base |
| Purple | #A560E8 | Crown, head, base |
| Green | #58CC02 | Crown rim, neck, base |
| Yellow | #FFC800 | Crown rim, neck, base, gradient start |
| Orange | #FF9600 | Crown rim, neck, base |
| Coral | #FF6B6B | Crown rim, body, gradient middle |
| Red | #FF4B4B | Crown rim, body |

### Typography
- **Font**: DM Sans (fallback: Inter, system-ui)
- **Weight**: 700 (Bold)
- **"chess"**: White (#FFFFFF) on dark, Slate (#0F172A) on light
- **"path"**: Gradient (Yellow → Coral → Blue)

### Gradient Specifications
**"path" text gradient:**
```
0%   → #FFC800 (yellow)
55%  → #FFC800 (yellow)
75%  → #FF6B6B (coral)
100% → #1CB0F6 (blue)
```

### Spacing
- Gap between icon and wordmark: 16px (horizontal)
- Gap between icon and text: 24px (stacked)

---

## Background Colors

| Mode | Hex | Usage |
|------|-----|-------|
| Dark | #0F172A | slate-900, brand spec dark bg |
| App Dark | #131F24 | App primary background |
| Light | #F8FAFC | slate-50, light backgrounds |

---

## Usage Guidelines

1. **Minimum size**: Don't use the icon smaller than 24px
2. **Clear space**: Maintain padding equal to 1 square around the logo
3. **Don't**: Rotate, skew, change colors, or add effects to the logo
4. **Do**: Use the appropriate dark/light version for your background

---

## File Formats

All files are SVG (scalable vector graphics). For other formats:
- Export to PNG at 2x or 3x for retina displays
- Use icon-32-favicon.svg to generate .ico files

---

chesspath.app

# Community listing assets

| File | Use | Size |
|---|---|---|
| `icon.png` | Plugin icon | 512×512 (Figma scales down) |
| `thumbnail.png` | Cover / listing thumbnail | 1920×960 |
| `carousel-1-sync.png` | Carousel slide 1 | 1600×900 |
| `carousel-2-audit.png` | Carousel slide 2 | 1600×900 |
| `carousel-3-kit.png` | Carousel slide 3 | 1600×900 |

SVG sources sit next to the PNGs — edit SVG and re-run:

```bash
cd design-kit/plugin/assets
for f in icon thumbnail carousel-1-sync carousel-2-audit carousel-3-kit; do
  convert -background none "$f.svg" "$f.png"
done
```

## Suggested carousel order

1. **Sync Variables** — tokens → Local Variables  
2. **Audit catalog** — 49/49 coverage  
3. **Full kit / patterns** — product-ready components  

## Copy next to images (optional captions)

1. “Sync design-kit tokens into Figma Variables”  
2. “Audit every component against the Powers catalog”  
3. “Ship patterns with the full UI kit”  

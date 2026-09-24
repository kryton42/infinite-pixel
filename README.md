# !nfinite Pixel site

Simple landing page for three equal apps.

## Preview

```bash
python3 -m http.server 4173
```

Open [http://localhost:4173](http://localhost:4173).

## Updating prices

Edit **`prices.json`** — that’s the only file you need for Bit Q Pro and DitCopy prices.

You can edit it either way:

1. **On GitHub (easiest)**  
   Open [prices.json](https://github.com/kryton42/infinite-pixel/blob/main/prices.json) → pencil icon → change the amounts → **Commit changes**.  
   GitHub Pages will update the live site in a minute or two.

2. **On your Mac**  
   Edit `prices.json` in Cursor, then commit and push.

### Example

```json
{
  "bitq": {
    "label": "$19",
    "note": "one-time",
    "button": "Buy Bit Q Pro — $19"
  },
  "ditcopy": {
    "label": "$14.99",
    "note": "one-time",
    "badge": "$14.99 one-time"
  },
  "timebridge": {
    "label": "Free",
    "note": "· In‑App Purchases",
    "badge": "Free · In‑App Purchases"
  }
}
```

Time Bridge stays **Free · In‑App Purchases** (no Pro dollar amount to track).

## Apps

- Bit Q Pro — Gumroad (price in `prices.json`)
- DitCopy — Mac App Store (price in `prices.json`)
- Time Bridge — Free with In‑App Purchases

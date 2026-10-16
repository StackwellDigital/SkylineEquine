# Skyline Equine demo shop

Static demo of a redesigned skylineequine.com with a working Bucas cart and mock checkout.
Built by Stackwell Digital. No build step, no backend. Products and prices come from skylineequine.com.

## Files
- `index.html` chooser page linking the options
- `option-1/`, `option-2/`, `option-3/` three layout directions (Lookbook, Catalogue Pro, Rug Finder)
- `original/` first single-file draft
- `shared/` data.js (products and options), shop.js (filters, cart, checkout), shop.css
- `images/` product photos (`<product id>.jpg`) and `logo.png`
- `images.tsv` product id to Wix media file map
- `scripts/fetch-images.sh` re-downloads the photos into `images/`

## Deploy on Cloudflare Pages
1. Cloudflare dashboard, Workers & Pages, Create, Pages, Connect to Git, pick this repo.
2. Framework preset: None. Build command: leave empty. Build output directory: `/`.
3. Save and deploy. Every push to `main` redeploys.

## Demo only
Orders are not real and nothing is charged. Shipping figures in checkout are demo estimates.

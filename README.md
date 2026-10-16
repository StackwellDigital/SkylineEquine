# Skyline Equine demo shop

Static demo of a redesigned skylineequine.com with a working Bucas cart and mock checkout.
Built by Stackwell Digital. No build step, no backend. Products and prices come from skylineequine.com.

## Files
- `index.html` the whole site (HTML, CSS, JS)
- `images/` product photos, one `<product id>.jpg` each
- `images.tsv` product id to Wix media file map
- `scripts/fetch-images.sh` re-downloads the photos into `images/`

## Deploy on Cloudflare Pages
1. Cloudflare dashboard, Workers & Pages, Create, Pages, Connect to Git, pick this repo.
2. Framework preset: None. Build command: leave empty. Build output directory: `/`.
3. Save and deploy. Every push to `main` redeploys.

## Demo only
Orders are not real and nothing is charged. Shipping figures in checkout are demo estimates.

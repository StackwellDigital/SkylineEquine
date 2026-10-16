// Shared shop logic for every design option: filters, product cards, quick view, cart, mock checkout.
// Page-specific layout lives in each option's own HTML and CSS. Load shared/data.js first.
(function () {
  'use strict';
  const SCRIPT = document.currentScript;
  const BASE = (SCRIPT && SCRIPT.dataset.base) || '';
  const CFG = Object.assign({ card: 'std', fillLabels: null }, window.SHOP_CONFIG || {});
  const $ = (s) => document.querySelector(s);
  const money = (n) => '$' + n.toFixed(2);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const CATS = ['All', 'Turnout', 'Layers', 'Fly & UV', 'Coolers & Riding', 'Neck covers', 'Accessories'];
  const FILLS = ['Any', '50g', '100g', '150g', '200g', '300g'];
  const S = { cat: 'All', fill: 'Any', q: '', sort: 'feat', size: '', cart: [], zone: null, sel: {}, msel: '' };

  // ---------- drawn fallback art (used only if a photo file is missing) ----------
  function artSvg(p) {
    const zebra = p.tone === 'zebra';
    const fill = zebra ? '#e9edf0' : p.tone;
    const id = 'z' + p.id;
    const body = 'M30 30 Q60 18 100 22 Q140 18 172 34 L180 70 Q184 100 168 118 L150 124 Q100 132 52 124 L34 116 Q20 90 24 60 Z';
    const stripes = zebra ? `<clipPath id="${id}"><path d="${body}"/></clipPath><g clip-path="url(#${id})" stroke="#15191d" stroke-width="7" stroke-linecap="round">${[0,1,2,3,4,5,6,7,8,9].map((i) => `<path d="M${20 + i * 17} 10 l-14 130"/>`).join('')}</g>` : '';
    let svg;
    if (p.art === 'rug') svg = `<path d="${body}" fill="${fill}" stroke="#b3282d" stroke-width="3"/>${stripes}<path d="M70 26 L66 126 M130 22 L134 128" stroke="#b3282d" stroke-width="2.5" fill="none"/>`;
    else if (p.art === 'mask') svg = `<path d="M100 30 Q142 30 140 78 Q138 118 100 128 Q62 118 60 78 Q58 30 100 30 Z" fill="#e9edf0" stroke="#b3282d" stroke-width="3"/>`;
    else if (p.art === 'neck') svg = `<path d="M30 100 Q40 40 100 34 Q160 40 170 100 L148 104 Q142 66 100 62 Q58 66 52 104 Z" fill="${fill}" stroke="#b3282d" stroke-width="3"/>`;
    else svg = `<rect x="32" y="52" width="136" height="36" rx="6" fill="${fill}" stroke="#b3282d" stroke-width="3"/>`;
    return `<svg viewBox="0 0 200 140" role="img" aria-label="${esc(p.name)}">${svg}</svg>`;
  }
  window.__fb = (id) => artSvg(P.find((x) => x.id === id));
  const art = (p) => `<img class="ph" src="${BASE}images/${p.id}.jpg" alt="${esc(p.name)}" loading="lazy" onerror="this.outerHTML=window.__fb('${p.id}')">`;

  // ---------- options ----------
  function optsHtml(p) {
    if (!p.opts) return '';
    return '<div class="opts">' + p.opts.map((o) => `<select aria-label="${esc(o.t)} for ${esc(p.name)}" data-label="${esc(o.t)}"><option value="">${esc(o.t)}</option>${o.v.map((v) => `<option${o.v.length === 1 ? ' selected' : ''}>${esc(v)}</option>`).join('')}</select>`).join('') + '</div>';
  }
  function pick(root) {
    const sels = [...root.querySelectorAll('.opts select:not(.vsel)')];
    return { miss: sels.find((s) => !s.value), size: sels.map((s) => s.value).join(' / ') };
  }
  const hasSize = (p, size) => !!(p.opts && p.opts.some((o) => o.t === 'Size' && o.v.includes(size)));
  const ALL_SIZES = [...new Set(P.flatMap((p) => (p.opts || []).filter((o) => o.t === 'Size' && o.v[0].endsWith('"')).flatMap((o) => o.v)))].sort((a, b) => parseInt(a) - parseInt(b));

  // ---------- groups: same garment, several fills, one card ----------
  const FAMS = typeof FAMILIES !== 'undefined' ? FAMILIES : [];
  const byId = (id) => P.find((x) => x.id === id);
  const VL = {};
  const GROUPS = (() => {
    const seen = new Set(); const out = [];
    P.forEach((p) => {
      if (seen.has(p.id)) return;
      const f = FAMS.find((x) => x.members.some((m) => m[0] === p.id));
      if (f) {
        f.members.forEach((m) => { seen.add(m[0]); VL[m[0]] = m[1]; });
        out.push({ gid: f.id, name: f.name, cat: p.cat, vlabel: f.vlabel, intro: f.intro, variants: f.members.map((m) => byId(m[0])) });
      } else { seen.add(p.id); out.push({ gid: p.id, name: p.name, cat: p.cat, variants: [p] }); }
    });
    return out;
  })();
  const G = (gid) => GROUPS.find((g) => g.gid === gid);
  const vlabel = (p) => VL[p.id] || (p.grams ? p.grams + 'g' : p.name);
  const vis = (g) => g.variants.filter((p) => (S.fill === 'Any' || (p.grams && p.grams + 'g' === S.fill)) && (!S.size || hasSize(p, S.size)));
  const selOf = (g, list) => { const id = S.sel[g.gid]; if (id && list.some((p) => p.id === id)) return byId(id); return list.length === 1 ? list[0] : null; };
  const fillTxt = (list) => { const u = [...new Set(list.filter((p) => p.grams).map((p) => p.grams))].sort((a, b) => a - b); return u.length ? u.map((n) => n + 'g').join(' / ') + ' fill' : ''; };
  const priceTxt = (list, v) => { if (v) return money(v.price); const a = list.map((p) => p.price); const lo = Math.min(...a); return lo === Math.max(...a) ? money(lo) : 'From ' + money(lo); };
  function vselHtml(g, list, v) {
    if (list.length < 2) return '';
    return `<select class="vsel" data-gid="${g.gid}" aria-label="${esc(g.vlabel)} for ${esc(g.name)}"><option value="">${esc(g.vlabel)}</option>${list.map((p) => `<option value="${p.id}"${v && v.id === p.id ? ' selected' : ''}>${esc(vlabel(p))}, ${money(p.price)}</option>`).join('')}</select>`;
  }

  // ---------- list ----------
  function visible() {
    const list = GROUPS.filter((g) => (S.cat === 'All' || g.cat === S.cat) && vis(g).length
      && (!S.q || (g.name + ' ' + g.cat + ' ' + g.variants.map((p) => p.sku + ' ' + p.name).join(' ')).toLowerCase().includes(S.q)));
    const lo = (g) => Math.min(...vis(g).map((p) => p.price)); const hi = (g) => Math.max(...vis(g).map((p) => p.price));
    if (S.sort === 'lo') list.sort((a, b) => lo(a) - lo(b));
    if (S.sort === 'hi') list.sort((a, b) => hi(b) - hi(a));
    if (S.sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }
  function renderChips() {
    const cats = $('#cats'), fills = $('#fills');
    if (cats) cats.innerHTML = CATS.map((c) => {
      const n = c === 'All' ? GROUPS.length : GROUPS.filter((g) => g.cat === c).length;
      return `<button class="chip" aria-pressed="${S.cat === c}" data-cat="${esc(c)}">${esc(c)}<span class="n">${n}</span></button>`;
    }).join('');
    if (fills) fills.innerHTML = FILLS.map((c) => `<button class="chip" aria-pressed="${S.fill === c}" data-fill="${c}">${esc((CFG.fillLabels && CFG.fillLabels[c]) || c)}</button>`).join('');
  }
  function cardHtml(g) {
    const list = vis(g); const v = selOf(g, list); const rep = v || list[0];
    const meta = `${esc(g.cat)}${fillTxt(v ? [v] : list) ? ' · ' + fillTxt(v ? [v] : list) : ''}`;
    const price = priceTxt(list, v);
    if (CFG.card === 'tile') return `
      <article class="card tile" data-id="${g.gid}" data-gid="${g.gid}">
        <button class="art" data-view="${g.gid}" aria-label="Quick view, ${esc(g.name)}">${art(rep)}</button>
        <div class="body">
          <h3>${esc(g.name)}</h3>
          <div class="meta"><span>${meta}</span><span class="price">${price}</span></div>
          <button class="add" data-view="${g.gid}">${rep.opts || list.length > 1 ? 'Choose options' : 'Quick view'}</button>
        </div>
      </article>`;
    return `
      <article class="card" data-id="${g.gid}" data-gid="${g.gid}">
        <button class="art" data-view="${g.gid}" aria-label="Quick view, ${esc(g.name)}">${art(rep)}</button>
        <div class="body">
          <h3>${esc(g.name)}</h3>
          <div class="meta"><span>${meta}</span><span>${v ? 'SKU ' + esc(v.sku) : ''}</span></div>
          <div class="price">${price}</div>
          <div class="opts">${vselHtml(g, list, v)}</div>
          ${v ? optsHtml(v) : (list.length > 1 && rep.opts ? '<div class="opts"><select disabled aria-label="Size"><option>Size</option></select></div>' : '')}
          <div class="row"><button class="add" data-add="${g.gid}">Add to cart</button></div>
          <div class="hint" aria-live="polite"></div>
          <button class="link" data-view="${g.gid}">Quick view</button>
        </div>
      </article>`;
  }
  function renderGrid() {
    const list = visible();
    const count = $('#count');
    if (count) count.textContent = list.length + (list.length === 1 ? ' product' : ' products') + (S.size ? ' in ' + S.size : '');
    const grid = $('#grid');
    if (!list.length) { grid.innerHTML = '<div class="empty">Nothing matches those filters. Clear the fill weight, size or search to see more.</div>'; return; }
    grid.innerHTML = list.map(cardHtml).join('');
  }
  function render() { renderChips(); renderGrid(); }

  // ---------- cart ----------
  function addToCart(id, size, qty) {
    const key = id + '|' + (size || '');
    const hit = S.cart.find((l) => l.key === key);
    if (hit) hit.qty += qty || 1; else S.cart.push({ key, id, size, qty: qty || 1 });
    updateFab();
    if (!$('#cart').hidden) renderCart();
  }
  const subtotal = () => S.cart.reduce((n, l) => n + P.find((p) => p.id === l.id).price * l.qty, 0);
  function updateFab() { const n = S.cart.reduce((a, l) => a + l.qty, 0); $('#fabn').textContent = n; document.querySelectorAll('[data-cart-count]').forEach((e) => { e.textContent = n; }); }
  function openLayer(which) { $('#layer').hidden = false; $('#cart').hidden = which !== 'cart'; $('#modal').hidden = which !== 'modal'; }
  function closeLayer() { $('#layer').hidden = true; $('#cart').hidden = true; $('#modal').hidden = true; $('#fab').focus(); }

  function renderCart(step) {
    const el = $('#cart');
    const sub = subtotal();
    const left = Math.max(0, FREE_AT - sub);
    const pct = Math.min(100, (sub / FREE_AT) * 100);
    if (step === 'done') {
      el.innerHTML = `<header><h2>Order received</h2><button class="x" data-close aria-label="Close">×</button></header>
        <div class="scroll"><p class="ok" style="margin-top:16px">Demo order placed. Nothing was charged.</p><p style="margin-top:10px;color:var(--muted)">On the live shop this is where the customer gets an order number and a confirmation email, and Susan gets the order for Wednesday shipping.</p></div>
        <footer><button class="btn primary" data-reset>Keep browsing</button></footer>`;
      return;
    }
    if (step === 'checkout') {
      const zone = S.zone || 'BC';
      const est = { BC: 12, CA: 18, US: 24 }[zone];
      const ship = sub >= FREE_AT ? 0 : est;
      el.innerHTML = `<header><h2>Checkout</h2><button class="x" data-close aria-label="Close">×</button></header>
        <form class="scroll" id="co" style="display:grid;gap:12px;align-content:start;padding-top:16px">
          <div class="two"><label class="field">First name<input id="fn" required></label><label class="field">Last name<input id="ln" required></label></div>
          <label class="field">Email<input id="em" type="email" required></label>
          <label class="field">Address<input id="ad" required></label>
          <div class="two"><label class="field">City<input id="ci" required></label>
          <label class="field">Shipping zone<select id="zn"><option value="BC"${zone === 'BC' ? ' selected' : ''}>British Columbia</option><option value="CA"${zone === 'CA' ? ' selected' : ''}>Rest of Canada</option><option value="US"${zone === 'US' ? ' selected' : ''}>Continental US</option></select></label></div>
          <p class="demo">Demo only. No payment details are collected here. The live shop would hand off to Visa, Mastercard or PayPal.</p>
          <div class="sum"><span>Subtotal</span><span>${money(sub)}</span></div>
          <div class="sum"><span>Shipping${sub >= FREE_AT ? ' (free over $100)' : ' (demo estimate)'}</span><span>${ship ? money(ship) : 'Free'}</span></div>
          <div class="sum total"><span>Total before tax</span><span>${money(sub + ship)}</span></div>
          <button class="btn primary" type="submit">Place demo order</button>
          <button class="link" type="button" data-back>Back to cart</button>
        </form>`;
      return;
    }
    el.innerHTML = `<header><h2>Your cart</h2><button class="x" data-close aria-label="Close">×</button></header>
      <div class="scroll">${S.cart.length ? S.cart.map((l) => { const p = P.find((x) => x.id === l.id); return `
        <div class="line"><div class="thumb">${art(p)}</div>
          <div><div class="t">${esc(p.name)}</div><div class="s">${l.size ? esc(l.size) + ' · ' : ''}${money(p.price)} each</div>
          <div class="qty"><button data-dec="${l.key}" aria-label="Fewer">−</button><span>${l.qty}</span><button data-inc="${l.key}" aria-label="More">+</button></div></div>
          <div style="font-variant-numeric:tabular-nums;font-weight:600">${money(p.price * l.qty)}</div></div>`; }).join('') : '<p style="padding:24px 0;color:var(--muted)">Your cart is empty. Add a rug or a liner to see how checkout works.</p>'}</div>
      <footer>
        <div class="ship" aria-hidden="true"><i style="width:${pct}%"></i></div>
        <div class="shiptxt">${sub >= FREE_AT ? 'Free shipping unlocked.' : sub ? `Add ${money(left)} more for free shipping.` : 'Free shipping over $100 before tax.'}</div>
        <div class="sum total"><span>Subtotal</span><span>${money(sub)}</span></div>
        <button class="btn primary" data-checkout ${S.cart.length ? '' : 'disabled'}>Checkout</button>
      </footer>`;
  }

  function renderModal(gid, vid) {
    const g = G(gid); const list = vis(g).length ? vis(g) : g.variants;
    const v = vid ? byId(vid) : selOf(g, list); const rep = v || list[0];
    S.msel = v ? v.id : '';
    $('#modal').innerHTML = `<div class="box" role="dialog" aria-modal="true" aria-label="${esc(g.name)}">
      <div class="pic">${art(rep)}</div>
      <div class="txt"><button class="x" data-close aria-label="Close">×</button>
        <h2>${esc(g.name)}</h2>
        <div class="meta" style="color:var(--muted);font-size:14px">${v ? 'SKU ' + esc(v.sku) + ' · ' : ''}${esc(g.cat)}${fillTxt(v ? [v] : list) ? ' · ' + fillTxt(v ? [v] : list) : ''}</div>
        <div class="price">${priceTxt(list, v)}</div>
        <p>${esc(v || !g.intro ? rep.short : g.intro)}</p>
        <ul>${rep.feats.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
        <div class="opts">${vselHtml(g, list, v)}</div>
        ${v ? optsHtml(v) : (list.length > 1 && rep.opts ? '<div class="opts"><select disabled aria-label="Size"><option>Size</option></select></div>' : '')}
        <div class="row"><button class="add" data-madd="${g.gid}">Add to cart</button></div>
        <div class="hint" id="mh" aria-live="polite"></div>
      </div></div>`;
  }

  // ---------- shared page sections, mounted into [data-slot] ----------
  const SLOTS = {
    vault: `<div><h3>Vaulting supplies</h3><p>Surcingles, rollers, pads and shoes for equestrian vaulting and hippotherapy. Vaulting items are quoted by request, so tell us what you need and we will reply with pricing.</p></div><a class="btn primary" href="#contact">Request a quote</a>`,
    ordering: `
      <div><h3>Our guarantee</h3><p>Every order is inspected before it ships, so what arrives is the quality you expected.</p></div>
      <div><h3>Shipping</h3><p>Free on orders over $100 before tax, continental US and Canada. Shipping under that is weight-based with no fees at the door. Orders go out Wednesdays. International shipping is quoted before we process it.</p></div>
      <div><h3>Exchanges and refunds</h3><ul><li>Within 30 days of purchase</li><li>Original receipt, unused, tags attached</li><li>Request an E/R form from Susan, then ship it insured with the authorization number on the box</li></ul></div>
      <div><h3>Gift wrapping</h3><p>You shop, we wrap and ship to the recipient, for any occasion.</p></div>`,
    footer: `<div><b>Skyline Equine</b><br>Box 5000, Langley BC, Canada<br>Phone 604-329-2157<br>susan@skylineequine.com</div>
      <div class="demo">Design demo prepared by Stackwell Digital. Products and prices come from skylineequine.com. Orders placed here are not real and nothing is charged.<br><a href="${BASE}">See all design options</a></div>`,
  };
  document.querySelectorAll('[data-slot]').forEach((el) => { const t = SLOTS[el.dataset.slot]; if (t) el.innerHTML = t; });

  // ---------- layer markup ----------
  if (!$('#layer')) {
    document.body.insertAdjacentHTML('beforeend', `<button class="fab" id="fab" aria-label="Open cart">Cart <span class="n" id="fabn">0</span></button>
      <div id="layer" hidden><div class="scrim" id="scrim"></div><aside class="panel" id="cart" role="dialog" aria-modal="true" aria-label="Cart" hidden></aside><div class="modal" id="modal" hidden></div></div>`);
  }

  // ---------- events ----------
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, a');
    if (!t) return;
    if (t.dataset.cat) { S.cat = t.dataset.cat; render(); }
    else if (t.dataset.fill) { S.fill = t.dataset.fill; render(); }
    else if (t.dataset.add) {
      const card = t.closest('.card'); const g = G(t.dataset.add); const list = vis(g); const v = selOf(g, list);
      const hint = card.querySelector('.hint');
      if (!v) { hint.textContent = 'Pick a ' + g.vlabel.toLowerCase() + ' first.'; const vs = card.querySelector('.vsel'); if (vs) vs.focus(); return; }
      const c = pick(card);
      if (c.miss) { hint.textContent = 'Pick a ' + c.miss.dataset.label.toLowerCase() + ' first.'; c.miss.focus(); return; }
      hint.textContent = 'Added to cart.';
      addToCart(v.id, c.size, 1);
    }
    else if (t.dataset.view) { const g = G(t.dataset.view); const v = selOf(g, vis(g)); renderModal(g.gid, v ? v.id : ''); openLayer('modal'); }
    else if (t.dataset.madd) {
      const g = G(t.dataset.madd); const vid = S.msel;
      if (!vid) { $('#mh').textContent = 'Pick a ' + g.vlabel.toLowerCase() + ' first.'; const vs = $('#modal .vsel'); if (vs) vs.focus(); return; }
      const c = pick($('#modal'));
      if (c.miss) { $('#mh').textContent = 'Pick a ' + c.miss.dataset.label.toLowerCase() + ' first.'; c.miss.focus(); return; }
      addToCart(vid, c.size, 1); renderCart(); openLayer('cart');
    }
    else if (t.id === 'fab' || t.dataset.openCart !== undefined) { renderCart(); openLayer('cart'); }
    else if (t.dataset.close !== undefined || t.id === 'scrim') closeLayer();
    else if (t.dataset.inc) { S.cart.find((l) => l.key === t.dataset.inc).qty++; updateFab(); renderCart(); }
    else if (t.dataset.dec) { const l = S.cart.find((x) => x.key === t.dataset.dec); l.qty--; if (l.qty < 1) S.cart = S.cart.filter((x) => x !== l); updateFab(); renderCart(); }
    else if (t.dataset.checkout !== undefined) renderCart('checkout');
    else if (t.dataset.back !== undefined) renderCart();
    else if (t.dataset.reset !== undefined) closeLayer();
  });
  $('#scrim').addEventListener('click', closeLayer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#layer').hidden) closeLayer(); });
  document.addEventListener('change', (e) => {
    if (e.target.id === 'zn') { S.zone = e.target.value; renderCart('checkout'); return; }
    if (!e.target.classList.contains('vsel')) return;
    const gid = e.target.dataset.gid; const val = e.target.value;
    if (e.target.closest('#modal')) { renderModal(gid, val); const n = $('#modal .vsel'); if (n) n.focus(); return; }
    const card = e.target.closest('.card'); S.sel[gid] = val;
    card.outerHTML = cardHtml(G(gid));
    const n = document.querySelector(`.card[data-gid="${gid}"] .vsel`); if (n) n.focus();
  });
  document.addEventListener('submit', (e) => { if (e.target.id === 'co') { e.preventDefault(); S.cart = []; S.zone = null; updateFab(); renderCart('done'); } });

  const q = $('#q'); if (q) q.addEventListener('input', (e) => { S.q = e.target.value.trim().toLowerCase(); renderGrid(); });
  const sort = $('#sort'); if (sort) sort.addEventListener('change', (e) => { S.sort = e.target.value; renderGrid(); });
  const size = $('#size');
  if (size) {
    size.innerHTML = '<option value="">Any size</option>' + ALL_SIZES.map((s) => `<option>${esc(s)}</option>`).join('');
    size.addEventListener('change', (e) => { S.size = e.target.value; renderGrid(); });
  }

  window.Shop = { S, P, render, visible, ALL_SIZES, setFilter(o) { Object.assign(S, o); const sz = $('#size'); if (sz) sz.value = S.size; render(); } };
  render(); updateFab();
})();

// Product data for the Skyline Equine demo. Prices and options come from skylineequine.com (Oct 2026).
const FREE_AT = 100;
const RUG = ['60"','63"','66"','69"','72"','75"','78"','81"','84"'];
const PONY = ['54"','57"','60"','63"'];
const MASK = ['XS','S','M','L','XL'];
const NECK = ['S','M','L'];
const P = [
  // id, name, sku, cat, price, grams, sizes, tone, art, short, features
  ['irish50','Bucas Irish Turnout & Neck 50g','536','Turnout',230,50,RUG,'#1f3b57','rug','Waterproof, breathable rip-stop turnout with the neck included.',['1200 denier rip-stop outer','T-bar with magnetic Snap-lock front','Silk-feel lining and shoulder darts','Works with Bucas quilts and coolers']],
  ['green300','Bucas Green-Line 300g Turnout','528','Turnout',216,300,RUG,'#2e6b45','rug','Eco turnout built from recycled fibres, with 300g of fill.',['600D rip-stop from recycled bottles','Recycled lining, straps and binding','T-bar with magnetic Snap-lock','Combi Neck attachment points']],
  ['green100','Bucas Green-Line 100g Turnout','527','Turnout',206,100,RUG,'#2e6b45','rug','The same recycled build as the 300g, with a lighter 100g fill.',['600D rip-stop from recycled bottles','Recycled lining, straps and binding','T-bar with magnetic Snap-lock','Combi Neck attachment points']],
  ['smx300','Bucas Smartex Turnout 300g Big Neck','622','Turnout',386,300,RUG,'#26292e','rug','A wider cut for stallions and broad-shouldered breeds like Friesians, Andalusians and drafts.',['Stay-dry, anti-bacterial lining','Click’n Go front with magnetic Snap-lock','Ballistic nylon, waterproof and breathable','Reflective strips on tail flap and front']],
  ['smx150','Bucas Smartex Turnout 150g','623','Turnout',368,150,RUG,'#26292e','rug','Versatile turnout that can go on a wet horse after a ride or a wash.',['Stay-dry lining wicks moisture away','Click’n Go front with magnetic Snap-lock','Heat-reflective aluminium coating','Elastic leg straps and cross surcingles']],
  ['pony300','Bucas Pony Irish Turnout 300g','654P','Turnout',174,300,PONY,'#7a1f2a','rug','Pony-cut Irish turnout, 300g fill.',['1200 denier rip-stop, waterproof','Silk-feel lining, shoulder darts','T-bar with magnetic Snap-lock','Combi Neck sold separately']],
  ['pony150','Bucas Pony Irish Turnout 150g','659P','Turnout',160,150,PONY,'#7a1f2a','rug','Pony-cut Irish turnout, 150g fill.',['1200 denier rip-stop, waterproof','Silk-feel lining, shoulder darts','T-bar with magnetic Snap-lock','Combi Neck sold separately']],
  ['pony50','Bucas Pony Irish Turnout 50g','656P','Turnout',146,50,PONY,'#7a1f2a','rug','Pony-cut Irish turnout, 50g fill.',['1200 denier rip-stop, waterproof','Silk-feel lining, shoulder darts','T-bar with magnetic Snap-lock','Combi Neck sold separately']],
  ['liner300','Bucas Liner 300g','553','Layers',112,300,RUG,'#5b6b7a','rug','Turns a light turnout into a heavyweight winter rug.',['Quilted polyester outer','Dermo-care lining','Front and rear attachment points','Reduced depth to sit under Bucas rugs']],
  ['liner200','Bucas Liner 200g','552','Layers',106,200,RUG,'#5b6b7a','rug','The middle weight for transitional autumn weather.',['Quilted polyester outer','Dermo-care lining','Front and rear attachment points','Reduced depth to sit under Bucas rugs']],
  ['liner100','Bucas Liner 100g','551','Layers',100,100,RUG,'#5b6b7a','rug','A light layer that adds warmth on cool nights.',['Quilted polyester outer','Dermo-care lining','Front and rear attachment points','Reduced depth to sit under Bucas rugs']],
  ['quiltS','Bucas Quilt 50g Silky Lining','458','Layers',132,50,RUG,'#3c4a73','rug','A stable or under rug with a silk-feel lining that cuts down on rubbing.',['50g insulation','T-bar with magnetic Snap-lock','External cross surcingles','Attaches to Bucas turnout and stable rugs']],
  ['quiltD','Bucas Quilt 50g Stay-Dry Lining','457','Layers',142,50,RUG,'#3c4a73','rug','The same quilt with a wicking Stay-Dry lining.',['50g insulation','Stay-Dry lining wicks moisture','External cross surcingles','Attaches to Bucas turnout and stable rugs']],
  ['zmask','Bucas Buzz-Off Deluxe Fly Mask with Ears, Zebra','574','Fly & UV',60,null,MASK,'zebra','mask','Lightweight mask with reinforced darts that hold the mesh off the eyes.',['Insect and sun protection','Zebra print mesh','Sizing follows the blanket size you wear','Sold on its own or with a Zebra rug']],
  ['brain','Bucas Buzz-Off Rain with Detachable Neck','534','Fly & UV',240,null,RUG,'#2a6f8f','rug','Waterproof on top, fly mesh below, for changeable summer weather.',['Roughly 80% UVA and UVB reduction','Detachable elasticated belly pad','Removable neck','Lightweight and breathable']],
  ['xrange','Bucas Buzz-Off X-Range Full Neck','522','Fly & UV',194,null,RUG,'#2a6f8f','rug','Extra-deep mesh sides that keep flies off and let air move around the legs.',['Belly wrap with 3 surcingles','Integrated cap keeps the neck in place','Ears stay free, fly mask optional','Protects against sun bleaching']],
  ['zebra','Buzz-Off Zebra with Detachable Neck','524','Fly & UV',200,null,RUG,'zebra','rug','Fine zebra-print mesh that blocks even the smallest insects.',['Elasticated brow band holds the neck on','Belly pad and large tail flap','Neck piece can come off','Matching Zebra fly mask sold separately']],
  ['fleece','Bucas Show-Line Fleece Cooler 400g','460','Coolers & Riding',176,null,RUG,'#1f3b57','rug','Premium 400g fleece that looks sharp at the show and keeps the horse warm.',['Shaped back','T-bar front closure','Contrasting binding and piping','Deluxe tail cord']],
  ['power','Bucas Power Cooler with Detachable Neck','532','Coolers & Riding',156,null,RUG,'#26292e','rug','Single-layer Stay-Dry cooler for sweat, travel, competition and light stable use.',['Wicks moisture so the horse dries faster','Neck detaches','Machine washable','Black']],
  ['riding','Bucas Riding Rug','638','Coolers & Riding',108,null,RUG,'#26292e','rug','All-weather exercise rug with reflective strips for dark winter rides.',['Rip-stop, waterproof and breathable','Anti-bacterial Stay-Dry lining','Hook and loop at the withers','Fits under or over the saddle flaps']],
  ['atl300','Bucas Atlantic Turnout Combi Neck 300g','445','Neck covers',152,300,NECK,'#1f3b57','neck','Rugged neck cover for the Atlantic turnout range.',['Dermo-care lining with wicking','Ballistic nylon, waterproof and breathable','Velcro closures','Fits Bucas rugs with Combi Neck points']],
  ['atl50','Bucas Atlantic Turnout Combi Neck 50g','444','Neck covers',136,50,NECK,'#1f3b57','neck','Lighter Atlantic neck cover for milder days.',['Dermo-care lining with wicking','Ballistic nylon, waterproof and breathable','Velcro closures','Fits Bucas rugs with Combi Neck points']],
  ['xneck','Bucas X-Range Turnout Neck Cover','616','Neck covers',78,null,NECK,'#26292e','neck','Neck cover for the X-Range turnouts.',['Matches the X-Range turnout line']],
  ['wither','Bucas Wither Pad','725','Accessories',20,null,null,'#5b6b7a','small','Cushions the wither and protects the mane under any Bucas rug with neck attachment points.',['300g cushioned wadding','Silk-feel lining','Attaches to the neckline hook and loop','Wash it regularly']],
  ['ext1','Bucas Chest Extender Standard 12cm','801-12','Accessories',24,null,null,'#7d8791','small','T-bar style 12cm chest extender. Check the year tag inside your rug before ordering.',['Fits Freedom range','Fits Select quilts','Fits Prize coolers']],
  ['ext2','Bucas Chest Extender T-Bar Magnetic 12cm','802-12','Accessories',26,null,null,'#7d8791','small','T-bar magnetic 12cm chest extender. Check the year tag inside your rug before ordering.',['Fits Shamrock range 2016','Fits Buzz-Off range 2016','Fits Recuptex, Sun Shower and coolers 625/632/639 2016']],
  ['ext3','Bucas Chest Extender Click’n Go Magnetic 12cm','803-12','Accessories',36,null,null,'#7d8791','small','Click’n Go magnetic 12cm chest extender. Check the year tag inside your rug before ordering.',['Fits Smartex range 2015 and newer','Fits Power range 2016','Fits Celtic range AW2016']],
].map((a, i) => ({ id:a[0], name:a[1], sku:a[2], cat:a[3], price:a[4], grams:a[5], sizes:a[6], tone:a[7], art:a[8], short:a[9], feats:a[10], order:i }));

// Options read from skylineequine.com product pages (Oct 2026).
const inch = (...n) => ({ t: 'Size', v: n.map((x) => x + '"') });
const letters = (...v) => ({ t: 'Size', v });
const ALL = [60, 63, 66, 69, 72, 75, 78, 81, 84];
const OPTS = {
  irish50: [inch(66, 69, 72, 75, 78, 81, 84)],
  green300: [inch(66, 69, 72, 75, 78, 81, 84), { t: 'Color', v: ['Green/Navy trim', 'Green/Creme trim'] }],
  green100: [inch(66, 69, 72, 75, 78, 81, 84), { t: 'Color', v: ['Green/Navy trim', 'Green/Creme trim'] }],
  smx300: [inch(78, 81, 84)],
  smx150: [inch(66, 69, 72, 75, 78, 81, 84, 86)],
  pony300: [inch(42, 57, 60, 63)],
  pony150: [inch(42, 48, 51, 57, 60, 63)],
  pony50: [inch(42, 45, 48, 51, 54, 57, 60, 63)],
  liner300: [inch(72, 75, 78, 81, 84)],
  liner200: [inch(72, 75, 78, 81, 84)],
  liner100: [inch(81)],
  quiltS: [inch(...ALL)],
  quiltD: [inch(60, 63, 66, 69, 72, 84)],
  zmask: [letters('XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL')],
  brain: [inch(69, 72, 75, 78, 81, 84)],
  xrange: [inch(...ALL)],
  zebra: [inch(...ALL)],
  fleece: [{ t: 'Color', v: ['Navy'] }, inch(75, 78, 81)],
  power: [{ t: 'Color', v: ['Black/Silver'] }, inch(66, 69, 72, 75, 78, 81, 84)],
  riding: [{ t: 'Color & size', v: ['Small Black/gold', 'Small Navy/Gold', 'Medium Black/Gold', 'Medium Navy/Silver', 'Large Navy/Silver', 'Extra Large Black/Gold', 'Extra Large Navy/Silver'] }],
  atl300: [letters('S', 'M', 'L', 'XL')],
  atl50: [letters('S', 'M', 'L', 'XL')],
  xneck: [letters('S', 'M', 'L', 'XL')],
  wither: null,
  ext1: [{ t: 'Color & size', v: ['Navy 12 cm'] }],
  ext2: [{ t: 'Color & size', v: ['Black 12 cm', 'Navy 12 cm'] }],
  ext3: [{ t: 'Color & size', v: ['Black 12 cm', 'Navy 12 cm'] }],
};
P.forEach((p) => { p.opts = OPTS[p.id] || null; });

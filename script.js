/* =========================================================
   ORCHARD & OAK — script.js
   Product data, rendering, filters/search, weight-based
   pricing, and a fully working cart drawer — all in memory,
   no page reloads.
========================================================= */

// ---------- Icon shapes (flat "orchard seal" style, one per product) ----------
const icons = {
  almond: `<svg viewBox="0 0 100 100"><path d="M50 18c15 0 24 22 18 44-4 15-12 22-18 22s-14-7-18-22c-6-22 3-44 18-44Z" fill="#3B2412"/><path d="M46 30c5-4 9-4 13 0-2 10-4 24-9 36-5-12-6-26-4-36Z" fill="#E9C98F"/></svg>`,
  cashew: `<svg viewBox="0 0 100 100"><path d="M38 20c18-4 34 8 34 26 0 14-10 22-16 30-5 7-4 12-12 12-10 0-16-9-14-18 2-8 10-10 12-18 2-9-4-14-10-20-7-7-6-9 6-12Z" fill="#F4E9C8"/><path d="M38 20c18-4 34 8 34 26 0 14-10 22-16 30" fill="none" stroke="#B08B3F" stroke-width="3"/></svg>`,
  pistachio: `<svg viewBox="0 0 100 100"><path d="M50 16c14 0 22 18 22 36 0 16-10 30-22 32-12-2-22-16-22-32 0-18 8-36 22-36Z" fill="#EFE6C9"/><path d="M50 16c14 0 22 18 22 36 0 16-10 30-22 32Z" fill="#8FA35E"/><line x1="50" y1="20" x2="50" y2="82" stroke="#5C6B3C" stroke-width="2"/></svg>`,
  walnut: `<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="34" fill="#B4875E"/><path d="M50 22c-6 8-2 14-10 18s-6 12 0 16-4 12 4 16 4 10 12 10 8-6 14-10 2-12 8-16-2-14-8-18 2-10-6-14-8 4-14-2Z" fill="#7A4E2B"/></svg>`,
  dates: `<svg viewBox="0 0 100 100"><rect x="26" y="34" width="48" height="34" rx="17" fill="#2E1B12"/><rect x="32" y="40" width="20" height="8" rx="4" fill="#7A5230" opacity=".7"/></svg>`,
  raisins: `<svg viewBox="0 0 100 100"><circle cx="34" cy="38" r="12" fill="#6B4A1E"/><circle cx="58" cy="30" r="10" fill="#8A6A2E"/><circle cx="66" cy="52" r="12" fill="#6B4A1E"/><circle cx="42" cy="60" r="11" fill="#8A6A2E"/><circle cx="30" cy="64" r="9" fill="#6B4A1E"/></svg>`,
  figs: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="32" fill="#7A2E1E"/><circle cx="50" cy="50" r="22" fill="#C97A63"/><g fill="#F3D9B1"><circle cx="50" cy="50" r="3"/><circle cx="58" cy="45" r="2.4"/><circle cx="42" cy="45" r="2.4"/><circle cx="58" cy="56" r="2.4"/><circle cx="42" cy="56" r="2.4"/><circle cx="50" cy="60" r="2.4"/><circle cx="50" cy="40" r="2.4"/></g></svg>`,
  apricot: `<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="30" fill="#E3A857"/><path d="M50 22c2 10-2 18 0 30" stroke="#B9782E" stroke-width="3" fill="none"/><path d="M50 20c8-6 16-2 16 6-8 2-12 0-16-6Z" fill="#6B8F4E"/></svg>`,
  pumpkinseed: `<svg viewBox="0 0 100 100"><path d="M50 14c16 10 22 30 14 50-4 10-9 18-14 22-5-4-10-12-14-22-8-20-2-40 14-50Z" fill="#EDE8CE"/><path d="M50 14c16 10 22 30 14 50-4 10-9 18-14 22Z" fill="#C7C79A"/><line x1="50" y1="20" x2="50" y2="82" stroke="#9CAF88" stroke-width="2"/></svg>`,
  trailmix: `<svg viewBox="0 0 100 100"><circle cx="36" cy="60" r="14" fill="#6B4A1E"/><path d="M56 24c12 0 19 16 14 32-3 10-9 16-14 18-5-2-11-8-14-18-5-16 2-32 14-32Z" fill="#3B2412"/><circle cx="70" cy="62" r="10" fill="#7A2E1E"/></svg>`
};

// ---------- Product catalogue ----------
const products = [
  {
    id: 'almonds', name: 'California Almonds', category: 'nuts', icon: icons.almond,
    origin: 'California, USA', badge: null,
    desc: 'Sun-dried and lightly cracked to show the kernel. Snap-fresh with a clean, milky bite.',
    prices: { '250g': 260, '500g': 499, '1kg': 949 }
  },
  {
    id: 'cashews', name: 'Whole Cashews', category: 'nuts', icon: icons.cashew,
    origin: 'Konkan Coast, IN', badge: null,
    desc: 'Whole W240-grade cashews slow-roasted to a pale gold, without a drop of oil.',
    prices: { '250g': 299, '500g': 579, '1kg': 1099 }
  },
  {
    id: 'pistachios', name: 'Iranian Pistachios', category: 'nuts', icon: icons.pistachio,
    origin: 'Kerman, Iran', badge: 'Bestseller',
    desc: 'Naturally split and lightly salted. Roasted in small batches every Tuesday.',
    prices: { '250g': 399, '500g': 769, '1kg': 1449 }, mrp: { '500g': 849, '1kg': 1599 }
  },
  {
    id: 'walnuts', name: 'Kashmiri Walnuts', category: 'nuts', icon: icons.walnut,
    origin: 'Kashmir, IN', badge: null,
    desc: 'Hand-cracked to keep the halves whole. Buttery, with almost no bitterness.',
    prices: { '250g': 349, '500g': 669, '1kg': 1249 }, mrp: { '1kg': 1399 }
  },
  {
    id: 'dates', name: 'Medjool Dates', category: 'dried', icon: icons.dates,
    origin: 'Jordan Valley', badge: 'Limited batch',
    desc: 'Caramel-soft with a molasses finish. Pitted and ready to eat straight from the jar.',
    prices: { '250g': 329, '500g': 629, '1kg': 1199 }
  },
  {
    id: 'raisins', name: 'Golden Raisins', category: 'dried', icon: icons.raisins,
    origin: 'Nashik, IN', badge: null,
    desc: 'Sun-gold and sulphur-free, from the same Nashik vineyards each harvest.',
    prices: { '250g': 165, '500g': 315, '1kg': 599 }
  },
  {
    id: 'figs', name: 'Dried Anjeer Figs', category: 'dried', icon: icons.figs,
    origin: 'Afghanistan', badge: null,
    desc: 'Sun-dried until the sugars rise to the skin. Chewy centre, honeyed edge.',
    prices: { '250g': 369, '500g': 709, '1kg': 1349 }
  },
  {
    id: 'apricots', name: 'Turkish Apricots', category: 'dried', icon: icons.apricot,
    origin: 'Malatya, Turkey', badge: null,
    desc: 'Dried whole with the stone removed. Tart-sweet, with no added sugar.',
    prices: { '250g': 279, '500g': 539, '1kg': 1029 }
  },
  {
    id: 'pumpkinseed', name: 'Roasted Pumpkin Seeds', category: 'seeds', icon: icons.pumpkinseed,
    origin: 'House Blend', badge: null,
    desc: 'Hulled and dry-roasted with a pinch of rock salt. Grassy, crisp, moreish.',
    prices: { '250g': 209, '500g': 399, '1kg': 759 }
  },
  {
    id: 'trailmix', name: 'Harvest Trail Mix', category: 'seeds', icon: icons.trailmix, badge: 'New',
    origin: 'House Blend',
    desc: 'Our own mix — almonds, cranberries, pumpkin seeds and dark chocolate shavings.',
    prices: { '250g': 309, '500g': 599, '1kg': 1139 },
    mrp: { '250g': 349 }
  }
];

// ---------- State ----------
let activeFilter = 'all';
let searchTerm = '';
const cart = []; // { id, name, weight, price, icon, qty }

// ---------- Render products ----------
const grid = document.getElementById('productGrid');
const noResults = document.getElementById('noResults');

function currency(n){ 
  return '₹' + n.toLocaleString('en-IN'); 
}

function renderProducts(){
  grid.innerHTML = '';
  const term = searchTerm.trim().toLowerCase();

  const visible = products.filter(p => {
    const matchesFilter = activeFilter === 'all' || p.category === activeFilter;
    const matchesSearch = !term || 
      p.name.toLowerCase().includes(term) || 
      p.origin.toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

  noResults.hidden = visible.length !== 0;

  visible.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.id = p.id;

    const weights = Object.keys(p.prices);
    const defaultWeight = weights[0];

    card.innerHTML = `
      ${p.badge ? `<span class="card-badge ${p.badge === 'New' ? 'gold' : ''}">${p.badge}</span>` : ''}
      <div class="crate-icon">${p.icon}</div>
      <p class="card-origin">${p.origin}</p>
      <h3 class="card-name">${p.name}</h3>
      <p class="card-desc">${p.desc}</p>

      <div class="weight-select" role="group" aria-label="Choose weight">
        ${weights.map((w,i) => `
          <button 
            type="button" 
            data-weight="${w}" 
            class="${i===0 ? 'active' : ''}">
            ${w}
          </button>
        `).join('')}
      </div>

      <div class="price-row">
        <span class="price-now">${currency(p.prices[defaultWeight])}</span>
        <span 
          class="price-mrp" 
          ${p.mrp && p.mrp[defaultWeight] ? '' : 'hidden'}>
          ${p.mrp && p.mrp[defaultWeight] ? currency(p.mrp[defaultWeight]) : ''}
        </span>
      </div>

      <button type="button" class="add-btn">
        <svg viewBox="0 0 24 24">
          <path 
            d="M12 5v14M5 12h14" 
            stroke="currentColor" 
            stroke-width="2.4" 
            stroke-linecap="round" 
            fill="none"/>
        </svg>
        Add to cart
      </button>
    `;

    // weight selector logic
    const weightBtns = card.querySelectorAll('.weight-select button');
    const priceNow = card.querySelector('.price-now');
    const priceMrp = card.querySelector('.price-mrp');

    weightBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        weightBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const w = btn.dataset.weight;
        priceNow.textContent = currency(p.prices[w]);

        if (p.mrp && p.mrp[w]) {
          priceMrp.hidden = false;
          priceMrp.textContent = currency(p.mrp[w]);
        } else {
          priceMrp.hidden = true;
        }
      });
    });

    // add to cart
    const addBtn = card.querySelector('.add-btn');

    addBtn.addEventListener('click', () => {
      const activeWeight = card
        .querySelector('.weight-select button.active')
        .dataset.weight;

      const price = p.prices[activeWeight];

      addToCart({
        id: p.id,
        name: p.name,
        weight: activeWeight,
        price,
        icon: p.icon
      });

      addBtn.classList.add('added');

      const original = addBtn.innerHTML;
      addBtn.innerHTML = 'Added ✓';

      showToast(`${p.name} (${activeWeight}) added to your cart`);

      setTimeout(() => {
        addBtn.classList.remove('added');
        addBtn.innerHTML = original;
      }, 1100);
    });

    grid.appendChild(card);
  });

  observeCards();
}

// ---------- Scroll reveal ----------
function observeCards(){
  const cards = document.querySelectorAll('.product-card:not(.in-view)');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(c => io.observe(c));
}

// ---------- Filters ----------
document.getElementById('filterRow').addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;

  document.querySelectorAll('.chip')
    .forEach(c => c.classList.remove('active'));

  btn.classList.add('active');

  activeFilter = btn.dataset.filter;
  renderProducts();
});

// ---------- Search ----------
document.getElementById('searchInput').addEventListener('input', (e) => {
  searchTerm = e.target.value;
  renderProducts();
});

// ---------- Cart logic ----------
const cartItemsEl = document.getElementById('cartItems');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartCountEl = document.getElementById('cartCount');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const cartShippingEl = document.getElementById('cartShipping');
const cartTotalEl = document.getElementById('cartTotal');
const shipNoteEl = document.getElementById('shipNote');

const FREE_SHIP_THRESHOLD = 999;
const SHIP_COST = 49;

function addToCart(item){
  const existing = cart.find(
    c => c.id === item.id && c.weight === item.weight
  );

  if (existing){
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  renderCart();
}

function changeQty(id, weight, delta){
  const item = cart.find(
    c => c.id === id && c.weight === weight
  );

  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0){
    const idx = cart.indexOf(item);
    cart.splice(idx, 1);
  }

  renderCart();
}

function removeItem(id, weight){
  const idx = cart.findIndex(
    c => c.id === id && c.weight === weight
  );

  if (idx > -1) {
    cart.splice(idx, 1);
  }

  renderCart();
}

function renderCart(){
  const totalQty = cart.reduce(
    (sum, c) => sum + c.qty, 
    0
  );

  cartCountEl.textContent = totalQty;

  cartItemsEl.innerHTML = '';

  if (cart.length === 0){
    cartEmptyEl.textContent =
      'Your cart is empty. Go on, add some almonds.';

    cartItemsEl.appendChild(cartEmptyEl);
  } else {

    cart.forEach(item => {
      const row = document.createElement('div');

      row.className = 'cart-item';

      row.innerHTML = `
        <div class="crate-icon">${item.icon}</div>

        <div class="cart-item-info">
          <h5>${item.name}</h5>

          <div class="meta">
            ${item.weight}
          </div>

          <div class="cart-item-controls">

            <button 
              class="qty-btn" 
              data-action="dec">
              −
            </button>

            <span class="qty-val">
              ${item.qty}
            </span>

            <button 
              class="qty-btn" 
              data-action="inc">
              +
            </button>

            <button 
              class="remove-btn" 
              data-action="remove">
              Remove
            </button>

          </div>
        </div>

        <div class="cart-item-price">
          ${currency(item.price * item.qty)}
        </div>
      `;

      row
        .querySelector('[data-action="inc"]')
        .addEventListener(
          'click',
          () => changeQty(item.id, item.weight, 1)
        );

      row
        .querySelector('[data-action="dec"]')
        .addEventListener(
          'click',
          () => changeQty(item.id, item.weight, -1)
        );

      row
        .querySelector('[data-action="remove"]')
        .addEventListener(
          'click',
          () => removeItem(item.id, item.weight)
        );

      cartItemsEl.appendChild(row);
    });
  }

  const subtotal = cart.reduce(
    (sum, c) => sum + c.price * c.qty,
    0
  );

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIP_THRESHOLD
      ? 0
      : SHIP_COST;

  const total = subtotal + shipping;

  cartSubtotalEl.textContent = currency(subtotal);

  cartShippingEl.textContent =
    shipping === 0
      ? 'Free'
      : currency(shipping);

  cartTotalEl.textContent = currency(total);

  if (
    subtotal > 0 &&
    subtotal < FREE_SHIP_THRESHOLD
  ){
    shipNoteEl.textContent =
      `Add ${currency(FREE_SHIP_THRESHOLD - subtotal)} more for free shipping`;

  } else if (
    subtotal >= FREE_SHIP_THRESHOLD
  ){
    shipNoteEl.textContent =
      `You've unlocked free shipping 🎉`;

  } else {
    shipNoteEl.textContent = '';
  }
}

// ---------- Cart drawer open/close ----------
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');

function openCart(){
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
}

function closeCart(){
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
}

document
  .getElementById('cartToggle')
  .addEventListener('click', openCart);

document
  .getElementById('cartClose')
  .addEventListener('click', closeCart);

cartOverlay.addEventListener('click', closeCart);

document
  .getElementById('checkoutBtn')
  .addEventListener('click', () => {

    if (cart.length === 0){
      showToast(
        'Your cart is empty — add something first'
      );
      return;
    }

    closeCart();
    openCheckout();
  });

// ---------- Checkout / order details modal ----------
const checkoutOverlay =
  document.getElementById('checkoutOverlay');

const checkoutModal =
  document.getElementById('checkoutModal');

const checkoutForm =
  document.getElementById('checkoutForm');

const checkoutConfirm =
  document.getElementById('checkoutConfirm');

const checkoutItemsEl =
  document.getElementById('checkoutItems');

const checkoutItemCountEl =
  document.getElementById('checkoutItemCount');

function currentTotals(){
  const subtotal = cart.reduce(
    (sum, c) => sum + c.price * c.qty,
    0
  );

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIP_THRESHOLD
      ? 0
      : SHIP_COST;

  return {
    subtotal,
    shipping,
    total: subtotal + shipping
  };
}

function renderCheckoutSummary(){
  const totalQty = cart.reduce(
    (sum, c) => sum + c.qty,
    0
  );

  checkoutItemCountEl.textContent =
    `(${totalQty} item${totalQty === 1 ? '' : 's'})`;

  checkoutItemsEl.innerHTML =
    cart.map(item => `
      <div class="checkout-item-row">

        <span class="ci-name">
          ${item.name} × ${item.qty}

          <span class="ci-meta">
            ${item.weight}
          </span>
        </span>

        <span class="ci-price">
          ${currency(item.price * item.qty)}
        </span>

      </div>
    `).join('');

  const {
    subtotal,
    shipping,
    total
  } = currentTotals();

  document.getElementById('coSubtotal').textContent =
    currency(subtotal);

  document.getElementById('coShipping').textContent =
    shipping === 0
      ? 'Free'
      : currency(shipping);

  document.getElementById('coTotal').textContent =
    currency(total);

  document.getElementById('coTotalBtn').textContent =
    currency(total);
}

function openCheckout(){
  checkoutForm.hidden = false;
  checkoutConfirm.hidden = true;

  renderCheckoutSummary();

  checkoutOverlay.classList.add('open');
  checkoutModal.classList.add('open');
}

function closeCheckout(){
  checkoutOverlay.classList.remove('open');
  checkoutModal.classList.remove('open');
}

document
  .getElementById('checkoutClose')
  .addEventListener('click', closeCheckout);

checkoutOverlay.addEventListener(
  'click',
  closeCheckout
);

document
  .getElementById('checkoutFormEl')
  .addEventListener('submit', (e) => {

    e.preventDefault();

    const data = new FormData(e.target);

    const name = data.get('name');
    const payment = data.get('payment');

    const { total } = currentTotals();

    const orderId =
      'OO-' +
      Math.floor(
        100000 + Math.random() * 900000
      );

    const deliveryDate =
      new Date(
        Date.now() +
        4 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(
        'en-IN',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }
      );

    document
      .getElementById('confirmOrderId')
      .textContent = orderId;

    document
      .getElementById('confirmName')
      .textContent =
        `${name} · ${payment}`;

    document
      .getElementById('confirmTotal')
      .textContent =
        currency(total);

    document
      .getElementById('confirmDate')
      .textContent =
        deliveryDate;

    checkoutForm.hidden = true;
    checkoutConfirm.hidden = false;

    // clear the cart — order is "placed"
    cart.length = 0;

    renderCart();

    e.target.reset();
  });

document
  .getElementById('confirmDone')
  .addEventListener(
    'click',
    closeCheckout
  );

// ---------- Toast ----------
const toastEl =
  document.getElementById('toast');

let toastTimer;

function showToast(msg){
  clearTimeout(toastTimer);

  toastEl.textContent = msg;

  toastEl.classList.add('show');

  toastTimer = setTimeout(
    () => toastEl.classList.remove('show'),
    2400
  );
}

// ---------- Newsletter ----------
document
  .getElementById('newsletterForm')
  .addEventListener('submit', (e) => {

    e.preventDefault();

    showToast(
      'Subscribed — welcome to the harvest list 🌰'
    );

    e.target.reset();
  });

// ---------- Sticky header shrink ----------
const header =
  document.getElementById('siteHeader');

window.addEventListener('scroll', () => {
  header.classList.toggle(
    'scrolled',
    window.scrollY > 20
  );
});

// ---------- Mobile nav ----------
const hamburger =
  document.getElementById('hamburger');

const mainNav =
  document.getElementById('mainNav');

hamburger.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

mainNav
  .querySelectorAll('a')
  .forEach(a =>
    a.addEventListener(
      'click',
      () => mainNav.classList.remove('open')
    )
  );

// ---------- Init ----------
renderProducts();
renderCart();
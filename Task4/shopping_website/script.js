/* main.js - beginner friendly, commented
   Adds plus/minus controls beside each menu item and updates counts live.
*/

const DATA_URL = 'restaurent.json'; // data file path

let restaurants = [];          // loaded data
let cart = {};                 // cart { key: { item, qty } } where key = restaurantId + '|' + itemId

// DOM refs
const restaurantsEl = document.getElementById('restaurants');
const loadingEl = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');
const cuisineFilter = document.getElementById('cuisineFilter');
const cartCountEl = document.getElementById('cartCount');
const viewCartBtn = document.getElementById('viewCartBtn');
const restaurantDetail = document.getElementById('restaurantDetail');
const discoverSection = document.getElementById('discover');
const backBtn = document.getElementById('backBtn');
const detailContent = document.getElementById('detailContent');
const cartSection = document.getElementById('cartSection');
const cartItemsEl = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');
const deliveryFee = 30.00;
const checkoutBtn = document.getElementById('checkoutBtn');
const orderMessage = document.getElementById('orderMessage');
const sortBy = document.getElementById('sortBy');

// Simple debounce helper
function debounce(fn, delay=300){ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), delay); }; }

// Fetch data
async function loadData(){
  try {
    const res = await fetch(DATA_URL);
    restaurants = await res.json();
    populateCuisineOptions();
    renderList(restaurants);
  } catch (e){
    loadingEl.textContent = 'Failed to load data. Serve via a local server (see README).';
    console.error(e);
  } finally {
    loadingEl.style.display = 'none';
  }
}

// Populate cuisine filter from data
function populateCuisineOptions(){
  const set = new Set();
  restaurants.forEach(r => r.cuisine.forEach(c => set.add(c)));
  Array.from(set).sort().forEach(c => {
    const opt = document.createElement('option'); opt.value = c; opt.textContent = c;
    cuisineFilter.appendChild(opt);
  });
}

// Render restaurants grid
function renderList(list){
  restaurantsEl.innerHTML = '';
  if(!list.length) { restaurantsEl.innerHTML = '<p class="card">No restaurants found.</p>'; return; }
  list.forEach(r => {
    const card = document.createElement('div'); card.className = 'card restaurant-card';
    card.innerHTML = `
      <img src="${r.image}" alt="${r.name}" loading="lazy">
      <div class="restaurant-info">
        <h3>${r.name}</h3>
        <div class="restaurant-meta">${r.cuisine.join(', ')} • ⭐ ${r.rating} • ${r.delivery_estimate} mins</div>
        <div class="actions">
          <button class="small-btn view-menu" data-id="${r.id}">View Menu</button>
        </div>
      </div>
    `;
    restaurantsEl.appendChild(card);
  });

  // attach listeners for view menu
  document.querySelectorAll('.view-menu').forEach(btn => {
    btn.addEventListener('click', ()=> showRestaurant(btn.dataset.id));
  });
}

// Show restaurant detail & menu (renders add/minus/qty)
function showRestaurant(id){
  const r = restaurants.find(x=>x.id===id);
  if(!r) return;
  discoverSection.classList.add('hidden');
  cartSection.classList.add('hidden');
  restaurantDetail.classList.remove('hidden');
  detailContent.innerHTML = '';
  const wrapper = document.createElement('div');

  // Header info
  wrapper.innerHTML = `
    <div class="card">
      <h2>${r.name}</h2>
      <p class="restaurant-meta">${r.cuisine.join(', ')} • ⭐ ${r.rating} • ${r.delivery_estimate} mins</p>
      <p>${r.description}</p>
    </div>
  `;

  // menu items
  r.menu.forEach(item => {
    const key = r.id + '|' + item.id;
    const qtyInCart = cart[key] ? cart[key].qty : 0;

    const it = document.createElement('div'); it.className='card';
    it.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem">
        <div style="flex:1">
          <h3 style="margin:.2rem 0">${item.name} ${item.veg?'<small>(veg)</small>':''}</h3>
          <div class="restaurant-meta">${item.description}</div>
        </div>
        <div style="text-align:right;min-width:120px">
          <div style="font-weight:600">₹ ${item.price}</div>
          <div style="margin-top:.5rem;display:flex;align-items:center;gap:.5rem;justify-content:flex-end">
            <button class="small-btn minus-btn" data-id="${item.id}" data-restaurant="${r.id}" ${qtyInCart===0 ? 'disabled' : ''}>−</button>
            <span class="menu-qty" data-id="${item.id}" data-restaurant="${r.id}">${qtyInCart}</span>
            <button class="primary add-btn" data-id="${item.id}" data-restaurant="${r.id}">+</button>
          </div>
        </div>
      </div>
    `;
    wrapper.appendChild(it);
  });
  detailContent.appendChild(wrapper);

  // add listeners to add and minus buttons
  attachMenuListeners(r.id);
}

// Attach listeners for add/minus buttons for a given restaurant
function attachMenuListeners(restaurantId){
  // plus / add
  document.querySelectorAll('.add-btn').forEach(b=>{
    b.addEventListener('click', ()=> {
      const dishId = b.dataset.id;
      let dish, rest;
      for(const R of restaurants){
        const found = R.menu.find(m => m.id===dishId);
        if(found){ dish=found; rest=R; break; }
      }
      if(dish) {
        addToCart(dish, rest);
        updateMenuQuantities(restaurantId);
        // if cart is visible update it
        if(!cartSection.classList.contains('hidden')) renderCartItems();
      }
    });
  });

  // minus
  document.querySelectorAll('.minus-btn').forEach(b=>{
    b.addEventListener('click', ()=> {
      const dishId = b.dataset.id;
      const restId = b.dataset.restaurant;
      const key = restId + '|' + dishId;
      if(cart[key]) {
        cart[key].qty = Math.max(0, cart[key].qty - 1);
        if(cart[key].qty === 0) delete cart[key];
        saveCart();
        updateCartCount();
        updateMenuQuantities(restaurantId);
        if(!cartSection.classList.contains('hidden')) renderCartItems();
      }
    });
  });
}

// Update the menu qty spans and minus button states for a restaurant
function updateMenuQuantities(restaurantId){
  document.querySelectorAll('.menu-qty').forEach(span=>{
    const id = span.dataset.id;
    const restId = span.dataset.restaurant;
    if(restId !== restaurantId) return;
    const key = restId + '|' + id;
    const qty = cart[key] ? cart[key].qty : 0;
    span.textContent = qty;
  });
  document.querySelectorAll('.minus-btn').forEach(btn => {
    const key = btn.dataset.restaurant + '|' + btn.dataset.id;
    btn.disabled = !cart[key];
  });
}

// Add to cart
function addToCart(item, restaurant){
  const key = restaurant.id + '|' + item.id;
  if(cart[key]) cart[key].qty += 1;
  else cart[key] = { item: {...item, restaurantName: restaurant.name}, qty: 1 };
  saveCart();
  updateCartCount();
}

// Save/load cart from localStorage
function saveCart(){ localStorage.setItem('food_cart', JSON.stringify(cart)); }
function loadCart(){ cart = JSON.parse(localStorage.getItem('food_cart') || '{}'); updateCartCount(); }

// Update cart count shown in header
function updateCartCount(){
  const sum = Object.values(cart).reduce((s, v)=> s + v.qty, 0);
  cartCountEl.textContent = sum;
}

// Show cart section
function showCart(){
  discoverSection.classList.add('hidden');
  restaurantDetail.classList.add('hidden');
  cartSection.classList.remove('hidden');
  renderCartItems();
}

// Render cart items & summary
function renderCartItems(){
  cartItemsEl.innerHTML = '';
  const rows = Object.entries(cart);
  if(rows.length===0){
    cartItemsEl.innerHTML = '<p class="card">Cart is empty.</p>';
    subtotalEl.textContent='0.00';
    totalEl.textContent='0.00';
    return;
  }
  let subtotal = 0;
  rows.forEach(([key, obj]) => {
    const row = document.createElement('div'); row.className='cart-row';
    const price = obj.item.price * obj.qty;
    subtotal += price;
    row.innerHTML = `
      <div>
        <strong>${obj.item.name}</strong> <div class="restaurant-meta">${obj.item.restaurantName}</div>
        <div style="margin-top:.4rem">
          Qty: <input class="qty-input" type="number" min="1" value="${obj.qty}" data-key="${key}">
          <button class="small-btn remove-btn" data-key="${key}">Remove</button>
        </div>
      </div>
      <div>₹ ${price.toFixed(2)}</div>
    `;
    cartItemsEl.appendChild(row);
  });

  // attach qty and remove listeners
  document.querySelectorAll('.qty-input').forEach(inp=>{
    inp.addEventListener('change', (e)=>{
      const k = e.target.dataset.key; const v = Number(e.target.value) || 1;
      cart[k].qty = v; saveCart(); renderCartItems(); updateCartCount();
    });
  });
  document.querySelectorAll('.remove-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> { const k=btn.dataset.key; delete cart[k]; saveCart(); renderCartItems(); updateCartCount(); });
  });

  subtotalEl.textContent = subtotal.toFixed(2);
  const total = subtotal + deliveryFee;
  totalEl.textContent = total.toFixed(2);
}

// Mock checkout
function placeOrder(){
  const rows = Object.keys(cart);
  if(rows.length===0){ alert('Cart is empty'); return; }
  // simple order object
  const order = { id: 'ORD' + Date.now(), items: cart, total: Number(totalEl.textContent), date: new Date().toISOString() };
  // save orders to localStorage (simple order history)
  const orders = JSON.parse(localStorage.getItem('food_orders') || '[]');
  orders.push(order);
  localStorage.setItem('food_orders', JSON.stringify(orders));
  cart = {}; saveCart(); renderCartItems(); updateCartCount();
  orderMessage.textContent = `Order placed! (Mock) Order ID: ${order.id}`; orderMessage.classList.remove('hidden');
  setTimeout(()=> orderMessage.classList.add('hidden'), 6000);
}

// Navigation helpers
viewCartBtn.addEventListener('click', showCart);
backBtn.addEventListener('click', ()=> {
  restaurantDetail.classList.add('hidden'); cartSection.classList.add('hidden'); discoverSection.classList.remove('hidden');
});
checkoutBtn.addEventListener('click', placeOrder);

// Search + filter + sort pipeline
function getFilteredList(){
  const q = searchInput.value.trim().toLowerCase();
  const cuisine = cuisineFilter.value;
  const sort = sortBy.value;
  let list = restaurants.slice();

  if(q){
    list = list.filter(r => r.name.toLowerCase().includes(q) || r.menu.some(m => m.name.toLowerCase().includes(q)));
  }
  if(cuisine) list = list.filter(r => r.cuisine.includes(cuisine));
  // sort
  if(sort==='rating') list.sort((a,b)=> b.rating - a.rating);
  if(sort==='delivery') list.sort((a,b)=> a.delivery_estimate - b.delivery_estimate);
  if(sort==='price') list.sort((a,b)=> a.price_level - b.price_level);

  return list;
}

const debouncedRender = debounce(()=> renderList(getFilteredList()), 300);
searchInput.addEventListener('input', debouncedRender);
cuisineFilter.addEventListener('change', ()=> renderList(getFilteredList()));
sortBy.addEventListener('change', ()=> renderList(getFilteredList()));

// initial boot
loadCart();
loadData();

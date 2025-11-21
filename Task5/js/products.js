// products.js
// Product data + Amazon/Flipkart-style cards + search + filters

// NOTE: you can reuse the same images for multiple products (product1.jpg...)
// or create new ones like product5.jpg etc.

const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 1999,
    originalPrice: 2999,
    rating: 4.3,
    image: "/images/product1.jpg",
  },
  {
    id: 2,
    name: "Smart Fitness Watch with Heart Rate Monitor",
    price: 2499,
    originalPrice: 3999,
    rating: 4.1,
    image: "/images/product2.jpg",
  },
  {
    id: 3,
    name: "Portable Bluetooth Speaker (10W, Deep Bass)",
    price: 1499,
    originalPrice: 2499,
    rating: 4.5,
    image: "/images/product3.jpg",
  },
  {
    id: 4,
    name: "Ergonomic Gaming Mouse (RGB, 6 Buttons)",
    price: 899,
    originalPrice: 1599,
    rating: 4.0,
    image: "/images/product4.jpg",
  },
  {
    id: 5,
    name: "Noise Cancelling Wired Earphones",
    price: 549,
    originalPrice: 999,
    rating: 3.9,
    image: "/images/product5.jpeg",
  },
  {
    id: 6,
    name: "Dual-Port Fast Wall Charger 18W",
    price: 699,
    originalPrice: 1299,
    rating: 4.2,
    image: "/images/product6.jpeg",
  },
  {
    id: 7,
    name: "Wireless Keyboard and Mouse Combo",
    price: 1899,
    originalPrice: 2699,
    rating: 4.1,
    image: "/images/product7.jpeg",
  },
  {
    id: 8,
    name: "27W Type-C Power Bank 10000mAh",
    price: 1299,
    originalPrice: 1999,
    rating: 4.4,
    image: "/images/product8.jpeg",
  },
  {
    id: 9,
    name: "Full HD Web Camera with Microphone",
    price: 2799,
    originalPrice: 3499,
    rating: 4.0,
    image: "/images/product9.jpeg",
  },
  {
    id: 10,
    name: "RGB Gaming Headset with Mic",
    price: 1599,
    originalPrice: 2499,
    rating: 4.2,
    image: "/images/product10.jpeg",
  },
  {
    id: 11,
    name: "Laptop Cooling Pad with Dual Fans",
    price: 999,
    originalPrice: 1599,
    rating: 3.8,
    image: "/images/product11.jpeg",
  },
  {
    id: 12,
    name: "Mechanical Gaming Keyboard (Blue Switch)",
    price: 3499,
    originalPrice: 4999,
    rating: 4.6,
    image: "/images/product12.jpeg",
  },
];

// Helpers

function getDiscountPercentage(p) {
  if (!p.originalPrice || p.originalPrice <= p.price) return 0;
  return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
}

function createProductCardHTML(p) {
  const discount = getDiscountPercentage(p);
  return `
    <div class="product-card">
      <div class="product-image-wrapper">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-name">${p.name}</div>
      <div class="product-rating-row">
        <span class="rating-badge">
          <span>${p.rating.toFixed(1)}</span>
          <span class="rating-star">&#9733;</span>
        </span>
        <span>5,000+ ratings</span>
      </div>
      <div class="product-price-row">
        <span class="product-price">₹${p.price}</span>
        <span class="product-original">₹${p.originalPrice}</span>
        <span class="product-discount">${discount}% off</span>
      </div>
      <div class="product-meta">
        Free delivery &middot; Pay on Delivery
      </div>
      <button class="btn add-to-cart" data-id="${p.id}">Add to Cart</button>
    </div>
  `;
}

function createRowCardHTML(p) {
  const discount = getDiscountPercentage(p);
  return `
    <div class="product-row-card">
      <div class="product-image-wrapper">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-name">${p.name}</div>
      <div class="product-rating-row">
        <span class="rating-badge">
          <span>${p.rating.toFixed(1)}</span>
          <span class="rating-star">&#9733;</span>
        </span>
        <span>4K+ ratings</span>
      </div>
      <div class="product-price-row">
        <span class="product-price">₹${p.price}</span>
        <span class="product-original">₹${p.originalPrice}</span>
        <span class="product-discount">${discount}% off</span>
      </div>
      <button class="btn add-to-cart" data-id="${p.id}">Add to Cart</button>
    </div>
  `;
}

// Render helpers

function renderProductGrid(selector, list) {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = list.map(createProductCardHTML).join("");

  container.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.dataset.id, 10);
      addToCart(id);
    });
  });
}

function renderProductRow(selector, list) {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = list.map(createRowCardHTML).join("");

  container.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.dataset.id, 10);
      addToCart(id);
    });
  });
}

// ---- SEARCH + FILTER LOGIC (products page) ---- //

function getFilteredProducts() {
  let list = products.slice();

  // search term
  const searchInput = document.querySelector(".header-search-input");
  const term = searchInput ? searchInput.value.toLowerCase().trim() : "";

  if (term) {
    list = list.filter((p) => p.name.toLowerCase().includes(term));
  }

  // price filters
  const priceChecks = Array.from(
    document.querySelectorAll(".filter-price:checked")
  ).map((c) => c.value);

  if (priceChecks.length > 0) {
    list = list.filter((p) => {
      return priceChecks.some((val) => {
        if (val === "under-1000") return p.price < 1000;
        if (val === "1000-2500") return p.price >= 1000 && p.price <= 2500;
        if (val === "above-2500") return p.price > 2500;
        return true;
      });
    });
  }

  // rating filters
  const ratingChecks = Array.from(
    document.querySelectorAll(".filter-rating:checked")
  ).map((c) => c.value);

  if (ratingChecks.length > 0) {
    // if 4+ selected -> minRating 4, else if only 3+ -> minRating 3
    let minRating = 0;
    if (ratingChecks.includes("4plus")) {
      minRating = 4;
    } else if (ratingChecks.includes("3plus")) {
      minRating = 3;
    }
    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating);
    }
  }

  return list;
}

function setupSearchAndFilters() {
  const searchInput = document.querySelector(".header-search-input");
  const priceFilters = document.querySelectorAll(".filter-price");
  const ratingFilters = document.querySelectorAll(".filter-rating");
  const productsGrid = document.querySelector(".all-products-grid");
  if (!productsGrid) return; // not on products page

  function updateGrid() {
    const filtered = getFilteredProducts();
    renderProductGrid(".all-products-grid", filtered);
  }

  if (searchInput) {
    searchInput.addEventListener("input", updateGrid);
  }

  priceFilters.forEach((cb) => cb.addEventListener("change", updateGrid));
  ratingFilters.forEach((cb) => cb.addEventListener("change", updateGrid));

  // initial render
  updateGrid();
}

// ---- INIT ---- //

document.addEventListener("DOMContentLoaded", function () {
  // Home page
  if (document.querySelector("#top-deals-row")) {
    renderProductRow("#top-deals-row", products.slice(0, 6));
  }
  if (document.querySelector(".featured-products")) {
    renderProductGrid(".featured-products", products.slice(0, 8));
  }

  // Products page
  if (document.querySelector(".all-products-grid")) {
    setupSearchAndFilters();
  }
});

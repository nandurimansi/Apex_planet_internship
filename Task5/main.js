// main.js
// Shared cart helpers + navbar cart count + contact form validation

const CART_KEY = "megamart-cart";

function getCart() {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error reading cart from localStorage", e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("Error saving cart to localStorage", e);
  }
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.qty || 0), 0);
}

function updateCartCount() {
  const span = document.getElementById("cart-count");
  if (!span) return;
  span.textContent = `(${getCartCount()})`;
}

// Add to cart (products array from products.js)
function addToCart(productId) {
  if (typeof products === "undefined") return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    cart.push({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      rating: p.rating,
      originalPrice: p.originalPrice,
      qty: 1,
    });
  }

  saveCart(cart);
  updateCartCount();
}

// Contact form validation
function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");
  const successMsg = document.getElementById("contact-success");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;

    // Name
    if (!nameInput.value.trim()) {
      nameError.textContent = "Name is required.";
      valid = false;
    } else {
      nameError.textContent = "";
    }

    // Email
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      emailError.textContent = "Email is required.";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(emailVal)) {
      emailError.textContent = "Enter a valid email.";
      valid = false;
    } else {
      emailError.textContent = "";
    }

    // Message
    if (!messageInput.value.trim()) {
      messageError.textContent = "Message is required.";
      valid = false;
    } else {
      messageError.textContent = "";
    }

    if (valid) {
      // 👉 POPUP
      alert("Thank you! Your message has been received (demo only).");

      // optional: also show the line below form if you want
      if (successMsg) {
        successMsg.style.display = "block";
      }

      form.reset();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  setupContactForm();
});

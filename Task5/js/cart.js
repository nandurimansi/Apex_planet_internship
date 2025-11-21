// cart.js
// Cart page: render, update qty, remove items

function removeCartItem(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
}

function updateCartItemQuantity(productId, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty = qty;
  saveCart(cart);
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const priceEl = document.getElementById("cart-price");
  const emptyMsg = document.getElementById("empty-cart-message");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (!container || !totalEl || !priceEl || !emptyMsg) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = "";
    totalEl.textContent = "₹0";
    priceEl.textContent = "₹0";
    emptyMsg.style.display = "block";
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  emptyMsg.style.display = "none";
  if (checkoutBtn) checkoutBtn.disabled = false;

  let rowsHtml = "";
  let total = 0;

  cart.forEach((item) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    rowsHtml += `
      <tr>
        <td class="cart-product">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          <span>${item.name}</span>
        </td>
        <td>₹${item.price}</td>
        <td>
          <input
            type="number"
            min="1"
            class="cart-qty-input"
            data-id="${item.id}"
            value="${item.qty}"
          >
        </td>
        <td>₹${subtotal}</td>
        <td>
          <button class="btn" data-id="${item.id}">Remove</button>
        </td>
      </tr>
    `;
  });

  container.innerHTML = rowsHtml;
  totalEl.textContent = `₹${total}`;
  priceEl.textContent = `₹${total}`;

  // Qty change
  container.querySelectorAll(".cart-qty-input").forEach((input) => {
    input.addEventListener("change", function () {
      let newQty = parseInt(this.value, 10);
      if (isNaN(newQty) || newQty < 1) {
        newQty = 1;
        this.value = "1";
      }
      const id = parseInt(this.dataset.id, 10);
      updateCartItemQuantity(id, newQty);
      renderCart();
      updateCartCount();
    });
  });

  // Remove buttons
  container.querySelectorAll("button.btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.dataset.id, 10);
      removeCartItem(id);
      renderCart();
      updateCartCount();
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderCart();
});

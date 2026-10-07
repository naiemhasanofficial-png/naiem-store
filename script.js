const WHATSAPP_NUMBER = "8801632189981";

// ===============================
// PRODUCTS
// ===============================
const products = [
  {
    id: 1,
    name: "Jiayou Bass 5 Wired 3.5mm Earphone",
    price: 200,
    oldPrice: 250,
    emoji: "🎧",
    badge: "NEW",
    category: "Earphone",
    desc: "10mm Driver, 20Hz–20KHz Frequency Response, 3.5mm Wired Connection, Built-in Microphone এবং ergonomic in-ear design। Music listening ও voice calling-এর জন্য উপযোগী।"
  }
];

// ===============================
// CART
// ===============================
let cart = JSON.parse(localStorage.getItem("naiemStoreCart")) || [];

// Remove products that no longer exist
cart = cart.filter(item =>
  products.some(product => product.id === item.id)
);

localStorage.setItem("naiemStoreCart", JSON.stringify(cart));


// ===============================
// ELEMENTS
// ===============================
const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");


// ===============================
// DISPLAY PRODUCTS
// ===============================
function displayProducts(productList = products) {
  if (!productGrid) return;

  if (productList.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-products">
        এখনো কোনো পণ্য পাওয়া যায়নি।
      </div>
    `;
    return;
  }

  productGrid.innerHTML = productList.map(product => `
    <div class="product-card">

      <div class="product-image">
        <div class="product-placeholder">
          ${product.emoji || "🛍️"}
        </div>

        ${product.badge ? `
          <span class="product-badge">
            ${product.badge}
          </span>
        ` : ""}
      </div>

      <div class="product-info">

        <h3>${product.name}</h3>

        <p class="product-description">
          ${product.desc}
        </p>

        <div class="product-price">
          <strong>৳${product.price}</strong>

          ${product.oldPrice ? `
            <del>৳${product.oldPrice}</del>
          ` : ""}
        </div>

        <button
          class="add-to-cart"
          onclick="addToCart(${product.id})">
          🛒 কার্টে যোগ করুন
        </button>

      </div>

    </div>
  `).join("");
}


// ===============================
// ADD TO CART
// ===============================
function addToCart(productId) {

  const product = products.find(p => p.id === productId);

  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  saveCart();

  alert(`${product.name} কার্টে যোগ হয়েছে!`);
}


// ===============================
// REMOVE FROM CART
// ===============================
function removeFromCart(productId) {

  cart = cart.filter(item => item.id !== productId);

  saveCart();
}


// ===============================
// CHANGE QUANTITY
// ===============================
function changeQuantity(productId, change) {

  const item = cart.find(item => item.id === productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  }

  saveCart();
}


// ===============================
// SAVE CART
// ===============================
function saveCart() {

  localStorage.setItem(
    "naiemStoreCart",
    JSON.stringify(cart)
  );

  updateCart();
}


// ===============================
// UPDATE CART
// ===============================
function updateCart() {

  if (!cartItems) return;

  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="empty-cart">
        🛒 আপনার কার্ট এখনো খালি।
      </div>
    `;

    if (cartTotal) {
      cartTotal.textContent = "৳0";
    }

    if (cartCount) {
      cartCount.textContent = "0";
    }

    return;
  }


  cartItems.innerHTML = cart.map(item => {

    const subtotal = item.price * item.quantity;

    return `
      <div class="cart-item">

        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <span>৳${item.price} × ${item.quantity}</span>
        </div>

        <div class="cart-controls">

          <button onclick="changeQuantity(${item.id}, -1)">
            −
          </button>

          <span>${item.quantity}</span>

          <button onclick="changeQuantity(${item.id}, 1)">
            +
          </button>

          <button
            class="remove-cart"
            onclick="removeFromCart(${item.id})">
            ✕
          </button>

        </div>

        <strong>
          ৳${subtotal}
        </strong>

      </div>
    `;

  }).join("");


  const total = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );


  if (cartTotal) {
    cartTotal.textContent = `৳${total}`;
  }

  if (cartCount) {
    cartCount.textContent = totalQuantity;
  }
}


// ===============================
// SEARCH
// ===============================
if (searchInput) {

  searchInput.addEventListener("input", function () {

    const searchTerm =
      this.value.toLowerCase().trim();

    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.desc.toLowerCase().includes(searchTerm)
    );

    displayProducts(filteredProducts);

  });

}


// ===============================
// CATEGORY FILTER
// ===============================
if (categoryFilter) {

  categoryFilter.addEventListener("change", function () {

    const selectedCategory = this.value;

    if (
      selectedCategory === "" ||
      selectedCategory === "all"
    ) {
      displayProducts(products);
      return;
    }

    const filteredProducts = products.filter(
      product =>
        product.category === selectedCategory
    );

    displayProducts(filteredProducts);

  });

}


// ===============================
// WHATSAPP CHECKOUT
// ===============================
function checkoutWhatsApp() {

  if (cart.length === 0) {
    alert("আপনার কার্ট খালি। আগে একটি পণ্য যোগ করুন।");
    return;
  }


  let message =
    "🛍️ *Naiem Store - Order*\n\n";


  cart.forEach((item, index) => {

    message +=
      `${index + 1}. ${item.name}\n`;

    message +=
      `Quantity: ${item.quantity}\n`;

    message +=
      `Price: ৳${item.price}\n`;

    message +=
      `Subtotal: ৳${item.price * item.quantity}\n\n`;

  });


  const total = cart.reduce(
    (sum, item) =>
      sum + (item.price * item.quantity),
    0
  );


  message +=
    `💰 *Total: ৳${total}*\n\n`;

  message +=
    "🚚 ভালুকার মধ্যে Delivery FREE\n";

  message +=
    "💵 Cash on Delivery\n\n";

  message +=
    "📍 আমার ঠিকানা:\n";

  message +=
    "📞 ফোন নম্বর:\n";


  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=` +
    encodeURIComponent(message);


  window.open(
    whatsappURL,
    "_blank"
  );
}


// ===============================
// CONTACT WHATSAPP
// ===============================
function contactWhatsApp() {

  const message =
    "আসসালামু আলাইকুম, Naiem Store থেকে একটি পণ্য সম্পর্কে জানতে চাই।";

  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=` +
    encodeURIComponent(message);

  window.open(
    whatsappURL,
    "_blank"
  );
}


// ===============================
// INITIAL LOAD
// ===============================
displayProducts(products);
updateCart();


// ===============================
// KEEP PAGE AT TOP ON LOAD
// ===============================
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", function () {
  window.scrollTo(0, 0);
});

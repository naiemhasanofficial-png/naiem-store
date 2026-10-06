// ===============================
// NAIEM STORE - SCRIPT.JS
// ===============================

// আপনার WhatsApp নম্বর
const WHATSAPP_NUMBER = "8801632189981";

// ==========================================
// PRODUCTS
// এখন কোনো Demo Product নেই
// পরে এখানেই আপনার আসল পণ্য যোগ হবে
// ==========================================

const products = [];

// ==========================================
// CART
// ==========================================

let cart = JSON.parse(localStorage.getItem("naiemStoreCart")) || [];

// পুরোনো Demo Product থাকলে Cart থেকে সরিয়ে দেওয়া হবে
cart = cart.filter(item =>
  products.some(product => product.id === item.id)
);

localStorage.setItem("naiemStoreCart", JSON.stringify(cart));


// ==========================================
// ELEMENTS
// ==========================================

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(productList = products) {

  if (!productGrid) return;

  // কোনো Product না থাকলে
  if (productList.length === 0) {

    productGrid.innerHTML = `
      <div class="empty-products">
        <div class="empty-icon">🛍️</div>
        <h3>এখনো কোনো পণ্য যোগ করা হয়নি</h3>
        <p>
          খুব শীঘ্রই আমাদের নতুন নতুন পণ্য এখানে যোগ করা হবে।
        </p>
      </div>
    `;

    return;
  }

  productGrid.innerHTML = productList.map(product => {

    return `
      <div class="product-card">

        <div class="product-image">

          ${product.badge ? `
            <span class="product-badge">
              ${product.badge}
            </span>
          ` : ""}

          ${
            product.image
              ? `<img src="${product.image}" alt="${product.name}">`
              : `<div class="product-placeholder">${product.emoji || "🛍️"}</div>`
          }

        </div>

        <div class="product-info">

          <h3>${product.name}</h3>

          ${
            product.desc
              ? `<p class="product-description">${product.desc}</p>`
              : ""
          }

          <div class="product-price">

            <span class="current-price">
              ৳${Number(product.price).toLocaleString("en-BD")}
            </span>

            ${
              product.oldPrice
                ? `
                  <span class="old-price">
                    ৳${Number(product.oldPrice).toLocaleString("en-BD")}
                  </span>
                `
                : ""
            }

          </div>

          <button
            class="add-to-cart-btn"
            onclick="addToCart(${product.id})"
          >
            🛒 কার্টে যোগ করুন
          </button>

        </div>

      </div>
    `;

  }).join("");
}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(productId) {

  const product = products.find(
    item => item.id === productId
  );

  if (!product) return;

  const existingItem = cart.find(
    item => item.id === productId
  );

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

  alert(`${product.name} কার্টে যোগ করা হয়েছে।`);
}


// ==========================================
// REMOVE FROM CART
// ==========================================

function removeFromCart(productId) {

  cart = cart.filter(
    item => item.id !== productId
  );

  saveCart();
}


// ==========================================
// CHANGE QUANTITY
// ==========================================

function changeQuantity(productId, change) {

  const item = cart.find(
    item => item.id === productId
  );

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {

    cart = cart.filter(
      item => item.id !== productId
    );

  }

  saveCart();
}


// ==========================================
// SAVE CART
// ==========================================

function saveCart() {

  localStorage.setItem(
    "naiemStoreCart",
    JSON.stringify(cart)
  );

  displayCart();
}


// ==========================================
// DISPLAY CART
// ==========================================

function displayCart() {

  if (!cartItems) return;

  // Cart খালি
  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="empty-cart">

        <div class="empty-cart-icon">🛒</div>

        <h3>আপনার Cart খালি</h3>

        <p>
          পণ্য যোগ করলে এখানে দেখা যাবে।
        </p>

      </div>
    `;

    if (cartCount) {
      cartCount.textContent = "0";
    }

    if (cartTotal) {
      cartTotal.textContent = "৳0";
    }

    return;
  }


  let total = 0;
  let totalQuantity = 0;


  cartItems.innerHTML = cart.map(item => {

    const itemTotal =
      Number(item.price) * Number(item.quantity);

    total += itemTotal;
    totalQuantity += Number(item.quantity);


    return `
      <div class="cart-item">

        <div class="cart-item-info">

          <h4>${item.name}</h4>

          <p>
            ৳${Number(item.price).toLocaleString("en-BD")}
            × ${item.quantity}
          </p>

        </div>


        <div class="cart-item-actions">

          <button
            onclick="changeQuantity(${item.id}, -1)"
          >
            −
          </button>

          <span>
            ${item.quantity}
          </span>

          <button
            onclick="changeQuantity(${item.id}, 1)"
          >
            +
          </button>

          <button
            class="remove-cart-item"
            onclick="removeFromCart(${item.id})"
          >
            ✕
          </button>

        </div>

        <div class="cart-item-total">

          ৳${itemTotal.toLocaleString("en-BD")}

        </div>

      </div>
    `;

  }).join("");


  if (cartCount) {
    cartCount.textContent = totalQuantity;
  }

  if (cartTotal) {
    cartTotal.textContent =
      `৳${total.toLocaleString("en-BD")}`;
  }
}


// ==========================================
// WHATSAPP ORDER
// ==========================================

function orderViaWhatsApp() {

  // Cart খালি হলে WhatsApp খুলবে না
  if (cart.length === 0) {

    alert(
      "আপনার Cart এখনো খালি। আগে কোনো পণ্য Cart-এ যোগ করুন।"
    );

    return;
  }


  let message =
    "🛍️ *Naiem Store - New Order*%0A%0A";


  message += "📦 *Products:*%0A";


  let total = 0;


  cart.forEach((item, index) => {

    const itemTotal =
      Number(item.price) * Number(item.quantity);

    total += itemTotal;


    message +=
      `${index + 1}. ${item.name}%0A` +
      `   Quantity: ${item.quantity}%0A` +
      `   Price: ৳${Number(item.price).toLocaleString("en-BD")}%0A` +
      `   Subtotal: ৳${itemTotal.toLocaleString("en-BD")}%0A%0A`;

  });


  message +=
    `💰 *Total: ৳${total.toLocaleString("en-BD")}*%0A%0A`;

  message +=
    "🚚 Delivery: ভালুকার মধ্যে FREE DELIVERY%0A";

  message +=
    "📍 ভালুকার বাইরে Delivery Charge প্রযোজ্য।%0A%0A";


  message +=
    "👤 *Customer Information:*%0A";

  message +=
    "Name: %0A";

  message +=
    "Phone: %0A";

  message +=
    "Address: %0A%0A";

  message +=
    "💵 Payment: Cash on Delivery";


  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


  window.open(
    whatsappURL,
    "_blank"
  );
}


// ==========================================
// SEARCH
// ==========================================

function searchProducts() {

  if (!searchInput) return;

  const searchTerm =
    searchInput.value
      .toLowerCase()
      .trim();


  const filteredProducts =
    products.filter(product => {

      const name =
        product.name
          .toLowerCase();

      const description =
        (product.desc || "")
          .toLowerCase();


      return (
        name.includes(searchTerm) ||
        description.includes(searchTerm)
      );

    });


  displayProducts(filteredProducts);
}


// ==========================================
// CATEGORY FILTER
// ==========================================

function filterProducts() {

  if (!categoryFilter) return;

  const category =
    categoryFilter.value;


  if (
    !category ||
    category === "all"
  ) {

    displayProducts(products);

    return;
  }


  const filteredProducts =
    products.filter(
      product =>
        product.category === category
    );


  displayProducts(filteredProducts);
}


// ==========================================
// SEARCH EVENT
// ==========================================

if (searchInput) {

  searchInput.addEventListener(
    "input",
    searchProducts
  );

}


// ==========================================
// CATEGORY EVENT
// ==========================================

if (categoryFilter) {

  categoryFilter.addEventListener(
    "change",
    filterProducts
  );

}


// ==========================================
// INITIAL LOAD
// ==========================================

displayProducts();
displayCart();


// ==========================================
// MAKE FUNCTIONS AVAILABLE
// ==========================================

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQuantity = changeQuantity;
window.orderViaWhatsApp = orderViaWhatsApp;
window.searchProducts = searchProducts;
window.filterProducts = filterProducts;

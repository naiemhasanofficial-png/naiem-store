// =====================================================
// NAIEM STORE — PRODUCT & CART SYSTEM
// =====================================================

// আপনার WhatsApp নম্বর
// Bangladesh format: 8801XXXXXXXXX
// + বা space ব্যবহার করবেন না।
const WHATSAPP_NUMBER = "8801632189981";


// =====================================================
// PRODUCTS
// =====================================================
//
// এখন কোনো Demo Product রাখা হয়নি।
// তাই website-এ বর্তমানে কোনো product দেখাবে না।
//
// পরে আপনার আসল product এখানে যোগ করবেন।
//
// Example:
//
// {
//   id: 1,
//   name: "আপনার পণ্যের নাম",
//   price: 1200,
//   oldPrice: 1500,
//   emoji: "🛍️",
//   badge: "NEW",
//   desc: "পণ্যের সংক্ষিপ্ত বর্ণনা"
// }
//
// =====================================================

const products = [];


// =====================================================
// CART
// =====================================================

// পুরোনো localStorage cart পরিষ্কার করা হচ্ছে
// যাতে আগের Demo Product আর দেখা না যায়।

let cart = [];

try {

    const oldCart = JSON.parse(
        localStorage.getItem("naiemCart") || "[]"
    );

    if (Array.isArray(oldCart)) {

        // শুধু বর্তমানে থাকা product-এর cart item রাখবে
        cart = oldCart.filter(item =>
            products.some(product => product.id === item.id)
        );

    }

} catch (error) {

    cart = [];

}


// নতুন clean cart save
localStorage.setItem(
    "naiemCart",
    JSON.stringify(cart)
);


// =====================================================
// MONEY FORMAT
// =====================================================

function money(amount) {

    return "৳" + Number(amount).toLocaleString("bn-BD");

}


// =====================================================
// RENDER PRODUCTS
// =====================================================

function renderProducts() {

    const searchElement =
        document.getElementById("search");

    const productGrid =
        document.getElementById("productGrid");


    if (!productGrid) {
        return;
    }


    const searchText =
        searchElement
            ? searchElement.value.trim().toLowerCase()
            : "";


    // -------------------------------------------------
    // যদি কোনো Product না থাকে
    // -------------------------------------------------

    if (products.length === 0) {

        productGrid.innerHTML = `

            <div
                class="empty-products"
                style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                    border: 1px dashed #d9d9d9;
                    border-radius: 20px;
                    background: #fafafa;
                "
            >

                <div
                    style="
                        font-size: 52px;
                        margin-bottom: 12px;
                    "
                >
                    🛍️
                </div>

                <h3
                    style="
                        margin: 0 0 10px;
                        font-size: 24px;
                    "
                >
                    এখনো কোনো পণ্য যোগ করা হয়নি
                </h3>

                <p
                    style="
                        margin: 0;
                        color: #777;
                        font-size: 15px;
                    "
                >
                    আপনার আসল পণ্যের ছবি, নাম, দাম ও
                    বিবরণ যোগ করলে এখানে দেখা যাবে।
                </p>

            </div>

        `;

        return;
    }


    // -------------------------------------------------
    // Search
    // -------------------------------------------------

    const filteredProducts =
        products.filter(product =>
            product.name
                .toLowerCase()
                .includes(searchText)
        );


    // -------------------------------------------------
    // No Search Result
    // -------------------------------------------------

    if (filteredProducts.length === 0) {

        productGrid.innerHTML = `

            <div
                style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 50px 20px;
                "
            >

                <div style="font-size: 42px;">
                    🔍
                </div>

                <h3>
                    কোনো পণ্য পাওয়া যায়নি
                </h3>

            </div>

        `;

        return;
    }


    // -------------------------------------------------
    // Product Cards
    // -------------------------------------------------

    productGrid.innerHTML =
        filteredProducts.map(product => `

            <article class="product">

                <div class="product-img">

                    ${
                        product.badge
                            ? `
                                <span class="badge">
                                    ${product.badge}
                                </span>
                              `
                            : ""
                    }

                    <span>
                        ${product.emoji || "🛍️"}
                    </span>

                </div>


                <div class="product-body">

                    <h3>
                        ${product.name}
                    </h3>


                    <p>
                        ${product.desc || ""}
                    </p>


                    <div>

                        <span class="price">
                            ${money(product.price)}
                        </span>

                        ${
                            product.oldPrice
                                ? `
                                    <span class="old">
                                        ${money(product.oldPrice)}
                                    </span>
                                  `
                                : ""
                        }

                    </div>


                    <button
                        class="btn primary add"
                        onclick="addToCart(${product.id})"
                    >
                        🛒 কার্টে যোগ করুন
                    </button>

                </div>

            </article>

        `).join("");

}


// =====================================================
// SAVE CART
// =====================================================

function saveCart() {

    localStorage.setItem(
        "naiemCart",
        JSON.stringify(cart)
    );

    updateCartCount();

}


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    // Product না পাওয়া গেলে
    if (!product) {

        alert(
            "এই পণ্যটি বর্তমানে পাওয়া যাচ্ছে না।"
        );

        return;
    }


    // আগে থেকে cart-এ আছে কি না
    const existingItem =
        cart.find(
            item => item.id === productId
        );


    if (existingItem) {

        existingItem.qty += 1;

    } else {

        cart.push({

            id: productId,

            qty: 1

        });

    }


    saveCart();

    openCart();

}


// =====================================================
// CHANGE QUANTITY
// =====================================================

function changeQty(productId, change) {

    const item =
        cart.find(
            cartItem => cartItem.id === productId
        );


    if (!item) {
        return;
    }


    item.qty += change;


    // Quantity 0 হলে product remove
    if (item.qty <= 0) {

        cart =
            cart.filter(
                cartItem =>
                    cartItem.id !== productId
            );

    }


    saveCart();

    renderCart();

}


// =====================================================
// RENDER CART
// =====================================================

function renderCart() {

    const cartBox =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");


    if (!cartBox || !cartTotal) {
        return;
    }


    // -------------------------------------------------
    // পুরোনো / invalid cart item remove
    // -------------------------------------------------

    cart =
        cart.filter(
            item =>
                products.some(
                    product =>
                        product.id === item.id
                )
        );


    // -------------------------------------------------
    // Empty Cart
    // -------------------------------------------------

    if (cart.length === 0) {

        cartBox.innerHTML = `

            <div
                style="
                    text-align: center;
                    padding: 28px 10px;
                    color: #666;
                "
            >

                <div
                    style="
                        font-size: 46px;
                        margin-bottom: 10px;
                    "
                >
                    🛒
                </div>


                <strong
                    style="
                        display: block;
                        font-size: 19px;
                        color: #222;
                        margin-bottom: 6px;
                    "
                >
                    আপনার কার্ট এখনো খালি।
                </strong>


                <p
                    style="
                        margin: 0;
                        font-size: 14px;
                    "
                >
                    পণ্য যোগ করলে এখানে দেখা যাবে।
                </p>

            </div>

        `;


        cartTotal.textContent = "৳0";

        saveCart();

        return;
    }


    // -------------------------------------------------
    // Cart Items
    // -------------------------------------------------

    let total = 0;


    cartBox.innerHTML =
        cart.map(item => {

            const product =
                products.find(
                    p => p.id === item.id
                );


            if (!product) {
                return "";
            }


            const subtotal =
                product.price * item.qty;


            total += subtotal;


            return `

                <div class="cart-line">

                    <div>

                        <b>
                            ${product.name}
                        </b>

                        <br>

                        <span>
                            ${money(product.price)}
                            ×
                            ${item.qty}
                        </span>

                    </div>


                    <div class="qty">

                        <button
                            onclick="changeQty(
                                ${product.id},
                                -1
                            )"
                        >
                            −
                        </button>


                        ${item.qty}


                        <button
                            onclick="changeQty(
                                ${product.id},
                                1
                            )"
                        >
                            +
                        </button>


                        <br>


                        <b>
                            ${money(subtotal)}
                        </b>

                    </div>

                </div>

            `;

        }).join("");


    cartTotal.textContent =
        money(total);

}


// =====================================================
// UPDATE CART COUNT
// =====================================================

function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");


    if (!cartCount) {
        return;
    }


    const count =
        cart.reduce(
            (total, item) =>
                total + item.qty,
            0
        );


    cartCount.textContent =
        count;

}


// =====================================================
// OPEN CART
// =====================================================

function openCart() {

    renderCart();

    const cartModal =
        document.getElementById("cartModal");


    if (cartModal) {

        cartModal.classList.add("show");

    }

}


// =====================================================
// CLOSE CART
// =====================================================

function closeCart() {

    const cartModal =
        document.getElementById("cartModal");


    if (cartModal) {

        cartModal.classList.remove("show");

    }

}


// =====================================================
// WHATSAPP CHECKOUT
// =====================================================

function checkout() {

    // -------------------------------------------------
    // Empty cart protection
    // -------------------------------------------------

    if (cart.length === 0) {

        alert(
            "আপনার কার্ট এখনো খালি। আগে একটি পণ্য যোগ করুন।"
        );

        return;
    }


    let total = 0;


    const orderLines = [

        "🛒 *Naiem Store — New Order*",

        ""

    ];


    // -------------------------------------------------
    // Products
    // -------------------------------------------------

    cart.forEach(item => {

        const product =
            products.find(
                p => p.id === item.id
            );


        if (!product) {
            return;
        }


        const subtotal =
            product.price * item.qty;


        total += subtotal;


        orderLines.push(

            `• ${product.name} × ${item.qty} = ${money(subtotal)}`

        );

    });


    // -------------------------------------------------
    // Customer information
    // -------------------------------------------------

    orderLines.push(

        "",

        `💰 *মোট: ${money(total)}*`,

        "🚚 ভালুকার মধ্যে: FREE DELIVERY",

        "",

        "👤 নাম: ",

        "📞 ফোন: ",

        "📍 ঠিকানা: "

    );


    // -------------------------------------------------
    // WhatsApp URL
    // -------------------------------------------------

    const whatsappURL =

        `https://wa.me/${WHATSAPP_NUMBER}` +

        `?text=${encodeURIComponent(
            orderLines.join("\n")
        )}`;


    window.open(
        whatsappURL,
        "_blank"
    );

}


// =====================================================
// CONTACT WHATSAPP
// =====================================================

const contactWhatsApp =
    document.getElementById(
        "contactWhatsApp"
    );


if (contactWhatsApp) {

    contactWhatsApp.href =

        `https://wa.me/${WHATSAPP_NUMBER}` +

        `?text=${encodeURIComponent(
            "আসসালামু আলাইকুম, Naiem Store সম্পর্কে জানতে চাই।"
        )}`;

}


// =====================================================
// YEAR
// =====================================================

const yearElement =
    document.getElementById("year");


if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


// =====================================================
// INITIALIZE WEBSITE
// =====================================================

renderProducts();

updateCartCount();


// =====================================================
// END
// =====================================================
// ==========================================
// ALWAYS START WEBSITE FROM TOP
// ==========================================

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", function () {
  window.scrollTo(0, 0);
});

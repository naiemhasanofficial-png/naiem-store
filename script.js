// ====== NAIEM STORE SETTINGS ======
// Replace the number below with your WhatsApp number, country code included.
// Bangladesh example: 8801XXXXXXXXX (do not use + or spaces).
const WHATSAPP_NUMBER = "8801632189981";

const products = [
  {id:1,name:"Premium Product One",price:499,oldPrice:650,emoji:"🛍️",badge:"NEW",desc:"ডেমো পণ্য — আপনার আসল পণ্যের তথ্য দিয়ে বদলে দিন।"},
  {id:2,name:"Premium Product Two",price:799,oldPrice:950,emoji:"🎁",badge:"SALE",desc:"ডেমো পণ্য — ছবি, নাম ও দাম পরে পরিবর্তন করতে পারবেন।"},
  {id:3,name:"Premium Product Three",price:999,oldPrice:null,emoji:"✨",badge:"POPULAR",desc:"ডেমো পণ্য — আপনার আসল পণ্য এখানে যোগ হবে।"},
  {id:4,name:"Premium Product Four",price:1299,oldPrice:1499,emoji:"⭐",badge:"HOT",desc:"ডেমো পণ্য — আপনার দোকানের জন্য প্রস্তুত।"}
];

let cart = JSON.parse(localStorage.getItem("naiemCart") || "[]");

function money(n){ return "৳" + Number(n).toLocaleString("bn-BD"); }

function renderProducts(){
  const q = document.getElementById("search").value.trim().toLowerCase();
  const list = products.filter(p => p.name.toLowerCase().includes(q));
  const grid = document.getElementById("productGrid");
  grid.innerHTML = list.length ? list.map(p => `
    <article class="product">
      <div class="product-img"><span class="badge">${p.badge}</span><span>${p.emoji}</span></div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div><span class="price">${money(p.price)}</span>${p.oldPrice ? `<span class="old">${money(p.oldPrice)}</span>`:""}</div>
        <button class="btn primary add" onclick="addToCart(${p.id})">🛒 কার্টে যোগ করুন</button>
      </div>
    </article>`).join("") : "<p>কোনো পণ্য পাওয়া যায়নি।</p>";
}

function save(){localStorage.setItem("naiemCart",JSON.stringify(cart)); updateCartCount();}
function addToCart(id){
  const found=cart.find(x=>x.id===id);
  if(found) found.qty++;
  else cart.push({id,qty:1});
  save(); openCart();
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id);
  if(!item)return;
  item.qty+=delta;
  if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  save(); renderCart();
}
function renderCart(){
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML="<p>আপনার কার্ট এখনো খালি। 🛒</p>";document.getElementById("cartTotal").textContent="৳0";return;}
  let total=0;
  box.innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id); const subtotal=p.price*item.qty; total+=subtotal;
    return `<div class="cart-line"><div><b>${p.name}</b><br><span>${money(p.price)} × ${item.qty}</span></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button> ${item.qty} <button onclick="changeQty(${p.id},1)">+</button><br><b>${money(subtotal)}</b></div></div>`;
  }).join("");
  document.getElementById("cartTotal").textContent=money(total);
}
function updateCartCount(){document.getElementById("cartCount").textContent=cart.reduce((a,b)=>a+b.qty,0);}
function openCart(){renderCart();document.getElementById("cartModal").classList.add("show");}
function closeCart(){document.getElementById("cartModal").classList.remove("show");}

function checkout(){
  if(!cart.length){alert("কার্ট খালি।");return;}
  let total=0, lines=["🛒 *Naiem Store — New Order*",""];
  cart.forEach(item=>{const p=products.find(x=>x.id===item.id);const s=p.price*item.qty;total+=s;lines.push(`• ${p.name} × ${item.qty} = ${money(s)}`);});
  lines.push("",`💰 *মোট: ${money(total)}*`,"🚚 ভালুকার মধ্যে: FREE DELIVERY","", "👤 নাম: ", "📞 ফোন: ", "📍 ঠিকানা: ");
  const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url,"_blank");
}

document.getElementById("contactWhatsApp").href=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("আসসালামু আলাইকুম, Naiem Store সম্পর্কে জানতে চাই।")}`;
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts(); updateCartCount();

// Simple client-only Book Pickup & Ordering demo
// Data stored in localStorage. No backend.

const departments = [
  "Computer Science",
  "Accounting",
  "Mathematics",
  "Medicine",
  "Economics",
  "English",
];

const books = [
  {
    id: 1,
    title: "Intro to Programming",
    author: "A. Author",
    course: "CSC101",
    dept: "Computer Science",
    level: "100",
    price: 2500,
    stock: 8,
  },
  {
    id: 2,
    title: "Data Structures",
    author: "B. Baker",
    course: "CSC201",
    dept: "Computer Science",
    level: "200",
    price: 3000,
    stock: 5,
  },
  {
    id: 3,
    title: "Discrete Math",
    author: "C. Clark",
    course: "MTH101",
    dept: "Mathematics",
    level: "100",
    price: 2200,
    stock: 10,
  },
  {
    id: 4,
    title: "Linear Algebra",
    author: "D. Drew",
    course: "MTH201",
    dept: "Mathematics",
    level: "200",
    price: 2800,
    stock: 6,
  },
  {
    id: 5,
    title: "Intro to Accounting",
    author: "E. Euler",
    course: "ACC201",
    dept: "Accounting",
    level: "200",
    price: 3200,
    stock: 4,
  },
  {
    id: 6,
    title: "Financial Accounting",
    author: "F. Finch",
    course: "ACC101",
    dept: "Accounting",
    level: "100",
    price: 2100,
    stock: 7,
  },
  {
    id: 7,
    title: "Microeconomics",
    author: "G. Green",
    course: "ECO101",
    dept: "Economics",
    level: "100",
    price: 2400,
    stock: 5,
  },
  {
    id: 8,
    title: "Shakespeare",
    author: "H. Hall",
    course: "ENG101",
    dept: "English",
    level: "100",
    price: 1800,
    stock: 12,
  },
  {
    id: 9,
    title: "Language and Composition",
    author: "H. Hall",
    course: "ENG101",
    dept: "English",
    level: "100",
    price: 1800,
    stock: 12,
  },
  {
    id: 10,
    title: "Macroeconomics",
    author: "H. Hall",
    course: "ENG201",
    dept: "Economics",
    level: "200",
    price: 1800,
    stock: 12,
  },
  {
    id: 11,
    title: "Shakespeare",
    author: "H. Hall",
    course: "ENG101",
    dept: "English",
    level: "100",
    price: 3600,
    stock: 12,
  },
  {
    id: 12,
    title: "Anatomy and Physiology",
    author: "L. Messi",
    course: "MED201",
    dept: "Medicine",
    level: "200",
    price: 6800,
    stock: 12,
  },
  {
    id: 13,
    title: "Introduction to Medicine",
    author: "C. Ronaldo",
    course: "MED101",
    dept: "Medicine",
    level: "100",
    price: 5400,
    stock: 12,
  },
  {
    id: 14,
    title: "C Programming Basics",
    author: "M. Ballard",
    course: "CSC201",
    dept: "Computer Science",
    level: "100",
    price: 7400,
    stock: 12,
  },
  {
    id: 15,
    title: "Introduction to Algorithms",
    author: "Dr. Akande",
    course: "CSC101",
    dept: "Computer Science",
    level: "100",
    price: 5800,
    stock: 12,
  },
];

// Helpers
const $ = (sel) => document.querySelector(sel);
const $all = (sel) => Array.from(document.querySelectorAll(sel));

// Elements
const authSection = $("#auth-section");
const profileSection = $("#profile-section");
const catalogSection = $("#catalog-section");
const checkoutSection = $("#checkout-section");
const ordersSection = $("#orders-section");
const cartModal = $("#cart-modal");

const authForm = $("#auth-form");
const authTitle = $("#auth-title");
const toggleAuthBtn = $("#toggle-auth");
const emailInput = $("#email");
const passwordInput = $("#password");
const userInfoEl = $("#user-info");

const departmentSelect = $("#department");
const levelSelect = $("#level");
const profileForm = $("#profile-form");
const logoutBtn = $("#logout");
const logoutHeaderBtn = $("#logout-header");

const catalogTitle = $("#catalog-title");
const catalogSub = $("#catalog-sub");
const bookList = $("#book-list");
const searchInput = $("#search");
const viewCartBtn = $("#view-cart");
const cartCount = $("#cart-count");

const cartItemsEl = $("#cart-items");
const cartTotalEl = $("#cart-total");
const closeCartBtn = $("#close-cart");
const checkoutBtn = $("#checkout");

const pickupForm = $("#pickup-form");
const checkoutSummary = $("#checkout-summary");
const ordersList = $("#orders-list");
const backToCatalogBtn = $("#back-to-catalog");
const cancelCheckoutBtn = $("#cancel-checkout");

// Local storage keys
const LS_USERS = "bpos_users";
const LS_SESSION = "bpos_session";
const LS_ORDERS = "bpos_orders";

// App state
let isRegister = false;
let session = loadSession();
let cart = []; // {bookId, qty}

function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}
function loadUsers() {
  return JSON.parse(localStorage.getItem(LS_USERS) || "[]");
}
function saveSession(s) {
  localStorage.setItem(LS_SESSION, JSON.stringify(s));
}
function loadSession() {
  return JSON.parse(localStorage.getItem(LS_SESSION) || "null");
}
function saveOrders(o) {
  localStorage.setItem(LS_ORDERS, JSON.stringify(o));
}
function loadOrders() {
  return JSON.parse(localStorage.getItem(LS_ORDERS) || "[]");
}

// Init
function init() {
  // populate departments
  departments.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    departmentSelect.appendChild(opt);
  });

  // restore session
  if (session) {
    showUser(session.email);
    if (session.department && session.level) {
      showCatalog();
    } else {
      showProfile();
    }
  } else {
    showAuth();
  }

  renderCart();
  attachEvents();
}

function attachEvents() {
  toggleAuthBtn.addEventListener("click", () => {
    isRegister = !isRegister;
    authTitle.textContent = isRegister ? "Create Account" : "Sign in";
    toggleAuthBtn.textContent = isRegister
      ? "Have an account? Sign in"
      : "Create account";
  });

  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    if (isRegister) {
      register(email, password);
    } else {
      login(email, password);
    }
  });

  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!session) return;
    session.department = departmentSelect.value;
    session.level = levelSelect.value;
    saveSession(session);
    showCatalog();
  });

  logoutBtn.addEventListener("click", () => {
    session = null;
    saveSession(null);
    cart = [];
    saveCartToSession();
    showAuth();
  });

  // header logout
  if (logoutHeaderBtn) {
    logoutHeaderBtn.addEventListener("click", () => {
      // reuse same logout logic
      session = null;
      saveSession(null);
      cart = [];
      saveCartToSession();
      showAuth();
    });
  }

  searchInput.addEventListener("input", renderBookList);

  viewCartBtn.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
    renderCart();
  });
  closeCartBtn.addEventListener("click", () =>
    cartModal.classList.add("hidden"),
  );

  checkoutBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
    startCheckout();
  });

  cartItemsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const id = Number(btn.dataset.id);
    if (action === "remove") removeFromCart(id);
    if (action === "inc") changeQty(id, 1);
    if (action === "dec") changeQty(id, -1);
  });

  pickupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    confirmOrder();
  });

  backToCatalogBtn.addEventListener("click", () => {
    showCatalog();
  });
  cancelCheckoutBtn.addEventListener("click", () => {
    showCatalog();
  });
}

// Auth
function register(email, password) {
  if (!email || !password) return alert("Provide email and password");
  const users = loadUsers();
  if (users.find((u) => u.email === email))
    return alert("Account exists. Please sign in");
  const user = { email, password, department: null, level: null };
  users.push(user);
  saveUsers(users);
  session = { email };
  saveSession(session);
  showProfile();
}

function login(email, password) {
  const users = loadUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return alert("Invalid credentials");
  session = {
    email,
    department: user.department || null,
    level: user.level || null,
  };
  saveSession(session);
  showUser(session.email);
  if (session.department && session.level) showCatalog();
  else showProfile();
}

function showUser(email) {
  userInfoEl.textContent = "Signed in as " + email;
  if (logoutHeaderBtn) logoutHeaderBtn.classList.remove("hidden");
}

// UI states
function showAuth() {
  authSection.classList.remove("hidden");
  profileSection.classList.add("hidden");
  catalogSection.classList.add("hidden");
  checkoutSection.classList.add("hidden");
  ordersSection.classList.add("hidden");
  userInfoEl.textContent = "";
  if (logoutHeaderBtn) logoutHeaderBtn.classList.add("hidden");
}
function showProfile() {
  authSection.classList.add("hidden");
  profileSection.classList.remove("hidden");
  catalogSection.classList.add("hidden");
  checkoutSection.classList.add("hidden");
  ordersSection.classList.add("hidden");
  if (session && session.department)
    departmentSelect.value = session.department;
  if (session && session.level) levelSelect.value = session.level;
  showUser(session.email);
}
function showCatalog() {
  authSection.classList.add("hidden");
  profileSection.classList.add("hidden");
  catalogSection.classList.remove("hidden");
  checkoutSection.classList.add("hidden");
  ordersSection.classList.add("hidden");
  catalogSub.textContent = `${session.department} — ${session.level} Level`;
  renderBookList();
}
function showCheckout() {
  authSection.classList.add("hidden");
  profileSection.classList.add("hidden");
  catalogSection.classList.add("hidden");
  checkoutSection.classList.remove("hidden");
  ordersSection.classList.add("hidden");
  renderCheckout();
}
function showOrders() {
  authSection.classList.add("hidden");
  profileSection.classList.add("hidden");
  catalogSection.classList.add("hidden");
  checkoutSection.classList.add("hidden");
  ordersSection.classList.remove("hidden");
  renderOrders();
}

// Book list
function getFilteredBooks() {
  if (!session) return [];
  const q = searchInput.value.trim().toLowerCase();
  return books
    .filter((b) => b.dept === session.department && b.level === session.level)
    .filter((b) => {
      if (!q) return true;
      return (b.title + " " + b.author + " " + b.course)
        .toLowerCase()
        .includes(q);
    });
}

function renderBookList() {
  bookList.innerHTML = "";
  const list = getFilteredBooks();
  if (list.length === 0) {
    bookList.innerHTML =
      '<p class="muted">No books available for your department/level.</p>';
    return;
  }
  list.forEach((b) => {
    const el = document.createElement("div");
    el.className = "book";
    el.innerHTML = `<h3>${b.title}</h3>
      <div class="meta">${b.author} · ${b.course}</div>
      <div class="meta">Stock: ${b.stock}</div>
      <div class="price">₦${b.price.toFixed(2)}</div>
      <div class="actions">
        <button data-id="${b.id}" class="add">Add</button>
        <button data-id="${b.id}" class="details secondary">Details</button>
      </div>`;
    const addBtn = el.querySelector("button.add");
    addBtn.addEventListener("click", () => addToCart(b.id));
    bookList.appendChild(el);
  });
}

// Cart
function loadCartFromSession() {
  const s = loadSession();
  if (s && s.cart) return s.cart;
  return [];
}
function saveCartToSession() {
  if (!session) {
    session = null;
    return;
  }
  session.cart = cart;
  saveSession(session);
}

function addToCart(bookId) {
  const b = books.find((x) => x.id === bookId);
  if (!b) return;
  const item = cart.find((i) => i.bookId === bookId);
  if (item) {
    if (item.qty < b.stock) item.qty++;
    else return alert("No more stock");
  } else {
    cart.push({ bookId, qty: 1 });
  }
  saveCartToSession();
  renderCart();
  flashCartCount();
}
function removeFromCart(bookId) {
  cart = cart.filter((i) => i.bookId !== bookId);
  saveCartToSession();
  renderCart();
}
function changeQty(bookId, delta) {
  const item = cart.find((i) => i.bookId === bookId);
  if (!item) return;
  const b = books.find((x) => x.id === bookId);
  item.qty = Math.max(1, item.qty + delta);
  if (item.qty > b.stock) item.qty = b.stock;
  saveCartToSession();
  renderCart();
}

function renderCart() {
  cart = loadCartFromSession();
  cartItemsEl.innerHTML = "";
  let total = 0;
  let count = 0;
  cart.forEach((ci) => {
    const b = books.find((x) => x.id === ci.bookId);
    if (!b) return;
    count += ci.qty;
    total += b.price * ci.qty;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `<div>
        <div>${b.title}</div>
        <div class="meta">${b.author} · ${b.course}</div>
      </div>
      <div class="qty">
        <button data-action="dec" data-id="${b.id}" class="secondary">-</button>
        <div>${ci.qty}</div>
        <button data-action="inc" data-id="${b.id}" class="secondary">+</button>
        <button data-action="remove" data-id="${b.id}" class="danger">Remove</button>
      </div>`;
    cartItemsEl.appendChild(div);
  });
  cartTotalEl.textContent = total.toFixed(2);
  cartCount.textContent = count;
}

function flashCartCount() {
  cartCount.animate([{ transform: "scale(1.2)" }, { transform: "scale(1)" }], {
    duration: 250,
  });
}

// Checkout
function startCheckout() {
  if (cart.length === 0) return alert("Cart is empty");
  showCheckout();
}
function renderCheckout() {
  const lines = cart
    .map((ci) => {
      const b = books.find((x) => x.id === ci.bookId);
      return `<div>${b.title} × ${ci.qty} — ₦${(b.price * ci.qty).toFixed(2)}</div>`;
    })
    .join("");
  const total = cart.reduce((s, ci) => {
    const b = books.find((x) => x.id === ci.bookId);
    return s + b.price * ci.qty;
  }, 0);
  checkoutSummary.innerHTML = `<div>${lines}</div><div style="margin-top:8px;font-weight:600">Total: ₦${total.toFixed(2)}</div>`;
}

function confirmOrder() {
  const orders = loadOrders();
  const total = cart.reduce((s, ci) => {
    const b = books.find((x) => x.id === ci.bookId);
    return s + b.price * ci.qty;
  }, 0);
  const data = {
    id: Date.now(),
    email: session.email,
    department: session.department,
    level: session.level,
    items: cart.slice(),
    total,
    pickupLocation: $("#pickup-location").value,
    pickupDate: $("#pickup-date").value,
    pickupTime: $("#pickup-time").value,
    created: new Date().toISOString(),
  };
  orders.push(data);
  saveOrders(orders);
  // reduce stock locally
  cart.forEach((ci) => {
    const b = books.find((x) => x.id === ci.bookId);
    if (b) b.stock = Math.max(0, b.stock - ci.qty);
  });
  cart = [];
  saveCartToSession();
  alert("Order placed! You will receive a confirmation.");
  showOrders();
}

function renderOrders() {
  const orders = loadOrders().filter((o) => o.email === session.email);
  ordersList.innerHTML = "";
  if (orders.length === 0)
    ordersList.innerHTML = '<p class="muted">No orders yet.</p>';
  orders.forEach((o) => {
    const div = document.createElement("div");
    div.className = "order";
    div.innerHTML = `<div><strong>Order #${o.id}</strong> — ${new Date(o.created).toLocaleString()}</div>
      <div>${o.items
        .map((i) => {
          const b = books.find((x) => x.id === i.bookId);
          return `${b.title} × ${i.qty}`;
        })
        .join(", ")}</div>
      <div>Pickup: ${o.pickupLocation} on ${o.pickupDate} ${o.pickupTime}</div>
      <div>Total: ₦${o.total.toFixed(2)}</div>`;
    ordersList.appendChild(div);
  });
}

// Start
init();

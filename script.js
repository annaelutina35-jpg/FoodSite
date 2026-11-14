const dishes = [
    { id: 1, name: "Пицца", price: 550 },
    { id: 2, name: "Бургер", price: 320 },
    { id: 3, name: "Суши", price: 890 },
    { id: 4, name: "Паста", price: 410 }
];

let cart = [];
let orders = [];
let selectedDishes = new Set();
let currentRole = 'client';

function login() {
    const login = document.getElementById('login-input').value;
    const password = document.getElementById('password-input').value;
    if (login === 'anna' && password === '1234') {
        document.getElementById('auth-screen').classList.remove('active');
        document.getElementById('app-screen').classList.add('active');
        renderMenu();
        renderNews();
    } else {
        document.getElementById('auth-error').textContent = "Неверный логин или пароль";
    }
}

function logout() {
    document.getElementById('app-screen').classList.remove('active');
    document.getElementById('auth-screen').classList.add('active');
}

function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    document.getElementById('nav-' + tabId).classList.add('active');
}

function switchRole(role) {
    currentRole = role;
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    const managerPanel = document.getElementById('manager-panel');
    if (role === 'manager' || role === 'security') {
        managerPanel.classList.remove('hidden');
    } else {
        managerPanel.classList.add('hidden');
    }
    renderOrders();
}

function renderMenu(filter = "") {
    const container = document.getElementById('dish-list');
    container.innerHTML = '';
    dishes.filter(d => d.name.toLowerCase().includes(filter.toLowerCase())).forEach(dish => {
        const isSelected = selectedDishes.has(dish.id);
        container.innerHTML += `
            <div class="dish-card ${isSelected ? 'selected' : ''}" onclick="toggleSelect(${dish.id})">
                <b>${dish.name}</b>
                <span class="price">${dish.price} ₽</span>
            </div>
        `;
    });
}

function filterMenu() {
    renderMenu(document.getElementById('search-input').value);
}

function toggleSelect(id) {
    if (selectedDishes.has(id)) selectedDishes.delete(id);
    else selectedDishes.add(id);
    renderMenu(document.getElementById('search-input').value);
}

function addSelectedToCart() {
    if (selectedDishes.size === 0) return alert("Выберите блюда!");
    selectedDishes.forEach(id => {
        cart.push(dishes.find(d => d.id === id));
    });
    selectedDishes.clear();
    renderMenu();
    updateCartCount();
    alert("Добавлено в корзину!");
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-list');
    container.innerHTML = '';
    cart.forEach((item, index) => {
        container.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>${item.price} ₽</span>
                <button onclick="removeFromCart(${index})">❌</button>
            </div>
        `;
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
}

function checkout() {
    if (cart.length === 0) return alert("Корзина пуста!");
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const wish = document.getElementById('wish-input').value;
    orders.push({ id: Date.now(), total: total, wish: wish, status: 'new' });
    cart = [];
    document.getElementById('wish-input').value = '';
    updateCartCount();
    renderOrders();
    showTab('orders');
    alert("Заказ успешно оформлен!");
}

function renderOrders() {
    const container = document.getElementById('orders-list');
    container.innerHTML = '';
    orders.forEach(order => {
        let statusText = order.status === 'new' ? 'Новый' : 'Доставлен';
        container.innerHTML += `
            <div class="order-card">
                <b>Заказ №${order.id.toString().slice(-4)}</b>
                <p>Сумма: ${order.total} ₽</p>
                <p>Статус: <span class="status-${order.status}">${statusText}</span></p>
            </div>
        `;
    });
}

function scanQR() {
    const result = document.getElementById('scan-result');
    result.textContent = "✅ QR-код успешно отсканирован!";
}

function renderNews() {
    const container = document.getElementById('news-list');
    container.innerHTML = `
        <div class="news-card"><b>Скидка 20%</b><p>На все пиццы!</p></div>
        <div class="news-card"><b>Новинка</b><p>Трюфельный бургер!</p></div>
    `;
}

// Массив блюд (Лаба 3, 9)
const dishes = [
    { id: 1, name: "Пицца", price: 550, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&q=80" },
    { id: 2, name: "Бургер", price: 320, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80" },
    { id: 3, name: "Суши", price: 890, img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&q=80" },
    { id: 4, name: "Паста", price: 410, img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200&q=80" }
];

let cart = [];
let orders = [];
let selectedDishes = new Set();
let currentRole = 'client';

// --- Авторизация (Лаба 13) ---
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
    document.getElementById('login-input').value = '';
    document.getElementById('password-input').value = '';
    document.getElementById('auth-error').textContent = '';
}

// --- Навигация ---
function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    document.getElementById('nav-' + tabId).classList.add('active');
}

// --- Переключение ролей (Лаба 6, 14) ---
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

// --- Отрисовка меню ---
function renderMenu(filter = "") {
    const container = document.getElementById('dish-list');
    container.innerHTML = '';
    dishes.filter(d => d.name.toLowerCase().includes(filter.toLowerCase())).forEach(dish => {
        const isSelected = selectedDishes.has(dish.id);
        container.innerHTML += `
            <div class="dish-card ${isSelected ? 'selected' : ''}" onclick="toggleSelect(${dish.id})">
                <img src="${dish.img}" alt="${dish.name}">
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

// --- Корзина ---
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

// --- Оформление заказа ---
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

// --- Отрисовка заказов ---
function renderOrders() {
    const container = document.getElementById('orders-list');
    container.innerHTML = '';
    orders.forEach(order => {
        let statusText = '';
        let statusClass = '';
        if (currentRole === 'manager') {
            statusText = `<select onchange="changeStatus(${order.id}, this.value)">
                <option value="new" ${order.status === 'new' ? 'selected' : ''}>Новый</option>
                <option value="cooking" ${order.status === 'cooking' ? 'selected' : ''}>Готовится</option>
                <option value="delivering" ${order.status === 'delivering' ? 'selected' : ''}>В пути</option>
                <option value="done" ${order.status === 'done' ? 'selected' : ''}>Доставлен</option>
            </select>`;
        } else {
            statusText = order.status === 'new' ? 'Новый' : order.status === 'cooking' ? 'Готовится' : order.status === 'delivering' ? 'В пути' : 'Доставлен';
            statusClass = `status-${order.status}`;
        }

        container.innerHTML += `
            <div class="order-card">
                <b>Заказ №${order.id.toString().slice(-4)}</b>
                <p>Сумма: ${order.total} ₽</p>
                ${order.wish ? `<p>Пожелание: ${order.wish}</p>` : ''}
                <p>Статус: <span class="${statusClass}">${statusText}</span></p>
            </div>
        `;
    });
}

function changeStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) order.status = newStatus;
    renderOrders();
}

// --- Камера (Лаба 14) ---
function scanQR() {
    const result = document.getElementById('scan-result');
    result.textContent = "Запрос доступа к камере...";
    
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            result.textContent = "Камера активна. Сканирование QR...";
            setTimeout(() => {
                stream.getTracks().forEach(track => track.stop());
                result.textContent = "✅ QR-код успешно отсканирован!";
            }, 2000);
        })
        .catch(err => {
            result.textContent = "❌ Доступ к камере запрещен. Проверьте настройки браузера.";
        });
}

// --- Новости (Лаба 10) ---
const news = [
    { title: "Скидка 20% на пиццу!", text: "Только сегодня." },
    { title: "Новинка: Трюфельный бургер", text: "Попробуйте наш новый бургер." },
    { title: "Бесплатная доставка", text: "При заказе от 1000 ₽." }
];

function renderNews() {
    const container = document.getElementById('news-list');
    container.innerHTML = '';
    news.forEach(n => {
        container.innerHTML += `
            <div class="news-card">
                <b>${n.title}</b>
                <p>${n.text}</p>
            </div>
        `;
    });
}

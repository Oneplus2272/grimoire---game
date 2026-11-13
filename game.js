let tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.disableVerticalSwipes();
  if (tg.requestFullscreen) tg.requestFullscreen();
}

// --- СОСТОЯНИЕ ИГРЫ ---
let coins = parseInt(localStorage.getItem('coins')) || 0;
let powerLevel = parseInt(localStorage.getItem('powerLevel')) || 1; 
let autoLevel = parseInt(localStorage.getItem('autoLevel')) || 0; // Уровень автоклика

const costPower = 50; 
const costAuto = 100;

// --- ОФЛАЙН ДОХОД ---
let lastOnline = parseInt(localStorage.getItem('lastOnline')) || Date.now();
let now = Date.now();
let secondsOffline = Math.floor((now - lastOnline) / 1000);

if (secondsOffline > 0 && autoLevel > 0) {
  let offlineEarnings = secondsOffline * autoLevel;
  coins += offlineEarnings;
  localStorage.setItem('coins', coins);
  // Можно потом добавить всплывашку "Пока вас не было, кот заработал X монет"
}

// Обновляем время последнего визита
localStorage.setItem('lastOnline', Date.now());

// --- ЭЛЕМЕНТЫ DOM ---
const coinsEl = document.getElementById('coins');
const incomeEl = document.getElementById('income');
const tapBtn = document.getElementById('tapBtn');
const buyPowerBtn = document.getElementById('buyPowerBtn');
const buyAutoBtn = document.getElementById('buyAutoBtn');
const powerLevelEl = document.getElementById('powerLevel');
const autoLevelEl = document.getElementById('autoLevel');
const petImage = document.getElementById('petImage'); 

const screenGame = document.getElementById('screen-game');
const screenShop = document.getElementById('screen-shop');
const navGameBtn = document.getElementById('navGameBtn');
const navShopBtn = document.getElementById('navShopBtn');

// --- ФУНКЦИИ ---
function updateUI() {
  coinsEl.textContent = coins;
  incomeEl.textContent = autoLevel;
  
  powerLevelEl.textContent = `Сила клика: ${powerLevel}`;
  autoLevelEl.textContent = `Автоклик: ${autoLevel}/сек`;
  
  buyPowerBtn.disabled = coins < costPower;
  buyAutoBtn.disabled = coins < costAuto;
}

// --- ЛОГИКА КЛИКА ---
tapBtn.addEventListener('click', () => {
  coins += powerLevel; 
  updateUI();
  localStorage.setItem('coins', coins);
  
  petImage.classList.add('pet-jump');
  setTimeout(() => petImage.classList.remove('pet-jump'), 100); 

  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
});

// --- ПОКУПКА СИЛЫ КЛИКА ---
buyPowerBtn.addEventListener('click', () => {
  if (coins >= costPower) {
    coins -= costPower;
    powerLevel += 1;
    localStorage.setItem('coins', coins);
    localStorage.setItem('powerLevel', powerLevel);
    updateUI();
    if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  }
});

// --- ПОКУПКА АВТОКЛИКА ---
buyAutoBtn.addEventListener('click', () => {
  if (coins >= costAuto) {
    coins -= costAuto;
    autoLevel += 1;
    localStorage.setItem('coins', coins);
    localStorage.setItem('autoLevel', autoLevel);
    updateUI();
    if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  }
});

// --- АВТОМАТИЧЕСКОЕ НАЧИСЛЕНИЕ (Каждую секунду) ---
setInterval(() => {
  if (autoLevel > 0) {
    coins += autoLevel;
    updateUI();
    localStorage.setItem('coins', coins);
    // Обновляем время, чтобы офлайн-доход считался корректно
    localStorage.setItem('lastOnline', Date.now());
  }
}, 1000);

// --- НАВИГАЦИЯ ---
navGameBtn.addEventListener('click', () => {
  screenGame.classList.remove('hidden');
  screenShop.classList.add('hidden');
  navGameBtn.classList.add('active');
  navShopBtn.classList.remove('active');
  localStorage.setItem('lastOnline', Date.now()); // Обновляем время при переходе
});

navShopBtn.addEventListener('click', () => {
  screenGame.classList.add('hidden');
  screenShop.classList.remove('hidden');
  navGameBtn.classList.remove('active');
  navShopBtn.classList.add('active');
});

updateUI();

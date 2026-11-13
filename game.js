let tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.disableVerticalSwipes();
  if (tg.requestFullscreen) tg.requestFullscreen();
}

// --- ФОРМАТИРОВАНИЕ ЧИСЕЛ ---
function formatNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return Math.floor(num).toString();
}

// --- СОСТОЯНИЕ ИГРЫ ---
let coins = parseInt(localStorage.getItem('coins')) || 0;
let powerLevel = parseInt(localStorage.getItem('powerLevel')) || 1; 
let autoLevel = parseInt(localStorage.getItem('autoLevel')) || 0; 
let highScore = parseInt(localStorage.getItem('highScore')) || 0;

const baseCostPower = 50;
const baseCostAuto = 100;
const priceMultiplier = 1.05; // Рост цены на 5%

function getCost(base, level) {
  return Math.floor(base * Math.pow(priceMultiplier, level - 1));
}

// --- ОФЛАЙН ДОХОД ---
let lastOnline = parseInt(localStorage.getItem('lastOnline')) || Date.now();
let now = Date.now();
let secondsOffline = Math.floor((now - lastOnline) / 1000);

if (secondsOffline > 0 && autoLevel > 0) {
  coins += secondsOffline * autoLevel;
  localStorage.setItem('coins', coins);
}
localStorage.setItem('lastOnline', Date.now());

// --- ЭЛЕМЕНТЫ DOM ---
const coinsEl = document.getElementById('coins');
const incomeEl = document.getElementById('income');
const petImage = document.getElementById('petImage'); 
const floatingNumbersContainer = document.getElementById('floating-numbers');

const buyPowerBtn = document.getElementById('buyPowerBtn');
const buyAutoBtn = document.getElementById('buyAutoBtn');
const powerLevelEl = document.getElementById('powerLevel');
const autoLevelEl = document.getElementById('autoLevel');

const currentCoinsEl = document.getElementById('currentCoins');
const highScoreEl = document.getElementById('highScore');
const shareBtn = document.getElementById('shareBtn');
const resetBtn = document.getElementById('resetBtn');

const screenGame = document.getElementById('screen-game');
const screenShop = document.getElementById('screen-shop');
const screenRating = document.getElementById('screen-rating');
const navGameBtn = document.getElementById('navGameBtn');
const navShopBtn = document.getElementById('navShopBtn');
const navRatingBtn = document.getElementById('navRatingBtn');

// --- UI ЛОГИКА ---
function updateUI() {
  coinsEl.textContent = formatNumber(coins);
  incomeEl.textContent = formatNumber(autoLevel);
  
  powerLevelEl.textContent = `Сила клика: ${powerLevel}`;
  autoLevelEl.textContent = `Автоклик: ${formatNumber(autoLevel)}/сек`;
  
  let costPower = getCost(baseCostPower, powerLevel);
  let costAuto = getCost(baseCostAuto, autoLevel + 1);

  buyPowerBtn.textContent = `${formatNumber(costPower)} 🪙`;
  buyAutoBtn.textContent = `${formatNumber(costAuto)} 🪙`;

  buyPowerBtn.disabled = coins < costPower;
  buyAutoBtn.disabled = coins < costAuto;

  currentCoinsEl.textContent = formatNumber(coins);
  if (coins > highScore) {
    highScore = Math.floor(coins);
    localStorage.setItem('highScore', highScore);
  }
  highScoreEl.textContent = formatNumber(highScore);
}

// --- ВСПЛЫВАЮЩИЕ ЦИФРЫ ---
function spawnFloatingNumber(amount, x, y) {
  const el = document.createElement('div');
  el.classList.add('floating-number');
  el.textContent = `+${formatNumber(amount)}`;
  
  const rect = floatingNumbersContainer.getBoundingClientRect();
  el.style.left = `${x - rect.left}px`;
  el.style.top = `${y - rect.top}px`;
  
  floatingNumbersContainer.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

// --- ЛОГИКА КЛИКА ПО КОТУ ---
petImage.addEventListener('click', (e) => {
  coins += powerLevel; 
  updateUI();
  localStorage.setItem('coins', coins);
  
  // Анимация сплющивания
  petImage.classList.add('pet-squash');
  setTimeout(() => petImage.classList.remove('pet-squash'), 100); 

  // Всплывающая цифра появляется прямо в месте клика (или рядом)
  const rect = petImage.getBoundingClientRect();
  // Берем координаты клика, если не получилось (например, тапнули программно) - берем центр
  let clickX = e.clientX || (rect.left + rect.width / 2);
  let clickY = e.clientY || (rect.top + rect.height / 2);
  
  spawnFloatingNumber(powerLevel, clickX, clickY);

  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
});

// --- ПОКУПКИ (Только по 1 штуке, но цена растет) ---
buyPowerBtn.addEventListener('click', () => {
  let cost = getCost(baseCostPower, powerLevel);
  if (coins >= cost) {
    coins -= cost;
    powerLevel++;
    localStorage.setItem('coins', coins);
    localStorage.setItem('powerLevel', powerLevel);
    updateUI();
    if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  }
});

buyAutoBtn.addEventListener('click', () => {
  let cost = getCost(baseCostAuto, autoLevel + 1);
  if (coins >= cost) {
    coins -= cost;
    autoLevel++;
    localStorage.setItem('coins', coins);
    localStorage.setItem('autoLevel', autoLevel);
    updateUI();
    if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  }
});

// --- АВТОКЛИК ---
setInterval(() => {
  if (autoLevel > 0) {
    coins += autoLevel;
    updateUI();
    localStorage.setItem('coins', coins);
    localStorage.setItem('lastOnline', Date.now());
  }
}, 1000);

// --- ПОДЕЛИТЬСЯ ---
shareBtn.addEventListener('click', () => {
  const text = `Я накликал ${formatNumber(highScore)} монет в игре "Кибер-Кот"! Попробуй побить мой рекорд! 🐈‍⬛💻`;
  const url = "https://t.me/GrimoireDuel_bot/grimoire_game"; 
  if (tg) {
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
  } else {
    alert("В Телеграме тут откроется окно 'Поделиться'");
  }
});

// --- СБРОС ---
resetBtn.addEventListener('click', () => {
  if (confirm("Ты уверен, что хочешь удалить весь прогресс? Кот обидится...")) {
    localStorage.clear();
    location.reload();
  }
});

// --- НАВИГАЦИЯ ---
function switchTab(activeBtn, activeScreen) {
  navGameBtn.classList.remove('active');
  navShopBtn.classList.remove('active');
  navRatingBtn.classList.remove('active');
  screenGame.classList.add('hidden');
  screenShop.classList.add('hidden');
  screenRating.classList.add('hidden');
  activeBtn.classList.add('active');
  activeScreen.classList.remove('hidden');
}

navGameBtn.addEventListener('click', () => {
  switchTab(navGameBtn, screenGame);
  localStorage.setItem('lastOnline', Date.now());
});

navShopBtn.addEventListener('click', () => {
  switchTab(navShopBtn, screenShop);
});

navRatingBtn.addEventListener('click', () => {
  switchTab(navRatingBtn, screenRating);
});

updateUI();

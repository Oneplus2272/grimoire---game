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
let autoLevel = parseInt(localStorage.getItem('autoLevel')) || 0; 
let highScore = parseInt(localStorage.getItem('highScore')) || 0;
let buyModeMax = false; // Режим покупки (false = x1, true = MAX)

// Базовые цены и множитель роста
const baseCostPower = 50;
const baseCostAuto = 100;
const priceMultiplier = 1.15;

// Функция расчета текущей цены
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
const tapBtn = document.getElementById('tapBtn');
const buyPowerBtn = document.getElementById('buyPowerBtn');
const buyAutoBtn = document.getElementById('buyAutoBtn');
const powerLevelEl = document.getElementById('powerLevel');
const autoLevelEl = document.getElementById('autoLevel');
const petImage = document.getElementById('petImage'); 
const floatingNumbersContainer = document.getElementById('floating-numbers');

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

const buyModeX1Btn = document.getElementById('buyModeX1');
const buyModeMaxBtn = document.getElementById('buyModeMax');

// --- UI ЛОГИКА ---
function updateUI() {
  coinsEl.textContent = Math.floor(coins);
  incomeEl.textContent = autoLevel;
  
  powerLevelEl.textContent = `Сила клика: ${powerLevel}`;
  autoLevelEl.textContent = `Автоклик: ${autoLevel}/сек`;
  
  // Расчет цен для кнопок
  let costPower = getCost(baseCostPower, powerLevel);
  let costAuto = getCost(baseCostAuto, autoLevel + 1);

  buyPowerBtn.textContent = `${costPower} 🪙`;
  buyAutoBtn.textContent = `${costAuto} 🪙`;

  // Блокировка кнопок, если не хватает денег
  buyPowerBtn.disabled = coins < costPower;
  buyAutoBtn.disabled = coins < costAuto;

  // Рейтинг
  currentCoinsEl.textContent = Math.floor(coins);
  if (coins > highScore) {
    highScore = Math.floor(coins);
    localStorage.setItem('highScore', highScore);
  }
  highScoreEl.textContent = highScore;
}

// --- ВСПЛЫВАЮЩИЕ ЦИФРЫ ---
function spawnFloatingNumber(amount, x, y) {
  const el = document.createElement('div');
  el.classList.add('floating-number');
  el.textContent = `+${amount}`;
  
  // Позиционируем относительно контейнера с котом
  const rect = floatingNumbersContainer.getBoundingClientRect();
  el.style.left = `${x - rect.left}px`;
  el.style.top = `${y - rect.top}px`;
  
  floatingNumbersContainer.appendChild(el);
  
  // Удаляем элемент после завершения анимации
  setTimeout(() => el.remove(), 800);
}

// --- ЛОГИКА КЛИКА ---
tapBtn.addEventListener('click', (e) => {
  coins += powerLevel; 
  updateUI();
  localStorage.setItem('coins', coins);
  
  // Анимация сплющивания
  petImage.classList.add('pet-squash');
  setTimeout(() => petImage.classList.remove('pet-squash'), 100); 

  // Спавн цифры (берем координаты клика или центр кота)
  // Если клик по кнопке, берем случайную точку над котом
  const rect = petImage.getBoundingClientRect();
  const randomX = rect.left + rect.width / 2 + (Math.random() - 0.5) * 50;
  const randomY = rect.top + rect.height / 2 + (Math.random() - 0.5) * 50;
  spawnFloatingNumber(powerLevel, randomX, randomY);

  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
});

// --- ПОКУПКИ ---
buyPowerBtn.addEventListener('click', () => {
  let cost = getCost(baseCostPower, powerLevel);
  
  if (buyModeMax) {
    // Покупаем максимум, сколько можем
    let bought = 0;
    while (coins >= cost) {
      coins -= cost;
      powerLevel++;
      bought++;
      cost = getCost(baseCostPower, powerLevel);
    }
    if (bought > 0) tg?.HapticFeedback?.notificationOccurred('success');
  } else {
    // Покупаем 1
    if (coins >= cost) {
      coins -= cost;
      powerLevel++;
      tg?.HapticFeedback?.notificationOccurred('success');
    }
  }
  
  localStorage.setItem('coins', coins);
  localStorage.setItem('powerLevel', powerLevel);
  updateUI();
});

buyAutoBtn.addEventListener('click', () => {
  let cost = getCost(baseCostAuto, autoLevel + 1);
  
  if (buyModeMax) {
    let bought = 0;
    while (coins >= cost) {
      coins -= cost;
      autoLevel++;
      bought++;
      cost = getCost(baseCostAuto, autoLevel + 1);
    }
    if (bought > 0) tg?.HapticFeedback?.notificationOccurred('success');
  } else {
    if (coins >= cost) {
      coins -= cost;
      autoLevel++;
      tg?.HapticFeedback?.notificationOccurred('success');
    }
  }
  
  localStorage.setItem('coins', coins);
  localStorage.setItem('autoLevel', autoLevel);
  updateUI();
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

// --- ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМА ПОКУПКИ ---
buyModeX1Btn.addEventListener('click', () => {
  buyModeMax = false;
  buyModeX1Btn.classList.add('active');
  buyModeMaxBtn.classList.remove('active');
});

buyModeMaxBtn.addEventListener('click', () => {
  buyModeMax = true;
  buyModeMaxBtn.classList.add('active');
  buyModeX1Btn.classList.remove('active');
});

// --- ПОДЕЛИТЬСЯ ---
shareBtn.addEventListener('click', () => {
  const text = `Я накликал ${highScore} монет в игре "Кибер-Кот"! Попробуй побить мой рекорд! 🐈‍⬛💻`;
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

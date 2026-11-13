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
let highScore = parseInt(localStorage.getItem('highScore')) || 0; // Рекорд

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

// --- ФУНКЦИИ ---
function updateUI() {
  coinsEl.textContent = coins;
  incomeEl.textContent = autoLevel;
  
  powerLevelEl.textContent = `Сила клика: ${powerLevel}`;
  autoLevelEl.textContent = `Автоклик: ${autoLevel}/сек`;
  
  buyPowerBtn.disabled = coins < costPower;
  buyAutoBtn.disabled = coins < costAuto;

  // Обновляем рейтинг
  currentCoinsEl.textContent = coins;
  if (coins > highScore) {
    highScore = coins;
    localStorage.setItem('highScore', highScore);
  }
  highScoreEl.textContent = highScore;
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

// --- ПОКУПКИ ---
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
  const text = `Я накликал ${highScore} монет в игре "Кибер-Кот"! Попробуй побить мой рекорд! 🐈‍⬛💻`;
  const url = "https://t.me/GrimoireDuel_bot/grimoire_game"; // Ссылка на твою игру (проверь, чтобы была правильная)
  
  // Вызываем нативное окно "Поделиться" в Telegram
  if (tg) {
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
  } else {
    // Если тестируем в браузере
    alert("В Телеграме тут откроется окно 'Поделиться'");
  }
});

// --- СБРОС ПРОГРЕССА ---
resetBtn.addEventListener('click', () => {
  if (confirm("Ты уверен, что хочешь удалить весь прогресс? Кот обидится...")) {
    localStorage.clear();
    location.reload(); // Перезагружаем страницу
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

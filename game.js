let tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.disableVerticalSwipes();
  if (tg.requestFullscreen) tg.requestFullscreen();
}

// --- СОСТОЯНИЕ ИГРЫ ---
let coins = parseInt(localStorage.getItem('coins')) || 0;
let powerLevel = parseInt(localStorage.getItem('powerLevel')) || 1; // Уровень клика (урон)
const costToUpgrade = 50; // Стоимость улучшения

// --- ЭЛЕМЕНТЫ DOM ---
const coinsEl = document.getElementById('coins');
const tapBtn = document.getElementById('tapBtn');
const buyPowerBtn = document.getElementById('buyPowerBtn');
const powerLevelEl = document.getElementById('powerLevel');

// Экраны и кнопки навигации
const screenGame = document.getElementById('screen-game');
const screenShop = document.getElementById('screen-shop');
const navGameBtn = document.getElementById('navGameBtn');
const navShopBtn = document.getElementById('navShopBtn');

// --- ФУНКЦИИ ---
function updateUI() {
  coinsEl.textContent = coins;
  powerLevelEl.textContent = `Текущий уровень: ${powerLevel}`;
  
  // Блокируем кнопку покупки, если не хватает монет
  if (coins >= costToUpgrade) {
    buyPowerBtn.disabled = false;
    buyPowerBtn.textContent = `${costToUpgrade} 🪙`;
  } else {
    buyPowerBtn.disabled = true;
    buyPowerBtn.textContent = `${costToUpgrade} 🪙`;
  }
}

// Обработчик клика по главной кнопке
tapBtn.addEventListener('click', () => {
  coins += powerLevel; // Начисляем монеты с учетом уровня
  updateUI();
  localStorage.setItem('coins', coins);
  
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
});

// Обработчик покупки улучшения
buyPowerBtn.addEventListener('click', () => {
  if (coins >= costToUpgrade) {
    coins -= costToUpgrade;
    powerLevel += 1;
    
    // Сохраняем прогресс
    localStorage.setItem('coins', coins);
    localStorage.setItem('powerLevel', powerLevel);
    
    updateUI();
    
    // Вибрируем при успешной покупке (двойной удар)
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred('success');
    }
  }
});

// --- НАВИГАЦИЯ (ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ) ---
navGameBtn.addEventListener('click', () => {
  screenGame.classList.remove('hidden');
  screenShop.classList.add('hidden');
  navGameBtn.classList.add('active');
  navShopBtn.classList.remove('active');
});

navShopBtn.addEventListener('click', () => {
  screenGame.classList.add('hidden');
  screenShop.classList.remove('hidden');
  navGameBtn.classList.remove('active');
  navShopBtn.classList.add('active');
});

// Запуск
updateUI();

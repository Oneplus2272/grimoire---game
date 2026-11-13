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
const costToUpgrade = 50; 

// --- ЭЛЕМЕНТЫ DOM ---
const coinsEl = document.getElementById('coins');
const tapBtn = document.getElementById('tapBtn');
const buyPowerBtn = document.getElementById('buyPowerBtn');
const powerLevelEl = document.getElementById('powerLevel');
const petImage = document.getElementById('petImage'); 

const screenGame = document.getElementById('screen-game');
const screenShop = document.getElementById('screen-shop');
const navGameBtn = document.getElementById('navGameBtn');
const navShopBtn = document.getElementById('navShopBtn');

// --- ФУНКЦИИ ---
function updateUI() {
  coinsEl.textContent = coins;
  powerLevelEl.textContent = `Текущий уровень: ${powerLevel}`;
  
  if (coins >= costToUpgrade) {
    buyPowerBtn.disabled = false;
  } else {
    buyPowerBtn.disabled = true;
  }
}

// --- ЛОГИКА КЛИКА ---
tapBtn.addEventListener('click', () => {
  coins += powerLevel; 
  updateUI();
  localStorage.setItem('coins', coins);
  
  // Анимация прыжка кота
  petImage.classList.add('pet-jump');
  setTimeout(() => {
    petImage.classList.remove('pet-jump');
  }, 100); 

  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
});

// --- ЛОГИКА ПОКУПКИ ---
buyPowerBtn.addEventListener('click', () => {
  if (coins >= costToUpgrade) {
    coins -= costToUpgrade;
    powerLevel += 1;
    
    localStorage.setItem('coins', coins);
    localStorage.setItem('powerLevel', powerLevel);
    updateUI();
    
    // Анимация радости кота
    petImage.classList.add('pet-happy');
    setTimeout(() => {
      petImage.classList.remove('pet-happy');
    }, 500); // Чуть дольше, чтобы увидеть

    if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  }
});

// --- НАВИГАЦИЯ ---
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

updateUI();

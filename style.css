let tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.disableVerticalSwipes();
  if (tg.requestFullscreen) tg.requestFullscreen();
}

// --- ФОРМАТИРОВАНИЕ ---
function formatNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return Math.floor(num).toString();
}

// --- СОСТОЯНИЕ ИГРЫ ---
let coins = parseInt(localStorage.getItem('coins')) || 0;
let damage = parseInt(localStorage.getItem('damage')) || 10; // Урон (сила клика)
let maxHp = parseInt(localStorage.getItem('maxHp')) || 100; // Макс ХП
let autoLevel = parseInt(localStorage.getItem('autoLevel')) || 0; 
let highScore = parseInt(localStorage.getItem('highScore')) || 0;

// Цены (растут понемногу)
const baseCostDamage = 50;
const baseCostHp = 100;
const baseCostAuto = 150;

// Боевые переменные
let enemyMaxHp = 100;
let enemyCurrentHp = 100;
let playerCurrentHp = maxHp;
let isBattleActive = false;
let enemyAttackInterval;

// --- ЭЛЕМЕНТЫ DOM ---
const coinsEl = document.getElementById('coins');
const incomeEl = document.getElementById('income');
const petImage = document.getElementById('petImage'); 

const screenGame = document.getElementById('screen-game');
const screenBattle = document.getElementById('screen-battle');
const screenShop = document.getElementById('screen-shop');
const screenRating = document.getElementById('screen-rating');

const goToBattleBtn = document.getElementById('goToBattleBtn');
const backToGameBtn = document.getElementById('backToGameBtn');
const enemyImage = document.getElementById('enemyImage');
const enemyHpBar = document.getElementById('enemyHpBar');
const playerHpBar = document.getElementById('playerHpBar');
const playerHpText = document.getElementById('playerHpText');

const buyPowerBtn = document.getElementById('buyPowerBtn');
const buyHpBtn = document.getElementById('buyHpBtn');
const buyAutoBtn = document.getElementById('buyAutoBtn');

// --- UI ЛОГИКА ---
function updateUI() {
  coinsEl.textContent = formatNumber(coins);
  incomeEl.textContent = formatNumber(autoLevel);
  
  // Обновляем цены в магазине
  buyPowerBtn.textContent = `${formatNumber(baseCostDamage * Math.pow(1.1, damage / 5 - 2))} 🪙`; // Условная цена
  buyHpBtn.textContent = `${formatNumber(baseCostHp * Math.pow(1.1, maxHp / 10 - 10))} 🪙`;
  buyAutoBtn.textContent = `${formatNumber(baseCostAuto * Math.pow(1.1, autoLevel))} 🪙`;

  currentCoinsEl.textContent = formatNumber(coins);
  if (coins > highScore) {
    highScore = Math.floor(coins);
    localStorage.setItem('highScore', highScore);
  }
  highScoreEl.textContent = formatNumber(highScore);
}

// --- БОЕВАЯ СИСТЕМА ---
function startBattle() {
  screenGame.classList.add('hidden');
  screenBattle.classList.remove('hidden');
  isBattleActive = true;
  
  // Сброс здоровья
  enemyCurrentHp = enemyMaxHp;
  playerCurrentHp = maxHp;
  updateBattleUI();

  // Враг бьет каждую секунду
  clearInterval(enemyAttackInterval);
  enemyAttackInterval = setInterval(() => {
    if (isBattleActive && playerCurrentHp > 0) {
      playerCurrentHp -= 5; // Враг бьет по 5
      if (playerCurrentHp <= 0) {
        playerCurrentHp = 0;
        endBattle(false); // Проигрыш
      }
      updateBattleUI();
    }
  }, 1000);
}

function updateBattleUI() {
  // Полоска врага
  let enemyPercent = (enemyCurrentHp / enemyMaxHp) * 100;
  enemyHpBar.style.width = `${Math.max(0, enemyPercent)}%`;
  
  // Полоска игрока
  let playerPercent = (playerCurrentHp / maxHp) * 100;
  playerHpBar.style.width = `${Math.max(0, playerPercent)}%`;
  playerHpText.textContent = `HP: ${Math.max(0, playerCurrentHp)}/${maxHp}`;
}

function endBattle(isWin) {
  isBattleActive = false;
  clearInterval(enemyAttackInterval);
  
  if (isWin) {
    coins += 50; // Награда за победу
    alert("Победа! Ты получил 50 монет!");
  } else {
    alert("Ты проиграл... Кот убежал чинить броню.");
  }
  
  localStorage.setItem('coins', coins);
  updateUI();
  
  // Возвращаемся на главный экран
  screenBattle.classList.add('hidden');
  screenGame.classList.remove('hidden');
}

// Клик по врагу (Атака)
enemyImage.addEventListener('click', () => {
  if (!isBattleActive) return;
  
  enemyCurrentHp -= damage;
  updateBattleUI();
  
  // Анимация врага (вздрагивает)
  enemyImage.style.transform = 'scale(0.9) rotate(-5deg)';
  setTimeout(() => { enemyImage.style.transform = 'scale(1) rotate(0deg)'; }, 100);

  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');

  if (enemyCurrentHp <= 0) {
    endBattle(true);
  }
});

// Кнопки перехода
goToBattleBtn.addEventListener('click', startBattle);
backToGameBtn.addEventListener('click', () => {
  isBattleActive = false;
  clearInterval(enemyAttackInterval);
  screenBattle.classList.add('hidden');
  screenGame.classList.remove('hidden');
});

// --- ПОКУПКИ ---
buyPowerBtn.addEventListener('click', () => {
  let cost = Math.floor(baseCostDamage * Math.pow(1.1, damage / 5 - 2));
  if (coins >= cost) {
    coins -= cost;
    damage += 5;
    localStorage.setItem('coins', coins);
    localStorage.setItem('damage', damage);
    updateUI();
  }
});

buyHpBtn.addEventListener('click', () => {
  let cost = Math.floor(baseCostHp * Math.pow(1.1, maxHp / 10 - 10));
  if (coins >= cost) {
    coins -= cost;
    maxHp += 10;
    localStorage.setItem('coins', coins);
    localStorage.setItem('maxHp', maxHp);
    updateUI();
  }
});

buyAutoBtn.addEventListener('click', () => {
  let cost = Math.floor(baseCostAuto * Math.pow(1.1, autoLevel));
  if (coins >= cost) {
    coins -= cost;
    autoLevel++;
    localStorage.setItem('coins', coins);
    localStorage.setItem('autoLevel', autoLevel);
    updateUI();
  }
});

// --- КЛИК ПО КОТУ (фарм монет вне боя) ---
petImage.addEventListener('click', (e) => {
  coins += 1; // Теперь кот дает 1 монету за клик (урон отдельно)
  updateUI();
  localStorage.setItem('coins', coins);
  
  petImage.classList.add('pet-squash');
  setTimeout(() => petImage.classList.remove('pet-squash'), 100); 

  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
});

// --- АВТОКЛИК ---
setInterval(() => {
  if (autoLevel > 0) {
    coins += autoLevel;
    updateUI();
    localStorage.setItem('coins', coins);
  }
}, 1000);

// --- НАВИГАЦИЯ ---
function switchTab(activeBtn, activeScreen) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.main-content').forEach(scr => scr.classList.add('hidden'));
  
  activeBtn.classList.add('active');
  activeScreen.classList.remove('hidden');
}

document.getElementById('navGameBtn').addEventListener('click', () => switchTab(document.getElementById('navGameBtn'), screenGame));
document.getElementById('navShopBtn').addEventListener('click', () => switchTab(document.getElementById('navShopBtn'), screenShop));
document.getElementById('navRatingBtn').addEventListener('click', () => switchTab(document.getElementById('navRatingBtn'), screenRating));

updateUI();

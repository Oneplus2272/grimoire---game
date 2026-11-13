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

// --- СОСТОЯНИЕ ---
let coins = parseInt(localStorage.getItem('coins')) || 0;
let damage = parseInt(localStorage.getItem('damage')) || 10; 
let maxHp = parseInt(localStorage.getItem('maxHp')) || 100; 
let autoLevel = parseInt(localStorage.getItem('autoLevel')) || 0; 
let highScore = parseInt(localStorage.getItem('highScore')) || 0;

const baseCostDamage = 50;
const baseCostHp = 100;
const baseCostAuto = 150;

let enemyMaxHp = 100;
let enemyCurrentHp = 100;
let playerCurrentHp = maxHp;
let isBattleActive = false;
let battleInterval;

// --- DOM ---
const coinsEl = document.getElementById('coins');
const incomeEl = document.getElementById('income');
const petImage = document.getElementById('petImage'); 
const enemyImage = document.getElementById('enemyImage');
const enemyHpBar = document.getElementById('enemyHpBar');
const playerHpBar = document.getElementById('playerHpBar');
const playerHpText = document.getElementById('playerHpText');
const battleBg = document.getElementById('battle-bg');

const screenGame = document.getElementById('screen-game');
const screenBattle = document.getElementById('screen-battle');

// --- UI ---
function updateUI() {
  coinsEl.textContent = formatNumber(coins);
  incomeEl.textContent = formatNumber(autoLevel);
  
  document.getElementById('buyPowerBtn').textContent = `${formatNumber(baseCostDamage * Math.pow(1.1, damage / 5 - 2))} 🪙`;
  document.getElementById('buyHpBtn').textContent = `${formatNumber(baseCostHp * Math.pow(1.1, maxHp / 10 - 10))} 🪙`;
  document.getElementById('buyAutoBtn').textContent = `${formatNumber(baseCostAuto * Math.pow(1.1, autoLevel))} 🪙`;

  document.getElementById('currentCoins').textContent = formatNumber(coins);
  if (coins > highScore) {
    highScore = Math.floor(coins);
    localStorage.setItem('highScore', highScore);
  }
  document.getElementById('highScore').textContent = formatNumber(highScore);
}

// --- БОЙ (АВТОМАТИЧЕСКИЙ) ---
function startBattle() {
  screenGame.classList.add('hidden');
  screenBattle.classList.remove('hidden');
  battleBg.classList.remove('hidden'); // Показываем фон
  isBattleActive = true;
  
  enemyCurrentHp = enemyMaxHp;
  playerCurrentHp = maxHp;
  updateBattleUI();

  clearInterval(battleInterval);
  // Бой каждую секунду
  battleInterval = setInterval(() => {
    if (!isBattleActive) return;

    // Кот бьет врага
    enemyCurrentHp -= damage;
    enemyImage.classList.add('enemy-hit');
    setTimeout(() => enemyImage.classList.remove('enemy-hit'), 200);
    
    // Враг бьет кота
    playerCurrentHp -= 10; // Враг бьет по 10

    updateBattleUI();

    // Проверка на конец боя
    if (enemyCurrentHp <= 0) {
      enemyCurrentHp = 0;
      endBattle(true);
    } else if (playerCurrentHp <= 0) {
      playerCurrentHp = 0;
      endBattle(false);
    }

    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
  }, 1000);
}

function updateBattleUI() {
  enemyHpBar.style.width = `${Math.max(0, (enemyCurrentHp / enemyMaxHp) * 100)}%`;
  playerHpBar.style.width = `${Math.max(0, (playerCurrentHp / maxHp) * 100)}%`;
  playerHpText.textContent = `HP: ${Math.max(0, playerCurrentHp)}/${maxHp}`;
}

function endBattle(isWin) {
  isBattleActive = false;
  clearInterval(battleInterval);
  
  setTimeout(() => {
    if (isWin) {
      coins += 50;
      alert("Победа! Ты получил 50 монет!");
    } else {
      alert("Ты проиграл... Кот сбежал в магазин чиниться.");
    }
    localStorage.setItem('coins', coins);
    updateUI();
    
    // Возврат на главный экран
    screenBattle.classList.add('hidden');
    screenGame.classList.remove('hidden');
    battleBg.classList.add('hidden'); // Прячем фон
  }, 500); // Небольшая задержка, чтобы увидеть 0 HP
}

// Кнопки управления боем
document.getElementById('goToBattleBtn').addEventListener('click', startBattle);
document.getElementById('backToGameBtn').addEventListener('click', () => {
  isBattleActive = false;
  clearInterval(battleInterval);
  screenBattle.classList.add('hidden');
  screenGame.classList.remove('hidden');
  battleBg.classList.add('hidden');
});

// --- ОВЕРЛЕИ (Магазин / Рейтинг) ---
document.getElementById('openShopBtn').addEventListener('click', () => {
  document.getElementById('overlay-shop').classList.remove('hidden');
});
document.getElementById('closeShopBtn').addEventListener('click', () => {
  document.getElementById('overlay-shop').classList.add('hidden');
});

document.getElementById('openRatingBtn').addEventListener('click', () => {
  document.getElementById('overlay-rating').classList.remove('hidden');
});
document.getElementById('closeRatingBtn').addEventListener('click', () => {
  document.getElementById('overlay-rating').classList.add('hidden');
});

// --- МАГАЗИН ---
document.getElementById('buyPowerBtn').addEventListener('click', () => {
  let cost = Math.floor(baseCostDamage * Math.pow(1.1, damage / 5 - 2));
  if (coins >= cost) {
    coins -= cost; damage += 5;
    localStorage.setItem('coins', coins); localStorage.setItem('damage', damage);
    updateUI(); if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  }
});

document.getElementById('buyHpBtn').addEventListener('click', () => {
  let cost = Math.floor(baseCostHp * Math.pow(1.1, maxHp / 10 - 10));
  if (coins >= cost) {
    coins -= cost; maxHp += 10;
    localStorage.setItem('coins', coins); localStorage.setItem('maxHp', maxHp);
    updateUI(); if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  }
});

document.getElementById('buyAutoBtn').addEventListener('click', () => {
  let cost = Math.floor(baseCostAuto * Math.pow(1.1, autoLevel));
  if (coins >= cost) {
    coins -= cost; autoLevel++;
    localStorage.setItem('coins', coins); localStorage.setItem('autoLevel', autoLevel);
    updateUI(); if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  }
});

// --- ФАРМ (Клик по коту) ---
petImage.addEventListener('click', () => {
  coins += 1; 
  updateUI();
  localStorage.setItem('coins', coins);
  petImage.classList.add('pet-squash');
  setTimeout(() => petImage.classList.remove('pet-squash'), 100); 
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
});

setInterval(() => {
  if (autoLevel > 0) {
    coins += autoLevel; updateUI(); localStorage.setItem('coins', coins);
  }
}, 1000);

// --- РЕЙТИНГ (Сброс и Шеринг) ---
document.getElementById('shareBtn').addEventListener('click', () => {
  const text = `Я накликал ${formatNumber(highScore)} монет в игре "Кибер-Кот"! Попробуй побить мой рекорд! 🐈‍⬛💻`;
  const url = "https://t.me/GrimoireDuel_bot/grimoire_game"; 
  if (tg) {
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
  } else {
    alert("В Телеграме тут откроется окно 'Поделиться'");
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm("Ты уверен, что хочешь удалить весь прогресс? Кот обидится...")) {
    localStorage.clear();
    location.reload();
  }
});

updateUI();

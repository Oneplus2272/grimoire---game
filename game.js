let tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.disableVerticalSwipes();
  if (tg.requestFullscreen) tg.requestFullscreen();
}

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
const enemyImage = document.getElementById('enemyImage');
const battlePetImage = document.getElementById('battlePetImage');
const enemyHpBar = document.getElementById('enemyHpBar');
const playerHpBar = document.getElementById('playerHpBar');
const enemyHpText = document.getElementById('enemyHpText');
const playerHpText = document.getElementById('playerHpText');
const enemyDamageContainer = document.getElementById('enemy-damage-container');
const playerDamageContainer = document.getElementById('player-damage-container');

const screenGame = document.getElementById('screen-game');
const screenBattle = document.getElementById('screen-battle');
const screenShop = document.getElementById('screen-shop');
const screenRating = document.getElementById('screen-rating');

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

// --- ЭФФЕКТЫ УРОНА ---
function spawnDamage(container, amount, isPlayerDmg) {
  const el = document.createElement('div');
  el.classList.add(isPlayerDmg ? 'floating-damage-player' : 'floating-damage-enemy');
  el.textContent = `-${amount}`;
  
  const x = Math.random() * 80 + 10;
  const y = Math.random() * 50 + 20;
  
  el.style.left = `${x}%`;
  el.style.top = `${y}%`;
  
  container.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

// --- БОЙ ---
function startBattle() {
  document.body.classList.add('hide-ui');

  screenGame.classList.add('hidden');
  screenBattle.classList.remove('hidden');
  
  isBattleActive = true;
  
  enemyCurrentHp = enemyMaxHp;
  playerCurrentHp = maxHp;
  updateBattleUI();

  clearInterval(battleInterval);
  battleInterval = setInterval(() => {
    if (!isBattleActive) return;

    // Кот бьет крысу
    enemyCurrentHp -= damage;
    spawnDamage(enemyDamageContainer, damage, true);
    enemyImage.classList.add('hit-shake');
    setTimeout(() => enemyImage.classList.remove('hit-shake'), 200);

    // Крыса бьет кота
    playerCurrentHp -= 15; 
    spawnDamage(playerDamageContainer, 15, false);
    battlePetImage.classList.add('hit-shake');
    setTimeout(() => battlePetImage.classList.remove('hit-shake'), 200);

    updateBattleUI();
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');

    if (enemyCurrentHp <= 0) {
      enemyCurrentHp = 0;
      endBattle(true);
    } else if (playerCurrentHp <= 0) {
      playerCurrentHp = 0;
      endBattle(false);
    }
  }, 1000);
}

function updateBattleUI() {
  enemyHpBar.style.width = `${Math.max(0, (enemyCurrentHp / enemyMaxHp) * 100)}%`;
  enemyHpText.textContent = `HP: ${Math.max(0, enemyCurrentHp)}/${enemyMaxHp}`;
  
  playerHpBar.style.width = `${Math.max(0, (playerCurrentHp / maxHp) * 100)}%`;
  playerHpText.textContent = `HP: ${Math.max(0, playerCurrentHp)}/${maxHp}`;
}

function endBattle(isWin) {
  isBattleActive = false;
  clearInterval(battleInterval);
  
  setTimeout(() => {
    if (isWin) {
      coins += 100;
      alert("Победа! Ты получил 100 монет!");
    } else {
      alert("Ты проиграл... Кот сбежал чиниться.");
    }
    localStorage.setItem('coins', coins);
    updateUI();
    
    document.body.classList.remove('hide-ui');
    
    screenBattle.classList.add('hidden');
    screenGame.classList.remove('hidden');
  }, 800);
}

// ВОТ ТУТ БЫЛА ОШИБКА, ТЕПЕРЬ КНОПКА РАБОТАЕТ
document.getElementById('goToBattleBtn').addEventListener('click', startBattle);

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

// --- АВТОКЛИК ---
setInterval(() => {
  if (autoLevel > 0) {
    coins += autoLevel; updateUI(); localStorage.setItem('coins', coins);
  }
}, 1000);

// --- НАВИГАЦИЯ ---
function switchTab(activeBtnId, activeScreen) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.main-content').forEach(scr => scr.classList.add('hidden'));
  document.getElementById(activeBtnId).classList.add('active');
  activeScreen.classList.remove('hidden');
}

document.getElementById('navGameBtn').addEventListener('click', () => switchTab('navGameBtn', screenGame));
document.getElementById('navShopBtn').addEventListener('click', () => switchTab('navShopBtn', screenShop));
document.getElementById('navRatingBtn').addEventListener('click', () => switchTab('navRatingBtn', screenRating));

// --- РЕЙТИНГ ---
document.getElementById('shareBtn').addEventListener('click', () => {
  const text = `Я накликал ${formatNumber(highScore)} монет в игре "Кибер-Кот"! Попробуй побить мой рекорд! 🐈‍⬛💻`;
  const url = "https://t.me/GrimoireDuel_bot/grimoire_game"; 
  if (tg) tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
  else alert("В Телеграме тут откроется окно 'Поделиться'");
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm("Ты уверен, что хочешь удалить весь прогресс?")) {
    localStorage.clear();
    location.reload();
  }
});

updateUI();

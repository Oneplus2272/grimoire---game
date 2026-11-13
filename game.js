// Проверяем, запущен ли скрипт внутри Telegram
let tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand(); // Растягиваем на максимум доступной высоты
  tg.disableVerticalSwipes(); // Запрещаем случайно закрывать игру свайпом вниз
  
  // Пытаемся запросить полноэкранный режим (работает в новых версиях Telegram)
  if (tg.requestFullscreen) {
    tg.requestFullscreen();
  }
}

// Загружаем сохраненные монеты
let coins = parseInt(localStorage.getItem('coins')) || 0;
const coinsEl = document.getElementById('coins');
const tapBtn = document.getElementById('tapBtn');

function updateUI() {
  coinsEl.textContent = coins;
}

tapBtn.addEventListener('click', () => {
  coins += 1;
  updateUI();
  localStorage.setItem('coins', coins);
  
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.impactOccurred('light');
  }
});

updateUI();

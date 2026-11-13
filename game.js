// Проверяем, запущен ли скрипт внутри Telegram
let tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand(); // Растягиваем на весь экран
}

// Загружаем сохраненные монеты
let coins = parseInt(localStorage.getItem('coins')) || 0;
const coinsEl = document.getElementById('coins');
const tapBtn = document.getElementById('tapBtn');

// Обновляем текст на экране
function updateUI() {
  coinsEl.textContent = coins;
}

// Обработчик клика
tapBtn.addEventListener('click', () => {
  coins += 1;
  updateUI();
  localStorage.setItem('coins', coins);
  
  // Вибрация, если мы в Телеге
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.impactOccurred('light');
  }
});

// Запускаем обновление при старте
updateUI();

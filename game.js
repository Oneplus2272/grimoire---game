// Разворачиваем игру на весь экран при загрузке
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.expand();
    window.Telegram.WebApp.disableVerticalSwipes();
}

// Функция для кнопки Атака
function startBattle() {
    alert('Поиск противника... (Боевая система скоро появится)');
}

// Функция для клика по карте
function showCardInfo() {
    alert('Огненный Демон\nУрон: 8\nHP: 15');
}

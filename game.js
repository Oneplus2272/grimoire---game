// Ждем, пока Telegram загрузится
if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;

    // Сначала разворачиваем на максимум
    tg.expand(); 
    tg.disableVerticalSwipes();

    // Затем запрашиваем НАСТОЯЩИЙ полноэкранный режим (убирает панели)
    if (tg.requestFullscreen) {
        tg.requestFullscreen();
    }
}

function startBattle() {
    alert('Поиск противника... (Боевая система скоро появится)');
}

function showCardInfo() {
    alert('Огненный Демон\nУрон: 8\nHP: 15');
}

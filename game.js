if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.disableVerticalSwipes();
}

// Список наших карт
const cards = [
    "public/legend_fire.png",
    "public/legend_ice.png",
    "public/legend_shadow.png"
];

let winningCard = "";
let spinInterval;
let isSpinning = false;

// Функция для запуска рулетки
function spinRoulette() {
    if (isSpinning) return;
    isSpinning = true;

    document.getElementById('spin-button').classList.add('hidden');
    const imageElement = document.getElementById('roulette-image');
    
    let counter = 0;
    // Крутим картинки очень быстро
    spinInterval = setInterval(() => {
        // Берем случайную карту из списка для мелькания
        const randomIndex = Math.floor(Math.random() * cards.length);
        imageElement.src = cards[randomIndex];
        counter++;
    }, 50); // Каждые 50 миллисекунд

    // Через 3 секунды (3000 мс) останавливаем
    setTimeout(() => {
        clearInterval(spinInterval);
        isSpinning = false;
        
        // Выбираем финальную карту-победителя
        const finalIndex = Math.floor(Math.random() * cards.length);
        winningCard = cards[finalIndex];
        imageElement.src = winningCard;

        // Показываем кнопку "Забрать"
        document.getElementById('claim-button').classList.remove('hidden');
    }, 3000);
}

// Функция для забора карты
function claimCard() {
    document.getElementById('roulette-screen').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');
    
    // Ставим выигранную карту на главный экран
    document.getElementById('player-card').src = winningCard;
}

// Функция атаки (пока заглушка)
function startBattle() {
    alert('Поиск противника... (Боевая система скоро появится)');
}

if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.disableVerticalSwipes();
}

// Все карты строго в .png
const cards = [
    "public/legend_fire.png",
    "public/legend_ice.png",
    "public/legend_shadow.png"
];

let winningCard = "";
let spinInterval;
let isSpinning = false;

function spinRoulette() {
    if (isSpinning) return;
    isSpinning = true;

    document.getElementById('spin-button').classList.add('hidden');
    const imageElement = document.getElementById('roulette-image');
    
    // Мелькание карт
    spinInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * cards.length);
        // Добавляем таймстамп, чтобы браузер перерисовывал
        imageElement.src = cards[randomIndex] + "?t=" + new Date().getTime();
    }, 50);

    // Остановка через 3 сек
    setTimeout(() => {
        clearInterval(spinInterval);
        isSpinning = false;
        
        const finalIndex = Math.floor(Math.random() * cards.length);
        winningCard = cards[finalIndex];
        imageElement.src = winningCard + "?t=" + new Date().getTime();

        document.getElementById('claim-button').classList.remove('hidden');
    }, 3000);
}

function claimCard() {
    document.getElementById('roulette-screen').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');
    document.getElementById('player-card').src = winningCard;
}

function startBattle() {
    alert('Поиск противника... (Боевая система скоро появится)');
}

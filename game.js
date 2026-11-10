// Инициализация Telegram Web App (разворачиваем на весь экран)
if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand(); // Принудительно на весь экран
}

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Автоподгон разрешения холста под любые изменения экрана (планшет/телефон)
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}

window.addEventListener('resize', resizeCanvas);

// Загрузка фонового изображения
const bgImage = new Image();
bgImage.src = 'https://genai.googleapis.com/v1alpha/files/watermarked_img_13693199880587188191.jpg';

bgImage.onload = () => {
    resizeCanvas();
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка фона с сохранением пропорций (Cover)
    const hRatio = canvas.width / bgImage.width;
    const vRatio = canvas.height / bgImage.height;
    const ratio = Math.max(hRatio, vRatio);
    
    const centerShiftX = (canvas.width - bgImage.width * ratio) / 2;
    const centerShiftY = (canvas.height - bgImage.height * ratio) / 2;

    ctx.drawImage(
        bgImage, 
        0, 0, bgImage.width, bgImage.height,
        centerShiftX, centerShiftY, bgImage.width * ratio, bgImage.height * ratio
    );
}

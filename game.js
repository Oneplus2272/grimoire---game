let tg = window.Telegram.WebApp;
tg.expand();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Размеры холста на весь экран
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Игровые параметры
const MAP_SIZE = 50; // Сетка 50 на 50
const TILE_SIZE = 40; // Базовый размер тайла в пикселях
let gold = 100;
const gridData = Array(MAP_SIZE).fill().map(() => Array(MAP_SIZE).fill(0));

// Параметры камеры (позиция и масштаб для зума)
let camera = {
    x: canvas.width / 2,
    y: canvas.height / 4,
    zoom: 1
};

// Переменные для перетаскивания (драг-н-дроп)
let isDragging = false;
let startX, startY;

// Элементы интерфейса
const goldCountElement = document.getElementById('goldCount');
const buildingSelector = document.getElementById('buildingType');

function updateUI() {
    goldCountElement.innerText = gold;
}

// Главная функция отрисовки карты
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Применяем сдвиг и зум камеры
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    for (let r = 0; r < MAP_SIZE; r++) {
        for (let c = 0; c < MAP_SIZE; c++) {
            // Перевод координат сетки в изометрию
            const x = (c - r) * (TILE_SIZE);
            const y = (c + r) * (TILE_SIZE / 2);

            // Отрисовка ромба (тайла)
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + TILE_SIZE, y + TILE_SIZE / 2);
            ctx.lineTo(x, y + TILE_SIZE);
            ctx.lineTo(x - TILE_SIZE, y + TILE_SIZE / 2);
            ctx.closePath();

            // Цвет тайла в зависимости от постройки
            const val = gridData[r][c];
            if (val === 1) {
                ctx.fillStyle = '#b58d3d'; // Шахта
            } else if (val === 2) {
                ctx.fillStyle = '#6a3db5'; // Башня
            } else {
                ctx.fillStyle = '#2e6f40'; // Трава
            }
            ctx.fill();

            ctx.strokeStyle = '#1e4d2b';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Иконки по центру тайла
            if (val === 1) {
                ctx.font = `${Math.max(12, 16 * camera.zoom)}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🪙', x, y + TILE_SIZE / 2);
            } else if (val === 2) {
                ctx.font = `${Math.max(12, 16 * camera.zoom)}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🔮', x, y + TILE_SIZE / 2);
            }
        }
    }

    ctx.restore();
}

// Преобразование координат экрана в координаты сетки
function screenToGrid(screenX, screenY) {
    // Убираем смещение камеры и зум
    const cx = (screenX - camera.x) / camera.zoom;
    const cy = (screenY - camera.y) / camera.zoom;

    for (let r = 0; r < MAP_SIZE; r++) {
        for (let c = 0; c < MAP_SIZE; c++) {
            const x = (c - r) * TILE_SIZE;
            const y = (c + r) * (TILE_SIZE / 2);

            // Проверяем попадание точки в ромб
            if (
                cx >= x - TILE_SIZE && cx <= x + TILE_SIZE &&
                cy >= y && cy <= y + TILE_SIZE
            ) {
                return { r, c };
            }
        }
    }
    return null;
}

// Обработка касаний и мыши для скролла и кликов
let pointerDownTime = 0;
let pointerMoved = false;

canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    pointerDownTime = Date.now();
    pointerMoved = false;
});

canvas.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        pointerMoved = true;
    }

    camera.x += dx;
    camera.y += dy;

    startX = e.clientX;
    startY = e.clientY;
    draw();
});

canvas.addEventListener('pointerup', (e) => {
    isDragging = false;
    // Если кликнули без смещения (это был тап, а не скролл карты)
    if (!pointerMoved || (Date.now() - pointerDownTime < 200)) {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const clickedCell = screenToGrid(clickX, clickY);
        if (clickedCell) {
            const { r, c } = clickedCell;
            if (gridData[r][c] === 0) {
                const selectedBuilding = parseInt(buildingSelector.value);
                if (gold >= 30) {
                    gold -= 30;
                    gridData[r][c] = selectedBuilding;
                    updateUI();
                    draw();
                } else {
                    alert('Не хватает золота!');
                }
            }
        }
    }
});

// Зум колесиком мыши (на планшете с клавиатурой или мышкой)
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    if (e.deltaY < 0) {
        camera.zoom = Math.min(camera.zoom * zoomFactor, 3.0); // Максимальное приближение
    } else {
        camera.zoom = Math.max(camera.zoom / zoomFactor, 0.4); // Максимальное отдаление
    }
    draw();
}, { passive: false });

// Пассивный доход от шахт
setInterval(() => {
    let income = 0;
    for (let r = 0; r < MAP_SIZE; r++) {
        for (let c = 0; c < MAP_SIZE; c++) {
            if (gridData[r][c] === 1) income += 5;
        }
    }
    if (income > 0) {
        gold += income;
        updateUI();
    }
}, 3000);

// Первый запуск
updateUI();
draw();

// Инициализация Telegram WebApp
let tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем на весь экран

// Игровые переменные
const size = 4;
let gold = 100;
const gridData = Array(size).fill().map(() => Array(size).fill(0));

const gridElement = document.getElementById('gameGrid');
const buildingSelector = document.getElementById('buildingType');
const goldCountElement = document.getElementById('goldCount');

// Функция отрисовки сетки
function renderGrid() {
    gridElement.innerHTML = '';
    
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            const val = gridData[r][c];
            if (val === 1) {
                cell.classList.add('building-1');
                cell.innerText = '🪙';
            } else if (val === 2) {
                cell.classList.add('building-2');
                cell.innerText = '🔮';
            }

            // Клик по клетке сетки
            cell.addEventListener('click', () => {
                // Если клетка пустая
                if (gridData[r][c] === 0) {
                    const selectedBuilding = parseInt(buildingSelector.value);
                    
                    // Проверка на золото (например, постройка стоит 30 монет)
                    if (gold >= 30) {
                        gold -= 30;
                        gridData[r][c] = selectedBuilding;
                        updateUI();
                        renderGrid();
                    } else {
                        alert('Не хватает золота!');
                    }
                }
            });

            gridElement.appendChild(cell);
        }
    }
}

// Обновление интерфейса ресурсов
function updateUI() {
    goldCountElement.innerText = gold;
}

// Пассивный доход от шахт каждые 3 секунды
setInterval(() => {
    let income = 0;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (gridData[r][c] === 1) {
                income += 5; // Шахта приносит 5 золота
            }
        }
    }
    if (income > 0) {
        gold += income;
        updateUI();
    }
}, 3000);

// Первый запуск
updateUI();
renderGrid();

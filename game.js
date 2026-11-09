// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем на весь экран

// Управление модальным окном зданий
function openBuilding(name, description) {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    document.getElementById('modalTitle').innerText = name;
    document.getElementById('modalDesc').innerText = description;
    document.getElementById('buildingModal').classList.remove('hidden');
}

function closeModal() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.selectionChanged();
    }
    document.getElementById('buildingModal').classList.add('hidden');
}

function upgradeBuilding() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
    alert('Улучшение запущено!');
    closeModal();
}

// Переключение вкладок внизу
function switchTab(tabName, event) {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.selectionChanged();
    }
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    if (tabName === 'map') {
        alert('Раздел "Глобальная карта" находится в разработке!');
    } else if (tabName === 'army') {
        alert('Раздел "Походы и армия" скоро появится!');
    }
}

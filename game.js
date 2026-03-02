
// --- Настройки игры ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const messageDiv = document.getElementById('message');

// Размеры игрового мира и размер пикселя
const TILE_SIZE = 32; // Размер одного "квадратика" в пикселях
const MAP_WIDTH = 10; // Количество тайлов по ширине
const MAP_HEIGHT = 10; // Количество тайлов по высоте

// Размеры канваса в пикселях (TILE_SIZE * количество тайлов)
canvas.width = MAP_WIDTH * TILE_SIZE;
canvas.height = MAP_HEIGHT * TILE_SIZE;

// Цвета (R, G, B)
const COLORS = {
    player: [0, 255, 0],       // Зеленый игрок
    wall: [128, 128, 128],     // Серый стена
    floor: [50, 50, 50],       // Темно-серый пол
    item: [255, 255, 0],       // Желтый предмет
    goal: [255, 0, 0]          // Красная цель
};

// Карта игры: 0 - пол, 1 - стена, 2 - предмет, 3 - цель
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 2, 1], // 2 - предмет
    [1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Позиция игрока (x, y) в тайлах
let playerPos = { x: 1, y: 1 };
let hasItem = false; // Флаг наличия предмета
let gameOver = false;

// --- Функции рисования ---

function drawTile(x, y, color) {
    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawPlayer(x, y) {
    // Простая пиксельная "фигура" игрока
    ctx.fillStyle = `rgb(${COLORS.player[0]}, ${COLORS.player[1]}, ${COLORS.player[2]})`;
    ctx.fillRect(x * TILE_SIZE + TILE_SIZE / 4, y * TILE_SIZE + TILE_SIZE / 4, TILE_SIZE / 2, TILE_SIZE / 2);
}

function drawMap() {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tile = map[y][x];
            if (tile === 0) drawTile(x, y, COLORS.floor);
            else if (tile === 1) drawTile(x, y, COLORS.wall);
            else if (tile === 2) drawTile(x, y, COLORS.item);
            else if (tile === 3) drawTile(x, y, COLORS.goal);
        }
    }
}

function renderGame() {
    // Очищаем канвас
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем карту
    drawMap();
    
    // Рисуем игрока
    drawPlayer(playerPos.x, playerPos.y);

    // Обновляем сообщение
    if (gameOver) {
        messageDiv.innerHTML = "🎉 ПОБЕДА! Ты собрал все предметы и достиг цели! 🎉";
        // Добавляем кнопку "Выход" (или "Играть снова", если захочешь)
        const winButton = document.createElement('button');
        winButton.textContent = "Выход";
        winButton.className = 'win-button'; // Класс для стилизации
        winButton.onclick = () => {
            messageDiv.innerHTML = "Спасибо за игру! Ты можешь закрыть вкладку.";
            document.querySelector('.controls').style.display = 'none'; // Скрыть кнопки управления
        };
        messageDiv.appendChild(winButton);
        document.querySelector('.controls').style.display = 'none'; // Скрыть кнопки управления
    } else if (hasItem) {
        messageDiv.textContent = "Ты нашел ключ! Теперь найди выход.";
    } else {
        messageDiv.textContent = "Найди ключ и доберись до выхода!";
    }
}

// --- Логика игры ---

function isMoveValid(x, y) {
    // Проверяем границы карты
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) {
        return false;
    }
    // Проверяем, не наткнулись ли на стену
    if (map[y][x] === 1) {
        return false;
    }
    return true;
}

function movePlayer(dx, dy) {
    if (gameOver) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (isMoveValid(newX, newY)) {
        playerPos.x = newX;
        playerPos.y = newY;

        // Проверяем, что мы подобрали
        if (map[playerPos.y][playerPos.x] === 2) {
            hasItem = true;
            messageDiv.textContent = "Ты нашел ключ! Теперь найди выход.";
            // Можно убрать предмет с карты, чтобы он больше не рисовался
            map[playerPos.y][playerPos.x] = 0; 
        }
        
        // Проверяем, достигли ли цели
        if (map[playerPos.y][playerPos.x] === 3 && hasItem) {
            gameOver = true;
            messageDiv.innerHTML = "🎉 ПОБЕДА! Ты собрал все предметы и достиг цели! 🎉";
            const winButton = document.createElement('button');
            winButton.textContent = "Закрыть";
            winButton.className = 'win-button';
            winButton.onclick = () => {
                messageDiv.innerHTML = "Спасибо за игру! Ты можешь закрыть вкладку.";
                document.querySelector('.controls').style.display = 'none';
            };
            messageDiv.appendChild(winButton);
            document.querySelector('.controls').style.display = 'none';
        } else if (map[playerPos.y][playerPos.x] === 3 && !hasItem) {
            messageDiv.textContent = "Ты у цели, но без ключа не пройти!";
        }

        renderGame(); // Перерисовываем игру после движения
    }
}

// --- Обработка ввода ---

document.getElementById('move-up').addEventListener('click', () => movePlayer(0, -1));
document.getElementById('move-down').addEventListener('click', () => movePlayer(0, 1));
document.getElementById('move-left').addEventListener('click', () => movePlayer(-1, 0));
document.getElementById('move-right').addEventListener('click', () => movePlayer(1, 0));

// Обработка клавиатуры (опционально, для удобства)
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
});

// --- Инициализация игры ---
function initGame() {
    // Находим стартовую позицию (например, первый тайл с полом)
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (map[y][x] === 0) {
                playerPos = { x: x, y: y };
                // Устанавливаем цель (обычно на карте есть один тайл '3')
                // Здесь предполагаем, что цель всегда в (8,8), если это не так, нужно добавить поиск
                // map[8][8] = 3; // Если цель не задана в карте
                break;
            }
        }
        if (playerPos.x !== 1 || playerPos.y !== 1) break; // Нашли стартовую точку
    }
    
    renderGame(); // Первое отображение
}

initGame();

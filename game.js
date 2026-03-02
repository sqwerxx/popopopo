const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const diagBox = document.getElementById('dialogue-box');
const diagText = document.getElementById('dialogue-text');
const diagName = document.getElementById('speaker-name');

const TILE_SIZE = 32;
canvas.width = 320;
canvas.height = 320;

// Состояние игры
let gameState = 'explore'; // 'explore' или 'dialogue'
let currentDialogueNode = null;

// Игрок
const player = { x: 1, y: 1, hasEmber: false };

// Карта (1 - стена, 0 - пол)
const map = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,1,0,1,0,0,1],
    [1,1,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1],
];

// Сущности (NPC)
const entities = [
    {
        id: 'elder',
        x: 5, y: 1,
        name: 'Старец',
        color: '#55aaff',
        dialogue: [
            { text: "Приветствую, путник! Наш Великий Огонёк угасает...", next: 1 },
            { text: "Найди Древнюю Искру на юге и принеси её мне.", next: null }
        ],
        questDoneDialogue: [
            { text: "О! Я вижу Искру в твоих руках!", next: 1 },
            { text: "Теперь наш стрик будет гореть вечно. Ты спас нас!", next: null }
        ]
    },
    {
        id: 'spark',
        x: 8, y: 8,
        name: 'Алтарь',
        color: '#ffff00',
        dialogue: [
            { text: "Вы нашли Древнюю Искру! (Она очень горячая)", next: null }
        ]
    }
];

// --- Рендеринг ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем карту
    for(let y=0; y<10; y++) {
        for(let x=0; x<10; x++) {
            ctx.fillStyle = map[y][x] === 1 ? '#222' : '#444';
            ctx.fillRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE-1, TILE_SIZE-1);
        }
    }

    // Рисуем NPC
    entities.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x*TILE_SIZE+4, e.y*TILE_SIZE+4, TILE_SIZE-8, TILE_SIZE-8);
    });

    // Рисуем игрока
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x*TILE_SIZE+4, player.y*TILE_SIZE+4, TILE_SIZE-8, TILE_SIZE-8);
}

// --- Логика диалогов ---
function startDialogue(npc) {
    gameState = 'dialogue';
    currentDialogueNode = 0;
    
    // Выбираем ветку диалога
    let lines = npc.dialogue;
    if (npc.id === 'elder' && player.hasEmber) lines = npc.questDoneDialogue;

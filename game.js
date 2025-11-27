// Game Configuration
const config = {
    symbols: ['🍒', '🍋', '🍊', '🍉', '⭐', '💎', '7️⃣'],
    winChance: 0.3,
    coinRewards: {
        '7️⃣': 50,
        '💎': 40,
        '⭐': 30,
        '🍉': 25,
        '🍊': 20,
        '🍋': 20,
        '🍒': 20
    }
};

// Matter.js modules
const { Engine, Render, World, Bodies, Body, Events, Runner } = Matter;

// Game State
let engine, render, world, runner;
let pusherTop, pusherBottom;
let coins = [];
let score = 0;
let isSpinning = false;

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const coinButton = document.getElementById('coinButton');
const scoreDisplay = document.getElementById('score');
const slotResult = document.getElementById('slotResult');
const winNotification = document.getElementById('winNotification');
const winTitle = document.getElementById('winTitle');
const winMessage = document.getElementById('winMessage');

// Initialize Game
function initGame() {
    try {
        // Check if Matter.js loaded
        if (typeof Matter === 'undefined') {
            throw new Error('Matter.js failed to load');
        }
        
        console.log('Matter.js loaded successfully');
        
        // Setup Matter.js
        engine = Engine.create();
        world = engine.world;
        world.gravity.y = 2;

        const canvasWidth = canvas.offsetWidth;
        const canvasHeight = canvas.offsetHeight;

        render = Render.create({
            canvas: canvas,
            engine: engine,
            options: {
                width: canvasWidth,
                height: canvasHeight,
                wireframes: false,
                background: 'transparent'
            }
        });

        Render.run(render);
        runner = Runner.create();
        Runner.run(runner, engine);

        createPushers();
        createWalls();
        fillInitialCoins();
        
        // Animation loop for pushers
        setInterval(updatePushers, 16);
        
        // Collision detection
        Events.on(engine, 'collisionStart', handleCollisions);

        // Event listeners
        coinButton.addEventListener('click', dropCoin);
        window.addEventListener('resize', handleResize);
        
        console.log('Game initialized successfully!');
        
    } catch (error) {
        console.error('Game initialization failed:', error);
        alert('遊戲載入失敗：' + error.message + '\n\n請重新整理頁面。');
    }
}

function createPushers() {
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;
    
    // Top pusher (narrower, purple)
    const topPusherY = canvasHeight * 0.25;
    const topPusherWidth = canvasWidth * 0.7;
    pusherTop = Bodies.rectangle(
        canvasWidth / 2,
        topPusherY,
        topPusherWidth,
        20,
        {
            isStatic: true,
            render: {
                fillStyle: '#9d4edd'
            }
        }
    );
    pusherTop.movement = { direction: 1, speed: 2, maxDistance: 80, distance: 0 };

    // Bottom pusher (wider, purple)
    const bottomPusherY = canvasHeight * 0.7;
    const bottomPusherWidth = canvasWidth * 0.9;
    pusherBottom = Bodies.rectangle(
        canvasWidth / 2,
        bottomPusherY,
        bottomPusherWidth,
        20,
        {
            isStatic: true,
            render: {
                fillStyle: '#7209b7'
            }
        }
    );
    pusherBottom.movement = { direction: -1, speed: 2, maxDistance: 80, distance: 0 };

    World.add(world, [pusherTop, pusherBottom]);
}

function createWalls() {
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;
    const wallThickness = 10;

    // Side walls
    const leftWall = Bodies.rectangle(
        wallThickness / 2,
        canvasHeight / 2,
        wallThickness,
        canvasHeight,
        {
            isStatic: true,
            render: { fillStyle: '#ff6b00' }
        }
    );

    const rightWall = Bodies.rectangle(
        canvasWidth - wallThickness / 2,
        canvasHeight / 2,
        wallThickness,
        canvasHeight,
        {
            isStatic: true,
            render: { fillStyle: '#ff6b00' }
        }
    );

    // Top pusher barriers
    const topLeftBarrier = Bodies.rectangle(
        canvasWidth * 0.15 - 15,
        canvasHeight * 0.25,
        10,
        100,
        {
            isStatic: true,
            render: { fillStyle: '#ffd700' }
        }
    );

    const topRightBarrier = Bodies.rectangle(
        canvasWidth * 0.85 + 15,
        canvasHeight * 0.25,
        10,
        100,
        {
            isStatic: true,
            render: { fillStyle: '#ffd700' }
        }
    );

    // Bottom floor
    const floor = Bodies.rectangle(
        canvasWidth / 2,
        canvasHeight - 5,
        canvasWidth,
        10,
        {
            isStatic: true,
            render: { fillStyle: '#ff0080' }
        }
    );

    World.add(world, [leftWall, rightWall, topLeftBarrier, topRightBarrier, floor]);
}

function fillInitialCoins() {
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;
    
    // Fill top pusher area
    for (let i = 0; i < 30; i++) {
        const x = canvasWidth * 0.15 + Math.random() * (canvasWidth * 0.7);
        const y = canvasHeight * 0.15 + Math.random() * 60;
        createCoin(x, y);
    }
    
    // Fill bottom pusher area
    for (let i = 0; i < 50; i++) {
        const x = canvasWidth * 0.05 + Math.random() * (canvasWidth * 0.9);
        const y = canvasHeight * 0.5 + Math.random() * 100;
        createCoin(x, y);
    }
}

function createCoin(x, y, color = null) {
    if (!color) {
        const colors = ['#ffd700', '#ffa500', '#ffed4e', '#ffb700'];
        color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    const coin = Bodies.circle(x, y, 12, {
        restitution: 0.3,
        friction: 0.5,
        density: 0.002,
        render: {
            fillStyle: color,
            strokeStyle: '#ff6b00',
            lineWidth: 2
        }
    });
    
    coins.push(coin);
    World.add(world, coin);
    
    return coin;
}

function updatePushers() {
    // Update top pusher
    pusherTop.movement.distance += pusherTop.movement.speed * pusherTop.movement.direction;
    if (Math.abs(pusherTop.movement.distance) >= pusherTop.movement.maxDistance) {
        pusherTop.movement.direction *= -1;
    }
    Body.setPosition(pusherTop, {
        x: pusherTop.position.x,
        y: pusherTop.position.y + pusherTop.movement.speed * pusherTop.movement.direction
    });

    // Update bottom pusher
    pusherBottom.movement.distance += pusherBottom.movement.speed * pusherBottom.movement.direction;
    if (Math.abs(pusherBottom.movement.distance) >= pusherBottom.movement.maxDistance) {
        pusherBottom.movement.direction *= -1;
    }
    Body.setPosition(pusherBottom, {
        x: pusherBottom.position.x,
        y: pusherBottom.position.y + pusherBottom.movement.speed * pusherBottom.movement.direction
    });
}

function handleCollisions(event) {
    const pairs = event.pairs;
    const canvasHeight = canvas.offsetHeight;
    
    pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        
        // Check if coin fell to the bottom
        coins.forEach((coin, index) => {
            if ((bodyA === coin || bodyB === coin) && 
                coin.position.y > canvasHeight - 30) {
                score++;
                updateScore();
                World.remove(world, coin);
                coins.splice(index, 1);
            }
        });
    });
}

function dropCoin() {
    if (isSpinning) return;
    
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;
    
    // Drop coin from top pusher back position with random left/right offset
    const randomOffset = (Math.random() - 0.5) * 80;
    const x = canvasWidth / 2 + randomOffset;
    const y = canvasHeight * 0.15;
    
    createCoin(x, y, '#ffed4e');
    
    // Animate button
    coinButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
        coinButton.style.transform = 'scale(1)';
    }, 100);
    
    // Spin slot machine
    spinSlotMachine();
}

function spinSlotMachine() {
    if (isSpinning) return;
    
    isSpinning = true;
    slotResult.textContent = 'SPINNING...';
    
    const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
    const results = [];
    
    reels.forEach((reel, index) => {
        reel.classList.add('spinning');
        
        setTimeout(() => {
            reel.classList.remove('spinning');
            
            // Determine result
            const isWin = Math.random() < config.winChance;
            let symbol;
            
            if (index === 0) {
                symbol = config.symbols[Math.floor(Math.random() * config.symbols.length)];
                results.push(symbol);
            } else {
                if (isWin && Math.random() < 0.8) {
                    symbol = results[0];
                } else {
                    symbol = config.symbols[Math.floor(Math.random() * config.symbols.length)];
                }
                results.push(symbol);
            }
            
            // Update reel display
            const symbols = reel.querySelectorAll('.symbol');
            const targetIndex = config.symbols.indexOf(symbol);
            symbols.forEach((sym, i) => {
                sym.style.transform = `translateY(-${targetIndex * 100}px)`;
            });
            
            // Check win condition after last reel
            if (index === 2) {
                setTimeout(() => checkWin(results), 300);
            }
        }, 1000 + index * 500);
    });
}

function checkWin(results) {
    if (results[0] === results[1] && results[1] === results[2]) {
        const symbol = results[0];
        const reward = config.coinRewards[symbol];
        
        slotResult.textContent = `🎉 WIN! ${symbol}${symbol}${symbol}`;
        
        showWinNotification(symbol, reward);
        dropRewardCoins(reward);
    } else {
        slotResult.textContent = `${results[0]} ${results[1]} ${results[2]} - Try Again!`;
    }
    
    isSpinning = false;
}

function dropRewardCoins(amount) {
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;
    
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            const x = canvasWidth * 0.3 + Math.random() * (canvasWidth * 0.4);
            const y = canvasHeight * 0.05;
            createCoin(x, y, '#ffed4e');
        }, i * 20);
    }
}

function showWinNotification(symbol, reward) {
    winTitle.textContent = `🎰 ${symbol} ${symbol} ${symbol} 🎰`;
    winMessage.textContent = `贏了 ${reward} 個銀仔！`;
    winNotification.classList.add('show');
    
    setTimeout(() => {
        winNotification.classList.remove('show');
    }, 3000);
}

function updateScore() {
    scoreDisplay.textContent = score;
}

function handleResize() {
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;
    
    render.canvas.width = canvasWidth;
    render.canvas.height = canvasHeight;
    render.options.width = canvasWidth;
    render.options.height = canvasHeight;
    
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: canvasWidth, y: canvasHeight }
    });
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

// Prevent accidental zoom on mobile
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('touchmove', (e) => {
    if (e.scale !== 1) e.preventDefault();
}, { passive: false });
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
    },
    physics: {
        gravity: -30,
        coinRadius: 0.15,
        coinHeight: 0.08,
        coinMass: 0.5,
        restitution: 0.3,
        friction: 0.4
    }
};

// Game State
let scene, camera, renderer;
let world;
let pusherTop, pusherBottom;
let coins = [];
let score = 0;
let isSpinning = false;
let animationId;

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const coinButton = document.getElementById('coinButton');
const scoreDisplay = document.getElementById('score');
const slotResult = document.getElementById('slotResult');
const winNotification = document.getElementById('winNotification');
const winTitle = document.getElementById('winTitle');
const winMessage = document.getElementById('winMessage');
const loadingScreen = document.getElementById('loadingScreen');

// Initialize Game
async function initGame() {
    try {
        // Check if Three.js and Cannon are loaded
        if (typeof THREE === 'undefined') {
            throw new Error('Three.js failed to load');
        }
        if (typeof CANNON === 'undefined') {
            throw new Error('Cannon-es failed to load');
        }
        
        console.log('Libraries loaded successfully');
        
        // Initialize Three.js
        initThree();
        
        // Initialize Cannon.js physics
        initPhysics();
        
        // Create game objects
        createMachine();
        createPushers();
        fillInitialCoins();
        
        // Start animation loop
        animate();
        
        // Hide loading screen
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
        
        // Event listeners
        coinButton.addEventListener('click', handleCoinDrop);
        window.addEventListener('resize', handleResize);
        
        console.log('Game initialized successfully');
        
    } catch (error) {
        console.error('Game initialization failed:', error);
        loadingScreen.querySelector('p').textContent = '遊戲載入失敗: ' + error.message;
        setTimeout(() => {
            alert('遊戲載入失敗：' + error.message + '\n\n請重新整理頁面或使用較新的瀏覽器。');
        }, 100);
    }
}

function initThree() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);
    
    // Camera (High angle looking down)
    const aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
    camera.position.set(0, 8, 10);
    camera.lookAt(0, 0, 0);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: false
    });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    scene.add(mainLight);
    
    // Accent lights
    const light1 = new THREE.PointLight(0xff0080, 1, 20);
    light1.position.set(-3, 3, 5);
    scene.add(light1);
    
    const light2 = new THREE.PointLight(0x00ffff, 1, 20);
    light2.position.set(3, 3, 5);
    scene.add(light2);
    
    console.log('Three.js initialized');
}

function initPhysics() {
    world = new CANNON.World();
    world.gravity.set(0, config.physics.gravity, 0);
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;
    world.defaultContactMaterial.friction = 0.4;
    world.defaultContactMaterial.restitution = 0.3;
    world.solver.iterations = 10;
    
    console.log('Cannon.js physics initialized');
}

function createMachine() {
    // Machine base
    const baseGeometry = new THREE.BoxGeometry(8, 0.2, 6);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4a0080,
        metalness: 0.6,
        roughness: 0.4
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1;
    base.receiveShadow = true;
    scene.add(base);
    
    const baseBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(4, 0.1, 3))
    });
    baseBody.position.set(0, -1, 0);
    world.addBody(baseBody);
    
    // Side walls
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff6b00,
        metalness: 0.5,
        roughness: 0.5
    });
    
    // Left wall
    const leftWallGeometry = new THREE.BoxGeometry(0.3, 4, 6);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-4, 1, 0);
    leftWall.castShadow = true;
    scene.add(leftWall);
    
    const leftWallBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(0.15, 2, 3))
    });
    leftWallBody.position.set(-4, 1, 0);
    world.addBody(leftWallBody);
    
    // Right wall
    const rightWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    rightWall.position.set(4, 1, 0);
    rightWall.castShadow = true;
    scene.add(rightWall);
    
    const rightWallBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(0.15, 2, 3))
    });
    rightWallBody.position.set(4, 1, 0);
    world.addBody(rightWallBody);
    
    // Back wall
    const backWallGeometry = new THREE.BoxGeometry(8, 4, 0.3);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 1, -3);
    backWall.castShadow = true;
    scene.add(backWall);
    
    const backWallBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(4, 2, 0.15))
    });
    backWallBody.position.set(0, 1, -3);
    world.addBody(backWallBody);
    
    // Top layer barriers (golden)
    const barrierMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xffd700,
        emissiveIntensity: 0.2
    });
    
    const barrierGeometry = new THREE.BoxGeometry(0.2, 1.5, 1.5);
    
    // Left barrier
    const leftBarrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    leftBarrier.position.set(-2.5, 1.8, -1.5);
    leftBarrier.castShadow = true;
    scene.add(leftBarrier);
    
    const leftBarrierBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.75, 0.75))
    });
    leftBarrierBody.position.set(-2.5, 1.8, -1.5);
    world.addBody(leftBarrierBody);
    
    // Right barrier
    const rightBarrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    rightBarrier.position.set(2.5, 1.8, -1.5);
    rightBarrier.castShadow = true;
    scene.add(rightBarrier);
    
    const rightBarrierBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.75, 0.75))
    });
    rightBarrierBody.position.set(2.5, 1.8, -1.5);
    world.addBody(rightBarrierBody);
}

function createPushers() {
    const pusherMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x9d4edd,
        metalness: 0.7,
        roughness: 0.3
    });
    
    // Top pusher (narrower)
    const topPusherGeometry = new THREE.BoxGeometry(5, 0.3, 0.8);
    const topPusherMesh = new THREE.Mesh(topPusherGeometry, pusherMaterial);
    topPusherMesh.position.set(0, 1.5, -2);
    topPusherMesh.castShadow = true;
    scene.add(topPusherMesh);
    
    const topPusherBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(2.5, 0.15, 0.4))
    });
    topPusherBody.position.set(0, 1.5, -2);
    world.addBody(topPusherBody);
    
    pusherTop = {
        mesh: topPusherMesh,
        body: topPusherBody,
        direction: 1,
        speed: 0.02,
        maxDistance: 1.2,
        distance: 0
    };
    
    // Bottom pusher (wider)
    const bottomPusherGeometry = new THREE.BoxGeometry(7, 0.3, 0.8);
    const bottomPusherMesh = new THREE.Mesh(bottomPusherGeometry, pusherMaterial);
    bottomPusherMesh.position.set(0, 0.5, 0);
    bottomPusherMesh.castShadow = true;
    scene.add(bottomPusherMesh);
    
    const bottomPusherBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(3.5, 0.15, 0.4))
    });
    bottomPusherBody.position.set(0, 0.5, 0);
    world.addBody(bottomPusherBody);
    
    pusherBottom = {
        mesh: bottomPusherMesh,
        body: bottomPusherBody,
        direction: -1,
        speed: 0.018,
        maxDistance: 1.0,
        distance: 0
    };
}

function fillInitialCoins() {
    // Fill top layer
    for (let i = 0; i < 25; i++) {
        const x = -2 + Math.random() * 4;
        const y = 2 + Math.random() * 0.5;
        const z = -2.5 + Math.random() * 1;
        createCoin(x, y, z);
    }
    
    // Fill bottom layer
    for (let i = 0; i < 40; i++) {
        const x = -3 + Math.random() * 6;
        const y = 0.8 + Math.random() * 0.5;
        const z = -1 + Math.random() * 2;
        createCoin(x, y, z);
    }
}

function createCoin(x, y, z, color = null) {
    if (!color) {
        const colors = [0xffd700, 0xffa500, 0xffed4e, 0xffb700];
        color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Three.js mesh
    const geometry = new THREE.CylinderGeometry(
        config.physics.coinRadius, 
        config.physics.coinRadius, 
        config.physics.coinHeight, 
        16
    );
    const material = new THREE.MeshStandardMaterial({ 
        color: color,
        metalness: 0.9,
        roughness: 0.1,
        emissive: color,
        emissiveIntensity: 0.1
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    
    // Cannon.js body
    const shape = new CANNON.Cylinder(
        config.physics.coinRadius,
        config.physics.coinRadius,
        config.physics.coinHeight,
        16
    );
    const body = new CANNON.Body({
        mass: config.physics.coinMass,
        shape: shape,
        material: new CANNON.Material({
            friction: config.physics.friction,
            restitution: config.physics.restitution
        })
    });
    body.position.set(x, y, z);
    body.sleepSpeedLimit = 0.5;
    body.sleepTimeLimit = 0.5;
    world.addBody(body);
    
    coins.push({ mesh, body, scored: false });
    
    return { mesh, body };
}

function updatePushers() {
    // Update top pusher
    pusherTop.distance += pusherTop.speed * pusherTop.direction;
    if (Math.abs(pusherTop.distance) >= pusherTop.maxDistance) {
        pusherTop.direction *= -1;
    }
    const topNewZ = -2 + pusherTop.distance;
    pusherTop.mesh.position.z = topNewZ;
    pusherTop.body.position.z = topNewZ;
    
    // Update bottom pusher
    pusherBottom.distance += pusherBottom.speed * pusherBottom.direction;
    if (Math.abs(pusherBottom.distance) >= pusherBottom.maxDistance) {
        pusherBottom.direction *= -1;
    }
    const bottomNewZ = 0 + pusherBottom.distance;
    pusherBottom.mesh.position.z = bottomNewZ;
    pusherBottom.body.position.z = bottomNewZ;
}

function updateCoins() {
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        
        // Sync mesh with physics body
        coin.mesh.position.copy(coin.body.position);
        coin.mesh.quaternion.copy(coin.body.quaternion);
        
        // Check if coin fell off (scored)
        if (!coin.scored && coin.body.position.z > 2.5) {
            coin.scored = true;
            score++;
            updateScore();
            
            // Remove coin after delay
            setTimeout(() => {
                scene.remove(coin.mesh);
                world.removeBody(coin.body);
                coins.splice(coins.indexOf(coin), 1);
            }, 500);
        }
        
        // Remove coins that fall too far
        if (coin.body.position.y < -5 || coin.body.position.z > 5) {
            scene.remove(coin.mesh);
            world.removeBody(coin.body);
            coins.splice(i, 1);
        }
    }
}

function handleCoinDrop() {
    if (isSpinning) return;
    
    // Drop coin at back of top pusher with random offset
    const randomOffset = (Math.random() - 0.5) * 3;
    const x = randomOffset;
    const y = 2.5;
    const z = -2.5;
    
    createCoin(x, y, z, 0xffed4e);
    
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
    
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];
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
                if (isWin && Math.random() < 0.85) {
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
            
            // Check win after last reel
            if (index === 2) {
                setTimeout(() => checkWin(results), 300);
            }
        }, 800 + index * 400);
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
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            const x = -1.5 + Math.random() * 3;
            const y = 3 + Math.random() * 0.5;
            const z = -2.5 + Math.random() * 0.3;
            createCoin(x, y, z, 0xffed4e);
        }, i * 50);
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
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
}

function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Update physics (60 FPS)
    world.step(1 / 60);
    
    // Update game objects
    updatePushers();
    updateCoins();
    
    // Render
    renderer.render(scene, camera);
}

// Start game when libraries are loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    // DOMContentLoaded already fired
    initGame();
}

// Prevent zoom on mobile
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('touchmove', (e) => {
    if (e.scale !== 1) e.preventDefault();
}, { passive: false });
/* ==========================================
   TAP EMPIRE
   MAIN ENGINE
========================================== */

"use strict";

const Game = {

version: "1.0.0",

fps: 60,

running: false,

lastFrame: 0,

delta: 0,

canvas: null,

ctx: null,

mouse: {
x:0,
y:0,
down:false
},

keys:{},

settings:{
music:true,
sound:true,
particles:true,
shadows:true
},

player:null,

world:null,

enemies:[],

particles:[],

projectiles:[],

loot:[],

quests:[],

inventory:[],

gold:0,

gems:0,

xp:0,

level:1,

initialized:false

};

/* ==========================================
INITIALIZE
========================================== */

function initGame(){

console.log("Starting Tap Empire...");

Game.canvas=document.getElementById("gameCanvas");

if(Game.canvas){

Game.ctx=Game.canvas.getContext("2d");

resizeCanvas();

window.addEventListener("resize",resizeCanvas);

}

setupInput();

createPlayer();

generateWorld();

spawnEnemies();

loadGame();

Game.running=true;

Game.initialized=true;

requestAnimationFrame(gameLoop);

}

/* ==========================================
CANVAS
========================================== */

function resizeCanvas(){

if(!Game.canvas) return;

Game.canvas.width=window.innerWidth;

Game.canvas.height=window.innerHeight;

}

/* ==========================================
PLAYER
========================================== */

function createPlayer(){

Game.player={

x:0,

y:0,

speed:6,

health:100,

maxHealth:100,

mana:100,

maxMana:100,

energy:100,

coins:0,

attack:10,

defense:5,

crit:0.10,

inventory:[],

level:1,

xp:0

};

}

/* ==========================================
WORLD
========================================== */

function generateWorld(){

Game.world={

width:6000,

height:6000,

time:0,

day:true,

weather:"clear"

};

}

/* ==========================================
ENEMIES
========================================== */

function spawnEnemies(){

Game.enemies=[];

for(let i=0;i<40;i++){

Game.enemies.push({

x:Math.random()*Game.world.width,

y:Math.random()*Game.world.height,

health:50,

maxHealth:50,

speed:2,

alive:true

});

}

}

/* ==========================================
INPUT
========================================== */

function setupInput(){

window.addEventListener("keydown",(e)=>{

Game.keys[e.key]=true;

});

window.addEventListener("keyup",(e)=>{

Game.keys[e.key]=false;

});

window.addEventListener("mousemove",(e)=>{

Game.mouse.x=e.clientX;

Game.mouse.y=e.clientY;

});

window.addEventListener("mousedown",()=>{

Game.mouse.down=true;

});

window.addEventListener("mouseup",()=>{

Game.mouse.down=false;

});

}

/* ==========================================
GAME LOOP
========================================== */

function gameLoop(timestamp){

if(!Game.running) return;

Game.delta=(timestamp-Game.lastFrame)/1000;

Game.lastFrame=timestamp;

update();

render();

requestAnimationFrame(gameLoop);

}

/* ==========================================
   UPDATE LOOP
========================================== */

function update(){

updatePlayer();

updateEnemies();

updateProjectiles();

updateParticles();

updateLoot();

updateCamera();

updateWorld();

checkCollisions();

}

/* ==========================================
PLAYER MOVEMENT
========================================== */

function updatePlayer(){

const p = Game.player;

if(Game.keys["w"] || Game.keys["ArrowUp"]) p.y -= p.speed;
if(Game.keys["s"] || Game.keys["ArrowDown"]) p.y += p.speed;
if(Game.keys["a"] || Game.keys["ArrowLeft"]) p.x -= p.speed;
if(Game.keys["d"] || Game.keys["ArrowRight"]) p.x += p.speed;

p.x = Math.max(0, Math.min(Game.world.width, p.x));
p.y = Math.max(0, Math.min(Game.world.height, p.y));

}

/* ==========================================
CAMERA
========================================== */

Game.camera={

x:0,

y:0,

zoom:1

};

function updateCamera(){

Game.camera.x=Game.player.x-Game.canvas.width/2;

Game.camera.y=Game.player.y-Game.canvas.height/2;

}

/* ==========================================
WORLD UPDATE
========================================== */

function updateWorld(){

Game.world.time+=Game.delta;

if(Game.world.time>300){

Game.world.time=0;

Game.world.day=!Game.world.day;

}

}

/* ==========================================
ENEMY AI
========================================== */

function updateEnemies(){

Game.enemies.forEach(enemy=>{

if(!enemy.alive) return;

let dx=Game.player.x-enemy.x;

let dy=Game.player.y-enemy.y;

let dist=Math.hypot(dx,dy);

if(dist<500){

enemy.x+=dx/dist*enemy.speed;

enemy.y+=dy/dist*enemy.speed;

}

if(dist<40){

damagePlayer(0.25);

}

});

}

/* ==========================================
PLAYER DAMAGE
========================================== */

function damagePlayer(amount){

Game.player.health-=amount;

if(Game.player.health<0){

Game.player.health=0;

gameOver();

}

}

/* ==========================================
HEAL PLAYER
========================================== */

function healPlayer(amount){

Game.player.health=Math.min(

Game.player.maxHealth,

Game.player.health+amount

);

}

/* ==========================================
GAME OVER
========================================== */

function gameOver(){

Game.running=false;

alert("Game Over!");

}

/* ==========================================
ATTACK
========================================== */

function attack(){

Game.enemies.forEach(enemy=>{

if(!enemy.alive) return;

let dist=Math.hypot(

enemy.x-Game.player.x,

enemy.y-Game.player.y

);

if(dist<120){

enemy.health-=Game.player.attack;

if(enemy.health<=0){

killEnemy(enemy);

}

}

});

}

/* ==========================================
KILL ENEMY
========================================== */

function killEnemy(enemy){

enemy.alive=false;

Game.gold+=10;

Game.xp+=5;

spawnLoot(enemy.x,enemy.y);

checkLevelUp();

}

window.addEventListener("click",attack);

/* ==========================================
RENDER ENGINE
========================================== */

function render(){

const ctx = Game.ctx;

ctx.clearRect(0,0,Game.canvas.width,Game.canvas.height);

drawWorld();

drawLoot();

drawEnemies();

drawPlayer();

drawProjectiles();

drawParticles();

drawUI();

}

/* ==========================================
WORLD
========================================== */

function drawWorld(){

const ctx = Game.ctx;

const cam = Game.camera;

ctx.save();

ctx.translate(-cam.x,-cam.y);

const tile = 64;

for(let x=0;x<Game.world.width;x+=tile){

    for(let y=0;y<Game.world.height;y+=tile){

        ctx.fillStyle=((x+y)/tile)%2===0
            ? "#3f9f4b"
            : "#47aa53";

        ctx.fillRect(x,y,tile,tile);

    }

}

ctx.restore();

}

/* ==========================================
PLAYER
========================================== */

function drawPlayer(){

const ctx = Game.ctx;

const cam = Game.camera;

const p = Game.player;

ctx.save();

ctx.translate(-cam.x,-cam.y);

ctx.fillStyle="#3da5ff";

ctx.beginPath();

ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);

ctx.fill();

ctx.restore();

}

/* ==========================================
ENEMIES
========================================== */

function drawEnemies(){

const ctx = Game.ctx;

const cam = Game.camera;

ctx.save();

ctx.translate(-cam.x,-cam.y);

Game.enemies.forEach(enemy=>{

if(!enemy.alive) return;

ctx.fillStyle="#cc3333";

ctx.beginPath();

ctx.arc(enemy.x,enemy.y,enemy.radius,0,Math.PI*2);

ctx.fill();

/* health bar */

ctx.fillStyle="#222";

ctx.fillRect(enemy.x-20,enemy.y-28,40,5);

ctx.fillStyle="#33dd55";

ctx.fillRect(

enemy.x-20,

enemy.y-28,

40*(enemy.health/enemy.maxHealth),

5

);

});

ctx.restore();

}

/* ==========================================
PROJECTILES
========================================== */

function drawProjectiles(){

const ctx=Game.ctx;

const cam=Game.camera;

ctx.save();

ctx.translate(-cam.x,-cam.y);

Game.projectiles.forEach(p=>{

ctx.fillStyle="#ffe45c";

ctx.beginPath();

ctx.arc(p.x,p.y,4,0,Math.PI*2);

ctx.fill();

});

ctx.restore();

}

/* ==========================================
PARTICLES
========================================== */

function drawParticles(){

const ctx=Game.ctx;

const cam=Game.camera;

ctx.save();

ctx.translate(-cam.x,-cam.y);

Game.particles.forEach(part=>{

ctx.globalAlpha=part.life/part.maxLife;

ctx.fillStyle=part.color;

ctx.fillRect(part.x,part.y,part.size,part.size);

});

ctx.globalAlpha=1;

ctx.restore();

}

/* ==========================================
LOOT
========================================== */

function drawLoot(){

const ctx=Game.ctx;

const cam=Game.camera;

ctx.save();

ctx.translate(-cam.x,-cam.y);

Game.loot.forEach(item=>{

ctx.fillStyle="#ffd700";

ctx.beginPath();

ctx.arc(item.x,item.y,8,0,Math.PI*2);

ctx.fill();

});

ctx.restore();

}

/* ==========================================
   Mouse Glow
========================================== */

const mouseGlow = document.createElement("div");
mouseGlow.className = "mouse-glow";
document.body.appendChild(mouseGlow);

document.addEventListener("mousemove", (e) => {
    mouseGlow.style.left = e.clientX + "px";
    mouseGlow.style.top = e.clientY + "px";
});

/* ==========================================
   Scroll Progress Bar
========================================== */

const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
    const scroll =
        document.documentElement.scrollTop;

    const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const percent = (scroll / height) * 100;

    progressBar.style.width = percent + "%";
});

/* ==========================================
   Animated Counters
========================================== */

const counters = document.querySelectorAll(".stat-number");

function animateCounter(counter) {

    const target = Number(counter.dataset.target);

    let current = 0;

    const speed = target / 120;

    const update = () => {

        current += speed;

        if (current >= target) {

            counter.innerText = target;

        } else {

            counter.innerText = Math.floor(current);

            requestAnimationFrame(update);

        }

    };

    update();

}

const counterObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            animateCounter(entry.target);

            counterObserver.unobserve(entry.target);

        }

    });

});

counters.forEach(counter => counterObserver.observe(counter));

/* ==========================================
   Floating Cards
========================================== */

const cards = document.querySelectorAll(".game-card");

cards.forEach(card => {

    card.addEventListener("mousemove", e => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;

        const y = e.clientY - rect.top;

        const rotateX = ((y / rect.height) - 0.5) * -12;

        const rotateY = ((x / rect.width) - 0.5) * 12;

        card.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             scale(1.04)`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform =
            "perspective(900px) rotateX(0) rotateY(0) scale(1)";

    });

});

/* ==========================================
   Search Games
========================================== */

const searchInput = document.querySelector("#gameSearch");

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const value = searchInput.value.toLowerCase();

        document.querySelectorAll(".game-card").forEach(card => {

            const title =
                card.querySelector("h3").textContent.toLowerCase();

            if (title.includes(value)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });

    });

}

/* ==========================================
   Filter Buttons
========================================== */

const filterButtons =
document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const category =
            button.dataset.filter;

        document.querySelectorAll(".game-card").forEach(card => {

            if (
                category === "all" ||
                card.dataset.category === category
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

});

/* ==========================================
   Save Favorites
========================================== */

const favoriteButtons =
document.querySelectorAll(".favorite-btn");

favoriteButtons.forEach(button => {

    const id = button.dataset.game;

    if(localStorage.getItem("fav_" + id)){
        button.classList.add("active");
    }

    button.addEventListener("click", () => {

        button.classList.toggle("active");

        if(button.classList.contains("active")){

            localStorage.setItem(
                "fav_" + id,
                "true"
            );

        }else{

            localStorage.removeItem(
                "fav_" + id
            );

        }

    });

});

/* ==========================================
   Achievement Popup
========================================== */

function unlockAchievement(title){

    const popup = document.createElement("div");

    popup.className = "achievement-popup";

    popup.innerHTML = `
        🏆 Achievement Unlocked<br>
        <strong>${title}</strong>
    `;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add("show");
    },100);

    setTimeout(() => {

        popup.classList.remove("show");

        setTimeout(() => popup.remove(),500);

    },4000);

}

/* ==========================================
   Welcome Achievement
========================================== */

if(!localStorage.getItem("visited")){

    localStorage.setItem("visited","true");

    window.addEventListener("load",()=>{

        setTimeout(()=>{

            unlockAchievement("Welcome to IWI Games");

        },1500);

    });

}

/* ==========================================
   Fullscreen Button
========================================== */

const fullscreenBtn = document.querySelector("#fullscreenBtn");

if (fullscreenBtn) {

    fullscreenBtn.addEventListener("click", () => {

        if (!document.fullscreenElement) {

            document.documentElement.requestFullscreen();

        } else {

            document.exitFullscreen();

        }

    });

}

/* ==========================================
   Keyboard Shortcuts
========================================== */

document.addEventListener("keydown", (e) => {

    // F = Fullscreen
    if (e.key.toLowerCase() === "f") {

        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }

    }

    // Escape closes menu
    if (e.key === "Escape") {

        mobileMenu.classList.remove("active");

    }

});

/* ==========================================
   FPS Counter
========================================== */

const fpsCounter = document.createElement("div");

fpsCounter.className = "fps-counter";

fpsCounter.innerHTML = "FPS: 0";

document.body.appendChild(fpsCounter);

let frames = 0;
let lastTime = performance.now();

function updateFPS(now){

    frames++;

    if(now >= lastTime + 1000){

        fpsCounter.innerHTML = "FPS: " + frames;

        frames = 0;

        lastTime = now;

    }

    requestAnimationFrame(updateFPS);

}

requestAnimationFrame(updateFPS);

/* ==========================================
   Loading Screen
========================================== */

window.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    if(loader){

        loader.classList.add("hide");

        setTimeout(()=>{

            loader.remove();

        },700);

    }

});

/********************************************
   Random Hero Background
********************************************/

const hero = document.querySelector(".hero");

const heroImages = [

    "assets/images/bg1.jpg",
    "assets/images/bg2.jpg",
    "assets/images/bg3.jpg",
    "assets/images/bg4.jpg"

];

if(hero){

    const random =
        heroImages[
            Math.floor(
                Math.random() * heroImages.length
            )
        ];

    hero.style.backgroundImage = `url(${random})`;

}

/* ======================================================
   ADVANCED FEATURES
====================================================== */

// ================= Notifications =================

function showNotification(title, message = "", time = 3000) {

    const notification = document.createElement("div");
    notification.className = "notification";

    notification.innerHTML = `
        <h4>${title}</h4>
        <p>${message}</p>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("show");
    }, 100);

    setTimeout(() => {

        notification.classList.remove("show");

        setTimeout(() => {

            notification.remove();

        }, 500);

    }, time);

}

// ================= Daily Reward =================

const today = new Date().toDateString();

if(localStorage.getItem("dailyReward") !== today){

    setTimeout(()=>{

        showNotification(
            "🎁 Daily Reward",
            "You received 100 Coins!"
        );

    },2500);

    localStorage.setItem("dailyReward",today);

}

// ================= Coins =================

let coins = Number(localStorage.getItem("coins")) || 100;

function saveCoins(){

    localStorage.setItem("coins",coins);

}

function addCoins(amount){

    coins += amount;

    saveCoins();

    updateCoins();

}

function updateCoins(){

    const coinUI=document.querySelector("#coinCount");

    if(coinUI){

        coinUI.innerText=coins;

    }

}

updateCoins();

// ================= Click Rewards =================

document.querySelectorAll(".play-btn").forEach(button=>{

    button.addEventListener("click",()=>{

        addCoins(10);

        showNotification(
            "+10 Coins",
            "Thanks for playing!"
        );

    });

});

// ================= Theme =================

const themeBtn=document.querySelector("#themeBtn");

if(themeBtn){

    if(localStorage.getItem("theme")==="light"){

        document.body.classList.add("light");

    }

    themeBtn.onclick=()=>{

        document.body.classList.toggle("light");

        if(document.body.classList.contains("light")){

            localStorage.setItem("theme","light");

        }else{

            localStorage.setItem("theme","dark");

        }

    }

}

// ================= Back To Top =================

const topButton=document.createElement("button");

topButton.className="top-button";

topButton.innerHTML="↑";

document.body.appendChild(topButton);

window.addEventListener("scroll",()=>{

    if(window.scrollY>500){

        topButton.classList.add("show");

    }else{

        topButton.classList.remove("show");

    }

});

topButton.onclick=()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};

// ================= Random Tips =================

const tips=[

"💡 Press F for Fullscreen",

"🎮 New games every week",

"🏆 Collect achievements",

"⭐ Favorite your best games",

"🔥 Challenge your friends",

"🚀 Explore hidden easter eggs",

"🎲 Try every game category"

];

function randomTip(){

    const tip=tips[Math.floor(Math.random()*tips.length)];

    showNotification("Gaming Tip",tip);

}

setInterval(randomTip,60000);

// ================= Welcome =================

window.addEventListener("load",()=>{

    setTimeout(()=>{

        showNotification(

            "Welcome",

            "Enjoy your stay on IWI Games!"

        );

    },1000);

});

// ================= Sound Effects =================

const hoverSound=new Audio("assets/sounds/hover.mp3");

const clickSound=new Audio("assets/sounds/click.mp3");

document.querySelectorAll("button").forEach(button=>{

    button.addEventListener("mouseenter",()=>{

        hoverSound.currentTime=0;

        hoverSound.volume=.25;

        hoverSound.play().catch(()=>{});

    });

    button.addEventListener("click",()=>{

        clickSound.currentTime=0;

        clickSound.volume=.3;

        clickSound.play().catch(()=>{});

    });

});

// ================= Konami Code =================

const secret=[];

const code=[
"ArrowUp",
"ArrowUp",
"ArrowDown",
"ArrowDown",
"ArrowLeft",
"ArrowRight",
"ArrowLeft",
"ArrowRight",
"b",
"a"
];

window.addEventListener("keydown",e=>{

    secret.push(e.key);

    secret.splice(-code.length-1,secret.length-code.length);

    if(secret.join("").toLowerCase()===code.join("").toLowerCase()){

        document.body.classList.add("rainbow");

        showNotification(

            "🎉 Secret Mode",

            "Rainbow mode activated!"

        );

    }

});

// ================= Auto Save =================

setInterval(()=>{

    localStorage.setItem("lastVisit",Date.now());

},5000);

// ================= Clock =================

const clock=document.querySelector("#clock");

if(clock){

    setInterval(()=>{

        const now=new Date();

        clock.innerHTML=now.toLocaleTimeString();

    },1000);

}

// ================= Page Visibility =================

document.addEventListener("visibilitychange",()=>{

    if(document.hidden){

        console.log("Paused");

    }else{

        console.log("Welcome Back");

    }

});

/* ======================================================
   PARTICLE ENGINE
====================================================== */

const particleCanvas = document.createElement("canvas");
particleCanvas.id = "particleCanvas";

Object.assign(particleCanvas.style,{
    position:"fixed",
    top:"0",
    left:"0",
    width:"100%",
    height:"100%",
    pointerEvents:"none",
    zIndex:"-1"
});

document.body.appendChild(particleCanvas);

const ctx = particleCanvas.getContext("2d");

function resizeParticles(){
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}

resizeParticles();
window.addEventListener("resize",resizeParticles);

const particles=[];

for(let i=0;i<120;i++){

    particles.push({

        x:Math.random()*particleCanvas.width,
        y:Math.random()*particleCanvas.height,
        r:Math.random()*3+1,
        dx:(Math.random()-.5)*0.6,
        dy:(Math.random()-.5)*0.6,
        alpha:Math.random()

    });

}

function drawParticles(){

    ctx.clearRect(0,0,particleCanvas.width,particleCanvas.height);

    particles.forEach(p=>{

        p.x+=p.dx;
        p.y+=p.dy;

        if(p.x<0||p.x>particleCanvas.width) p.dx*=-1;
        if(p.y<0||p.y>particleCanvas.height) p.dy*=-1;

        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(0,255,255,${p.alpha})`;
        ctx.fill();

    });

    for(let i=0;i<particles.length;i++){

        for(let j=i+1;j<particles.length;j++){

            const dx=particles[i].x-particles[j].x;
            const dy=particles[i].y-particles[j].y;
            const dist=Math.sqrt(dx*dx+dy*dy);

            if(dist<120){

                ctx.beginPath();
                ctx.moveTo(particles[i].x,particles[i].y);
                ctx.lineTo(particles[j].x,particles[j].y);
                ctx.strokeStyle=`rgba(0,255,255,${1-dist/120})`;
                ctx.lineWidth=.5;
                ctx.stroke();

            }

        }

    }

    requestAnimationFrame(drawParticles);

}

drawParticles();

/* ======================================================
   GAMEPAD SUPPORT
====================================================== */

let gamepadConnected=false;

window.addEventListener("gamepadconnected",e=>{

    gamepadConnected=true;

    showNotification(
        "🎮 Controller Connected",
        e.gamepad.id
    );

});

window.addEventListener("gamepaddisconnected",()=>{

    gamepadConnected=false;

    showNotification(
        "Controller Disconnected"
    );

});

function pollGamepad(){

    if(gamepadConnected){

        const gp=navigator.getGamepads()[0];

        if(gp){

            if(gp.buttons[0].pressed){

                console.log("A Button");

            }

        }

    }

    requestAnimationFrame(pollGamepad);

}

pollGamepad();

/* ======================================================
   MUSIC PLAYER
====================================================== */

const playlist=[
"assets/music/song1.mp3",
"assets/music/song2.mp3",
"assets/music/song3.mp3"
];

let currentSong=0;

const music=new Audio();

music.volume=.25;

function playSong(){

    music.src=playlist[currentSong];

    music.play().catch(()=>{});

}

music.addEventListener("ended",()=>{

    currentSong++;

    if(currentSong>=playlist.length){

        currentSong=0;

    }

    playSong();

});

const musicBtn=document.querySelector("#musicBtn");

if(musicBtn){

    musicBtn.onclick=()=>{

        if(music.paused){

            playSong();

            musicBtn.innerHTML="Pause Music";

        }else{

            music.pause();

            musicBtn.innerHTML="Play Music";

        }

    };

}

/* ======================================================
   FPS GRAPH
====================================================== */

const fpsHistory=[];

setInterval(()=>{

    const fps=parseInt(
        fpsCounter.innerText.replace("FPS: ","")
    );

    fpsHistory.push(fps);

    if(fpsHistory.length>60){

        fpsHistory.shift();

    }

},1000);

/* ======================================================
   RANDOM EVENTS
====================================================== */

const randomEvents=[

"Double Coins Activated!",
"New Game Released!",
"Secret Discount!",
"Bonus XP Event!",
"Weekend Tournament!",
"Mystery Box Spawned!"

];

setInterval(()=>{

    const event=randomEvents[
        Math.floor(
            Math.random()*randomEvents.length
        )
    ];

    showNotification(
        "🎉 Event",
        event
    );

},180000);

/* ======================================================
   EASTER EGG
====================================================== */

let clicks=0;

document.querySelector(".logo")?.addEventListener("click",()=>{

    clicks++;

    if(clicks===10){

        showNotification(
            "🥚 Easter Egg",
            "Developer Mode Enabled"
        );

        document.body.classList.add("developer");

        clicks=0;

    }

});

/* ======================================================
   PERFORMANCE TIMER
====================================================== */

window.addEventListener("load",()=>{

    const loadTime=
        performance.now().toFixed(0);

    console.log(
        "Loaded in "+loadTime+"ms"
    );

});

/* ======================================================
   AUTO GREETING
====================================================== */

const hour=new Date().getHours();

let greeting="Welcome";

if(hour<12){

    greeting="Good Morning ☀️";

}else if(hour<18){

    greeting="Good Afternoon 🌤️";

}else{

    greeting="Good Evening 🌙";

}

setTimeout(()=>{

    showNotification(greeting);

},800);

/* ======================================================
   XP & LEVEL SYSTEM
====================================================== */

let playerXP = Number(localStorage.getItem("playerXP")) || 0;
let playerLevel = Number(localStorage.getItem("playerLevel")) || 1;

function xpNeeded(level){
    return level * 100;
}

function updateLevelUI(){

    const xp=document.querySelector("#xpCount");
    const lvl=document.querySelector("#levelCount");

    if(xp) xp.textContent=playerXP;
    if(lvl) lvl.textContent=playerLevel;

}

function addXP(amount){

    playerXP += amount;

    while(playerXP >= xpNeeded(playerLevel)){

        playerXP -= xpNeeded(playerLevel);

        playerLevel++;

        showNotification(
            "⭐ Level Up!",
            "You reached Level " + playerLevel
        );

    }

    localStorage.setItem("playerXP",playerXP);
    localStorage.setItem("playerLevel",playerLevel);

    updateLevelUI();

}

updateLevelUI();

/* ======================================================
   DAILY QUESTS
====================================================== */

const quests=[

{
title:"Play 3 Games",
reward:100
},

{
title:"Earn 200 Coins",
reward:150
},

{
title:"Visit Today",
reward:50
}

];

function loadQuest(){

    const questBox=document.querySelector("#dailyQuest");

    if(!questBox) return;

    const quest=quests[
        Math.floor(Math.random()*quests.length)
    ];

    questBox.innerHTML=`
        <h3>${quest.title}</h3>
        <p>Reward: ${quest.reward} Coins</p>
    `;

}

loadQuest();

/* ======================================================
   SERVER STATUS
====================================================== */

const serverStatus=document.querySelector("#serverStatus");

if(serverStatus){

    const states=[
        "🟢 Online",
        "🟢 Stable",
        "🟡 Busy",
        "🟢 Fast"
    ];

    setInterval(()=>{

        serverStatus.textContent=
            states[
                Math.floor(
                    Math.random()*states.length
                )
            ];

    },10000);

}

/* ======================================================
   LANGUAGE SWITCHER
====================================================== */

const languages={

en:{
play:"Play",
games:"Games",
news:"News"
},

de:{
play:"Spielen",
games:"Spiele",
news:"Neuigkeiten"
}

};

const languageButton=document.querySelector("#languageBtn");

if(languageButton){

    languageButton.onclick=()=>{

        const current=
        localStorage.getItem("language") || "en";

        const next=current==="en" ? "de":"en";

        localStorage.setItem("language",next);

        showNotification(
            "Language",
            next.toUpperCase()
        );

    };

}

/* ======================================================
   CLOUD SAVE (SIMULATION)
====================================================== */

function cloudSave(){

    const data={

        coins,
        playerXP,
        playerLevel,
        favorites:Object.keys(localStorage)

    };

    console.log("Cloud Save",data);

}

setInterval(cloudSave,60000);

/* ======================================================
   GAME TIMER
====================================================== */

let sessionSeconds=0;

setInterval(()=>{

    sessionSeconds++;

    const timer=document.querySelector("#sessionTimer");

    if(timer){

        const h=Math.floor(sessionSeconds/3600);

        const m=Math.floor(sessionSeconds%3600/60);

        const s=sessionSeconds%60;

        timer.textContent=
        `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

    }

},1000);

/* ======================================================
   LIVE USERS
====================================================== */

const online=document.querySelector("#onlineUsers");

if(online){

    let users=1000+Math.floor(Math.random()*5000);

    online.textContent=users;

    setInterval(()=>{

        users+=Math.floor(Math.random()*20)-10;

        if(users<1000) users=1000;

        online.textContent=users;

    },3000);

}

/* ======================================================
   RANDOM GAME RECOMMENDER
====================================================== */

function recommendGame(){

    const cards=document.querySelectorAll(".game-card");

    if(cards.length===0) return;

    const card=cards[
        Math.floor(Math.random()*cards.length)
    ];

    card.classList.add("recommended");

    setTimeout(()=>{

        card.classList.remove("recommended");

    },6000);

}

setInterval(recommendGame,45000);

/* ======================================================
   AUTO HIGHLIGHT NAVIGATION
====================================================== */

const sections=document.querySelectorAll("section");
const navLinks=document.querySelectorAll("nav a");

window.addEventListener("scroll",()=>{

    let current="";

    sections.forEach(section=>{

        const top=section.offsetTop-120;

        if(scrollY>=top){

            current=section.id;

        }

    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

        if(
            link.getAttribute("href")==="#"+current
        ){

            link.classList.add("active");

        }

    });

});

/* ======================================================
   END OF MODULE
====================================================== */

console.log("Advanced Module Loaded");

/* ======================================================
   ADVANCED UI MODULE
====================================================== */

// ================= Cursor Trail =================

const cursorTrail = [];

document.addEventListener("mousemove", e => {

    cursorTrail.push({
        x: e.clientX,
        y: e.clientY,
        life: 100
    });

});

function updateCursorTrail(){

    cursorTrail.forEach((dot,index)=>{

        dot.life--;

        if(dot.life<=0){

            dot.element?.remove();

            cursorTrail.splice(index,1);

            return;

        }

        if(!dot.element){

            dot.element=document.createElement("div");

            dot.element.className="cursor-trail";

            document.body.appendChild(dot.element);

        }

        dot.element.style.left=dot.x+"px";
        dot.element.style.top=dot.y+"px";
        dot.element.style.opacity=dot.life/100;

    });

    requestAnimationFrame(updateCursorTrail);

}

updateCursorTrail();


// ================= Fake Live Chat =================

const chatMessages=[

    "Alex: Anyone beat Level 10?",
    "Mia: This game is amazing 🔥",
    "Luca: New update looks sick!",
    "Player99: GG everyone!",
    "Emma: My new highscore is 9540!",
    "Ghost: Hidden easter egg found 👀",
    "Jay: Multiplayer when?",
    "Nico: Love this website!"

];

function addChatMessage(){

    const chat=document.querySelector("#liveChat");

    if(!chat) return;

    const div=document.createElement("div");

    div.className="chat-message";

    div.textContent=
        chatMessages[
            Math.floor(Math.random()*chatMessages.length)
        ];

    chat.prepend(div);

    if(chat.children.length>8){

        chat.removeChild(chat.lastChild);

    }

}

setInterval(addChatMessage,6000);


// ================= Background Video =================

const bgVideo=document.querySelector("#backgroundVideo");

if(bgVideo){

    bgVideo.play().catch(()=>{});

    document.addEventListener("visibilitychange",()=>{

        if(document.hidden){

            bgVideo.pause();

        }else{

            bgVideo.play().catch(()=>{});

        }

    });

}


// ================= Loot Box =================

function openLootBox(){

    const rewards=[

        "50 Coins",
        "100 Coins",
        "Rare Badge",
        "Epic Avatar",
        "XP Boost",
        "Mystery Skin",
        "Legendary Frame"

    ];

    const reward=
        rewards[
            Math.floor(Math.random()*rewards.length)
        ];

    showNotification(
        "🎁 Loot Box",
        reward
    );

}

document.querySelector("#lootBoxBtn")?.addEventListener("click",()=>{

    openLootBox();

});


// ================= AI Recommendation =================

function recommendBestGame(){

    const cards=[
        ...document.querySelectorAll(".game-card")
    ];

    if(cards.length===0) return;

    cards.forEach(card=>{

        card.classList.remove("best-game");

    });

    const random=
        cards[
            Math.floor(Math.random()*cards.length)
        ];

    random.classList.add("best-game");

}

setInterval(recommendBestGame,30000);

recommendBestGame();


// ================= Screen Shake =================

function screenShake(){

    document.body.classList.add("shake");

    setTimeout(()=>{

        document.body.classList.remove("shake");

    },500);

}


// ================= Rare Random Event =================

setInterval(()=>{

    if(Math.random()<0.05){

        screenShake();

        showNotification(

            "⚠ Rare Event",

            "Meteor Shower Activated!"

        );

    }

},60000);


// ================= News Slider =================

const news=[

"🚀 New Games every Friday",

"🏆 Tournament this weekend",

"🎁 Daily rewards available",

"⭐ Premium mode coming soon",

"🔥 New Arcade section added"

];

let newsIndex=0;

const newsBox=document.querySelector("#newsTicker");

if(newsBox){

    setInterval(()=>{

        newsBox.textContent=news[newsIndex];

        newsIndex++;

        if(newsIndex>=news.length){

            newsIndex=0;

        }

    },4000);

}


// ================= Animated Title =================

const titles=[

"IWI Games",

"IWI Arcade",

"IWI Universe",

"IWI Gaming Hub"

];

let titleIndex=0;

setInterval(()=>{

    document.title=titles[titleIndex];

    titleIndex++;

    if(titleIndex>=titles.length){

        titleIndex=0;

    }

},5000);


// ================= Mouse Click Effect =================

document.addEventListener("click",e=>{

    const ring=document.createElement("div");

    ring.className="click-ring";

    ring.style.left=e.clientX+"px";

    ring.style.top=e.clientY+"px";

    document.body.appendChild(ring);

    setTimeout(()=>{

        ring.remove();

    },900);

});


// ================= Auto Refresh Game Cards =================

setInterval(()=>{

    document.querySelectorAll(".game-card").forEach(card=>{

        card.classList.add("pulse");

        setTimeout(()=>{

            card.classList.remove("pulse");

        },1200);

    });

},45000);


// ================= Developer Console =================

console.log("%cIWI Games","font-size:32px;color:cyan;font-weight:bold;");
console.log("%cPowered by JavaScript","color:white;");
console.log("%cDeveloper Mode Ready","color:lime;");


// ================= End Module =================

console.log("UI Module Loaded Successfully");

/* ======================================================
   PLAYER PROFILE SYSTEM
====================================================== */

const player = {

    username: localStorage.getItem("username") || "Guest",

    avatar: localStorage.getItem("avatar") || "assets/images/avatar.png",

    level: Number(localStorage.getItem("playerLevel")) || 1,

    coins: Number(localStorage.getItem("coins")) || 0

};

function updateProfile(){

    document.querySelectorAll(".username").forEach(el=>{
        el.textContent=player.username;
    });

    document.querySelectorAll(".avatar").forEach(el=>{
        el.src=player.avatar;
    });

    document.querySelectorAll(".level").forEach(el=>{
        el.textContent=player.level;
    });

    document.querySelectorAll(".coins").forEach(el=>{
        el.textContent=player.coins;
    });

}

updateProfile();

/* ======================================================
   SHOP SYSTEM
====================================================== */

const shopItems=[

{
id:1,
name:"Blue Theme",
price:100
},

{
id:2,
name:"Golden Cursor",
price:300
},

{
id:3,
name:"Galaxy Background",
price:500
},

{
id:4,
name:"Premium Badge",
price:800
}

];

function buyItem(item){

    if(player.coins<item.price){

        showNotification(
            "Not enough coins!"
        );

        return;

    }

    player.coins-=item.price;

    localStorage.setItem("coins",player.coins);

    localStorage.setItem(
        "shop_"+item.id,
        "owned"
    );

    updateProfile();

    showNotification(
        "Purchased",
        item.name
    );

}

document.querySelectorAll("[data-shop]").forEach(button=>{

    button.addEventListener("click",()=>{

        const id=Number(button.dataset.shop);

        const item=shopItems.find(i=>i.id===id);

        if(item){

            buyItem(item);

        }

    });

});

/* ======================================================
   ACHIEVEMENT SYSTEM
====================================================== */

const achievements=[

{
id:"first_visit",
title:"Welcome!"
},

{
id:"level10",
title:"Reach Level 10"
},

{
id:"rich",
title:"Collect 1000 Coins"
},

{
id:"collector",
title:"Own 5 Shop Items"
}

];

function unlock(id){

    if(localStorage.getItem("achievement_"+id))
        return;

    localStorage.setItem(
        "achievement_"+id,
        "true"
    );

    const achievement=
        achievements.find(a=>a.id===id);

    if(achievement){

        showNotification(
            "🏆 Achievement",
            achievement.title
        );

    }

}

/* ======================================================
   PROFILE SAVE
====================================================== */

function saveProfile(){

    localStorage.setItem(
        "username",
        player.username
    );

    localStorage.setItem(
        "avatar",
        player.avatar
    );

    localStorage.setItem(
        "coins",
        player.coins
    );

}

setInterval(saveProfile,10000);

/* ======================================================
   GAME HISTORY
====================================================== */

function playedGame(name){

    let history=
        JSON.parse(
            localStorage.getItem("history")||"[]"
        );

    history.unshift({

        game:name,

        time:new Date().toLocaleString()

    });

    history=history.slice(0,20);

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

}

document.querySelectorAll(".play-btn").forEach(btn=>{

    btn.addEventListener("click",()=>{

        playedGame(btn.dataset.game);

        addXP(25);

    });

});

/* ======================================================
   PROFILE STATS
====================================================== */

function updateStats(){

    const totalGames=
        JSON.parse(
            localStorage.getItem("history")||"[]"
        ).length;

    document.querySelector("#gamesPlayed")?.textContent=
        totalGames;

    document.querySelector("#coinDisplay")?.textContent=
        player.coins;

    document.querySelector("#levelDisplay")?.textContent=
        player.level;

}

setInterval(updateStats,1000);

/* ======================================================
   SETTINGS
====================================================== */

const settings={

    music:true,

    sounds:true,

    particles:true,

    animations:true

};

const saved=
JSON.parse(
    localStorage.getItem("settings")||"{}"
);

Object.assign(settings,saved);

function saveSettings(){

    localStorage.setItem(
        "settings",
        JSON.stringify(settings)
    );

}

/* ======================================================
   AUTO SAVE
====================================================== */

setInterval(()=>{

    saveProfile();

    saveSettings();

},30000);

/* ======================================================
   PLAYER RANK
====================================================== */

function getRank(level){

    if(level<5) return "Beginner";

    if(level<10) return "Player";

    if(level<20) return "Pro";

    if(level<40) return "Elite";

    return "Legend";

}

document.querySelectorAll(".rank").forEach(el=>{

    el.textContent=
        getRank(player.level);

});

/* ======================================================
   GAME TIMER BONUS
====================================================== */

let minutesPlayed=0;

setInterval(()=>{

    minutesPlayed++;

    if(minutesPlayed%10===0){

        player.coins+=50;

        updateProfile();

        showNotification(

            "⏰ Play Bonus",

            "+50 Coins"

        );

    }

},600000);

/* ======================================================
   MODULE COMPLETE
====================================================== */

console.log("Player System Loaded");

/* ======================================================
   GAME LIBRARY + LAUNCHER
====================================================== */

const gameLibrary = [
    {
        id: 1,
        title: "Cube Runner",
        installed: true,
        favorite: false,
        hours: 0
    },
    {
        id: 2,
        title: "Space Shooter",
        installed: true,
        favorite: false,
        hours: 0
    },
    {
        id: 3,
        title: "Zombie Escape",
        installed: false,
        favorite: false,
        hours: 0
    },
    {
        id: 4,
        title: "Sky Racer",
        installed: false,
        favorite: false,
        hours: 0
    },
    {
        id: 5,
        title: "Dungeon Quest",
        installed: false,
        favorite: false,
        hours: 0
    }
];

function saveLibrary(){
    localStorage.setItem(
        "gameLibrary",
        JSON.stringify(gameLibrary)
    );
}

function loadLibrary(){

    const save =
        JSON.parse(localStorage.getItem("gameLibrary"));

    if(save){

        save.forEach((game,index)=>{

            if(gameLibrary[index]){

                Object.assign(gameLibrary[index],game);

            }

        });

    }

}

loadLibrary();

/* ======================================================
   DOWNLOAD SIMULATOR
====================================================== */

function downloadGame(id){

    const game=gameLibrary.find(g=>g.id===id);

    if(!game) return;

    let progress=0;

    showNotification(
        "Downloading",
        game.title
    );

    const interval=setInterval(()=>{

        progress+=5;

        console.log(
            game.title,
            progress+"%"
        );

        if(progress>=100){

            clearInterval(interval);

            game.installed=true;

            saveLibrary();

            showNotification(
                "Installed",
                game.title
            );

        }

    },200);

}

/* ======================================================
   GAME LAUNCHER
====================================================== */

function launchGame(id){

    const game=gameLibrary.find(g=>g.id===id);

    if(!game) return;

    if(!game.installed){

        showNotification(
            "Game not installed."
        );

        return;

    }

    game.hours+=0.1;

    saveLibrary();

    showNotification(
        "Launching",
        game.title
    );

    console.log(
        "Launching:",
        game.title
    );

}

document.querySelectorAll("[data-launch]").forEach(button=>{

    button.onclick=()=>{

        launchGame(
            Number(button.dataset.launch)
        );

    };

});

/* ======================================================
   FAVORITES
====================================================== */

function toggleFavorite(id){

    const game=gameLibrary.find(g=>g.id===id);

    if(!game) return;

    game.favorite=!game.favorite;

    saveLibrary();

    showNotification(

        game.favorite
            ? "Added to Favorites"
            : "Removed from Favorites"

    );

}

/* ======================================================
   FRIENDS LIST
====================================================== */

const friends=[

{
name:"Alex",
status:"Online"
},

{
name:"Emma",
status:"Playing"
},

{
name:"Lucas",
status:"Offline"
},

{
name:"Noah",
status:"Away"
}

];

function refreshFriends(){

    const list=document.querySelector("#friendsList");

    if(!list) return;

    list.innerHTML="";

    friends.forEach(friend=>{

        const div=document.createElement("div");

        div.className="friend";

        div.innerHTML=`
            <strong>${friend.name}</strong>
            <span>${friend.status}</span>
        `;

        list.appendChild(div);

    });

}

refreshFriends();

/* ======================================================
   RANDOM STATUS
====================================================== */

const statuses=[

"Online",

"Away",

"Playing",

"Offline"

];

setInterval(()=>{

    friends.forEach(friend=>{

        friend.status=
            statuses[
                Math.floor(
                    Math.random()*statuses.length
                )
            ];

    });

    refreshFriends();

},15000);

/* ======================================================
   NOTIFICATION CENTER
====================================================== */

const notifications=[];

function pushNotification(title,text){

    notifications.unshift({

        title,

        text,

        date:new Date().toLocaleTimeString()

    });

    notifications.splice(20);

}

const oldShow=showNotification;

showNotification=function(title,text){

    pushNotification(title,text);

    oldShow(title,text);

};

/* ======================================================
   PLAYTIME
====================================================== */

setInterval(()=>{

    gameLibrary.forEach(game=>{

        if(game.installed){

            game.hours+=0.001;

        }

    });

    saveLibrary();

},60000);

/* ======================================================
   GAME SEARCH API
====================================================== */

function searchGames(query){

    return gameLibrary.filter(game=>

        game.title
        .toLowerCase()
        .includes(query.toLowerCase())

    );

}

/* ======================================================
   AUTO UPDATE CHECK
====================================================== */

setInterval(()=>{

    if(Math.random()<0.25){

        showNotification(

            "Game Update",

            "New patches available."

        );

    }

},120000);

/* ======================================================
   STORAGE INFO
====================================================== */

function storageSize(){

    let total=0;

    for(let key in localStorage){

        if(localStorage.hasOwnProperty(key)){

            total+=localStorage[key].length;

        }

    }

    console.log(
        "Local Storage:",
        (total/1024).toFixed(2),
        "KB"
    );

}

storageSize();

console.log("Launcher Module Loaded");

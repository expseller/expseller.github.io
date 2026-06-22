// ----------------------
// Tap Empire
// Main Script
// ----------------------

let money = 0;
let moneyPerTap = 1;
let moneyPerSecond = 0;

const loading = document.getElementById("loading");
const menu = document.getElementById("menu");
const game = document.getElementById("game");

const moneyText = document.getElementById("money");
const tapButton = document.getElementById("tapButton");

const playBtn = document.getElementById("playBtn");
const continueBtn = document.getElementById("continueBtn");

// ----------------------
// Loading
// ----------------------

window.onload = () => {

    setTimeout(() => {

        loading.classList.add("hidden");
        menu.classList.remove("hidden");

    }, 1500);

};

// ----------------------
// New Game
// ----------------------

playBtn.addEventListener("click", () => {

    menu.classList.add("hidden");
    game.classList.remove("hidden");

});

// ----------------------
// Continue
// ----------------------

continueBtn.addEventListener("click", () => {

    loadGame();

    menu.classList.add("hidden");
    game.classList.remove("hidden");

});

// ----------------------
// Tap
// ----------------------

tapButton.addEventListener("click", () => {

    money += moneyPerTap;

    updateMoney();

});

// ----------------------
// Money Display
// ----------------------

function updateMoney(){

    moneyText.textContent =
    "$" + money.toLocaleString();

}

// ----------------------
// Passive Income
// ----------------------

setInterval(() => {

    money += moneyPerSecond;

    updateMoney();

},1000);

// ----------------------
// Save
// ----------------------

function saveGame(){

    localStorage.setItem("tapEmpire",JSON.stringify({

        money,
        moneyPerTap,
        moneyPerSecond

    }));

}

// ----------------------
// Load
// ----------------------

function loadGame(){

    const save =
    JSON.parse(localStorage.getItem("tapEmpire"));

    if(!save) return;

    money = save.money;
    moneyPerTap = save.moneyPerTap;
    moneyPerSecond = save.moneyPerSecond;

    updateMoney();

}

// ----------------------
// Auto Save
// ----------------------

setInterval(saveGame,5000);

updateMoney();

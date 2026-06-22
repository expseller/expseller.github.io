// =====================================
// EFFECTS
// =====================================

const game = document.getElementById("game");
const clickButton = document.getElementById("tapButton");

// Geldtext erzeugen
function spawnMoneyText(x, y, amount) {

    const text = document.createElement("div");

    text.className = "moneyText";
    text.innerText = "+" + amount;

    text.style.left = x + "px";
    text.style.top = y + "px";

    document.body.appendChild(text);

    setTimeout(() => {
        text.remove();
    }, 1000);

}

// Partikel erzeugen
function spawnParticles(x, y) {

    for (let i = 0; i < 12; i++) {

        const p = document.createElement("div");

        p.className = "particle";

        p.style.left = x + "px";
        p.style.top = y + "px";

        p.style.setProperty("--x", (Math.random() * 200 - 100) + "px");
        p.style.setProperty("--y", (Math.random() * 200 - 100) + "px");

        document.body.appendChild(p);

        setTimeout(() => p.remove(), 700);

    }

}

// Bildschirm wackeln
function screenShake() {

    game.classList.add("shake");

    setTimeout(() => {

        game.classList.remove("shake");

    }, 250);

}

// Alles zusammen
clickButton.addEventListener("click", e => {

    spawnMoneyText(e.clientX, e.clientY, clickPower);

    spawnParticles(e.clientX, e.clientY);

    screenShake();

});
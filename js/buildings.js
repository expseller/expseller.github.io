// =====================================
// BUILDINGS SYSTEM
// =====================================

const city = document.getElementById("city");

const buildingTypes = [
    "house",
    "shop",
    "tower",
    "factory"
];

function spawnBuilding(type) {

    const b = document.createElement("div");

    b.className = "building " + type;

    b.style.left = Math.random() * 95 + "%";

    b.style.animationDelay = (Math.random() * 2) + "s";

    city.appendChild(b);

}

function updateCity() {

    if (!city) return;

    city.innerHTML = "";

    let total = 0;

    upgrades.forEach(u => total += u.owned);

    for (let i = 0; i < total; i++) {

        const type = buildingTypes[
            Math.floor(Math.random() * buildingTypes.length)
        ];

        spawnBuilding(type);

    }

}

setInterval(updateCity, 3000);
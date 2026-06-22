// =====================================
// TAP EMPIRE ECONOMY
// =====================================

const upgrades = [

{
    id:"cursor",
    name:"👆 Cursor",
    cost:25,
    income:1,
    owned:0
},

{
    id:"worker",
    name:"👷 Worker",
    cost:100,
    income:5,
    owned:0
},

{
    id:"shop",
    name:"🏪 Shop",
    cost:500,
    income:25,
    owned:0
},

{
    id:"factory",
    name:"🏭 Factory",
    cost:2500,
    income:125,
    owned:0
},

{
    id:"bank",
    name:"🏦 Bank",
    cost:10000,
    income:600,
    owned:0
},

{
    id:"city",
    name:"🏙️ City",
    cost:50000,
    income:3500,
    owned:0
},

{
    id:"country",
    name:"🌍 Country",
    cost:250000,
    income:18000,
    owned:0
},

{
    id:"planet",
    name:"🪐 Planet",
    cost:1000000,
    income:100000,
    owned:0
}

];

const shop=document.getElementById("shop");

// ================================
// BUILD SHOP
// ================================

function createShop(){

shop.innerHTML="";

upgrades.forEach((item,index)=>{

const div=document.createElement("div");

div.className="shopItem";

div.innerHTML=`

<h3>${item.name}</h3>

<p>Owned: ${item.owned}</p>

<p>+$${item.income}/sec</p>

<button onclick="buyUpgrade(${index})">

Buy ($${item.cost.toLocaleString()})

</button>

`;

shop.appendChild(div);

});

}

// ================================
// BUY
// ================================

function buyUpgrade(index){

const item=upgrades[index];

if(money<item.cost)return;

money-=item.cost;

item.owned++;

moneyPerSecond+=item.income;

item.cost=Math.floor(item.cost*1.18);

updateMoney();

createShop();

}

// ================================

createShop();

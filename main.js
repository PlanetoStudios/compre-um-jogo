// main.js
import { CATEGORIES, ITEMS, PETS, TRANSLATIONS } from './data.js';

// Game state
let state = {
  money: 0,
  income: 0,
  bought: 0,
  spent: 0,
  pets: [],
  items: {},
  lastTick: Date.now()
};

// Initialize items count
ITEMS.forEach(item => state.items[item.id] = 0);

// Utility functions
const $ = id => document.getElementById(id);

// Update UI
function updateUI() {
  $('money').textContent = state.money.toLocaleString();
  $('income').textContent = state.income.toLocaleString();
  $('bought').textContent = state.bought;
}

// Render shop
function renderShop() {
  const shopDiv = $('shop-items');
  shopDiv.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const catDiv = document.createElement('div');
    catDiv.innerHTML = `<h3>${cat.icon} ${cat.name}</h3>`;
    cat.items.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'item';
      itemDiv.innerHTML = `
        <span>${item.icon} ${item.name} (${item.cost.toLocaleString()})</span>
        <button id="buy-${item.id}">Comprar</button>
      `;
      catDiv.appendChild(itemDiv);

      $(`buy-${item.id}`).addEventListener('click', () => buyItem(item));
    });
    shopDiv.appendChild(catDiv);
  });
}

// Render pets
function renderPets() {
  const petDiv = $('pet-shop');
  petDiv.innerHTML = '';
  PETS.forEach(pet => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <span>${pet.icon} ${pet.name} (${pet.cost.toLocaleString()})</span>
      <button id="buy-pet-${pet.id}">Comprar</button>
    `;
    petDiv.appendChild(div);
    $(`buy-pet-${pet.id}`).addEventListener('click', () => buyPet(pet));
  });
}

// Buy item
function buyItem(item) {
  if(state.money >= item.cost) {
    state.money -= item.cost;
    state.income += item.income;
    state.items[item.id]++;
    state.bought++;
    state.spent += item.cost;
    updateUI();
  } else {
    alert('Dinheiro insuficiente!');
  }
}

// Buy pet
function buyPet(pet) {
  if(state.money >= pet.cost) {
    state.money -= pet.cost;
    state.pets.push(pet.id);
    state.income *= pet.mult; // Pet multiplier
    updateUI();
  } else {
    alert('Dinheiro insuficiente!');
  }
}

// Game loop
function tick() {
  const now = Date.now();
  const delta = (now - state.lastTick)/1000;
  state.lastTick = now;
  state.money += state.income * delta;
  updateUI();
}

setInterval(tick, 1000);

// Init
updateUI();
renderShop();
renderPets();

// PWA Service Worker registration
if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      console.log('SW registered', reg);
    }).catch(err => console.error('SW registration failed', err));
  });
}

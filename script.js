// DOM elements
const plantList = document.getElementById('plantList');
const addPlantButton = document.getElementById('addPlant');
const plantNameInput = document.getElementById('plantName');
const wateringIntervalInput = document.getElementById('wateringInterval');

// In-memory array to store plants
let plants = [];

// Function to add plant and display on the page
function addPlant(name, interval) {
    const plant = {
        id: Date.now(),
        name,
        interval,
        lastWatered: new Date().toISOString()
    };
    plants.push(plant);
    renderPlants();
}

// Function to render all plants
function renderPlants() {
    plantList.innerHTML = '';
    plants.sort((a, b) => getNextWateringDate(a) - getNextWateringDate(b));
    plants.forEach(plant => {
        const plantCard = createPlantCard(plant);
        plantList.appendChild(plantCard);
    });
}

// Function to create a plant card
function createPlantCard(plant) {
    const plantCard = document.createElement('div');
    plantCard.classList.add('plant-card');
    plantCard.dataset.id = plant.id;

    const nextWatering = getNextWateringDate(plant);
    const daysUntilWatering = Math.ceil((nextWatering - new Date()) / (1000 * 60 * 60 * 24));

    plantCard.innerHTML = `
        <h3>${plant.name}</h3>
        <p>Next watering: ${nextWatering.toDateString()}</p>
        <p class="days-until">${daysUntilWatering} day(s) until watering</p>
        <button class="water-button">Water Plant</button>
        <button class="delete-button">Delete Plant</button>
    `;

    const waterButton = plantCard.querySelector('.water-button');
    waterButton.addEventListener('click', () => waterPlant(plant.id));

    const deleteButton = plantCard.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => deletePlant(plant.id));

    return plantCard;
}

// Function to get the next watering date
function getNextWateringDate(plant) {
    const lastWatered = new Date(plant.lastWatered);
    return new Date(lastWatered.getTime() + plant.interval * 24 * 60 * 60 * 1000);
}

// Function to water a plant
function waterPlant(id) {
    const plant = plants.find(p => p.id === id);
    if (plant) {
        plant.lastWatered = new Date().toISOString();
        renderPlants();
    }
}

// Function to delete a plant
function deletePlant(id) {
    plants = plants.filter(p => p.id !== id);
    renderPlants();
}

// Event listener for adding a plant
addPlantButton.addEventListener('click', function() {
    const plantName = plantNameInput.value.trim();
    const wateringInterval = parseInt(wateringIntervalInput.value);

    if (plantName && wateringInterval > 0) {
        addPlant(plantName, wateringInterval);
        plantNameInput.value = '';
        wateringIntervalInput.value = '';
    } else {
        alert('Please enter both a plant name and a valid watering interval');
    }
});

// Set up periodic updates
setInterval(() => {
    renderPlants();
}, 60000); // Update every minute

// Responsive design: Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 600) {
        plantList.style.gridTemplateColumns = '1fr';
    } else {
        plantList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
    }
});

// Trigger initial responsive layout
window.dispatchEvent(new Event('resize'));






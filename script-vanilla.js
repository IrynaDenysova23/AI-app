// BoxyAI Vanilla JavaScript - Interactive Product Selection

// Product pairs for selection (8 products, 4 pairs)
const productPairs = [
    ['assets/product-1.jpg', 'assets/product-2.jpg'],
    ['assets/product-3.jpg', 'assets/product-4.jpg'],
    ['assets/product-5.jpg', 'assets/product-6.jpg'],
    ['assets/product-7.jpg', 'assets/product-8.jpg']
];

// State management
let currentStage = 'landing';
let currentPairIndex = 0;
let selectedProducts = [];
let finalProduct = '';

// DOM elements
const stages = {
    landing: document.getElementById('landing-stage'),
    selection: document.getElementById('selection-stage'),
    basket: document.getElementById('basket-stage'),
    downloading: document.getElementById('downloading-stage'),
    reveal: document.getElementById('reveal-stage')
};

const startBtn = document.getElementById('start-btn');
const generateBtn = document.getElementById('generate-btn');
const receiveBtn = document.getElementById('receive-btn');
const currentRoundText = document.getElementById('current-round');
const productCards = document.querySelectorAll('.product-card');
const finalProductImg = document.getElementById('final-product-img');

// Stage management
function showStage(stageName) {
    // Hide all stages
    Object.values(stages).forEach(stage => {
        if (stage) stage.classList.remove('active');
    });
    
    // Show requested stage
    if (stages[stageName]) {
        stages[stageName].classList.add('active');
        currentStage = stageName;
    }
}

// Initialize selection stage with product pair
function loadProductPair(pairIndex) {
    if (pairIndex >= productPairs.length) return;
    
    const pair = productPairs[pairIndex];
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach((card, index) => {
        const img = card.querySelector('.product-image');
        if (img && pair[index]) {
            img.src = pair[index];
            card.classList.remove('selected');
        }
    });
    
    // Update round counter
    if (currentRoundText) {
        currentRoundText.textContent = pairIndex + 1;
    }
}

// Handle product selection
function handleProductSelect(productUrl) {
    // Add to selected products
    selectedProducts.push(productUrl);
    
    // Visual feedback - add selected class
    const clickedCard = Array.from(productCards).find(card => 
        card.querySelector('.product-image').src.includes(productUrl)
    );
    
    if (clickedCard) {
        clickedCard.classList.add('selected');
    }
    
    // Wait for animation, then move to next pair or basket
    setTimeout(() => {
        if (currentPairIndex < productPairs.length - 1) {
            // Load next pair
            currentPairIndex++;
            loadProductPair(currentPairIndex);
        } else {
            // All pairs selected, show basket
            // Choose random product from selections for final reveal
            finalProduct = selectedProducts[Math.floor(Math.random() * selectedProducts.length)];
            showStage('basket');
        }
    }, 600);
}

// Start button handler
function handleStart() {
    currentPairIndex = 0;
    selectedProducts = [];
    showStage('selection');
    loadProductPair(currentPairIndex);
}

// Generate product button handler
function handleGenerateProduct() {
    showStage('downloading');
    
    // After 2 seconds, show reveal
    setTimeout(() => {
        if (finalProductImg) {
            finalProductImg.src = finalProduct;
        }
        showStage('reveal');
    }, 2000);
}

// Receive basket button handler
function handleReceiveBasket() {
    // Reset state
    currentPairIndex = 0;
    selectedProducts = [];
    finalProduct = '';
    
    // Return to landing
    showStage('landing');
}

// Event listeners
if (startBtn) {
    startBtn.addEventListener('click', handleStart);
}

if (generateBtn) {
    generateBtn.addEventListener('click', handleGenerateProduct);
}

if (receiveBtn) {
    receiveBtn.addEventListener('click', handleReceiveBasket);
}

// Add click handlers to product cards
productCards.forEach(card => {
    card.addEventListener('click', () => {
        const img = card.querySelector('.product-image');
        if (img && img.src) {
            // Extract relative path from full URL
            const url = new URL(img.src);
            const productUrl = url.pathname;
            handleProductSelect(productUrl);
        }
    });
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('BoxyAI initialized');
    showStage('landing');
});

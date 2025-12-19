// Aspect Ratio Data
const aspectRatios = {
    common: [
        { name: '16:9', ratio: 16 / 9, description: 'HD Video/Modern Displays', width: 16, height: 9 },
        { name: '4:3', ratio: 4 / 3, description: 'Classic TV/Monitors', width: 4, height: 3 },
        { name: '21:9', ratio: 21 / 9, description: 'Ultra-wide Cinema', width: 21, height: 9 },
        { name: '1:1', ratio: 1, description: 'Square Format', width: 1, height: 1 },
        { name: '16:10', ratio: 16 / 10, description: 'Laptops/Tablets', width: 16, height: 10 },
        { name: '3:2', ratio: 3 / 2, description: 'Photography/Print', width: 3, height: 2 },
    ],
    aSeries: [
        { name: 'A4', ratio: 1 / Math.SQRT2, description: '210×297mm (Document)', width: 1, height: Math.SQRT2 },
        { name: 'A3', ratio: 1 / Math.SQRT2, description: '297×420mm (Poster)', width: 1, height: Math.SQRT2 },
        { name: 'A5', ratio: 1 / Math.SQRT2, description: '148×210mm (Notebook)', width: 1, height: Math.SQRT2 },
        { name: 'A6', ratio: 1 / Math.SQRT2, description: '105×148mm (Postcard)', width: 1, height: Math.SQRT2 },
    ]
};

// State
let selectedRatios = new Set();
let currentScale = 100;

// Initialize the application
function init() {
    renderRatioControls();
    setupScaleSlider();
    // Select all ratios by default
    [...aspectRatios.common, ...aspectRatios.aSeries].forEach(ratio => {
        selectedRatios.add(ratio.name);
    });
    updateVisualization();
}

// Render aspect ratio control buttons
function renderRatioControls() {
    const commonContainer = document.getElementById('commonRatios');
    const aSeriesContainer = document.getElementById('aSeriesRatios');

    // Render common ratios
    aspectRatios.common.forEach(ratio => {
        const button = createRatioButton(ratio);
        commonContainer.appendChild(button);
    });

    // Render A-series ratios
    aspectRatios.aSeries.forEach(ratio => {
        const button = createRatioButton(ratio);
        aSeriesContainer.appendChild(button);
    });
}

// Create a ratio button element
function createRatioButton(ratio) {
    const button = document.createElement('button');
    button.className = 'w-full px-4 py-2 text-left rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors';
    button.innerHTML = `
        <div class="flex justify-between items-center">
            <div>
                <span class="font-semibold text-gray-800">${ratio.name}</span>
                <span class="text-sm text-gray-600 ml-2">${ratio.description}</span>
            </div>
            <span class="text-xs text-gray-500">${ratio.ratio.toFixed(3)}</span>
        </div>
    `;
    
    button.addEventListener('click', () => {
        toggleRatio(ratio.name, button);
    });
    
    // Mark as selected by default
    button.classList.add('border-green-500', 'bg-green-50');
    
    return button;
}

// Toggle ratio selection
function toggleRatio(ratioName, button) {
    if (selectedRatios.has(ratioName)) {
        selectedRatios.delete(ratioName);
        button.classList.remove('border-green-500', 'bg-green-50');
        button.classList.add('border-gray-300');
    } else {
        selectedRatios.add(ratioName);
        button.classList.remove('border-gray-300');
        button.classList.add('border-green-500', 'bg-green-50');
    }
    updateVisualization();
}

// Setup scale slider
function setupScaleSlider() {
    const slider = document.getElementById('scaleSlider');
    const valueDisplay = document.getElementById('scaleValue');
    
    slider.addEventListener('input', (e) => {
        currentScale = parseInt(e.target.value);
        valueDisplay.textContent = currentScale;
        updateVisualization();
    });
}

// Update visualization area with selected aspect ratios
function updateVisualization() {
    const container = document.getElementById('visualizationArea');
    container.innerHTML = '';
    
    if (selectedRatios.size === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center col-span-full">Select aspect ratios to visualize</p>';
        return;
    }
    
    // Get all selected ratio objects
    const allRatios = [...aspectRatios.common, ...aspectRatios.aSeries];
    const selectedRatioObjects = allRatios.filter(r => selectedRatios.has(r.name));
    
    // Create visualization for each selected ratio
    selectedRatioObjects.forEach(ratio => {
        const card = createVisualizationCard(ratio);
        container.appendChild(card);
    });
}

// Create a visualization card for an aspect ratio
function createVisualizationCard(ratio) {
    const card = document.createElement('div');
    card.className = 'flex flex-col items-center';
    
    // Calculate dimensions
    const baseWidth = currentScale;
    const height = baseWidth / ratio.ratio;
    
    // Create the aspect box
    const box = document.createElement('div');
    box.className = 'aspect-box rounded-lg flex items-center justify-center relative';
    box.style.width = `${baseWidth}px`;
    box.style.height = `${height}px`;
    
    // Content inside the box
    box.innerHTML = `
        <div class="text-white text-center p-4">
            <div class="font-bold text-2xl mb-2">${ratio.name}</div>
            <div class="text-sm opacity-90">${ratio.description}</div>
            <div class="text-xs opacity-75 mt-2">Ratio: ${ratio.ratio.toFixed(3)}</div>
        </div>
    `;
    
    // Dimensions label
    const dimensionsLabel = document.createElement('div');
    dimensionsLabel.className = 'mt-3 text-center';
    dimensionsLabel.innerHTML = `
        <div class="text-sm font-semibold text-gray-700">${baseWidth}px × ${Math.round(height)}px</div>
        <div class="text-xs text-gray-500 mt-1">${ratio.width}:${ratio.height.toFixed(3)}</div>
    `;
    
    card.appendChild(box);
    card.appendChild(dimensionsLabel);
    
    return card;
}

// Animation for smooth scaling
function animateScale(element, targetWidth, targetHeight) {
    element.style.width = `${targetWidth}px`;
    element.style.height = `${targetHeight}px`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

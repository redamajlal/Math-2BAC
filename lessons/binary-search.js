// Tri Binaire Interactive Component
let binaryCurrentArray = [];
let binaryTargetValue = 0;
let binarySearchSteps = [];
let binaryCurrentStep = 0;
let binaryIsSteppingThrough = false;

function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let steps = [];

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        
        steps.push({
            left: left,
            right: right,
            mid: mid,
            midValue: arr[mid],
            comparison: arr[mid] === target ? 'found' : (arr[mid] < target ? 'less' : 'greater')
        });

        if (arr[mid] === target) {
            return { found: true, index: mid, steps: steps };
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return { found: false, index: -1, steps: steps };
}

function performBinarySearch() {
    const arrayInput = document.getElementById('binary-array-input').value.trim();
    const targetInput = document.getElementById('binary-target-input').value.trim();

    if (!arrayInput || !targetInput) {
        showBinaryResult('Veuillez entrer le tableau et la valeur cible', 'error');
        return;
    }

    try {
        binaryCurrentArray = arrayInput.split(/\s+/).map(num => parseInt(num)).filter(num => !isNaN(num));
        binaryTargetValue = parseInt(targetInput);

        if (binaryCurrentArray.length === 0) {
            showBinaryResult('Veuillez entrer des nombres valides', 'error');
            return;
        }

        if (!isBinarySorted(binaryCurrentArray)) {
            showBinaryResult('Le tableau doit être trié pour la recherche binaire !', 'error');
            return;
        }

        const result = binarySearch(binaryCurrentArray, binaryTargetValue);
        binarySearchSteps = result.steps;
        binaryCurrentStep = 0;
        binaryIsSteppingThrough = false;

        drawBinaryVisualization();

        if (result.found) {
            showBinaryResult(`Valeur trouvée à l'indice ${result.index}`, 'success');
        } else {
            showBinaryResult(`Valeur non trouvée`, 'error');
        }

        document.getElementById('binary-step-btn').disabled = false;
        // Remove the line that disables the search button since it no longer exists
    } catch (error) {
        showBinaryResult('Erreur : ' + error.message, 'error');
    }
}

function stepThroughBinary() {
    if (binaryCurrentStep >= binarySearchSteps.length) {
        binaryIsSteppingThrough = false;
        document.getElementById('binary-step-btn').disabled = true;
        return;
    }

    binaryIsSteppingThrough = true;
    const step = binarySearchSteps[binaryCurrentStep];
    
    updateBinaryVisualization(step);
    showBinaryStepInfo(step, binaryCurrentStep + 1);
    
    binaryCurrentStep++;
    
    if (binaryCurrentStep >= binarySearchSteps.length) {
        binaryIsSteppingThrough = false;
        document.getElementById('binary-step-btn').disabled = true;
    }
}

function resetBinary() {
    binaryCurrentArray = [];
    binaryTargetValue = 0;
    binarySearchSteps = [];
    binaryCurrentStep = 0;
    binaryIsSteppingThrough = false;
    
    document.getElementById('binary-array-chart').innerHTML = '';
    document.getElementById('binary-array-indices').innerHTML = '';
    document.getElementById('binary-result').innerHTML = '';
    document.getElementById('binary-result').className = '';
    document.getElementById('binary-info-display').innerHTML = '';
    document.getElementById('binary-step-btn').disabled = true;
    document.getElementById('binary-step-btn').textContent = 'Étape';
}

function createBinaryBarChart() {
    const chartContainer = document.getElementById('binary-array-chart');
    const indicesContainer = document.getElementById('binary-array-indices');
    
    chartContainer.innerHTML = '';
    indicesContainer.innerHTML = '';

    const maxValue = Math.max(...binaryCurrentArray);
    
    binaryCurrentArray.forEach((value, index) => {
        // Create bar
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.textContent = value;
        bar.setAttribute('data-index', index);
        
        // Scale bar height based on value
        const height = Math.max(20, (value / maxValue) * 100);
        bar.style.height = height + 'px';
        
        barContainer.appendChild(bar);
        chartContainer.appendChild(barContainer);
        
        // Create index label
        const indexLabel = document.createElement('div');
        indexLabel.className = 'index';
        indexLabel.textContent = index;
        indicesContainer.appendChild(indexLabel);
    });
}

function drawBinaryVisualization() {
    createBinaryBarChart();
    showBinaryInfo(`Tableau: [${binaryCurrentArray.join(', ')}]<br>Recherche: ${binaryTargetValue}`);
}

function updateBinaryVisualization(step) {
    const bars = document.querySelectorAll('#binary-array-chart .bar');
    
    // Reset all bars
    bars.forEach(bar => {
        bar.className = 'bar';
    });

    // Apply step visualization
    bars.forEach((bar, index) => {
        if (index < step.left || index > step.right) {
            bar.classList.add('eliminated');
        } else if (index === step.mid) {
            if (step.comparison === 'found') {
                bar.classList.add('found');
            } else {
                bar.classList.add('current');
            }
        } else if (index >= step.left && index <= step.right) {
            if (index < step.mid) {
                bar.classList.add('left-range');
            } else {
                bar.classList.add('right-range');
            }
        }
    });
}

function showBinaryResult(message, type) {
    const resultDiv = document.getElementById('binary-result');
    resultDiv.textContent = message;
    resultDiv.className = type;
}

function showBinaryInfo(message) {
    const infoDiv = document.getElementById('binary-info-display');
    infoDiv.innerHTML = message;
}

function showBinaryStepInfo(step, stepNumber) {
    let comparisonText = '';
    
    switch(step.comparison) {
        case 'found':
            comparisonText = `✓ arr[${step.mid}] = ${step.midValue} = ${binaryTargetValue}`;
            break;
        case 'less':
            comparisonText = `arr[${step.mid}] = ${step.midValue} < ${binaryTargetValue}, chercher à droite →`;
            break;
        case 'greater':
            comparisonText = `arr[${step.mid}] = ${step.midValue} > ${binaryTargetValue}, chercher à gauche ←`;
            break;
    }
    
    const info = `
        <div class="step-info">Étape ${stepNumber}/${binarySearchSteps.length}: Vérifier l'élément du milieu</div>
        <div class="comparison">${comparisonText}</div>
        <div>Intervalle: [${step.left}..${step.right}], Milieu: ${step.mid}</div>
    `;
    
    showBinaryInfo(info);
}

function isBinarySorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
            return false;
        }
    }
    return true;
}

// Event listeners for binary search
document.addEventListener('DOMContentLoaded', function() {
    const arrayInput = document.getElementById('binary-array-input');
    const targetInput = document.getElementById('binary-target-input');
    
    if (arrayInput) {
        arrayInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performBinarySearch();
            }
        });
        
        // Auto-trigger search when input changes
        arrayInput.addEventListener('input', function() {
            if (arrayInput.value.trim() && targetInput && targetInput.value.trim()) {
                performBinarySearch();
            }
        });
    }
    
    if (targetInput) {
        targetInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performBinarySearch();
            }
        });
        
        // Auto-trigger search when input changes
        targetInput.addEventListener('input', function() {
            if (targetInput.value.trim() && arrayInput && arrayInput.value.trim()) {
                performBinarySearch();
            }
        });
    }
});

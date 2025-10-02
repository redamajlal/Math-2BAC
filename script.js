let currentArray = [];
let targetValue = 0;
let searchSteps = [];
let currentStep = 0;
let isSteppingThrough = false;

// Binary search implementation (same logic as Python version)
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

function performSearch() {
    // Get input values
    const arrayInput = document.getElementById('array-input').value.trim();
    const targetInput = document.getElementById('target-input').value.trim();

    if (!arrayInput || !targetInput) {
        showResult('Please enter both array and target value', 'error');
        return;
    }

    try {
        currentArray = arrayInput.split(/\s+/).map(num => parseInt(num)).filter(num => !isNaN(num));
        targetValue = parseInt(targetInput);

        if (currentArray.length === 0) {
            showResult('Please enter valid numbers for the array', 'error');
            return;
        }

        // Check if array is sorted
        if (!isSorted(currentArray)) {
            showResult('Array must be sorted for binary search to work correctly!', 'error');
            return;
        }

        // Perform binary search
        const result = binarySearch(currentArray, targetValue);
        searchSteps = result.steps;
        currentStep = 0;
        isSteppingThrough = false;

        // Display array
        displayArray();

        // Show final result
        if (result.found) {
            showResult(`✅ Found ${targetValue} at index ${result.index}`, 'success');
        } else {
            showResult(`❌ ${targetValue} not found in the array`, 'error');
        }

        // Enable step-through button
        document.getElementById('step-btn').disabled = false;
        
        // Show search summary
        showSearchInfo();

    } catch (error) {
        showResult('Error: Please enter valid numbers', 'error');
    }
}

function stepThrough() {
    if (currentStep >= searchSteps.length) {
        isSteppingThrough = false;
        document.getElementById('step-btn').disabled = true;
        return;
    }

    isSteppingThrough = true;
    const step = searchSteps[currentStep];
    
    // Update array visualization
    displayArrayWithStep(step);
    
    // Update step info
    showStepInfo(step, currentStep + 1);
    
    currentStep++;
    
    if (currentStep >= searchSteps.length) {
        document.getElementById('step-btn').textContent = '✅ Complete';
        setTimeout(() => {
            document.getElementById('step-btn').disabled = true;
            document.getElementById('step-btn').textContent = '👣 Step Through';
        }, 2000);
    }
}

function reset() {
    currentArray = [];
    targetValue = 0;
    searchSteps = [];
    currentStep = 0;
    isSteppingThrough = false;
    
    document.getElementById('array-container').innerHTML = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('result').className = '';
    document.getElementById('search-info').innerHTML = '';
    document.getElementById('step-info').innerHTML = '';
    document.getElementById('step-btn').disabled = true;
    document.getElementById('step-btn').textContent = '👣 Step Through';
}

function displayArray() {
    const container = document.getElementById('array-container');
    container.innerHTML = '';

    currentArray.forEach((value, index) => {
        const element = document.createElement('div');
        element.className = 'array-element';
        element.textContent = value;
        element.setAttribute('data-index', index);
        container.appendChild(element);
    });
}

function displayArrayWithStep(step) {
    const container = document.getElementById('array-container');
    const elements = container.querySelectorAll('.array-element');

    // Reset all elements
    elements.forEach(el => {
        el.className = 'array-element';
    });

    // Highlight current step
    elements.forEach((el, index) => {
        if (index < step.left || index > step.right) {
            el.classList.add('eliminated');
        } else if (index === step.mid) {
            el.classList.add('current');
        } else if (index >= step.left && index <= step.right) {
            if (index < step.mid) {
                el.classList.add('left-range');
            } else {
                el.classList.add('right-range');
            }
        }
    });

    // If found, highlight the found element
    if (step.comparison === 'found') {
        elements[step.mid].classList.remove('current');
        elements[step.mid].classList.add('found');
    }
}

function showResult(message, type) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    resultDiv.className = type;
}

function showSearchInfo() {
    const infoDiv = document.getElementById('search-info');
    infoDiv.innerHTML = `
        <h3>Search Summary</h3>
        <p><strong>Array:</strong> [${currentArray.join(', ')}]</p>
        <p><strong>Target:</strong> ${targetValue}</p>
        <p><strong>Array Length:</strong> ${currentArray.length}</p>
        <p><strong>Total Steps:</strong> ${searchSteps.length}</p>
        <p><strong>Max Possible Steps:</strong> ${Math.ceil(Math.log2(currentArray.length))}</p>
    `;
}

function showStepInfo(step, stepNumber) {
    const infoDiv = document.getElementById('step-info');
    let comparisonText = '';
    
    switch(step.comparison) {
        case 'found':
            comparisonText = `🎯 Found! arr[${step.mid}] = ${step.midValue} = ${targetValue}`;
            break;
        case 'less':
            comparisonText = `📈 arr[${step.mid}] = ${step.midValue} < ${targetValue}, search right half`;
            break;
        case 'greater':
            comparisonText = `📉 arr[${step.mid}] = ${step.midValue} > ${targetValue}, search left half`;
            break;
    }
    
    infoDiv.innerHTML = `
        <h3>Step ${stepNumber} of ${searchSteps.length}</h3>
        <p><strong>Range:</strong> [${step.left}, ${step.right}]</p>
        <p><strong>Middle Index:</strong> ${step.mid}</p>
        <p><strong>Middle Value:</strong> ${step.midValue}</p>
        <p><strong>Comparison:</strong> ${comparisonText}</p>
    `;
}

function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
            return false;
        }
    }
    return true;
}

// Event listeners
document.getElementById('array-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

document.getElementById('target-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Initialize with default values
window.addEventListener('load', function() {
    performSearch();
});

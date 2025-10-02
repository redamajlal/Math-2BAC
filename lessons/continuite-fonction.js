// Continuité d'une Fonction Interactive Component
let continuityCurrentFunction = 'continuous';
let continuityTestPoint = 0;
let continuityCanvas, continuityCtx;

// Function definitions with different types of discontinuities
const continuityFunctions = {
    continuous: {
        name: '$f(x) = x^2$',
        f: x => x * x,
        continuous: true,
        description: 'Fonction continue partout'
    },
    jump: {
        name: 'Discontinuité de saut',
        f: x => x < 0 ? x + 1 : x + 2,
        continuous: false,
        discontinuityAt: 0,
        leftLimit: 1,
        rightLimit: 2,
        functionValue: 2,
        description: 'Saut en $x = 0$'
    },
    removable: {
        name: 'Discontinuité supprimable',
        f: x => {
            if (x === 0) return 2; // Point défini différemment
            return x * x; // Limite = 0, mais f(0) = 2
        },
        continuous: false,
        discontinuityAt: 0,
        limit: 0,
        functionValue: 2,
        description: 'Point isolé en $x = 0$'
    },
    infinite: {
        name: 'Discontinuité infinie',
        f: x => {
            if (Math.abs(x) < 0.01) return undefined;
            return 1 / x;
        },
        continuous: false,
        discontinuityAt: 0,
        description: 'Asymptote verticale en $x = 0$'
    },
    piecewise: {
        name: 'Fonction par morceaux',
        f: x => {
            if (x < -1) return x + 2;
            if (x < 1) return x * x;
            return x - 1;
        },
        continuous: true,
        description: 'Continue aux points de raccordement'
    }
};

function updateContinuityFunction() {
    const select = document.getElementById('continuity-function-select');
    continuityCurrentFunction = select.value;
    
    if (!continuityCanvas) {
        continuityCanvas = document.getElementById('continuity-canvas');
        continuityCtx = continuityCanvas.getContext('2d');
    }
    
    drawContinuityFunction();
    updateContinuityInfo();
}

function updateContinuityPoint() {
    const input = document.getElementById('continuity-point');
    continuityTestPoint = parseFloat(input.value);
    drawContinuityFunction();
    updateContinuityInfo();
}

function drawContinuityFunction() {
    if (!continuityCtx) return;
    
    const width = continuityCanvas.width;
    const height = continuityCanvas.height;
    const func = continuityFunctions[continuityCurrentFunction];
    
    // Clear canvas
    continuityCtx.clearRect(0, 0, width, height);
    
    // Set up coordinate system
    const padding = 50;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    const xMin = -3, xMax = 3, yMin = -2, yMax = 4;
    
    // Draw grid and axes
    drawContinuityGrid(padding, graphWidth, graphHeight, xMin, xMax, yMin, yMax);
    
    // Draw function
    drawContinuityMainFunction(func, padding, graphWidth, graphHeight, xMin, xMax, yMin, yMax);
    
    // Draw test point analysis
    drawContinuityAnalysis(func, padding, graphWidth, graphHeight, xMin, xMax, yMin, yMax);
    
    // Add labels
    addContinuityLabels();
}

function drawContinuityGrid(padding, graphWidth, graphHeight, xMin, xMax, yMin, yMax) {
    continuityCtx.strokeStyle = '#f0f0f0';
    continuityCtx.lineWidth = 1;
    
    // Grid lines
    for (let i = 0; i <= 10; i++) {
        const x = padding + (i / 10) * graphWidth;
        const y = padding + (i / 10) * graphHeight;
        
        // Vertical lines
        continuityCtx.beginPath();
        continuityCtx.moveTo(x, padding);
        continuityCtx.lineTo(x, padding + graphHeight);
        continuityCtx.stroke();
        
        // Horizontal lines
        continuityCtx.beginPath();
        continuityCtx.moveTo(padding, y);
        continuityCtx.lineTo(padding + graphWidth, y);
        continuityCtx.stroke();
    }
    
    // Axes
    continuityCtx.strokeStyle = '#333';
    continuityCtx.lineWidth = 2;
    
    // X-axis (y = 0)
    const yZero = padding + graphHeight - ((0 - yMin) / (yMax - yMin)) * graphHeight;
    continuityCtx.beginPath();
    continuityCtx.moveTo(padding, yZero);
    continuityCtx.lineTo(padding + graphWidth, yZero);
    continuityCtx.stroke();
    
    // Y-axis (x = 0)
    const xZero = padding + ((0 - xMin) / (xMax - xMin)) * graphWidth;
    continuityCtx.beginPath();
    continuityCtx.moveTo(xZero, padding);
    continuityCtx.lineTo(xZero, padding + graphHeight);
    continuityCtx.stroke();
}

function drawContinuityMainFunction(func, padding, graphWidth, graphHeight, xMin, xMax, yMin, yMax) {
    continuityCtx.strokeStyle = '#0969da';
    continuityCtx.lineWidth = 3;
    
    const steps = 300;
    let segments = [];
    let currentSegment = [];
    
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = xMin + t * (xMax - xMin);
        const y = func.f(x);
        
        if (y !== undefined && !isNaN(y) && isFinite(y) && y >= yMin && y <= yMax) {
            const canvasX = padding + ((x - xMin) / (xMax - xMin)) * graphWidth;
            const canvasY = padding + graphHeight - ((y - yMin) / (yMax - yMin)) * graphHeight;
            currentSegment.push([canvasX, canvasY]);
        } else {
            if (currentSegment.length > 0) {
                segments.push(currentSegment);
                currentSegment = [];
            }
        }
    }
    
    if (currentSegment.length > 0) {
        segments.push(currentSegment);
    }
    
    // Draw each continuous segment
    segments.forEach(segment => {
        if (segment.length > 1) {
            continuityCtx.beginPath();
            continuityCtx.moveTo(segment[0][0], segment[0][1]);
            for (let i = 1; i < segment.length; i++) {
                continuityCtx.lineTo(segment[i][0], segment[i][1]);
            }
            continuityCtx.stroke();
        }
    });
    
    // Draw special points for discontinuities
    if (!func.continuous && func.discontinuityAt !== undefined) {
        const x = func.discontinuityAt;
        const canvasX = padding + ((x - xMin) / (xMax - xMin)) * graphWidth;
        
        // Draw hollow circle for limit point (if different from function value)
        if (func.limit !== undefined && func.functionValue !== undefined && func.limit !== func.functionValue) {
            const limitY = func.limit;
            const canvasLimitY = padding + graphHeight - ((limitY - yMin) / (yMax - yMin)) * graphHeight;
            
            continuityCtx.strokeStyle = '#0969da';
            continuityCtx.lineWidth = 2;
            continuityCtx.beginPath();
            continuityCtx.arc(canvasX, canvasLimitY, 5, 0, 2 * Math.PI);
            continuityCtx.stroke();
        }
        
        // Draw filled circle for actual function value
        if (func.functionValue !== undefined) {
            const funcY = func.functionValue;
            const canvasFuncY = padding + graphHeight - ((funcY - yMin) / (yMax - yMin)) * graphHeight;
            
            continuityCtx.fillStyle = '#dc3545';
            continuityCtx.beginPath();
            continuityCtx.arc(canvasX, canvasFuncY, 5, 0, 2 * Math.PI);
            continuityCtx.fill();
        }
    }
}

function drawContinuityAnalysis(func, padding, graphWidth, graphHeight, xMin, xMax, yMin, yMax) {
    const x = continuityTestPoint;
    const canvasX = padding + ((x - xMin) / (xMax - xMin)) * graphWidth;
    
    if (canvasX >= padding && canvasX <= padding + graphWidth) {
        // Draw vertical line at test point
        continuityCtx.strokeStyle = '#28a745';
        continuityCtx.lineWidth = 2;
        continuityCtx.setLineDash([5, 5]);
        continuityCtx.beginPath();
        continuityCtx.moveTo(canvasX, padding);
        continuityCtx.lineTo(canvasX, padding + graphHeight);
        continuityCtx.stroke();
        continuityCtx.setLineDash([]);
        
        // Draw point at function value if it exists
        const y = func.f(x);
        if (y !== undefined && !isNaN(y) && isFinite(y)) {
            const canvasY = padding + graphHeight - ((y - yMin) / (yMax - yMin)) * graphHeight;
            
            if (canvasY >= padding && canvasY <= padding + graphHeight) {
                continuityCtx.fillStyle = '#28a745';
                continuityCtx.beginPath();
                continuityCtx.arc(canvasX, canvasY, 6, 0, 2 * Math.PI);
                continuityCtx.fill();
            }
        }
    }
}

function addContinuityLabels() {
    continuityCtx.font = '14px Arial';
    continuityCtx.fillStyle = '#333';
    
    // Function name
    continuityCtx.fillText(continuityFunctions[continuityCurrentFunction].name, 20, 30);
    
    // Axes labels
    continuityCtx.fillStyle = '#666';
    continuityCtx.font = '12px Arial';
    continuityCtx.fillText('x', 580, 200);
    continuityCtx.fillText('y', 300, 20);
}

function updateContinuityInfo() {
    const func = continuityFunctions[continuityCurrentFunction];
    const x = continuityTestPoint;
    const y = func.f(x);
    
    let info = `
        <div><strong>Fonction:</strong> ${func.description}</div>
        <div><strong>Point analysé:</strong> $x = ${x}$</div>
    `;
    
    if (y !== undefined && !isNaN(y) && isFinite(y)) {
        info += `<div><strong>$f(${x})$:</strong> ${y.toFixed(2)}</div>`;
    } else {
        info += `<div><strong>$f(${x})$:</strong> Non définie</div>`;
    }
    
    // Add continuity analysis
    if (func.continuous) {
        info += `<div class="comparison">✓ Fonction continue en $x = ${x}$</div>`;
    } else if (func.discontinuityAt === x) {
        info += `<div class="comparison">✗ Discontinuité en $x = ${x}$</div>`;
        if (func.leftLimit !== undefined && func.rightLimit !== undefined) {
            info += `
                <div>$\\lim_{x \\to ${x}^-} f(x) = ${func.leftLimit}$</div>
                <div>$\\lim_{x \\to ${x}^+} f(x) = ${func.rightLimit}$</div>
            `;
        }
    } else {
        info += `<div class="comparison">✓ Fonction continue en $x = ${x}$</div>`;
    }
    
    document.getElementById('continuity-info-display').innerHTML = info;
    
    // Re-render MathJax for the new content
    if (typeof MathJax !== 'undefined') {
        MathJax.typesetPromise([document.getElementById('continuity-info-display')]);
    }
}

function analyzeContinuity() {
    const func = continuityFunctions[continuityCurrentFunction];
    const x = continuityTestPoint;
    
    let analysis = `<div><strong>Analyse de continuité en $x = ${x}$:</strong></div>`;
    
    if (func.continuous) {
        analysis += `
            <div>1. ✓ La fonction est définie en $x = ${x}$</div>
            <div>2. ✓ La limite existe quand $x \\to ${x}$</div>
            <div>3. ✓ $\\lim_{x \\to ${x}} f(x) = f(${x})$</div>
            <div class="comparison">Conclusion: La fonction est continue en $x = ${x}$</div>
        `;
    } else {
        if (func.discontinuityAt === x) {
            analysis += `
                <div>1. ${func.functionValue !== undefined ? '✓' : '✗'} Fonction ${func.functionValue !== undefined ? 'définie' : 'non définie'} en $x = ${x}$</div>
                <div>2. ${func.leftLimit !== undefined && func.rightLimit !== undefined && func.leftLimit === func.rightLimit ? '✓' : '✗'} Limite ${func.leftLimit === func.rightLimit ? 'existe' : 'n\'existe pas'}</div>
                <div>3. ${func.limit === func.functionValue ? '✓' : '✗'} Limite ${func.limit === func.functionValue ? '=' : '≠'} valeur de la fonction</div>
                <div class="comparison">Conclusion: Discontinuité de type ${getDiscontinuityType(func)}</div>
            `;
        } else {
            analysis += `
                <div>✓ La fonction est continue en $x = ${x}$</div>
                <div class="comparison">La discontinuité se trouve en $x = ${func.discontinuityAt}$</div>
            `;
        }
    }
    
    showContinuityResult(analysis, 'success');
}

function getDiscontinuityType(func) {
    if (func.leftLimit !== undefined && func.rightLimit !== undefined && func.leftLimit !== func.rightLimit) {
        return 'saut';
    } else if (func.limit !== undefined && func.functionValue !== undefined && func.limit !== func.functionValue) {
        return 'supprimable';
    } else {
        return 'infinie';
    }
}

function showLimits() {
    const func = continuityFunctions[continuityCurrentFunction];
    const x = continuityTestPoint;
    
    let limits = `<div><strong>Calcul des limites en $x = ${x}$:</strong></div>`;
    
    if (func.discontinuityAt === x) {
        if (func.leftLimit !== undefined) {
            limits += `<div>$\\lim_{x \\to ${x}^-} f(x) = ${func.leftLimit}$</div>`;
        }
        if (func.rightLimit !== undefined) {
            limits += `<div>$\\lim_{x \\to ${x}^+} f(x) = ${func.rightLimit}$</div>`;
        }
        if (func.limit !== undefined) {
            limits += `<div>$\\lim_{x \\to ${x}} f(x) = ${func.limit}$</div>`;
        } else if (func.leftLimit !== func.rightLimit) {
            limits += `<div>$\\lim_{x \\to ${x}} f(x)$ n'existe pas (limites latérales différentes)</div>`;
        }
    } else {
        const y = func.f(x);
        if (y !== undefined) {
            limits += `<div>$\\lim_{x \\to ${x}} f(x) = ${y.toFixed(2)}$</div>`;
        }
    }
    
    showContinuityResult(limits, 'success');
}

function resetContinuity() {
    document.getElementById('continuity-function-select').value = 'continuous';
    document.getElementById('continuity-point').value = '0';
    continuityCurrentFunction = 'continuous';
    continuityTestPoint = 0;
    
    drawContinuityFunction();
    updateContinuityInfo();
    document.getElementById('continuity-result').innerHTML = '';
}

function showContinuityResult(message, type) {
    const resultDiv = document.getElementById('continuity-result');
    resultDiv.innerHTML = message;
    resultDiv.className = type;
    
    // Re-render MathJax for the new content
    if (typeof MathJax !== 'undefined') {
        MathJax.typesetPromise([resultDiv]);
    }
}

function analyzeCustomContinuityFunction() {
    const input = document.getElementById('custom-continuity-function');
    const functionStr = input.value.trim();
    
    if (!functionStr) {
        alert('Veuillez entrer une fonction');
        return;
    }
    
    try {
        // Safely evaluate the function
        const func = eval(`(${functionStr})`);
        
        if (typeof func !== 'function') {
            throw new Error('Expression invalide');
        }
        
        // Test the function with a few values
        func(0);
        func(1);
        func(-1);
        
        customContinuityFunction = {
            name: `$f(x) = $ votre fonction`,
            f: func,
            description: 'Fonction personnalisée'
        };
        
        // Switch to custom function mode
        continuityCurrentFunction = 'custom';
        document.getElementById('continuity-function-select').value = 'continuous';
        
        updateContinuityFunction();
        
        // Show analysis result
        analyzeCustomFunctionContinuity(func);
        
    } catch (error) {
        alert(`Erreur dans la fonction: ${error.message}\n\nExemples valides:\n- x => x*x\n- x => Math.sin(x)\n- x => x < 0 ? -x : x\n- x => 1/x`);
    }
}

function analyzeCustomFunctionContinuity(func) {
    const testPoints = [-2, -1, 0, 1, 2];
    let analysis = '<h4>Analyse de continuité automatique:</h4><ul>';
    
    for (let point of testPoints) {
        try {
            const value = func(point);
            
            if (value === undefined || value === null || !isFinite(value)) {
                analysis += `<li>Point $x = ${point}$: <span style="color: red;">Discontinuité possible</span> (valeur non définie)</li>`;
            } else {
                // Check continuity by testing nearby points
                const epsilon = 0.001;
                const leftValue = func(point - epsilon);
                const rightValue = func(point + epsilon);
                
                if (Math.abs(leftValue - value) < 0.1 && Math.abs(rightValue - value) < 0.1) {
                    analysis += `<li>Point $x = ${point}$: <span style="color: green;">Probablement continue</span></li>`;
                } else {
                    analysis += `<li>Point $x = ${point}$: <span style="color: orange;">Discontinuité possible</span></li>`;
                }
            }
        } catch (error) {
            analysis += `<li>Point $x = ${point}$: <span style="color: red;">Erreur d'évaluation</span></li>`;
        }
    }
    
    analysis += '</ul><p><em>Note: Cette analyse est approximative. Testez des points spécifiques pour une analyse précise.</em></p>';
    
    const resultDiv = document.getElementById('continuity-result');
    if (resultDiv) {
        resultDiv.innerHTML = analysis;
        if (typeof MathJax !== 'undefined') {
            MathJax.typesetPromise([resultDiv]);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('continuity-canvas');
    if (canvas) {
        continuityCanvas = canvas;
        continuityCtx = canvas.getContext('2d');
        updateContinuityFunction();
    }
});

// Fonctions Réciproques Interactive Component
let inverseCurrentFunction = 'linear';
let inverseTestPoint = 2;
let inverseCanvas, inverseCtx;
let inverseAnimationId = null;

// Function definitions
const inverseFunctions = {
    linear: {
        name: '$f(x) = 2x + 1$',
        inverse: '$f^{-1}(x) = \\frac{x - 1}{2}$',
        f: x => 2 * x + 1,
        fInverse: x => (x - 1) / 2,
        domain: [-5, 5],
        range: [-9, 11]
    },
    quadratic: {
        name: '$f(x) = x^2$ ($x \\geq 0$)',
        inverse: '$f^{-1}(x) = \\sqrt{x}$',
        f: x => x >= 0 ? x * x : undefined,
        fInverse: x => x >= 0 ? Math.sqrt(x) : undefined,
        domain: [0, 4],
        range: [0, 16]
    },
    cubic: {
        name: '$f(x) = x^3$',
        inverse: '$f^{-1}(x) = \\sqrt[3]{x}$',
        f: x => x * x * x,
        fInverse: x => Math.cbrt(x),
        domain: [-3, 3],
        range: [-27, 27]
    },
    exponential: {
        name: '$f(x) = e^x$',
        inverse: '$f^{-1}(x) = \\ln(x)$',
        f: x => Math.exp(x),
        fInverse: x => x > 0 ? Math.log(x) : undefined,
        domain: [-2, 3],
        range: [0.14, 20]
    },
    logarithm: {
        name: '$f(x) = \\ln(x)$',
        inverse: '$f^{-1}(x) = e^x$',
        f: x => x > 0 ? Math.log(x) : undefined,
        fInverse: x => Math.exp(x),
        domain: [0.1, 7],
        range: [-2, 2]
    }
};

function updateInverseFunction() {
    const select = document.getElementById('function-select');
    inverseCurrentFunction = select.value;
    
    if (!inverseCanvas) {
        inverseCanvas = document.getElementById('inverse-canvas');
        inverseCtx = inverseCanvas.getContext('2d');
    }
    
    drawInverseFunctions();
    updateInverseInfo();
}

function updateTestPoint() {
    const input = document.getElementById('test-point');
    inverseTestPoint = parseFloat(input.value);
    drawInverseFunctions();
    updateInverseInfo();
}

function drawInverseFunctions() {
    if (!inverseCtx) return;
    
    const width = inverseCanvas.width;
    const height = inverseCanvas.height;
    const func = inverseFunctions[inverseCurrentFunction];
    
    // Clear canvas
    inverseCtx.clearRect(0, 0, width, height);
    
    // Set up coordinate system
    const padding = 50;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Draw grid and axes
    drawGrid(padding, graphWidth, graphHeight);
    
    // Draw y = x line (line of reflection)
    inverseCtx.strokeStyle = '#ddd';
    inverseCtx.lineWidth = 1;
    inverseCtx.setLineDash([5, 5]);
    inverseCtx.beginPath();
    inverseCtx.moveTo(padding, height - padding);
    inverseCtx.lineTo(width - padding, padding);
    inverseCtx.stroke();
    inverseCtx.setLineDash([]);
    
    // Draw original function
    drawFunction(func.f, '#0969da', 'f(x)', func.domain, padding, graphWidth, graphHeight);
    
    // Draw inverse function
    drawFunction(func.fInverse, '#dc3545', 'f⁻¹(x)', func.range, padding, graphWidth, graphHeight);
    
    // Draw test point and its inverse
    drawTestPoints(func, padding, graphWidth, graphHeight);
    
    // Add labels
    addFunctionLabels();
}

function drawGrid(padding, graphWidth, graphHeight) {
    inverseCtx.strokeStyle = '#f0f0f0';
    inverseCtx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
        const x = padding + (i / 10) * graphWidth;
        inverseCtx.beginPath();
        inverseCtx.moveTo(x, padding);
        inverseCtx.lineTo(x, padding + graphHeight);
        inverseCtx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
        const y = padding + (i / 10) * graphHeight;
        inverseCtx.beginPath();
        inverseCtx.moveTo(padding, y);
        inverseCtx.lineTo(padding + graphWidth, y);
        inverseCtx.stroke();
    }
    
    // Draw axes
    inverseCtx.strokeStyle = '#333';
    inverseCtx.lineWidth = 2;
    
    // X-axis
    inverseCtx.beginPath();
    inverseCtx.moveTo(padding, padding + graphHeight/2);
    inverseCtx.lineTo(padding + graphWidth, padding + graphHeight/2);
    inverseCtx.stroke();
    
    // Y-axis
    inverseCtx.beginPath();
    inverseCtx.moveTo(padding + graphWidth/2, padding);
    inverseCtx.lineTo(padding + graphWidth/2, padding + graphHeight);
    inverseCtx.stroke();
}

function drawFunction(func, color, label, domain, padding, graphWidth, graphHeight) {
    inverseCtx.strokeStyle = color;
    inverseCtx.lineWidth = 3;
    inverseCtx.beginPath();
    
    let firstPoint = true;
    const steps = 200;
    
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = domain[0] + t * (domain[1] - domain[0]);
        const y = func(x);
        
        if (y !== undefined && !isNaN(y) && isFinite(y)) {
            const canvasX = padding + ((x - domain[0]) / (domain[1] - domain[0])) * graphWidth;
            const canvasY = padding + graphHeight - ((y - domain[0]) / (domain[1] - domain[0])) * graphHeight;
            
            if (canvasX >= padding && canvasX <= padding + graphWidth &&
                canvasY >= padding && canvasY <= padding + graphHeight) {
                
                if (firstPoint) {
                    inverseCtx.moveTo(canvasX, canvasY);
                    firstPoint = false;
                } else {
                    inverseCtx.lineTo(canvasX, canvasY);
                }
            }
        }
    }
    
    inverseCtx.stroke();
}

function drawTestPoints(func, padding, graphWidth, graphHeight) {
    const domain = func.domain;
    const x = inverseTestPoint;
    
    if (x >= domain[0] && x <= domain[1]) {
        const y = func.f(x);
        const xInverse = func.fInverse(y);
        
        if (y !== undefined && xInverse !== undefined) {
            // Point on original function
            const canvasX1 = padding + ((x - domain[0]) / (domain[1] - domain[0])) * graphWidth;
            const canvasY1 = padding + graphHeight - ((y - domain[0]) / (domain[1] - domain[0])) * graphHeight;
            
            // Point on inverse function  
            const canvasX2 = padding + ((y - domain[0]) / (domain[1] - domain[0])) * graphWidth;
            const canvasY2 = padding + graphHeight - ((x - domain[0]) / (domain[1] - domain[0])) * graphHeight;
            
            // Draw points
            inverseCtx.fillStyle = '#0969da';
            inverseCtx.beginPath();
            inverseCtx.arc(canvasX1, canvasY1, 6, 0, 2 * Math.PI);
            inverseCtx.fill();
            
            inverseCtx.fillStyle = '#dc3545';
            inverseCtx.beginPath();
            inverseCtx.arc(canvasX2, canvasY2, 6, 0, 2 * Math.PI);
            inverseCtx.fill();
            
            // Draw connection line
            inverseCtx.strokeStyle = '#28a745';
            inverseCtx.lineWidth = 2;
            inverseCtx.setLineDash([3, 3]);
            inverseCtx.beginPath();
            inverseCtx.moveTo(canvasX1, canvasY1);
            inverseCtx.lineTo(canvasX2, canvasY2);
            inverseCtx.stroke();
            inverseCtx.setLineDash([]);
        }
    }
}

function addFunctionLabels() {
    inverseCtx.font = '14px Arial';
    
    // f(x) label
    inverseCtx.fillStyle = '#0969da';
    inverseCtx.fillText('f(x)', 20, 30);
    
    // f⁻¹(x) label
    inverseCtx.fillStyle = '#dc3545';
    inverseCtx.fillText('f⁻¹(x)', 20, 50);
    
    // y = x label
    inverseCtx.fillStyle = '#999';
    inverseCtx.fillText('y = x', 20, 70);
}

function updateInverseInfo() {
    const func = inverseFunctions[inverseCurrentFunction];
    const x = inverseTestPoint;
    const y = func.f(x);
    const xInverse = y !== undefined ? func.fInverse(y) : undefined;
    
    let info = `
        <div><strong>Fonction:</strong> ${func.name}</div>
        <div><strong>Fonction inverse:</strong> ${func.inverse}</div>
    `;
    
    if (y !== undefined && xInverse !== undefined) {
        info += `
            <div><strong>Test:</strong></div>
            <div>$f(${x}) = ${y.toFixed(2)}$</div>
            <div>$f^{-1}(${y.toFixed(2)}) = ${xInverse.toFixed(2)}$</div>
            <div class="comparison">Vérification: $f^{-1}(f(${x})) = ${xInverse.toFixed(2)}$ ${Math.abs(xInverse - x) < 0.01 ? '✓' : '✗'}</div>
        `;
    } else {
        info += `<div class="comparison">Point $${x}$ hors du domaine de définition</div>`;
    }
    
    document.getElementById('inverse-info-display').innerHTML = info;
    
    // Re-render MathJax for the new content
    if (typeof MathJax !== 'undefined') {
        MathJax.typesetPromise([document.getElementById('inverse-info-display')]);
    }
}

function showInverseSteps() {
    const func = inverseFunctions[inverseCurrentFunction];
    let steps = `
        <div><strong>Étapes pour trouver la fonction inverse:</strong></div>
        <div>1. Remplacer $f(x)$ par $y$: $y = ${func.name.split('=')[1]}$</div>
        <div>2. Échanger $x$ et $y$</div>
        <div>3. Résoudre pour $y$</div>
        <div>4. Remplacer $y$ par $f^{-1}(x)$</div>
        <div><strong>Résultat:</strong> ${func.inverse}</div>
    `;
    
    showInverseResult(steps, 'success');
}

function animateInverse() {
    // Simple animation showing the reflection
    if (inverseAnimationId) {
        cancelAnimationFrame(inverseAnimationId);
    }
    
    let frame = 0;
    const animate = () => {
        drawInverseFunctions();
        
        // Add animation effect (could be enhanced)
        inverseCtx.globalAlpha = 0.5 + 0.5 * Math.sin(frame * 0.1);
        drawFunction(inverseFunctions[inverseCurrentFunction].fInverse, '#dc3545', 'f⁻¹(x)', 
                    inverseFunctions[inverseCurrentFunction].range, 50, 500, 300);
        inverseCtx.globalAlpha = 1;
        
        frame++;
        if (frame < 60) {
            inverseAnimationId = requestAnimationFrame(animate);
        }
    };
    
    animate();
}

function resetInverse() {
    if (inverseAnimationId) {
        cancelAnimationFrame(inverseAnimationId);
    }
    
    document.getElementById('function-select').value = 'linear';
    document.getElementById('test-point').value = '2';
    inverseCurrentFunction = 'linear';
    inverseTestPoint = 2;
    
    drawInverseFunctions();
    updateInverseInfo();
    document.getElementById('inverse-result').innerHTML = '';
}

function showInverseResult(message, type) {
    const resultDiv = document.getElementById('inverse-result');
    resultDiv.innerHTML = message;
    resultDiv.className = type;
    
    // Re-render MathJax for the new content
    if (typeof MathJax !== 'undefined') {
        MathJax.typesetPromise([resultDiv]);
    }
}

function getCurrentInverseFunction() {
    if (inverseCurrentFunction === 'custom' && customInverseFunction) {
        return customInverseFunction;
    }
    return inverseFunctions[inverseCurrentFunction];
}

function analyzeCustomInverseFunction() {
    const input = document.getElementById('custom-inverse-function');
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
        
        customInverseFunction = {
            name: `$f(x) = $ votre fonction`,
            inverse: `Inverse calculée numériquement`,
            f: func,
            fInverse: x => findNumericalInverse(func, x),
            domain: [-5, 5],
            range: [func(-5), func(5)],
            description: 'Fonction personnalisée'
        };
        
        // Switch to custom function mode
        inverseCurrentFunction = 'custom';
        document.getElementById('function-select').value = 'linear';
        
        updateInverseFunction();
        
        // Show analysis result
        analyzeCustomFunctionInverse(func);
        
    } catch (error) {
        alert(`Erreur dans la fonction: ${error.message}\n\nExemples valides:\n- x => 2*x + 1\n- x => x*x\n- x => Math.sin(x)\n- x => Math.exp(x)`);
    }
}

function findNumericalInverse(func, y, tolerance = 0.001) {
    // Newton-Raphson method for finding inverse
    let x = y; // Initial guess
    
    for (let i = 0; i < 50; i++) {
        const fx = func(x);
        const error = fx - y;
        
        if (Math.abs(error) < tolerance) {
            return x;
        }
        
        // Approximate derivative
        const h = 0.0001;
        const derivative = (func(x + h) - func(x - h)) / (2 * h);
        
        if (Math.abs(derivative) < tolerance) {
            break; // Avoid division by zero
        }
        
        x = x - error / derivative;
    }
    
    return x;
}

function analyzeCustomFunctionInverse(func) {
    let analysis = '<h4>Analyse de l\'inversibilité:</h4><ul>';
    
    // Test injectivity (one-to-one) at several points
    const testPoints = [-2, -1, 0, 1, 2];
    let isInjective = true;
    
    for (let i = 0; i < testPoints.length; i++) {
        for (let j = i + 1; j < testPoints.length; j++) {
            try {
                const val1 = func(testPoints[i]);
                const val2 = func(testPoints[j]);
                
                if (Math.abs(val1 - val2) < 0.001) {
                    isInjective = false;
                    analysis += `<li><span style="color: red;">Non injective:</span> f(${testPoints[i]}) ≈ f(${testPoints[j]}) ≈ ${val1.toFixed(3)}</li>`;
                }
            } catch (error) {
                analysis += `<li><span style="color: orange;">Erreur d'évaluation</span> aux points ${testPoints[i]} ou ${testPoints[j]}</li>`;
            }
        }
    }
    
    if (isInjective) {
        analysis += `<li><span style="color: green;">Fonction semble injective</span> sur l'intervalle testé</li>`;
        analysis += `<li><span style="color: blue;">Inverse calculée numériquement</span></li>`;
    } else {
        analysis += `<li><span style="color: red;">Fonction non injective</span> - pas d'inverse sur tout le domaine</li>`;
    }
    
    analysis += '</ul><p><em>Note: Cette analyse est approximative sur un intervalle limité.</em></p>';
    
    const resultDiv = document.getElementById('inverse-result');
    if (resultDiv) {
        resultDiv.innerHTML = analysis;
        if (typeof MathJax !== 'undefined') {
            MathJax.typesetPromise([resultDiv]);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('inverse-canvas');
    if (canvas) {
        inverseCanvas = canvas;
        inverseCtx = canvas.getContext('2d');
        updateInverseFunction();
    }
});

// Datos del modelo (generados con Python)
const modelData = {
    intercept: -4.15,
    coef: [0.344, -1.549],
    mse: 3.86,
    r2: 0.96,
    
    // Datos sintéticos para visualización
    peso: Array.from({length: 100}, (_, i) => 45 + Math.random() * 75),
    altura: Array.from({length: 100}, (_, i) => 1.5 + Math.random() * 0.5),
    imc_real: [],
    imc_pred: []
};

// Calcular IMC real y predicho
modelData.imc_real = modelData.peso.map((p, i) => {
    const a = modelData.altura[i];
    return p / (a * a) + (Math.random() * 4 - 2); // Agregar ruido
});

modelData.imc_pred = modelData.peso.map((p, i) => {
    const a = modelData.altura[i];
    return modelData.intercept + modelData.coef[0] * p + modelData.coef[1] * a;
});

// Actualizar los valores en la página
document.getElementById('intercepto').textContent = modelData.intercept.toFixed(2);
document.getElementById('coefPeso').textContent = modelData.coef[0].toFixed(3);
document.getElementById('coefAltura').textContent = modelData.coef[1].toFixed(3);
document.getElementById('mse').textContent = modelData.mse.toFixed(2);
document.getElementById('r2').textContent = modelData.r2.toFixed(2);

// Gráfico 3D
const trace1 = {
    x: modelData.peso,
    y: modelData.altura,
    z: modelData.imc_real,
    mode: 'markers',
    type: 'scatter3d',
    name: 'Datos reales',
    marker: {size: 5, color: 'blue', opacity: 0.8}
};

const trace2 = {
    x: modelData.peso,
    y: modelData.altura,
    z: modelData.imc_pred,
    mode: 'markers',
    type: 'scatter3d',
    name: 'Predicciones',
    marker: {size: 5, color: 'red', opacity: 0.8}
};

Plotly.newPlot('plot3d', [trace1, trace2], {
    title: 'Regresión Lineal para IMC',
    scene: {
        xaxis: {title: 'Peso (kg)'},
        yaxis: {title: 'Altura (m)'},
        zaxis: {title: 'IMC'}
    },
    margin: {l: 0, r: 0, b: 0, t: 30}
});

// Gráfico IMC Real vs Predicho
Plotly.newPlot('plotRealVsPred', [{
    x: modelData.imc_real,
    y: modelData.imc_pred,
    mode: 'markers',
    type: 'scatter',
    name: 'Datos',
    marker: {color: 'rgba(55, 128, 191, 0.7)'}
}, {
    x: [Math.min(...modelData.imc_real), Math.max(...modelData.imc_real)],
    y: [Math.min(...modelData.imc_real), Math.max(...modelData.imc_real)],
    mode: 'lines',
    type: 'scatter',
    name: 'Línea perfecta',
    line: {color: 'red', dash: 'dash'}
}], {
    xaxis: {title: 'IMC Real'},
    yaxis: {title: 'IMC Predicho'},
    title: 'IMC Real vs Predicho'
});

// Gráfico de distribución de errores
const errors = modelData.imc_real.map((real, i) => real - modelData.imc_pred[i]);
Plotly.newPlot('plotErrors', [{
    y: errors,
    type: 'box',
    name: 'Errores',
    boxpoints: 'all',
    jitter: 0.3,
    pointpos: -1.8,
    marker: {color: 'rgba(75, 192, 192, 0.5)'},
    line: {color: 'rgba(75, 192, 192, 1)'}
}], {
    title: 'Distribución de Errores',
    yaxis: {title: 'Diferencia (Real - Predicho)'}
});

// Función para predecir IMC
function predictIMC(peso, altura) {
    return modelData.intercept + modelData.coef[0] * peso + modelData.coef[1] * altura;
}

// Función para categorizar IMC
function getIMCCategory(imc) {
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidad grado I';
    if (imc < 40) return 'Obesidad grado II';
    return 'Obesidad grado III';
}

// Manejar el formulario de predicción
document.getElementById('predictionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const peso = parseFloat(document.getElementById('inputPeso').value);
    const altura = parseFloat(document.getElementById('inputAltura').value);
    
    if (isNaN(peso) || isNaN(altura) || altura <= 0 || peso <= 0) {
        alert('Por favor ingresa valores válidos');
        return;
    }
    
    const imc = predictIMC(peso, altura);
    const categoria = getIMCCategory(imc);
    
    const resultDiv = document.getElementById('predictionResult');
    document.getElementById('resultText').textContent = `IMC calculado: ${imc.toFixed(2)}`;
    document.getElementById('categoryText').textContent = `Categoría: ${categoria}`;
    
    resultDiv.classList.remove('d-none');
});
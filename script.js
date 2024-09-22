function formatInputValue(input) {
    let value = input.value.replace(/\D/g, "");
    value = (value / 100).toFixed(2) + '';
    value = value.replace(".", ",");
    input.value = value;
}

// Função para buscar o valor atual do dólar usando a API AwesomeAPI
function buscarValorDolar() {
    const apiURL = 'https://economia.awesomeapi.com.br/last/USD-BRL';
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const valorDolar = data.USDBRL.bid;
            document.getElementById('valorDolarAtual').textContent = parseFloat(valorDolar).toFixed(2);
        })
        .catch(error => {
            console.error('Erro ao buscar o valor do dólar:', error);
            document.getElementById('valorDolarAtual').textContent = 'Erro';
        });
}

// Função para converter o valor de real para dólar
function converterMoeda() {
    const valorReal = parseFloat(document.getElementById('valorReal').value.replace(",", "."));
    const valorDolar = parseFloat(document.getElementById('valorDolarAtual').textContent);

    if (!isNaN(valorReal) && !isNaN(valorDolar)) {
        const valorConvertido = valorReal / valorDolar;
        document.getElementById('resultado').textContent = `R$ ${valorReal.toFixed(2).replace(".", ",")} = $ ${valorConvertido.toFixed(2)}`;
    } else {
        document.getElementById('resultado').textContent = 'Digite um valor válido.';
    }
}

window.onload = buscarValorDolar;
// Função para formatar o valor em moeda
function formatarMoeda(input) {
    let value = input.value.replace(/\D/g, "");
    value = (value / 100).toFixed(2) + "";
    value = value.replace(".", ",");
    input.value = "R$ " + value;
}

// Função para buscar o valor atual da moeda selecionada usando a API AwesomeAPI
function buscarValorMoeda() {
    const moeda = document.getElementById('moedaSelecionada').value;
    const apiURL = `https://economia.awesomeapi.com.br/last/${moeda}-BRL`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const valorMoeda = data[`${moeda}BRL`].bid;
            document.getElementById('valorMoedaAtual').textContent = parseFloat(valorMoeda).toFixed(2);
        })
        .catch(error => {
            console.error('Erro ao buscar o valor da moeda:', error);
            document.getElementById('valorMoedaAtual').textContent = 'Erro';
        });
}

// Função para converter o valor inserido na moeda selecionada
function converterMoeda() {
    const valorReal = parseFloat(document.getElementById('valorReal').value.replace("R$ ", "").replace(",", "."));
    const valorMoeda = parseFloat(document.getElementById('valorMoedaAtual').textContent);

    const resultadoDiv = document.getElementById('resultado');

    if (!isNaN(valorReal) && !isNaN(valorMoeda)) {
        const valorConvertido = valorReal / valorMoeda;
        resultadoDiv.textContent = `R$ ${valorReal.toFixed(2).replace(".", ",")} = ${valorConvertido.toFixed(2)}`;
        resultadoDiv.style.display = 'block';
    } else {
        resultadoDiv.textContent = 'Digite um valor válido.';
        resultadoDiv.style.display = 'block';
    }
}

// Função para buscar taxas de câmbio
async function atualizarMoedas() {
    try {
        const response = await fetch('https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD');
        const data = await response.json();
        
        const moedas = [
            { nome: 'Dinar Kuwaitiano (KWD)', codigo: 'KWD' },
            { nome: 'Dinar Bahreinita (BHD)', codigo: 'BHD' },
            { nome: 'Rial Omanense (OMR)', codigo: 'OMR' },
            { nome: 'Dinar Jordaniano (JOD)', codigo: 'JOD' },
            { nome: 'Libras Esterlinas (GBP)', codigo: 'GBP' },
            { nome: 'Dólar das Ilhas Cayman (KYD)', codigo: 'KYD' },
            { nome: 'Franco Suíço (CHF)', codigo: 'CHF' },
            { nome: 'Euro (EUR)', codigo: 'EUR' },
            { nome: 'Dólar Americano (USD)', codigo: 'USD' },
            { nome: 'Dólar Canadense (CAD)', codigo: 'CAD' }
        ];

        let html = '';
        moedas.forEach((moeda, index) => {
            const taxa = data.conversion_rates[moeda.codigo];
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${moeda.nome}</td>
                    <td>${taxa ? taxa.toFixed(2) : 'N/A'}</td>
                </tr>
            `;
        });

        const currencyTableBody = document.querySelector('.currency-table tbody');
        currencyTableBody.innerHTML = html;
    } catch (error) {
        console.error('Erro ao buscar as taxas de câmbio:', error);
    }
}

function elementoVisivel(elemento) {
    const rect = elemento.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
}

function aplicarFadeIn() {
    const tabela = document.querySelector('.currency-table');
    if (elementoVisivel(tabela)) {
        tabela.classList.add('fade-in');
    }
}

window.addEventListener('scroll', aplicarFadeIn);
aplicarFadeIn();

function ativarFadeIn(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}

const options = {
    threshold: 0.5
};

const observer = new IntersectionObserver(ativarFadeIn, options);
const tabelaMoedas = document.querySelector('.currency-table');
observer.observe(tabelaMoedas);

window.onload = () => {
    buscarValorMoeda();
    atualizarMoedas();
};

document.getElementById('moedaSelecionada').addEventListener('change', buscarValorMoeda);
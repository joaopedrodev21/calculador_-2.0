const prevEl = document.querySelector('.prev');
const currEl = document.querySelector('.curr');

let prev = ''; // Número que fica antes do operador
let curr = '0'; // Número atual que está sendo digitado
let operator = null; // Operador atual
let justEvaluated = false; // Indica se a última operação foi avaliada

//Função para atualizar o display
function updateDisplay () {
    prevEl.textContent = prev + (operator ? ' ' + operator : '');
    currEl.textContent = curr; 
}

// Função para lidar com números 
function handleNumber (number) {
    if (justEvaluated) {
        curr = number; // Se acabou de avaliar, substitui o número atual
        justEvaluated = false; 
    } else {
        if (curr === '0') {
            curr = number; // Substitui o zero inicial
        } else {
            curr += number; // Concatena o número
        }
    }
    updateDisplay();
}

// Função para lidar com o ponto decimal
function handleDecimal() {
    if (justEvaluated) {
        curr = '0.';
        justEvaluated = false;
    } else if (!curr.includes('.')) {
        curr += '.';
    }
    updateDisplay();
}

// Função para lidar com ações (operadores e comandos)
function handleAction (action) {
    switch(action){
        case 'limpar': // CORRIGIDO: era 'C'
            prev = '';
            curr = '0';
            operator = null;
            justEvaluated = false;
            break;
        case 'apagar': // CORRIGIDO: era 'DEL'
            if (justEvaluated) return; // Não faz nada se acabou de avaliar
            curr = curr.length > 1 ? curr.slice(0, -1) : '0'; // Remove o último dígito
            break;
        case 'decimal': // ADICIONADO: tratamento para ponto decimal
            handleDecimal();
            break;
        case 'porcentagem': // ADICIONADO: tratamento para porcentagem
            if (curr !== '' && curr !== '0') {
                // Se temos um operador, calcula porcentagem do primeiro número
                if (operator && prev) {
                    const num1 = parseFloat(prev);
                    const percentValue = num1 * (parseFloat(curr) / 100);
                    curr = percentValue.toString();
                } else {
                    // Se não tem operador, converte o número atual para decimal
                    curr = (parseFloat(curr) / 100).toString();
                }
            }
            break;
        case 'somar':
        case 'subtrair':
        case 'multiplicar':
        case 'dividir':
            chooseOperator(action);
            break;
        case 'igual': 
            compute();
            break;
    }
    updateDisplay();
}

// Função para escolher o operador
function chooseOperator (action) {
    if (curr === '') return; // Não faz nada se não houver número atual
    const actionToSymbol = {
        'somar': '+',
        'subtrair': '-',
        'multiplicar': '*',
        'dividir': '/'
    };
    const opSymbol = actionToSymbol[action];
    if (prev !== '') {
        compute(); // Avalia a expressão atual antes de escolher um novo operador
    }
    operator = opSymbol;
    prev = curr; // Move o número atual para o anterior
    curr = ''; // Reseta o número atual para o próximo input
    justEvaluated = false;
    updateDisplay();
}

// Função para realizar o calculo 
function compute () {
    if (prev === '' || curr === '' || operator === null) return; // Verifica se há números e operador
    const num1 = parseFloat(prev);
    const num2 = parseFloat(curr);
    if (isNaN(num1) || isNaN(num2)) return; // Verifica se os números são válidos
    let result;
    switch(operator){
        case '+':
            result = num1 + num2;
            break;
        case '-': 
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;        
        case '/':
            if(num2 === 0){
                curr= 'Erro'
                prev= '';
                operator = null
                justEvaluated = true;
                updateDisplay();
                return;
            }
            result = num1 / num2;
            break;
        default:
            return; // Operador desconhecido
    }
    curr = parseFloat(result.toFixed(10)).toString(); 
    prev = '';
    operator = null;
    justEvaluated = true; // Marca que acabou de avaliar
    updateDisplay();
}

function handleKeyboardInput (e){
    const key = e.key
    
    if (key >= '0' && key <= '9'){
        handleNumber(key);
        return;
    }
    switch(key) {
        case '+':
          handleAction('somar'); // CORRIGIDO: usa handleAction em vez de chooseOperator
          break;
        case '-':
          handleAction('subtrair');
          break;
        case '*':
          handleAction('multiplicar');
          break;
        case '/':
          handleAction('dividir');
          break;
        case '.':
          handleAction('decimal'); // CORRIGIDO: usa handleAction
          break;
        case 'Enter':
        case '=':
          handleAction('igual'); // CORRIGIDO: usa handleAction
          break;
        case 'Escape':
          handleAction('limpar');
          break;
        case 'Backspace':
          handleAction('apagar');
          break;
        case '%':
          handleAction('porcentagem');
          break;
      }
}

// Captura os clicks nos botões
document.querySelector('.buttons').addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return; // Se não for um botão, sai da função
    if (button.hasAttribute('data-number')){
        const number = button.textContent;
        handleNumber(number);
    }
    else if (button.hasAttribute('data-action')){
        const action = button.getAttribute('data-action');
        handleAction(action);
    } 
})

document.addEventListener('keydown', handleKeyboardInput);
updateDisplay();
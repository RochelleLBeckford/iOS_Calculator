let firstNumber = '0';
let secondNumber = '0';
let result = '0';
let lastResult;
let currentOperator;
let evaluation = [];

const screen = document.querySelector('.screen');
const keyboard = document.querySelector('.keyboard');

keyboard.addEventListener('click', function(e) {
    e.stopImmediatePropagation();
    onButtonPress(e);
})

function onButtonPress(e) {
    switch (e.target.getAttribute('data-button-type')) {
        case 'digit':
            assignNumber(e)
            break;

        case 'operator':
            assignOperator(e)
            break;
    }
    render(e);
}

function assignNumber(e) {
    // & First number
    if (evaluation.length <= 1) {
        firstNumber = (firstNumber == '0') ? e.target.getAttribute('data-value')
                    : (lastResult) ? e.target.getAttribute('data-value')
                    : firstNumber + e.target.getAttribute('data-value');

        if (evaluation.length == 1) evaluation.shift();
        evaluation.push(firstNumber);
        result = firstNumber;
        return;
    }

    // & Second number
    if (evaluation.length >= 2) {
        secondNumber = (secondNumber == '0') ? e.target.getAttribute('data-value')
                    : secondNumber + e.target.getAttribute('data-value');

        if (evaluation.length == 3) evaluation.pop();
        evaluation.push(secondNumber);
        result = secondNumber;

    }
}

function assignOperator(e) {
    currentOperator = e.target.getAttribute('data-value');

    if (
        currentOperator == '%' ||
        currentOperator == '+/-' ||
        currentOperator == 'clear' ||
        currentOperator == '='
    ) {
        return operate();
    }

    if (evaluation == 3) operate();

    if (evaluation.length == 2) evaluation.pop();
    evaluation.splice(1, 1, currentOperator);
}

// & add functionality to the operators
function operate() {
    /*
    & this will return the value as a percentage once the '%' is clicked [with 2 decimal places -> .00]
        ~ will return an error if anything that is not a digit is clicked and then the % operator 
            -> ex. 7 - % -> return Error 
            -> or * % -> return Error 
            -> or . % -> return Error
    */
    if (currentOperator == '%' && evaluation.length) {
        let number = parseInt(evaluation[evaluation.length - 1])
        result = (number / 100).toString();
        result = (result == 'NaN') ? 'Error' : result;
        evaluation.splice(evaluation.length - 1, 1, result);
        return;
    }

    /*
    & this will return the value as a negative or positive number once the '+/-' is clicked 
        ~ for ex. -> 87 -> click '+/-' = -87
        -> click again will change to a 87
    */
    if (currentOperator == '+/-' && evaluation.length) {
        result = (evaluation[evaluation.length - 1] * - 1).toString();
        result = (result == 'NaN') ? 'Error' : result;
        evaluation.splice(evaluation.length - 1, 1, result);
        return;
    }

    // & this will clear any value on the screen and returning it to 0
    if (currentOperator == 'clear') {
        firstNumber = '0';
        evaluation = [];
        secondNumber = '0';
        result = '0';
        lastResult = '';
        return;
    }

    // & Right last column of operators 
    if (evaluation.length == 3) {
        result = (eval(evaluation.join().replace(/,/g, ''))).toString();
        firstNumber = result;
        secondNumber = '0';
        evaluation = [firstNumber];
        lastResult = result;
    }
}


function render(e) {
    let newOperatorButton = e.target;
    let lastOperatorButton = document.querySelector('.selected_operator');

    lastOperatorButton ? lastOperatorButton.classList.remove('selected_operator') : null;
    newOperatorButton ? newOperatorButton.classList.add('selected_operator') : null;

    // & Change font size
    switch (result.toString().length) {
        case 7:
            screen.style.fontSize = '4.7rem';
            break;
        case 9:
            screen.style.fontSize = '4.1rem';
            break;
        case 9:
            screen.style.fontSize = '3.5rem';
            break;
    }

    if (result.toString().length > 9) {
        screen.textContent = parseFloat(result).toPrecision(3);
    } else {
        screen.textContent = result;
    }
}
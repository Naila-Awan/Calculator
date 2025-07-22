const submitBtn = document.querySelector('#submit-btn');
const btns = document.querySelectorAll('.btn');
const inputField = document.querySelector('#text-input');
const answerField = document.querySelector('.answer');

//Variables
const addVarBtn = document.querySelector('#add-variable-btn');
const varList = document.querySelector('.variables-list');
const varName = document.querySelector('#var-name');
const varVal = document.querySelector('#var-val');
const varError = document.querySelector('#var-error');

//History
const historyList = document.querySelector('.history-list');
const histBtn = document.querySelector('#hist-btn');

//History array
let history = JSON.parse(localStorage.getItem('historyList')) || [];

const updateHistory = () => {
    historyList.innerHTML = '';
    history.forEach((val, index) => {
        const liItem = document.createElement('li');
        liItem.classList.add('hist-li');
        liItem.textContent = `${val.expression} = ${val.answer}`;

        liItem.addEventListener('click', () => {
            inputField.value = val.expression;
            answerField.innerText = val.answer;
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', () => {
            history.splice(index, 1);
            localStorage.setItem('historyList', JSON.stringify(history));
            updateHistory();
        });

        liItem.appendChild(deleteButton);
        historyList.appendChild(liItem);
    });
}
updateHistory();

//variable object
let variableObject = JSON.parse(localStorage.getItem('varList')) || {
    pi: 3.1415,
    e: 2.7182,
}

const createVariable = () => {
    varList.innerHTML = '';
    for (key in variableObject) {
        const liItem = document.createElement('li');
        liItem.classList.add('var-li');
        liItem.textContent = `${key}: ${variableObject[key]}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', () => {
            liItem.remove();
            delete variableObject[key];
            localStorage.setItem('varList', JSON.stringify(variableObject));
        });

        if (key != 'pi' && key != 'e') {
            liItem.appendChild(deleteButton);
        }
        varList.appendChild(liItem);
    }
}
createVariable();

// Utility function to check if string contains any digit
const containsDigit = (string) => /\d/.test(string);

//Add variables
addVarBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!varName.value || !varVal.value) {
        varError.textContent = 'Error! All fields are required.';
        setTimeout(() => { varError.textContent = ''; }, 2500);
        return;
    }
    if (variableObject[varName.value]) {
        varError.textContent = 'Error! Variable already exists.';
        setTimeout(() => { varError.textContent = ''; }, 2500);
        return;
    }
    if (containsDigit(varName.value)) {
        varError.textContent = 'Error! Variable name cannot have a number.';
        setTimeout(() => { varError.textContent = ''; }, 2500);
        return;
    }
    variableObject[varName.value] = varVal.value;
    localStorage.setItem('varList', JSON.stringify(variableObject))
    createVariable();
})

//Function to calculate and display answer
const evaluateExpression = (e) => {
    try {
        e.preventDefault();
        let expression = inputField.value.trim();
        const simplified = math.simplify(math.parse(expression));
        let answer = simplified.evaluate(variableObject).toFixed(4);
        answerField.innerText = answer;
        answerField.classList.remove('error');

        //save in history
        history.push({ expression, answer });
        localStorage.setItem('historyList', JSON.stringify(history));
        updateHistory();
    }
    catch (e) {
        answerField.innerText = `${e}`;
        answerField.classList.add('error');
        setTimeout(() => {
            answerField.innerText = ``;
            answerField.classList.remove('error');
        }, 2500);
    }
}

//Add button to text input
btns.forEach((btn) => {

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn.value === 'AC') {
            inputField.value = '';
            answerField.innerText = '';
        }
        else if (btn.value === 'DEL') {
            inputField.value = inputField.value.slice(0, -1);
        }
        else {
            inputField.value += btn.value;
        }
    })
});

submitBtn.addEventListener('click', (e) => {
    evaluateExpression(e);
});

addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        evaluateExpression(e);
    }
});
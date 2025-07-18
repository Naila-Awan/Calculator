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
let history = [];

const updateHistory = () => {
    historyList.innerHTML = '';
    history.map((val, index) => {
        const liItem = document.createElement('li');
        liItem.classList.add('hist-li');
        liItem.textContent = `${val.expression} = ${val.answer}`;

        liItem.addEventListener('click', ()=>{
            inputField.value = val.expression;
            answerField.innerText = val.answer;
        })

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', () => {
            liItem.remove();
            history.splice(index, 1);
            console.log(history);
        });

        liItem.appendChild(deleteButton);
        historyList.appendChild(liItem);

    });
}

//variable object
let variableObject = {
    pi: 3.1415,
    e: 2.7182,
}

const createVariable = () => {
    varList.innerHTML = '';
    for (key in variableObject) {
        const liItem = document.createElement('li');
        liItem.textContent = `${key}: ${variableObject[key]}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', () => {
            liItem.remove();
            delete variableObject[key];
        });

        if (key != 'pi' && key != 'e') {
            liItem.appendChild(deleteButton);
        }
        varList.appendChild(liItem);
    }
}
createVariable();

//Add variables
addVarBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (variableObject[varName.value]) {
        varError.textContent = 'Error! Variable already exists.';
        setTimeout(() => {
            varError.textContent = '';
        }, 2500);
    }
    else {
        variableObject[varName.value] = varVal.value;
    }
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

        //save in history
        history.push({ expression, answer });
        updateHistory();
    }
    catch (e) {
        answerField.innerText = `Error. ${e}`;
    }
}

//Add button to text input
btns.forEach((btn) => {

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn.value === 'AC') {
            inputField.value = '';
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
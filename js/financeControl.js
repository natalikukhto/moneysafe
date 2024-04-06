import { convertStringNumber } from "./helpers.js";
import { getData, postData } from "./service.js";
import { animationNumber } from "./helpers.js";


const financeForm = document.querySelector('.finance__form');
const financeAmount = document.querySelector('.finance__amount');

let amount = 0;
financeAmount.textContent = amount;

const addNewOperation = async (event) => {

    event.preventDefault();

    const typeOperation = event.submitter.dataset.typeOperation;

    const financeFormDate = Object.fromEntries(new FormData(financeForm));
    financeFormDate.type = typeOperation;


    const newOperation = await postData('/finance', financeFormDate);



    const changeAmount = Math.abs(convertStringNumber(newOperation.amount));

    if (typeOperation === 'income') {
        amount += changeAmount;
    }
    if (typeOperation === 'expenses') {
        amount -= changeAmount;
    }

    //financeAmount.textContent = `${amount.toLocaleString()} ₽`;
    animationNumber(financeAmount, amount);
    financeForm.reset();
};


export const financeControl = async () => {

    const operations = await getData('/finance');
    amount = operations.reduce((acc, item) => {
        if (item.type === 'income') {
            acc += convertStringNumber(item.amount);
        }
        if (item.type === 'expenses') {
            acc -= convertStringNumber(item.amount);
        }
        return acc;
    }, 0);

    animationNumber(financeAmount, amount);



    financeForm.addEventListener('submit', addNewOperation)
};


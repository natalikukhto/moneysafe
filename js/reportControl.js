import { financeControl } from "./financeControl.js";
import { reformatDate } from "./helpers.js";
import { delData, getData } from "./service.js";
import { storage } from "./storage.js";
import { clearChart, generateChart } from "./generateChart.js";



const typesOperation = {
    income: 'доход',
    expenses: 'расход',
}

let actualData = [];

const financeReport = document.querySelector('.finance__report');
const report = document.querySelector('.report');
const reportClose = document.querySelector('.report__close');
const reportOperationList = document.querySelector('.report__operation__list')
const reportTable = document.querySelector('.report__table');
const reportDates = document.querySelector('.report__dates');
const generateChartButton = document.querySelector('#generateChartButton');

const closeReport = ({ target }) => {
    if (
        target.closest('.report__close') ||
        (!target.closest('.report') && target !== financeReport)) {

        gsap.to(report, {
            opacity: 0,
            scale: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete() {
                report.style.visibility = 'hidden';
            }
        })


        document.removeEventListener('click', closeReport);
    }
}

const openReport = () => {
    report.style.visibility = 'visible';

    gsap.to(report, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
    })

    document.addEventListener('click', closeReport);
}




const renderReport = (data) => {
    reportOperationList.textContent = '';

    const reportRows = data.map(({ category, amount, description, date, type, id }) => {
        const reportRow = document.createElement('tr');
        reportRow.classList.add('report__row');

        reportRow.innerHTML = `
        <td class="report__cell">${category}</td>
        <td class="report__cell" style = 'text-align:right'>${amount.toLocaleString()}&nbsp;₽</td>
        <td class="report__cell">${description}</td>
        <td class="report__cell">${reformatDate(date)}</td>
        <td class="report__cell">${typesOperation[type]}</td>
        <td class="report__action-cell">
        <button class="report__button report__button_table" data-del=${id}>&#10006;</button>
        </td>
        `;
        return reportRow;
    });
    reportOperationList.append(...reportRows);
};




export const reportControl = () => {

    //sort
    reportTable.addEventListener('click', ({ target }) => {
        const targetSort = target.closest('[data-sort]');
        if (targetSort) {
            const sortField = targetSort.dataset.sort;
            renderReport([...storage.data].sort((a, b) => {
                if (targetSort.dataset.dir === 'up') {
                    [a, b] = [b, a];
                }
                if (sortField === 'amount') {
                    return parseFloat(a[sortField]) < parseFloat(b[sortField]) ? -1 : 1
                }
                return a[sortField] < b[sortField] ? -1 : 1;
            }
            ),
            );
            if (targetSort.dataset.dir === 'up') {
                targetSort.dataset.dir = 'down';
            } else {
                targetSort.dataset.dir = 'up';
            }
        }
        const targetDel = target.closest('[data-del]');
        if (targetDel) {
            console.log(target.dataset.del);
        }
    }),

        //delete
        reportOperationList.addEventListener('click', async ({ target }) => {
            const buttonDel = target.closest('.report__button_table');
            if (buttonDel) {
                await delData(`/finance/${buttonDel.dataset.del}`);
                const reportRow = buttonDel.closest('.report__row');
                reportRow.remove();
                financeControl();
                clearChart();
            }
        }),

        financeReport.addEventListener('click', async () => {
            const textContent = financeReport.textContent;
            financeReport.textContent = 'Загрузка';
            financeReport.disabled = true;
            actualData = await getData('/finance');
            storage.data = actualData;
            financeReport.textContent = textContent;
            financeReport.disabled = false;
            renderReport(actualData);
            openReport();
        }),

        reportDates.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(reportDates));
            const searchParams = new URLSearchParams();
            if (formData.startDate) {
                searchParams.append('startDate', formData.startDate);
            }
            if (formData.endDate) {
                searchParams.append('endDate', formData.endDate);
            }
            const queryString = searchParams.toString();
            const url = queryString ? `/finance?${queryString}` : '/finance'
            actualData = await getData(url);
            renderReport(actualData);
            clearChart();
        })
}

generateChartButton.addEventListener('click', () => {
    generateChart(actualData);
})












/* откыть отчет, закрыть, закрыть нажимая мимо окна, но здесь событие продолжает висеть
financeReport.addEventListener('click', () => {
    let changeReport = report.classList.add('report__open');
})

reportClose.addEventListener('click', () => {
    report.classList.remove('report__open');
})
let n = 0;
document.addEventListener('mouseup', (e) => {
    console.log(n++);
    if (!report.contains(e.target)) {
        report.classList.remove('report__open');
        document.removeEventListener('mouseup', re);
    }
}
)
*/
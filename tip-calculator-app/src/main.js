import "./style.scss";
import { getTipAmountPerPerson, getTotalPerPerson } from "./util";

// DOM Elements
const resetButtonEl = document.getElementById("resetButton");
const formEl = document.getElementById("form");
const customTipInputEl = document.getElementById("customTip");
const totalPerPersonEl = document.getElementById("totalPerPerson");
const tipAmountPerPersonEl = document.getElementById("tipAmountPerPerson");

/**
 * updates the tip amount and total amount per person and renders to the DOM
 * @param {number} bill
 * @param {number} tipPercent
 * @param {number} people
 */
function updateSum(bill, tipPercent, people) {
    const tipAmount = getTipAmountPerPerson(bill, tipPercent, people);
    const totalAmount = getTotalPerPerson(bill, tipPercent, people);

    tipAmountPerPersonEl.textContent = tipAmount.toFixed(2);
    totalPerPersonEl.textContent = totalAmount.toFixed(2);
}

function handleChange() {
    const bill = +formEl.bill.value || 0;
    const tipPercent = formEl.tip.value === "" ? +formEl.custom.value : +formEl.tip.value;
    const people = +formEl.people.value || 1;

    updateSum(bill, tipPercent, people);
}

function handleReset() {
    formEl.elements.bill.value = 0;
    formEl.elements.people.value = 1;
    formEl.elements.custom.value = null;
    updateSum(0, 0, 1);
}

function handleFocusCustomTip() {
    document.querySelectorAll(".tip-selection input[type=radio]").forEach((el) => {
        el.checked = false;
    });
    formEl.dispatchEvent(new Event("change"));
}

(function main() {
    resetButtonEl.addEventListener("click", handleReset);
    customTipInputEl.addEventListener("focus", handleFocusCustomTip);
    customTipInputEl.addEventListener("change", handleChange);
    formEl.addEventListener("change", handleChange);
})();

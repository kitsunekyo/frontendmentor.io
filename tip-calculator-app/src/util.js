/**
 * @param {number} bill
 * @param {number} tipPercent
 * @param {number} numberOfPeople
 * @returns {number} tip amount per person
 */
export function getTipAmountPerPerson(bill, tipPercent, numberOfPeople) {
    if (numberOfPeople <= 0) {
        throw new Error("numberOfPeople must be >0");
    }
    const totalTip = bill * (tipPercent / 100);
    return totalTip / numberOfPeople;
}

/**
 * @param {number} bill
 * @param {number} tipPercent
 * @param {number} numberOfPeople
 * @returns {number} total cost per person
 */
export function getTotalPerPerson(bill, tipPercent, numberOfPeople) {
    if (numberOfPeople <= 0) {
        throw new Error("numberOfPeople must be >0");
    }
    const totalTip = (tipPercent / 100) * bill;
    return (totalTip + bill) / numberOfPeople;
}

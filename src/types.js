/** @typedef {'single' | 'duplex' | 'triplex'} PropertyOption */

/**
 * @typedef {Object} FinancingInput
 * @property {number} purchasePrice
 * @property {number} downPaymentPercent
 * @property {number} annualInterestRate
 * @property {number} amortizationYears
 * @property {number} horizonMonths
 */

/**
 * @typedef {Object} OperatingInput
 * @property {number} annualPropertyTax
 * @property {number} annualInsurance
 * @property {number} monthlyMaintenance
 * @property {number} monthlyRentPerUnit
 */

/**
 * @typedef {Object} ComparisonInputs
 * @property {FinancingInput} financing
 * @property {OperatingInput} operating
 */

/**
 * @typedef {Object} OptionResult
 * @property {PropertyOption} option
 * @property {number} rentalUnits
 * @property {number} monthlyMortgage
 * @property {number} monthlyHousingCost
 * @property {number} monthlyRentIncome
 * @property {number} monthlyNetOutOfPocket
 * @property {number} cumulativeHousingCost
 * @property {number} cumulativeRentCollected
 * @property {number} cumulativeNetCost
 */

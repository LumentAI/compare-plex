/** @import { ComparisonInputs, OptionResult, PropertyOption } from './types' */

/** @type {Record<PropertyOption, number>} */
export const OPTION_RENTAL_UNITS = {
  single: 0,
  duplex: 1,
  triplex: 2,
}

/**
 * @param {number} principal
 * @param {number} annualRatePercent
 * @param {number} years
 */
export function calculateMonthlyMortgage(principal, annualRatePercent, years) {
  const monthlyRate = annualRatePercent / 100 / 12
  const numberOfPayments = years * 12

  if (numberOfPayments <= 0 || principal <= 0) return 0
  if (monthlyRate === 0) return principal / numberOfPayments

  const factor = (1 + monthlyRate) ** numberOfPayments
  return principal * ((monthlyRate * factor) / (factor - 1))
}

/**
 * @param {ComparisonInputs} inputs
 * @returns {OptionResult[]}
 */
export function compareOptions(inputs) {
  const { financing, operating } = inputs
  const {
    purchasePrice,
    downPaymentPercent,
    annualInterestRate,
    amortizationYears,
    horizonMonths,
  } = financing

  const downPaymentAmount = purchasePrice * (downPaymentPercent / 100)
  const principal = Math.max(0, purchasePrice - downPaymentAmount)
  const monthlyMortgage = calculateMonthlyMortgage(principal, annualInterestRate, amortizationYears)

  const monthlyRecurring =
    monthlyMortgage +
    operating.monthlyMaintenance +
    operating.annualPropertyTax / 12 +
    operating.annualInsurance / 12

  /** @type {PropertyOption[]} */
  const options = ['single', 'duplex', 'triplex']

  return options.map((option) => {
    const rentalUnits = OPTION_RENTAL_UNITS[option]
    const monthlyRentIncome = rentalUnits * operating.monthlyRentPerUnit
    const monthlyNetOutOfPocket = monthlyRecurring - monthlyRentIncome

    const cumulativeHousingCost = monthlyRecurring * horizonMonths
    const cumulativeRentCollected = monthlyRentIncome * horizonMonths
    const cumulativeNetCost = monthlyNetOutOfPocket * horizonMonths

    return {
      option,
      rentalUnits,
      monthlyMortgage,
      monthlyHousingCost: monthlyRecurring,
      monthlyRentIncome,
      monthlyNetOutOfPocket,
      cumulativeHousingCost,
      cumulativeRentCollected,
      cumulativeNetCost,
    }
  })
}

import { describe, expect, it } from 'vitest'
import { calculateMonthlyMortgage, compareOptions } from './calculator'

describe('calculateMonthlyMortgage', () => {
  it('calculates known mortgage payment', () => {
    const payment = calculateMonthlyMortgage(500000, 5, 25)
    expect(payment).toBeCloseTo(2922.95, 2)
  })

  it('returns linear payment when rate is zero', () => {
    const payment = calculateMonthlyMortgage(120000, 0, 10)
    expect(payment).toBeCloseTo(1000, 2)
  })
})

describe('compareOptions', () => {
  const base = {
    financing: {
      purchasePrice: 700000,
      downPaymentPercent: 20,
      annualInterestRate: 6,
      amortizationYears: 25,
      horizonMonths: 12,
    },
    operating: {
      annualPropertyTax: 4800,
      annualInsurance: 1200,
      monthlyMaintenance: 300,
      monthlyRentPerUnit: 1500,
    },
  }

  it('applies rental offsets by property type', () => {
    const results = compareOptions(base)
    const single = results.find((x) => x.option === 'single')
    const duplex = results.find((x) => x.option === 'duplex')
    const triplex = results.find((x) => x.option === 'triplex')

    expect(single.monthlyRentIncome).toBe(0)
    expect(duplex.monthlyRentIncome).toBe(1500)
    expect(triplex.monthlyRentIncome).toBe(3000)
  })

  it('computes cumulative totals for selected horizon', () => {
    const results = compareOptions(base)
    const duplex = results.find((x) => x.option === 'duplex')

    expect(duplex.cumulativeRentCollected).toBeCloseTo(18000)
    expect(duplex.cumulativeNetCost).toBeCloseTo(duplex.monthlyNetOutOfPocket * 12, 2)
  })

  it('handles edge cases (high rate, zero maintenance, short horizon)', () => {
    const results = compareOptions({
      financing: {
        ...base.financing,
        annualInterestRate: 14,
        horizonMonths: 1,
      },
      operating: {
        ...base.operating,
        monthlyMaintenance: 0,
        monthlyRentPerUnit: 0,
      },
    })

    expect(results).toHaveLength(3)
    results.forEach((result) => {
      expect(result.cumulativeNetCost).toBeCloseTo(result.monthlyNetOutOfPocket, 2)
    })
  })
})

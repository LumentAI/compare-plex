import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import './i18n'

describe('App', () => {
  it('updates comparison when input changes', async () => {
    const user = userEvent.setup()
    render(<App />)

    const rentInput = screen.getByLabelText('Rent / extra unit / month (CAD)')
    const firstNetValue = screen.getByTestId('duplex-monthly-net').textContent

    await user.clear(rentInput)
    await user.type(rentInput, '2200')

    const nextNetValue = screen.getByTestId('duplex-monthly-net').textContent
    expect(nextNetValue).not.toEqual(firstNetValue)
  })

  it('switches language without resetting inputs', async () => {
    const user = userEvent.setup()
    render(<App />)

    const priceInput = screen.getByLabelText('Purchase Price (CAD)')
    await user.clear(priceInput)
    await user.type(priceInput, '900000')

    const languageSelect = screen.getByLabelText('Language')
    await user.selectOptions(languageSelect, 'fr')

    expect(screen.getByText('Comparateur Maison vs Plex')).toBeInTheDocument()
    expect(screen.getByDisplayValue('900000')).toBeInTheDocument()
    expect(screen.getByTestId('best-value-amount')).toBeInTheDocument()
  })

  it('applies presets for single and triplex', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId('preset-single'))
    expect(screen.getByDisplayValue('700000')).toBeInTheDocument()
    expect(screen.getByDisplayValue('0')).toBeInTheDocument()

    await user.click(screen.getByTestId('preset-triplex'))
    expect(screen.getByDisplayValue('980000')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1900')).toBeInTheDocument()
  })
})

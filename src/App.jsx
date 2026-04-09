import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { compareOptions } from './calculator'

function formatCAD(value) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)
}

function NumberField({ label, value, onChange, min = 0, step = 1 }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>
      <input
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition hover:border-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}

function CollapsibleSection({ title, icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 transition text-left"
      >
        <span className="flex items-center gap-2 font-semibold text-slate-800">
          <span className="text-lg">{icon}</span>
          {title}
        </span>
        <span className={`text-slate-500 transition ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && <div className="px-4 py-3 bg-slate-50 space-y-3">{children}</div>}
    </div>
  )
}

function MetricCard({ label, value, subtext, highlight = false }) {
  return (
    <div className={`rounded-lg p-4 ${highlight ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300' : 'bg-white border border-slate-200'}`}>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-600">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${highlight ? 'text-emerald-700' : 'text-slate-900'}`}>{value}</p>
      {subtext && <p className="text-xs text-slate-600 mt-1">{subtext}</p>}
    </div>
  )
}

export default function App() {
  const { t, i18n } = useTranslation()
  const presets = {
    single: {
      financing: {
        purchasePrice: 700000,
        downPaymentPercent: 20,
        annualInterestRate: 5.0,
        amortizationYears: 25,
        horizonMonths: 60,
      },
      operating: {
        annualPropertyTax: 4600,
        annualInsurance: 1600,
        monthlyMaintenance: 300,
        monthlyRentPerUnit: 0,
      },
    },
    duplex: {
      financing: {
        purchasePrice: 850000,
        downPaymentPercent: 20,
        annualInterestRate: 5.2,
        amortizationYears: 25,
        horizonMonths: 60,
      },
      operating: {
        annualPropertyTax: 5200,
        annualInsurance: 1900,
        monthlyMaintenance: 350,
        monthlyRentPerUnit: 1700,
      },
    },
    triplex: {
      financing: {
        purchasePrice: 980000,
        downPaymentPercent: 20,
        annualInterestRate: 5.2,
        amortizationYears: 25,
        horizonMonths: 60,
      },
      operating: {
        annualPropertyTax: 6200,
        annualInsurance: 2300,
        monthlyMaintenance: 420,
        monthlyRentPerUnit: 1900,
      },
    },
  }

  const [financing, setFinancing] = useState({
    purchasePrice: 850000,
    downPaymentPercent: 20,
    annualInterestRate: 5.2,
    amortizationYears: 25,
    horizonMonths: 60,
  })

  const [operating, setOperating] = useState({
    annualPropertyTax: 5200,
    annualInsurance: 1900,
    monthlyMaintenance: 350,
    monthlyRentPerUnit: 1700,
  })

  function applyPreset(presetKey) {
    const preset = presets[presetKey]
    if (!preset) return
    setFinancing(preset.financing)
    setOperating(preset.operating)
  }

  const isHorizonValid = financing.horizonMonths > 0

  const results = useMemo(() => {
    if (!isHorizonValid) return []
    return compareOptions({ financing, operating })
  }, [financing, operating, isHorizonValid])

  const bestOption = useMemo(() => {
    if (!results.length) return null
    return [...results].sort((a, b) => a.cumulativeNetCost - b.cumulativeNetCost)[0]
  }, [results])

  const chartData = results.map((item) => ({
    option: t(item.option),
    monthlyNetOutOfPocket: Math.round(item.monthlyNetOutOfPocket),
    cumulativeNetCost: Math.round(item.cumulativeNetCost),
  }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t('appTitle')}</h1>
              <p className="text-sm text-slate-600">{t('appSubtitle')}</p>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              {t('language')}
              <select
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
                value={i18n.language}
                onChange={(event) => i18n.changeLanguage(event.target.value)}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </label>
          </div>
        </div>
      </header>

      {/* Scenario Selector */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-700">{t('presets')}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="preset-single"
              className="rounded-lg border-2 border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 transition"
              onClick={() => applyPreset('single')}
            >
              {t('presetSingle')}
            </button>
            <button
              type="button"
              data-testid="preset-duplex"
              className="rounded-lg border-2 border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 transition"
              onClick={() => applyPreset('duplex')}
            >
              {t('presetDuplex')}
            </button>
            <button
              type="button"
              data-testid="preset-triplex"
              className="rounded-lg border-2 border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 transition"
              onClick={() => applyPreset('triplex')}
            >
              {t('presetTriplex')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Sidebar - Parameters */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <CollapsibleSection
                title={t('section1')}
                icon="🏦"
                defaultOpen={true}
              >
                <div className="grid grid-cols-2 gap-3">
                  <NumberField
                    label={t('purchasePrice')}
                    value={financing.purchasePrice}
                    onChange={(value) => setFinancing((prev) => ({ ...prev, purchasePrice: value }))}
                    step={1000}
                  />
                  <NumberField
                    label={t('downPaymentPercent')}
                    value={financing.downPaymentPercent}
                    onChange={(value) => setFinancing((prev) => ({ ...prev, downPaymentPercent: value }))}
                    step={0.5}
                  />
                  <NumberField
                    label={t('annualInterestRate')}
                    value={financing.annualInterestRate}
                    onChange={(value) => setFinancing((prev) => ({ ...prev, annualInterestRate: value }))}
                    step={0.1}
                  />
                  <NumberField
                    label={t('amortizationYears')}
                    value={financing.amortizationYears}
                    onChange={(value) => setFinancing((prev) => ({ ...prev, amortizationYears: value }))}
                  />
                  <NumberField
                    label={t('horizonMonths')}
                    value={financing.horizonMonths}
                    onChange={(value) => setFinancing((prev) => ({ ...prev, horizonMonths: value }))}
                  />
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                title={t('section2')}
                icon="💰"
                defaultOpen={false}
              >
                <div className="grid grid-cols-1 gap-3">
                  <NumberField
                    label={t('annualPropertyTax')}
                    value={operating.annualPropertyTax}
                    onChange={(value) => setOperating((prev) => ({ ...prev, annualPropertyTax: value }))}
                    step={100}
                  />
                  <NumberField
                    label={t('annualInsurance')}
                    value={operating.annualInsurance}
                    onChange={(value) => setOperating((prev) => ({ ...prev, annualInsurance: value }))}
                    step={100}
                  />
                  <NumberField
                    label={t('monthlyMaintenance')}
                    value={operating.monthlyMaintenance}
                    onChange={(value) => setOperating((prev) => ({ ...prev, monthlyMaintenance: value }))}
                    step={50}
                  />
                  <NumberField
                    label={t('monthlyRentPerUnit')}
                    value={operating.monthlyRentPerUnit}
                    onChange={(value) => setOperating((prev) => ({ ...prev, monthlyRentPerUnit: value }))}
                    step={50}
                  />
                </div>
              </CollapsibleSection>
            </div>
          </div>

          {/* Right Side - Results */}
          <div className="lg:col-span-2">
            {!isHorizonValid ? (
              <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4">
                <p className="font-semibold text-red-800">{t('validationHorizon')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Top Metric Cards */}
                {bestOption && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <MetricCard
                      label={t('bestValue')}
                      value={t(bestOption.option)}
                      subtext={`${bestOption.rentalUnits} ${t('rentalUnits').toLowerCase()}`}
                      highlight={true}
                    />
                    <MetricCard
                      label={t('monthlyNetOutOfPocket')}
                      value={formatCAD(bestOption.monthlyNetOutOfPocket)}
                    />
                    <MetricCard
                      label={t('cumulativeNetCost')}
                      value={formatCAD(bestOption.cumulativeNetCost)}
                    />
                  </div>
                )}

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('affordabilityChart')}</h3>
                    <div className="h-64 rounded bg-slate-50">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="option" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="monthlyNetOutOfPocket" fill="#0284c7" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('cumulativeChart')}</h3>
                    <div className="h-64 rounded bg-slate-50">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="option" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="cumulativeNetCost" fill="#0f766e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Results Table */}
                <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="px-4 py-3 text-left font-semibold text-slate-900">{t('option')}</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-900">{t('rentalUnits')}</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-900">{t('monthlyMortgage')}</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-900">{t('monthlyNetOutOfPocket')}</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-900">{t('cumulativeRent')}</th>
                          <th className="px-4 py-3 text-left font-semibold text-emerald-700">{t('cumulativeNetCost')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((result, idx) => (
                          <tr key={result.option} className={idx % 2 === 0 ? 'border-b border-slate-100' : 'border-b border-slate-100 bg-slate-50'}>
                            <td className="px-4 py-3 font-semibold text-slate-900">{t(result.option)}</td>
                            <td className="px-4 py-3 text-slate-700">{result.rentalUnits}</td>
                            <td className="px-4 py-3 text-slate-700">{formatCAD(result.monthlyMortgage)}</td>
                            <td className="px-4 py-3 text-slate-700" data-testid={`${result.option}-monthly-net`}>
                              {formatCAD(result.monthlyNetOutOfPocket)}
                            </td>
                            <td className="px-4 py-3 text-slate-700">{formatCAD(result.cumulativeRentCollected)}</td>
                            <td className="px-4 py-3 font-semibold text-emerald-700">{formatCAD(result.cumulativeNetCost)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

import { useState, useMemo, useEffect } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  fr: {
    headerTitle: 'Comparateur Immobilier Québec',
    headerSub: 'Maison · Duplex · Triplex — Capacité d\'emprunt & mise de fonds en un coup d\'œil',
    madeBy: 'made by',
    params: '📋 Vos paramètres',
    salary1Label: 'Salaire — Personne 1',
    salary1Hint: 'Salaire brut annuel',
    salary2Label: 'Salaire — Personne 2',
    salary2Hint: 'Laisser à 0 $ si achat seul·e',
    combinedLabel: 'Revenu combiné',
    downLabel: 'Mise de fonds disponible',
    downHint: 'Même montant comparé pour les 3 options',
    downSCHL: '⚠ Prime SCHL probable',
    downOk: '✓ 20 %+ possible',
    capacityTitle: (amt) => `💡 Capacité d'achat avec ${amt} de mise de fonds`,
    over: (amt) => `⚠️ Dépassé de ${amt}`,
    margin: (amt) => `✅ Marge de ${amt}`,
    max: 'max',
    priceLabels: { maison: 'Prix Maison', duplex: 'Prix Duplex', triplex: 'Prix Triplex' },
    subtitles: {
      maison: 'Unifamiliale — 0 logement locatif',
      duplex: 'Propriétaire + 1 logement locatif',
      triplex: 'Propriétaire + 2 logements locatifs',
    },
    badgeBest: 'Meilleur net',
    purchasePrice: 'Prix d\'achat',
    downPayment: (pct) => `Mise de fonds (${pct} %)`,
    legalMin: 'min. légal',
    cmhcPremium: 'Prime SCHL',
    totalMortgage: 'Hypothèque totale',
    monthlyPayment: 'Paiement mensuel',
    taxesHeating: 'Taxes + chauffage',
    rents: (n) => `Loyers perçus (${n} log.)`,
    gdsRatio: 'Ratio GDS effectif',
    withinCapacity: (max) => `✅ Ce prix est dans votre capacité (max ~${max}).`,
    overCapacity: (max) => `⚠️ Ce prix dépasse votre capacité (max ~${max}).`,
    netLabel: 'Coût net mensuel propriétaire',
    collected: 'encaissé',
    mo: '/mo',
    assumptionsTitle: 'ℹ️ Hypothèses de calcul utilisées',
    assumptions: [
      ['Taux de qualification',   '6,5 % (test stress OSFI : max(5,25 %, taux + 2 %))'],
      ['Amortissement',           '25 ans'],
      ['Ratio GDS max',           '39 % du revenu brut mensuel combiné'],
      ['Taxes municipales',       '1 % de la valeur / année (estimé)'],
      ['Chauffage',               '100 $/mois (unité propriétaire)'],
      ['Autres dettes',           '0 $ (optimiste — TDS = GDS ici)'],
      ['Revenu locatif duplex',   "50 % d'un loyer moyen inclus (CMHC add-back)"],
      ['Revenu locatif triplex',  '50 % de 2 loyers moyens inclus'],
      ['Loyer moyen estimé',      '1 300 $/mois / logement'],
      ['Mise de fonds',           'Montant fixe — même pour les 3 scénarios. Plancher légal appliqué par carte.'],
      ['Plancher maison',         "5 % jusqu'à 500k, 10 % sur 500–999k, 20 % si ≥ 1M"],
      ['Plancher duplex',         '5 % (SCHL) — propriétaire occupant'],
      ['Plancher triplex',        '10 % (SCHL) — propriétaire occupant'],
      ['Prime SCHL',              'Incluse si mise de fonds < 20 % (max 4 % sur prêt)'],
    ],
    disclaimer: '⚠️ Outil d\'estimation seulement — non applicable à toute situation. Consultez un courtier hypothécaire agréé avant toute décision d\'achat.',
    modalTitle: '⚠️ Avis important',
    modalBody: [
      'Cet outil est fourni à titre indicatif seulement. Les calculs sont basés sur des hypothèses simplifiées et ne constituent pas un avis financier, juridique ou hypothécaire.',
      'Les résultats peuvent différer significativement de votre situation réelle selon votre dossier de crédit, vos dettes existantes, les taux du marché au moment de votre demande et les politiques des institutions financières.',
      'Consultez un courtier hypothécaire agréé, un conseiller financier ou un notaire avant de prendre toute décision d\'achat immobilier.',
    ],
    modalConfirm: 'J\'ai compris — continuer',
  },
  en: {
    headerTitle: 'Quebec Real Estate Comparator',
    headerSub: 'House · Duplex · Triplex — Borrowing capacity & down payment at a glance',
    madeBy: 'made by',
    params: '📋 Your parameters',
    salary1Label: 'Salary — Person 1',
    salary1Hint: 'Gross annual salary',
    salary2Label: 'Salary — Person 2',
    salary2Hint: 'Leave at $0 if buying alone',
    combinedLabel: 'Combined income',
    downLabel: 'Available down payment',
    downHint: 'Same amount compared across all 3 options',
    downSCHL: '⚠ CMHC premium likely',
    downOk: '✓ 20%+ possible',
    capacityTitle: (amt) => `💡 Buying capacity with ${amt} down payment`,
    over: (amt) => `⚠️ Over by ${amt}`,
    margin: (amt) => `✅ Margin of ${amt}`,
    max: 'max',
    priceLabels: { maison: 'House Price', duplex: 'Duplex Price', triplex: 'Triplex Price' },
    subtitles: {
      maison: 'Single-family — 0 rental unit',
      duplex: 'Owner + 1 rental unit',
      triplex: 'Owner + 2 rental units',
    },
    badgeBest: 'Best net',
    purchasePrice: 'Purchase price',
    downPayment: (pct) => `Down payment (${pct}%)`,
    legalMin: 'legal min.',
    cmhcPremium: 'CMHC premium',
    totalMortgage: 'Total mortgage',
    monthlyPayment: 'Monthly payment',
    taxesHeating: 'Taxes + heating',
    rents: (n) => `Rental income (${n} unit${n > 1 ? 's' : ''})`,
    gdsRatio: 'Effective GDS ratio',
    withinCapacity: (max) => `✅ This price is within your capacity (max ~${max}).`,
    overCapacity: (max) => `⚠️ This price exceeds your capacity (max ~${max}).`,
    netLabel: 'Monthly net owner cost',
    collected: 'collected',
    mo: '/mo',
    assumptionsTitle: 'ℹ️ Calculation assumptions',
    assumptions: [
      ['Qualifying rate',     '6.5% (OSFI stress test: max(5.25%, rate + 2%))'],
      ['Amortization',        '25 years'],
      ['Max GDS ratio',       '39% of combined gross monthly income'],
      ['Municipal taxes',     '1% of value / year (estimated)'],
      ['Heating',             '$100/month (owner unit)'],
      ['Other debts',         '$0 (optimistic — TDS = GDS here)'],
      ['Duplex rental income','50% of avg rent included (CMHC add-back)'],
      ['Triplex rental income','50% of 2 avg rents included'],
      ['Avg rent estimate',   '$1,300/month / unit'],
      ['Down payment',        'Fixed amount — same across all 3 scenarios. Legal floor applied per card.'],
      ['House floor',         '5% up to $500k, 10% on $500k–$999k, 20% if ≥ $1M'],
      ['Duplex floor',        '5% (CMHC) — owner-occupied'],
      ['Triplex floor',       '10% (CMHC) — owner-occupied'],
      ['CMHC premium',        'Included if down payment < 20% (max 4% on loan)'],
    ],
    disclaimer: '⚠️ Estimation tool only — not applicable to every situation. Consult a licensed mortgage broker before any purchase decision.',
    modalTitle: '⚠️ Important Notice',
    modalBody: [
      'This tool is provided for informational purposes only. Calculations are based on simplified assumptions and do not constitute financial, legal, or mortgage advice.',
      'Results may differ significantly from your actual situation depending on your credit history, existing debts, market rates at the time of your application, and lender policies.',
      'Please consult a licensed mortgage broker, financial advisor, or notary before making any real estate purchase decision.',
    ],
    modalConfirm: 'I understand — continue',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const fmt = (n) =>
  Number.isFinite(n)
    ? n.toLocaleString('fr-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' $'
    : '— $'

const fmtPct = (n) => (n * 100).toFixed(1) + ' %'

function monthlyPayment(principal, annualRate, years) {
  const c = annualRate / 12
  const n = years * 12
  if (c === 0) return principal / n
  return (principal * c * Math.pow(1 + c, n)) / (Math.pow(1 + c, n) - 1)
}

function cmhcRate(ltv) {
  if (ltv <= 0.65) return 0.006
  if (ltv <= 0.75) return 0.017
  if (ltv <= 0.80) return 0.024
  if (ltv <= 0.85) return 0.028
  if (ltv <= 0.90) return 0.031
  return 0.040
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE CALCULATOR
// downAmount: dollar amount the couple has saved (same for all 3 scenarios)
// salary: combined gross annual salary
// ─────────────────────────────────────────────────────────────────────────────
function calcScenario({ salary, price, type, downAmount }) {
  const HEATING = 100
  const TAX_RATE = 0.01
  const QUAL_RATE = 0.065
  const AMO_YEARS = 25
  const RENT_ADDBACK = 0.50
  const RENT_PER_UNIT = 1300

  const rentalUnits = type === 'maison' ? 0 : type === 'duplex' ? 1 : 2
  const rentalIncome = rentalUnits * RENT_PER_UNIT * RENT_ADDBACK
  const monthlyIncome = salary / 12 + rentalIncome

  // Legal minimum down payment by CMHC rules
  let minDownByRule
  if (type === 'maison') {
    if (price < 500000) minDownByRule = price * 0.05
    else if (price < 1000000) minDownByRule = 500000 * 0.05 + (price - 500000) * 0.10
    else minDownByRule = price * 0.20
  } else if (type === 'duplex') {
    minDownByRule = price * 0.05  // 5% — propriétaire occupant, peu importe le prix
  } else {
    minDownByRule = price * 0.10  // 10% — propriétaire occupant, peu importe le prix
  }

  // Effective down: user's saved amount, capped to legal minimum
  const effectiveDown = Math.max(downAmount, minDownByRule)
  // Cap at purchase price (can't put more than 100%)
  const actualDown = Math.min(effectiveDown, price)
  const downPct = actualDown / price
  const belowMinimum = downAmount < minDownByRule  // user doesn't have enough

  const insured = downPct < 0.20
  const baseMortgage = price - actualDown
  const premium = insured ? baseMortgage * cmhcRate(1 - downPct) : 0
  const totalMortgage = baseMortgage + premium

  const mortgagePayment = monthlyPayment(totalMortgage, QUAL_RATE, AMO_YEARS)
  const monthlyTaxes = (price * TAX_RATE) / 12
  const heating = HEATING

  const gdsEffective = (mortgagePayment + monthlyTaxes + heating) / monthlyIncome

  // Binary search: max price achievable with this exact down amount
  // We find max mortgage where GDS ≤ 39%, then maxPrice = maxMortgage + downAmount
  let lo = 0, hi = 4000000
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    const testPrice = mid + downAmount
    const testDownPct = downAmount / testPrice
    const testInsured = testDownPct < 0.20
    const testPremium = testInsured ? mid * cmhcRate(1 - testDownPct) : 0
    const testTotal = mid + testPremium
    const pay = monthlyPayment(testTotal, QUAL_RATE, AMO_YEARS)
    const tx = (testPrice * TAX_RATE) / 12
    const gdsTest = (pay + tx + heating) / monthlyIncome
    if (gdsTest < 0.39) lo = mid; else hi = mid
  }
  const maxMortgage = lo
  const maxPrice = maxMortgage + downAmount

  const grossRent = rentalUnits * RENT_PER_UNIT
  const netMonthly = mortgagePayment + monthlyTaxes + heating - grossRent

  return {
    price, type, salary,
    actualDown, downPct, minDownByRule, insured, belowMinimum,
    baseMortgage, premium, totalMortgage,
    mortgagePayment, monthlyTaxes, heating,
    gdsEffective,
    rentalIncome: grossRent,
    netMonthly,
    maxPrice,
    rentalUnits,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SALARY SLIDER — single person row
// ─────────────────────────────────────────────────────────────────────────────
function SalarySlider({ label, hint, value, onChange }) {
  return (
    <div className="salary-row">
      <div className="salary-label">
        {label}
        <span>{hint}</span>
      </div>
      <input
        type="range"
        min={0} max={260000} step={5000}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      <div className="salary-value">{value.toLocaleString('fr-CA')} $</div>
      <input
        type="number"
        className="salary-input"
        min={0} max={260000} step={5000}
        value={value}
        onChange={e => {
          const v = Math.max(0, Math.min(260000, Number(e.target.value) || 0))
          onChange(v)
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CAPACITY BANNER
// ─────────────────────────────────────────────────────────────────────────────
function CapacityBanner({ results, downAmount, t, typeLabels }) {
  return (
    <div className="capacity-banner">
      <div className="capacity-banner-title">{t.capacityTitle(fmt(downAmount))}</div>
      <div className="capacity-banner-grid">
        {results.map(r => {
          const ratio = r.price / r.maxPrice
          const barPct = Math.min(ratio * 100, 100).toFixed(0)
          const over = r.price > r.maxPrice
          const color = over ? 'var(--danger)' : ratio > 0.9 ? 'var(--warn)' : 'var(--success)'
          return (
            <div key={r.type} className="capacity-item">
              <div className="capacity-item-header">
                <span className="capacity-item-label">
                  {typeLabels[r.type]}
                </span>
                <span className="capacity-item-max" style={{ color }}>{t.max} {fmt(r.maxPrice)}</span>
              </div>
              <div className="capacity-track">
                <div className="capacity-fill" style={{ width: `${barPct}%`, background: color }} />
              </div>
              <div className="capacity-item-footer">
                <span className="capacity-note" style={{ color }}>
                  {over ? t.over(fmt(r.price - r.maxPrice)) : t.margin(fmt(r.maxPrice - r.price))}
                </span>
                <span className="capacity-pct" style={{ color }}>{(ratio * 100).toFixed(0)} %</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD
// ─────────────────────────────────────────────────────────────────────────────
const ICONS = { maison: '🏡', duplex: '🏘️', triplex: '🏢' }

function Card({ r, isBest, t }) {
  const gds      = r.gdsEffective
  const gdsClass = gds <= 0.32 ? 'good' : gds <= 0.39 ? 'warn' : 'bad'
  const gdsBar   = gds <= 0.32 ? 'ok'   : gds <= 0.39 ? 'warn' : 'over'
  const barWidth = Math.min(gds / 0.50 * 100, 100).toFixed(1)
  const affordable = r.price <= r.maxPrice
  const netClass = r.netMonthly < 0 ? 'positive' : r.netMonthly < 800 ? 'neutral' : 'negative'

  return (
    <div className={`card${isBest ? ' best-value' : ''}`}>
      <div className={`card-header ${r.type}`}>
        <span className="card-icon">{ICONS[r.type]}</span>
        <div>
          <div className="card-title">{t.priceLabels[r.type].replace(/Prix |Price /, '')}</div>
          <div className="card-subtitle">{t.subtitles[r.type]}</div>
        </div>
        {isBest && <span className="badge-best">{t.badgeBest}</span>}
      </div>

      <div className="card-body">
        <div className="metric">
          <span className="metric-label">{t.purchasePrice}</span>
          <span className="metric-value">{fmt(r.price)}</span>
        </div>

        {/* Down payment row — shows warning if below legal minimum */}
        <div className={`metric${r.belowMinimum ? ' metric-warn-row' : ''}`}>
          <span className="metric-label">
            {t.downPayment((r.downPct * 100).toFixed(0))}
            {r.belowMinimum && (
              <span className="metric-badge-warn">{t.legalMin} {fmt(r.minDownByRule)}</span>
            )}
          </span>
          <span className={`metric-value ${r.belowMinimum ? 'bad' : 'highlight'}`}>
            {fmt(r.actualDown)}
          </span>
        </div>

        {r.insured && (
          <div className="metric">
            <span className="metric-label">{t.cmhcPremium}</span>
            <span className="metric-value warn">{fmt(r.premium)}</span>
          </div>
        )}
        <div className="metric">
          <span className="metric-label">{t.totalMortgage}</span>
          <span className="metric-value">{fmt(r.totalMortgage)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">{t.monthlyPayment}</span>
          <span className="metric-value">{fmt(r.mortgagePayment)}{t.mo}</span>
        </div>
        <div className="metric">
          <span className="metric-label">{t.taxesHeating}</span>
          <span className="metric-value">{fmt(r.monthlyTaxes + r.heating)}{t.mo}</span>
        </div>
        {r.rentalUnits > 0 && (
          <div className="metric">
            <span className="metric-label">{t.rents(r.rentalUnits)}</span>
            <span className="metric-value good">−{fmt(r.rentalIncome)}{t.mo}</span>
          </div>
        )}

        <div className="capacity-bar-wrap">
          <div className="metric" style={{ border: 'none', paddingBottom: '2px' }}>
            <span className="metric-label">{t.gdsRatio}</span>
            <span className={`metric-value ${gdsClass}`}>{fmtPct(gds)} / 39 %</span>
          </div>
          <div className="capacity-bar-track">
            <div className={`capacity-bar-fill ${gdsBar}`} style={{ width: `${barWidth}%` }} />
          </div>
        </div>

        <div className={`alert-box ${affordable ? 'ok' : 'error'}`}>
          {affordable ? t.withinCapacity(fmt(r.maxPrice)) : t.overCapacity(fmt(r.maxPrice))}
        </div>
      </div>

      <div className="card-footer">
        <div className="net-cost-label">{t.netLabel}</div>
        <div className={`net-cost-value ${netClass}`}>
          {fmt(Math.abs(r.netMonthly))}{r.netMonthly < 0 ? ` ${t.collected}` : t.mo}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DISCLAIMER MODAL
// ─────────────────────────────────────────────────────────────────────────────
function DisclaimerModal({ t, onAccept }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box" role="dialog" aria-modal="true">
        <div className="modal-icon">⚠️</div>
        <h2 className="modal-title">{t.modalTitle.replace('⚠️ ', '')}</h2>
        <div className="modal-body">
          {t.modalBody.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <button className="modal-btn" onClick={onAccept}>
          {t.modalConfirm}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCALSTORAGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const LS_KEY = 'compare-plex-v1'

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveState(state) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)) } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // Load persisted state once on mount
  const saved = loadState()

  const [showModal, setShowModal] = useState(!saved?.disclaimerAccepted)
  const [lang, setLang] = useState(saved?.lang ?? 'fr')
  const t = T[lang]
  const [salary1, setSalary1] = useState(saved?.salary1 ?? 80000)
  const [salary2, setSalary2] = useState(saved?.salary2 ?? 60000)
  const [downAmount, setDownAmount] = useState(saved?.downAmount ?? 75000)
  // Numeric prices used for calculation
  const [prices, setPrices] = useState(saved?.prices ?? { maison: 450000, duplex: 600000, triplex: 750000 })
  // Raw string values while user is typing — formatted at rest, raw digits while focused
  const [rawPrices, setRawPrices] = useState({
    maison:  (saved?.prices?.maison  ?? 450000).toLocaleString('fr-CA'),
    duplex:  (saved?.prices?.duplex  ?? 600000).toLocaleString('fr-CA'),
    triplex: (saved?.prices?.triplex ?? 750000).toLocaleString('fr-CA'),
  })

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    saveState({ lang, salary1, salary2, downAmount, prices, disclaimerAccepted: !showModal })
  }, [lang, salary1, salary2, downAmount, prices, showModal])

  const handleAcceptDisclaimer = () => {
    setShowModal(false)
    saveState({ lang, salary1, salary2, downAmount, prices, disclaimerAccepted: true })
  }

  // Update lang in saved state when it changes
  const handleLangChange = (l) => setLang(l)

  const totalSalary = salary1 + salary2

  const results = useMemo(() =>
    ['maison', 'duplex', 'triplex'].map(type =>
      calcScenario({ salary: totalSalary, price: prices[type], type, downAmount })
    ),
    [totalSalary, downAmount, prices]
  )

  const bestIdx = useMemo(() =>
    results.reduce((bi, r, i) => r.netMonthly < results[bi].netMonthly ? i : bi, 0),
    [results]
  )

  // While typing: store raw digits only, update numeric price if valid
  const handlePriceChange = (type, raw) => {
    // Strip everything except digits
    const digitsOnly = raw.replace(/\D/g, '')
    setRawPrices(prev => ({ ...prev, [type]: digitsOnly }))
    const num = parseInt(digitsOnly, 10)
    if (!isNaN(num) && num >= 1000) {
      setPrices(prev => ({ ...prev, [type]: num }))
    }
  }
  // On blur: snap to valid value, display formatted (e.g. 450 000)
  const handlePriceBlur = (type) => {
    const num = parseInt(rawPrices[type], 10)
    const valid = (!isNaN(num) && num >= 100000) ? num : 100000
    setPrices(prev => ({ ...prev, [type]: valid }))
    setRawPrices(prev => ({ ...prev, [type]: valid.toLocaleString('fr-CA') }))
  }
  // On focus: strip formatting so user types raw digits
  const handlePriceFocus = (type) => {
    setRawPrices(prev => ({ ...prev, [type]: String(prices[type]) }))
  }

  // Down payment ticks
  const DOWN_TICKS = [25000, 50000, 75000, 100000, 150000, 200000]

  return (
    <>
      <style>{CSS}</style>

      {showModal && <DisclaimerModal t={t} onAccept={handleAcceptDisclaimer} />}

      <header>
        <div className="header-inner">
          <div className="header-left">
            <div className="header-icon">🏠</div>
            <div className="header-title-block">
              <h1>{t.headerTitle}</h1>
              <p>{t.headerSub}</p>
            </div>
          </div>
          <div className="header-right">
            <div className="lang-toggle">
              <button
                className={`lang-btn${lang === 'fr' ? ' active' : ''}`}
                onClick={() => handleLangChange('fr')}
              >FR</button>
              <button
                className={`lang-btn${lang === 'en' ? ' active' : ''}`}
                onClick={() => handleLangChange('en')}
              >EN</button>
            </div>
            <a
              className="header-brand"
              href="https://www.lumentai.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="header-brand-made">{t.madeBy}</span>
              <span className="header-brand-name">LumentAI</span>
            </a>
          </div>
        </div>
      </header>

      <div className="container" style={{paddingTop: '72px'}}>
        <div className="input-panel">
          <h2>{t.params}</h2>

          {/* ── Salaries ── */}
          <SalarySlider
            label={t.salary1Label}
            hint={t.salary1Hint}
            value={salary1}
            onChange={setSalary1}
          />
          <SalarySlider
            label={t.salary2Label}
            hint={t.salary2Hint}
            value={salary2}
            onChange={setSalary2}
          />

          {/* Combined salary chip */}
          <div className="combined-salary">
            <span className="combined-salary-label">{t.combinedLabel}</span>
            <span className="combined-salary-value">{totalSalary.toLocaleString('fr-CA')} $</span>
          </div>

          <hr className="divider" />

          {/* ── Down payment slider ── */}
          <div className="down-row">
            <div className="salary-label">
              {t.downLabel}
              <span>{t.downHint}</span>
            </div>
            <input
              type="range"
              min={5000} max={300000} step={5000}
              value={downAmount}
              onChange={e => setDownAmount(Number(e.target.value))}
            />
            <div className={`down-value${downAmount >= 75000 ? ' no-schl' : ' has-schl'}`}>
              {fmt(downAmount)}
              <span>{downAmount >= 200000 ? t.downOk : t.downSCHL}</span>
            </div>
          </div>

          {/* Quick-pick ticks */}
          <div className="down-ticks">
            {DOWN_TICKS.map(v => (
              <span
                key={v}
                className={`down-tick${v === downAmount ? ' active' : ''}`}
                onClick={() => setDownAmount(v)}
              >
                {v >= 1000 ? (v / 1000) + 'k' : v} $
              </span>
            ))}
          </div>

          {/* Capacity banner */}
          <CapacityBanner
            results={results}
            downAmount={downAmount}
            t={t}
            typeLabels={{
              maison:  `🏡 ${t.priceLabels.maison.replace(/Prix |Price /, '')}`,
              duplex:  `🏘️ ${t.priceLabels.duplex.replace(/Prix |Price /, '')}`,
              triplex: `🏢 ${t.priceLabels.triplex.replace(/Prix |Price /, '')}`,
            }}
          />

          <hr className="divider" />

          {/* ── Property prices ── */}
          <div className="prices-row">
            {[
              { key: 'maison',  icon: '🏡' },
              { key: 'duplex',  icon: '🏘️' },
              { key: 'triplex', icon: '🏢' },
            ].map(({ key, icon }) => (
              <div key={key} className="price-field">
                <label><span className="icon">{icon}</span>{t.priceLabels[key]}</label>
                <div className="input-wrap">
                  <span className="currency">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={rawPrices[key]}
                    onChange={e => handlePriceChange(key, e.target.value)}
                    onFocus={() => handlePriceFocus(key)}
                    onBlur={() => handlePriceBlur(key)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Result cards ── */}
      <div className="results-grid">
        {results.map((r, i) => (
          <Card key={r.type} r={r} isBest={i === bestIdx} t={t} />
        ))}
      </div>

      {/* ── Assumptions ── */}
      <div className="assumptions-wrap">
        <details>
          <summary>{t.assumptionsTitle}</summary>
          <div className="assumptions-grid">
            {t.assumptions.map(([title, val]) => (
              <div key={title} className="assumption-item">
                <strong>{title}</strong>{val}
              </div>
            ))}
          </div>
        </details>
      </div>

      <p className="disclaimer">{t.disclaimer}</p>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f4f6f9;
    --surface: #ffffff;
    --border: #e2e8f0;
    --primary: #2563eb;
    --primary-light: #eff6ff;
    --primary-dark: #1d4ed8;
    --success: #16a34a;
    --success-light: #f0fdf4;
    --warn: #d97706;
    --warn-light: #fffbeb;
    --danger: #dc2626;
    --danger-light: #fef2f2;
    --text: #0f172a;
    --text-muted: #64748b;
    --text-light: #94a3b8;
    --radius: 12px;
    --shadow: 0 1px 3px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.06);
    --shadow-card: 0 2px 8px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.06);
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    padding: 0 0 60px;
  }

  header {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    padding: 10px 24px;
    height: 60px;
    display: flex;
    align-items: center;
  }
  .header-inner {
    width: 100%;
    max-width: 1140px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .header-icon {
    width: 36px; height: 36px;
    background: #0f172a;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  .header-title-block { text-align: left; }
  header h1 { font-size: .95rem; font-weight: 700; letter-spacing: -.1px; color: #0f172a; margin: 0; }
  header p  { margin: 1px 0 0; font-size: .73rem; color: #64748b; }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }

  .lang-toggle {
    display: flex;
    background: #f1f5f9;
    border-radius: 8px;
    padding: 3px;
    gap: 2px;
  }
  .lang-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: .72rem;
    font-weight: 600;
    letter-spacing: .04em;
    color: #64748b;
    padding: 4px 10px;
    border-radius: 6px;
    transition: background .15s, color .15s;
    font-family: inherit;
  }
  .lang-btn.active {
    background: #0f172a;
    color: #ffffff;
  }
  .lang-btn:not(.active):hover { background: #e2e8f0; color: #0f172a; }

  .header-brand {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-decoration: none;
    color: #64748b;
    transition: color .2s;
    flex-shrink: 0;
  }
  .header-brand:hover { color: #0f172a; }
  .header-brand-made {
    font-size: .58rem;
    letter-spacing: .08em;
    text-transform: uppercase;
    line-height: 1;
  }
  .header-brand-name {
    font-size: .78rem;
    font-weight: 700;
    letter-spacing: -.1px;
    line-height: 1.3;
    color: #0f172a;
  }

  .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

  .input-panel {
    background: var(--surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 28px;
    margin: 28px auto 0;
  }
  .input-panel h2 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: .06em;
    margin-bottom: 20px;
  }

  /* ── SALARY ROWS ── */
  .salary-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }
  .salary-label {
    font-weight: 600;
    font-size: .95rem;
    white-space: nowrap;
    min-width: 190px;
  }
  .salary-label span {
    display: block;
    font-size: .75rem;
    font-weight: 400;
    color: var(--text-muted);
    margin-top: 2px;
  }
  input[type=range] {
    flex: 1;
    min-width: 140px;
    accent-color: var(--primary);
    cursor: pointer;
  }
  .salary-value {
    background: var(--primary-light);
    color: var(--primary-dark);
    font-weight: 700;
    font-size: 1rem;
    padding: 5px 12px;
    border-radius: 8px;
    min-width: 130px;
    text-align: center;
    white-space: nowrap;
  }
  input[type=number].salary-input {
    width: 110px;
    padding: 6px 8px;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    font-size: .9rem;
    color: var(--text);
    background: white;
  }
  input[type=number].salary-input:focus { outline: 2px solid var(--primary); border-color: transparent; }

  /* ── COMBINED SALARY CHIP ── */
  .combined-salary {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    margin: 4px 0 0;
    padding: 8px 12px;
    background: var(--primary-light);
    border-radius: 8px;
    border: 1px solid #bfdbfe;
  }
  .combined-salary-label {
    font-size: .78rem;
    font-weight: 700;
    color: var(--primary-dark);
    text-transform: uppercase;
    letter-spacing: .05em;
  }
  .combined-salary-value {
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--primary-dark);
  }

  .divider { border: none; border-top: 1px solid var(--border); margin: 20px 0 20px; }

  /* ── DOWN PAYMENT ROW ── */
  .down-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  .down-value {
    min-width: 130px;
    text-align: center;
    border-radius: 8px;
    padding: 5px 12px 7px;
    font-weight: 700;
    font-size: .95rem;
    line-height: 1.2;
    white-space: nowrap;
  }
  .down-value span {
    display: block;
    font-size: .66rem;
    font-weight: 600;
    margin-top: 2px;
    letter-spacing: .02em;
  }
  .down-value.no-schl  { background: #f0fdf4; color: var(--success); }
  .down-value.no-schl span { color: var(--success); }
  .down-value.has-schl { background: var(--warn-light); color: var(--warn); }
  .down-value.has-schl span { color: var(--warn); }

  .down-ticks {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 16px;
    padding-left: 206px;
  }
  .down-tick {
    font-size: .75rem;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px 9px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--bg);
    transition: all .15s;
    user-select: none;
    font-weight: 600;
  }
  .down-tick:hover  { background: var(--primary-light); color: var(--primary); border-color: #93c5fd; }
  .down-tick.active { background: var(--primary); color: white; border-color: var(--primary); }

  /* ── CAPACITY BANNER ── */
  .capacity-banner {
    margin: 4px 0 0;
    background: linear-gradient(135deg, #f0f7ff 0%, #f8faff 100%);
    border: 1.5px solid #bfdbfe;
    border-radius: 10px;
    padding: 14px 18px 16px;
  }
  .capacity-banner-title {
    font-size: .78rem;
    font-weight: 700;
    color: var(--primary-dark);
    text-transform: uppercase;
    letter-spacing: .07em;
    margin-bottom: 12px;
  }
  .capacity-banner-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }
  .capacity-item { display: flex; flex-direction: column; gap: 5px; }
  .capacity-item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 4px;
  }
  .capacity-item-label { font-size: .82rem; font-weight: 700; color: var(--text); }
  .capacity-item-max   { font-size: .82rem; font-weight: 700; text-align: right; }
  .capacity-track {
    height: 8px;
    background: #dbeafe;
    border-radius: 99px;
    overflow: hidden;
  }
  .capacity-fill {
    height: 100%;
    border-radius: 99px;
    transition: width .4s ease, background .3s ease;
  }
  .capacity-item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .capacity-note { font-size: .72rem; font-weight: 600; }
  .capacity-pct  { font-size: .72rem; font-weight: 700; }

  /* ── PRICES ROW ── */
  .prices-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .price-field label {
    display: block;
    font-size: .85rem;
    font-weight: 600;
    margin-bottom: 6px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: .05em;
  }
  .price-field label .icon { margin-right: 5px; }
  .price-field .input-wrap {
    display: flex;
    align-items: center;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    transition: border-color .2s;
  }
  .price-field .input-wrap:focus-within { border-color: var(--primary); }
  .price-field .currency {
    background: var(--bg);
    padding: 10px 10px 10px 12px;
    font-size: .9rem;
    color: var(--text-muted);
    font-weight: 500;
    border-right: 1px solid var(--border);
  }
  .price-field input {
    flex: 1;
    border: none;
    outline: none;
    box-shadow: none;
    padding: 10px 12px;
    font-size: 1rem;
    font-weight: 500;
    color: var(--text);
    background: white;
    min-width: 0;
    font-family: inherit;
  }

  /* ── RESULT CARDS ── */
  .results-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 28px auto 0;
    max-width: 1100px;
    padding: 0 20px;
  }
  .card {
    background: var(--surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow-card);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1.5px solid transparent;
    transition: border-color .2s, transform .2s;
  }
  .card:hover { transform: translateY(-2px); }
  .card.best-value { border-color: var(--success); }

  .card-header {
    padding: 18px 20px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .card-icon    { font-size: 1.8rem; line-height: 1; }
  .card-title   { font-size: 1.1rem; font-weight: 700; }
  .card-subtitle { font-size: .78rem; color: var(--text-muted); margin-top: 2px; }

  .card-header.maison  { background: #f0f7ff; }
  .card-header.duplex  { background: #f0fdf4; }
  .card-header.triplex { background: #faf5ff; }

  .badge-best {
    margin-left: auto;
    background: var(--success);
    color: white;
    font-size: .7rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: .04em;
  }

  .card-body { padding: 16px 20px; flex: 1; }

  .metric {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 9px 0;
    border-bottom: 1px solid var(--bg);
  }
  .metric:last-child { border-bottom: none; }
  .metric-label { font-size: .85rem; color: var(--text-muted); max-width: 58%; line-height: 1.4; }
  .metric-value { font-size: .95rem; font-weight: 600; color: var(--text); text-align: right; }
  .metric-value.highlight { color: var(--primary); }
  .metric-value.good      { color: var(--success); }
  .metric-value.warn      { color: var(--warn); }
  .metric-value.bad       { color: var(--danger); }

  .metric-warn-row { background: #fff7ed; margin: 0 -4px; padding: 9px 4px; border-radius: 6px; }
  .metric-badge-warn {
    display: inline-block;
    margin-top: 3px;
    font-size: .68rem;
    font-weight: 700;
    color: var(--danger);
    background: var(--danger-light);
    padding: 1px 5px;
    border-radius: 4px;
  }

  .card-footer { padding: 12px 20px; border-top: 1px solid var(--border); }
  .net-cost-label {
    font-size: .78rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: .04em;
    font-weight: 600;
  }
  .net-cost-value { font-size: 1.35rem; font-weight: 800; margin-top: 2px; }
  .net-cost-value.positive { color: var(--success); }
  .net-cost-value.neutral  { color: var(--text); }
  .net-cost-value.negative { color: var(--danger); }

  .capacity-bar-wrap { margin: 6px 0 2px; }
  .capacity-bar-track {
    height: 6px;
    background: var(--bg);
    border-radius: 99px;
    overflow: hidden;
    margin-top: 4px;
  }
  .capacity-bar-fill { height: 100%; border-radius: 99px; transition: width .4s ease; }
  .capacity-bar-fill.ok   { background: var(--success); }
  .capacity-bar-fill.warn { background: var(--warn); }
  .capacity-bar-fill.over { background: var(--danger); }

  .alert-box {
    margin: 10px 0 2px;
    padding: 9px 12px;
    border-radius: 8px;
    font-size: .82rem;
    line-height: 1.45;
  }
  .alert-box.ok    { background: var(--success-light); color: #14532d; }
  .alert-box.error { background: var(--danger-light);  color: #991b1b; }

  /* ── ASSUMPTIONS ── */
  .assumptions-wrap { max-width: 1100px; margin: 24px auto 0; padding: 0 20px; }
  details {
    background: var(--surface);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    overflow: hidden;
  }
  summary {
    padding: 14px 20px;
    cursor: pointer;
    font-size: .9rem;
    font-weight: 600;
    color: var(--text-muted);
    list-style: none;
    display: flex;
    align-items: center;
    gap: 8px;
    user-select: none;
  }
  summary::-webkit-details-marker { display: none; }
  summary::before { content: '▶'; font-size: .7rem; transition: transform .2s; }
  details[open] summary::before { transform: rotate(90deg); }
  .assumptions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
    padding: 4px 20px 16px;
  }
  .assumption-item {
    font-size: .82rem;
    color: var(--text-muted);
    padding: 8px 12px;
    background: var(--bg);
    border-radius: 8px;
    line-height: 1.45;
  }
  .assumption-item strong { color: var(--text); display: block; font-size: .8rem; margin-bottom: 2px; }

  /* ── DISCLAIMER ── */
  .disclaimer {
    max-width: 1100px;
    margin: 16px auto 0;
    padding: 0 20px;
    font-size: .78rem;
    color: var(--text-light);
    text-align: center;
    line-height: 1.6;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 760px) {
    .prices-row           { grid-template-columns: 1fr; }
    .results-grid         { grid-template-columns: 1fr; }
    .salary-row           { flex-direction: column; align-items: stretch; }
    .down-row             { flex-direction: column; align-items: stretch; }
    .down-ticks           { padding-left: 0; }
    .capacity-banner-grid { grid-template-columns: 1fr; }
    input[type=range]     { width: 100%; }
    header h1             { font-size: .9rem; }
    header p              { display: none; }
    .header-brand-made    { display: none; }
  }
  @media (max-width: 500px) {
    .input-panel { padding: 20px 16px; }
  }

  /* ── DISCLAIMER MODAL ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .modal-box {
    background: #ffffff;
    border-radius: 16px;
    padding: 40px 36px 32px;
    max-width: 520px;
    width: 100%;
    box-shadow: 0 24px 64px rgba(0,0,0,.18);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    animation: modal-in .2s ease;
  }
  @keyframes modal-in {
    from { opacity: 0; transform: translateY(12px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .modal-icon {
    font-size: 2.4rem;
    margin-bottom: 12px;
    line-height: 1;
  }
  .modal-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 20px;
    letter-spacing: -.2px;
  }
  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 28px;
    text-align: left;
  }
  .modal-body p {
    font-size: .875rem;
    color: #475569;
    line-height: 1.65;
    padding-left: 14px;
    border-left: 3px solid #e2e8f0;
  }
  .modal-btn {
    background: #0f172a;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 13px 28px;
    font-size: .9rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background .15s, transform .1s;
    width: 100%;
    letter-spacing: -.1px;
  }
  .modal-btn:hover { background: #1e293b; }
  .modal-btn:active { transform: scale(.98); }
`

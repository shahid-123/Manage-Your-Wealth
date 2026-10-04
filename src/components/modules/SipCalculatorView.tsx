import React, { useState, useMemo } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatIndianCurrency } from '../../utils/formatters';
import {
  Calculator,
  TrendingUp,
  Calendar,
  Sparkles,
  Download,
  ArrowUpRight,
  ChevronDown,
  Layers,
  Filter,
  CheckCircle2,
  DollarSign,
  Info,
} from 'lucide-react';

interface MonthlyScheduleRow {
  monthIndex: number;
  yearIndex: number;
  dateStr: string;
  monthlySip: number;
  cumulativeInvested: number;
  portfolioValue: number;
  wealthGain: number;
}

interface YearlyMilestoneRow {
  year: number;
  calendarYear: number;
  monthlySip: number;
  annualInvested: number;
  cumulativeInvested: number;
  yearEndValue: number;
  wealthGain: number;
}

export const SipCalculatorView: React.FC = () => {
  const { totalMonthlySip } = useFinancial();

  // Calculator Parameters
  const [initialInvestment, setInitialInvestment] = useState<number>(0);
  const [monthlySip, setMonthlySip] = useState<number>(totalMonthlySip > 0 ? totalMonthlySip : 50000);
  const [annualReturnRate, setAnnualReturnRate] = useState<number>(12); // 12% CAGR
  const [timeHorizonYears, setTimeHorizonYears] = useState<number>(20); // 20 years default
  const [enableStepUp, setEnableStepUp] = useState<boolean>(true);
  const [stepUpPercent, setStepUpPercent] = useState<number>(10); // 10% annual step-up
  const [sipDayOfMonth, setSipDayOfMonth] = useState<number>(5); // 5th of each month

  // Table filter states
  const [viewMode, setViewMode] = useState<'YEARLY' | 'MONTHLY'>('YEARLY');
  const [filterYear, setFilterYear] = useState<number>(1); // For monthly drill-down

  // Month names
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  // Calculation engine
  const calculationResult = useMemo(() => {
    const totalMonths = timeHorizonYears * 12;
    const monthlyReturnRate = annualReturnRate / 100 / 12;

    const monthlyRows: MonthlyScheduleRow[] = [];
    const yearlyRows: YearlyMilestoneRow[] = [];

    let currentPortfolioValue = initialInvestment;
    let totalInvested = initialInvestment;

    const startDate = new Date();
    // Start next upcoming month
    let startYear = startDate.getFullYear();
    let startMonth = startDate.getMonth() + 1; // 0-indexed, start next month
    if (startMonth > 11) {
      startMonth = 0;
      startYear += 1;
    }

    let yearAccumulatedInvestment = 0;

    for (let m = 0; m < totalMonths; m++) {
      const yearIdx = Math.floor(m / 12) + 1;
      const monthInYear = m % 12;

      // Compute current month's SIP with step-up
      let currentMonthlySip = monthlySip;
      if (enableStepUp) {
        currentMonthlySip = monthlySip * Math.pow(1 + stepUpPercent / 100, yearIdx - 1);
      }
      currentMonthlySip = Math.round(currentMonthlySip);

      // Monthly execution date calculation
      const execDate = new Date(startYear, startMonth + m, sipDayOfMonth);
      const dateStr = `${String(sipDayOfMonth).padStart(2, '0')} ${monthNames[execDate.getMonth()]} ${execDate.getFullYear()}`;

      // Investment and compounding
      totalInvested += currentMonthlySip;
      yearAccumulatedInvestment += currentMonthlySip;

      // Compounding: invest at start of month, grow with return rate
      currentPortfolioValue = (currentPortfolioValue + currentMonthlySip) * (1 + monthlyReturnRate);

      const wealthGain = Math.max(0, currentPortfolioValue - totalInvested);

      monthlyRows.push({
        monthIndex: m + 1,
        yearIndex: yearIdx,
        dateStr,
        monthlySip: currentMonthlySip,
        cumulativeInvested: Math.round(totalInvested),
        portfolioValue: Math.round(currentPortfolioValue),
        wealthGain: Math.round(wealthGain),
      });

      // If last month of the year or end of tenure, record yearly milestone
      if (monthInYear === 11 || m === totalMonths - 1) {
        yearlyRows.push({
          year: yearIdx,
          calendarYear: execDate.getFullYear(),
          monthlySip: currentMonthlySip,
          annualInvested: Math.round(yearAccumulatedInvestment),
          cumulativeInvested: Math.round(totalInvested),
          yearEndValue: Math.round(currentPortfolioValue),
          wealthGain: Math.round(wealthGain),
        });
        yearAccumulatedInvestment = 0;
      }
    }

    // Comparison without Step-Up (Flat SIP)
    let flatPortfolioValue = initialInvestment;
    let flatTotalInvested = initialInvestment;
    for (let m = 0; m < totalMonths; m++) {
      flatTotalInvested += monthlySip;
      flatPortfolioValue = (flatPortfolioValue + monthlySip) * (1 + monthlyReturnRate);
    }

    return {
      monthlyRows,
      yearlyRows,
      finalCorpus: Math.round(currentPortfolioValue),
      finalInvested: Math.round(totalInvested),
      finalWealthGain: Math.round(currentPortfolioValue - totalInvested),
      multiplier: totalInvested > 0 ? (currentPortfolioValue / totalInvested).toFixed(1) : '1.0',
      finalMonthlySip: monthlyRows.length > 0 ? monthlyRows[monthlyRows.length - 1].monthlySip : monthlySip,
      flatCorpus: Math.round(flatPortfolioValue),
      flatInvested: Math.round(flatTotalInvested),
      stepUpBenefit: Math.round(currentPortfolioValue - flatPortfolioValue),
    };
  }, [initialInvestment, monthlySip, annualReturnRate, timeHorizonYears, enableStepUp, stepUpPercent, sipDayOfMonth]);

  // Export to CSV
  const handleExportCsv = () => {
    const headers = ['Month #', 'Year', 'SIP Date', 'Monthly SIP (INR)', 'Cumulative Invested (INR)', 'Portfolio Value (INR)', 'Wealth Gain (INR)'];
    const rows = calculationResult.monthlyRows.map((r) => [
      r.monthIndex,
      `Year ${r.yearIndex}`,
      r.dateStr,
      r.monthlySip,
      r.cumulativeInvested,
      r.portfolioValue,
      r.wealthGain,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ManageYourWealth_20Year_SIP_Schedule_${timeHorizonYears}Y_${stepUpPercent}pct_StepUp.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered monthly rows for the selected year
  const filteredMonthlyRows = useMemo(() => {
    return calculationResult.monthlyRows.filter((r) => r.yearIndex === filterYear);
  }, [calculationResult.monthlyRows, filterYear]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              20-Year Step-Up SIP Calculator & Monthly Execution Schedule
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Simulate your multi-decade wealth compounding with annual salary step-ups. Review exact monthly dates, cumulative capital deployed, and future portfolio milestones through {new Date().getFullYear() + timeHorizonYears}.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all shrink-0 active:scale-95"
          title="Download complete schedule as CSV for Excel or Git"
        >
          <Download className="w-4 h-4 text-teal-400" />
          <span>Export 20-Yr CSV</span>
        </button>
      </div>

      {/* Calculator Inputs Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Custom Investment Parameters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
          {/* 1. Monthly Base SIP */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold">Monthly Base SIP (₹)</label>
              <span className="text-[11px] text-teal-400 font-mono font-bold">
                {formatIndianCurrency(monthlySip, 'AUTO')}/mo
              </span>
            </div>
            <input
              type="number"
              value={monthlySip}
              onChange={(e) => setMonthlySip(Math.max(1000, parseFloat(e.target.value) || 0))}
              className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-slate-100 font-mono font-bold text-base focus:outline-none"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[25000, 50000, 75000, 100000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMonthlySip(preset)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    monthlySip === preset
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {formatIndianCurrency(preset, 'AUTO')}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Expected Annual Return (%) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold">Expected Return (CAGR %)</label>
              <span className="text-[11px] text-emerald-400 font-mono font-bold">{annualReturnRate}% p.a.</span>
            </div>
            <input
              type="number"
              step="0.5"
              min="1"
              max="30"
              value={annualReturnRate}
              onChange={(e) => setAnnualReturnRate(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-slate-100 font-mono font-bold text-base focus:outline-none"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[10, 12, 14, 16].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setAnnualReturnRate(rate)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    annualReturnRate === rate
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          {/* 3. Annual Step-Up (%) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  id="enableStepUp"
                  checked={enableStepUp}
                  onChange={(e) => setEnableStepUp(e.target.checked)}
                  className="rounded border-slate-700 text-teal-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="enableStepUp" className="text-slate-300 font-semibold cursor-pointer">
                  Annual Step-Up (%)
                </label>
              </div>
              <span className="text-[11px] text-amber-400 font-mono font-bold">
                {enableStepUp ? `+${stepUpPercent}% / yr` : 'Disabled'}
              </span>
            </div>
            <input
              type="number"
              disabled={!enableStepUp}
              min="1"
              max="50"
              value={stepUpPercent}
              onChange={(e) => setStepUpPercent(parseFloat(e.target.value) || 0)}
              className={`w-full bg-slate-950 border rounded-xl px-3 py-2.5 text-slate-100 font-mono font-bold text-base focus:outline-none ${
                enableStepUp ? 'border-slate-800 focus:border-teal-500' : 'border-slate-800/40 opacity-50'
              }`}
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[5, 10, 15, 20].map((step) => (
                <button
                  key={step}
                  type="button"
                  disabled={!enableStepUp}
                  onClick={() => setStepUpPercent(step)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    stepUpPercent === step && enableStepUp
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  +{step}%
                </button>
              ))}
            </div>
          </div>

          {/* 4. Time Horizon & SIP Day */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold">Tenure & Debit Date</label>
              <span className="text-[11px] text-slate-400 font-mono">
                {timeHorizonYears} Yrs • {sipDayOfMonth}th of month
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={timeHorizonYears}
                onChange={(e) => setTimeHorizonYears(parseInt(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 font-mono text-sm focus:outline-none focus:border-teal-500"
              >
                <option value={5}>5 Years</option>
                <option value={10}>10 Years</option>
                <option value={15}>15 Years</option>
                <option value={20}>20 Years</option>
                <option value={25}>25 Years</option>
                <option value={30}>30 Years</option>
              </select>

              <select
                value={sipDayOfMonth}
                onChange={(e) => setSipDayOfMonth(parseInt(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 font-mono text-sm focus:outline-none focus:border-teal-500"
              >
                <option value={1}>1st of Mo</option>
                <option value={5}>5th of Mo</option>
                <option value={10}>10th of Mo</option>
                <option value={15}>15th of Mo</option>
                <option value={20}>20th of Mo</option>
                <option value={25}>25th of Mo</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>Next SIP: {String(sipDayOfMonth).padStart(2, '0')} Nov {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 20-Year Projections Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Capital Invested */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">
            Total Capital Invested
          </span>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">
            {formatIndianCurrency(calculationResult.finalInvested, 'AUTO')}
          </div>
          <p className="text-[11px] text-slate-500">
            Across {timeHorizonYears * 12} scheduled monthly installments
          </p>
        </div>

        {/* Total Wealth Gain */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">
            Estimated Wealth Gain
          </span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            +{formatIndianCurrency(calculationResult.finalWealthGain, 'AUTO')}
          </div>
          <p className="text-[11px] text-slate-500">
            Compounded profit at {annualReturnRate}% p.a.
          </p>
        </div>

        {/* Final Maturity Corpus */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-[11px] text-teal-300 uppercase font-bold tracking-wider block">
            Maturity Corpus ({timeHorizonYears} Yrs)
          </span>
          <div className="text-2xl font-extrabold text-teal-400 font-mono">
            {formatIndianCurrency(calculationResult.finalCorpus, 'AUTO')}
          </div>
          <p className="text-[11px] text-teal-200/70">
            Wealth Multiplier: <strong>{calculationResult.multiplier}x</strong> of invested capital
          </p>
        </div>

        {/* Step-Up Advantage */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">
            Step-Up Advantage vs Flat SIP
          </span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">
            +{formatIndianCurrency(calculationResult.stepUpBenefit, 'AUTO')}
          </div>
          <p className="text-[11px] text-slate-500">
            Year {timeHorizonYears} SIP scales to {formatIndianCurrency(calculationResult.finalMonthlySip, 'AUTO')}/mo
          </p>
        </div>
      </div>

      {/* 20-Year Schedule Table: Monthly Drill-Down & Yearly Milestones */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-bold text-slate-100">
                20-Year SIP Execution Ledger ({calculationResult.monthlyRows.length} Scheduled Installments)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Review your progress milestone by milestone with exact dates and compounding milestones.
            </p>
          </div>

          {/* Toggle between Yearly Summary and Monthly Drill-Down */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs shrink-0">
            <button
              onClick={() => setViewMode('YEARLY')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'YEARLY'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Yearly Milestones ({timeHorizonYears} Yrs)
            </button>
            <button
              onClick={() => setViewMode('MONTHLY')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'MONTHLY'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly Drill-Down (Dates)
            </button>
          </div>
        </div>

        {/* Monthly Drill-Down Year Selector Bar */}
        {viewMode === 'MONTHLY' && (
          <div className="flex flex-wrap items-center gap-2 pb-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-teal-400" /> Filter Year:
            </span>
            {Array.from({ length: timeHorizonYears }, (_, i) => i + 1).map((yr) => (
              <button
                key={yr}
                onClick={() => setFilterYear(yr)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                  filterYear === yr
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Yr {yr}
              </button>
            ))}
          </div>
        )}

        {/* Table View */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          {viewMode === 'YEARLY' ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                  <th className="p-3.5">Year</th>
                  <th className="p-3.5">Calendar Year</th>
                  <th className="p-3.5">Monthly SIP</th>
                  <th className="p-3.5">Annual Deployed</th>
                  <th className="p-3.5">Cumulative Invested</th>
                  <th className="p-3.5 text-right">Portfolio Value</th>
                  <th className="p-3.5 text-right">Wealth Gain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {calculationResult.yearlyRows.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-bold text-slate-200">Year {row.year}</td>
                    <td className="p-3.5 text-slate-400">{row.calendarYear}</td>
                    <td className="p-3.5 text-teal-400 font-semibold">{formatIndianCurrency(row.monthlySip, 'RUPEE')}</td>
                    <td className="p-3.5 text-slate-300">{formatIndianCurrency(row.annualInvested, 'AUTO')}</td>
                    <td className="p-3.5 text-slate-300">{formatIndianCurrency(row.cumulativeInvested, 'AUTO')}</td>
                    <td className="p-3.5 text-right font-bold text-slate-100">{formatIndianCurrency(row.yearEndValue, 'AUTO')}</td>
                    <td className="p-3.5 text-right text-emerald-400 font-bold">+{formatIndianCurrency(row.wealthGain, 'AUTO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                  <th className="p-3.5">Month #</th>
                  <th className="p-3.5">Execution Date</th>
                  <th className="p-3.5">Monthly SIP</th>
                  <th className="p-3.5">Cumulative Invested</th>
                  <th className="p-3.5 text-right">Compounded Value</th>
                  <th className="p-3.5 text-right">Wealth Gain</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {filteredMonthlyRows.map((row) => (
                  <tr key={row.monthIndex} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-bold text-slate-200">Month {row.monthIndex}</td>
                    <td className="p-3.5 text-teal-300 font-semibold">{row.dateStr}</td>
                    <td className="p-3.5 text-slate-200">{formatIndianCurrency(row.monthlySip, 'RUPEE')}</td>
                    <td className="p-3.5 text-slate-300">{formatIndianCurrency(row.cumulativeInvested, 'AUTO')}</td>
                    <td className="p-3.5 text-right font-bold text-slate-100">{formatIndianCurrency(row.portfolioValue, 'AUTO')}</td>
                    <td className="p-3.5 text-right text-emerald-400 font-bold">+{formatIndianCurrency(row.wealthGain, 'AUTO')}</td>
                    <td className="p-3.5 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full font-sans">
                        <CheckCircle2 className="w-3 h-3" /> Scheduled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Tip / Strategic note */}
        <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/20 text-xs text-slate-300 flex items-start sm:items-center gap-3">
          <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Strategic Power of Step-Up:</strong> A 10% annual step-up aligns with standard annual salary increments and boosts your final 20-year corpus by{' '}
            <strong className="text-amber-400 font-mono">+{formatIndianCurrency(calculationResult.stepUpBenefit, 'AUTO')}</strong> compared to keeping your SIP flat at {formatIndianCurrency(monthlySip, 'AUTO')}/month.
          </span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatIndianCurrency } from '../../utils/formatters';
import {
  Wallet,
  Receipt,
  CreditCard,
  TrendingUp,
  Shield,
  ArrowRight,
  Sparkles,
  PieChart,
  Clock,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';

export const SimpleDashboard: React.FC = () => {
  const {
    netWorth,
    totalAssets,
    netSalaryMonthly,
    totalOtherIncomeMonthly,
    totalMonthlyInflow,
    totalMonthlyExpenses,
    totalLoanOutstanding,
    totalMonthlyEmi,
    totalCurrentInvestmentsValue,
    totalMonthlySip,
    nps,
    projectedNpsRetirementCorpus,
    monthlySavings,
    savingsRatePercent,
    currencyUnit,
    setActiveTab,
  } = useFinancial();

  const [selectedTimelineMilestone, setSelectedTimelineMilestone] = useState<number | null>(null);

  // Salary Utilisation Math:
  // Salary added is already AFTER all deductions including NPS (NPS employee deduction already occurred at payroll).
  // Hence, in-hand salary is only allocated across Living Expenses, Loan EMIs, and Active Investments/SIPs.
  const totalInflow = Math.max(1, totalMonthlyInflow);
  const totalCommittedOutflows = totalMonthlyExpenses + totalMonthlyEmi + totalMonthlySip;
  const unallocatedSurplus = Math.max(0, totalInflow - totalCommittedOutflows);

  const expPct = Math.round((totalMonthlyExpenses / totalInflow) * 100);
  const emiPct = Math.round((totalMonthlyEmi / totalInflow) * 100);
  const sipPct = Math.round((totalMonthlySip / totalInflow) * 100);
  const surplusPct = Math.max(0, 100 - (expPct + emiPct + sipPct));
  const totalUtilisedPct = Math.min(100, expPct + emiPct + sipPct);

  // Chronological 30-Day Paycheck Milestones
  const timelineMilestones = [
    {
      id: 1,
      dayRange: 'Day 1',
      title: 'Net Salary Credited (Post-NPS & Taxes)',
      tag: 'In-Hand Income',
      tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      amount: totalInflow,
      isPositive: true,
      description: 'Net take-home salary credited into your bank account (all payroll deductions including NPS and taxes already deducted at source).',
      status: '100% Inflow Available',
    },
    {
      id: 2,
      dayRange: 'Days 1 – 5',
      title: 'Fixed Debt Obligations & EMIs',
      tag: 'Debt Servicing',
      tagColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      amount: totalMonthlyEmi,
      isPositive: false,
      description: `Home loan, auto loan, and personal debt EMIs automatically debited from your bank account (${formatIndianCurrency(totalMonthlyEmi, 'AUTO')}/mo).`,
      status: `${emiPct}% of in-hand`,
    },
    {
      id: 3,
      dayRange: 'Days 5 – 10',
      title: 'Wealth Creation SIP Mandates',
      tag: 'Investments',
      tagColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      amount: totalMonthlySip,
      isPositive: false,
      description: `Automated voluntary SIPs into Index ETFs, Midcap, Smallcap, Gold, and Liquid Funds (${formatIndianCurrency(totalMonthlySip, 'AUTO')}/mo).`,
      status: `${sipPct}% of in-hand`,
    },
    {
      id: 4,
      dayRange: 'Days 10 – 25',
      title: 'Household & Operational Living Costs',
      tag: 'Living Expenses',
      tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      amount: totalMonthlyExpenses,
      isPositive: false,
      description: `Groceries, utilities, children schooling, healthcare, transport, and family lifestyle spending.`,
      status: `${expPct}% of in-hand`,
    },
    {
      id: 5,
      dayRange: 'Days 25 – 30',
      title: 'Surplus Sweep & Emergency Buffer',
      tag: 'Cash Buffer',
      tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      amount: unallocatedSurplus,
      isPositive: true,
      description: `Net free surplus cash (${formatIndianCurrency(unallocatedSurplus, 'AUTO')}) preserved in bank account or swept to emergency liquid reserve.`,
      status: `${surplusPct}% retained`,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Primary Net Worth Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-1">
              Consolidated Net Worth
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight font-mono">
              {formatIndianCurrency(netWorth, currencyUnit)}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-400">
              <span>Total Assets: <strong className="text-slate-200">{formatIndianCurrency(totalAssets, 'AUTO')}</strong></span>
              <span>•</span>
              <span className="text-rose-400/90">Total Debt: <strong>{formatIndianCurrency(totalLoanOutstanding, 'AUTO')}</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-xs">
              <span className="text-slate-400 block text-[11px]">Monthly Net Inflow</span>
              <span className="text-slate-100 font-bold text-base block mt-0.5 font-mono">
                {formatIndianCurrency(totalMonthlyInflow, 'AUTO')}/mo
              </span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-xs">
              <span className="text-slate-400 block text-[11px]">Monthly Investments & SIP</span>
              <span className="text-teal-400 font-bold text-base block mt-0.5 font-mono">
                {formatIndianCurrency(totalMonthlySip + nps.employeeMonthlyContribution + nps.employerMonthlyContribution, 'AUTO')}/mo
              </span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-xs">
              <span className="text-slate-400 block text-[11px]">Savings Rate</span>
              <span className="text-emerald-400 font-bold text-base block mt-0.5 font-mono">
                {savingsRatePercent}%
              </span>
            </div>

            <button
              onClick={() => setActiveTab('COMMUNITY')}
              className="bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 rounded-2xl p-3.5 text-xs text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-purple-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold">Community & Visitors</span>
              </div>
              <span className="text-slate-100 font-bold text-base block mt-0.5 font-mono group-hover:text-purple-300">
                View Insights ➔
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* The 6 Core Modular Financial Pillars (3x2 Balanced Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Salary & Income */}
        <div
          onClick={() => setActiveTab('SALARY_INCOME')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Wallet className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Salary & Income</h3>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Net Salary (In-Hand):</span>
              <span className="text-emerald-400 font-bold font-mono">{formatIndianCurrency(netSalaryMonthly, 'AUTO')}/mo</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Other Income:</span>
              <span className="text-slate-300 font-mono">+{formatIndianCurrency(totalOtherIncomeMonthly, 'AUTO')}/mo</span>
            </div>
            <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Total Monthly Inflow:</span>
              <span className="text-slate-100 font-bold font-mono">{formatIndianCurrency(totalMonthlyInflow, 'AUTO')}/mo</span>
            </div>
          </div>
        </div>

        {/* 2. Expenses */}
        <div
          onClick={() => setActiveTab('EXPENSES')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                <Receipt className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Monthly Expenses</h3>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Total Spending:</span>
              <span className="text-rose-400 font-bold font-mono">{formatIndianCurrency(totalMonthlyExpenses, 'AUTO')}/mo</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Surplus After Exp:</span>
              <span className="text-slate-200 font-semibold font-mono">{formatIndianCurrency(monthlySavings, 'AUTO')}/mo</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              Food, utilities, school, transport & lifestyle
            </div>
          </div>
        </div>

        {/* 3. Loans & Debt */}
        <div
          onClick={() => setActiveTab('LOANS')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Loans & Debt</h3>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Total Outstanding:</span>
              <span className="text-rose-400 font-bold font-mono">{formatIndianCurrency(totalLoanOutstanding, 'AUTO')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Monthly EMI Outflow:</span>
              <span className="text-slate-200 font-semibold font-mono">{formatIndianCurrency(totalMonthlyEmi, 'AUTO')}/mo</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              Home loans, auto loans, personal debt
            </div>
          </div>
        </div>

        {/* 4. Investments */}
        <div
          onClick={() => setActiveTab('INVESTMENTS')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Investments</h3>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Current Portfolio:</span>
              <span className="text-teal-400 font-bold font-mono">{formatIndianCurrency(totalCurrentInvestmentsValue, 'AUTO')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Active Monthly SIP:</span>
              <span className="text-slate-200 font-semibold font-mono">{formatIndianCurrency(totalMonthlySip, 'AUTO')}/mo</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-teal-400 font-semibold pt-1 border-t border-slate-800/80">
              <span>20-Yr Step-Up SIP Simulator</span>
              <span>Open Schedule ➔</span>
            </div>
          </div>
        </div>

        {/* 5. NPS */}
        <div
          onClick={() => setActiveTab('NPS')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">NPS (Retirement)</h3>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Current Corpus:</span>
              <span className="text-blue-400 font-bold font-mono">{formatIndianCurrency(nps.currentCorpus, 'AUTO')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Est. at Age {nps.retirementAge}:</span>
              <span className="text-emerald-400 font-bold font-mono">{formatIndianCurrency(projectedNpsRetirementCorpus, 'AUTO')}</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              Monthly Contrib: {formatIndianCurrency(nps.employeeMonthlyContribution + nps.employerMonthlyContribution, 'AUTO')}/mo
            </div>
          </div>
        </div>

        {/* 6. NEW SECTION BESIDE NPS: Complete Salary Utilisation & Timeline */}
        <div
          onClick={() => {
            const el = document.getElementById('salary-timeline-detailed-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-5 shadow-lg cursor-pointer transition-all hover:-translate-y-0.5 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Salary Utilisation & Timeline</h3>
              </div>
            </div>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono font-semibold border border-purple-500/30">
              {totalUtilisedPct}% Allocated
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Visual mini-bar of salary usage */}
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden flex">
              <div style={{ width: `${expPct}%` }} className="bg-rose-500 h-full" title={`Expenses: ${expPct}%`} />
              <div style={{ width: `${emiPct}%` }} className="bg-amber-500 h-full" title={`Loan EMI: ${emiPct}%`} />
              <div style={{ width: `${sipPct}%` }} className="bg-teal-500 h-full" title={`SIPs: ${sipPct}%`} />
              <div style={{ width: `${surplusPct}%` }} className="bg-emerald-500 h-full" title={`Surplus: ${surplusPct}%`} />
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-slate-400">
                <span>Living Expenses:</span>
                <span className="text-rose-400 font-mono font-semibold">{formatIndianCurrency(totalMonthlyExpenses, 'AUTO')} ({expPct}%)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Debt EMIs:</span>
                <span className="text-amber-400 font-mono font-semibold">{formatIndianCurrency(totalMonthlyEmi, 'AUTO')} ({emiPct}%)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Investments & SIP:</span>
                <span className="text-teal-400 font-mono font-semibold">{formatIndianCurrency(totalMonthlySip, 'AUTO')} ({sipPct}%)</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/80">
                <span>Free Cash Surplus:</span>
                <span className="text-emerald-400 font-mono font-bold">+{formatIndianCurrency(unallocatedSurplus, 'AUTO')} ({surplusPct}%)</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 pt-0.5 italic">
              * Take-home is post-NPS (NPS deducted at payroll)
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED TIMELINE & COMPLETE UTILISATION PANEL */}
      <div
        id="salary-timeline-detailed-section"
        className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-slate-100">
                Complete Paycheck Lifecycle: Timeline-Wise Salary Utilisation
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Month-by-month chronological breakdown of how your {formatIndianCurrency(totalInflow, 'AUTO')} in-hand salary (already net of NPS and tax) flows from Day 1 to Day 30.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-950 p-2 rounded-xl border border-slate-800 shrink-0 font-mono">
            <span className="text-slate-400">Total In-Hand Inflow:</span>
            <strong className="text-emerald-400">{formatIndianCurrency(totalInflow, 'AUTO')}</strong>
          </div>
        </div>

        {/* 100% Utilisation Multi-Segment Visual Progress Waterfall */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <span>100% In-Hand Salary Utilisation Distribution</span>
            <span className="font-mono text-purple-400 font-bold">
              {totalCommittedOutflows > totalInflow ? 'Deficit / Strained' : `${totalUtilisedPct}% Committed • ${surplusPct}% Surplus`}
            </span>
          </div>

          <div className="w-full h-4 rounded-xl bg-slate-950 overflow-hidden flex p-0.5 border border-slate-800">
            <div
              style={{ width: `${expPct}%` }}
              className="bg-rose-500 h-full rounded-l-lg transition-all"
              title={`Living Expenses: ${expPct}% (${formatIndianCurrency(totalMonthlyExpenses, 'AUTO')})`}
            />
            <div
              style={{ width: `${emiPct}%` }}
              className="bg-amber-500 h-full transition-all"
              title={`Loan EMIs: ${emiPct}% (${formatIndianCurrency(totalMonthlyEmi, 'AUTO')})`}
            />
            <div
              style={{ width: `${sipPct}%` }}
              className="bg-teal-500 h-full transition-all"
              title={`Mutual Fund/ETF SIPs: ${sipPct}% (${formatIndianCurrency(totalMonthlySip, 'AUTO')})`}
            />
            <div
              style={{ width: `${surplusPct}%` }}
              className="bg-emerald-500 h-full rounded-r-lg transition-all"
              title={`Surplus Cash: ${surplusPct}% (${formatIndianCurrency(unallocatedSurplus, 'AUTO')})`}
            />
          </div>

          {/* Color legend pills */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Expenses: <strong className="text-slate-200">{expPct}%</strong> ({formatIndianCurrency(totalMonthlyExpenses, 'AUTO')})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Loan EMIs: <strong className="text-slate-200">{emiPct}%</strong> ({formatIndianCurrency(totalMonthlyEmi, 'AUTO')})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <span>Investments SIP: <strong className="text-slate-200">{sipPct}%</strong> ({formatIndianCurrency(totalMonthlySip, 'AUTO')})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Unallocated Surplus: <strong className="text-emerald-400 font-bold">{surplusPct}%</strong> ({formatIndianCurrency(unallocatedSurplus, 'AUTO')})</span>
            </div>
            <div className="text-[10px] text-slate-500 italic pl-1 border-l border-slate-800">
              * NPS is pre-deducted at source
            </div>
          </div>
        </div>

        {/* Chronological 30-Day Paycheck Milestones */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Chronological Paycheck Flow (Days 1 to 30)</span>
          </h4>

          <div className="space-y-3">
            {timelineMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-mono font-bold text-slate-200 whitespace-nowrap shrink-0 text-center">
                    {milestone.dayRange}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-100">{milestone.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${milestone.tagColor}`}>
                        {milestone.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 sm:pl-4 sm:border-l sm:border-slate-800">
                  <span
                    className={`font-mono font-extrabold text-base block ${
                      milestone.isPositive ? 'text-emerald-400' : 'text-slate-100'
                    }`}
                  >
                    {milestone.isPositive ? '+' : '-'}
                    {formatIndianCurrency(milestone.amount, 'RUPEE')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    {milestone.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Discipline Health Check */}
        <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              <strong>Budgeting Health Check:</strong> Voluntary investment & SIP rate is{' '}
              <strong className="text-emerald-400 font-mono">{sipPct}%</strong> and debt obligations are{' '}
              <strong className="text-amber-400 font-mono">{emiPct}%</strong> of in-hand monthly income (NPS already funded at payroll).
            </span>
          </div>
          <span className="text-[11px] text-slate-400 shrink-0">
            {emiPct <= 35 ? '✅ Debt within healthy limits (<35%)' : '⚠️ Debt burden is above 35%'}
          </span>
        </div>
      </div>
    </div>
  );
};


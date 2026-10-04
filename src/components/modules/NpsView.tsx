import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatIndianCurrency } from '../../utils/formatters';
import { Shield, TrendingUp, Award, DollarSign, Calendar } from 'lucide-react';

export const NpsView: React.FC = () => {
  const { nps, updateNps, projectedNpsRetirementCorpus } = useFinancial();

  const totalMonthlyContribution = nps.employeeMonthlyContribution + nps.employerMonthlyContribution;
  const yearsToRetirement = Math.max(1, nps.retirementAge - nps.currentAge);

  // PFRDA Exit Breakdown: 60% Lump Sum, 40% Annuity
  const lumpSum60 = Math.round(projectedNpsRetirementCorpus * 0.6);
  const annuity40 = Math.round(projectedNpsRetirementCorpus * 0.4);
  const estimatedMonthlyPension = Math.round((annuity40 * 0.065) / 12); // @6.5% annuity rate

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Summary */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">National Pension System (NPS)</h2>
          </div>
          <p className="text-xs text-slate-400">
            Tier-1 retirement accumulation, employer co-contributions, and annuity exit planning.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-right">
            <span className="text-slate-400 block text-[11px]">Current NPS Corpus</span>
            <span className="text-blue-400 font-bold text-lg block">
              {formatIndianCurrency(nps.currentCorpus, 'AUTO')}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-right">
            <span className="text-slate-400 block text-[11px]">Est. Corpus at Age {nps.retirementAge}</span>
            <span className="text-emerald-400 font-bold text-lg block">
              {formatIndianCurrency(projectedNpsRetirementCorpus, 'AUTO')}
            </span>
          </div>
        </div>
      </div>

      {/* NPS Configuration Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
          <span>NPS Account & Contribution Parameters</span>
          <span className="text-xs text-slate-400 font-normal">
            Horizon: {yearsToRetirement} Years ({nps.currentAge} → {nps.retirementAge})
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">PRAN Number (Optional)</label>
            <input
              type="text"
              placeholder="e.g. 110029384756"
              value={nps.pranNumber || ''}
              onChange={(e) => updateNps({ pranNumber: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Current Tier-1 Balance (₹)</label>
            <input
              type="number"
              value={nps.currentCorpus}
              onChange={(e) => updateNps({ currentCorpus: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Expected CAGR Return (%)</label>
            <input
              type="number"
              step="0.1"
              value={nps.expectedCagr}
              onChange={(e) => updateNps({ expectedCagr: parseFloat(e.target.value) || 9.0 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Employee Monthly Contribution (₹)</label>
            <input
              type="number"
              value={nps.employeeMonthlyContribution}
              onChange={(e) =>
                updateNps({ employeeMonthlyContribution: parseFloat(e.target.value) || 0 })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Employer Monthly Contribution (₹)</label>
            <input
              type="number"
              value={nps.employerMonthlyContribution}
              onChange={(e) =>
                updateNps({ employerMonthlyContribution: parseFloat(e.target.value) || 0 })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Total Monthly Contribution (₹)</label>
            <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold text-sm">
              {formatIndianCurrency(totalMonthlyContribution, 'RUPEE')} / mo
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Current Age</label>
            <input
              type="number"
              value={nps.currentAge}
              onChange={(e) => updateNps({ currentAge: parseInt(e.target.value) || 35 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Retirement Age</label>
            <input
              type="number"
              value={nps.retirementAge}
              onChange={(e) => updateNps({ retirementAge: parseInt(e.target.value) || 60 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* PFRDA Exit Planning Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Retirement Exit Rule: 60% Tax-Free Lump Sum + 40% Annuity
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">60% Lump Sum (Tax Exempt)</span>
            <span className="text-emerald-400 font-bold font-mono text-base block mt-1">
              {formatIndianCurrency(lumpSum60, 'AUTO')}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              Withdrawable in full at superannuation
            </span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">40% Mandatory Annuity</span>
            <span className="text-blue-400 font-bold font-mono text-base block mt-1">
              {formatIndianCurrency(annuity40, 'AUTO')}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              Locked with ASP for monthly pension
            </span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Estimated Monthly Pension</span>
            <span className="text-slate-100 font-bold font-mono text-base block mt-1">
              {formatIndianCurrency(estimatedMonthlyPension, 'AUTO')}/mo
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              Assumes 6.5% lifelong annuity yield
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

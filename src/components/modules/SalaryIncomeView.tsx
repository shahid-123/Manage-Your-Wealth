import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatIndianCurrency } from '../../utils/formatters';
import { Wallet, Trash2 } from 'lucide-react';

export const SalaryIncomeView: React.FC = () => {
  const {
    salary,
    updateSalary,
    otherIncomes,
    addOtherIncome,
    deleteOtherIncome,
    totalOtherIncomeMonthly,
    totalMonthlyInflow,
  } = useFinancial();

  // Local state for new secondary income stream
  const [newSource, setNewSource] = useState('');
  const [newCategory, setNewCategory] = useState<'BUSINESS' | 'RENTAL' | 'DIVIDEND' | 'INTEREST' | 'OTHER'>('RENTAL');
  const [newAmount, setNewAmount] = useState('');

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource || !newAmount) return;
    addOtherIncome({
      source: newSource,
      category: newCategory,
      monthlyAmount: parseFloat(newAmount) || 0,
    });
    setNewSource('');
    setNewAmount('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Summary */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Salary & Income</h2>
          </div>
          <p className="text-xs text-slate-400">
            Enter your monthly net in-hand salary and any additional secondary income.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs sm:text-right shrink-0">
          <span className="text-slate-400 block text-[11px]">Total Net Monthly Inflow</span>
          <span className="text-emerald-400 font-extrabold text-2xl block mt-0.5 font-mono">
            {formatIndianCurrency(totalMonthlyInflow, 'AUTO')}/mo
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            Annual: {formatIndianCurrency(totalMonthlyInflow * 12, 'AUTO')}
          </span>
        </div>
      </div>

      {/* Primary Input Card: ONLY Net Salary In-Hand */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div>
          <label className="block text-slate-200 font-bold text-sm mb-1">
            Net Monthly Salary (In-Hand)
          </label>
          <p className="text-xs text-slate-400 mb-3">
            The exact amount credited into your bank account each month after all deductions.
          </p>

          <div className="relative">
            <span className="absolute left-4 top-3.5 text-emerald-400 font-bold text-lg font-mono">
              ₹
            </span>
            <input
              type="number"
              placeholder="e.g. 135000"
              value={salary.netSalaryInHand || ''}
              onChange={(e) => updateSalary({ netSalaryInHand: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-950 border-2 border-slate-800 focus:border-emerald-500 rounded-2xl pl-10 pr-4 py-3 text-slate-100 font-mono font-bold text-xl focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Quick presets for convenience */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 text-[11px]">Quick Presets:</span>
          {[75000, 100000, 125000, 150000, 200000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => updateSalary({ netSalaryInHand: preset })}
              className={`px-3 py-1 rounded-lg border text-xs font-mono font-medium transition-colors ${
                salary.netSalaryInHand === preset
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {formatIndianCurrency(preset, 'AUTO')}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Other Incomes (Optional) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Additional Monthly Incomes (Optional)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rental income, dividend payouts, interest, or freelancing.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Total: +{formatIndianCurrency(totalOtherIncomeMonthly, 'AUTO')}/mo
          </span>
        </div>

        {/* Existing other income list */}
        {otherIncomes.length > 0 && (
          <div className="space-y-2">
            {otherIncomes.map((inc) => (
              <div
                key={inc.id}
                className="flex items-center justify-between p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-200 block">{inc.source}</span>
                  <span className="text-[10px] text-slate-500 uppercase">{inc.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-400 font-mono text-xs">
                    +{formatIndianCurrency(inc.monthlyAmount, 'RUPEE')}/mo
                  </span>
                  <button
                    onClick={() => deleteOtherIncome(inc.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Add other income form */}
        <form onSubmit={handleAddIncome} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800/80 text-xs">
          <div>
            <input
              type="text"
              placeholder="Income Source (e.g. Flat Rent, FD)"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="RENTAL">Rental Income</option>
              <option value="DIVIDEND">Dividend</option>
              <option value="INTEREST">Interest</option>
              <option value="BUSINESS">Business</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <input
              type="number"
              placeholder="Amount (₹ / month)"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors shadow-sm"
            >
              + Add Stream
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

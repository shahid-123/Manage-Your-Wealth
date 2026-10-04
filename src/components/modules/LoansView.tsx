import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatIndianCurrency } from '../../utils/formatters';
import { CreditCard, Plus, Trash2, Calendar, ShieldCheck } from 'lucide-react';

export const LoansView: React.FC = () => {
  const { loans, addLoan, deleteLoan, totalLoanOutstanding, totalMonthlyEmi } = useFinancial();

  const [loanName, setLoanName] = useState('');
  const [loanType, setLoanType] = useState<'HOME_LOAN' | 'CAR_LOAN' | 'PERSONAL_LOAN' | 'EDUCATION_LOAN' | 'OTHER'>('HOME_LOAN');
  const [outstanding, setOutstanding] = useState('');
  const [emi, setEmi] = useState('');
  const [rate, setRate] = useState('8.5');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanName || !outstanding || !emi) return;

    addLoan({
      name: loanName,
      type: loanType,
      outstandingAmount: parseFloat(outstanding) || 0,
      monthlyEmi: parseFloat(emi) || 0,
      interestRate: parseFloat(rate) || 8.5,
    });

    setLoanName('');
    setOutstanding('');
    setEmi('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Summary */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">Loans & Liabilities Manager</h2>
          </div>
          <p className="text-xs text-slate-400">
            Track active home loans, car loans, EMIs, and debt obligations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-right">
            <span className="text-slate-400 block text-[11px]">Total Debt Outstanding</span>
            <span className="text-rose-400 font-bold text-lg block">
              {formatIndianCurrency(totalLoanOutstanding, 'AUTO')}
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-right">
            <span className="text-slate-400 block text-[11px]">Total Monthly EMI</span>
            <span className="text-slate-100 font-bold text-lg block">
              {formatIndianCurrency(totalMonthlyEmi, 'AUTO')}/mo
            </span>
          </div>
        </div>
      </div>

      {/* Add New Loan Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100">Register Loan or Debt Account</h3>

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Loan Name / Bank</label>
            <input
              type="text"
              placeholder="e.g. SBI Home Loan"
              value={loanName}
              onChange={(e) => setLoanName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Type</label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="HOME_LOAN">Home Loan</option>
              <option value="CAR_LOAN">Car Loan</option>
              <option value="PERSONAL_LOAN">Personal Loan</option>
              <option value="EDUCATION_LOAN">Education Loan</option>
              <option value="OTHER">Other Debt</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Outstanding Balance (₹)</label>
            <input
              type="number"
              placeholder="e.g. 2500000"
              value={outstanding}
              onChange={(e) => setOutstanding(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Monthly EMI (₹)</label>
            <input
              type="number"
              placeholder="e.g. 28000"
              value={emi}
              onChange={(e) => setEmi(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors shadow-sm"
            >
              + Save Loan
            </button>
          </div>
        </form>
      </div>

      {/* Loans List */}
      <div className="space-y-3">
        {loans.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-xs">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            No active loans recorded. You are debt free!
          </div>
        ) : (
          loans.map((loan) => (
            <div
              key={loan.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-100 text-sm">{loan.name}</h4>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    {loan.type.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Interest Rate: {loan.interestRate}% p.a. • Monthly EMI: {formatIndianCurrency(loan.monthlyEmi, 'RUPEE')}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Remaining Principal</span>
                  <span className="text-rose-400 font-bold font-mono text-base">
                    {formatIndianCurrency(loan.outstandingAmount, 'AUTO')}
                  </span>
                </div>

                <button
                  onClick={() => deleteLoan(loan.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                  title="Remove loan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

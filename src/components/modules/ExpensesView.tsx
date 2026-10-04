import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatIndianCurrency } from '../../utils/formatters';
import { Receipt, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, deleteExpense, totalMonthlyExpenses } = useFinancial();

  const [categoryName, setCategoryName] = useState('');
  const [amount, setAmount] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName || !amount) return;
    addExpense({
      category: categoryName,
      monthlyAmount: parseFloat(amount) || 0,
    });
    setCategoryName('');
    setAmount('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Summary */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">Monthly Expenses & Outflows</h2>
          </div>
          <p className="text-xs text-slate-400">
            Track and categorize your regular monthly household and lifestyle expenditures.
          </p>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-right">
          <span className="text-slate-400 block text-[11px]">Total Monthly Expenses</span>
          <span className="text-rose-400 font-bold text-lg block">
            {formatIndianCurrency(totalMonthlyExpenses, 'AUTO')}/mo
          </span>
        </div>
      </div>

      {/* Add New Expense Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100">Add Regular Expense Item</h3>

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Expense Category / Purpose</label>
            <input
              type="text"
              placeholder="e.g. Groceries, Electricity, School Fees"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Monthly Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 15000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors shadow-sm"
            >
              + Record Expense
            </button>
          </div>
        </form>
      </div>

      {/* Expenses List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-slate-100">Active Monthly Budgets</h3>

        <div className="space-y-2.5">
          {expenses.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="font-semibold text-slate-200 text-xs">{item.category}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-slate-100 text-xs">
                  {formatIndianCurrency(item.monthlyAmount, 'RUPEE')}
                </span>
                <button
                  onClick={() => deleteExpense(item.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remove expense"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

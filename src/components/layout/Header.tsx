import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFinancial, SimpleActiveTab } from '../../context/FinancialContext';
import { CurrencyUnit } from '../../types/financial';
import {
  LogOut,
  User,
  LayoutDashboard,
  Wallet,
  Receipt,
  CreditCard,
  TrendingUp,
  Shield,
  Users,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { activeTab, setActiveTab, currencyUnit, setCurrencyUnit } = useFinancial();

  const navItems: { id: SimpleActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'SALARY_INCOME', label: 'Salary & Income', icon: Wallet },
    { id: 'EXPENSES', label: 'Expenses', icon: Receipt },
    { id: 'LOANS', label: 'Loans & Debt', icon: CreditCard },
    { id: 'INVESTMENTS', label: 'Investments', icon: TrendingUp },
    { id: 'NPS', label: 'NPS', icon: Shield },
    { id: 'COMMUNITY', label: 'Community', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Tabs */}
        <div className="flex items-center justify-between md:justify-start gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-base shadow-md shadow-emerald-500/20">
              ₹
            </div>
            <div>
              <span className="font-bold text-slate-100 text-sm tracking-tight block">
                Manage Your Wealth
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block">
                Personal Wealth, Investments & Timeline
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSel = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                    isSel
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info, Currency Switcher & Logout */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          {/* Mobile Tab Scroll (visible on small/medium screens) */}
          <div className="flex lg:hidden overflow-x-auto gap-1 py-1 text-xs">
            {navItems.map((item) => {
              const isSel = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
                    isSel ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-950'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Currency Unit Switcher */}
            <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center text-[11px]">
              {(['AUTO', 'LAKH', 'CRORE', 'RUPEE'] as CurrencyUnit[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => setCurrencyUnit(unit)}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    currencyUnit === unit
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {unit === 'AUTO' ? 'Auto' : unit === 'LAKH' ? '₹ Lakh' : unit === 'CRORE' ? '₹ Cr' : '₹ Full'}
                </button>
              ))}
            </div>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden sm:block text-right">
                <span className="text-xs font-semibold text-slate-200 block leading-tight">
                  {currentUser?.name ? currentUser.name.replace(/\s*\(?Level\s*\d+\)?/gi, '').trim() : 'User'}
                </span>
                <span className="text-[10px] text-slate-500 block leading-tight truncate max-w-[130px]">
                  {currentUser?.email}
                </span>
              </div>

              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

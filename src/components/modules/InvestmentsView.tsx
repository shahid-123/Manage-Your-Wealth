import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { formatIndianCurrency } from '../../utils/formatters';
import { TrendingUp, Plus, Trash2, ArrowUpRight, TrendingDown, Sparkles, CheckCircle2, Shield, Coins, AlertCircle, Calculator, Calendar } from 'lucide-react';
import { SipCalculatorView } from './SipCalculatorView';

interface RecommendedBucket {
  category: 'ETF' | 'MUTUAL_FUND' | 'GOLD' | 'FD';
  name: string;
  bucketType: string;
  percent: number;
  monthlyAmount: number;
  expectedReturn: string;
  rationale: string;
}

export const InvestmentsView: React.FC = () => {
  const {
    investments,
    addInvestment,
    deleteInvestment,
    totalInvestedAmount,
    totalCurrentInvestmentsValue,
    totalMonthlySip,
  } = useFinancial();

  const [activeSubTab, setActiveSubTab] = useState<'HOLDINGS' | 'SIP_CALCULATOR'>('HOLDINGS');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'MUTUAL_FUND' | 'STOCK' | 'ETF' | 'GOLD' | 'FD' | 'PPF' | 'OTHER'>('MUTUAL_FUND');
  const [invested, setInvested] = useState('');
  const [currentVal, setCurrentVal] = useState('');
  const [monthlySip, setMonthlySip] = useState('');
  const [appliedNotice, setAppliedNotice] = useState(false);

  // Recommended ₹50,000 Multi-Asset SIP Plan
  const recommendedBuckets: RecommendedBucket[] = [
    {
      bucketType: 'Large Cap (Core Index ETF)',
      name: 'Nippon India Nifty 50 BeES ETF / UTI Nifty 50 Index',
      category: 'ETF',
      percent: 30,
      monthlyAmount: 15000,
      expectedReturn: '11% – 12% CAGR',
      rationale: 'Core foundation: top 50 Indian bluechips, ultra-low expense ratio (~0.04%), zero fund-manager risk.',
    },
    {
      bucketType: 'Mid Cap (Growth & Alpha)',
      name: 'Motilal Oswal Midcap Fund / HDFC Mid-Cap Opportunities',
      category: 'MUTUAL_FUND',
      percent: 25,
      monthlyAmount: 12500,
      expectedReturn: '14% – 15% CAGR',
      rationale: 'India growth engine: high-potential market leaders delivering alpha over a 5–10 year horizon.',
    },
    {
      bucketType: 'Small Cap (High Alpha Multiplier)',
      name: 'Nippon India Small Cap Fund / Quant Small Cap',
      category: 'MUTUAL_FUND',
      percent: 15,
      monthlyAmount: 7500,
      expectedReturn: '15% – 17% CAGR',
      rationale: 'High upside multiplier: allocated at 15% to limit downside volatility while capturing massive long-term growth.',
    },
    {
      bucketType: 'Gold (Hedge & Capital Preservation)',
      name: 'Nippon India Gold BeES ETF / Sovereign Gold Bonds (SGB)',
      category: 'GOLD',
      percent: 10,
      monthlyAmount: 5000,
      expectedReturn: '8% – 10% CAGR',
      rationale: 'Crisis cushion: non-correlated asset protecting portfolio against inflation and equity market corrections.',
    },
    {
      bucketType: 'Emergency Buffer & Capital Safety',
      name: 'HDFC Liquid Fund / High-Yield Auto-Sweep FD',
      category: 'FD',
      percent: 20,
      monthlyAmount: 10000,
      expectedReturn: '6.75% – 7.25% Safe Yield',
      rationale: 'Zero equity risk: builds your 6–12 months emergency shield with instant T+0/T+1 liquidity.',
    },
  ];

  const handleApplyRecommendedSip = () => {
    recommendedBuckets.forEach((bucket) => {
      addInvestment({
        name: bucket.name,
        category: bucket.category,
        investedAmount: bucket.monthlyAmount,
        currentValue: bucket.monthlyAmount,
        monthlySip: bucket.monthlyAmount,
      });
    });
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 5000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !currentVal) return;

    const investedNum = parseFloat(invested) || parseFloat(currentVal);
    const currentNum = parseFloat(currentVal);

    addInvestment({
      name,
      category,
      investedAmount: investedNum,
      currentValue: currentNum,
      monthlySip: parseFloat(monthlySip) || 0,
    });

    setName('');
    setInvested('');
    setCurrentVal('');
    setMonthlySip('');
  };

  const totalGain = totalCurrentInvestmentsValue - totalInvestedAmount;
  const totalGainPercent = totalInvestedAmount > 0 ? (totalGain / totalInvestedAmount) * 100 : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Summary */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">Investments Portfolio</h2>
          </div>
          <p className="text-xs text-slate-400">
            Mutual funds, stocks, index ETFs, gold, and fixed deposits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-right">
            <span className="text-slate-400 block text-[11px]">Current Portfolio Value</span>
            <span className="text-teal-400 font-bold text-lg block font-mono">
              {formatIndianCurrency(totalCurrentInvestmentsValue, 'AUTO')}
            </span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-right">
            <span className="text-slate-400 block text-[11px]">Active Monthly SIP</span>
            <span className="text-slate-100 font-bold text-lg block font-mono">
              {formatIndianCurrency(totalMonthlySip, 'AUTO')}/mo
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Switcher */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs w-fit shadow-md">
        <button
          onClick={() => setActiveSubTab('HOLDINGS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'HOLDINGS'
              ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>My Holdings & ₹50K Blueprint</span>
        </button>

        <button
          onClick={() => setActiveSubTab('SIP_CALCULATOR')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'SIP_CALCULATOR'
              ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>20-Year Step-Up SIP Calculator & Dates</span>
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold">
            20-Yr Schedule
          </span>
        </button>
      </div>

      {activeSubTab === 'SIP_CALCULATOR' ? (
        <SipCalculatorView />
      ) : (
        <>
          {/* Recommended ₹50,000 / Month Investment Allocation Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-slate-100">
                Recommended ₹50,000 / Month Multi-Asset SIP Plan
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Optimized risk-adjusted distribution: Large Cap (30%) + Mid Cap (25%) + Small Cap (15%) + Gold (10%) + Emergency Buffer (20%).
            </p>
          </div>

          <button
            onClick={handleApplyRecommendedSip}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Apply All 5 SIPs to My Portfolio</span>
          </button>
        </div>

        {appliedNotice && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All 5 recommended SIPs (₹50,000/mo total) have been successfully added to your active investments list below!</span>
          </div>
        )}

        {/* 5 Recommendation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          {recommendedBuckets.map((bucket, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                    {bucket.bucketType}
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold text-xs">
                    {bucket.percent}%
                  </span>
                </div>

                <div className="font-bold text-slate-100 text-sm mb-1">
                  {formatIndianCurrency(bucket.monthlyAmount, 'RUPEE')}/mo
                </div>

                <div className="text-teal-400/90 font-medium text-xs mb-1.5">
                  {bucket.name}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {bucket.rationale}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>Exp. Yield:</span>
                <span className="font-mono text-slate-300 font-semibold">{bucket.expectedReturn}</span>
              </div>
            </div>
          ))}

          {/* Allocation Summary Card */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide block mb-1">
                Plan Overview
              </span>
              <div className="text-xl font-extrabold text-slate-100 font-mono">
                ₹50,000 / month
              </div>
              <div className="text-xs text-slate-400 mt-2 space-y-1">
                <div>• Equities (Large/Mid/Small): <strong>70% (₹35k)</strong></div>
                <div>• Gold Hedge: <strong>10% (₹5k)</strong></div>
                <div>• Emergency Buffer: <strong>20% (₹10k)</strong></div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 italic">
              Blended expected CAGR: ~12.2% p.a. with built-in safety net.
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Investment Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100">Add Custom Holding / SIP</h3>

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Asset / Fund Name</label>
            <input
              type="text"
              placeholder="e.g. Parag Parikh Flexi Cap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="MUTUAL_FUND">Mutual Fund</option>
              <option value="STOCK">Direct Stock</option>
              <option value="ETF">Index ETF</option>
              <option value="GOLD">Gold / SGB</option>
              <option value="FD">Fixed Deposit</option>
              <option value="PPF">PPF / EPF</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Invested Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={invested}
              onChange={(e) => setInvested(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Current Value (₹)</label>
            <input
              type="number"
              placeholder="e.g. 65000"
              value={currentVal}
              onChange={(e) => setCurrentVal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors shadow-sm"
            >
              + Save Holding
            </button>
          </div>
        </form>
      </div>

      {/* Current Active Investments List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100">
            My Portfolio Holdings ({investments.length})
          </h3>
          <span className="text-xs text-slate-400">
            Total Monthly SIP: <strong className="text-emerald-400 font-mono">{formatIndianCurrency(totalMonthlySip, 'AUTO')}/mo</strong>
          </span>
        </div>

        <div className="space-y-3">
          {investments.map((inv) => {
            const gain = inv.currentValue - inv.investedAmount;
            const gainPct = inv.investedAmount > 0 ? (gain / inv.investedAmount) * 100 : 0;

            return (
              <div
                key={inv.id}
                className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-100 text-sm">{inv.name}</h4>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {inv.category.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Invested: {formatIndianCurrency(inv.investedAmount, 'AUTO')}
                    {inv.monthlySip > 0 ? ` • Monthly SIP: ${formatIndianCurrency(inv.monthlySip, 'RUPEE')}/mo` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Current Value</span>
                    <span className="text-teal-400 font-bold font-mono text-base block">
                      {formatIndianCurrency(inv.currentValue, 'AUTO')}
                    </span>
                    <span
                      className={`text-[11px] font-mono ${
                        gain >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {gain >= 0 ? '+' : ''}
                      {formatIndianCurrency(gain, 'AUTO')} ({gainPct.toFixed(1)}%)
                    </span>
                  </div>

                  <button
                    onClick={() => deleteInvestment(inv.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    title="Remove investment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
        </>
      )}
    </div>
  );
};


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinancialProvider, useFinancial } from './context/FinancialContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { Header } from './components/layout/Header';

// 6 Core Modules
import { SimpleDashboard } from './components/dashboard/SimpleDashboard';
import { SalaryIncomeView } from './components/modules/SalaryIncomeView';
import { ExpensesView } from './components/modules/ExpensesView';
import { LoansView } from './components/modules/LoansView';
import { InvestmentsView } from './components/modules/InvestmentsView';
import { NpsView } from './components/modules/NpsView';
import { CommunityView } from './components/modules/CommunityView';

const AuthenticatedApp: React.FC = () => {
  const { activeTab } = useFinancial();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      <Header />
      <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
        {activeTab === 'DASHBOARD' && <SimpleDashboard />}
        {activeTab === 'SALARY_INCOME' && <SalaryIncomeView />}
        {activeTab === 'EXPENSES' && <ExpensesView />}
        {activeTab === 'LOANS' && <LoansView />}
        {activeTab === 'INVESTMENTS' && <InvestmentsView />}
        {activeTab === 'NPS' && <NpsView />}
        {activeTab === 'COMMUNITY' && <CommunityView />}
      </main>
    </div>
  );
};

const RootRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <FinancialProvider>
      <AuthenticatedApp />
    </FinancialProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RootRouter />
    </AuthProvider>
  );
}

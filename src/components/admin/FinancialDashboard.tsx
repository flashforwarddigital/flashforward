import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ApiCost, Revenue, Expense } from '../AdminPage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DollarSign, Plus, Trash2, Edit, TrendingUp, TrendingDown, Filter, Download } from 'lucide-react';

interface FinancialDashboardProps {
  apiCosts: ApiCost[];
  revenues: Revenue[];
  expenses: Expense[];
  setApiCosts: React.Dispatch<React.SetStateAction<ApiCost[]>>;
  setRevenues: React.Dispatch<React.SetStateAction<Revenue[]>>;
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  apiCosts,
  revenues,
  expenses,
  setApiCosts,
  setRevenues,
  setExpenses
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'api-costs' | 'revenues' | 'expenses'>('overview');
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year' | 'all'>('month');
  const [isAddingApiCost, setIsAddingApiCost] = useState(false);
  const [isAddingRevenue, setIsAddingRevenue] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [newApiCost, setNewApiCost] = useState<Partial<ApiCost>>({
    provider: '',
    service: '',
    cost: 0,
    period: 'monthly',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [newRevenue, setNewRevenue] = useState<Partial<Revenue>>({
    source: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'subscription'
  });
  
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    category: 'api',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    recurring: false
  });
  
  // CRUD operations
  const handleAddApiCost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('api_costs')
        .insert(newApiCost)
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        setApiCosts(prev => [...prev, data]);
        setNewApiCost({
          provider: '',
          service: '',
          cost: 0,
          period: 'monthly',
          date: new Date().toISOString().split('T')[0]
        });
        setIsAddingApiCost(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add API cost');
    }
  };
  
  const handleAddRevenue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('revenues')
        .insert(newRevenue)
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        setRevenues(prev => [...prev, data]);
        setNewRevenue({
          source: '',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          category: 'subscription'
        });
        setIsAddingRevenue(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add revenue');
    }
  };
  
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert(newExpense)
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        setExpenses(prev => [...prev, data]);
        setNewExpense({
          category: 'api',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          recurring: false
        });
        setIsAddingExpense(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add expense');
    }
  };
  
  const handleDeleteApiCost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API cost?')) {
      return;
    }
    
    setError(null);
    
    try {
      const { error } = await supabase
        .from('api_costs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setApiCosts(prev => prev.filter(cost => cost.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete API cost');
    }
  };
  
  const handleDeleteRevenue = async (id: string) => {
    if (!confirm('Are you sure you want to delete this revenue?')) {
      return;
    }
    
    setError(null);
    
    try {
      const { error } = await supabase
        .from('revenues')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setRevenues(prev => prev.filter(revenue => revenue.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete revenue');
    }
  };
  
  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    
    setError(null);
    
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
    }
  };
  
  // Data processing for charts
  const getFilteredData = <T extends { date: string }>(data: T[]): T[] => {
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // All time
    }
    
    return data.filter(item => new Date(item.date) >= startDate);
  };
  
  const filteredApiCosts = getFilteredData(apiCosts);
  const filteredRevenues = getFilteredData(revenues);
  const filteredExpenses = getFilteredData(expenses);
  
  // Calculate totals
  const totalApiCosts = filteredApiCosts.reduce((sum, cost) => sum + cost.cost, 0);
  const totalRevenues = filteredRevenues.reduce((sum, revenue) => sum + revenue.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalRevenues - totalExpenses;
  
  // Process data for charts
  const processApiCostsByProvider = () => {
    const costsByProvider: Record<string, number> = {};
    
    filteredApiCosts.forEach(cost => {
      if (!costsByProvider[cost.provider]) {
        costsByProvider[cost.provider] = 0;
      }
      costsByProvider[cost.provider] += cost.cost;
    });
    
    return Object.entries(costsByProvider).map(([provider, cost]) => ({
      name: provider,
      value: cost
    }));
  };
  
  const processRevenuesByCategory = () => {
    const revenuesByCategory: Record<string, number> = {};
    
    filteredRevenues.forEach(revenue => {
      if (!revenuesByCategory[revenue.category]) {
        revenuesByCategory[revenue.category] = 0;
      }
      revenuesByCategory[revenue.category] += revenue.amount;
    });
    
    return Object.entries(revenuesByCategory).map(([category, amount]) => ({
      name: category,
      value: amount
    }));
  };
  
  const processExpensesByCategory = () => {
    const expensesByCategory: Record<string, number> = {};
    
    filteredExpenses.forEach(expense => {
      if (!expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] = 0;
      }
      expensesByCategory[expense.category] += expense.amount;
    });
    
    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      name: category,
      value: amount
    }));
  };
  
  const processMonthlyData = () => {
    const months: Record<string, { month: string, revenue: number, expense: number, profit: number }> = {};
    
    // Get the last 12 months
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - i);
      const monthKey = date.toISOString().substring(0, 7); // YYYY-MM
      const monthName = date.toLocaleString('default', { month: 'short' });
      months[monthKey] = { month: monthName, revenue: 0, expense: 0, profit: 0 };
    }
    
    // Add revenue data
    filteredRevenues.forEach(revenue => {
      const monthKey = revenue.date.substring(0, 7);
      if (months[monthKey]) {
        months[monthKey].revenue += revenue.amount;
      }
    });
    
    // Add expense data
    filteredExpenses.forEach(expense => {
      const monthKey = expense.date.substring(0, 7);
      if (months[monthKey]) {
        months[monthKey].expense += expense.amount;
      }
    });
    
    // Calculate profit
    Object.keys(months).forEach(key => {
      months[key].profit = months[key].revenue - months[key].expense;
    });
    
    // Convert to array and sort by date
    return Object.values(months).reverse();
  };
  
  const apiCostsByProvider = processApiCostsByProvider();
  const revenuesByCategory = processRevenuesByCategory();
  const expensesByCategory = processExpensesByCategory();
  const monthlyData = processMonthlyData();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light tracking-tight">Financial Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 'month' 
                ? 'bg-[#0CF2A0] text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('quarter')}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 'quarter' 
                ? 'bg-[#0CF2A0] text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Quarter
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 'year' 
                ? 'bg-[#0CF2A0] text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Year
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 'all' 
                ? 'bg-[#0CF2A0] text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Time
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm">
          {error}
        </div>
      )}
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-light ${
            activeTab === 'overview'
              ? 'text-[#0CF2A0] border-b-2 border-[#0CF2A0]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('api-costs')}
          className={`px-4 py-2 font-light ${
            activeTab === 'api-costs'
              ? 'text-[#0CF2A0] border-b-2 border-[#0CF2A0]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          API Costs
        </button>
        <button
          onClick={() => setActiveTab('revenues')}
          className={`px-4 py-2 font-light ${
            activeTab === 'revenues'
              ? 'text-[#0CF2A0] border-b-2 border-[#0CF2A0]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Revenues
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 font-light ${
            activeTab === 'expenses'
              ? 'text-[#0CF2A0] border-b-2 border-[#0CF2A0]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Expenses
        </button>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-green-500/20">
                  <TrendingUp className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-300">Total Revenue</h3>
                  <p className="text-3xl font-light text-white">{formatCurrency(totalRevenues)}</p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {timeRange === 'month' ? 'Last 30 days' : 
                 timeRange === 'quarter' ? 'Last 90 days' : 
                 timeRange === 'year' ? 'Last 12 months' : 'All time'}
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-red-500/20">
                  <TrendingDown className="text-red-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-300">Total Expenses</h3>
                  <p className="text-3xl font-light text-white">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {timeRange === 'month' ? 'Last 30 days' : 
                 timeRange === 'quarter' ? 'Last 90 days' : 
                 timeRange === 'year' ? 'Last 12 months' : 'All time'}
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-blue-500/20">
                  <DollarSign className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-300">Net Profit</h3>
                  <p className={`text-3xl font-light ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(netProfit)}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {(netProfit / totalRevenues * 100).toFixed(1)}% profit margin
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-yellow-500/20">
                  <Filter className="text-yellow-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-300">API Costs</h3>
                  <p className="text-3xl font-light text-white">{formatCurrency(totalApiCosts)}</p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {(totalApiCosts / totalExpenses * 100).toFixed(1)}% of expenses
              </div>
            </div>
          </div>
          
          {/* Monthly Revenue/Expense Chart */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-light tracking-tight">Monthly Financial Overview</h3>
              <button className="p-2 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
                <Download size={18} />
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="#0CF2A0" />
                  <Bar dataKey="expense" name="Expenses" fill="#FF1493" />
                  <Bar dataKey="profit" name="Profit" fill="#FFCC00" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Pie Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-light mb-4 tracking-tight">API Costs by Provider</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={apiCostsByProvider}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {apiCostsByProvider.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value as number)}
                      contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-light mb-4 tracking-tight">Revenue by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenuesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenuesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value as number)}
                      contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-light mb-4 tracking-tight">Expenses by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value as number)}
                      contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* API Costs Tab */}
      {activeTab === 'api-costs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-light tracking-tight">API Costs</h3>
            <button
              onClick={() => setIsAddingApiCost(true)}
              className="px-3 py-1 rounded bg-[#0CF2A0] text-black hover:bg-[#07C280] transition-colors flex items-center gap-1"
            >
              <Plus size={16} />
              Add API Cost
            </button>
          </div>
          
          {isAddingApiCost && (
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <h4 className="text-lg font-light mb-4 tracking-tight">Add New API Cost</h4>
              <form onSubmit={handleAddApiCost} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Provider *
                    </label>
                    <input
                      type="text"
                      value={newApiCost.provider}
                      onChange={(e) => setNewApiCost({ ...newApiCost, provider: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                      placeholder="e.g., OpenAI, Replicate, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Service *
                    </label>
                    <input
                      type="text"
                      value={newApiCost.service}
                      onChange={(e) => setNewApiCost({ ...newApiCost, service: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                      placeholder="e.g., GPT-4, Image Generation, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Cost *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newApiCost.cost}
                      onChange={(e) => setNewApiCost({ ...newApiCost, cost: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Period *
                    </label>
                    <select
                      value={newApiCost.period}
                      onChange={(e) => setNewApiCost({ ...newApiCost, period: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                      <option value="one-time">One-time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newApiCost.date}
                      onChange={(e) => setNewApiCost({ ...newApiCost, date: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={newApiCost.notes || ''}
                      onChange={(e) => setNewApiCost({ ...newApiCost, notes: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      placeholder="Optional notes"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingApiCost(false)}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0CF2A0] text-black rounded hover:bg-[#07C280] transition-colors"
                  >
                    Add API Cost
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Provider</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Service</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Cost</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Period</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Notes</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiCosts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-gray-500">
                        No API costs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    apiCosts.map(cost => (
                      <tr key={cost.id} className="border-b border-gray-800">
                        <td className="py-3 px-4 text-gray-300">{cost.provider}</td>
                        <td className="py-3 px-4 text-gray-300">{cost.service}</td>
                        <td className="py-3 px-4 text-gray-300">{formatCurrency(cost.cost)}</td>
                        <td className="py-3 px-4 text-gray-400">{cost.period}</td>
                        <td className="py-3 px-4 text-gray-400">{new Date(cost.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-gray-400">{cost.notes || '-'}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteApiCost(cost.id)}
                            className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Revenues Tab */}
      {activeTab === 'revenues' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-light tracking-tight">Revenues</h3>
            <button
              onClick={() => setIsAddingRevenue(true)}
              className="px-3 py-1 rounded bg-[#0CF2A0] text-black hover:bg-[#07C280] transition-colors flex items-center gap-1"
            >
              <Plus size={16} />
              Add Revenue
            </button>
          </div>
          
          {isAddingRevenue && (
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <h4 className="text-lg font-light mb-4 tracking-tight">Add New Revenue</h4>
              <form onSubmit={handleAddRevenue} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Source *
                    </label>
                    <input
                      type="text"
                      value={newRevenue.source}
                      onChange={(e) => setNewRevenue({ ...newRevenue, source: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                      placeholder="e.g., Client Name, Subscription, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Amount *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newRevenue.amount}
                      onChange={(e) => setNewRevenue({ ...newRevenue, amount: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Category *
                    </label>
                    <select
                      value={newRevenue.category}
                      onChange={(e) => setNewRevenue({ ...newRevenue, category: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    >
                      <option value="subscription">Subscription</option>
                      <option value="one-time">One-time Payment</option>
                      <option value="project">Project</option>
                      <option value="service">Service</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newRevenue.date}
                      onChange={(e) => setNewRevenue({ ...newRevenue, date: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newRevenue.description || ''}
                      onChange={(e) => setNewRevenue({ ...newRevenue, description: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      placeholder="Optional description"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingRevenue(false)}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0CF2A0] text-black rounded hover:bg-[#07C280] transition-colors"
                  >
                    Add Revenue
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Source</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Amount</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Category</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Description</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {revenues.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-gray-500">
                        No revenues recorded yet.
                      </td>
                    </tr>
                  ) : (
                    revenues.map(revenue => (
                      <tr key={revenue.id} className="border-b border-gray-800">
                        <td className="py-3 px-4 text-gray-300">{revenue.source}</td>
                        <td className="py-3 px-4 text-green-400">{formatCurrency(revenue.amount)}</td>
                        <td className="py-3 px-4 text-gray-400">{revenue.category}</td>
                        <td className="py-3 px-4 text-gray-400">{new Date(revenue.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-gray-400">{revenue.description || '-'}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteRevenue(revenue.id)}
                            className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-light tracking-tight">Expenses</h3>
            <button
              onClick={() => setIsAddingExpense(true)}
              className="px-3 py-1 rounded bg-[#0CF2A0] text-black hover:bg-[#07C280] transition-colors flex items-center gap-1"
            >
              <Plus size={16} />
              Add Expense
            </button>
          </div>
          
          {isAddingExpense && (
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <h4 className="text-lg font-light mb-4 tracking-tight">Add New Expense</h4>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Category *
                    </label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    >
                      <option value="api">API</option>
                      <option value="hosting">Hosting</option>
                      <option value="software">Software</option>
                      <option value="hardware">Hardware</option>
                      <option value="marketing">Marketing</option>
                      <option value="salary">Salary</option>
                      <option value="office">Office</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Amount *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Recurring
                    </label>
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={newExpense.recurring}
                        onChange={(e) => setNewExpense({ ...newExpense, recurring: e.target.checked })}
                        className="h-4 w-4 text-[#0CF2A0] focus:ring-[#0CF2A0] border-gray-700 rounded"
                      />
                      <span className="ml-2 text-gray-300">This is a recurring expense</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newExpense.description || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      placeholder="Optional description"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingExpense(false)}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0CF2A0] text-black rounded hover:bg-[#07C280] transition-colors"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Category</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Amount</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Description</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Recurring</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-gray-500">
                        No expenses recorded yet.
                      </td>
                    </tr>
                  ) : (
                    expenses.map(expense => (
                      <tr key={expense.id} className="border-b border-gray-800">
                        <td className="py-3 px-4 text-gray-300">{expense.category}</td>
                        <td className="py-3 px-4 text-red-400">{formatCurrency(expense.amount)}</td>
                        <td className="py-3 px-4 text-gray-400">{new Date(expense.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-gray-400">{expense.description || '-'}</td>
                        <td className="py-3 px-4 text-gray-400">{expense.recurring ? 'Yes' : 'No'}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialDashboard;
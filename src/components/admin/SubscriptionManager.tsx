import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Subscription } from '../AdminPage';
import { CreditCard, Plus, Trash2, Edit, Check, X, DollarSign, Calendar, User } from 'lucide-react';

interface SubscriptionManagerProps {
  subscriptions: Subscription[];
  setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  subscriptions,
  setSubscriptions
}) => {
  const [isAddingSubscription, setIsAddingSubscription] = useState(false);
  const [isEditingSubscription, setIsEditingSubscription] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [newSubscription, setNewSubscription] = useState<Partial<Subscription>>({
    customer_name: '',
    customer_email: '',
    plan_name: '',
    amount: 0,
    currency: 'USD',
    interval: 'month',
    status: 'active',
    start_date: new Date().toISOString().split('T')[0],
    next_billing_date: '',
    payment_method: 'credit_card'
  });
  
  // CRUD operations
  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Generate a customer ID if not provided
      const customer_id = `cus_${Math.random().toString(36).substring(2, 10)}`;
      
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          ...newSubscription,
          customer_id,
          start_date: newSubscription.start_date || new Date().toISOString().split('T')[0]
        })
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        setSubscriptions(prev => [...prev, data]);
        setNewSubscription({
          customer_name: '',
          customer_email: '',
          plan_name: '',
          amount: 0,
          currency: 'USD',
          interval: 'month',
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
          next_billing_date: '',
          payment_method: 'credit_card'
        });
        setIsAddingSubscription(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add subscription');
    }
  };
  
  const handleUpdateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!selectedSubscription) return;
    
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update(newSubscription)
        .eq('id', selectedSubscription.id)
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        setSubscriptions(prev => prev.map(subscription => 
          subscription.id === data.id ? data : subscription
        ));
        setSelectedSubscription(data);
        setIsEditingSubscription(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscription');
    }
  };
  
  const handleDeleteSubscription = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) {
      return;
    }
    
    setError(null);
    
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSubscriptions(prev => prev.filter(subscription => subscription.id !== id));
      
      if (selectedSubscription?.id === id) {
        setSelectedSubscription(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subscription');
    }
  };
  
  const handleUpdateSubscriptionStatus = async (id: string, status: Subscription['status']) => {
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        setSubscriptions(prev => prev.map(subscription => 
          subscription.id === data.id ? data : subscription
        ));
        
        if (selectedSubscription?.id === id) {
          setSelectedSubscription(data);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscription status');
    }
  };
  
  // Helper functions
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'canceled':
        return 'bg-red-500/20 text-red-400';
      case 'past_due':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  // Calculate metrics
  const calculateMonthlyRecurringRevenue = () => {
    return subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((total, sub) => {
        if (sub.interval === 'month') {
          return total + sub.amount;
        } else if (sub.interval === 'year') {
          return total + (sub.amount / 12);
        }
        return total;
      }, 0);
  };
  
  const calculateAnnualRecurringRevenue = () => {
    return calculateMonthlyRecurringRevenue() * 12;
  };
  
  const calculateTotalSubscribers = () => {
    return subscriptions.filter(sub => sub.status === 'active').length;
  };
  
  const calculateAverageRevenuePerUser = () => {
    const activeSubscribers = calculateTotalSubscribers();
    return activeSubscribers > 0 ? calculateMonthlyRecurringRevenue() / activeSubscribers : 0;
  };
  
  const mrr = calculateMonthlyRecurringRevenue();
  const arr = calculateAnnualRecurringRevenue();
  const totalSubscribers = calculateTotalSubscribers();
  const arpu = calculateAverageRevenuePerUser();
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light tracking-tight">Subscription Management</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm">
          {error}
        </div>
      )}
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-blue-500/20">
              <DollarSign className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-300">MRR</h3>
              <p className="text-3xl font-light text-white">{formatCurrency(mrr)}</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Monthly Recurring Revenue
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-green-500/20">
              <DollarSign className="text-green-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-300">ARR</h3>
              <p className="text-3xl font-light text-white">{formatCurrency(arr)}</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Annual Recurring Revenue
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-purple-500/20">
              <User className="text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-300">Subscribers</h3>
              <p className="text-3xl font-light text-white">{totalSubscribers}</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Active Subscribers
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-yellow-500/20">
              <DollarSign className="text-yellow-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-300">ARPU</h3>
              <p className="text-3xl font-light text-white">{formatCurrency(arpu)}</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Average Revenue Per User
          </div>
        </div>
      </div>
      
      {/* Subscription Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription List */}
        <div className="lg:col-span-1 bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-light tracking-tight">Subscriptions</h3>
            <button
              onClick={() => {
                setIsAddingSubscription(true);
                setSelectedSubscription(null);
                setNewSubscription({
                  customer_name: '',
                  customer_email: '',
                  plan_name: '',
                  amount: 0,
                  currency: 'USD',
                  interval: 'month',
                  status: 'active',
                  start_date: new Date().toISOString().split('T')[0],
                  next_billing_date: '',
                  payment_method: 'credit_card'
                });
              }}
              className="p-2 rounded-full bg-[#0CF2A0] text-black hover:bg-[#07C280] transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {subscriptions.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No subscriptions yet. Add your first subscription!
              </div>
            ) : (
              subscriptions.map(subscription => (
                <div
                  key={subscription.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSubscription?.id === subscription.id
                      ? 'bg-gray-800 border-l-4 border-[#0CF2A0]'
                      : 'bg-black/30 hover:bg-gray-900'
                  }`}
                  onClick={() => {
                    setSelectedSubscription(subscription);
                    setIsAddingSubscription(false);
                    setIsEditingSubscription(false);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white">{subscription.customer_name}</h4>
                      <p className="text-sm text-gray-400">{subscription.plan_name}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(subscription.status)}`}>
                      {subscription.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    {formatCurrency(subscription.amount, subscription.currency)} / {subscription.interval}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Subscription Details or Form */}
        <div className="lg:col-span-2 bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          {isAddingSubscription ? (
            <div>
              <h3 className="text-lg font-light mb-4 tracking-tight">Add New Subscription</h3>
              <form onSubmit={handleAddSubscription} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={newSubscription.customer_name}
                      onChange={(e) => setNewSubscription({ ...newSubscription, customer_name: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Customer Email *
                    </label>
                    <input
                      type="email"
                      value={newSubscription.customer_email}
                      onChange={(e) => setNewSubscription({ ...newSubscription, customer_email: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      value={newSubscription.plan_name}
                      onChange={(e) => setNewSubscription({ ...newSubscription, plan_name: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
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
                      value={newSubscription.amount}
                      onChange={(e) => setNewSubscription({ ...newSubscription, amount: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Currency
                    </label>
                    <select
                      value={newSubscription.currency}
                      onChange={(e) => setNewSubscription({ ...newSubscription, currency: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="AUD">AUD</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Interval
                    </label>
                    <select
                      value={newSubscription.interval}
                      onChange={(e) => setNewSubscription({ ...newSubscription, interval: e.target.value as Subscription['interval'] })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                    >
                      <option value="month">Monthly</option>
                      <option value="year">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Status
                    </label>
                    <select
                      value={newSubscription.status}
                      onChange={(e) => setNewSubscription({ ...newSubscription, status: e.target.value as Subscription['status'] })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                    >
                      <option value="active">Active</option>
                      <option value="canceled">Canceled</option>
                      <option value="past_due">Past Due</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={newSubscription.start_date}
                      onChange={(e) => setNewSubscription({ ...newSubscription, start_date: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Next Billing Date
                    </label>
                    <input
                      type="date"
                      value={newSubscription.next_billing_date}
                      onChange={(e) => setNewSubscription({ ...newSubscription, next_billing_date: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Payment Method
                    </label>
                    <select
                      value={newSubscription.payment_method}
                      onChange={(e) => setNewSubscription({ ...newSubscription, payment_method: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingSubscription(false)}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0CF2A0] text-black rounded hover:bg-[#07C280] transition-colors"
                  >
                    Add Subscription
                  </button>
                </div>
              </form>
            </div>
          ) : isEditingSubscription && selectedSubscription ? (
            <div>
              <h3 className="text-lg font-light mb-4 tracking-tight">Edit Subscription</h3>
              <form onSubmit={handleUpdateSubscription} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={newSubscription.customer_name}
                      onChange={(e) => setNewSubscription({ ...newSubscription, customer_name: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Customer Email *
                    </label>
                    <input
                      type="email"
                      value={newSubscription.customer_email}
                      onChange={(e) => setNewSubscription({ ...newSubscription, customer_email: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      value={newSubscription.plan_name}
                      onChange={(e) => setNewSubscription({ ...newSubscription, plan_name: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
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
                      value={newSubscription.amount}
                      onChange={(e) => setNewSubscription({ ...newSubscription, amount: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Currency
                    </label>
                    <select
                      value={newSubscription.currency}
                      onChange={(e) => setNewSubscription({ ...newSubscription, currency: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="AUD">AUD</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Interval
                    </label>
                    <select
                      value={newSubscription.interval}
                      onChange={(e) => setNewSubscription({ ...newSubscription, interval: e.target.value as Subscription['interval'] })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                    >
                      <option value="month">Monthly</option>
                      <option value="year">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Status
                    </label>
                    <select
                      value={newSubscription.status}
                      onChange={(e) => setNewSubscription({ ...newSubscription, status: e.target.value as Subscription['status'] })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                    >
                      <option value="active">Active</option>
                      <option value="canceled">Canceled</option>
                      <option value="past_due">Past Due</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={newSubscription.start_date}
                      onChange={(e) => setNewSubscription({ ...newSubscription, start_date: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Next Billing Date
                    </label>
                    <input
                      type="date"
                      value={newSubscription.next_billing_date}
                      onChange={(e) => setNewSubscription({ ...newSubscription, next_billing_date: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Payment Method
                    </label>
                    <select
                      value={newSubscription.payment_method}
                      onChange={(e) => setNewSubscription({ ...newSubscription, payment_method: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingSubscription(false)}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0CF2A0] text-black rounded hover:bg-[#07C280] transition-colors"
                  >
                    Update Subscription
                  </button>
                </div>
              </form>
            </div>
          ) : selectedSubscription ? (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-light tracking-tight">{selectedSubscription.plan_name}</h3>
                  <p className="text-gray-400">{selectedSubscription.customer_name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditingSubscription(true);
                      setNewSubscription({ ...selectedSubscription });
                    }}
                    className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteSubscription(selectedSubscription.id)}
                    className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-black/20 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-400 mb-2">Subscription Details</h4>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="text-gray-500">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedSubscription.status)}`}>
                        {selectedSubscription.status}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-500">Plan:</span>
                      <span>{selectedSubscription.plan_name}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-500">Amount:</span>
                      <span>{formatCurrency(selectedSubscription.amount, selectedSubscription.currency)}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-500">Billing Cycle:</span>
                      <span>{selectedSubscription.interval === 'month' ? 'Monthly' : 'Yearly'}</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-black/20 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-400 mb-2">Customer Information</h4>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="text-gray-500">Name:</span>
                      <span>{selectedSubscription.customer_name}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-500">Email:</span>
                      <a href={`mailto:${selectedSubscription.customer_email}`} className="text-blue-400 hover:underline">
                        {selectedSubscription.customer_email}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-500">Customer ID:</span>
                      <span>{selectedSubscription.customer_id}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-500">Payment Method:</span>
                      <span>{selectedSubscription.payment_method || 'N/A'}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-black/20 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-400 mb-2">Billing Information</h4>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="text-gray-500">Start Date:</span>
                      <span>{formatDate(selectedSubscription.start_date)}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-500">Next Billing:</span>
                      <span>{formatDate(selectedSubscription.next_billing_date)}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-500">End Date:</span>
                      <span>{formatDate(selectedSubscription.end_date)}</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-black/20 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-400 mb-2">Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubscription.status !== 'active' && (
                      <button
                        onClick={() => handleUpdateSubscriptionStatus(selectedSubscription.id, 'active')}
                        className="px-3 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                      >
                        <Check size={16} className="mr-1 inline-block" />
                        Activate
                      </button>
                    )}
                    {selectedSubscription.status !== 'canceled' && (
                      <button
                        onClick={() => handleUpdateSubscriptionStatus(selectedSubscription.id, 'canceled')}
                        className="px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <X size={16} className="mr-1 inline-block" />
                        Cancel
                      </button>
                    )}
                    {selectedSubscription.status !== 'past_due' && (
                      <button
                        onClick={() => handleUpdateSubscriptionStatus(selectedSubscription.id, 'past_due')}
                        className="px-3 py-1 rounded bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                      >
                        <Calendar size={16} className="mr-1 inline-block" />
                        Mark Past Due
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <CreditCard size={64} className="text-gray-700 mb-4" />
              <p className="text-gray-500 text-center">
                Select a subscription to view details or add a new subscription to get started.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Subscription List Table */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
        <h3 className="text-lg font-light mb-4 tracking-tight">All Subscriptions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 font-normal text-gray-400">Customer</th>
                <th className="text-left py-3 px-4 font-normal text-gray-400">Plan</th>
                <th className="text-left py-3 px-4 font-normal text-gray-400">Amount</th>
                <th className="text-left py-3 px-4 font-normal text-gray-400">Interval</th>
                <th className="text-left py-3 px-4 font-normal text-gray-400">Status</th>
                <th className="text-left py-3 px-4 font-normal text-gray-400">Start Date</th>
                <th className="text-left py-3 px-4 font-normal text-gray-400">Next Billing</th>
                <th className="text-left py-3 px-4 font-normal text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-gray-500">
                    No subscriptions recorded yet.
                  </td>
                </tr>
              ) : (
                subscriptions.map(subscription => (
                  <tr key={subscription.id} className="border-b border-gray-800">
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-white">{subscription.customer_name}</div>
                        <div className="text-xs text-gray-400">{subscription.customer_email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{subscription.plan_name}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {formatCurrency(subscription.amount, subscription.currency)}
                    </td>
                    <td className="py-3 px-4 text-gray-400">{subscription.interval}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(subscription.status)}`}>
                        {subscription.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{formatDate(subscription.start_date)}</td>
                    <td className="py-3 px-4 text-gray-400">{formatDate(subscription.next_billing_date)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setSelectedSubscription(subscription);
                            setIsEditingSubscription(true);
                            setNewSubscription({ ...subscription });
                          }}
                          className="p-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSubscription(subscription.id)}
                          className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;
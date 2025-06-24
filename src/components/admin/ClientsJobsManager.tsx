import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Client, Job } from '../AdminPage';
import { Briefcase, Plus, Trash2, Edit, Check, X, Calendar, DollarSign, User, Building, Phone, Mail, FileText, Clock } from 'lucide-react';

interface ClientsJobsManagerProps {
  clients: Client[];
  jobs: Job[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  currentUserId: string | null;
}

const ClientsJobsManager: React.FC<ClientsJobsManagerProps> = ({
  clients,
  jobs,
  setClients,
  setJobs,
  currentUserId
}) => {
  const [activeTab, setActiveTab] = useState<'clients' | 'jobs'>('clients');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'active',
    notes: ''
  });
  
  const [newJob, setNewJob] = useState<Partial<Job>>({
    client_id: '',
    title: '',
    description: '',
    status: 'not_started',
    progress: 0,
    due_date: '',
    budget: undefined,
    invoiced_amount: 0,
    paid_amount: 0
  });
  
  // CRUD operations for clients
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert(newClient)
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        setClients(prev => [...prev, data]);
        setNewClient({
          name: '',
          email: '',
          phone: '',
          company: '',
          status: 'active',
          notes: ''
        });
        setIsAddingClient(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add client');
    }
  };
  
  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!selectedClientId) return;
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(newClient)
        .eq('id', selectedClientId)
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        setClients(prev => prev.map(client => 
          client.id === data.id ? data : client
        ));
        setIsEditingClient(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update client');
    }
  };
  
  const handleDeleteClient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client? This will also delete all associated jobs.')) {
      return;
    }
    
    setError(null);
    
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setClients(prev => prev.filter(client => client.id !== id));
      setJobs(prev => prev.filter(job => job.client_id !== id));
      
      if (selectedClientId === id) {
        setSelectedClientId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client');
    }
  };
  
  // CRUD operations for jobs
  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert(newJob)
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        setJobs(prev => [...prev, data]);
        setNewJob({
          client_id: '',
          title: '',
          description: '',
          status: 'not_started',
          progress: 0,
          due_date: '',
          budget: undefined,
          invoiced_amount: 0,
          paid_amount: 0
        });
        setIsAddingJob(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add job');
    }
  };
  
  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!selectedJobId) return;
    
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(newJob)
        .eq('id', selectedJobId)
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        setJobs(prev => prev.map(job => 
          job.id === data.id ? data : job
        ));
        setIsEditingJob(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job');
    }
  };
  
  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) {
      return;
    }
    
    setError(null);
    
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setJobs(prev => prev.filter(job => job.id !== id));
      
      if (selectedJobId === id) {
        setSelectedJobId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job');
    }
  };
  
  // Get client name by ID
  const getClientName = (clientId: string): string => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };
  
  // Get status color
  const getClientStatusColor = (status: Client['status']): string => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'inactive':
        return 'bg-red-500/20 text-red-400';
      case 'lead':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  const getJobStatusColor = (status: Job['status']): string => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-500/20 text-gray-400';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400';
      case 'review':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  // Format currency
  const formatCurrency = (amount?: number): string => {
    if (amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Calculate client metrics
  const totalClients = clients.length;
  const activeClients = clients.filter(client => client.status === 'active').length;
  const leadClients = clients.filter(client => client.status === 'lead').length;
  
  // Calculate job metrics
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(job => job.status === 'completed').length;
  const inProgressJobs = jobs.filter(job => job.status === 'in_progress').length;
  const totalBudget = jobs.reduce((sum, job) => sum + (job.budget || 0), 0);
  const totalInvoiced = jobs.reduce((sum, job) => sum + (job.invoiced_amount || 0), 0);
  const totalPaid = jobs.reduce((sum, job) => sum + (job.paid_amount || 0), 0);
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light tracking-tight">Clients & Jobs</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-3 py-1 rounded text-sm ${
              activeTab === 'clients' 
                ? 'bg-[#0CF2A0] text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Clients
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1 rounded text-sm ${
              activeTab === 'jobs' 
                ? 'bg-[#0CF2A0] text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Jobs
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm">
          {error}
        </div>
      )}
      
      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <>
          {/* Client Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-blue-500/20">
                  <User className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-300">Total Clients</h3>
                  <p className="text-3xl font-light text-white">{totalClients}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-green-500/20">
                  <Check className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-300">Active Clients</h3>
                  <p className="text-3xl font-light text-white">{activeClients}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-yellow-500/20">
                  <User className="text-yellow-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-300">Leads</h3>
                  <p className="text-3xl font-light text-white">{leadClients}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Client Management */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-light tracking-tight">Client List</h3>
            <button
              onClick={() => {
                setIsAddingClient(true);
                setIsEditingClient(false);
                setSelectedClientId(null);
                setNewClient({
                  name: '',
                  email: '',
                  phone: '',
                  company: '',
                  status: 'active',
                  notes: ''
                });
              }}
              className="px-3 py-1 rounded bg-[#0CF2A0] text-black hover:bg-[#07C280] transition-colors flex items-center gap-1"
            >
              <Plus size={16} />
              Add Client
            </button>
          </div>
          
          {/* Add/Edit Client Form */}
          {(isAddingClient || isEditingClient) && (
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <h4 className="text-lg font-light mb-4 tracking-tight">
                {isAddingClient ? 'Add New Client' : 'Edit Client'}
              </h4>
              <form onSubmit={isAddingClient ? handleAddClient : handleUpdateClient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newClient.phone || ''}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Company
                    </label>
                    <input
                      type="text"
                      value={newClient.company || ''}
                      onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Status
                    </label>
                    <select
                      value={newClient.status}
                      onChange={(e) => setNewClient({ ...newClient, status: e.target.value as Client['status'] })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="lead">Lead</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-light mb-2 tracking-tight">
                      Notes
                    </label>
                    <textarea
                      value={newClient.notes || ''}
                      onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingClient(false);
                      setIsEditingClient(false);
                    }}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0CF2A0] text-black rounded hover:bg-[#07C280] transition-colors"
                  >
                    {isAddingClient ? 'Add Client' : 'Update Client'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Client List */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Name</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Email</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Company</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Created</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-gray-500">
                        No clients found. Add your first client to get started.
                      </td>
                    </tr>
                  ) : (
                    clients.map(client => (
                      <tr key={client.id} className="border-b border-gray-800">
                        <td className="py-3 px-4 text-gray-300">{client.name}</td>
                        <td className="py-3 px-4 text-gray-300">{client.email}</td>
                        <td className="py-3 px-4 text-gray-400">{client.company || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${getClientStatusColor(client.status)}`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400">{new Date(client.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setIsEditingClient(true);
                                setIsAddingClient(false);
                                setSelectedClientId(client.id);
                                setNewClient({
                                  name: client.name,
                                  email: client.email,
                                  phone: client.phone,
                                  company: client.company,
                                  status: client.status,
                                  notes: client.notes
                                });
                              }}
                              className="p-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client.id)}
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
        </>
      )}
      
      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <>
          {/* Job Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-blue-500/20">
                  <Briefcase className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-300">Total Jobs</h3>
                  <p className="text-3xl font-light text-white">{totalJobs}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-green-500/20">
                  <Check className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-300">Completed</h3>
                  <p className="text-3xl font-light text-white">{completedJobs}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-yellow-500/20">
                  <Clock className="text-yellow-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-300">In Progress</h3>
                  <p className="text-3xl font-light text-white">{inProgressJobs}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-purple-500/20">
                  <DollarSign className="text-purple-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-300">Total Budget</h3>
                  <p className="text-3xl font-light text-white">{formatCurrency(totalBudget)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-blue-500/20">
                  <FileText className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-300">Invoiced</h3>
                  <p className="text-3xl font-light text-white">{formatCurrency(totalInvoiced)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-green-500/20">
                  <DollarSign className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-light text-gray-300">Paid</h3>
                  <p className="text-3xl font-light text-white">{formatCurrency(totalPaid)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Job Management */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-light tracking-tight">Job List</h3>
            <button
              onClick={() => {
                setIsAddingJob(true);
                setIsEditingJob(false);
                setSelectedJobId(null);
                setNewJob({
                  client_id: clients.length > 0 ? clients[0].id : '',
                  title: '',
                  description: '',
                  status: 'not_started',
                  progress: 0,
                  due_date: '',
                  budget: undefined,
                  invoiced_amount: 0,
                  paid_amount: 0
                });
              }}
              className="px-3 py-1 rounded bg-[#0CF2A0] text-black hover:bg-[#07C280] transition-colors flex items-center gap-1"
              disabled={clients.length === 0}
            >
              <Plus size={16} />
              Add Job
            </button>
          </div>
          
          {/* Add/Edit Job Form */}
          {(isAddingJob || isEditingJob) && (
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <h4 className="text-lg font-light mb-4 tracking-tight">
                {isAddingJob ? 'Add New Job' : 'Edit Job'}
              </h4>
              {clients.length === 0 && isAddingJob ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-3 rounded text-sm mb-4">
                  You need to add a client before you can create a job.
                </div>
              ) : (
                <form onSubmit={isAddingJob ? handleAddJob : handleUpdateJob} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-light mb-2 tracking-tight">
                        Client *
                      </label>
                      <select
                        value={newJob.client_id}
                        onChange={(e) => setNewJob({ ...newJob, client_id: e.target.value })}
                        className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                        required
                      >
                        <option value="">Select a client</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 tracking-tight">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 tracking-tight">
                        Status
                      </label>
                      <select
                        value={newJob.status}
                        onChange={(e) => setNewJob({ ...newJob, status: e.target.value as Job['status'] })}
                        className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 tracking-tight">
                        Progress (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newJob.progress}
                        onChange={(e) => setNewJob({ ...newJob, progress: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 tracking-tight">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newJob.due_date || ''}
                        onChange={(e) => setNewJob({ ...newJob, due_date: e.target.value })}
                        className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 tracking-tight">
                        Budget
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newJob.budget || ''}
                        onChange={(e) => setNewJob({ ...newJob, budget: e.target.value ? parseFloat(e.target.value) : undefined })}
                        className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 tracking-tight">
                        Invoiced Amount
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newJob.invoiced_amount || 0}
                        onChange={(e) => setNewJob({ ...newJob, invoiced_amount: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2 tracking-tight">
                        Paid Amount
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newJob.paid_amount || 0}
                        onChange={(e) => setNewJob({ ...newJob, paid_amount: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-light mb-2 tracking-tight">
                        Description
                      </label>
                      <textarea
                        value={newJob.description || ''}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingJob(false);
                        setIsEditingJob(false);
                      }}
                      className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0CF2A0] text-black rounded hover:bg-[#07C280] transition-colors"
                    >
                      {isAddingJob ? 'Add Job' : 'Update Job'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
          
          {/* Job List */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Title</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Client</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Progress</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Due Date</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Budget</th>
                    <th className="text-left py-3 px-4 font-normal text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-gray-500">
                        No jobs found. Add your first job to get started.
                      </td>
                    </tr>
                  ) : (
                    jobs.map(job => (
                      <tr key={job.id} className="border-b border-gray-800">
                        <td className="py-3 px-4 text-gray-300">{job.title}</td>
                        <td className="py-3 px-4 text-gray-300">{getClientName(job.client_id)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${getJobStatusColor(job.status)}`}>
                            {job.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-full bg-gray-800 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400 mt-1">{job.progress}%</span>
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {job.due_date ? new Date(job.due_date).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-3 px-4 text-gray-300">{formatCurrency(job.budget)}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setIsEditingJob(true);
                                setIsAddingJob(false);
                                setSelectedJobId(job.id);
                                setNewJob({
                                  client_id: job.client_id,
                                  title: job.title,
                                  description: job.description,
                                  status: job.status,
                                  progress: job.progress,
                                  due_date: job.due_date ? new Date(job.due_date).toISOString().split('T')[0] : '',
                                  budget: job.budget,
                                  invoiced_amount: job.invoiced_amount,
                                  paid_amount: job.paid_amount
                                });
                              }}
                              className="p-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
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
        </>
      )}
    </div>
  );
};

export default ClientsJobsManager;
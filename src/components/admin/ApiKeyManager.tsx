import React, { useState } from 'react';
import { ApiKey } from '../AdminPage'; // Assuming ApiKey interface is exported
import { testGeminiApiKey, testOpenAIApiKey, testGrokApiKey, testDeepseekApiKey } from '../../lib/llm';

interface ApiKeyManagerProps {
  apiKeys: ApiKey[];
  newApiKey: { provider: string; api_key: string };
  isAddingKey: boolean;
  handleAddApiKey: (e: React.FormEvent) => Promise<void>;
  handleToggleApiKey: (id: string, currentStatus: boolean) => Promise<void>;
  handleDeleteApiKey: (id: string) => Promise<void>;
  setNewApiKey: React.Dispatch<React.SetStateAction<{ provider: string; api_key: string }>>;
  error: string | null;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({
  apiKeys,
  newApiKey,
  isAddingKey,
  handleAddApiKey,
  handleToggleApiKey,
  handleDeleteApiKey,
  setNewApiKey,
  error
}) => {
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});

  const handleTestApiKey = async (id: string, provider: string, apiKey: string) => {
    setTestingKey(id);
    setTestResults(prev => ({
      ...prev,
      [id]: { success: false, message: 'Testing...' }
    }));

    try {
      let success = false;
      
      switch (provider) {
        case 'gemini':
          success = await testGeminiApiKey(apiKey);
          break;
        case 'openai':
          success = await testOpenAIApiKey(apiKey);
          break;
        case 'grok':
          success = await testGrokApiKey(apiKey);
          break;
        case 'deepseek':
          success = await testDeepseekApiKey(apiKey);
          break;
        default:
          setTestResults(prev => ({
            ...prev,
            [id]: { success: false, message: 'Testing not supported for this provider' }
          }));
          setTestingKey(null);
          return;
      }

      setTestResults(prev => ({
        ...prev,
        [id]: { 
          success, 
          message: success ? 'API key is valid!' : 'API key is invalid or has insufficient permissions'
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [id]: { success: false, message: error instanceof Error ? error.message : 'Test failed' }
      }));
    } finally {
      setTestingKey(null);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light tracking-tight">API Keys Management</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Add new API key form */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
        <h3 className="text-lg font-light mb-4 tracking-tight">Add New API Key</h3>
        <form onSubmit={handleAddApiKey} className="space-y-4">
          <div>
            <label className="block text-sm font-light mb-2 tracking-tight">
              Provider
            </label>
            <select
              value={newApiKey.provider}
              onChange={(e) => setNewApiKey({ ...newApiKey, provider: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
              required
            >
              <option value="">Select Provider</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="cohere">Cohere</option>
              <option value="huggingface">Hugging Face</option>
              <option value="replicate">Replicate</option>
              <option value="gemini">Google Gemini</option>
              <option value="grok">Grok (xAI)</option>
              <option value="deepseek">DeepSeek</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-light mb-2 tracking-tight">
              API Key
            </label>
            <input
              type="password"
              value={newApiKey.api_key}
              onChange={(e) => setNewApiKey({ ...newApiKey, api_key: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-[#0CF2A0] text-black px-4 py-2 rounded transition-colors hover:bg-[#07C280] disabled:opacity-50"
              disabled={isAddingKey}
            >
              {isAddingKey ? 'Adding...' : 'Add API Key'}
            </button>
            
            {newApiKey.provider && newApiKey.api_key && ['gemini', 'openai', 'grok', 'deepseek'].includes(newApiKey.provider) && (
              <button
                type="button"
                className="bg-gray-700 text-white px-4 py-2 rounded transition-colors hover:bg-gray-600"
                onClick={() => handleTestApiKey('new', newApiKey.provider, newApiKey.api_key)}
                disabled={testingKey === 'new'}
              >
                {testingKey === 'new' ? 'Testing...' : 'Test Key'}
              </button>
            )}
          </div>
          
          {testResults['new'] && (
            <div className={`mt-2 p-2 rounded text-sm ${
              testResults['new'].success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {testResults['new'].message}
            </div>
          )}
        </form>
      </div>

      {/* Existing API keys list */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
        <h3 className="text-lg font-light mb-4 tracking-tight">Existing API Keys</h3>
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <div key={key.id} className="flex flex-col p-4 bg-black/20 rounded">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#0CF2A0]">{key.provider}</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      key.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {key.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Last used: {key.last_used_at ? new Date(key.last_used_at).toLocaleString() : 'Never'}
                  </div>
                  <div className="text-sm text-gray-400">
                    Usage count: {key.usage_count}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {['gemini', 'openai', 'grok', 'deepseek'].includes(key.provider) && (
                    <button
                      onClick={() => handleTestApiKey(key.id, key.provider, key.api_key)}
                      className="px-3 py-1 rounded text-sm bg-gray-700 text-white hover:bg-gray-600"
                      disabled={testingKey === key.id}
                    >
                      {testingKey === key.id ? 'Testing...' : 'Test'}
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleApiKey(key.id, key.is_active)}
                    className={`px-3 py-1 rounded text-sm ${
                      key.is_active 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    {key.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteApiKey(key.id)}
                    className="px-3 py-1 rounded text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {testResults[key.id] && (
                <div className={`mt-2 p-2 rounded text-sm ${
                  testResults[key.id].success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {testResults[key.id].message}
                </div>
              )}
            </div>
          ))}
          
          {apiKeys.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              No API keys found. Add one to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManager;
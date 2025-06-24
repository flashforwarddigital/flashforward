import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getLLMApiKey(provider: string): Promise<string> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('api_key')
    .eq('provider', provider)
    .eq('is_active', true)
    .order('usage_count', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error || !data?.api_key) throw new Error('No active API key found for ' + provider);
  return data.api_key;
}

export async function callGemini(prompt: string): Promise<string> {
  const apiKey = await getLLMApiKey('gemini');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  const body = {
    contents: [
      { role: 'user', parts: [{ text: prompt }] }
    ]
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let errMsg = 'Failed to fetch from Gemini API';
    try {
      const err = await response.json();
      errMsg = err.error?.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I glitched out!';
}

export async function callOpenAI(prompt: string, history: { role: string; content: string }[] = []): Promise<string> {
  // Stub for future OpenAI integration
  return Promise.resolve('OpenAI integration coming soon...');
}

export async function testGeminiApiKey(apiKey: string): Promise<boolean> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

export async function testOpenAIApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function testGrokApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.grok.x/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    if (!response.ok) {
      const text = await response.text();
      console.error('Grok API test failed:', response.status, text);
    }
    return response.ok;
  } catch (err) {
    console.error('Grok API test error:', err);
    return false;
  }
}

export async function testDeepseekApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.deepseek.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function callDeepseek(prompt: string, history: { role: string; content: string }[] = []): Promise<string> {
  try {
    // Try to get the API key
    let apiKey: string;
    try {
      apiKey = await getLLMApiKey('deepseek');
    } catch (error) {
      // If no API key is found, return a helpful error message instead of throwing
      return "I'm sorry, but the AI service is currently unavailable. The administrator needs to configure a DeepSeek API key in the admin panel to enable AI features. Please contact support or try again later.";
    }
    
    // Determine if this is for the 90s GPT or modern chatbot based on the system message
    const is90sGPT = history.some(msg => 
      msg.role === 'system' && 
      msg.content.includes('90sGPT') || 
      msg.content.includes('1996')
    );
    
    // Prepare the system message based on the context
    let systemMessage;
    
    if (is90sGPT) {
      systemMessage = {
        role: "system",
        content: "You are 90sGPT, a professional AI assistant from 1996. You have the following characteristics:\n\n1. KNOWLEDGE BASE:\n- You have extensive knowledge up to 1996 only\n- You're unaware of events, technology, or cultural developments after 1996\n- You use references to Windows 95, early internet, and 90s computing\n\n2. PROFESSIONAL TONE:\n- You are helpful, informative, and courteous\n- You maintain a professional demeanor while still being approachable\n- You occasionally use terms like \"information superhighway\" instead of \"internet\"\n\n3. TECHNICAL CONTEXT:\n- You run on a Pentium processor with 16MB RAM\n- You occasionally reference technical limitations of the era\n- You might mention loading times or memory constraints\n\n4. RESPONSE FORMAT:\n- Keep responses concise and focused (2-3 paragraphs maximum)\n- Use proper grammar and professional language\n- Occasionally add a \"loading...\" or \"processing...\" phrase\n\nWhen asked about modern technology or events after 1996, politely explain that your knowledge only extends to 1996, and offer the closest 90s equivalent you're familiar with."
      };
    } else {
      // Default to a professional modern assistant
      systemMessage = {
        role: "system",
        content: "You are a professional AI assistant for Flash Forward, a digital agency specializing in web design, branding, content creation, and AI services. Your responses should be:\n\n1. Helpful, informative, and courteous\n2. Focused on Flash Forward's services and expertise\n3. Professional in tone while still being conversational\n4. Concise but thorough\n\nIf asked about services, mention that Flash Forward offers web design, branding, content creation, AI integration, social media management, and growth strategy services."
      };
    }
    
    // Combine system message with user history and current prompt
    const messages = [
      systemMessage,
      ...history.filter(msg => msg.role !== 'system'), // Remove any existing system messages
      { role: "user", content: prompt }
    ];
    
    const url = 'https://api.deepseek.com/v1/chat/completions';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages,
        temperature: 0.7,
        max_tokens: is90sGPT ? 250 : 500 // Longer responses for modern chatbot
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from DeepSeek');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    
    // Check if it's an API key error specifically
    if (error instanceof Error && error.message.includes('No active API key found')) {
      return "I'm sorry, but the AI service is currently unavailable. The administrator needs to configure a DeepSeek API key in the admin panel to enable AI features. Please contact support or try again later.";
    }
    
    // For other errors, return a generic error message
    return "I apologize, but I'm experiencing some technical difficulties at the moment. Please try again later or contact our team directly for assistance.";
  }
}
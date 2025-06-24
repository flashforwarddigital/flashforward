// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { id } = await req.json()

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Prediction ID is required' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      )
    }

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { 
          status: 401, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      )
    }

    // Get the API key from the authorization header
    const apiKey = authHeader.replace('Bearer ', '')

    // Create a client for the Supabase API
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = apiKey

    // Get Replicate API key
    const replicateApiKey = Deno.env.get('REPLICATE_API_KEY')
    if (!replicateApiKey) {
      return new Response(
        JSON.stringify({ error: 'REPLICATE_API_KEY is not set' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      )
    }

    // Call Replicate API to check prediction status
    const replicateResponse = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${replicateApiKey}`,
        'Content-Type': 'application/json',
      }
    })

    if (!replicateResponse.ok) {
      const error = await replicateResponse.json()
      return new Response(
        JSON.stringify({ error: `Replicate API error: ${error.detail || 'Unknown error'}` }),
        { 
          status: replicateResponse.status, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      )
    }

    const prediction = await replicateResponse.json()

    // Update the prediction in Supabase
    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/replicate_generations`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        status: prediction.status,
        output: prediction.output,
        error: prediction.error,
      }),
    })

    if (!supabaseResponse.ok) {
      console.error('Failed to update prediction in Supabase:', await supabaseResponse.text())
    }

    return new Response(
      JSON.stringify({ 
        id: prediction.id, 
        status: prediction.status,
        output: prediction.output,
        error: prediction.error
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  }
})
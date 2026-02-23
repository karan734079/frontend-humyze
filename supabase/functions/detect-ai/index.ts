import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Validate User
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { text, file_name, file_url } = await req.json()

    if (!text) {
      return new Response(JSON.stringify({ error: 'No text provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Call Gemini API
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not set')
    }

    // Construct prompt for Gemini
    const prompt = `Analyze the following text for AI generation. 
Return ONLY a valid JSON object with the following schema, no markdown blocks:
{
  "humanScore": <integer 0-100>,
  "aiScore": <integer 0-100>,
  "confidence": "<Low | Medium | High>",
  "aiSentences": ["<sentences most likely AI generated>", "..."],
  "analysis": "<short explanation>"
}

Text to analyze:
${text}
`

    const geminiPayload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    }

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload)
    })

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini API Error:', errorText)
      throw new Error('Failed to process text with Gemini API')
    }

    const geminiData = await geminiResponse.json()
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // Parse response
    let resultJSON
    try {
      const cleanJSON = responseText.replace(/```json/g, '').replace(/```/g, '').trim()
      resultJSON = JSON.parse(cleanJSON)
    } catch (e) {
      console.error('Failed to parse Gemini response as JSON:', responseText)
      throw new Error('Invalid response format from Gemini')
    }

    const { humanScore, aiScore, confidence, aiSentences, analysis } = resultJSON

    // Insert report into Supabase database
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const reportData = {
      user_id: user.id,
      file_name: file_name || null,
      file_url: file_url || null,
      original_text: text,
      human_score: humanScore,
      ai_score: aiScore,
      confidence,
      ai_sentences: aiSentences,
      analysis
    }

    const { data: insertedReport, error: insertError } = await adminClient
      .from('reports')
      .insert(reportData)
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    return new Response(JSON.stringify(insertedReport), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('detect-ai Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

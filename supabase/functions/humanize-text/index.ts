import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

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

        const { text, report_id } = await req.json()

        if (!text) {
            return new Response(JSON.stringify({ error: 'No text provided' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
        if (!GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY not set')
        }

        // Call Gemini to humanize the text
        const prompt = `Rewrite the following text to sound highly natural and human-like. 
Remove any robotic tone, complex AI-style phrasing, or repetitive structures. 
Make it engaging, conversational yet professional, and pass AI detection as human-written.

Text to rewrite:
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
            throw new Error('Failed to humanize text with Gemini API')
        }

        const geminiData = await geminiResponse.json()
        const rewrittenText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''

        // Update Supabase Database
        const adminClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        let savedReport = null;

        if (report_id) {
            const { data, error } = await adminClient
                .from('reports')
                .update({ humanized_text: rewrittenText })
                .eq('id', report_id)
                .eq('user_id', user.id)
                .select()
                .single()

            if (error) throw error
            savedReport = data
        } else {
            // Create a new report if none provided
            const { data, error } = await adminClient
                .from('reports')
                .insert({
                    user_id: user.id,
                    original_text: text,
                    humanized_text: rewrittenText
                })
                .select()
                .single()

            if (error) throw error
            savedReport = data
        }

        return new Response(JSON.stringify({ rewrittenText, report: savedReport }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error('humanize-text Error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})

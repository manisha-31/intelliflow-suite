import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { collectionData } = await req.json();

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a demand forecasting AI for Modenik Lifestyle, an Indian innerwear and apparel company. Analyze the provided data and generate demand forecasts with confidence scores. Return structured JSON output." },
          { role: "user", content: `Based on this collection and production data, generate demand forecasts for the next 6 months across categories (innerwear, thermals, socks, vests, camisoles, kids). Include predicted demand in units, confidence score (0-100), season insights, and forecast basis.\n\nData: ${JSON.stringify(collectionData)}` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_forecasts",
            description: "Generate demand forecasts for product categories",
            parameters: {
              type: "object",
              properties: {
                forecasts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: { type: "string" },
                      predicted_demand_units: { type: "number" },
                      confidence_score: { type: "number" },
                      season_insights: { type: "string" },
                      forecast_basis: { type: "string" }
                    },
                    required: ["category", "predicted_demand_units", "confidence_score", "season_insights", "forecast_basis"]
                  }
                },
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      confidence: { type: "number" },
                      impact: { type: "string", enum: ["High", "Medium", "Low"] },
                      type: { type: "string", enum: ["demand", "trend", "optimization", "supply", "marketing"] }
                    },
                    required: ["title", "description", "confidence", "impact", "type"]
                  }
                }
              },
              required: ["forecasts", "recommendations"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_forecasts" } }
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let result;
    if (toolCall?.function?.arguments) {
      result = JSON.parse(toolCall.function.arguments);
    } else {
      result = { forecasts: [], recommendations: [] };
    }

    return new Response(JSON.stringify(result), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("ai-insights error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

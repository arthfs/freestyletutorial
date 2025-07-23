// src/app/api/coaching/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Validate API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not found in environment variables");
      throw new Error("OpenAI API key not configured");
    }

    // 2. Parse and validate request body
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Invalid messages array");
    }

    // 3. Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Cheapest option, or use "gpt-4o-mini" for better quality
        messages: [
          {
            role: "system",
            content: "You're a freestyle football coach. Respond with 3 bullet points max. Keep responses concise and actionable."
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 150 // Keep responses short and costs low
      })
    });

    // 4. Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("OpenAI API error:", {
        status: response.status,
        error: errorData
      });

      if (response.status === 401) {
        throw new Error("Invalid OpenAI API key");
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded - try again in a moment");
      } else if (response.status === 402) {
        throw new Error("OpenAI account has insufficient credits");
      } else {
        throw new Error(`OpenAI API failed: ${response.statusText}`);
      }
    }

    // 5. Parse and return response
    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Unexpected API response format");
    }

    return NextResponse.json({
      reply: data.choices[0].message.content.trim(),
      usage: data.usage // Helpful for monitoring costs
    });

  } catch (error) {
    console.error("Coaching route error:", error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
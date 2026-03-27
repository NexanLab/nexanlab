import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'
import { ratelimit } from '@/lib/ratelimit'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    )
  }

  try {
    const { keyword, pageType, tone, count } = await request.json()

    if (!keyword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (keyword.length > 200) {
      return NextResponse.json({ error: 'Keyword must be under 200 characters.' }, { status: 400 })
    }

    const prompt = `Generate ${count || 5} SEO-optimized title tags for the following:

Main Keyword: ${keyword}
Page Type: ${pageType || 'Blog Post'}
Tone: ${tone || 'Professional'}

Requirements:
- Each title must be 50-60 characters long (ideal for Google)
- Include the main keyword naturally
- Make them compelling and click-worthy
- Use power words when appropriate
- Each title should be unique and use different angles/approaches
- Do NOT number the titles or add any extra explanation

Format your response as a simple list, one title per line, nothing else.`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
    })

    const text = completion.choices[0]?.message?.content || ''
    const titles = text.split('\n').filter(t => t.trim().length > 0)
    return NextResponse.json({ titles })
  } catch (error) {
    console.error('Groq error:', error)
    return NextResponse.json({ error: 'Failed to generate titles' }, { status: 500 })
  }
}
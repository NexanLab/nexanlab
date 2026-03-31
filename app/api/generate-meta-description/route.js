import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/ratelimit'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success, retryAfter } = await checkRateLimit(ip)

  if (!success) {
    return NextResponse.json(
      { error: `Too many requests. Please wait ${retryAfter} seconds.`, retryAfter },
      { status: 429 }
    )
  }

  try {
    const { title, keyword, pageUrl } = await request.json()

    if (!title) {
      return NextResponse.json({ error: 'Missing title' }, { status: 400 })
    }

    const prompt = `Write a single meta description for the following web page.

Page Title: "${title}"
Main Keyword: "${keyword || 'not specified'}"
Page URL: "${pageUrl || 'not specified'}"

Rules:
- Exactly 140-160 characters (this is a hard requirement — count carefully)
- Include the main keyword naturally if provided
- Be compelling and specific — tell the user what they'll get
- Include a subtle call-to-action (e.g. "Learn how", "Discover", "Find out")
- Do NOT start with the keyword — start with a benefit or hook
- Do NOT use quotes, brackets, or special formatting
- Write as a single flowing sentence or two short sentences max
- Sound human, not like a robot

Output ONLY the meta description text. No labels, no quotes, no explanation.`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 120,
      temperature: 0.7,
    })

    const description = completion.choices[0]?.message?.content?.trim() || ''

    // Fazla uzunsa kırp — 160 char hard limit
    const trimmed = description.length > 165
      ? description.slice(0, 160).replace(/\s+\S*$/, '') + '...'
      : description

    return NextResponse.json({ description: trimmed })

  } catch (error) {
    console.error('Meta description error:', error)
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 })
  }
}
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
    const { product, targetAudience, goal, platform, tone } = await request.json()

    if (!product) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (product.length > 500) {
      return NextResponse.json({ error: 'Product description must be under 500 characters.' }, { status: 400 })
    }

    const prompt = `Generate ad copy for the following:

Product/Service: ${product}
Target Audience: ${targetAudience || 'General audience'}
Campaign Goal: ${goal || 'Drive sales'}
Platform: ${platform || 'Facebook/Instagram'}
Tone: ${tone || 'Persuasive'}

Generate the following:

1. PRIMARY HEADLINE (max 40 chars): A short, punchy headline
2. SECONDARY HEADLINE (max 40 chars): Alternative headline
3. PRIMARY TEXT (max 125 chars): Main ad body text
4. DESCRIPTION (max 30 chars): Short description line
5. CALL TO ACTION: One of these: Shop Now, Learn More, Sign Up, Get Started, Try Free, Book Now, Contact Us
6. HOOK VARIATION 1 (max 125 chars): Alternative ad text with a problem-focused angle
7. HOOK VARIATION 2 (max 125 chars): Alternative ad text with a benefit-focused angle

Format EXACTLY like this, nothing else:
PRIMARY HEADLINE: [text]
SECONDARY HEADLINE: [text]
PRIMARY TEXT: [text]
DESCRIPTION: [text]
CALL TO ACTION: [text]
HOOK VARIATION 1: [text]
HOOK VARIATION 2: [text]`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
    })

    const text = completion.choices[0]?.message?.content || ''
    const parsed = {}
    const lines = text.split('\n').filter(l => l.trim())
    lines.forEach(line => {
      const colonIdx = line.indexOf(':')
      if (colonIdx > -1) {
        const key = line.slice(0, colonIdx).trim()
        const value = line.slice(colonIdx + 1).trim()
        parsed[key] = value
      }
    })

    return NextResponse.json({ copy: parsed, raw: text })
  } catch (error) {
    console.error('Groq error:', error)
    return NextResponse.json({ error: 'Failed to generate ad copy' }, { status: 500 })
  }
}
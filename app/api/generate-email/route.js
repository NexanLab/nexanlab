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
    const { senderName, senderRole, recipientName, recipientCompany, purpose, tone } = await request.json()

    if (!senderName || !recipientCompany || !purpose) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Input limitleri
    if (purpose.length > 500) {
      return NextResponse.json({ error: 'Purpose must be under 500 characters.' }, { status: 400 })
    }

    const prompt = `Write a professional cold email with the following details:

Sender: ${senderName}${senderRole ? `, ${senderRole}` : ''}
Recipient: ${recipientName ? recipientName : 'the recipient'}
Recipient's Company: ${recipientCompany}
Purpose: ${purpose}
Tone: ${tone || 'professional'}

Requirements:
- Keep it concise (150-200 words max)
- Strong subject line
- Personalized opening
- Clear value proposition
- Specific call to action
- Professional closing

Format your response as:
Subject: [subject line here]

[email body here]`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    })

    const text = completion.choices[0]?.message?.content || ''
    return NextResponse.json({ email: text })
  } catch (error) {
    console.error('Groq error:', error)
    return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 })
  }
}
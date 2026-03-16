import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { senderName, senderRole, recipientName, recipientCompany, purpose, tone } = await request.json()

    if (!senderName || !recipientCompany || !purpose) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

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

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return NextResponse.json({ email: text })
  } catch (error) {
    console.error('Gemini error:', error)
    return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 })
  }
}
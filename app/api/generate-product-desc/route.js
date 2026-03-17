import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  try {
    const { productName, keyFeatures, targetAudience, platform, tone, length } = await request.json()

    if (!productName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const prompt = `Write a product description with the following details:

Product Name: ${productName}
Key Features: ${keyFeatures || 'Not specified'}
Target Audience: ${targetAudience || 'General shoppers'}
Platform: ${platform || 'General'}
Tone: ${tone || 'Professional'}
Length: ${length || 'Medium (100-150 words)'}

Generate the following:

TITLE: A compelling product title (max 80 chars)
SHORT DESCRIPTION: A one-liner hook (max 160 chars)
FULL DESCRIPTION: The main product description based on the requested length
BULLET POINTS: 5 key selling points, each starting with an emoji

Format EXACTLY like this:
TITLE: [text]
SHORT DESCRIPTION: [text]
FULL DESCRIPTION: [text]
BULLET POINTS:
[emoji] [point 1]
[emoji] [point 2]
[emoji] [point 3]
[emoji] [point 4]
[emoji] [point 5]`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
    })

    const text = completion.choices[0]?.message?.content || ''

    // Parse the response
    const parsed = {}

    const titleMatch = text.match(/TITLE:\s*(.+)/i)
    const shortMatch = text.match(/SHORT DESCRIPTION:\s*(.+)/i)
    const fullMatch = text.match(/FULL DESCRIPTION:\s*([\s\S]+?)(?=BULLET POINTS:|$)/i)
    const bulletsMatch = text.match(/BULLET POINTS:\s*([\s\S]+?)$/i)

    if (titleMatch) parsed.title = titleMatch[1].trim()
    if (shortMatch) parsed.short = shortMatch[1].trim()
    if (fullMatch) parsed.full = fullMatch[1].trim()
    if (bulletsMatch) {
      const bulletLines = bulletsMatch[1].trim().split('\n').filter(l => l.trim())
      parsed.bullets = bulletLines
    }

    return NextResponse.json({ description: parsed, raw: text })
  } catch (error) {
    console.error('Groq error:', error)
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 })
  }
}
import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/ratelimit'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success, retryAfter } = await checkRateLimit(ip)
  if (!success) {
    return NextResponse.json(
      { error: `Too many requests. Please wait ${retryAfter} seconds and try again.`, retryAfter },
      { status: 429 }
    )
  }

  try {
    const { subject, style, mood, lighting, camera, extraDetails, aiTool } = await request.json()

    if (!subject) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (subject.length > 500) {
      return NextResponse.json({ error: 'Subject must be under 500 characters.' }, { status: 400 })
    }

    const prompt = `Generate 3 different AI image prompts for the following:

Subject: ${subject}
Art Style: ${style || 'Photorealistic'}
Mood/Atmosphere: ${mood || 'Neutral'}
Lighting: ${lighting || 'Natural lighting'}
Camera/Perspective: ${camera || 'Eye level'}
Extra Details: ${extraDetails || 'None'}
Target AI Tool: ${aiTool || 'Midjourney'}

Requirements:
- Each prompt should be detailed and descriptive
- Include style keywords, lighting details, camera angles, quality boosters
- Optimize for ${aiTool || 'Midjourney'} specifically
- Make each prompt unique with different angles/approaches
- Include technical parameters where relevant (for Midjourney: --ar, --v 6, --style raw etc.)

Format EXACTLY like this:
PROMPT 1: [full detailed prompt]
PROMPT 2: [full detailed prompt]  
PROMPT 3: [full detailed prompt]
NEGATIVE PROMPT: [things to avoid, comma separated]`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
    })

    const text = completion.choices[0]?.message?.content || ''
    const prompts = []
    const p1 = text.match(/PROMPT 1:\s*([\s\S]+?)(?=PROMPT 2:|$)/i)
    const p2 = text.match(/PROMPT 2:\s*([\s\S]+?)(?=PROMPT 3:|$)/i)
    const p3 = text.match(/PROMPT 3:\s*([\s\S]+?)(?=NEGATIVE PROMPT:|$)/i)
    const neg = text.match(/NEGATIVE PROMPT:\s*([\s\S]+?)$/i)

    if (p1) prompts.push(p1[1].trim())
    if (p2) prompts.push(p2[1].trim())
    if (p3) prompts.push(p3[1].trim())

    return NextResponse.json({
      prompts,
      negative: neg ? neg[1].trim() : '',
      raw: text,
    })
  } catch (error) {
    console.error('Groq error:', error)
    return NextResponse.json({ error: 'Failed to generate prompts' }, { status: 500 })
  }
}
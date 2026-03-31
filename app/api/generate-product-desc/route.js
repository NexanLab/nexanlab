import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/ratelimit'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const PLATFORM_HINTS = {
  Amazon: 'Focus on keyword-rich copy, backend search terms, and scan-friendly bullet points. Use capitalized benefit phrases.',
  Etsy: 'Use warm, handcrafted storytelling. Emphasize uniqueness, craftsmanship, and gift potential.',
  Shopify: 'Write brand-forward copy with a clear CTA feel. Emphasize lifestyle benefits and brand identity.',
  WooCommerce: 'SEO-first copy. Use natural keyword placement and clear feature-to-benefit mapping.',
  eBay: 'Be specific and factual. Include condition, specs, and compatibility. Build trust through detail.',
  General: 'Write balanced, professional copy suitable for any e-commerce platform.',
}

const MAX_LENGTHS = {
  productName: 200,
  keyFeatures: 1000,
  targetAudience: 200,
  tone: 50,
  platform: 50,
  length: 50,
}

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
    let { productName, keyFeatures, targetAudience, platform, tone, length, onlySection } = await request.json()

    // Sanitize
    productName = String(productName || '').slice(0, MAX_LENGTHS.productName).trim()
    keyFeatures = String(keyFeatures || '').slice(0, MAX_LENGTHS.keyFeatures).trim()
    targetAudience = String(targetAudience || '').slice(0, MAX_LENGTHS.targetAudience).trim()
    tone = String(tone || '').slice(0, MAX_LENGTHS.tone).trim()
    platform = String(platform || '').slice(0, MAX_LENGTHS.platform).trim()
    length = String(length || '').slice(0, MAX_LENGTHS.length).trim()

    if (!productName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const platformHint = PLATFORM_HINTS[platform] || PLATFORM_HINTS.General

    const sectionInstructions = {
      title: 'Generate ONLY the TITLE line. Format: TITLE: [text]',
      short: 'Generate ONLY the SHORT DESCRIPTION line. Format: SHORT DESCRIPTION: [text]',
      full: 'Generate ONLY the FULL DESCRIPTION section. Format: FULL DESCRIPTION: [text]',
      bullets: 'Generate ONLY the BULLET POINTS section. Format:\nBULLET POINTS:\n[emoji] [point 1]\n...',
    }

    const sectionFocus = onlySection ? `\n\nIMPORTANT: ${sectionInstructions[onlySection]}` : ''

    const prompt = `You are an expert e-commerce copywriter. ${platformHint}
    
Write a product description with the following details:

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
[emoji] [point 5] ${sectionFocus}`

    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      stream: true,
    })

    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ''
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Groq error:', error)
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 })
  }
}
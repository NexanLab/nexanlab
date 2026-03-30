import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/ratelimit'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// ─────────────────────────────────────────────
// Serper.dev ile Google'dan ilk 10 sonucun title'larını çek
// ─────────────────────────────────────────────
async function fetchCompetitorTitles(keyword) {
  const res = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': process.env.SERPER_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ q: keyword, num: 10, gl: 'us', hl: 'en' }),
  })

  if (!res.ok) throw new Error('Serper API error')

  const data = await res.json()

  // Organik sonuçlardan title'ları çek, boş olanları filtrele
  const titles = (data.organic || [])
    .map(r => r.title)
    .filter(Boolean)
    .slice(0, 10)

  return titles
}

// ─────────────────────────────────────────────
// Normal mod — rakip analizi olmadan
// ─────────────────────────────────────────────
function buildNormalPrompt({ keyword, pageType, tone, count }) {
  return `Generate ${count || 5} SEO-optimized title tags for the following:

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
}

// ─────────────────────────────────────────────
// Rakip analizi modu — gerçek Google sonuçlarından daha iyi üret
// ─────────────────────────────────────────────
function buildCompetitorPrompt({ keyword, pageType, tone, count, competitorTitles }) {
  const titlesBlock = competitorTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')

  return `You are an expert SEO copywriter. Your task is to write title tags that outperform the current Google top 10 results.

Main Keyword: "${keyword}"
Page Type: ${pageType || 'Blog Post'}
Tone: ${tone || 'Professional'}

Here are the CURRENT top-ranking title tags on Google for this keyword:
${titlesBlock}

Your job:
1. Analyze what angles, patterns and weaknesses these titles have
2. Generate ${count || 5} title tags that are MORE compelling, MORE specific, and MORE click-worthy than these
3. Use different angles — don't copy their structure
4. Include power words, numbers, or emotional triggers where natural
5. Each title must naturally include the keyword "${keyword}"
6. Each title must be 50-60 characters (ideal Google length)

IMPORTANT: Output ONLY the title tags, one per line, no numbering, no explanation, no extra text.`
}

// ─────────────────────────────────────────────
// Bulk mod — birden fazla keyword
// ─────────────────────────────────────────────
function buildBulkPrompt({ keywords, pageType, tone, countPerKeyword, competitorData }) {
  const sections = keywords.map((kw, i) => {
    const competitors = competitorData?.[kw]
    const competitorBlock = competitors?.length
      ? `Current top titles for "${kw}":\n${competitors.map((t, j) => `${j + 1}. ${t}`).join('\n')}`
      : ''

    return `=== KEYWORD ${i + 1}: "${kw}" ===
${competitorBlock}
Generate ${countPerKeyword} unique, compelling title tags for this keyword.`
  }).join('\n\n')

  return `You are an expert SEO copywriter. Generate title tags for multiple keywords.

Page Type: ${pageType || 'Blog Post'}
Tone: ${tone || 'Professional'}
Titles per keyword: ${countPerKeyword}

Rules for ALL titles:
- 50-60 characters (ideal Google length)
- Include the keyword naturally
- Be compelling and click-worthy
- Use power words, numbers, or question formats where natural
- Each title unique — different angles

${sections}

Output format — use EXACTLY this structure, no extra text:
KEYWORD: [keyword]
[title 1]
[title 2]
...
---
KEYWORD: [next keyword]
[title 1]
...
---`
}

// ─────────────────────────────────────────────
// API HANDLER
// ─────────────────────────────────────────────
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
    const body = await request.json()
    const { keyword, keywords, pageType, tone, count, countPerKeyword, mode } = body

    // ── BULK MODE ──
    if (mode === 'bulk') {
      if (!keywords?.length) {
        return NextResponse.json({ error: 'No keywords provided.' }, { status: 400 })
      }

      const kwList = keywords
        .map(k => k.trim())
        .filter(Boolean)
        .slice(0, 10) // max 10 keyword

      if (kwList.length === 0) {
        return NextResponse.json({ error: 'No valid keywords provided.' }, { status: 400 })
      }

      // Rakip analizi isteğe bağlı — Serper key yoksa atla
      let competitorData = {}
      if (process.env.SERPER_API_KEY && body.withCompetitors) {
        const results = await Promise.allSettled(
          kwList.map(kw => fetchCompetitorTitles(kw).then(titles => ({ kw, titles })))
        )
        results.forEach(r => {
          if (r.status === 'fulfilled') {
            competitorData[r.value.kw] = r.value.titles
          }
        })
      }

      const prompt = buildBulkPrompt({
        keywords: kwList,
        pageType,
        tone,
        countPerKeyword: countPerKeyword || 3,
        competitorData: Object.keys(competitorData).length ? competitorData : null,
      })

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1200,
        temperature: 0.8,
      })

      const text = completion.choices[0]?.message?.content || ''

      // Parse bulk response — keyword bloklarına ayır
      const blocks = text.split(/---+/).map(b => b.trim()).filter(Boolean)
      const results = blocks.map(block => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
        // İlk satır "KEYWORD: ..." satırı
        const kwLine = lines[0]
        const kw = kwLine?.replace(/^KEYWORD:\s*/i, '').replace(/^["']|["']$/g, '') || ''
        const titles = lines.slice(1).filter(l => !l.startsWith('KEYWORD:'))
        return { keyword: kw, titles }
      }).filter(r => r.keyword && r.titles.length)

      return NextResponse.json({ bulk: results })
    }

    // ── SINGLE MODE (normal veya competitor) ──
    if (!keyword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (keyword.length > 200) {
      return NextResponse.json({ error: 'Keyword must be under 200 characters.' }, { status: 400 })
    }

    let prompt
    let competitorTitles = []

    if (mode === 'competitor' && process.env.SERPER_API_KEY) {
      try {
        competitorTitles = await fetchCompetitorTitles(keyword)
        prompt = buildCompetitorPrompt({ keyword, pageType, tone, count, competitorTitles })
      } catch {
        // Serper başarısız olursa normal moda düş
        prompt = buildNormalPrompt({ keyword, pageType, tone, count })
      }
    } else {
      prompt = buildNormalPrompt({ keyword, pageType, tone, count })
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.85,
    })

    const text = completion.choices[0]?.message?.content || ''
    const titles = text.split('\n').filter(t => t.trim().length > 0)

    return NextResponse.json({
      titles,
      competitorTitles, // frontend'de göstermek için
      mode: competitorTitles.length ? 'competitor' : 'normal',
    })

  } catch (error) {
    console.error('SEO title error:', error)
    return NextResponse.json({ error: 'Failed to generate titles' }, { status: 500 })
  }
}
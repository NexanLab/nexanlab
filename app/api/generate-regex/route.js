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
    const { description, language, examples, flags } = await request.json()

    if (!description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (description.length > 500) {
      return NextResponse.json({ error: 'Description must be under 500 characters.' }, { status: 400 })
    }

    const prompt = `Generate a regular expression for the following requirement:

Description: ${description}
Programming Language: ${language || 'JavaScript'}
${examples ? `Examples to match: ${examples}` : ''}
Flags needed: ${flags?.length ? flags.join(', ') : 'None'}

Provide your response in EXACTLY this format:

REGEX: [the regex pattern only, without delimiters]
FLAGS: [flags to use, or "none"]
EXPLANATION: [step by step explanation of each part of the regex]
JAVASCRIPT_EXAMPLE:
\`\`\`javascript
[working JavaScript code example using the regex]
\`\`\`
TEST_CASES:
MATCH: [example that should match]
MATCH: [another example that should match]
NO_MATCH: [example that should NOT match]
NO_MATCH: [another example that should NOT match]`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    })

    const text = completion.choices[0]?.message?.content || ''
    const regexMatch = text.match(/REGEX:\s*(.+)/i)
    const flagsMatch = text.match(/FLAGS:\s*(.+)/i)
    const explanationMatch = text.match(/EXPLANATION:\s*([\s\S]+?)(?=JAVASCRIPT_EXAMPLE:|$)/i)
    const jsMatch = text.match(/JAVASCRIPT_EXAMPLE:\s*```[\w]*\n?([\s\S]+?)```/i)
    const testCasesMatch = text.match(/TEST_CASES:\s*([\s\S]+?)$/i)

    const testCases = []
    if (testCasesMatch) {
      const lines = testCasesMatch[1].trim().split('\n').filter(l => l.trim())
      lines.forEach(line => {
        if (line.startsWith('MATCH:')) {
          testCases.push({ type: 'match', value: line.replace('MATCH:', '').trim() })
        } else if (line.startsWith('NO_MATCH:')) {
          testCases.push({ type: 'no_match', value: line.replace('NO_MATCH:', '').trim() })
        }
      })
    }

    return NextResponse.json({
      regex: regexMatch ? regexMatch[1].trim() : '',
      flags: flagsMatch ? flagsMatch[1].trim() : '',
      explanation: explanationMatch ? explanationMatch[1].trim() : '',
      jsExample: jsMatch ? jsMatch[1].trim() : '',
      testCases,
      raw: text,
    })
  } catch (error) {
    console.error('Groq error:', error)
    return NextResponse.json({ error: 'Failed to generate regex' }, { status: 500 })
  }
}
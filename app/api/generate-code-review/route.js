import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  try {
    const { code, language, focus } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const prompt = `Review the following ${language || 'code'} and provide a detailed analysis:

\`\`\`${language || ''}
${code}
\`\`\`

Focus areas: ${focus || 'All (bugs, performance, security, readability)'}

Provide your review in EXACTLY this format:

OVERALL SCORE: [X/10]
SUMMARY: [2-3 sentence overall assessment]

BUGS:
[List each bug with line reference if possible, or "No bugs found"]

SECURITY ISSUES:
[List security vulnerabilities, or "No security issues found"]

PERFORMANCE:
[List performance improvements, or "Looks good"]

READABILITY:
[List readability improvements, or "Code is clean and readable"]

IMPROVED CODE:
\`\`\`${language || ''}
[Provide the improved version of the code]
\`\`\``

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
    })

    const text = completion.choices[0]?.message?.content || ''

    // Parse sections
    const scoreMatch = text.match(/OVERALL SCORE:\s*(\d+\/10)/i)
    const summaryMatch = text.match(/SUMMARY:\s*([\s\S]+?)(?=BUGS:|$)/i)
    const bugsMatch = text.match(/BUGS:\s*([\s\S]+?)(?=SECURITY ISSUES:|$)/i)
    const securityMatch = text.match(/SECURITY ISSUES:\s*([\s\S]+?)(?=PERFORMANCE:|$)/i)
    const performanceMatch = text.match(/PERFORMANCE:\s*([\s\S]+?)(?=READABILITY:|$)/i)
    const readabilityMatch = text.match(/READABILITY:\s*([\s\S]+?)(?=IMPROVED CODE:|$)/i)
    const improvedMatch = text.match(/IMPROVED CODE:\s*```[\w]*\n?([\s\S]+?)```/i)

    return NextResponse.json({
      score: scoreMatch ? scoreMatch[1] : 'N/A',
      summary: summaryMatch ? summaryMatch[1].trim() : '',
      bugs: bugsMatch ? bugsMatch[1].trim() : '',
      security: securityMatch ? securityMatch[1].trim() : '',
      performance: performanceMatch ? performanceMatch[1].trim() : '',
      readability: readabilityMatch ? readabilityMatch[1].trim() : '',
      improved: improvedMatch ? improvedMatch[1].trim() : '',
      raw: text,
    })
  } catch (error) {
    console.error('Groq error:', error)
    return NextResponse.json({ error: 'Failed to review code' }, { status: 500 })
  }
}
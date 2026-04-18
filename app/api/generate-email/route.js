import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/ratelimit'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// ============================================================
// SIGNATURE — built server-side, never by the model
// ============================================================
function buildSignature(senderName, senderRole, lang) {
  return `– ${senderName}`
}

function appendSignature(body, signature) {
  if (!body) return ''
  const cleaned = body
    .replace(/\n*(best regards?|kind regards?|yours sincerely|regards|saygılarımla|iyi çalışmalar|teşekkürler)[,.]?\s*\n[\s\S]*/gi, '')
    .trimEnd()
  return `${cleaned}\n\n${signature}`
}

// ============================================================
// LANGUAGE DETECTION
// ============================================================
function detectLanguage(text) {
  const turkishPattern = /[çğıöşüÇĞİÖŞÜ]|(\b(ve|ile|için|bir|bu|da|de|ki|ama|veya|gibi|sonra|önce|hakkında|konusunda|olarak|şirket|ürün|hizmet|istiyorum|yapıyoruz|sunuyoruz)\b)/i
  return turkishPattern.test(text) ? 'tr' : 'en'
}

// ============================================================
// MASTER SYSTEM PROMPT
// ============================================================
const MASTER_SYSTEM_PROMPT = `You are an elite cold email copywriter with 15+ years of experience. You have written cold emails for Y Combinator startups, Fortune 500 companies, and top B2B sales teams — consistently achieving 35-60% open rates and 15-25% reply rates. You are a native-level writer in both English and Turkish.

IRON LAWS — NEVER BREAK:
1. CONFIDENCE: State everything as FACT or OBSERVATION. Zero hedging.
   ✗ "I believe your costs might be high"
   ✓ "Energy costs in your sector rose 28% last year."
   ✗ "I think we could possibly help"
   ✓ "We reduced energy costs by 22% for 3 manufacturers in your sector."
   ✗ "It is a known fact that..." → Just state the fact.

2. SIGNATURE: NEVER write a sign-off or signature block. End with the CTA question. Stop. The system adds "– [Name]" automatically.

3. SPECIFICITY: Use the exact company name, industry, pain point, and social proof provided. Never be generic.

4. STRUCTURE: greeting → opening (about THEM) → body → ONE action step. Then stop.

5. FOCUS: "You/your" 3x more than "I/my/we/our". First sentence always about THEM.`

// ============================================================
// FEW-SHOT EXAMPLES
// ============================================================

const FEW_SHOT_EXAMPLES = `
REFERENCE EXAMPLES — these are world-class B2B cold emails. Study the structure, length, and tone. Match this quality exactly.

━━━ ENGLISH: PROFESSIONAL + SHORT (Trigger-based, Problem angle) ━━━
Subject: AcmeCo's reply rates

Hi Sarah,

Saw AcmeCo is hiring SDRs — usually that means reply rates start dipping as volume scales.

We help teams fix that by improving email relevance, not volume. Helped a similar SaaS increase replies by 31% in 6 weeks.

Worth exploring for AcmeCo?
– John

━━━ ENGLISH: PROFESSIONAL + MEDIUM (Trigger-based, Value angle) ━━━
Subject: After AcmeCo's Series B

Hi Sarah,

Congrats on the Series B — growth rounds usually mean more pressure on sales efficiency metrics.

We helped three SaaS teams at your stage increase demo bookings by ~30% without adding headcount. The lever was email relevance, not volume.

Would it make sense to explore this for AcmeCo?
– John

━━━ ENGLISH: FRIENDLY + SHORT (Question hook) ━━━
Subject: Quick question — AcmeCo

Hey Sarah,

Are you currently happy with your demo booking rate?

We've helped 3 similar teams increase it by ~30% without adding SDRs.

Open to a quick chat?
– John

━━━ ENGLISH: FRIENDLY + MEDIUM (Curiosity angle) ━━━
Subject: Something odd about SaaS churn

Hey Sarah,

Counterintuitive finding: SaaS teams with the most features tend to have the highest week-one churn. Users get overwhelmed before reaching value.

Sounds like it might apply to AcmeCo — we've helped 3 similar teams cut that early dropout by 34% just by fixing the activation sequence.

Worth a 10-minute chat?
– John

━━━ ENGLISH: CONFIDENT + SHORT (Direct value) ━━━
Subject: 34% less churn — AcmeCo fit?

Hi Sarah,

We cut first-month churn by 34% for three PLG teams your size. No product changes — just activation sequence fixes.

Could the same apply to AcmeCo?
– John

━━━ ENGLISH: CONFIDENT + MEDIUM (Problem angle) ━━━
Subject: AcmeCo's activation gap

Hi Sarah,

Saw AcmeCo recently launched two new features — that usually signals a growing activation problem underneath.

Users who don't reach value in week one churn at 3x the rate. We've fixed this for teams your size: 34% churn reduction, 90 days, no engineering work.

15 minutes to walk through what this looks like for AcmeCo?
– John

━━━ TÜRKÇE: RESMİ + KISA (Tetikleyici açılış, Problem açısı) ━━━
Konu: Konya Şeker — enerji maliyetleri

Merhaba Ahmet,

Konya Şeker'in kapasite artırımına gittiğini gördüm — genellikle bu, enerji maliyetlerinin de orantısız artması anlamına geliyor.

Benzer ölçekteki 3 fabrikada bu maliyeti %22 düşürdük, üretime dokunmadan.

10 dakika değer mi?
– Fatih

━━━ TÜRKÇE: RESMİ + ORTA (Değer açısı) ━━━
Konu: Konya Şeker enerji giderleri

Merhaba Ahmet,

Şeker üretiminde enerji maliyetleri 2023'te ton başına %31 arttı — büyük ölçekli fabrikalarda bu yıllık milyonlarca TL demek.

Konya Şeker'e benzer 3 fabrikada bu maliyeti %22 düşürdük. Yöntem tekrarlanabilir: üretim dışı saatlerdeki kayıp noktaları kapatmak, yeni ekipman gerektirmiyor.

Kısa bir görüşme ayarlayabilir miyiz?
– Fatih

━━━ TÜRKÇE: YARI RESMİ + KISA (Soru kancası) ━━━
Konu: Hızlı soru — Konya Şeker

Merhaba Ahmet,

Şu an enerji maliyetlerinizden memnun musunuz?

Benzer ölçekteki 3 fabrikada bu maliyeti %22 düşürdük, üretime dokunmadan.

10 dakika konuşmaya değer mi?
– Fatih

━━━ TÜRKÇE: YARI RESMİ + ORTA (Merak kancası) ━━━
Konu: Fabrikalarda gözden kaçan maliyet

Merhaba Ahmet,

İlginç bir bulgu: enerji kayıplarının %60'ı üretim dışı saatlerde gerçekleşiyor — vardiya aralarında, hafta sonlarında. Yani fabrika çalışmadığı zamanlarda para akıp gidiyor.

Konya Şeker'in profili bu kalıpla örtüşüyor. 3 benzer fabrikada bu kaybı kapatarak %22 enerji tasarrufu sağladık.

Bu konuyu 10 dakikada masaya yatırabilir miyiz?
– Fatih

━━━ TÜRKÇE: GÜVENLİ + KISA (Direkt değer) ━━━
Konu: %22 enerji tasarrufu — Konya Şeker?

Merhaba Ahmet,

Konya Şeker'e benzer 3 fabrikada enerji maliyetini %22 düşürdük. Üretim durdurmadan, yeni ekipman olmadan.

Aynısı Konya Şeker için de geçerli olabilir mi?
– Fatih

--- END OF EXAMPLES ---
`
// ============================================================
// ENGLISH RULES
// ============================================================
const ENGLISH_RULES = `
ENGLISH RULES:

TRIGGER-BASED OPENINGS (strongest — use when context allows):
- Job posting signal: "Saw [Company] is hiring [role]..."
- Funding/growth: "Congrats on [funding round/expansion]..."
- News/content: "Noticed [Company] just [specific observable action]..."
- Industry signal: "Saw [Company] [specific growth signal]..."
If no trigger is available, open with a specific industry fact or pain point stated as data.
Subject line: max 50 chars, specific, no clickbait. Use their company name.
Greeting: "Hi [First Name]," (semi-formal) or "Dear Mr./Ms. [Last Name]," (formal)
Opening: About THEM — observable fact or specific observation, never opinion
Body: 2-3 paragraphs, blank line between each, one topic only
CLOSING — SOFT CTA (one line only):
- Soft question: "Worth exploring for [Company]?" / "Open to a quick chat?"
- Or specific: "Worth a 10-minute call this week?"
- NEVER: "Looking forward to hearing from you" / "Let me know if interested"
- NEVER ask for 30+ minutes — max "10-15 minutes"

BANNED: "I hope this email finds you well" / "I wanted to reach out" / "I'm reaching out"
"I believe/think/might/could/perhaps" / "It is well known" / "synergy/leverage/game-changer"
"Looking forward to hearing from you" / "Please don't hesitate"
Starting with "I", "We", "My name is"`

// ============================================================
// TURKISH RULES
// ============================================================
const TURKISH_RULES = `
TÜRKÇE KURALLAR:

TETİKLEYİCİ AÇILIŞLAR (en güçlü — bağlam izin veriyorsa kullan):
- İş ilanı: "[Şirket]'in [pozisyon] aradığını gördüm..."
- Büyüme sinyali: "[Şirket]'in [spesifik gelişme]'sini gördüm..."
- Sektör verisi: "[Sektör]'de [spesifik veri/trend]..."
Tetikleyici yoksa spesifik sektör verisi veya problem ile aç.
Konu satırı: max 50 karakter, spesifik, şirket adıyla kişiselleştirilmiş
Hitap: "Merhaba [İsim]," (yarı resmi) veya "Sayın [İsim] Bey/Hanım," (resmi)
Açılış: ONLAR hakkında — gözlem veya veri, asla fikir veya tahmin
Gövde: 2-3 paragraf, aralarında boş satır, tek konu
KAPANIŞ — YUMUŞAK CTA (tek satır):
- "10 dakika değer mi?" / "Kısa bir görüşme ayarlayabilir miyiz?"
- "[Şirket] için geçerli olabilir mi?"
- ASLA: "Dönüşünüzü bekliyorum" / 30+ dakika talep etme
DUR. İmza veya kapanış selamı YAZMA. Sistem otomatik ekleyecek.

YASAK: "İnanıyorum/Düşünüyorum/Sanıyorum/Belki/Muhtemelen/Olabilir"
"Bilinen bir gerçektir" / "Umarım iyisinizdir" / "Kendimi tanıtmak istiyorum"
"Bu sizin için önemli olabilir" / "Dönüşünüzü bekliyorum"
Cümleye "Ben" ile üst üste başlamak`

// ============================================================
// VARIATION PROMPT
// ============================================================
function buildVariationPrompt({ senderName, senderRole, recipientName, recipientCompany, recipientRole, industry, product, pain, socialProof, goal, tone, length, lang, languageRules }) {
  const wordCount = length?.includes('50') ? '50-80 words' : length?.includes('180') ? '180-220 words' : '100-150 words'
  const recipient = recipientName ? `${recipientName} (${recipientRole || 'decision maker'})` : `${recipientRole || 'decision maker'}`

  return `${MASTER_SYSTEM_PROMPT}

${FEW_SHOT_EXAMPLES}

${languageRules}

---
WRITE 3 COLD EMAIL VARIATIONS:

Sender: ${senderName}${senderRole ? `, ${senderRole}` : ''}
Recipient: ${recipient} at ${recipientCompany} (${industry} industry)
What you offer: ${product}
Their pain point: ${pain}
Social proof: ${socialProof || 'none provided — use realistic estimates for their industry if helpful'}
Goal of this email: ${goal}
Tone: ${tone}
Email length: 40-80 words maximum. This is B2B cold email — brevity is everything. Never exceed 80 words in the body.
Language: ${lang === 'tr' ? 'TURKISH — write everything in Turkish' : 'ENGLISH — write everything in English'}

━━━ VARIATION A: PROBLEM ANGLE (PAS) ━━━
Open by naming their specific pain point as a FACT.
Agitate briefly (consequence of the problem).
Bridge naturally to your solution.
End with goal-aligned CTA: "${goal}"

━━━ VARIATION B: VALUE ANGLE (Result-First) ━━━
Open with your best result / social proof as the very first sentence.
Connect it directly to their company and situation.
End with goal-aligned CTA: "${goal}"

━━━ VARIATION C: INSIGHT ANGLE (Pattern Interrupt) ━━━
Open with a surprising industry insight or counterintuitive data point about ${industry}.
Make them think "I've never thought about it this way."
Bridge from insight → your offer naturally.
End with goal-aligned CTA: "${goal}"

QUALITY CHECKLIST — ALL 3 must pass:
✓ Correct word count: ${wordCount}
✓ First sentence about THEM (company/industry/pain), not the sender
✓ Zero hedging words
✓ Exact social proof used if provided
✓ Subject line under 50 characters, includes company name
✓ ONE action step aligned with goal: "${goal}"
✓ Blank line between paragraphs
✓ NO sign-off, NO name after closing question

FORMAT:
VARIATION_A_SUBJECT: [subject]
VARIATION_A_BODY:
[email body only — no signature]
---
VARIATION_B_SUBJECT: [subject]
VARIATION_B_BODY:
[email body only — no signature]
---
VARIATION_C_SUBJECT: [subject]
VARIATION_C_BODY:
[email body only — no signature]`
}

// ============================================================
// FOLLOW-UP PROMPT
// ============================================================
function buildFollowupPrompt({ senderName, senderRole, recipientName, recipientCompany, recipientRole, industry, product, pain, socialProof, goal, tone, lang, languageRules }) {
  const recipient = recipientName ? `${recipientName} (${recipientRole || 'decision maker'})` : `${recipientRole || 'decision maker'}`

  return `${MASTER_SYSTEM_PROMPT}

${FEW_SHOT_EXAMPLES}

${languageRules}

---
WRITE 2 STRATEGIC FOLLOW-UP EMAILS:

Sender: ${senderName}${senderRole ? `, ${senderRole}` : ''}
Recipient: ${recipient} at ${recipientCompany} (${industry} industry)
Product/service: ${product}
Their pain: ${pain}
Social proof: ${socialProof || 'none'}
Original goal: ${goal}
Tone: ${tone}
Language: ${lang === 'tr' ? 'TURKISH' : 'ENGLISH'}
Email length: 40-80 words maximum. This is B2B cold email — brevity is everything. Never exceed 80 words in the body.

━━━ FOLLOW-UP 1: VALUE ADD (Day 3-4) ━━━
Never just "bump" the email. Add genuinely NEW value:
→ A relevant industry stat about ${industry}
→ OR a short specific insight about ${pain}
→ OR a brief case study related to ${product}
Structure:
- One sentence referencing first email
- 2-3 sentences of NEW value
- Softer CTA than the first email (lower friction)
- Max 80 words body
- NO sign-off, NO signature

━━━ FOLLOW-UP 2: GRACEFUL EXIT (Day 7-10) ━━━
The "breakup" email. Remove pressure → highest reply rates.
Confident, warm, zero desperation, zero guilt.
- Clear: this is the last message
- One sentence leaving the door open permanently
- One final low-pressure question or "if timing changes" offer
- Max 60 words body
- NO sign-off, NO signature

FORMAT:
FOLLOWUP1_SUBJECT: [subject]
FOLLOWUP1_BODY:
[email body — no signature]
---
FOLLOWUP2_SUBJECT: [subject]
FOLLOWUP2_BODY:
[email body — no signature]`
}

// ============================================================
// API HANDLER
// ============================================================
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
    const {
      senderName, senderRole,
      recipientName, recipientCompany, recipientRole, industry,
      product, pain, socialProof,
      goal, tone, length,
      mode,
      // legacy support
      purpose,
    } = body

    // Validation
    if (!senderName || !recipientCompany) {
      return NextResponse.json({ error: 'Missing required fields: senderName, recipientCompany' }, { status: 400 })
    }
    if (!product && !purpose) {
      return NextResponse.json({ error: 'Missing required fields: product or purpose' }, { status: 400 })
    }

    // Language detection — check all text fields
    const textToCheck = [product, pain, purpose, recipientCompany, industry].filter(Boolean).join(' ')
    const lang = detectLanguage(textToCheck)
    const languageRules = lang === 'tr' ? TURKISH_RULES : ENGLISH_RULES
    const signature = buildSignature(senderName, senderRole, lang)

    const ctx = {
      senderName, senderRole,
      recipientName, recipientCompany,
      recipientRole: recipientRole || '',
      industry: industry || 'General',
      product: product || purpose || '',
      pain: pain || purpose || '',
      socialProof: socialProof || '',
      goal: goal || 'Book a meeting',
      tone: tone || 'Professional',
      length: length || 'Medium (100-150 words)',
      lang,
      languageRules,
    }

    // FOLLOW-UP MODE
    if (mode === 'followup') {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: buildFollowupPrompt(ctx) }],
        max_tokens: 1200,
        temperature: 0.8,
      })

      const text = completion.choices[0]?.message?.content || ''
      const f1Subject = text.match(/FOLLOWUP1_SUBJECT:\s*(.+)/i)?.[1]?.trim() || ''
      const f1Body = text.match(/FOLLOWUP1_BODY:\s*([\s\S]+?)(?=---|FOLLOWUP2|$)/i)?.[1]?.trim() || ''
      const f2Subject = text.match(/FOLLOWUP2_SUBJECT:\s*(.+)/i)?.[1]?.trim() || ''
      const f2Body = text.match(/FOLLOWUP2_BODY:\s*([\s\S]+?)$/i)?.[1]?.trim() || ''

      return NextResponse.json({
        followups: [
          { subject: f1Subject, body: appendSignature(f1Body, signature), day: 'Day 3-4' },
          { subject: f2Subject, body: appendSignature(f2Body, signature), day: 'Day 7-10' },
        ]
      })
    }

    // VARIATION MODE
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: buildVariationPrompt(ctx) }],
      max_tokens: 1800,
      temperature: 0.85,
    })

    const text = completion.choices[0]?.message?.content || ''
    const aSubject = text.match(/VARIATION_A_SUBJECT:\s*(.+)/i)?.[1]?.trim() || ''
    const aBody = text.match(/VARIATION_A_BODY:\s*([\s\S]+?)(?=---|VARIATION_B|$)/i)?.[1]?.trim() || ''
    const bSubject = text.match(/VARIATION_B_SUBJECT:\s*(.+)/i)?.[1]?.trim() || ''
    const bBody = text.match(/VARIATION_B_BODY:\s*([\s\S]+?)(?=---|VARIATION_C|$)/i)?.[1]?.trim() || ''
    const cSubject = text.match(/VARIATION_C_SUBJECT:\s*(.+)/i)?.[1]?.trim() || ''
    const cBody = text.match(/VARIATION_C_BODY:\s*([\s\S]+?)$/i)?.[1]?.trim() || ''

    return NextResponse.json({
      variations: [
        { label: 'Problem-Focused', subject: aSubject, body: appendSignature(aBody, signature), color: '#ef4444' },
        { label: 'Value-Focused', subject: bSubject, body: appendSignature(bBody, signature), color: '#7c3aed' },
        { label: 'Curiosity-Focused', subject: cSubject, body: appendSignature(cBody, signature), color: '#f59e0b' },
      ]
    })

  } catch (error) {
    console.error('Groq error:', error)
    return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 })
  }
}
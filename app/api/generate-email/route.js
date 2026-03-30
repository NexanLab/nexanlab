import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/ratelimit'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// ============================================================
// SIGNATURE — built server-side, never by the model
// ============================================================
function buildSignature(senderName, senderRole, lang) {
  if (lang === 'tr') {
    // Türkçe standart format (uzmanposta örneğine göre)
    return `Saygılarımla,\n${senderName}${senderRole ? `\n${senderRole}` : ''}\n[Şirket adınızı ekleyin]\n[Telefon numaranızı ekleyin]`
  } else {
    // İngilizce standart format (Grammarly örneğine göre)
    return `Best regards,\n${senderName}${senderRole ? `\n${senderRole}` : ''}\n[Add your company name]\n[Add your phone number]`
  }
}

// ============================================================
// MASTER SYSTEM PROMPT
// ============================================================
const MASTER_SYSTEM_PROMPT = `You are an elite cold email copywriter with 15+ years of experience writing cold emails for Y Combinator startups, Fortune 500 companies, and top-performing B2B sales teams — consistently achieving 35-60% open rates and 15-25% reply rates.

You are a native-level writer in both English and Turkish.

CORE PHILOSOPHY:
- Every word must earn its place. Cut ruthlessly.
- The reader only cares about: "What's in it for me?"
- Specificity beats generality. "Reduced costs by 22% for 3 manufacturers" destroys "We help companies save money."
- Confident assertions only. Never hedge. State facts, not opinions.

IRON LAW — CONFIDENCE:
State everything as FACT or OBSERVATION, never as opinion or guess.
✗ WRONG: "I believe your costs might be high"
✓ RIGHT: "Energy costs in your sector rose 28% last year."
✗ WRONG: "I think we could possibly help"
✓ RIGHT: "We reduced energy costs by 22% for 3 manufacturers in your sector."
✗ WRONG: "It is a known fact that..."
✓ RIGHT: Just state the fact directly.

IRON LAW — SIGNATURE:
NEVER write a sign-off or signature. The system adds the signature automatically.
End the email body with the closing question or action step. Stop there. No "Best regards", no name, nothing.`

// ============================================================
// ENGLISH RULES
// ============================================================
const ENGLISH_RULES = `
ENGLISH COLD EMAIL RULES:

SUBJECT LINE (max 50 chars):
- State the specific topic directly — no clickbait
- Personalize: "Energy costs at [Company]?" / "[Company] + cost reduction"
- NEVER: "Quick question" / "Following up" / "Touching base" / "Collaboration"

GREETING:
- Semi-formal: "Hi [First Name],"
- Formal: "Dear Mr./Ms. [Last Name],"
- Unknown: "Dear Sir/Madam,"
- Comma after greeting, new line before body

OPENING LINE — MOST CRITICAL:
- About THEM — stated as fact/observation, never opinion
- ✓ "Energy costs in manufacturing rose 28% last year — [Company] feels this directly."
- ✓ "I noticed [Company] recently expanded into [market]."
- ✗ "I believe your costs might be an issue."
- ✗ "I think you could benefit from..."
- ✗ "It is well known that companies like yours..."
- NEVER START WITH: "I hope this email finds you well" / "My name is" / "I wanted to reach out" / "I'm reaching out because"

BODY:
- One topic only, 2-3 short paragraphs
- Blank line between paragraphs (critical for readability)
- Para 1: Specific problem or observation (1-2 sentences, stated as fact)
- Para 2: Your result with concrete proof (1-2 sentences)
  → Use realistic numbers: "reduced costs by 22%", "3 similar companies", "saved 40 hours/month"
- "You/your" used 3x more than "I/my/we/our"
- Active voice always

CLOSING — ACTION STEP:
- Specific and easy: "Are you free for a 15-minute call Wednesday or Thursday?"
- Or offer something: "I can share a quick analysis for [Company] — want me to send it over?"
- NEVER: "Looking forward to hearing from you" / "Let me know if interested" / "Hope to connect"

STOP after the closing question. DO NOT write any sign-off or signature.

BANNED PHRASES:
"I hope this email finds you well" / "I wanted to reach out" / "I'm reaching out"
"I believe" / "I think" / "might" / "could possibly" / "perhaps" / "maybe"
"It is well known" / "It is a known fact" / "As everyone knows"
"Synergy" / "leverage" / "game-changer" / "circle back" / "touch base"
"Looking forward to hearing from you" / "Please don't hesitate"
Starting with "I", "We", "My name is"`

// ============================================================
// TURKISH RULES
// ============================================================
const TURKISH_RULES = `
TÜRKÇE COLD EMAIL KURALLARI:

KONU SATIRI (max 50 karakter):
- İçeriği net ve spesifik özetle, kişiselleştir
- ✓ "Konya Şeker'in Enerji Maliyetleri" / "[Şirket] + maliyet azaltma"
- ✗ "Merhaba" / "İşbirliği teklifi" / "Tanışma"

HİTAP:
- Yarı resmi: "Merhaba [İsim],"
- Resmi: "Sayın [İsim] Bey," / "Sayın [İsim] Hanım,"
- Bilinmiyor: "Sayın Yetkili,"
- Virgül, ardından yeni satır

AÇILIŞ CÜMLESİ — EN KRİTİK:
- ONLARI hakkında — gözlem veya veri, asla fikir veya tahmin
- ✓ "Şeker üretiminde enerji maliyetleri 2023'te sektör genelinde %28 arttı."
- ✓ "[Şirket]'in [faaliyet]'ı [sonuç] yaratıyor."
- ✗ "Enerji maliyetlerinizin yüksek olduğuna inanıyorum."
- ✗ "Büyük ölçekli üreticilerin yüksek maliyetlerle karşılaştığı bilinen bir gerçektir."
- ASLA BAŞLAMA: "Umarım iyisinizdir" / "Kendimi tanıtmak istiyorum" / "Size ulaşmak istedim" / "Düşünüyorum ki"

GÖVDE:
- Tek konu, 2-3 kısa paragraf
- Paragraflar arasında boş satır (okunabilirlik için kritik)
- Para 1: Spesifik problem veya gözlem (1-2 cümle, veri olarak)
- Para 2: Somut sonuç ve kanıt (1-2 cümle)
  → Gerçekçi sayı: "maliyetleri %22 düşürdük" / "3 benzer fabrika" / "ayda 40 saat tasarruf"
- "Siz/sizin" kullanımı "ben/benim"den 3 kat fazla
- Aktif cümle yapısı

KAPANIŞ — AKSİYON ADIMI:
- Spesifik: "Salı veya Çarşamba 15 dakikalık görüşme için müsait misiniz?"
- Somut teklif: "[Şirket] için kısa bir analiz hazırlayabilirim — göndereyim mi?"
- ASLA: "Dönüşünüzü bekliyorum" / "İlgilenirseniz haberdar edin" / "Cevabınızı bekliyor olacağım"

KAPANIŞ SORUSUNDAN SONRA DUR. İmza veya kapanış selamı YAZMA. Sistem otomatik ekleyecek.

YASAK İFADELER:
"İnanıyorum" / "Düşünüyorum" / "Sanıyorum" / "Belki" / "Muhtemelen" / "Olabilir"
"Bilinen bir gerçektir" / "Herkesin bildiği gibi"
"Umarım iyisinizdir" / "Kendimi tanıtmak istiyorum" / "Size ulaşmak istedim"
"Dönüşünüzü bekliyor olacağım" / "Bilgilerinize sunarım"
"Herhangi bir sorunuz olursa çekinmeden yazabilirsiniz"
"Bu sizin için önemli olabilir" (gereksiz köprü cümlesi)
Cümleye "Ben" ile üst üste başlamak`

// ============================================================
// LANGUAGE DETECTION
// ============================================================
function detectLanguage(purpose) {
  const turkishPattern = /[çğıöşüÇĞİÖŞÜ]|(\b(ve|ile|için|bir|bu|da|de|ki|mi|mu|mü|mı|ama|veya|gibi|kadar|sonra|önce|hakkında|konusunda|olarak|şirket|ürün|hizmet|istiyorum|yapıyoruz|sunuyoruz|etmek|olmak)\b)/i
  return turkishPattern.test(purpose) ? 'tr' : 'en'
}

// ============================================================
// APPEND SIGNATURE — called after model output
// ============================================================
function appendSignature(body, signature) {
  if (!body) return ''
  // Modelin yazdığı imzaları temizle (bazen yine de yazar)
  const cleaned = body
    .replace(/\n*(best regards?|kind regards?|yours sincerely|regards|saygılarımla|iyi çalışmalar|teşekkürler)[,.]?\s*\n.*/gi, '')
    .replace(/\n*\[.*?(imza|signature|isim|soyad|name|title|şirket|company|phone|telefon).*?\]/gi, '')
    .trimEnd()
  return `${cleaned}\n\n${signature}`
}

// ============================================================
// VARIATION PROMPT
// ============================================================
const buildVariationPrompt = (senderName, senderRole, recipientName, recipientCompany, purpose, tone, languageRules, lang) => `${MASTER_SYSTEM_PROMPT}

${languageRules}

---
NOW WRITE 3 COLD EMAIL VARIATIONS:

Sender: ${senderName}${senderRole ? `, ${senderRole}` : ''}
Recipient: ${recipientName || (lang === 'tr' ? 'yetkili kişi' : 'the decision maker')} at ${recipientCompany}
Purpose/Goal: ${purpose}
Tone: ${tone || 'professional'}
Language: ${lang === 'tr' ? 'TURKISH — write everything in Turkish' : 'ENGLISH — write everything in English'}

━━━ VARIATION A: PROBLEM ANGLE (PAS Framework) ━━━
Open with a specific painful problem — stated as FACT not opinion.
"Companies at this scale face X" — NOT "You might face X"
Agitate briefly → bridge to solution.

━━━ VARIATION B: VALUE ANGLE (Result-First) ━━━
Open with the specific result you deliver + a concrete number.
Connect directly to THEIR business immediately.

━━━ VARIATION C: INSIGHT ANGLE (Pattern Interrupt) ━━━
Open with a surprising industry insight or counterintuitive observation — stated as data.
Bridge from insight to offer naturally.

QUALITY CHECKLIST — every email MUST pass ALL:
✓ Max 150 words (body only, no signature)
✓ Greeting → opening → body → ONE action step. Then STOP.
✓ First sentence is about THEM
✓ Zero hedging: no believe/think/might/could/perhaps/inanıyorum/düşünüyorum/belki
✓ Zero filler sentences
✓ Blank line between paragraphs
✓ Subject line under 50 characters
✓ NO sign-off, NO name, NO signature at the end

FORMAT (exact):
VARIATION_A_SUBJECT: [subject]
VARIATION_A_BODY:
[email body — no signature]
---
VARIATION_B_SUBJECT: [subject]
VARIATION_B_BODY:
[email body — no signature]
---
VARIATION_C_SUBJECT: [subject]
VARIATION_C_BODY:
[email body — no signature]`

// ============================================================
// FOLLOW-UP PROMPT
// ============================================================
const buildFollowupPrompt = (senderName, senderRole, recipientName, recipientCompany, purpose, tone, languageRules, lang) => `${MASTER_SYSTEM_PROMPT}

${languageRules}

---
WRITE 2 STRATEGIC FOLLOW-UP EMAILS:

Sender: ${senderName}${senderRole ? `, ${senderRole}` : ''}
Recipient: ${recipientName || (lang === 'tr' ? 'yetkili kişi' : 'the decision maker')} at ${recipientCompany}
Original purpose: ${purpose}
Tone: ${tone || 'professional'}
Language: ${lang === 'tr' ? 'TURKISH' : 'ENGLISH'}

━━━ FOLLOW-UP 1: VALUE ADD (Day 3-4) ━━━
Do NOT just bump. Add NEW genuinely useful value: industry stat, insight, case study, or resource.
- One sentence referencing first email
- 2-3 sentences of NEW value specific to their industry
- One softer CTA
- Max 100 words body
- NO sign-off, NO signature

━━━ FOLLOW-UP 2: GRACEFUL EXIT (Day 7-10) ━━━
The "breakup" email. Confident, warm, zero desperation.
- Clear: this is the last message
- One sentence leaving the door open
- One final low-pressure question
- Max 80 words body
- NO sign-off, NO signature

FORMAT:
FOLLOWUP1_SUBJECT: [subject]
FOLLOWUP1_BODY:
[email body — no signature]
---
FOLLOWUP2_SUBJECT: [subject]
FOLLOWUP2_BODY:
[email body — no signature]`

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
    const { senderName, senderRole, recipientName, recipientCompany, purpose, tone, mode } = await request.json()

    if (!senderName || !recipientCompany || !purpose) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (purpose.length > 500) {
      return NextResponse.json({ error: 'Purpose must be under 500 characters.' }, { status: 400 })
    }

    const lang = detectLanguage(purpose)
    const languageRules = lang === 'tr' ? TURKISH_RULES : ENGLISH_RULES
    const signature = buildSignature(senderName, senderRole, lang)

    // FOLLOW-UP MODE
    if (mode === 'followup') {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'user',
          content: buildFollowupPrompt(senderName, senderRole, recipientName, recipientCompany, purpose, tone, languageRules, lang)
        }],
        max_tokens: 1200,
        temperature: 0.8,
      })

      const text = completion.choices[0]?.message?.content || ''
      const f1Subject = text.match(/FOLLOWUP1_SUBJECT:\s*(.+)/i)?.[1]?.trim() || ''
      const f1BodyRaw = text.match(/FOLLOWUP1_BODY:\s*([\s\S]+?)(?=---|FOLLOWUP2|$)/i)?.[1]?.trim() || ''
      const f2Subject = text.match(/FOLLOWUP2_SUBJECT:\s*(.+)/i)?.[1]?.trim() || ''
      const f2BodyRaw = text.match(/FOLLOWUP2_BODY:\s*([\s\S]+?)$/i)?.[1]?.trim() || ''

      return NextResponse.json({
        followups: [
          { subject: f1Subject, body: appendSignature(f1BodyRaw, signature), day: 'Day 3-4' },
          { subject: f2Subject, body: appendSignature(f2BodyRaw, signature), day: 'Day 7-10' },
        ]
      })
    }

    // VARIATION MODE
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: buildVariationPrompt(senderName, senderRole, recipientName, recipientCompany, purpose, tone, languageRules, lang)
      }],
      max_tokens: 1800,
      temperature: 0.85,
    })

    const text = completion.choices[0]?.message?.content || ''

    const aSubject = text.match(/VARIATION_A_SUBJECT:\s*(.+)/i)?.[1]?.trim() || ''
    const aBodyRaw = text.match(/VARIATION_A_BODY:\s*([\s\S]+?)(?=---|VARIATION_B|$)/i)?.[1]?.trim() || ''
    const bSubject = text.match(/VARIATION_B_SUBJECT:\s*(.+)/i)?.[1]?.trim() || ''
    const bBodyRaw = text.match(/VARIATION_B_BODY:\s*([\s\S]+?)(?=---|VARIATION_C|$)/i)?.[1]?.trim() || ''
    const cSubject = text.match(/VARIATION_C_SUBJECT:\s*(.+)/i)?.[1]?.trim() || ''
    const cBodyRaw = text.match(/VARIATION_C_BODY:\s*([\s\S]+?)$/i)?.[1]?.trim() || ''

    return NextResponse.json({
      variations: [
        { label: 'Problem-Focused', subject: aSubject, body: appendSignature(aBodyRaw, signature), color: '#ef4444' },
        { label: 'Value-Focused', subject: bSubject, body: appendSignature(bBodyRaw, signature), color: '#7c3aed' },
        { label: 'Curiosity-Focused', subject: cSubject, body: appendSignature(cBodyRaw, signature), color: '#f59e0b' },
      ]
    })

  } catch (error) {
    console.error('Groq error:', error)
    return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 })
  }
}
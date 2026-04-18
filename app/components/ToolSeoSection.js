'use client'

import { useState } from 'react'

/**
 * ToolSeoSection — Her araç sayfasına eklenen SEO içerik bloğu.
 *
 * Kullanım:
 *   import ToolSeoSection from '@/app/components/ToolSeoSection'
 *   <ToolSeoSection tool="cold-email" />
 *
 * Desteklenen tool değerleri:
 *   "cold-email" | "seo-title" | "ad-copy" | "product-desc" | "code-reviewer" | "image-prompt" | "regex"
 */

const toolContent = {
  'cold-email': {
    accent: '#7c3aed',
    what: {
      heading: 'What is a Cold Email Generator?',
      body: `A cold email generator is an AI-powered tool that writes personalized outreach emails for you in seconds. Instead of staring at a blank page, you simply fill in who you are, who you're contacting, and what you want — the AI handles tone, structure, subject line, and call-to-action.

Cold emails remain one of the highest-ROI channels for freelancers, sales teams, and founders. The challenge is writing emails that don't feel cold. Our generator uses context about your recipient and goal to craft messages that feel human and relevant.`,
    },
    how: [
      { step: '1', title: 'Enter your details', desc: 'Your name, role, and company so the email sounds like it comes from a real person.' },
      { step: '2', title: 'Describe the recipient', desc: "The contact's name and their company — the more specific, the better the personalization." },
      { step: '3', title: 'State your purpose', desc: 'What do you want from this email? A meeting, a reply, a collaboration?' },
      { step: '4', title: 'Pick a tone', desc: 'Professional, friendly, casual — match it to your industry and target audience.' },
      { step: '5', title: 'Copy & send', desc: 'Grab your email, tweak if needed, and hit send. Done in under a minute.' },
    ],
    faqs: [
      { q: 'Are AI-generated cold emails effective?', a: 'Yes — when properly personalized. Our tool uses your specific inputs to create emails that feel tailored, not templated. Always review and add a personal touch before sending.' },
      { q: 'How long should a cold email be?', a: 'Ideally 100–200 words. Busy people skim. Our generator keeps emails concise with a clear value proposition and one call-to-action.' },
      { q: 'Can I use this for LinkedIn messages?', a: 'Absolutely. The generated email body works great as a LinkedIn InMail or connection message — just skip the subject line.' },
      { q: 'Is this tool free?', a: 'Yes, completely free. No account required to generate emails.' },
    ],
  },

  'seo-title': {
    accent: '#7c3aed',
    what: {
      heading: 'What is an SEO Title Generator?',
      body: `An SEO title generator creates optimized title tags for web pages — the clickable headline that appears in Google search results. A great title tag is 50–60 characters, includes your target keyword naturally, and makes people want to click.

Most titles are either too generic ("Home | Company Name") or stuffed with keywords. Our AI finds the balance: titles that satisfy Google's ranking criteria while compelling real humans to click through.`,
    },
    how: [
      { step: '1', title: 'Enter your keyword', desc: 'The main search term you want the page to rank for. Be specific — "best cold brew coffee" beats just "coffee".' },
      { step: '2', title: 'Choose page type', desc: 'Blog post, product page, landing page — different page types need different title structures.' },
      { step: '3', title: 'Select a tone', desc: 'Professional authority, casual friendliness, or urgency — match your brand voice.' },
      { step: '4', title: 'Set quantity', desc: 'Generate 3–10 variations and pick the one with the best angle for your content.' },
      { step: '5', title: 'Check character count', desc: 'The color indicator shows if your title is too short (yellow), ideal (green), or too long (red).' },
    ],
    faqs: [
      { q: 'What is the ideal title tag length?', a: 'Google typically displays 50–60 characters. Longer titles get truncated with "..." in search results. Our tool highlights the ideal range in green.' },
      { q: 'Should I put the keyword at the beginning?', a: 'Generally yes — front-loading your keyword signals relevance to both Google and searchers. Our AI does this automatically.' },
      { q: "How many title tags should I test?", a: 'Generate at least 5 variations and A/B test them over time. Small wording changes can significantly affect click-through rates.' },
      { q: 'Does a good title tag improve rankings?', a: "Title tags are a confirmed ranking factor. More importantly, a compelling title improves click-through rate, which is also a strong ranking signal." },
    ],
  },

  'ad-copy': {
    accent: '#7c3aed',
    what: {
      heading: 'What is an AI Ad Copy Generator?',
      body: `An AI ad copy generator writes headlines, body text, and calls-to-action for paid advertising campaigns. Whether you're running Facebook ads, Google Ads, or LinkedIn campaigns, the copy determines whether someone stops scrolling or keeps going.

Writing ad copy is part science, part art. Our generator handles the science — character limits, platform conventions, persuasion frameworks — so you can focus on the strategy.`,
    },
    how: [
      { step: '1', title: 'Describe your product', desc: 'The more detail you give, the more specific and persuasive the copy. Include what makes you different.' },
      { step: '2', title: 'Define your audience', desc: "Freelancers vs. enterprise teams need completely different copy. Narrow your audience for better results." },
      { step: '3', title: 'Choose the platform', desc: 'Facebook, Google, LinkedIn, TikTok — each has different character limits and user behavior.' },
      { step: '4', title: 'Set your goal', desc: 'Drive sales, generate leads, increase awareness — the goal changes the persuasion strategy.' },
      { step: '5', title: 'Pick a tone and generate', desc: 'Get headlines, body text, description, CTA, and two hook variations — all in one click.' },
    ],
    faqs: [
      { q: 'What is the Facebook ad primary text limit?', a: '125 characters is the recommended limit before text gets truncated in feeds. Our tool shows character counts and flags overruns.' },
      { q: 'What makes a good ad headline?', a: "The best headlines are specific, benefit-focused, and create curiosity or urgency. Vague headlines like 'Best product ever' don't convert. Specific ones do." },
      { q: 'Can I use one ad copy for all platforms?', a: "Not ideally. LinkedIn audiences expect professional language; TikTok skews casual and energetic. Select your platform and let the AI adapt the tone accordingly." },
      { q: 'How many variations should I test?', a: 'Always test at least 3 variations. Our tool generates 2 hook variations plus the primary copy — a solid starting set for A/B testing.' },
    ],
  },

  'product-desc': {
    accent: '#7c3aed',
    what: {
      heading: 'What is an AI Product Description Generator?',
      body: `An AI product description generator writes compelling, conversion-focused copy for your products. Whether you're selling on Shopify, Amazon, Etsy, or your own store, a great product description answers "why should I buy this?" before the customer even asks.

Bad product descriptions list features. Great ones sell outcomes. Our generator writes titles, short hooks, full descriptions, and bullet points — everything you need to get a product listed and converting.`,
    },
    how: [
      { step: '1', title: 'Name your product', desc: 'The full product name as it should appear in listings.' },
      { step: '2', title: 'List key features', desc: 'Battery life, materials, dimensions, unique features — paste them in and the AI turns them into benefits.' },
      { step: '3', title: 'Define your audience', desc: 'Remote workers, gift buyers, gym-goers — knowing your buyer shapes the language and angle.' },
      { step: '4', title: 'Choose platform & tone', desc: 'Amazon listings need different copy than Etsy handmade stores. Select your platform for tailored output.' },
      { step: '5', title: 'Set description length', desc: 'Short for ads, medium for general listings, long for SEO-heavy product pages.' },
    ],
    faqs: [
      { q: 'Do product descriptions affect SEO?', a: 'Yes. Unique, keyword-rich product descriptions help pages rank in Google Shopping and organic search. Duplicate descriptions copied from manufacturers hurt rankings.' },
      { q: "What's the difference between features and benefits?", a: '"40-hour battery life" is a feature. "Work all day without hunting for an outlet" is a benefit. Our AI automatically translates your features into buyer-centric benefits.' },
      { q: 'How long should an Amazon product description be?', a: 'Amazon allows up to 2,000 characters for product descriptions. For A+ Content, focus on visuals + 200–300 word sections. Our medium length setting is ideal.' },
      { q: 'Can I use this for Etsy listings?', a: 'Yes. Select "Etsy" as the platform and the generator adjusts for handmade/vintage tone and Etsy SEO best practices.' },
    ],
  },

  'code-reviewer': {
    accent: '#3b82f6',
    what: {
      heading: 'What is an AI Code Reviewer?',
      body: `An AI code reviewer analyzes your code for bugs, security vulnerabilities, performance issues, and readability problems — instantly. It's like having a senior engineer review your pull request, available 24/7 with no queue.

Code review is one of the highest-leverage activities in software development. But async reviews take time and synchronous reviews require scheduling. Our tool gives you a first-pass review in seconds, so you fix obvious issues before asking a teammate.`,
    },
    how: [
      { step: '1', title: 'Select your language', desc: 'JavaScript, Python, TypeScript, Java, Go, Rust and more — syntax-aware analysis for each.' },
      { step: '2', title: 'Choose focus area', desc: 'Review everything, or zero in on bugs, security, performance, or readability.' },
      { step: '3', title: 'Paste your code', desc: 'Paste a function, a file, or a snippet — any size works.' },
      { step: '4', title: 'Get your score', desc: 'A quality score out of 10 gives you an immediate signal on overall code health.' },
      { step: '5', title: 'Review & apply', desc: 'Copy the improved code version directly — all fixes already applied.' },
    ],
    faqs: [
      { q: 'Is my code stored or shared?', a: 'No. Code is sent to the AI model for analysis and is not stored, logged, or shared. Do not paste credentials or secrets.' },
      { q: 'Can it find all bugs?', a: "AI code review catches common patterns and known anti-patterns. It's excellent for a first pass but doesn't replace thorough testing or human review for critical systems." },
      { q: 'What languages are supported?', a: 'JavaScript, Python, TypeScript, React, Java, C++, Go, Rust, PHP, and SQL — with more languages handled as general code review.' },
      { q: 'How should I use this in my workflow?', a: 'Use it before submitting a PR: paste your diff, fix the flagged issues, then request human review. You arrive with cleaner code and faster turnaround.' },
    ],
  },

  'image-prompt': {
    accent: '#7c3aed',
    what: {
      heading: 'What is an AI Image Prompt Generator?',
      body: `An AI image prompt generator writes detailed, optimized text prompts for AI image generation tools like Midjourney, DALL-E 3, and Stable Diffusion. The quality of your prompt directly determines the quality of the image you get back.

Writing good prompts is a skill — knowing which style keywords, lighting terms, camera angles, and quality boosters to combine. Our generator does that heavy lifting, producing three distinct variations plus a negative prompt to exclude unwanted elements.`,
    },
    how: [
      { step: '1', title: 'Select your AI tool', desc: 'Midjourney, DALL-E 3, Stable Diffusion, Adobe Firefly — each has different syntax and best practices.' },
      { step: '2', title: 'Describe your subject', desc: 'What or who is in the image? Be as specific as possible for better results.' },
      { step: '3', title: 'Set style, mood & lighting', desc: 'Photorealistic or anime? Golden hour or neon lights? These parameters transform the output dramatically.' },
      { step: '4', title: 'Choose camera angle', desc: 'Eye level, bird\'s eye, macro, wide angle — perspective changes the entire feel of an image.' },
      { step: '5', title: 'Copy all 3 prompts', desc: 'Get three unique variations plus a negative prompt. Test all three and keep the best result.' },
    ],
    faqs: [
      { q: 'What makes a prompt work well in Midjourney?', a: 'Specificity + style keywords + technical parameters. Generic prompts give generic results. Midjourney responds well to artist references, lighting descriptors, and aspect ratio flags like --ar 16:9.' },
      { q: 'What is a negative prompt?', a: 'A negative prompt tells the AI what NOT to include — blur, watermarks, extra limbs, bad anatomy. Our generator creates one automatically based on your subject.' },
      { q: 'Do the same prompts work in DALL-E and Midjourney?', a: "Not always. DALL-E 3 understands natural language better; Midjourney prefers comma-separated descriptors. Select your tool and the generator adapts the syntax." },
      { q: 'Can I use these prompts commercially?', a: 'That depends on each platform\'s terms of service. Midjourney\'s commercial rights vary by subscription tier. Always check the terms of the AI tool you use.' },
    ],
  },

  'regex': {
    accent: '#10b981',
    what: {
      heading: 'What is an AI Regex Generator?',
      body: `An AI regex generator converts plain English descriptions into working regular expressions. Instead of memorizing cryptic syntax like \`(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)\`, you describe what you want to match and get a ready-to-use pattern with explanation.

Regular expressions are incredibly powerful for text processing, validation, and search — but the syntax is notoriously hard to read and write. Our tool generates the pattern, explains each part, and includes a live tester so you can verify it works before copying to your codebase.`,
    },
    how: [
      { step: '1', title: 'Describe in plain English', desc: '"Match a valid email address", "Extract all URLs", "Validate a US phone number" — write it naturally.' },
      { step: '2', title: 'Select your language', desc: 'JavaScript, Python, PHP, Java, Go, Ruby — regex flavors differ across languages.' },
      { step: '3', title: 'Add examples (optional)', desc: 'Provide sample strings that should match. This helps the AI generate a more precise pattern.' },
      { step: '4', title: 'Pick flags', desc: 'Global (g), case-insensitive (i), multiline (m) — select the flags you need.' },
      { step: '5', title: 'Test it live', desc: 'Paste a test string into the live tester before copying the regex to your project.' },
    ],
    faqs: [
      { q: 'Do I need to know regex to use this tool?', a: 'No. That\'s the whole point — describe what you want in plain English and get a working pattern. The explanation section helps you understand what was generated.' },
      { q: 'Why does my regex work differently in Python vs JavaScript?', a: 'Regex "flavors" differ across languages. JavaScript uses the ECMA flavor; Python uses its own `re` module syntax. Always select the correct language for accurate output.' },
      { q: 'What is the "g" flag?', a: 'The global flag makes the regex match all occurrences in a string, not just the first one. Without it, most implementations stop after the first match.' },
      { q: 'Can AI-generated regex be trusted in production?', a: 'Always test with edge cases before deploying. The live tester is a start, but regex for security-sensitive tasks (like input validation) should be reviewed carefully.' },
    ],
  },
}

function FaqItem({ q, a, accent }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        borderRadius: '12px',
        border: `1px solid ${open ? accent + '40' : '#2a2a3a'}`,
        background: open ? `${accent}08` : '#0a0a0f',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', gap: '12px',
      }}>
        <span style={{ color: 'white', fontSize: '14px', fontWeight: '500', lineHeight: '1.4' }}>{q}</span>
        <span style={{
          color: accent, fontSize: '18px', flexShrink: 0,
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
          transition: 'transform 0.2s ease',
        }}>+</span>
      </div>
      {open && (
        <div style={{ padding: '0 20px 16px 20px' }}>
          <p style={{ color: '#8b8ba0', fontSize: '13px', lineHeight: '1.7' }}>{a}</p>
        </div>
      )}
    </div>
  )
}

export default function ToolSeoSection({ tool }) {
  const content = toolContent[tool]
  if (!content) return null

  const { accent, what, how, faqs } = content

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px 24px' }}>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${accent}40, transparent)`,
        marginBottom: '64px',
      }} />

      {/* What is it */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '4px', height: '20px', borderRadius: '999px', background: accent }} />
          <span style={{ color: accent, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            About this Tool
          </span>
        </div>
        <h2 style={{
          fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '800', color: 'white',
          marginBottom: '20px', letterSpacing: '-0.5px',
        }}>
          {what.heading}
        </h2>
        <div style={{ maxWidth: '720px' }}>
          {what.body.split('\n\n').map((para, i) => (
            <p key={i} style={{
              color: '#8b8ba0', fontSize: '15px', lineHeight: '1.8',
              marginBottom: i < what.body.split('\n\n').length - 1 ? '16px' : 0,
            }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* How to use */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '4px', height: '20px', borderRadius: '999px', background: accent }} />
          <span style={{ color: accent, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            How it Works
          </span>
        </div>
        <h2 style={{
          fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: '800', color: 'white',
          marginBottom: '32px', letterSpacing: '-0.5px',
        }}>
          How to Use This Tool
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {how.map(({ step, title, desc }) => (
            <div key={step} style={{
              background: '#13131a',
              border: '1px solid #2a2a3a',
              borderRadius: '16px',
              padding: '24px',
              position: 'relative',
              transition: 'border-color 0.2s ease',
            }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = accent + '40'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2a3a'}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: `${accent}20`, border: `1px solid ${accent}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '800', color: accent,
                marginBottom: '14px',
              }}>
                {step}
              </div>
              <h3 style={{ color: 'white', fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>
                {title}
              </h3>
              <p style={{ color: '#8b8ba0', fontSize: '13px', lineHeight: '1.6' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '4px', height: '20px', borderRadius: '999px', background: accent }} />
          <span style={{ color: accent, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            FAQ
          </span>
        </div>
        <h2 style={{
          fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: '800', color: 'white',
          marginBottom: '24px', letterSpacing: '-0.5px',
        }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '720px' }}>
          {faqs.map(({ q, a }) => (
            <FaqItem key={q} q={q} a={a} accent={accent} />
          ))}
        </div>
      </div>

    </div>
  )
}
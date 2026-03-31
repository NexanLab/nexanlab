'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import ToolSeoSection from '@/app/components/ToolSeoSection'

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const LANGUAGES = ['JavaScript', 'Python', 'TypeScript', 'PHP', 'Java', 'Go', 'Ruby', 'Rust']
const AVAILABLE_FLAGS = ['g (global)', 'i (case insensitive)', 'm (multiline)', 's (dotAll)', 'x (extended)']

const COMMON_PATTERNS = [
  { label: 'Email Address', icon: '✉️', desc: 'Valid email format', pattern: '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}', flags: 'gi' },
  { label: 'URL', icon: '🔗', desc: 'http/https URLs', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&\\/=]*)', flags: 'gi' },
  { label: 'US Phone', icon: '📞', desc: 'US phone number', pattern: '(\\+1\\s?)?[\\(]?\\d{3}[\\)]?[\\s.\\-]?\\d{3}[\\s.\\-]?\\d{4}', flags: 'g' },
  { label: 'IPv4 Address', icon: '🌐', desc: 'IPv4 format', pattern: '\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b', flags: 'g' },
  { label: 'Credit Card', icon: '💳', desc: 'Major card formats', pattern: '\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11})\\b', flags: 'g' },
  { label: 'Date (YYYY-MM-DD)', icon: '📅', desc: 'ISO date format', pattern: '\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])', flags: 'g' },
  { label: 'Hex Color', icon: '🎨', desc: '#RGB or #RRGGBB', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b', flags: 'gi' },
  { label: 'Slug', icon: '🔤', desc: 'URL-friendly slug', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', flags: '' },
  { label: 'Strong Password', icon: '🔒', desc: '8+ chars, mixed', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', flags: '' },
  { label: 'HTML Tag', icon: '🏷️', desc: 'HTML element', pattern: '<([a-z]+)([^<]+)*(?:>(.*?)<\\/\\1>|\\s+\\/>)', flags: 'gi' },
  { label: 'JWT Token', icon: '🔑', desc: 'JSON Web Token', pattern: 'eyJ[A-Za-z0-9-_=]+\\.eyJ[A-Za-z0-9-_=]+\\.?[A-Za-z0-9-_.+\\/=]*', flags: 'g' },
  { label: 'Markdown Bold', icon: '**', desc: '**bold** text', pattern: '\\*\\*([^*]+)\\*\\*', flags: 'g' },
  { label: 'IP + Port', icon: '🖥️', desc: 'host:port format', pattern: '(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?):\\d{1,5}', flags: 'g' },
  { label: 'Username', icon: '👤', desc: '3-16 alphanumeric', pattern: '^[a-zA-Z0-9_]{3,16}$', flags: '' },
  { label: 'Semver', icon: '📦', desc: 'Semantic version', pattern: '\\bv?(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)(?:-[\\da-z\\-]+(?:\\.[\\da-z\\-]+)*)?(?:\\+[\\da-z\\-]+(?:\\.[\\da-z\\-]+)*)?\\b', flags: 'gi' },
]

const CODE_TEMPLATES = {
  JavaScript: (regex, flags) => `const pattern = /${regex}/${flags};
const text = "your test string here";

// Test if string matches
const isMatch = pattern.test(text);
console.log("Match:", isMatch);

// Find all matches
const matches = text.match(pattern);
console.log("Matches:", matches);

// Replace matches
const result = text.replace(pattern, "REPLACEMENT");
console.log("Result:", result);`,

  Python: (regex, flags) => {
    const pyFlags = flags.includes('i') ? 're.IGNORECASE' : flags.includes('m') ? 're.MULTILINE' : '0'
    return `import re

pattern = r"${regex}"
text = "your test string here"

# Test if string matches
match = re.search(pattern, text${pyFlags !== '0' ? `, ${pyFlags}` : ''})
print("Match:", bool(match))

# Find all matches
matches = re.findall(pattern, text${pyFlags !== '0' ? `, ${pyFlags}` : ''})
print("Matches:", matches)

# Replace matches
result = re.sub(pattern, "REPLACEMENT", text${pyFlags !== '0' ? `, flags=${pyFlags}` : ''})
print("Result:", result)`
  },

  TypeScript: (regex, flags) => `const pattern: RegExp = /${regex}/${flags};
const text: string = "your test string here";

// Test if string matches
const isMatch: boolean = pattern.test(text);
console.log("Match:", isMatch);

// Find all matches
const matches: RegExpMatchArray | null = text.match(pattern);
console.log("Matches:", matches);

// Type-safe replace
const result: string = text.replace(pattern, "REPLACEMENT");
console.log("Result:", result);`,

  PHP: (regex, flags) => `<?php
$pattern = '/${regex}/${flags}';
$text = "your test string here";

// Test if string matches
$isMatch = preg_match($pattern, $text);
echo "Match: " . ($isMatch ? "true" : "false") . "\\n";

// Find all matches
preg_match_all($pattern, $text, $matches);
echo "Matches: ";
print_r($matches[0]);

// Replace matches
$result = preg_replace($pattern, "REPLACEMENT", $text);
echo "Result: " . $result . "\\n";
?>`,

  Java: (regex, flags) => `import java.util.regex.*;
import java.util.ArrayList;
import java.util.List;

public class RegexExample {
    public static void main(String[] args) {
        String pattern = "${regex}";
        String text = "your test string here";
        
        // Compile pattern
        Pattern p = Pattern.compile(pattern${flags.includes('i') ? ', Pattern.CASE_INSENSITIVE' : ''});
        Matcher m = p.matcher(text);
        
        // Test if string matches
        boolean isMatch = m.find();
        System.out.println("Match: " + isMatch);
        
        // Find all matches
        List<String> matches = new ArrayList<>();
        m.reset();
        while (m.find()) {
            matches.add(m.group());
        }
        System.out.println("Matches: " + matches);
    }
}`,

  Go: (regex, flags) => `package main

import (
    "fmt"
    "regexp"
)

func main() {
    pattern := \`${regex}\`
    text := "your test string here"
    
    // Compile pattern
    re := regexp.MustCompile(pattern)
    
    // Test if string matches
    isMatch := re.MatchString(text)
    fmt.Println("Match:", isMatch)
    
    // Find all matches
    matches := re.FindAllString(text, -1)
    fmt.Println("Matches:", matches)
    
    // Replace matches
    result := re.ReplaceAllString(text, "REPLACEMENT")
    fmt.Println("Result:", result)
}`,

  Ruby: (regex, flags) => `# Regex pattern
pattern = /${regex}/${flags.replace('g', '')}
text = "your test string here"

# Test if string matches
is_match = !text.match(pattern).nil?
puts "Match: #{is_match}"

# Find all matches  
matches = text.scan(pattern)
puts "Matches: #{matches}"

# Replace matches
result = text.gsub(pattern, "REPLACEMENT")
puts "Result: #{result}"`,

  Rust: (regex, flags) => `use regex::Regex;

fn main() {
    let pattern = r"${regex}";
    let text = "your test string here";
    
    // Compile pattern
    let re = Regex::new(pattern).unwrap();
    
    // Test if string matches
    let is_match = re.is_match(text);
    println!("Match: {}", is_match);
    
    // Find all matches
    let matches: Vec<&str> = re.find_iter(text)
        .map(|m| m.as_str())
        .collect();
    println!("Matches: {:?}", matches);
    
    // Replace matches
    let result = re.replace_all(text, "REPLACEMENT");
    println!("Result: {}", result);
}`,
}

/* ─────────────────────────────────────────
   REGEX DIAGRAM COMPONENT
───────────────────────────────────────── */
function parseRegexTokens(pattern) {
  const tokens = []
  let i = 0

  while (i < pattern.length) {
    const ch = pattern[i]

    if (ch === '(' ) {
      if (pattern[i + 1] === '?' && pattern[i + 2] === ':') {
        tokens.push({ type: 'group-non-capture', label: '(?:...)', desc: 'Non-capturing group', color: '#8b5cf6' })
        i += 3
        let depth = 1
        while (i < pattern.length && depth > 0) {
          if (pattern[i] === '(') depth++
          if (pattern[i] === ')') depth--
          i++
        }
      } else if (pattern[i + 1] === '?') {
        tokens.push({ type: 'lookahead', label: '(?...)', desc: 'Lookahead assertion', color: '#f59e0b' })
        i += 2
        let depth = 1
        while (i < pattern.length && depth > 0) {
          if (pattern[i] === '(') depth++
          if (pattern[i] === ')') depth--
          i++
        }
      } else {
        tokens.push({ type: 'group', label: '(...)', desc: 'Capturing group', color: '#7c3aed' })
        i++
        let depth = 1
        while (i < pattern.length && depth > 0) {
          if (pattern[i] === '(') depth++
          if (pattern[i] === ')') depth--
          i++
        }
      }
    } else if (ch === '[') {
      let cls = '['
      i++
      while (i < pattern.length && pattern[i] !== ']') {
        cls += pattern[i]
        i++
      }
      cls += ']'
      i++
      let quant = ''
      if (pattern[i] === '+' || pattern[i] === '*' || pattern[i] === '?') { quant = pattern[i]; i++ }
      else if (pattern[i] === '{') {
        while (i < pattern.length && pattern[i] !== '}') { quant += pattern[i]; i++ }
        quant += '}'; i++
      }
      tokens.push({ type: 'char-class', label: cls + quant, desc: 'Character class', color: '#10b981' })
    } else if (ch === '\\') {
      const next = pattern[i + 1]
      const escapeMap = {
        'd': ['\\d', 'Any digit [0-9]', '#3b82f6'],
        'D': ['\\D', 'Non-digit', '#3b82f6'],
        'w': ['\\w', 'Word char [a-zA-Z0-9_]', '#3b82f6'],
        'W': ['\\W', 'Non-word char', '#3b82f6'],
        's': ['\\s', 'Whitespace', '#06b6d4'],
        'S': ['\\S', 'Non-whitespace', '#06b6d4'],
        'b': ['\\b', 'Word boundary', '#f97316'],
        'B': ['\\B', 'Non-word boundary', '#f97316'],
        'n': ['\\n', 'Newline', '#8b8ba0'],
        't': ['\\t', 'Tab', '#8b8ba0'],
      }
      if (escapeMap[next]) {
        let quant = ''
        let qi = i + 2
        if (pattern[qi] === '+' || pattern[qi] === '*' || pattern[qi] === '?') { quant = pattern[qi]; i = qi }
        else i += 1
        const [label, desc, color] = escapeMap[next]
        tokens.push({ type: 'escape', label: label + quant, desc, color })
      } else {
        tokens.push({ type: 'literal', label: '\\' + next, desc: 'Escaped character', color: '#8b8ba0' })
        i += 1
      }
      i++
    } else if (ch === '^') {
      tokens.push({ type: 'anchor', label: '^', desc: 'Start of string', color: '#ec4899' })
      i++
    } else if (ch === '$') {
      tokens.push({ type: 'anchor', label: '$', desc: 'End of string', color: '#ec4899' })
      i++
    } else if (ch === '.') {
      let quant = ''
      if (pattern[i + 1] === '+' || pattern[i + 1] === '*' || pattern[i + 1] === '?') { quant = pattern[i + 1]; i++ }
      tokens.push({ type: 'wildcard', label: '.' + quant, desc: 'Any character (except newline)', color: '#a78bfa' })
      i++
    } else if (ch === '+' || ch === '*' || ch === '?') {
      if (tokens.length > 0) {
        tokens[tokens.length - 1].label += ch
        tokens[tokens.length - 1].desc += ch === '+' ? ' (one or more)' : ch === '*' ? ' (zero or more)' : ' (optional)'
      }
      i++
    } else if (ch === '|') {
      tokens.push({ type: 'alternation', label: '|', desc: 'OR — match either side', color: '#f59e0b' })
      i++
    } else if (ch === '{') {
      let quant = '{'
      i++
      while (i < pattern.length && pattern[i] !== '}') { quant += pattern[i]; i++ }
      quant += '}'
      i++
      if (tokens.length > 0) {
        tokens[tokens.length - 1].label += quant
        tokens[tokens.length - 1].desc += ` ${quant} times`
      }
    } else {
      let literal = ''
      while (i < pattern.length && !'()[]{}\\^$.|?*+'.includes(pattern[i])) {
        literal += pattern[i]
        i++
      }
      if (literal) tokens.push({ type: 'literal', label: literal, desc: `Literal: "${literal}"`, color: '#94a3b8' })
    }
  }
  return tokens
}

function RegexDiagram({ pattern }) {
  if (!pattern) return null
  const tokens = parseRegexTokens(pattern)
  if (tokens.length === 0) return null

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Visual Breakdown
        </span>
      </div>
      <div style={{
        background: '#0a0a0f', borderRadius: '12px', padding: '20px',
        border: '1px solid rgba(16,185,129,0.2)', overflowX: 'auto',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', minWidth: 'max-content' }}>
          {tokens.map((token, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                padding: '6px 12px', borderRadius: '8px', fontSize: '13px',
                fontFamily: 'monospace', fontWeight: '700', color: token.color,
                background: token.color + '15', border: `1px solid ${token.color}40`,
                whiteSpace: 'nowrap',
              }}>
                {token.label}
              </div>
              <div style={{
                fontSize: '10px', color: '#8b8ba0', textAlign: 'center',
                maxWidth: '80px', lineHeight: '1.3', whiteSpace: 'nowrap',
              }}>
                {token.desc.length > 20 ? token.desc.slice(0, 18) + '…' : token.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   LIVE HIGHLIGHT TESTER
───────────────────────────────────────── */
function LiveTester({ regex, flags }) {
  const [testText, setTestText] = useState('')
  const [matchInfo, setMatchInfo] = useState(null)

  useEffect(() => {
    if (!regex || !testText) { setMatchInfo(null); return }
    try {
      const safeFlags = flags === 'none' ? 'g' : (flags || 'g')
      const hasG = safeFlags.includes('g')
      const useFlags = hasG ? safeFlags : safeFlags + 'g'
      const re = new RegExp(regex, useFlags)
      const allMatches = [...testText.matchAll(re)]
      setMatchInfo({ matches: allMatches, error: null })
    } catch (e) {
      setMatchInfo({ matches: [], error: e.message })
    }
  }, [regex, flags, testText])

  function renderHighlighted() {
    if (!matchInfo || matchInfo.matches.length === 0) {
      return <span style={{ color: '#8b8ba0' }}>{testText || 'Type something above to test...'}</span>
    }

    const parts = []
    let lastIndex = 0
    const COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#3b82f6', '#ec4899']

    matchInfo.matches.forEach((match, idx) => {
      const start = match.index
      const end = start + match[0].length
      const color = COLORS[idx % COLORS.length]

      if (start > lastIndex) {
        parts.push(
          <span key={`t-${idx}`} style={{ color: '#e2e8f0' }}>
            {testText.slice(lastIndex, start)}
          </span>
        )
      }
      parts.push(
        <mark key={`m-${idx}`} style={{
          background: color + '30', color,
          borderRadius: '4px', padding: '1px 2px',
          border: `1px solid ${color}50`, fontWeight: '600',
          fontSize: '13px', fontFamily: 'monospace',
        }}>
          {match[0]}
        </mark>
      )
      lastIndex = end
    })

    if (lastIndex < testText.length) {
      parts.push(
        <span key="t-last" style={{ color: '#e2e8f0' }}>
          {testText.slice(lastIndex)}
        </span>
      )
    }
    return parts
  }

  return (
    <div style={{
      background: '#13131a', border: '1px solid rgba(16,185,129,0.3)',
      borderRadius: '20px', padding: '28px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: matchInfo?.matches?.length ? '#10b981' : '#ef4444',
          boxShadow: matchInfo?.matches?.length ? '0 0 8px #10b981' : 'none',
        }} />
        <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>Live Tester</h3>
        {matchInfo?.matches?.length > 0 && (
          <span style={{
            marginLeft: 'auto', fontSize: '12px', fontWeight: '700',
            padding: '3px 10px', borderRadius: '999px',
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
            color: '#34d399',
          }}>
            {matchInfo.matches.length} match{matchInfo.matches.length !== 1 ? 'es' : ''}
          </span>
        )}
      </div>

      <textarea
        value={testText}
        onChange={(e) => setTestText(e.target.value)}
        placeholder="Paste or type your test text here... Matches will be highlighted instantly."
        rows={4}
        style={{
          width: '100%', padding: '14px', marginBottom: '16px',
          background: '#0a0a0f', border: '1px solid #2a2a3a',
          borderRadius: '10px', color: 'white', fontSize: '14px',
          outline: 'none', resize: 'vertical', lineHeight: '1.6',
          fontFamily: 'monospace', boxSizing: 'border-box',
        }}
      />

      {/* Highlighted Output */}
      <div style={{
        minHeight: '60px', padding: '14px',
        background: '#0a0a0f', border: '1px solid #2a2a3a',
        borderRadius: '10px', fontSize: '14px', lineHeight: '1.8',
        fontFamily: 'monospace', wordBreak: 'break-all',
      }}>
        {matchInfo?.error ? (
          <span style={{ color: '#ef4444', fontSize: '13px' }}>⚠ {matchInfo.error}</span>
        ) : renderHighlighted()}
      </div>

      {/* Match Details */}
      {matchInfo?.matches?.length > 0 && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ color: '#8b8ba0', fontSize: '12px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Match Details
          </div>
          {matchInfo.matches.slice(0, 10).map((match, i) => {
            const COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#3b82f6', '#ec4899']
            const color = COLORS[i % COLORS.length]
            const groups = match.slice(1).filter(Boolean)
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px',
                background: color + '10', border: `1px solid ${color}20`, borderRadius: '8px',
              }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color, minWidth: '20px' }}>#{i + 1}</span>
                <code style={{ color, fontFamily: 'monospace', fontSize: '13px', fontWeight: '600' }}>
                  "{match[0]}"
                </code>
                <span style={{ color: '#8b8ba0', fontSize: '11px', marginLeft: 'auto' }}>
                  pos {match.index}–{match.index + match[0].length}
                </span>
                {groups.length > 0 && (
                  <span style={{ color: '#8b8ba0', fontSize: '11px' }}>
                    groups: {groups.map(g => `"${g}"`).join(', ')}
                  </span>
                )}
              </div>
            )
          })}
          {matchInfo.matches.length > 10 && (
            <div style={{ color: '#8b8ba0', fontSize: '12px', padding: '8px 12px' }}>
              + {matchInfo.matches.length - 10} more matches...
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function RegexGenerator() {
  const [form, setForm] = useState({
    description: '',
    language: 'JavaScript',
    examples: '',
    flags: [],
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [regexCopied, setRegexCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('tester') // 'tester' | 'diagram' | 'code'
  const [activeCodeLang, setActiveCodeLang] = useState('JavaScript')
  const [codeCopied, setCodeCopied] = useState(false)
  const [activePattern, setActivePattern] = useState(null) // for common patterns

  async function generate() {
    if (!form.description.trim()) {
      setError('Please describe what you want to match.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    setActiveTab('tester')

    try {
      const response = await fetch('/api/generate-regex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (data.error) { setError(data.error) }
      else { setResult(data); setActivePattern(null) }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  function loadCommonPattern(p) {
    setActivePattern(p)
    setResult({
      regex: p.pattern,
      flags: p.flags || 'g',
      explanation: `This pattern matches ${p.desc}. It is optimized for common use cases.`,
      testCases: [],
      jsExample: CODE_TEMPLATES.JavaScript(p.pattern, p.flags || 'g'),
    })
    setActiveTab('tester')
  }

  function toggleFlag(flag) {
    const flagChar = flag.split(' ')[0]
    setForm(prev => ({
      ...prev,
      flags: prev.flags.includes(flagChar)
        ? prev.flags.filter(f => f !== flagChar)
        : [...prev.flags, flagChar],
    }))
  }

  async function copyRegex() {
    if (!result?.regex) return
    const flagStr = result.flags === 'none' ? '' : (result.flags || '')
    await navigator.clipboard.writeText(`/${result.regex}/${flagStr}`)
    setRegexCopied(true)
    setTimeout(() => setRegexCopied(false), 2000)
  }

  async function copyCode() {
    if (!result?.regex) return
    const flagStr = result.flags === 'none' ? '' : (result.flags || '')
    const code = CODE_TEMPLATES[activeCodeLang]?.(result.regex, flagStr) || ''
    await navigator.clipboard.writeText(code)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const currentFlags = result ? (result.flags === 'none' ? '' : result.flags || '') : ''

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: #8b8ba0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 900px) {
          .regex-grid { grid-template-columns: 1fr !important; }
          .regex-form-sticky { position: static !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2a2a3a', padding: '0 24px',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '800', color: 'white',
            }}>N</div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
              Nexan<span style={{ color: '#7c3aed' }}>Lab</span>
            </span>
          </Link>
          <Link href="/tools" style={{ color: '#8b8ba0', fontSize: '14px', textDecoration: 'none' }}>
            ← Back to Tools
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)',
            color: '#34d399', fontSize: '12px', fontWeight: '600', marginBottom: '24px',
          }}>
            ✦ AI-Powered Tool
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>
            AI Regex Generator
          </h1>
          <p style={{ color: '#8b8ba0', fontSize: '17px', maxWidth: '520px', margin: '0 auto' }}>
            Describe what you want to match in plain English — get a working regex with live testing, visual breakdown, and multi-language code.
          </p>
        </div>

        {/* Common Patterns Library */}
        <div style={{
          background: '#13131a', border: '1px solid #2a2a3a',
          borderRadius: '20px', padding: '28px', marginBottom: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '16px' }}>📚</span>
            <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>Common Patterns Library</h2>
            <span style={{
              fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '999px',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
              color: '#34d399', marginLeft: 'auto',
            }}>
              {COMMON_PATTERNS.length} patterns
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {COMMON_PATTERNS.map((p) => (
              <button
                key={p.label}
                onClick={() => loadCommonPattern(p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  border: activePattern?.label === p.label ? '1px solid #10b981' : '1px solid #2a2a3a',
                  background: activePattern?.label === p.label ? 'rgba(16,185,129,0.15)' : '#0a0a0f',
                  color: activePattern?.label === p.label ? '#34d399' : '#8b8ba0',
                }}
                title={p.desc}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="regex-grid" style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>

          {/* ── LEFT: Form ── */}
          <div className="regex-form-sticky" style={{ position: 'sticky', top: '84px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: '#13131a', border: '1px solid #2a2a3a',
              borderRadius: '20px', padding: '28px',
            }}>
              <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>
                🔍 Describe Your Pattern
              </h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  What should it match? <span style={{ color: '#10b981' }}>*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generate() }}
                  placeholder={'e.g. Match a valid email address\ne.g. Extract all URLs from text\ne.g. Validate a US phone number'}
                  rows={4}
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: '#0a0a0f', border: '1px solid #2a2a3a',
                    borderRadius: '10px', color: 'white', fontSize: '14px',
                    outline: 'none', resize: 'vertical', lineHeight: '1.5',
                  }}
                />
                <div style={{ color: '#8b8ba0', fontSize: '11px', marginTop: '4px' }}>
                  Tip: Press ⌘+Enter to generate
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  Language
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {LANGUAGES.map((l) => (
                    <button key={l} onClick={() => { setForm({ ...form, language: l }); setActiveCodeLang(l) }} style={{
                      padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      border: form.language === l ? '1px solid #10b981' : '1px solid #2a2a3a',
                      background: form.language === l ? 'rgba(16,185,129,0.15)' : '#0a0a0f',
                      color: form.language === l ? '#34d399' : '#8b8ba0',
                    }}>{l}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  Examples to Match <span style={{ color: '#8b8ba0', fontWeight: '400' }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.examples}
                  onChange={(e) => setForm({ ...form, examples: e.target.value })}
                  placeholder="e.g. user@example.com, test@mail.org"
                  style={{
                    width: '100%', height: '44px', padding: '0 14px',
                    background: '#0a0a0f', border: '1px solid #2a2a3a',
                    borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#8b8ba0', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  Flags
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {AVAILABLE_FLAGS.map((flag) => {
                    const flagChar = flag.split(' ')[0]
                    const isSelected = form.flags.includes(flagChar)
                    return (
                      <button key={flag} onClick={() => toggleFlag(flag)} style={{
                        padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        border: isSelected ? '1px solid #f59e0b' : '1px solid #2a2a3a',
                        background: isSelected ? 'rgba(245,158,11,0.15)' : '#0a0a0f',
                        color: isSelected ? '#f59e0b' : '#8b8ba0',
                        fontFamily: 'monospace',
                      }}>{flag}</button>
                    )
                  })}
                </div>
              </div>

              {error && (
                <div style={{
                  padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#f87171', fontSize: '13px',
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={generate}
                disabled={loading}
                style={{
                  width: '100%', height: '52px',
                  background: loading ? '#064e3b' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 0 24px rgba(16,185,129,0.4)',
                  transition: 'all 0.2s ease',
                }}
              >
                {loading ? '⟳ Generating...' : '⚡ Generate Regex'}
              </button>
            </div>
          </div>

          {/* ── RIGHT: Results ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {loading && (
              <div style={{
                background: '#13131a', border: '1px solid #2a2a3a',
                borderRadius: '20px', padding: '60px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  border: '3px solid #2a2a3a', borderTop: '3px solid #10b981',
                  animation: 'spin 1s linear infinite',
                }} />
                <p style={{ color: '#8b8ba0', fontSize: '14px' }}>Building your regex...</p>
              </div>
            )}

            {result && !loading && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>

                {/* Pattern Card */}
                <div style={{
                  background: '#13131a', border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: '20px', padding: '28px', marginBottom: '20px',
                }}>
                  {activePattern && (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px',
                      padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                      background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                      color: '#f59e0b',
                    }}>
                      {activePattern.icon} {activePattern.label} — From Library
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>⚡ Your Regex</h2>
                    <button onClick={copyRegex} style={{
                      padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                      cursor: 'pointer',
                      background: regexCopied ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.3)', color: '#34d399',
                    }}>
                      {regexCopied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>

                  <div style={{
                    background: '#0a0a0f', borderRadius: '12px', padding: '20px',
                    border: '1px solid rgba(16,185,129,0.2)', marginBottom: '8px',
                  }}>
                    <code style={{
                      color: '#34d399', fontSize: '18px', fontFamily: 'monospace', fontWeight: '600',
                      wordBreak: 'break-all',
                    }}>
                      /{result.regex}/{currentFlags}
                    </code>
                  </div>

                  {result.explanation && (
                    <p style={{ color: '#8b8ba0', fontSize: '13px', lineHeight: '1.7', marginBottom: '8px' }}>
                      {result.explanation.split('\n')[0]}
                    </p>
                  )}

                  {/* Visual Diagram */}
                  <RegexDiagram pattern={result.regex} />
                </div>

                {/* Tab Navigation */}
                <div style={{
                  display: 'flex', gap: '4px', marginBottom: '16px',
                  background: '#13131a', borderRadius: '12px', padding: '4px',
                  border: '1px solid #2a2a3a',
                }}>
                  {[
                    { id: 'tester', icon: '🧪', label: 'Live Tester' },
                    { id: 'code', icon: '💻', label: 'Code Export' },
                    { id: 'cases', icon: '✅', label: 'Test Cases' },
                    { id: 'explain', icon: '📖', label: 'Explanation' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        flex: 1, padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                        cursor: 'pointer', transition: 'all 0.2s ease', border: 'none',
                        background: activeTab === tab.id ? 'rgba(16,185,129,0.15)' : 'transparent',
                        color: activeTab === tab.id ? '#34d399' : '#8b8ba0',
                      }}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab: Live Tester */}
                {activeTab === 'tester' && (
                  <LiveTester regex={result.regex} flags={currentFlags} />
                )}

                {/* Tab: Code Export */}
                {activeTab === 'code' && (
                  <div style={{
                    background: '#13131a', border: '1px solid #2a2a3a',
                    borderRadius: '20px', padding: '28px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>💻 Code Export</h3>
                      <button onClick={copyCode} style={{
                        padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                        cursor: 'pointer',
                        background: codeCopied ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)',
                        border: codeCopied ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(124,58,237,0.3)',
                        color: codeCopied ? '#34d399' : '#a78bfa',
                      }}>
                        {codeCopied ? '✓ Copied!' : '📋 Copy Code'}
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {LANGUAGES.map(lang => (
                        <button key={lang} onClick={() => setActiveCodeLang(lang)} style={{
                          padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                          cursor: 'pointer', transition: 'all 0.2s ease',
                          border: activeCodeLang === lang ? '1px solid #7c3aed' : '1px solid #2a2a3a',
                          background: activeCodeLang === lang ? 'rgba(124,58,237,0.2)' : '#0a0a0f',
                          color: activeCodeLang === lang ? '#a78bfa' : '#8b8ba0',
                        }}>{lang}</button>
                      ))}
                    </div>
                    <pre style={{
                      background: '#0a0a0f', borderRadius: '10px', padding: '18px',
                      color: '#e2e8f0', fontSize: '13px', lineHeight: '1.7',
                      overflowX: 'auto', border: '1px solid #2a2a3a',
                      fontFamily: 'monospace', whiteSpace: 'pre',
                    }}>
                      {CODE_TEMPLATES[activeCodeLang]?.(result.regex, currentFlags) || '// Template not available'}
                    </pre>
                  </div>
                )}

                {/* Tab: Test Cases */}
                {activeTab === 'cases' && (
                  <div style={{
                    background: '#13131a', border: '1px solid #2a2a3a',
                    borderRadius: '20px', padding: '28px',
                  }}>
                    <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>✅ Test Cases</h3>
                    {result.testCases && result.testCases.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {result.testCases.map((tc, i) => {
                          let liveResult = null
                          try {
                            const re = new RegExp(result.regex, currentFlags || 'g')
                            liveResult = re.test(tc.value)
                          } catch {}
                          const expected = tc.type === 'match'
                          const passed = liveResult === expected
                          return (
                            <div key={i} style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '12px 16px', borderRadius: '10px',
                              background: '#0a0a0f',
                              border: `1px solid ${passed ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                            }}>
                              <span style={{ fontSize: '16px' }}>{passed ? '✅' : '❌'}</span>
                              <code style={{
                                color: expected ? '#34d399' : '#f87171',
                                fontSize: '13px', fontFamily: 'monospace', flex: 1,
                              }}>
                                {tc.value}
                              </code>
                              <span style={{ color: '#8b8ba0', fontSize: '11px', whiteSpace: 'nowrap' }}>
                                {expected ? 'should match' : 'should not match'}
                              </span>
                              {liveResult !== null && (
                                <span style={{
                                  fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '999px',
                                  background: passed ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                  color: passed ? '#34d399' : '#f87171',
                                }}>
                                  {passed ? 'PASS' : 'FAIL'}
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p style={{ color: '#8b8ba0', fontSize: '14px' }}>No test cases generated. Try generating with AI for test cases.</p>
                    )}
                  </div>
                )}

                {/* Tab: Explanation */}
                {activeTab === 'explain' && (
                  <div style={{
                    background: '#13131a', border: '1px solid #2a2a3a',
                    borderRadius: '20px', padding: '28px',
                  }}>
                    <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>📖 Full Explanation</h3>
                    <p style={{ color: '#8b8ba0', fontSize: '14px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                      {result.explanation || 'No explanation available.'}
                    </p>
                  </div>
                )}

                {/* Regenerate */}
                <button
                  onClick={generate}
                  style={{
                    width: '100%', height: '44px', marginTop: '16px',
                    background: 'transparent', border: '1px solid #2a2a3a',
                    borderRadius: '10px', color: '#8b8ba0', fontSize: '14px',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a3a'; e.currentTarget.style.color = '#8b8ba0' }}
                >
                  🔄 Regenerate
                </button>
              </div>
            )}

            {/* Empty State */}
            {!result && !loading && (
              <div style={{
                background: '#13131a', border: '1px solid #2a2a3a',
                borderRadius: '20px', padding: '60px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center',
              }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '20px',
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
                }}>
                  ⚡
                </div>
                <p style={{ color: 'white', fontSize: '17px', fontWeight: '600' }}>
                  The most complete regex tool
                </p>
                <p style={{ color: '#8b8ba0', fontSize: '14px', maxWidth: '320px', lineHeight: '1.6' }}>
                  Describe what you want to match or select a pattern from the library above.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px', width: '100%', maxWidth: '360px' }}>
                  {[
                    { icon: '🧪', text: 'Live highlight tester' },
                    { icon: '🎨', text: 'Visual pattern diagram' },
                    { icon: '💻', text: '8 language exports' },
                    { icon: '📚', text: '15 ready-made patterns' },
                  ].map((f) => (
                    <div key={f.text} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 14px', borderRadius: '10px',
                      background: '#0a0a0f', border: '1px solid #2a2a3a',
                    }}>
                      <span style={{ fontSize: '16px' }}>{f.icon}</span>
                      <span style={{ color: '#8b8ba0', fontSize: '12px' }}>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <ToolSeoSection tool="regex" />
    </div>
  )
}
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Her IP için 10 saniyede 5 istek
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 s'),
  analytics: true,
})

// Rate limit kontrolü + kalan süreyi hesapla
export async function checkRateLimit(ip) {
  const { success, reset } = await ratelimit.limit(ip)

  if (!success) {
    const now = Date.now()
    const retryAfter = Math.ceil((reset - now) / 1000)
    return { success: false, retryAfter: retryAfter > 0 ? retryAfter : 10 }
  }

  return { success: true, retryAfter: 0 }
}
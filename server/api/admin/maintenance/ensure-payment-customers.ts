import { user as userTable } from '~~/server/database/schema'
import { useDB } from '~~/server/utils/db'
import { ensurePolarCustomer } from '~~/server/utils/polar'
import { runtimeConfig } from '~~/server/utils/runtimeConfig'
import { ensureStripeCustomer } from '~~/server/utils/stripe'

export default defineEventHandler(async () => {
  const db = await useDB()

  // Get all users from database
  const users = await db.select().from(userTable)

  const results = {
    totalUsers: users.length,
    stripeResults: [] as Array<{ userId: string, status: 'success' | 'error', message?: string }>,
    polarResults: [] as Array<{ userId: string, status: 'success' | 'error', message?: string }>
  }

  // Process each user
  for (const user of users) {
    // Ensure Stripe customer if Stripe is enabled
    if (runtimeConfig.public.payment === 'stripe' && runtimeConfig.stripeSecretKey) {
      try {
        await ensureStripeCustomer(user)
        results.stripeResults.push({
          userId: user.id,
          status: 'success'
        })
      } catch (error) {
        results.stripeResults.push({
          userId: user.id,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
        break
      }
    }

    // Ensure Polar customer if Polar is enabled
    if (runtimeConfig.public.payment === 'polar' && runtimeConfig.polarAccessToken) {
      try {
        await ensurePolarCustomer(user)
        results.polarResults.push({
          userId: user.id,
          status: 'success'
        })
      } catch (error) {
        results.polarResults.push({
          userId: user.id,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
        break
      }
    }
  }

  return {
    success: true,
    data: results,
    summary: {
      totalUsers: results.totalUsers,
      stripeSuccessCount: results.stripeResults.filter(r => r.status === 'success').length,
      stripeErrorCount: results.stripeResults.filter(r => r.status === 'error').length,
      polarSuccessCount: results.polarResults.filter(r => r.status === 'success').length,
      polarErrorCount: results.polarResults.filter(r => r.status === 'error').length
    }
  }
})

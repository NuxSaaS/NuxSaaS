import type { NitroRuntimeConfig } from 'nitropack/types'
import { config } from 'dotenv'

let runtimeConfigInstance: NitroRuntimeConfig

export const generateRuntimeConfig = () => ({
  preset: process.env.NUXT_NITRO_PRESET,
  betterAuthSecret: process.env.NUXT_BETTER_AUTH_SECRET,
  // Stripe
  stripeSecretKey: process.env.NUXT_STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.NUXT_STRIPE_WEBHOOK_SECRET,
  stripePriceIdProMonth: process.env.NUXT_STRIPE_PRICE_ID_PRO_MONTH,
  stripePriceIdProYear: process.env.NUXT_STRIPE_PRICE_ID_PRO_YEAR,
  // Polar
  polarServer: process.env.NUXT_POLAR_SERVER,
  polarAccessToken: process.env.NUXT_POLAR_ACCESS_TOKEN,
  polarWebhookSecret: process.env.NUXT_POLAR_WEBHOOK_SECRET,
  polarProductIdProMonth: process.env.NUXT_POLAR_PRODUCT_ID_PRO_MONTH,
  polarProductIdProYear: process.env.NUXT_POLAR_PRODUCT_ID_PRO_YEAR,
  // Resend
  resendApiKey: process.env.NUXT_RESEND_API_KEY,
  // Github
  githubClientId: process.env.NUXT_GH_CLIENT_ID,
  githubClientSecret: process.env.NUXT_GH_CLIENT_SECRET,
  // Google
  googleClientId: process.env.NUXT_GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
  // DB
  redisUrl: process.env.NUXT_REDIS_URL,
  databaseUrl: process.env.NUXT_DATABASE_URL,
  public: {
    baseURL: process.env.NUXT_APP_URL,
    appName: process.env.NUXT_APP_NAME,
    appEnv: process.env.NODE_ENV,
    appRepo: process.env.NUXT_APP_REPO,
    appNotifyEmail: process.env.NUXT_APP_NOTIFY_EMAIL,
    appContactEmail: process.env.NUXT_APP_CONTACT_EMAIL,
    payment: process.env.NUXT_PAYMENT || 'stripe',
    auth: {
      redirectUserTo: '/',
      redirectGuestTo: '/signin'
    }
  }
})

if (typeof useRuntimeConfig !== 'undefined') {
  runtimeConfigInstance = useRuntimeConfig()
} else {
  // for cli: npm run auth:schema
  config()
  runtimeConfigInstance = generateRuntimeConfig() as NitroRuntimeConfig
}

export const runtimeConfig = runtimeConfigInstance

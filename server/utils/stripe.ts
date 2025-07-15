import type { Subscription } from '@better-auth/stripe'
import { stripe } from '@better-auth/stripe'
import { eq } from 'drizzle-orm'
import Stripe from 'stripe'
import { user as userTable } from '../database/schema'
import { logAuditEvent } from './auditLogger'
import { useDB } from './db'
import { runtimeConfig } from './runtimeConfig'

const getUserByStripeCustomerId = async (stripeCustomerId: string) => {
  const db = await useDB()
  const user = db.query.user.findFirst({
    where: eq(userTable.stripeCustomerId, stripeCustomerId)
  })
  return user
}

const addPaymentLog = async (action: string, subscription: Subscription) => {
  const user = await getUserByStripeCustomerId(subscription.stripeCustomerId!)
  await logAuditEvent({
    userId: user!.id,
    category: 'payment',
    action: `${action}:${subscription.plan}`,
    targetType: 'stripeCustomerId',
    targetId: subscription.stripeCustomerId,
    status: 'success'
  })
}

export const setupStripe = () => stripe({
  stripeClient: new Stripe(runtimeConfig.stripeSecretKey!),
  stripeWebhookSecret: runtimeConfig.stripeWebhookSecret,
  createCustomerOnSignUp: runtimeConfig.public.payment == 'stripe',
  subscription: {
    enabled: true,
    plans: [
      {
        name: 'pro-monthly',
        priceId: runtimeConfig.stripePriceIdProMonth,
        freeTrial: {
          days: 14,
          onTrialStart: async (subscription) => {
            // Called when a trial starts
            await addPaymentLog('trial_start', subscription)
          },
          onTrialEnd: async ({ subscription }) => {
            // Called when a trial ends
            await addPaymentLog('trial_end', subscription)
          },
          onTrialExpired: async (subscription) => {
            // Called when a trial expires without conversion
            await addPaymentLog('trial_expired', subscription)
          }
        }
      },
      {
        name: 'pro-yearly',
        priceId: runtimeConfig.stripePriceIdProYear,
        freeTrial: {
          days: 14,
          onTrialStart: async (subscription) => {
            // Called when a trial starts
            await addPaymentLog('trial_start', subscription)
          },
          onTrialEnd: async ({ subscription }) => {
            // Called when a trial ends
            await addPaymentLog('trial_end', subscription)
          },
          onTrialExpired: async (subscription) => {
            // Called when a trial expires without conversion
            await addPaymentLog('trial_expired', subscription)
          }
        }
      }
    ],
    onSubscriptionComplete: async ({ subscription }) => {
      // Called when a subscription is successfully created
      await addPaymentLog('subscription_created', subscription)
    },
    onSubscriptionUpdate: async ({ subscription }) => {
      // Called when a subscription is updated
      await addPaymentLog('subscription_updated', subscription)
    },
    onSubscriptionCancel: async ({ subscription }) => {
      // Called when a subscription is canceled
      await addPaymentLog('subscription_canceled', subscription)
    },
    onSubscriptionDeleted: async ({ subscription }) => {
      // Called when a subscription is deleted
      await addPaymentLog('subscription_deleted', subscription)
    }
  }
})

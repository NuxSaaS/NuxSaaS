import type { Benefit } from '@polar-sh/sdk/models/components/benefit.js'
import type { BenefitGrantWebhook } from '@polar-sh/sdk/models/components/benefitgrantwebhook.js'
import type { Checkout } from '@polar-sh/sdk/models/components/checkout.js'
import type { Customer } from '@polar-sh/sdk/models/components/customer.js'
import type { CustomerState } from '@polar-sh/sdk/models/components/customerstate.js'
import type { Order } from '@polar-sh/sdk/models/components/order.js'
import type { Organization } from '@polar-sh/sdk/models/components/organization.js'
import type { Product } from '@polar-sh/sdk/models/components/product.js'
import type { Refund } from '@polar-sh/sdk/models/components/refund.js'
import type { Subscription } from '@polar-sh/sdk/models/components/subscription.js'
import { checkout, polar, portal, usage, webhooks } from '@polar-sh/better-auth'
import { Polar } from '@polar-sh/sdk'
import { eq } from 'drizzle-orm'
import { user as userTable } from '../database/schema'
import { runtimeConfig } from './runtimeConfig'

const createPolarClient = () => {
  return new Polar({
    accessToken: runtimeConfig.polarAccessToken,
    server: runtimeConfig.polarServer as 'sandbox' | 'production'
  })
}

export const ensurePolarCustomer = async (user: User) => {
  const client = createPolarClient()
  const { result: existingCustomers } = await client.customers.list({ email: user.email })
  const existingCustomer = existingCustomers.items[0]
  if (existingCustomer) {
    if (existingCustomer.externalId !== user.id) {
      await client.customers.update({
        id: existingCustomer.id,
        customerUpdate: {
          externalId: user.id
        }
      })
    }
    return existingCustomer
  } else {
    const customer = await client.customers.create({
      email: user.email,
      name: user.name,
      externalId: user.id
    })
    return customer
  }
}

const addPaymentLog = async (hookType: string, data: Customer | Checkout | Benefit | BenefitGrantWebhook | Order | Organization | Product | Refund | Subscription | CustomerState) => {
  if (hookType.startsWith('checkout.')) {
    const checkout = data as Checkout
    await logAuditEvent({
      userId: checkout.customerExternalId || undefined,
      category: 'payment',
      action: `polar:${hookType}:${checkout.product.name}`,
      targetType: 'polarExternalId',
      targetId: checkout.customerExternalId || checkout.metadata.email as string,
      status: 'success'
    })
  } else if (hookType.startsWith('customer.')) {
    const customer = data as Customer
    if (hookType == 'customer.created' && customer.externalId) {
      const db = await useDB()
      await db.update(userTable).set({
        polarCustomerId: customer.id
      }).where(eq(userTable.id, customer.externalId))
    }
    await logAuditEvent({
      userId: customer.externalId || undefined,
      category: 'payment',
      action: `polar:${hookType}`,
      targetType: 'polarExternalId',
      targetId: customer.externalId || undefined,
      status: 'success'
    })
  } else if (hookType.startsWith('subscription.')) {
    const subscription = data as Subscription
    await logAuditEvent({
      userId: subscription.customer.externalId || undefined,
      category: 'payment',
      action: `polar:${hookType}:${subscription.product.name}`,
      targetType: 'polarExternalId',
      targetId: subscription.customer.externalId || undefined,
      status: 'success'
    })
  }
}

export const setupPolar = () => polar({
  client: createPolarClient(),
  createCustomerOnSignUp: runtimeConfig.public.payment == 'polar',
  use: [
    checkout({
      products: [
        {
          productId: runtimeConfig.polarProductIdProMonth,
          slug: 'pro-monthly'
        },
        {
          productId: runtimeConfig.polarProductIdProYear,
          slug: 'pro-yearly'
        }
      ],
      successUrl: '/',
      authenticatedUsersOnly: true
    }),
    portal(),
    usage(),
    webhooks({
      // On Polar Organization Settings: {APP_URL}/api/auth/polar/webhooks
      secret: runtimeConfig.polarWebhookSecret,
      onPayload: async (payload) => {
        // Catch-all for all events
        await addPaymentLog(payload.type || '', payload.data)
      }
    })
  ]
})

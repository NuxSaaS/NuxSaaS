import type { Subscription } from '@better-auth/stripe'
import type { CustomerState } from '@polar-sh/sdk/models/components/customerstate.js'
import type {
  ClientOptions,
  InferSessionFromClient
} from 'better-auth/client'
import type { RouteLocationRaw } from 'vue-router'
import { stripeClient } from '@better-auth/stripe/client'
import { polarClient } from '@polar-sh/better-auth'
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'

export function useAuth() {
  const url = useRequestURL()
  const headers = import.meta.server ? useRequestHeaders() : undefined
  const runtimeConfig = useRuntimeConfig()
  const payment = runtimeConfig.public.payment as 'stripe' | 'polar'
  const client = createAuthClient({
    baseURL: url.origin,
    fetchOptions: {
      headers
    },
    plugins: [
      inferAdditionalFields({
        user: {
          polarCustomerId: {
            type: 'string'
          }
        }
      }),
      adminClient(),
      polarClient(),
      stripeClient({
        subscription: true
      })
    ]
  })

  const session = useState<InferSessionFromClient<ClientOptions> | null>('auth:session', () => null)
  const user = useState<User | null>('auth:user', () => null)
  const subscriptions = useState<Subscription[]>('auth:subscriptions', () => [])
  const polarState = useState<CustomerState | null>('auth:polarState', () => null)
  const sessionFetching = import.meta.server ? ref(false) : useState('auth:sessionFetching', () => false)

  const fetchSession = async () => {
    if (sessionFetching.value) {
      return
    }
    sessionFetching.value = true
    const { data } = await client.getSession()
    session.value = data?.session || null

    const userDefaults = {
      image: null,
      role: null,
      banReason: null,
      banned: null,
      banExpires: null,
      stripeCustomerId: null
    }
    user.value = data?.user
      ? Object.assign({}, userDefaults, data.user)
      : null
    subscriptions.value = []
    if (user.value) {
      if (payment == 'stripe') {
        const { data: subscriptionData } = await client.subscription.list()
        subscriptions.value = subscriptionData || []
      } else if (payment == 'polar') {
        const { data: customerState } = await client.customer.state()
        polarState.value = customerState
      }
    }
    sessionFetching.value = false
    return data
  }

  if (import.meta.client) {
    client.$store.listen('$sessionSignal', async (signal) => {
      if (!signal)
        return
      await fetchSession()
    })
  }

  return {
    session,
    user,
    subscription: client.subscription,
    subscriptions,
    loggedIn: computed(() => !!session.value),
    activeStripeSubscription: computed(() => {
      return subscriptions.value.find(
        sub => sub.status === 'active' || sub.status === 'trialing'
      )
    }),
    activePolarSubscriptions: computed(() => {
      return polarState.value?.activeSubscriptions
    }),
    signIn: client.signIn,
    signUp: client.signUp,
    forgetPassword: client.forgetPassword,
    resetPassword: client.resetPassword,
    sendVerificationEmail: client.sendVerificationEmail,
    errorCodes: client.$ERROR_CODES,
    async signOut({ redirectTo }: { redirectTo?: RouteLocationRaw } = {}) {
      await client.signOut({
        fetchOptions: {
          onSuccess: async () => {
            session.value = null
            user.value = null
            if (redirectTo) {
              await reloadNuxtApp({
                path: redirectTo.toString()
              })
            }
          }
        }
      })
    },
    fetchSession,
    payment,
    client
  }
}

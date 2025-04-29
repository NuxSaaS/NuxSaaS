import { defu } from 'defu'

type MiddlewareOptions = false | {
  /**
   * Redirect guest to this route
   */
  unauthenticatedRedirect?: string
} |
{
  unauthenticatedOnly: boolean
  navigateAuthenticatedTo?: string
}

declare module '#app' {
  interface PageMeta {
    auth?: MiddlewareOptions
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    auth?: MiddlewareOptions
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  // If auth is disabled, skip middleware
  if (to.meta?.auth === false) {
    return
  }
  const { loggedIn, user, options, fetchSession } = useAuth()
  const { unauthenticatedRedirect } = defu(to.meta?.auth, options)

  await fetchSession()

  if (loggedIn.value) {
    if (to.meta.auth && 'unauthenticatedOnly' in to.meta.auth) {
      // If authenticated and unauthenticatedOnly is true, redirect to navigateAuthenticatedTo
      return navigateTo(to.meta.auth.navigateAuthenticatedTo || '/')
    }
  } else {
    // If not authenticated, redirect to home
    // Avoid infinite redirect
    if (to.path === unauthenticatedRedirect) {
      return
    }
    return navigateTo(`${unauthenticatedRedirect}?redirect=${to.fullPath}`)
  }

  const routeParts = (to.name as string).split('___')
  const routeName = routeParts[0]
  const localePath = useLocalePath()
  if (routeName?.startsWith('admin') && user.value?.role != 'admin') {
    return navigateTo(localePath('/403'))
  }
  if (routeName == 'admin') {
    return navigateTo(localePath('/admin/dashboard'))
  }
})

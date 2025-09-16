import type { LocalePathFunction } from '#i18n'

export const getMenus = (t: TranFunction, localePath: LocalePathFunction, appRepo: string): NavigationMenuItem[][] => {
  return [
    [
      {
        label: t('menu.dashboard'),
        icon: 'i-lucide-layout-dashboard',
        to: localePath('/admin/dashboard')
      },
      {
        label: t('menu.users'),
        icon: 'i-lucide-users',
        to: localePath('/admin/user')
      },
      {
        label: t('menu.subscriptions'),
        icon: 'i-lucide-credit-card',
        to: localePath('/admin/subscription')
      },
      {
        label: t('menu.files'),
        icon: 'i-lucide-folder',
        to: localePath('/admin/file')
      },
      {
        label: t('menu.maintenance'),
        icon: 'i-lucide-wrench',
        children: [
          {
            label: t('menu.auditLog'),
            icon: 'i-lucide-history',
            to: localePath('/admin/maintenance/audit-log')
          },
          {
            label: t('menu.dbStats'),
            icon: 'i-lucide-database',
            to: localePath('/admin/maintenance/db-stats')
          },
          {
            label: t('menu.migration'),
            icon: 'i-lucide-database-zap',
            to: localePath('/admin/maintenance/migration')
          }
        ]
      }
    ],
    [
      {
        label: t('menu.home'),
        icon: 'i-lucide-home',
        to: localePath('/')
      },
      {
        label: 'GitHub',
        icon: 'i-lucide-github',
        to: appRepo,
        target: '_blank'
      }
    ]
  ]
}

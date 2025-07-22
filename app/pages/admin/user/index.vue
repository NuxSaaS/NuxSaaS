<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
import BanUserModal from './components/BanUserModal.vue'
import CreateUserModal from './components/CreateUserModal.vue'

const { t } = useI18n()
const { client } = useAuth()
const isUserModalOpen = ref(false)
const isBanModalOpen = ref(false)
const selectedUserId = ref('')

const filters: AdminTableFilter[] = reactive([
  {
    name: t('global.page.name'),
    field: 'name',
    type: 'input',
    value: undefined
  },
  {
    name: t('user.columns.role'),
    field: 'role',
    type: 'checkbox',
    items: [
      { label: t('user.roles.user'), id: 'user', count: 0 },
      { label: t('user.roles.admin'), id: 'admin', count: 0 }
    ],
    value: []
  },
  {
    name: t('global.page.createdAt'),
    field: 'createdAt',
    type: 'daterange',
    value: { start: undefined, end: undefined }
  }
])

const { refresh } = useAdminTable()

const getActionItems = (row: Row<User>) => {
  const user = row.original
  return [
    {
      type: 'label',
      label: t('global.page.actions')
    },
    {
      type: 'separator'
    },
    {
      label: user.banned ? t('user.actions.unban') : t('user.actions.ban'),
      icon: 'i-lucide-ban',
      color: user.banned ? 'success' : 'error',
      async onSelect() {
        if (user.banned) {
          const result = await client.admin.unbanUser({
            userId: user.id
          })
          if (result.data?.user) {
            refresh()
          }
        } else {
          selectedUserId.value = user.id
          isBanModalOpen.value = true
        }
      }
    },
    {
      label: t('global.page.delete'),
      icon: 'i-lucide-trash',
      color: 'error',
      async onSelect() {
        const removeResult = await client.admin.removeUser({
          userId: user.id
        })
        if (removeResult.data?.success) {
          refresh()
        } else {
          console.error(removeResult.error)
        }
      }
    }
  ]
}

const getRoleDropdownItems = (original: User) => {
  const roles = ['user', 'admin'] as const
  return roles.map((role) => {
    return {
      label: t(`user.roles.${role}`),
      type: 'checkbox' as const,
      checked: original.role === role,
      onUpdateChecked: async () => {
        const result = await client.admin.setRole({
          userId: original.id,
          role
        })
        if (result.data?.user) {
          refresh()
        } else {
          console.error(result.error)
        }
      }
    }
  })
}

const columns: AdminTableColumn<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'image',
    header: t('user.columns.avatar'),
    cell: avatarColumn
  },
  {
    accessorKey: 'name',
    header: t('global.page.name')
  },
  {
    accessorKey: 'email',
    header: t('user.columns.email')
  },
  {
    accessorKey: 'role',
    header: t('user.columns.role')
  },
  {
    accessorKey: 'status',
    header: t('global.page.status')
  },
  {
    accessorKey: 'createdAt',
    header: t('global.page.createdAt'),
    cell: dateColumn
  },
  {
    id: 'actions',
    cell: ({ row }) => actionColumn(row, getActionItems)
  }
]

const fetchRoleCount = async (filter: FilterCondition[]) => {
  const statusCount = await $fetch<ColumnCount[]>('/api/admin/count/user/role', {
    query: {
      filter: JSON.stringify(filter)
    }
  })
  const roleFilter = filters[1] as FilterCheckbox
  roleFilter.items.forEach((item) => {
    const status = statusCount.find(status => status.column === item.id)
    item.count = status ? status.count : 0
  })
}

const fetchData: FetchDataFn<User> = async ({ page, limit, sort, filter }) => {
  fetchRoleCount(filter)
  const result = await $fetch<PageData<User>>('/api/admin/list/user', {
    query: {
      page,
      limit,
      sort: JSON.stringify(sort.map((item) => {
        return [item.field, item.order]
      })),
      filter: JSON.stringify(filter)
    }
  })
  return {
    data: result.data,
    total: result.total
  }
}
</script>

<template>
  <NuxtLayout name="admin">
    <template #navRight>
      <UButton
        color="neutral"
        icon="i-lucide-plus"
        variant="outline"
        @click="isUserModalOpen = true"
      >
        {{ t('user.actions.createUser') }}
      </UButton>
    </template>
    <AdminTable
      ref="table"
      :columns="columns"
      :filters="filters"
      :fetch-data="fetchData"
    >
      <template #role-cell="{ row: { original } }">
        <UDropdownMenu
          :items="getRoleDropdownItems(original)"
          arrow
        >
          <UButton
            :color="original.role === 'admin' ? 'primary' : 'neutral'"
            variant="outline"
            size="xs"
            icon="i-lucide-chevron-down"
            trailing
          >
            {{ t(`user.roles.${original.role}`) }}
          </UButton>
        </UDropdownMenu>
      </template>
      <template #status-cell="{ row: { original } }">
        <UBadge
          :color="original.banned
            ? 'error'
            : (original.emailVerified ? 'success' : 'warning')"
          :label="original.banned
            ? t('user.status.banned')
            : (original.emailVerified
              ? t('user.status.verified')
              : t('user.status.unverified'))"
        />
      </template>
    </AdminTable>
    <CreateUserModal
      v-model:open="isUserModalOpen"
      :t="t"
      @created="refresh"
    />
    <BanUserModal
      v-model:open="isBanModalOpen"
      :user-id="selectedUserId"
      :t="t"
      @banned="refresh"
    />
  </NuxtLayout>
</template>

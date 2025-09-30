<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
import { UBadge, UIcon } from '#components'
import FileUploadModal from './components/FileUploadModal.vue'

definePageMeta({
  layout: false
})

type FileWithUser = FileRecord & {
  uploadedByUser?: Partial<User> | null
}

const { t } = useI18n()
const toast = useToast()
const { refresh } = useAdminTable()

const isUploadModalOpen = ref(false)

const filters: AdminTableFilter[] = reactive([
  {
    name: t('fileManager.filename'),
    field: 'fileName',
    type: 'input',
    value: undefined
  },
  {
    name: t('fileManager.type'),
    field: 'fileType',
    type: 'checkbox',
    items: [
      { label: t('fileManager.images'), id: 'image', count: 0 },
      { label: t('fileManager.videos'), id: 'video', count: 0 },
      { label: t('fileManager.audios'), id: 'audio', count: 0 },
      { label: t('fileManager.applications'), id: 'application', count: 0 },
      { label: t('fileManager.texts'), id: 'text', count: 0 },
      { label: t('fileManager.others'), id: 'other', count: 0 }
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

const downloadFile = (file: FileWithUser) => {
  if (file.url) {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.originalName
    link.click()
  }
}

const getActionItems = (row: Row<FileWithUser>) => {
  const file = row.original
  return [
    {
      type: 'label',
      label: t('global.page.actions')
    },
    {
      type: 'separator'
    },
    {
      label: t('fileManager.download'),
      icon: 'i-lucide-download',
      async onSelect() {
        downloadFile(file)
      }
    },
    {
      label: t('global.page.delete'),
      icon: 'i-lucide-trash',
      color: 'error',
      async onSelect() {
        try {
          await $fetch(`/api/file/${file.id}`, { method: 'DELETE' })
          toast.add({
            title: t('fileManager.deleteSuccess'),
            color: 'success'
          })
          refresh()
        } catch (error) {
          console.error('Failed to delete file:', error)
          toast.add({
            title: t('fileManager.deleteError'),
            color: 'error'
          })
        }
      }
    }
  ]
}

const columns: AdminTableColumn<FileWithUser>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: IDColumn
  },
  {
    accessorKey: 'preview',
    header: t('fileManager.preview'),
    cell: ({ row }) => {
      const file = row.original
      if (file.mimeType.startsWith('image/')) {
        return h('img', {
          src: file.url,
          alt: file.originalName,
          class: 'w-8 h-8 object-cover rounded'
        })
      }
      const getFileTypeIcon = (mimeType: string): string => {
        const type = mimeType.split('/')[0]
        switch (type) {
          case 'image': return 'i-lucide-image'
          case 'video': return 'i-lucide-video'
          case 'audio': return 'i-lucide-music'
          case 'application': return 'i-lucide-file'
          case 'text': return 'i-lucide-file-text'
          default: return 'i-lucide-file'
        }
      }
      return h(UIcon, {
        name: getFileTypeIcon(file.mimeType),
        class: 'w-6 h-6 text-neutral-500'
      })
    }
  },
  {
    accessorKey: 'originalName',
    header: t('fileManager.filename'),
    cell: ({ row }) => {
      const file = row.original
      return h('div', { class: 'flex flex-col' }, [
        h('span', { class: 'font-medium truncate max-w-xs' }, file.originalName),
        h('span', { class: 'text-xs text-neutral-500' }, file.fileName)
      ])
    }
  },
  {
    accessorKey: 'size',
    header: t('fileManager.size'),
    cell: ({ row }) => formatFileSize(row.original.size)
  },
  {
    accessorKey: 'mimeType',
    header: t('fileManager.type'),
    cell: ({ row }) => h(UBadge, { variant: 'outline' }, () => row.original.mimeType)
  },
  {
    accessorKey: 'uploadedBy',
    header: t('fileManager.uploadedBy'),
    cell: ({ row }) => row.original.uploadedByUser?.name || 'Unknown'
  },
  {
    accessorKey: 'createdAt',
    header: t('fileManager.uploadedAt'),
    cell: dateColumn
  },
  {
    id: 'actions',
    cell: ({ row }) => actionColumn(row, getActionItems)
  }
]

const fetchMimeTypeCount = async (filter: FilterCondition[]) => {
  const statusCount = await $fetch<ColumnCount[]>('/api/admin/count/file/mimeType', {
    query: {
      filter: JSON.stringify(filter)
    }
  })
  const statusFilter = filters[1] as FilterCheckbox
  statusFilter.items.forEach((item) => {
    const status = statusCount.find(status => status.column.startsWith(item.id))
    item.count = status ? status.count : 0
  })
}

const fetchData: FetchDataFn<FileWithUser> = async ({ page, limit, sort, filter }) => {
  fetchMimeTypeCount(filter)
  const result = await $fetch('/api/admin/list/file', {
    query: {
      page,
      limit,
      sort: JSON.stringify(sort.map((item) => {
        return [item.field, item.order]
      })),
      filter: JSON.stringify(filter),
      with: {
        uploadedByUser: {
          columns: {
            id: true,
            name: true
          }
        }
      }
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
        color="primary"
        icon="i-lucide-upload"
        @click="isUploadModalOpen = true"
      >
        {{ t('fileManager.upload') }}
      </UButton>
    </template>
    <AdminTable
      ref="table"
      :filters="filters"
      :columns="columns"
      :fetch-data="fetchData"
      can-select
      row-id="id"
    />
    <FileUploadModal
      v-model:open="isUploadModalOpen"
      :t="t"
      @uploaded="refresh"
    />
  </NuxtLayout>
</template>

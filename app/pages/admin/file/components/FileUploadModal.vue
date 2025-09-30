<script setup lang="ts">
const { t } = defineProps<{
  t: TranFunction
}>()

const emit = defineEmits<{
  uploaded: []
  cancel: []
}>()

const open = defineModel('open', { default: false })
const toast = useToast()

const selectedFiles = ref<File[]>([])
const uploadedFiles = ref<any[]>([])

const { uploading, progress, uploadToServer } = useFileManager({
  maxSize: 10 * 1024 * 1024, // 10MB
  onSuccess: (file) => {
    uploadedFiles.value.push(file)
    toast.add({
      title: t('fileManager.uploadSuccess'),
      color: 'success'
    })
  },
  onError: (error) => {
    toast.add({
      title: error.message,
      color: 'error'
    })
  }
})

const handleFileSelect = (files: File[]) => {
  selectedFiles.value = files
}

const onSubmit = async () => {
  if (selectedFiles.value.length === 0) {
    return
  }

  for (const file of selectedFiles.value) {
    try {
      await uploadToServer(file)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  if (uploadedFiles.value.length > 0) {
    open.value = false
    emit('uploaded')
    // Reset state
    selectedFiles.value = []
    uploadedFiles.value = []
  }
}

const onCancel = () => {
  open.value = false
  emit('cancel')
  // Reset state
  selectedFiles.value = []
  uploadedFiles.value = []
}

const removeSelectedFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const removeUploadedFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}
</script>

<template>
  <UModal
    v-model:open="open"
    :close="true"
    :title="t('fileManager.upload')"
  >
    <template #body>
      <div class="space-y-4">
        <UFileUpload
          :model-value="selectedFiles"
          :multiple="true"
          :disabled="uploading"
          :loading="uploading"
          icon="i-lucide-upload"
          @update:model-value="(files) => handleFileSelect(files as File[])"
        >
          <template #files-bottom="{ files }">
            <div
              v-if="files && files.length > 0"
              class="mt-4"
            >
              <p class="text-sm font-medium mb-2">
                {{ t('fileManager.selectedFiles') }}:
              </p>
              <div class="space-y-2">
                <div
                  v-for="(file, index) in files"
                  :key="index"
                  class="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-800 rounded"
                >
                  <div class="flex items-center space-x-2">
                    <UIcon
                      name="i-lucide-file"
                      class="w-4 h-4"
                    />
                    <span class="text-sm truncate">{{ file.name }}</span>
                    <span class="text-xs text-neutral-500">({{ formatFileSize(file.size) }})</span>
                  </div>
                  <UButton
                    size="xs"
                    color="error"
                    variant="ghost"
                    icon="i-lucide-x"
                    @click="removeSelectedFile(index)"
                  />
                </div>
              </div>
            </div>
          </template>
        </UFileUpload>

        <UProgress
          v-if="uploading"
          :value="progress"
          color="primary"
          class="mt-4"
        />

        <div
          v-if="uploadedFiles.length > 0"
          class="mt-4"
        >
          <p class="text-sm font-medium mb-2">
            {{ t('fileManager.uploadedFiles') }}:
          </p>
          <div class="space-y-2">
            <div
              v-for="(file, index) in uploadedFiles"
              :key="file.id"
              class="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded"
            >
              <div class="flex items-center space-x-2">
                <UIcon
                  name="i-lucide-check-circle"
                  class="w-4 h-4 text-green-500"
                />
                <span class="text-sm truncate">{{ file.originalName }}</span>
                <span class="text-xs text-neutral-500">({{ formatFileSize(file.size) }})</span>
              </div>
              <UButton
                size="xs"
                color="error"
                variant="ghost"
                icon="i-lucide-x"
                @click="removeUploadedFile(index)"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <UButton
            color="neutral"
            variant="outline"
            @click="onCancel"
          >
            {{ t('global.page.cancel') }}
          </UButton>
          <UButton
            type="button"
            color="primary"
            :disabled="selectedFiles.length === 0 || uploading"
            @click="onSubmit"
          >
            {{ uploading ? t('fileManager.uploading') : t('global.page.save') }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

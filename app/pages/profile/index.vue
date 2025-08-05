<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
const { user, session, client } = useAuth()
const toast = useToast()
const { t } = useI18n()
const localePath = useLocalePath()
const { data: accounts } = await useAsyncData('/accounts', () => client.listAccounts())

function hasProvider(provider: string) {
  return accounts.value?.data?.some(account => account.provider === provider)
}

const error = useRoute().query?.error
onMounted(() => {
  if (error) {
    toast.add({
      color: 'error',
      title: `${error}`
    })
  }
})
</script>

<template>
  <UContainer>
    <div class="space-y-6 pt-6">
      <!-- User Profile Section -->
      <div class="bg-white dark:bg-neutral-800 rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-4">
            <UAvatar
              v-if="user?.image"
              :src="user.image"
              :alt="user?.name || ''"
              size="lg"
            />
            <div>
              <h1 class="text-2xl font-bold">
                {{ user?.name || t('profile.anonymousUser') }}
              </h1>
              <p class="text-neutral-500 dark:text-neutral-400">
                {{ user?.email }}
              </p>
            </div>
          </div>
          <UButton
            :to="localePath('/')"
            variant="outline"
            color="neutral"
            icon="i-lucide-arrow-left"
          >
            {{ t('profile.back') }}
          </UButton>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <p class="flex justify-between">
              <span class="text-neutral-500 dark:text-neutral-400">{{ t('profile.role') }}:</span>
              <UBadge :color="user?.role === 'admin' ? 'primary' : 'neutral'">
                {{ user?.role }}
              </UBadge>
            </p>
            <p class="flex justify-between">
              <span class="text-neutral-500 dark:text-neutral-400">{{ t('profile.emailVerified') }}:</span>
              <UBadge :color="user?.emailVerified ? 'success' : 'warning'">
                {{ user?.emailVerified ? t('profile.verified') : t('profile.notVerified') }}
              </UBadge>
            </p>
          </div>
          <div class="space-y-2">
            <p class="flex justify-between">
              <span class="text-neutral-500 dark:text-neutral-400">{{ t('profile.created') }}:</span>
              <span>{{ formatDate(user?.createdAt) }}</span>
            </p>
            <p class="flex justify-between">
              <span class="text-neutral-500 dark:text-neutral-400">{{ t('profile.lastUpdated') }}:</span>
              <span>{{ formatDate(user?.updatedAt) }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Session Information -->
      <div class="bg-white dark:bg-neutral-800 rounded-lg p-6">
        <h2 class="text-xl font-bold mb-4">
          {{ t('profile.sessionInfo') }}
        </h2>
        <div class="space-y-2">
          <p class="flex justify-between">
            <span class="text-neutral-500 dark:text-neutral-400">{{ t('profile.ipAddress') }}:</span>
            <span>{{ session?.ipAddress }}</span>
          </p>
          <p class="flex justify-between">
            <span class="text-neutral-500 dark:text-neutral-400">{{ t('profile.expires') }}:</span>
            <span>{{ formatDate(session?.expiresAt) }}</span>
          </p>
          <p class="text-neutral-500 dark:text-neutral-400">
            {{ t('profile.userAgent') }}:
          </p>
          <p class="text-sm break-all">
            {{ session?.userAgent }}
          </p>
        </div>
      </div>

      <!-- Connected Accounts -->
      <div class="bg-white dark:bg-neutral-800 rounded-lg p-6">
        <h2 class="text-xl font-bold mb-4">
          {{ t('profile.connectedAccounts') }}
        </h2>
        <div class="flex gap-2">
          <UButton
            v-if="hasProvider('github')"
            color="neutral"
            icon="i-simple-icons-github"
            trailing-icon="i-heroicons-check"
          >
            {{ t('profile.linkedGithub') }}
          </UButton>
          <UButton
            v-else
            color="neutral"
            icon="i-simple-icons-github"
            @click="client.linkSocial({ provider: 'github' })"
          >
            {{ t('profile.linkGithub') }}
          </UButton>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
interface MigrationOperation {
  id: string
  title: string
  description: string
  icon: string
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  endpoint: string
}

const { t } = useI18n()
const currentOperation = ref<string | null>(null)
const isLoading = ref(false)
const result = ref<any>(null)
const error = ref<string | null>(null)

const operations: MigrationOperation[] = [
  {
    id: 'payment-customers',
    title: t('migration.paymentCustomers.title'),
    description: t('migration.paymentCustomers.description'),
    icon: 'lucide:credit-card',
    color: 'primary',
    endpoint: '/api/admin/maintenance/ensure-payment-customers'
  }
  // Future operations can be added here
  // {
  //   id: 'user-profiles',
  //   title: 'User Profile Migration',
  //   description: 'Migrate user profile data to new schema',
  //   icon: 'lucide:user',
  //   color: 'secondary',
  //   endpoint: '/api/admin/maintenance/migrate-user-profiles'
  // }
]

const selectOperation = (operationId: string) => {
  currentOperation.value = operationId
  result.value = null
  error.value = null
}

const backToOperations = () => {
  currentOperation.value = null
  result.value = null
  error.value = null
  isLoading.value = false
}

const executeOperation = async () => {
  const operation = operations.find(op => op.id === currentOperation.value)
  if (!operation)
    return

  isLoading.value = true
  error.value = null
  result.value = null

  try {
    const response = await $fetch(operation.endpoint)
    result.value = response
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    isLoading.value = false
  }
}

const getStatusColor = (status: string): 'success' | 'error' => {
  return status === 'success' ? 'success' : 'error'
}

const getCurrentOperation = () => {
  return operations.find(op => op.id === currentOperation.value)
}
</script>

<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <!-- Main Header -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <Icon name="lucide:database" />
            <span>{{ t('migration.title') }}</span>
          </div>
        </template>

        <p class="text-neutral-600 dark:text-neutral-400">
          {{ t('migration.description') }}
        </p>
      </UCard>

      <!-- Operations List View -->
      <div v-if="!currentOperation">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <Icon name="lucide:list" />
              <span>{{ t('migration.operations') }}</span>
            </div>
          </template>

          <div class="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            <UCard
              v-for="operation in operations"
              :key="operation.id"
              class="cursor-pointer hover:shadow-md transition-shadow"
              @click="selectOperation(operation.id)"
            >
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0">
                  <div :class="`p-3 rounded-lg bg-${operation.color}-100 dark:bg-${operation.color}-900/20`">
                    <Icon
                      :name="operation.icon"
                      :class="`w-6 h-6 text-${operation.color}-600 dark:text-${operation.color}-400`"
                    />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {{ operation.title }}
                  </h3>
                  <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    {{ operation.description }}
                  </p>
                  <div class="mt-3">
                    <UButton
                      :color="operation.color"
                      size="sm"
                    >
                      {{ t('migration.common.execute') }}
                      <Icon name="lucide:arrow-right" />
                    </UButton>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </UCard>
      </div>

      <!-- Operation Execution View -->
      <div v-else>
        <!-- Operation Header -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon :name="getCurrentOperation()?.icon || 'lucide:settings'" />
                <span>{{ getCurrentOperation()?.title }}</span>
              </div>
              <UButton
                variant="ghost"
                size="sm"
                @click="backToOperations"
              >
                <Icon name="lucide:arrow-left" />
                {{ t('migration.common.backToOperations') }}
              </UButton>
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-neutral-600 dark:text-neutral-400">
              {{ getCurrentOperation()?.description }}
            </p>

            <UButton
              :loading="isLoading"
              :disabled="isLoading"
              :color="getCurrentOperation()?.color || 'primary'"
              @click="executeOperation"
            >
              <Icon name="lucide:play" />
              {{ isLoading ? t('migration.common.executing') : t('migration.common.execute') }}
            </UButton>
          </div>
        </UCard>

        <!-- Error Display -->
        <UCard
          v-if="error"
          class="border-red-200 dark:border-red-800"
        >
          <template #header>
            <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Icon name="lucide:alert-circle" />
              <span>{{ t('global.page.error') }}</span>
            </div>
          </template>

          <p class="text-red-600 dark:text-red-400">
            {{ error }}
          </p>
        </UCard>

        <!-- Payment Customers Results -->
        <div
          v-if="result && currentOperation === 'payment-customers'"
          class="space-y-6"
        >
          <!-- Summary Card -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <Icon name="lucide:bar-chart" />
                <span>{{ t('migration.paymentCustomers.summary') }}</span>
              </div>
            </template>

            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div class="text-center">
                <div class="text-2xl font-bold">
                  {{ result.summary.totalUsers }}
                </div>
                <div class="text-sm text-neutral-500 dark:text-neutral-400">
                  {{ t('migration.paymentCustomers.totalUsers') }}
                </div>
              </div>

              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">
                  {{ result.summary.stripeSuccessCount }}
                </div>
                <div class="text-sm text-neutral-500 dark:text-neutral-400">
                  {{ t('migration.paymentCustomers.stripeSuccess') }}
                </div>
              </div>

              <div class="text-center">
                <div class="text-2xl font-bold text-red-600">
                  {{ result.summary.stripeErrorCount }}
                </div>
                <div class="text-sm text-neutral-500 dark:text-neutral-400">
                  {{ t('migration.paymentCustomers.stripeError') }}
                </div>
              </div>

              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">
                  {{ result.summary.polarSuccessCount }}
                </div>
                <div class="text-sm text-neutral-500 dark:text-neutral-400">
                  {{ t('migration.paymentCustomers.polarSuccess') }}
                </div>
              </div>

              <div class="text-center">
                <div class="text-2xl font-bold text-red-600">
                  {{ result.summary.polarErrorCount }}
                </div>
                <div class="text-sm text-neutral-500 dark:text-neutral-400">
                  {{ t('migration.paymentCustomers.polarError') }}
                </div>
              </div>
            </div>
          </UCard>

          <!-- Detailed Results -->
          <div class="grid gap-6 lg:grid-cols-2">
            <!-- Stripe Results -->
            <UCard v-if="result.data.stripeResults.length > 0">
              <template #header>
                <div class="flex items-center gap-2">
                  <Icon name="simple-icons:stripe" />
                  <span>{{ t('migration.paymentCustomers.stripeResults') }}</span>
                </div>
              </template>

              <div class="space-y-2 max-h-96 overflow-y-auto">
                <div
                  v-for="item in result.data.stripeResults"
                  :key="item.userId"
                  class="flex items-center justify-between p-2 rounded border"
                >
                  <span class="text-sm font-mono">{{ item.userId }}</span>
                  <div class="flex items-center gap-2">
                    <UBadge
                      :color="getStatusColor(item.status)"
                      :label="t(`migration.paymentCustomers.status.${item.status}`)"
                    />
                    <span
                      v-if="item.message"
                      class="text-xs text-neutral-500 dark:text-neutral-400 max-w-32 truncate"
                      :title="item.message"
                    >
                      {{ item.message }}
                    </span>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Polar Results -->
            <UCard v-if="result.data.polarResults.length > 0">
              <template #header>
                <div class="flex items-center gap-2">
                  <Icon name="lucide:zap" />
                  <span>{{ t('migration.paymentCustomers.polarResults') }}</span>
                </div>
              </template>

              <div class="space-y-2 max-h-96 overflow-y-auto">
                <div
                  v-for="item in result.data.polarResults"
                  :key="item.userId"
                  class="flex items-center justify-between p-2 rounded border"
                >
                  <span class="text-sm font-mono">{{ item.userId }}</span>
                  <div class="flex items-center gap-2">
                    <UBadge
                      :color="getStatusColor(item.status)"
                      :label="t(`migration.paymentCustomers.status.${item.status}`)"
                    />
                    <span
                      v-if="item.message"
                      class="text-xs text-neutral-500 dark:text-neutral-400 max-w-32 truncate"
                      :title="item.message"
                    >
                      {{ item.message }}
                    </span>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

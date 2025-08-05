<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
definePageMeta({
  auth: {
    only: 'guest'
  }
})

const { t } = useI18n()
useHead({
  title: t('resetPassword.title')
})

const auth = useAuth()
const toast = useToast()
const route = useRoute()
const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()

const state = reactive({
  password: undefined as string | undefined,
  confirmPassword: undefined as string | undefined
})

const schema = z.object({
  password: z.string().min(8, t('resetPassword.errors.minLength', { min: 8 })),
  confirmPassword: z.string().min(8, t('resetPassword.errors.minLength', { min: 8 })).refine(val => val === state.password, {
    message: t('resetPassword.errors.passwordMismatch')
  })
})

type Schema = zodOutput<typeof schema>

const loading = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (loading.value)
    return

  loading.value = true
  const { error } = await auth.resetPassword({
    newPassword: event.data.password,
    token: route.query.token as string
  })

  if (error) {
    toast.add({
      title: error.message,
      color: 'error'
    })
  } else {
    toast.add({
      title: t('resetPassword.success'),
      color: 'success'
    })
    navigateTo(localePath(runtimeConfig.public.auth.redirectGuestTo))
  }
  loading.value = false
}
</script>

<template>
  <UContainer class="flex items-center justify-center sm:p-4 sm:min-w-160">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center p-4">
          <h1 class="text-xl font-semibold">
            {{ t('resetPassword.title') }}
          </h1>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            {{ t('resetPassword.description') }}
          </p>
        </div>
      </template>

      <div class="space-y-4">
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            :label="t('resetPassword.password')"
            name="password"
            required
          >
            <UInput
              v-model="state.password"
              type="password"
              class="w-full"
              :placeholder="t('resetPassword.passwordPlaceholder')"
            />
          </UFormField>

          <UFormField
            :label="t('resetPassword.confirmPassword')"
            name="confirmPassword"
            required
          >
            <UInput
              v-model="state.confirmPassword"
              type="password"
              class="w-full"
              :placeholder="t('resetPassword.confirmPasswordPlaceholder')"
            />
          </UFormField>

          <UButton
            type="submit"
            color="primary"
            block
            :loading="loading"
          >
            {{ t('resetPassword.submit') }}
          </UButton>
        </UForm>

        <div class="text-center text-sm">
          <UButton
            variant="link"
            color="primary"
            :to="localePath('/signin')"
          >
            {{ t('resetPassword.backToSignIn') }}
          </UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

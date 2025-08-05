<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
definePageMeta({
  auth: {
    only: 'guest'
  }
})

const { t } = useI18n()
useHead({
  title: t('forgotPassword.title')
})

const auth = useAuth()
const toast = useToast()
const localePath = useLocalePath()

const schema = z.object({
  email: z.email(t('forgotPassword.errors.invalidEmail'))
})

type Schema = zodOutput<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined
})

const loading = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (loading.value)
    return

  loading.value = true
  const { error } = await auth.forgetPassword({
    email: event.data.email,
    redirectTo: localePath('/reset-password')
  })

  if (error) {
    toast.add({
      title: error.message || error.statusText,
      color: 'error'
    })
  }
  else {
    toast.add({
      title: t('forgotPassword.success'),
      color: 'success'
    })
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
            {{ t('forgotPassword.title') }}
          </h1>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            {{ t('forgotPassword.description') }}
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
            :label="t('forgotPassword.email')"
            name="email"
            required
          >
            <UInput
              v-model="state.email"
              type="email"
              class="w-full"
              :placeholder="t('forgotPassword.emailPlaceholder')"
            />
          </UFormField>

          <UButton
            type="submit"
            color="primary"
            block
            :loading="loading"
          >
            {{ t('forgotPassword.submit') }}
          </UButton>
        </UForm>

        <div class="text-center text-sm">
          <UButton
            variant="link"
            color="primary"
            :to="localePath('/signin')"
          >
            {{ t('forgotPassword.backToSignIn') }}
          </UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

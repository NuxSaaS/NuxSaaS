<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
const { t } = useI18n()

const areaChartLoading = ref(true)
const barChartLoading = ref(true)

const stats = ref([
  {
    name: 'activeUsers',
    value: '2,834',
    change: '+12.5%',
    isIncrease: true,
    icon: 'users'
  },
  {
    name: 'totalRevenue',
    value: '$45,289',
    change: '+8.2%',
    isIncrease: true,
    icon: 'dollar-sign'
  },
  {
    name: 'activeProjects',
    value: '156',
    change: '-3.1%',
    isIncrease: false,
    icon: 'folder'
  },
  {
    name: 'customerSatisfaction',
    value: '94.8%',
    change: '+2.3%',
    isIncrease: true,
    icon: 'smile'
  }
])

const RevenueData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 }
]

const AreaChartData = [
  { date: '2024-04-01', desktop: 222, mobile: 150 },
  { date: '2024-04-02', desktop: 180, mobile: 97 },
  { date: '2024-04-03', desktop: 167, mobile: 120 },
  { date: '2024-04-04', desktop: 260, mobile: 240 },
  { date: '2024-04-05', desktop: 240, mobile: 290 }
]

// Area Chart ECharts Option
const areaChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    data: ['Desktop', 'Mobile'],
    top: 10
  },
  grid: {
    left: '3%',
    right: '8%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: AreaChartData.map(item => item.date),
    axisLine: {
      lineStyle: {
        color: '#e5e7eb'
      }
    },
    axisLabel: {
      color: '#6b7280'
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#f3f4f6'
      }
    },
    axisLabel: {
      color: '#6b7280'
    }
  },
  series: [
    {
      name: 'Desktop',
      type: 'line',
      smooth: true,
      stack: 'Total',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(2, 151, 82, 0.8)'
            },
            {
              offset: 1,
              color: 'rgba(2, 151, 82, 0.1)'
            }
          ]
        }
      },
      lineStyle: {
        color: '#029752'
      },
      itemStyle: {
        color: '#029752'
      },
      data: AreaChartData.map(item => item.desktop)
    },
    {
      name: 'Mobile',
      type: 'line',
      smooth: true,
      stack: 'Total',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(74, 222, 128, 0.8)'
            },
            {
              offset: 1,
              color: 'rgba(74, 222, 128, 0.1)'
            }
          ]
        }
      },
      lineStyle: {
        color: '#4ade80'
      },
      itemStyle: {
        color: '#4ade80'
      },
      data: AreaChartData.map(item => item.mobile)
    }
  ]
}))

// Bar Chart ECharts Option
const barChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['Desktop', 'Mobile'],
    top: 10
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  yAxis: {
    type: 'category',
    data: RevenueData.map(item => item.month),
    axisLine: {
      lineStyle: {
        color: '#e5e7eb'
      }
    },
    axisLabel: {
      color: '#6b7280'
    }
  },
  xAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#f3f4f6'
      }
    },
    axisLabel: {
      color: '#6b7280'
    }
  },
  series: [
    {
      name: 'Desktop',
      type: 'bar',
      stack: 'total',
      itemStyle: {
        color: '#029752',
        borderRadius: [0, 4, 4, 0]
      },
      data: RevenueData.map(item => item.desktop)
    },
    {
      name: 'Mobile',
      type: 'bar',
      stack: 'total',
      itemStyle: {
        color: '#4ade80',
        borderRadius: [0, 4, 4, 0]
      },
      data: RevenueData.map(item => item.mobile)
    }
  ]
}))

function onAreaChartRendered() {
  areaChartLoading.value = false
}

function onBarChartRendered() {
  barChartLoading.value = false
}
</script>

<template>
  <NuxtLayout name="admin">
    <div class="space-y-8">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UCard
          v-for="stat in stats"
          :key="stat.name"
          class="relative overflow-hidden"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">
                {{ t(`dashboard.stats.${stat.name}`) }}
              </div>
              <div class="mt-1 text-2xl font-semibold">
                {{ stat.value }}
              </div>
              <div
                class="mt-2 flex items-center text-sm"
                :class="stat.isIncrease ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
              >
                <Icon
                  :name="stat.isIncrease ? 'lucide:trending-up' : 'lucide:trending-down'"
                  class="mr-1 h-4 w-4"
                />
                {{ stat.change }}
              </div>
            </div>
            <Icon
              :name="`lucide:${stat.icon}`"
              class="h-8 w-8 text-neutral-400 dark:text-neutral-600"
            />
          </div>
        </UCard>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UCard class="relative">
          <div
            v-if="areaChartLoading"
            class="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-neutral-900/80"
          >
            <div class="flex items-center space-x-2">
              <Icon
                name="lucide:loader-2"
                class="h-5 w-5 animate-spin text-primary"
              />
            </div>
          </div>
          <VChart
            :option="areaChartOption"
            :autoresize="true"
            style="height: 310px; width: 100%"
            @rendered="onAreaChartRendered"
          />
        </UCard>
        <UCard class="relative">
          <div
            v-if="barChartLoading"
            class="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-neutral-900/80"
          >
            <div class="flex items-center space-x-2">
              <Icon
                name="lucide:loader-2"
                class="h-5 w-5 animate-spin text-primary"
              />
            </div>
          </div>
          <VChart
            :option="barChartOption"
            :autoresize="true"
            style="height: 310px; width: 100%"
            @rendered="onBarChartRendered"
          />
        </UCard>
      </div>
    </div>
  </NuxtLayout>
</template>

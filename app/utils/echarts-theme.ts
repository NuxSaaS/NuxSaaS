// Credit: https://github.com/nuxt/ui/issues/978#issuecomment-3025809129
export const echartsTheme = {
  color: [
    'var(--ui-primary)',
    'var(--ui-secondary)'
  ],
  backgroundColor: 'transparent',
  textStyle: {
    color: 'var(--ui-text)'
  },
  title: {
    textStyle: {
      color: 'var(--ui-text-highlighted)'
    },
    subtextStyle: {
      color: 'var(--ui-text-muted)'
    }
  },
  line: {
    itemStyle: {
      borderWidth: 1,
      borderColor: 'var(--ui-border)'
    },
    lineStyle: {
      width: 1.5,
      color: 'var(--ui-primary)'
    },
    symbolSize: 4,
    symbol: 'emptyCircle',
    smooth: false
  },
  bar: {
    itemStyle: {
      barBorderWidth: 0,
      barBorderColor: 'var(--ui-border)'
    }
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'var(--ui-border)'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: 'var(--ui-border)'
      }
    },
    axisLabel: {
      show: true,
      color: 'var(--ui-text-muted)'
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['var(--ui-border-muted)'],
        opacity: 0.5
      }
    }
  },
  valueAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: 'var(--ui-border)'
      }
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: 'var(--ui-border)'
      }
    },
    axisLabel: {
      show: true,
      color: 'var(--ui-text-muted)'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['var(--ui-border-muted)'],
        opacity: 0.5
      }
    }
  }
}

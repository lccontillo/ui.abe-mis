<template>
  <div
    class="donut"
    :class="{ multi }"
    :style="{
      width: size,
      height: size,
      borderWidth: borderWidth,
      borderColor: borderColorTransparent,
      borderTopColor: color,
      ...(multi ? { borderBottomColor: color } : {}),
    }"
  ></div>
</template>

<script setup>
import { computed } from 'vue'

// Destructure the props first
const props = defineProps({
  size: {
    type: String,
    default: '2rem',
  },
  color: {
    type: String,
    default: '#979fd0',
  },
  multi: {
    type: Boolean,
    default: false,
  },
})

// derived border width based on size
const borderWidth = computed(() => {
  const numeric = parseFloat(props.size)
  const unit = props.size.replace(numeric, '')
  return `${(numeric / 6).toFixed(2)}${unit}`
})

const borderColorTransparent = computed(() => {
  return `${props.color}4D` // 0.3 opacity as hex
})
</script>

<style scoped>
.donut {
  margin: 2rem;
  border-radius: 50%;
  border-style: solid;
  animation: spin 1.5s linear infinite;
  box-sizing: border-box;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

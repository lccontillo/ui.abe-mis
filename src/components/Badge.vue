<template>
  <span :class="['badge', `badge-${variant}`]">
    <slot></slot>
  </span>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'neutral' }
})
</script>

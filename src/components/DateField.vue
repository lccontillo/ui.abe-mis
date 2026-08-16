<template>
  <div class="date-field">
    <label class="field-label">{{ field.field_label }}</label>
    <input
      :class="['date-input', 'field-control', { 'has-error': error }]"
      :value="formattedValue"
      type="date"
      @input="onDateChange"
    />
    <p v-if="error" class="field-error">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  field: Object,
  modelValue: Object,
  error: String
})
const emit = defineEmits(['update:modelValue'])

const formattedValue = computed(() => {
  if (!props.modelValue?.year || !props.modelValue?.month || !props.modelValue?.day) return ''
  const y = props.modelValue.year
  const m = String(props.modelValue.month).padStart(2, '0')
  const d = String(props.modelValue.day).padStart(2, '0')
  return `${y}-${m}-${d}`
})
const onDateChange = (e) => {
  const date = new Date(e.target.value)
  if (isNaN(date)) return

  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()

  const full = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const short = date.toLocaleDateString('en-US')
  const month_word = date.toLocaleDateString('en-US', { month: 'long' })
  const cardinal_day = getCardinal(day)

  emit('update:modelValue', {
    month,
    day,
    year,
    full,
    short,
    cardinal_day,
    month_word,
  })
}

function getCardinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
</script>

<style scoped>
.date-field {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 200px;
  gap: 0.4rem;
}
</style>

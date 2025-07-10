<template>
  <div class="date-field">
    <label class="field-label">{{ field.field_label }}</label>
    <input class="date-input" type="date" @input="onDateChange" />
  </div>
</template>

<script setup>
const props = defineProps(['field', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

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
}

.field-label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #2e7d32;
}

.date-input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.date-input:focus {
  outline: none;
  border-color: #2e7d32;
  box-shadow: 0 0 0 2px #cce4cd;
}
</style>

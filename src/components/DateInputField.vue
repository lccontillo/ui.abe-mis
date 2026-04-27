<template>
  <div class="date-input-field">
    <label class="field-label">{{ field.field_label }}</label>
    <input
      type="date"
      :disabled="field.properties.disabled"
      :required="field.properties.required"
      v-model="model"
      class="date-input field-control"
    />
    <!-- {{ model }} -->
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'

const props = defineProps(['field', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

// Normalize ISO string to YYYY-MM-DD
const normalizeDate = (val) => {
  if (!val) return ''
  const date = new Date(val)
  if (isNaN(date)) return ''
  return date.toISOString().slice(0, 10)
}

// Emit only 'YYYY-MM-DD'
const model = computed({
  get() {
    return normalizeDate(props.modelValue)
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

// Ensure model is cleaned up on initial load
onMounted(() => {
  const normalized = normalizeDate(props.modelValue)
  if (normalized && normalized !== props.modelValue) {
    emit('update:modelValue', normalized)
  }
})

// Also update if value changes externally
watch(
  () => props.modelValue,
  (newVal) => {
    const normalized = normalizeDate(newVal)
    if (normalized && normalized !== newVal) {
      emit('update:modelValue', normalized)
    }
  },
)
</script>

<style scoped>
.date-input-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}
</style>

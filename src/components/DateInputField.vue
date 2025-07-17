<template>
  <div class="date-input-field">
    <label class="field-label">{{ field.field_label }}</label>
    <input
      type="date"
      :disabled="field.properties.disabled"
      :required="field.properties.required"
      v-model="model"
      class="date-input"
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

.field-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #2e7d32;
}

.date-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: #fff;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.date-input:focus {
  border-color: #2e7d32;
  box-shadow: 0 0 0 2px #cce4cd;
  outline: none;
}

.date-input:disabled {
  background-color: #f3f3f3;
  color: #999;
  cursor: not-allowed;
}
</style>

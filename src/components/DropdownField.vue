<template>
  <div class="input-field">
    <label class="field-label">{{ field.field_label }}</label>
    <select
      :multiple="field.properties.multiple"
      :disabled="field.properties.disabled"
      v-model="model"
      class="select-control"
    >
      <option v-for="option in field.properties.options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['field', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<style scoped>
.input-field {
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

.select-control {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: #fff;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  appearance: none;
}

.select-control:focus {
  border-color: #2e7d32;
  box-shadow: 0 0 0 2px #cce4cd;
  outline: none;
}

.select-control:disabled {
  background-color: #f3f3f3;
  color: #999;
  cursor: not-allowed;
}
</style>

<template>
  <div class="input-field">
    <label class="field-label">{{ field.field_label }}</label>
    <select
      :multiple="field.properties.multiple"
      :disabled="field.properties.disabled"
      v-model="model"
      :class="['select-control', 'field-control', { 'has-error': error }]"
    >
      <option v-for="option in field.properties.options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <p v-if="error" class="field-error">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  field: Object,
  modelValue: [String, Number, Array],
  error: String
})
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

.select-control {
  appearance: none;
}
</style>

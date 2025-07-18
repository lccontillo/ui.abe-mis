<template>
  <div class="input-field">
    <label class="field-label">{{ field.field_label }}</label>
    <div class="checkbox-group">
      <label v-for="option in field.properties.options" :key="option" class="checkbox-option">
        <input
          type="checkbox"
          :value="option"
          :disabled="field.properties.disabled"
          :checked="model.includes(option)"
          @change="toggleOption(option)"
        />
        {{ option }}
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['field', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

const model = computed(() => props.modelValue || [])

function toggleOption(option) {
  const newValue = model.value.includes(option)
    ? model.value.filter((o) => o !== option)
    : [...model.value, option]
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

input[type='checkbox'] {
  accent-color: #2e7d32; /* Your green */
}

.field-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #2e7d32;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}
</style>

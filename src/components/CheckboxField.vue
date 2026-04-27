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
  accent-color: var(--brand-600);
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
  color: var(--text);
  font-size: 0.95rem;
  line-height: 1.35;
}
</style>

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
  </div>
</template>

<script setup>
const props = defineProps(['field', 'modelValue'])
const emit = defineEmits(['update:modelValue'])
const model = defineModel()
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

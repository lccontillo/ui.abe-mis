<template>
  <div class="input-field">
    <label class="field-label">{{ field.field_label }}</label>
    <input
      :type="field.field_type === 'number' ? 'number' : 'text'"
      :disabled="field.properties.disabled"
      :required="field.properties.required"
      v-model="model"
      class="input-control"
    />
  </div>
</template>

<script setup>
const props = defineProps(['field', 'modelValue'])
const emit = defineEmits(['update:modelValue'])
const model = defineModel()
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

.input-control {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: #fff;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.input-control:focus {
  border-color: #2e7d32;
  box-shadow: 0 0 0 2px #cce4cd;
  outline: none;
}

.input-control:disabled {
  background-color: #f3f3f3;
  color: #999;
  cursor: not-allowed;
}
</style>

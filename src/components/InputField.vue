<template>
  <div class="input-field">
    <label class="field-label">{{ field.field_label }}</label>
    <input
      :type="field.field_type === 'number' ? 'number' : 'text'"
      :disabled="field.properties.disabled"
      :required="field.properties.required"
      v-model="model"
      class="input-control field-control"
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
</style>

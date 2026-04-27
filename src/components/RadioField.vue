<template>
  <div class="input-field">
    <label class="field-label">{{ field.field_label }}</label>
    <div class="radio-group">
      <label v-for="option in field.properties.options" :key="option" class="radio-option">
        <input type="radio" :name="field.field_label" :value="option" v-model="model" />
        {{ option }}
      </label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['field', 'modelValue'])
const emit = defineEmits(['update:modelValue'])
const model = defineModel()
</script>

<style scoped>
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text);
  font-size: 0.95rem;
  line-height: 1.35;
}
</style>

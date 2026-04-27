<template>
  <div class="input-field">
    <label class="field-label">{{ field.field_label }}</label>
    <select
      :multiple="field.properties.multiple"
      :disabled="field.properties.disabled"
      v-model="model"
      class="select-control field-control"
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

.select-control {
  appearance: none;
}
</style>

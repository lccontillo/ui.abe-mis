<template>
  <div>
    <label>{{ field.field_label }}</label>
    <div v-for="option in field.properties.options" :key="option">
      <label>
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

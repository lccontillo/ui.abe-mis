<template>
  <div>
    <label>{{ field.field_label }}</label>
    <div v-for="option in field.properties.options" :key="option">
      <label>
        <input
          type="checkbox"
          :value="option"
          :disabled="field.properties.disabled"
          :checked="model.includes(option)"
          @change="toggle(option)"
        />
        {{ option }}
      </label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['field', 'modelValue'])
const emit = defineEmits(['update:modelValue'])
const model = defineModel()

function toggle(option) {
  const next = [...model]
  const index = next.indexOf(option)
  if (index > -1) {
    next.splice(index, 1)
  } else {
    next.push(option)
  }
  emit('update:modelValue', next)
}
</script>

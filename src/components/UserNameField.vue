<template>
  <div class="input-group">
    <label>Username</label>
    <input
      :class="['field-control', { 'has-error': error }]"
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :required="required"
    />
    <p v-if="error" class="field-error">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  error: String,
  required: Boolean
})
defineEmits(['update:modelValue'])
</script>

<style scoped></style>

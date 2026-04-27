<template>
  <div class="input-group">
    <label>Username</label>
    <input
      class="field-control"
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      required
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
})
defineEmits(['update:modelValue'])
</script>

<style scoped></style>

<template>
  <div class="input-group">
    <label>Username</label>
    <input
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

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
}
label {
  font-weight: 600;
  margin-bottom: 4px;
}
input {
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #ccc;
}
</style>

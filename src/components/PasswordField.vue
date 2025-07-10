<template>
  <div class="input-group">
    <label>Password</label>
    <div class="password-wrapper">
      <input
        :type="visible ? 'text' : 'password'"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        required
      />
      <icon-eye v-if="!visible" @click="visible = true" />
      <icon-eye-off v-else @click="visible = false" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ViewOff20 as IconEyeOff, View20 as IconEye } from '@carbon/icons-vue'

defineProps({
  modelValue: String,
})
defineEmits(['update:modelValue'])

const visible = ref(false)
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
.password-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  padding-right: 0.5rem;
}
.password-wrapper input {
  flex: 1;
  border: none;
  padding: 0.5rem;
  border-radius: 0.375rem 0 0 0.375rem;
}
.password-wrapper svg {
  cursor: pointer;
  fill: #333;
}
</style>

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
      <button
        class="password-toggle"
        type="button"
        :aria-label="visible ? 'Hide password' : 'Show password'"
        @click="visible = !visible"
      >
        <IconEyeOff v-if="visible" />
        <IconEye v-else />
      </button>
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

.password-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.password-wrapper:focus-within {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
}

.password-wrapper input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  box-shadow: none;
}

.password-toggle {
  width: 38px;
  height: 38px;
  border: 0;
  background: transparent;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>

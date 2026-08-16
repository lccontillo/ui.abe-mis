<template>
  <div class="stepper">
    <div v-for="(step, index) in steps" :key="index" class="step" :class="{ active: index === currentStep, completed: index < currentStep }">
      <div class="step-circle">
        <Checkmark20 v-if="index < currentStep" />
        <span v-else>{{ index + 1 }}</span>
      </div>
      <span class="step-label">{{ step }}</span>
      <div v-if="index < steps.length - 1" class="step-line"></div>
    </div>
  </div>
</template>

<script setup>
import { Checkmark20 } from '@carbon/icons-vue'
defineProps({
  steps: { type: Array, required: true },
  currentStep: { type: Number, required: true }
})
</script>

<style scoped>
.stepper { width: 100%; display: flex; align-items: center; justify-content: space-between; }
.step { display: flex; align-items: center; flex: 1; position: relative; gap: var(--space-2); color: var(--text-soft); }
.step.active { color: var(--brand-600); font-weight: 500; }
.step.completed { color: var(--brand-600); }
.step-circle { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--surface-3); font-size: var(--text-xs); }
.step.active .step-circle { background: var(--brand-600); color: white; }
.step.completed .step-circle { background: var(--success-soft); color: var(--success); }
.step-line { flex: 1; height: 2px; background: var(--surface-3); margin: 0 var(--space-2); }
.step.completed .step-line { background: var(--brand-600); }
</style>

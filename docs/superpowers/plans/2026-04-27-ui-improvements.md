# UI Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Comprehensively improve the ABE Alcala MIS Vue 3 application UI by implementing a complete design system, shared component library, standard UX patterns, and modernized views.

**Architecture:** A layered 4-track approach starting with CSS design tokens (Track 1), building core reusable Vue components (Track 2), implementing global interaction patterns and composables (Track 3), and finally retrofitting existing views to use these new systems (Track 4). No new dependencies are allowed.

**Tech Stack:** Vue 3 (SFCs), Vue Router, Pinia, Vite, CSS Variables.

*Note on Testing:* Since the project explicitly states "No new dependencies" and does not have a unit testing framework configured in `package.json`, testing steps in this plan involve manual verification via the local development server (`npm run dev`).

---

## Track 1: Design System

### Task 1: CSS Tokens and Breakpoints

**Files:**
- Modify: `src/assets/base.css`

- [ ] **Step 1: Write the new tokens**

Append the following scales to the `:root` block in `src/assets/base.css`:

```css
  /* Spacing Scale */
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-5: 1.5rem; /* 24px */
  --space-6: 2rem; /* 32px */
  --space-8: 3rem; /* 48px */

  /* Typography Scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;

  /* Z-Index Scale */
  --z-base: 1;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;

  /* Transition Tokens */
  --duration-fast: 120ms;
  --duration-normal: 180ms;
  --duration-slow: 300ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
```

Add these comments anywhere outside `:root`:

```css
/* Breakpoints: --bp-sm: 640px, --bp-md: 860px, --bp-lg: 1024px, --bp-xl: 1280px */
```

- [ ] **Step 2: Update existing Z-Index references**

In `src/assets/main.css`, update z-index values to use the new tokens.

Modify `.modal-overlay`:
```css
.modal-overlay {
  z-index: var(--z-modal);
}
```

Modify `.toast-container`:
```css
.toast-container {
  z-index: var(--z-toast);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/assets/base.css src/assets/main.css
git commit -m "feat(ui): add design tokens and update z-index references"
```

### Task 2: Utility Classes

**Files:**
- Modify: `src/assets/main.css`

- [ ] **Step 1: Write utility classes**

Append these utility classes to `src/assets/main.css`:

```css
/* Loading & Skeletons */
.skeleton {
  background: linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 50%, var(--surface-2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.loading-bar {
  height: 2px;
  background-color: var(--brand-600);
  animation: loadingBarSweep 2s infinite ease-in-out;
  width: 100%;
  transform-origin: left;
}
@keyframes loadingBarSweep {
  0% { transform: scaleX(0); opacity: 1; }
  50% { transform: scaleX(1); opacity: 1; }
  100% { transform: scaleX(1); opacity: 0; }
}

/* Layout utilities */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-8);
}

.stepper {
  display: flex;
  gap: var(--space-4);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: var(--text-xs);
  font-weight: 500;
}
.badge-success { background-color: var(--success-soft); color: var(--success); }
.badge-warning { background-color: var(--warning-soft); color: var(--warning); }
.badge-danger { background-color: var(--danger-soft); color: var(--danger-strong); }
.badge-neutral { background-color: var(--surface-3); color: var(--text-muted); }
.badge-info { background-color: var(--accent-blue-soft); color: var(--accent-blue); }

/* Forms */
.field-control.has-error {
  border-color: var(--danger-strong);
}

.field-error {
  color: var(--danger-strong);
  font-size: var(--text-sm);
  margin-top: var(--space-1);
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--brand-600);
  color: white;
  padding: 8px;
  z-index: var(--z-toast);
  transition: top var(--duration-fast) var(--ease-out);
}
.skip-link:focus {
  top: 0;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/assets/main.css
git commit -m "feat(ui): add utility classes for patterns"
```

---

## Track 2: Component Library

### Task 3: Core Indicators (SkeletonLoader, EmptyState, Badge)

**Files:**
- Create: `src/components/SkeletonLoader.vue`
- Create: `src/components/EmptyState.vue`
- Create: `src/components/Badge.vue`

- [ ] **Step 1: Write `SkeletonLoader.vue`**

```vue
<template>
  <div class="skeleton-loader">
    <div v-if="type === 'table'" class="skeleton-table">
      <div class="skeleton skeleton-row header"></div>
      <div v-for="i in rows" :key="i" class="skeleton skeleton-row body"></div>
    </div>
    <div v-else-if="type === 'card'" class="skeleton skeleton-card"></div>
    <div v-else-if="type === 'text'" class="skeleton-text-group">
      <div v-for="i in lines" :key="i" class="skeleton skeleton-text" :style="{ width: `${80 + Math.random() * 20}%` }"></div>
    </div>
    <div v-else-if="type === 'stat'" class="skeleton-stat">
      <div class="skeleton skeleton-stat-label"></div>
      <div class="skeleton skeleton-stat-value"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, required: true },
  rows: { type: Number, default: 5 },
  lines: { type: Number, default: 3 }
})
</script>

<style scoped>
.skeleton-row { height: 40px; margin-bottom: 8px; }
.skeleton-card { height: 200px; }
.skeleton-text { height: 16px; margin-bottom: 8px; }
.skeleton-stat-label { height: 14px; width: 50%; margin-bottom: 8px; }
.skeleton-stat-value { height: 32px; width: 80%; }
</style>
```

- [ ] **Step 2: Write `EmptyState.vue`**

```vue
<template>
  <div class="empty-state">
    <component v-if="icon" :is="icon" class="empty-icon" />
    <h3 class="empty-title">{{ title }}</h3>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <div class="empty-action" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: Object,
  title: { type: String, required: true },
  description: String
})
</script>

<style scoped>
.empty-icon { font-size: var(--text-2xl); color: var(--text-soft); margin-bottom: var(--space-4); }
.empty-title { font-size: var(--text-lg); color: var(--heading); margin-bottom: var(--space-2); }
.empty-description { color: var(--text-muted); margin-bottom: var(--space-4); }
</style>
```

- [ ] **Step 3: Write `Badge.vue`**

```vue
<template>
  <span :class="['badge', `badge-${variant}`]">
    <slot></slot>
  </span>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'neutral' }
})
</script>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/SkeletonLoader.vue src/components/EmptyState.vue src/components/Badge.vue
git commit -m "feat(components): add core indicator components"
```

### Task 4: Navigation Components (PaginationBar, BreadcrumbNav, Stepper)

**Files:**
- Create: `src/components/PaginationBar.vue`
- Create: `src/components/BreadcrumbNav.vue`
- Create: `src/components/Stepper.vue`

- [ ] **Step 1: Write `PaginationBar.vue`**

```vue
<template>
  <div class="pagination">
    <div class="per-page">
      <select :value="perPage" @change="$emit('per-page-change', Number($event.target.value))" class="field-control">
        <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }} per page</option>
      </select>
    </div>
    <div class="page-controls">
      <button class="btn btn-secondary" :disabled="currentPage === 1" @click="$emit('page-change', currentPage - 1)">Prev</button>
      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="btn btn-secondary" :disabled="currentPage >= totalPages" @click="$emit('page-change', currentPage + 1)">Next</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  perPage: { type: Number, default: 10 },
  perPageOptions: { type: Array, default: () => [10, 20, 50] }
})
defineEmits(['page-change', 'per-page-change'])
</script>

<style scoped>
.pagination { display: flex; justify-content: space-between; align-items: center; padding: var(--space-4) 0; }
.page-controls { display: flex; align-items: center; gap: var(--space-4); }
.page-info { color: var(--text-muted); font-size: var(--text-sm); }
</style>
```

- [ ] **Step 2: Write `BreadcrumbNav.vue`**

```vue
<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <template v-for="(item, index) in items" :key="index">
      <RouterLink v-if="item.to && index < items.length - 1" :to="item.to" class="breadcrumb-link">{{ item.label }}</RouterLink>
      <span v-else class="breadcrumb-current">{{ item.label }}</span>
      <ChevronRight20 v-if="index < items.length - 1" class="breadcrumb-separator" />
    </template>
  </nav>
</template>

<script setup>
import { ChevronRight20 } from '@carbon/icons-vue'
defineProps({
  items: { type: Array, required: true }
})
</script>

<style scoped>
.breadcrumb-link { color: var(--text-muted); text-decoration: none; }
.breadcrumb-link:hover { color: var(--brand-600); }
.breadcrumb-current { color: var(--text); font-weight: 500; }
.breadcrumb-separator { color: var(--text-soft); }
</style>
```

- [ ] **Step 3: Write `Stepper.vue`**

```vue
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
```

- [ ] **Step 4: Commit**

```bash
git add src/components/PaginationBar.vue src/components/BreadcrumbNav.vue src/components/Stepper.vue
git commit -m "feat(components): add navigation components"
```

### Task 5: Upgrade Existing Components (Toast, DataTable, Modal)

**Files:**
- Modify: `src/components/Toast.vue`
- Modify: `src/plugins/toast.js`
- Modify: `src/components/DataTable.vue`
- Modify: `src/components/Modal.vue`

- [ ] **Step 1: Modify `src/plugins/toast.js`**

Update `addToast` to include a unique ID:
```javascript
export const toastState = reactive({
  toasts: []
})

let nextId = 1
export function addToast(message, type = 'info', duration = 5000) {
  const id = nextId++
  toastState.toasts.push({ id, message, type })
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
}

export function removeToast(id) {
  const index = toastState.toasts.findIndex(t => t.id === id)
  if (index !== -1) toastState.toasts.splice(index, 1)
}
```

- [ ] **Step 2: Modify `src/components/Toast.vue`**

Change root div to TransitionGroup and use key:
```vue
<template>
  <div class="toast-container">
    <TransitionGroup name="toast-slide">
      <div v-for="toast in toastState.toasts" :key="toast.id" :class="['toast', `toast-${toast.type}`]">
        <span>{{ toast.message }}</span>
        <button class="toast-close" @click="removeToast(toast.id)">&times;</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { toastState, removeToast } from '../plugins/toast.js'
</script>

<style scoped>
/* existing styles plus: */
.toast-slide-enter-active, .toast-slide-leave-active { transition: all var(--duration-normal) var(--ease-out); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(20px); }
</style>
```

- [ ] **Step 3: Modify `src/components/DataTable.vue`**

Add loading, emptyIcon, emptyTitle, emptyDescription props and conditionally render SkeletonLoader/EmptyState:
```vue
<template>
  <div class="data-table">
    <SkeletonLoader v-if="loading" type="table" />
    <EmptyState v-else-if="!data.length" :icon="emptyIcon" :title="emptyTitle" :description="emptyDescription" />
    <table v-else>
      <!-- existing table markup -->
    </table>
  </div>
</template>
<script setup>
import SkeletonLoader from './SkeletonLoader.vue'
import EmptyState from './EmptyState.vue'
// Add new props to defineProps: loading: Boolean, emptyIcon: Object, emptyTitle: { type: String, default: 'No records found' }, emptyDescription: String
</script>
```

- [ ] **Step 4: Modify `src/components/Modal.vue`**

Add `size` and `persistent` props:
```vue
<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div :class="['modal-content', `modal-${size}`]">
      <!-- existing modal markup -->
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  title: String,
  size: { type: String, default: 'md' },
  persistent: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

function handleOverlayClick(e) {
  if (e.target === e.currentTarget && !props.persistent) {
    emit('close')
  }
}
</script>
<style scoped>
.modal-sm { max-width: 360px; }
.modal-md { max-width: 440px; }
.modal-lg { max-width: 600px; }
</style>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Toast.vue src/plugins/toast.js src/components/DataTable.vue src/components/Modal.vue
git commit -m "refactor(components): upgrade Toast, DataTable, Modal"
```

---

## Track 3: UX Patterns

### Task 6: Form Validation Conventions

**Files:**
- Modify: `src/components/InputField.vue`, `src/components/DateField.vue`, `src/components/DropdownField.vue` (and similar fields as needed)

- [ ] **Step 1: Add error handling to InputField.vue**

Update script to include props:
```javascript
defineProps({
  modelValue: [String, Number],
  error: String,
  required: Boolean,
  // existing props...
})
```

Update template to show error class and message:
```vue
<template>
  <div class="field-wrapper">
    <!-- label etc -->
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="['field-control', { 'has-error': error }]"
      :required="required"
    />
    <p v-if="error" class="field-error">{{ error }}</p>
  </div>
</template>
```
*Apply this same pattern to DateField.vue, DropdownField.vue, PasswordField.vue, etc.*

- [ ] **Step 2: Commit**

```bash
git add src/components/*Field.vue
git commit -m "feat(forms): add global form validation patterns to fields"
```

### Task 7: Confirm Dialog Pattern

**Files:**
- Create: `src/composables/useConfirmDialog.js`
- Modify: `src/App.vue`
- Create: `src/components/ConfirmDialog.vue`

- [ ] **Step 1: Create composable `src/composables/useConfirmDialog.js`**

```javascript
import { reactive } from 'vue'

const confirmState = reactive({
  isOpen: false,
  title: '',
  message: '',
  dangerLabel: 'Confirm',
  resolvePromise: null
})

export function useConfirmDialog() {
  const confirm = (title, message, dangerLabel = 'Confirm') => {
    confirmState.title = title
    confirmState.message = message
    confirmState.dangerLabel = dangerLabel
    confirmState.isOpen = true

    return new Promise((resolve) => {
      confirmState.resolvePromise = resolve
    })
  }

  const proceed = () => {
    confirmState.resolvePromise(true)
    confirmState.isOpen = false
  }

  const cancel = () => {
    confirmState.resolvePromise(false)
    confirmState.isOpen = false
  }

  return { confirmState, confirm, proceed, cancel }
}
```

- [ ] **Step 2: Create `src/components/ConfirmDialog.vue`**

```vue
<template>
  <Modal v-if="confirmState.isOpen" :title="confirmState.title" size="sm" persistent @close="cancel">
    <p>{{ confirmState.message }}</p>
    <div style="margin-top: var(--space-4); display: flex; justify-content: flex-end; gap: var(--space-2);">
      <button class="btn btn-secondary" @click="cancel">Cancel</button>
      <button class="btn btn-primary" style="background-color: var(--danger-strong)" @click="proceed">
        {{ confirmState.dangerLabel }}
      </button>
    </div>
  </Modal>
</template>

<script setup>
import Modal from './Modal.vue'
import { useConfirmDialog } from '../composables/useConfirmDialog'
const { confirmState, proceed, cancel } = useConfirmDialog()
</script>
```

- [ ] **Step 3: Modify `src/App.vue`**

Add Skip Link and ConfirmDialog component globally.

```vue
<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <div id="app">
    <!-- existing layout -->
    <main id="main-content" class="main-content">
      <RouterView />
    </main>
    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import ConfirmDialog from './components/ConfirmDialog.vue'
import Toast from './components/Toast.vue'
</script>
```

- [ ] **Step 4: Commit**

```bash
git add src/composables/useConfirmDialog.js src/components/ConfirmDialog.vue src/App.vue
git commit -m "feat(ui): add global confirm dialog and skip link"
```

---

## Track 4: Page Modernization

*(Note to implementer: Implement each group in sequential PRs/commits.)*

### Task 8: Group A - LoginView & Dashboard

**Files:**
- Modify: `src/views/LoginView.vue`
- Modify: `src/views/Dashboard.vue`

- [ ] **Step 1: Modernize `LoginView.vue`**

Add error props to `UserNameField`/`PasswordField`. Implement `validate()` on submit to set error messages if empty. Focus on first error element on fail.

- [ ] **Step 2: Modernize `Dashboard.vue`**

Import `SkeletonLoader`. Replace `DonutLoader` logic with `<SkeletonLoader type="card">` around stat blocks and `<SkeletonLoader type="table">` around recent activity. Add `<EmptyState>` when no data exists.

- [ ] **Step 3: Commit**

```bash
git add src/views/LoginView.vue src/views/Dashboard.vue
git commit -m "feat(views): modernize Login and Dashboard views"
```

### Task 9: Group B - Data Tables (FcaView, DocumentView, AuditLogView)

**Files:**
- Modify: `src/views/FcaView.vue`
- Modify: `src/views/DocumentView.vue`
- Modify: `src/views/AuditLogView.vue`

- [ ] **Step 1: Implement `BreadcrumbNav`, `PaginationBar`, and `ConfirmDialog` in `FcaView.vue`**

```vue
<template>
  <div class="app-page">
    <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'FCAs' }]" />
    <!-- ... -->
    <DataTable :loading="isLoading" emptyTitle="No FCAs Match Filters" ... />
    <PaginationBar :currentPage="page" :totalPages="totalPages" @page-change="p => page = p" />
  </div>
</template>
<script setup>
import { useConfirmDialog } from '../composables/useConfirmDialog'
const { confirm } = useConfirmDialog()
async function deleteFca(id) {
  if (await confirm('Delete FCA?', 'This cannot be undone', 'Delete')) {
    // perform delete
  }
}
</script>
```

- [ ] **Step 2: Update `DocumentView` and `AuditLogView`**

Apply the exact same layout modifications. Replace `AuditLogView`'s raw `<table>` with the `<DataTable>` component completely.

- [ ] **Step 3: Commit**

```bash
git add src/views/FcaView.vue src/views/DocumentView.vue src/views/AuditLogView.vue
git commit -m "feat(views): modernize data table views"
```

### Task 10: Group C - DocumentGenerator Wizard

**Files:**
- Modify: `src/views/DocumentGenerator.vue`

- [ ] **Step 1: Transform to Wizard**

Import `Stepper`. Add `const currentStep = ref(0)` and `const steps = ['Select FCA', 'Select Group', 'Choose Documents', 'Fill Form', 'Review and Generate']`.

```vue
<template>
  <div class="app-page">
    <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'Generate Document' }]" />
    <Stepper :steps="steps" :currentStep="currentStep" />

    <section v-if="currentStep === 0">
      <!-- Select FCA Form -->
      <button class="btn btn-primary" @click="validateStep(0)">Next</button>
    </section>

    <!-- ... sections 1 through 4 ... -->

    <section v-if="currentStep === 4">
      <!-- Summary view -->
      <button class="btn btn-secondary" @click="currentStep--">Back</button>
      <button class="btn btn-primary" @click="generate" :disabled="isGenerating">
         <span v-if="isGenerating">Generating...</span>
         <span v-else>Generate</span>
      </button>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/DocumentGenerator.vue
git commit -m "feat(views): convert DocumentGenerator to wizard flow"
```

### Task 11: Group D & E - Remaining Settings and Tool Pages

**Files:**
- Modify: All remaining views in `src/views/` (AccountSettings, UsersView, FcaForm, DocumentSettings, etc.)

- [ ] **Step 1: Replace Inline Modals with `Modal.vue`**

Remove `.modal-overlay` custom markup from `AccountSettings.vue`, `UsersView.vue`, `DocumentSettings.vue`, `GISToolsView.vue` and `PreviewView.vue`. Replace with `<Modal>` with standard form actions.

- [ ] **Step 2: Apply Breadcrumbs and Loaders**

Ensure `BreadcrumbNav` is used universally on nested pages. Ensure `SkeletonLoader` handles loading states during data fetch.

- [ ] **Step 3: Commit**

```bash
git add src/views/*
git commit -m "feat(views): finalize modernization of remaining views"
```

---

**Execution Handoff:**
Plan complete and saved to `docs/superpowers/plans/2026-04-27-ui-improvements.md`. Two execution options:
1. **Subagent-Driven (recommended)** - dispatch a fresh subagent per task, review between tasks.
2. **Inline Execution** - execute tasks in this session using executing-plans.
*(Please inform which approach to use if you want me to start immediately).*

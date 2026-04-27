# UI Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the Vue app UI with mobile responsiveness, a collapsible navigation menu, system-aware light/dark themes, consistent component styling, visible text, modal transitions, and stronger form/page presentation.

**Architecture:** Keep the existing Vue 3/Vite structure and avoid replacing the component stack. Centralize visual tokens and reusable utility classes in `src/assets/base.css` and `src/assets/main.css`, then update the app shell and shared components first so page-level changes inherit consistent behavior. Use Vue's built-in `<Transition>` for modal/menu transitions and CSS `prefers-color-scheme` for default light/dark theme behavior.

**Tech Stack:** Vue 3 single-file components, Vue Router, Pinia, Vite, Carbon icons, plain CSS variables, CSS media queries.

---

## File Structure

- Modify `src/assets/base.css`: Replace Vue starter color variables with ABE MIS design tokens for surfaces, text, borders, brand, states, shadows, radius, spacing, and system dark mode.
- Modify `src/assets/main.css`: Add global layout resets, reusable `.app-page`, `.panel`, `.btn`, `.field-control`, `.table-wrap`, `.modal-*`, pagination, filter, and `v-select` styling.
- Modify `src/App.vue`: Convert fixed desktop layout into responsive app shell with collapsible desktop sidebar, mobile top bar, overlay drawer, route-aware close behavior, and accessible icon buttons.
- Modify `src/components/Modal.vue`: Wrap overlay/content in Vue `<Transition>`, use global modal classes, add optional close button, and improve dark-mode text/background contrast.
- Modify form components: `src/components/InputField.vue`, `src/components/DateField.vue`, `src/components/DateInputField.vue`, `src/components/DropdownField.vue`, `src/components/UserNameField.vue`, `src/components/PasswordField.vue`, `src/components/CheckboxField.vue`, `src/components/RadioField.vue`, `src/components/TableField.vue`.
- Modify data/display components: `src/components/DataTable.vue`, `src/components/TitleBar.vue`, `src/components/Toast.vue`, `src/components/DonutLoader.vue` only as needed for token consistency and responsive behavior.
- Modify page views with highest visual impact first: `src/views/LoginView.vue`, `src/views/Dashboard.vue`, `src/views/FcaView.vue`, `src/views/DocumentView.vue`, `src/views/DocumentSettings.vue`, `src/views/GISToolsView.vue`, `src/views/AccountSettings.vue`, `src/views/SettingsView.vue`, `src/views/UsersView.vue`, `src/views/AuditLogView.vue`, `src/views/FcaDataView.vue`, `src/views/DocumentGenerator.vue`, `src/views/DocumentSchema.vue`, `src/views/HomeView.vue`, `src/views/PreviewView.vue`.

## Task 1: Global Theme Tokens And Utilities

**Files:**
- Modify: `src/assets/base.css`
- Modify: `src/assets/main.css`

- [ ] **Step 1: Replace root tokens in `src/assets/base.css`**

Use this token set as the base. Keep ASCII-only comments.

```css
:root {
  color-scheme: light dark;
  --font-sans:
    ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  --brand-50: #edf7ee;
  --brand-100: #d8eddc;
  --brand-500: #2f7d38;
  --brand-600: #276b30;
  --brand-700: #1f5527;
  --brand-800: #183f20;
  --accent-blue: #2563eb;
  --danger: #c2410c;
  --danger-strong: #b42318;
  --warning: #b7791f;
  --success: #2f7d38;

  --bg: #f5f7f4;
  --bg-elevated: #ffffff;
  --bg-muted: #eef3ee;
  --bg-subtle: #f8faf8;
  --text: #17231a;
  --text-muted: #5c6a60;
  --text-soft: #758177;
  --heading: #102114;
  --border: #dbe4dc;
  --border-strong: #c7d5c9;
  --focus: rgba(47, 125, 56, 0.28);
  --shadow-sm: 0 1px 2px rgba(16, 33, 20, 0.08);
  --shadow-md: 0 12px 28px rgba(16, 33, 20, 0.12);
  --shadow-lg: 0 22px 60px rgba(16, 33, 20, 0.18);
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --sidebar-width: 264px;
  --sidebar-collapsed-width: 76px;
  --topbar-height: 64px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --brand-50: #16341d;
    --brand-100: #1d4726;
    --brand-500: #7ccf85;
    --brand-600: #5dbb68;
    --brand-700: #a3e7a9;
    --brand-800: #d7f8da;
    --accent-blue: #8db4ff;
    --danger: #ffb199;
    --danger-strong: #ff9b8d;
    --warning: #f6d58a;
    --success: #7ccf85;

    --bg: #0f1511;
    --bg-elevated: #171f19;
    --bg-muted: #202a22;
    --bg-subtle: #141b16;
    --text: #edf5ee;
    --text-muted: #b9c7bb;
    --text-soft: #8fa093;
    --heading: #ffffff;
    --border: #2d3a30;
    --border-strong: #405244;
    --focus: rgba(124, 207, 133, 0.3);
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.32);
    --shadow-md: 0 12px 28px rgba(0, 0, 0, 0.36);
    --shadow-lg: 0 22px 60px rgba(0, 0, 0, 0.46);
  }
}
```

- [ ] **Step 2: Update global reset in `src/assets/base.css`**

Replace the existing universal/body reset with:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  min-height: 100%;
  background: var(--bg);
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  color: var(--text);
  background: var(--bg);
  font-family: var(--font-sans);
  font-size: 15px;
  line-height: 1.5;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  color: inherit;
}

img,
svg {
  display: block;
}
```

- [ ] **Step 3: Add shared utilities to `src/assets/main.css`**

Replace the starter link styles with reusable classes. Include these exact class groups:

```css
@import './base.css';

#app {
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

.app-page {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}

.panel {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.btn {
  min-height: 40px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 0.55rem 0.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  font-weight: 650;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.btn:focus-visible,
.icon-btn:focus-visible,
.field-control:focus,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.62;
  transform: none;
}

.btn-primary {
  background: var(--brand-600);
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: var(--brand-700);
}

.btn-secondary {
  background: var(--bg-muted);
  border-color: var(--border);
  color: var(--text);
}

.btn-danger,
.text-red {
  color: var(--danger-strong);
}

.icon-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  color: var(--text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.field,
.input-field,
.input-group,
.date-input-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.field-label,
.input-group label,
.date-input-field label {
  color: var(--text);
  font-size: 0.92rem;
  font-weight: 700;
}

.field-control,
input:not([type='checkbox']):not([type='radio']),
select,
textarea {
  width: 100%;
  min-height: 40px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  color: var(--text);
  padding: 0.55rem 0.75rem;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background-color 160ms ease;
}

.field-control:disabled,
input:disabled,
select:disabled,
textarea:disabled {
  background: var(--bg-muted);
  color: var(--text-soft);
  cursor: not-allowed;
}

input[type='checkbox'],
input[type='radio'] {
  accent-color: var(--brand-600);
}

.table-wrap,
.data-table {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
}

.data-table table,
.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-elevated);
  color: var(--text);
}

.data-table th,
.data-table td,
.table th,
.table td {
  padding: 0.72rem 0.8rem;
  border-bottom: 1px solid var(--border);
  text-align: left;
  white-space: nowrap;
}

.data-table th,
.table th {
  background: var(--bg-muted);
  color: var(--heading);
  font-weight: 750;
}

.data-table tbody tr:hover,
.table tbody tr:hover {
  background: var(--bg-subtle);
}

.filters,
.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  align-items: end;
  margin-bottom: 1rem;
}

.pagination,
.pages {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(8, 13, 10, 0.58);
  backdrop-filter: blur(4px);
}

.modal-content {
  width: min(100%, 440px);
  max-height: min(86vh, 720px);
  overflow: auto;
  background: var(--bg-elevated);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 1.25rem;
}

.modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 180ms ease;
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

@media (max-width: 720px) {
  .app-page {
    padding: 16px;
  }

  .modal-overlay {
    align-items: flex-end;
    padding: 0;
  }

  .modal-content {
    width: 100%;
    max-height: 88vh;
    border-radius: 14px 14px 0 0;
  }
}
```

- [ ] **Step 4: Run build**

Run: `npm run build`

Expected: Vite build completes successfully.

- [ ] **Step 5: Commit**

```bash
git add src/assets/base.css src/assets/main.css
git commit -m "style: add responsive theme tokens"
```

## Task 2: Responsive App Shell And Collapsible Menu

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: Update imports and state**

Add `computed`, `watch`, `Menu20`, `Close20`, and `ChevronLeft20`. Add state:

```js
const isSidebarCollapsed = ref(localStorage.getItem('sidebar-collapsed') === 'true')
const isMobileMenuOpen = ref(false)
const isLoginRoute = computed(() => route.path === '/login')

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  localStorage.setItem('sidebar-collapsed', String(isSidebarCollapsed.value))
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    closeMobileMenu()
  },
)
```

- [ ] **Step 2: Replace the app template shell**

Use this structure:

```vue
<template>
  <div v-if="isLoginRoute">
    <RouterView />
  </div>

  <div v-else class="layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <header class="mobile-topbar">
      <button class="icon-btn" type="button" aria-label="Open navigation" @click="toggleMobileMenu">
        <Menu20 />
      </button>
      <div class="mobile-brand">
        <img src="@/assets/logo.svg" alt="ABE Logo" width="34" height="34" />
        <span>ABE Alcala MIS</span>
      </div>
    </header>

    <Transition name="drawer-fade">
      <button
        v-if="isMobileMenuOpen"
        class="mobile-scrim"
        type="button"
        aria-label="Close navigation"
        @click="closeMobileMenu"
      />
    </Transition>

    <aside class="sidebar" :class="{ open: isMobileMenuOpen }">
      <div class="sidebar-top">
        <div class="logo-title">
          <div class="logo-icon">
            <img src="@/assets/logo.svg" alt="ABE Logo" width="42" height="42" />
          </div>
          <div class="header-text">
            <div class="project-name">ABE Alcala MIS</div>
            <div class="user-info" v-if="userStore.user">
              <span class="user-name">{{ userStore.user.username }}</span>
            </div>
          </div>
          <button
            class="collapse-btn icon-btn"
            type="button"
            :aria-label="isSidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'"
            @click="toggleSidebar"
          >
            <ChevronLeft20 />
          </button>
          <button
            class="mobile-close icon-btn"
            type="button"
            aria-label="Close navigation"
            @click="closeMobileMenu"
          >
            <Close20 />
          </button>
        </div>

        <nav class="nav" aria-label="Primary navigation">
          <!-- keep existing nav items, but add :title to each RouterLink and plus icon button aria labels -->
        </nav>
      </div>

      <div class="logout-section">
        <button class="logout-btn" type="button" @click="logout" title="Logout">
          <Logout20 class="icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>
```

- [ ] **Step 3: Preserve nav behavior with accessible add buttons**

For FCA and Documents add buttons, replace bare icons with buttons:

```vue
<button class="nav-action" type="button" aria-label="Add FCA profile" @click="router.push('/fca')">
  <Add20 />
</button>
```

```vue
<button
  class="nav-action"
  type="button"
  aria-label="Generate document"
  @click="router.push('/generate')"
>
  <Add20 />
</button>
```

- [ ] **Step 4: Replace scoped shell CSS**

Implement responsive styles using `--sidebar-width`, `--sidebar-collapsed-width`, `--topbar-height`, `var(--bg-elevated)`, `var(--text)`, and `var(--border)`. Required behavior:

- Desktop `layout` uses CSS grid with sidebar plus content.
- Collapsed sidebar width is `var(--sidebar-collapsed-width)`.
- Collapsed sidebar hides text labels with opacity/width, while icons remain visible.
- Mobile topbar appears at `max-width: 860px`.
- Mobile sidebar is fixed, translated off-canvas unless `.open`.
- Main content has `min-width: 0`, `overflow-y: auto`, and no fixed width calculation.

- [ ] **Step 5: Verify responsive shell**

Run: `npm run build`

Manual checks in browser:
- Desktop sidebar collapses and expands.
- Mobile width shows topbar and drawer overlay.
- Route navigation closes the mobile drawer.
- Text stays visible in light and dark system themes.

- [ ] **Step 6: Commit**

```bash
git add src/App.vue
git commit -m "feat: add responsive collapsible app shell"
```

## Task 3: Shared Forms, Tables, Toasts, And Modal Transition

**Files:**
- Modify: `src/components/Modal.vue`
- Modify: `src/components/InputField.vue`
- Modify: `src/components/DateField.vue`
- Modify: `src/components/DateInputField.vue`
- Modify: `src/components/DropdownField.vue`
- Modify: `src/components/UserNameField.vue`
- Modify: `src/components/PasswordField.vue`
- Modify: `src/components/CheckboxField.vue`
- Modify: `src/components/RadioField.vue`
- Modify: `src/components/TableField.vue`
- Modify: `src/components/DataTable.vue`
- Modify: `src/components/TitleBar.vue`
- Modify: `src/components/Toast.vue`

- [ ] **Step 1: Convert `Modal.vue` to transition-backed global classes**

Use:

```vue
<template>
  <Transition name="modal-fade" appear>
    <div class="modal-overlay" @click.self="$emit('close')">
      <section class="modal-content" role="dialog" aria-modal="true" :aria-label="title">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="icon-btn modal-close" type="button" aria-label="Close" @click="$emit('close')">
            x
          </button>
        </div>
        <slot />
      </section>
    </div>
  </Transition>
</template>
```

Keep scoped CSS only for `.modal-header`, `.modal-title`, and `.modal-close`, all using CSS variables.

- [ ] **Step 2: Normalize text inputs**

In `InputField.vue`, `DateField.vue`, `DateInputField.vue`, `DropdownField.vue`, and `UserNameField.vue`, keep templates mostly intact but ensure controls use `class="field-control"` in addition to their current class. Remove duplicated hard-coded green/white/gray scoped CSS and leave only component-specific layout if needed.

- [ ] **Step 3: Normalize `PasswordField.vue`**

Use a button for the visibility toggle:

```vue
<button
  class="password-toggle"
  type="button"
  :aria-label="visible ? 'Hide password' : 'Show password'"
  @click="visible = !visible"
>
  <IconEyeOff v-if="visible" />
  <IconEye v-else />
</button>
```

Style `.password-wrapper` with `background: var(--bg-elevated)`, `border: 1px solid var(--border-strong)`, `border-radius: var(--radius-sm)`, and focus-within outline using `var(--focus)`.

- [ ] **Step 4: Normalize choice controls**

In `CheckboxField.vue` and `RadioField.vue`, use `var(--text)` for option labels, `var(--brand-600)` for accent color, and responsive wrapping for long options.

- [ ] **Step 5: Improve `TableField.vue`**

Wrap table markup in `.table-wrap`, remove inline `border="1"`/`cellpadding`, and make add-row button `class="btn btn-secondary"`.

- [ ] **Step 6: Improve `DataTable.vue`**

Keep sorting behavior. Add empty state:

```vue
<tr v-if="!data?.length">
  <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="empty-cell">No records found.</td>
</tr>
```

Add `.empty-cell { color: var(--text-muted); text-align: center; }`.

- [ ] **Step 7: Improve `TitleBar.vue`**

Allow optional trailing content:

```vue
<template>
  <div class="title-bar">
    <div class="title-main">
      <component :is="icon" v-if="icon" class="title-icon" />
      <h1 class="title-text">{{ title }}</h1>
    </div>
    <div v-if="$slots.actions" class="title-actions">
      <slot name="actions" />
    </div>
  </div>
</template>
```

Use responsive flex wrapping and CSS variables.

- [ ] **Step 8: Improve `Toast.vue` contrast**

Use `background: var(--bg-elevated)`, `color: var(--text)`, `border-color: var(--border)`, `box-shadow: var(--shadow-md)`, and keep semantic icon colors.

- [ ] **Step 9: Build and commit**

Run: `npm run build`

Expected: build passes.

```bash
git add src/components
git commit -m "style: standardize shared UI components"
```

## Task 4: Login Page Upgrade

**Files:**
- Modify: `src/views/LoginView.vue`

- [ ] **Step 1: Improve template structure**

Keep existing login behavior. Add a two-column desktop layout with a brand panel and auth panel:

```vue
<div class="login-shell">
  <section class="login-brand" aria-label="Application information">
    <img src="@/assets/logo.svg" alt="ABE Logo" width="84" height="84" />
    <h1>ABE Alcala MIS</h1>
    <p>Management tools for agricultural and biosystems engineering records, documents, and activity tracking.</p>
  </section>

  <section class="login-card panel">
    <div class="login-heading">
      <h2>Sign in</h2>
      <p>Use your assigned account credentials.</p>
    </div>
    <!-- existing form -->
  </section>
</div>
```

- [ ] **Step 2: Improve login button state**

Use `class="btn btn-primary login-button"` and show stable text:

```vue
<span>{{ loading ? 'Signing in...' : 'Login' }}</span>
```

- [ ] **Step 3: Surface error text accessibly**

Set `error.value = err.message` in the catch block before toast. Render:

```vue
<div v-if="error" class="error-msg" role="alert">{{ error }}</div>
```

- [ ] **Step 4: Replace scoped CSS**

Use variables and responsive rules:
- Full viewport min-height.
- Brand panel visible on desktop, stacked above form on mobile.
- `.login-card` max width 440px.
- Dark mode inherits from tokens.
- No text uses hard-coded gray that can disappear in dark mode.

- [ ] **Step 5: Build and commit**

Run: `npm run build`

Expected: build passes.

```bash
git add src/views/LoginView.vue
git commit -m "style: improve login experience"
```

## Task 5: Dashboard And Common Data Pages

**Files:**
- Modify: `src/views/Dashboard.vue`
- Modify: `src/views/FcaView.vue`
- Modify: `src/views/DocumentView.vue`
- Modify: `src/views/GISToolsView.vue`
- Modify: `src/views/DocumentSettings.vue`
- Modify: `src/views/AuditLogView.vue`

- [ ] **Step 1: Wrap pages with `.app-page`**

For each page root, add `class="app-page"` or combine with existing page class:

```vue
<div class="dashboard app-page">
```

- [ ] **Step 2: Convert action buttons**

Replace page-specific green button classes with shared classes:

```vue
<button class="btn btn-primary" type="button" @click="fetchDocuments">Apply</button>
<button class="btn btn-secondary" type="button" @click="resetFilters">Reset</button>
```

- [ ] **Step 3: Convert filter containers**

Ensure `.filters` uses the global grid. Remove duplicated per-page input/select/button rules unless they are needed for a unique layout.

- [ ] **Step 4: Convert tables to wrappers**

Wrap raw tables in `.table-wrap` and remove hard-coded table colors. For `Dashboard.vue`, wrap recent activity table:

```vue
<div class="table-wrap">
  <table class="log-table table">
    ...
  </table>
</div>
```

- [ ] **Step 5: Update dashboard stats**

Use `.panel` for stat cards, keep existing routes, and use token-based styles:
- stat label: `var(--text-muted)`
- stat value: `var(--heading)` with icon color `var(--brand-600)`
- cards responsive through CSS grid: `grid-template-columns: repeat(auto-fit, minmax(190px, 1fr))`

- [ ] **Step 6: Replace modal duplication where easy**

Where pages use local `.modal-overlay` and `.modal-content`, keep markup but wrap each `v-if` modal block with:

```vue
<Transition name="modal-fade">
  <div v-if="..." class="modal-overlay">
    <div class="modal-content">
      ...
    </div>
  </div>
</Transition>
```

Do this in `GISToolsView.vue`, `DocumentSettings.vue`, and `UsersView.vue` if touched during this task.

- [ ] **Step 7: Build and commit**

Run: `npm run build`

Expected: build passes.

```bash
git add src/views/Dashboard.vue src/views/FcaView.vue src/views/DocumentView.vue src/views/GISToolsView.vue src/views/DocumentSettings.vue src/views/AuditLogView.vue
git commit -m "style: modernize dashboard and data pages"
```

## Task 6: Settings, Account, Form Builder, And Remaining Pages

**Files:**
- Modify: `src/views/SettingsView.vue`
- Modify: `src/views/AccountSettings.vue`
- Modify: `src/views/UsersView.vue`
- Modify: `src/views/FcaDataView.vue`
- Modify: `src/views/DocumentGenerator.vue`
- Modify: `src/views/DocumentSchema.vue`
- Modify: `src/views/HomeView.vue`
- Modify: `src/views/PreviewView.vue`

- [ ] **Step 1: Apply page wrapper and panels**

Use `.app-page` only at routed page roots. Use `.panel` for the main content containers, not nested inside another `.panel`.

- [ ] **Step 2: Update settings tabs**

In `SettingsView.vue`, make tabs horizontally scrollable on mobile, token-based, and visibly active in both themes. Required styles:

```css
.settings-tabs {
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--border);
}

.settings-tab.router-link-active {
  color: var(--brand-700);
  background: var(--brand-50);
  border-bottom-color: var(--brand-600);
}
```

- [ ] **Step 3: Update account modals**

Wrap each `AccountSettings.vue` modal in `<Transition name="modal-fade">`. Convert submit/cancel buttons to `.btn btn-primary` and `.btn btn-secondary`. Use global input styles.

- [ ] **Step 4: Update user management modals and table**

In `UsersView.vue`, replace inline table attributes with `.table-wrap` and `.table`. Add transition wrappers around create/update password modals. Replace inline margin buttons with `.modal-actions`.

- [ ] **Step 5: Update form builder controls**

In `DocumentSchema.vue` and `HomeView.vue`, keep the logic intact but:
- Use `.panel` for each field editor.
- Replace inline `style` on visible controls with classes.
- Leave Word-copy table inline styles intact only where they intentionally affect copied document output.

- [ ] **Step 6: Update preview modal**

In `PreviewView.vue`, replace local `.modal` with global `.modal-overlay` and `.modal-content`, wrapped in `<Transition name="modal-fade">`.

- [ ] **Step 7: Build and commit**

Run: `npm run build`

Expected: build passes.

```bash
git add src/views/SettingsView.vue src/views/AccountSettings.vue src/views/UsersView.vue src/views/FcaDataView.vue src/views/DocumentGenerator.vue src/views/DocumentSchema.vue src/views/HomeView.vue src/views/PreviewView.vue
git commit -m "style: polish settings and form pages"
```

## Task 7: Final Verification And Responsive Review

**Files:**
- Review all modified files.

- [ ] **Step 1: Run formatter**

Run: `npm run format`

Expected: Prettier completes and only formats `src/`.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: Vite build completes successfully.

- [ ] **Step 3: Start dev server**

Run: `npm run dev -- --host 0.0.0.0`

Expected: Vite prints a local URL, usually `http://localhost:5173/`.

- [ ] **Step 4: Manual UI checklist**

Check these routes at desktop width, tablet width, and mobile width:
- `/login`: form is usable, text visible, loading state stable.
- `/`: dashboard cards and recent activity table fit without overlap.
- `/fcas`: filters, table, pagination are usable.
- `/documents`: `v-select` filters and table are visible in both themes.
- `/settings`: tabs scroll on mobile and active state is clear.
- `/settings/users`: create/update modals animate and fit mobile.
- `/settings/logs`: filters/table/pagination fit.
- `/gis-tools`: conversion modals animate and file inputs are readable.

- [ ] **Step 5: Theme checklist**

Use browser dev tools to emulate light and dark system theme. Confirm:
- Body, sidebar, cards, modals, inputs, selects, tables, toasts all switch colors.
- No black text on dark backgrounds.
- No white panels with invisible light text.
- Focus rings are visible.
- Disabled buttons/fields remain readable.

- [ ] **Step 6: Mobile menu checklist**

Confirm:
- Mobile topbar appears below 860px.
- Drawer opens and closes.
- Overlay closes drawer.
- Route navigation closes drawer.
- Desktop collapse state persists after reload.

- [ ] **Step 7: Commit verification fixes**

If formatter or manual review changed files:

```bash
git add src
git commit -m "style: finalize responsive UI polish"
```

## Self-Review

- Spec coverage: The plan covers mobile responsiveness, collapsible menu, shared component styling, system light/dark theme, text contrast, modal transitions, improved forms, login page, dashboard, data pages, settings, and remaining page cleanup.
- Placeholder scan: No `TBD`, `TODO`, or unspecified "handle later" items are used. Tasks name concrete files and expected behavior.
- Type consistency: Component/class names are consistent across tasks: `.app-page`, `.panel`, `.btn`, `.btn-primary`, `.btn-secondary`, `.field-control`, `.table-wrap`, `.modal-overlay`, `.modal-content`, and `modal-fade`.

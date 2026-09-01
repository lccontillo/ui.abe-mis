<template>
  <form @submit.prevent="submitForm" :class="['fca-form', { 'app-page': !editMode, 'modal-form-mode': editMode }]">
    <BreadcrumbNav
      v-if="!editMode"
      :items="[{ label: 'Home', to: '/' }, { label: 'FCAs', to: '/fcas' }, { label: 'New FCA' }]"
    />
    <!-- <TitleBar v-if="!editMode" title="New FCA Profile" /> -->

    <div class="form-sections-stack">
      <!-- General Information -->
      <section class="form-section panel">
        <div class="section-header">
          <h2 class="section-title">General Information</h2>
          <span class="section-badge">Core Details</span>
        </div>
        
        <div class="form-grid grid-2">
          <InputField
            v-model="form.general.name"
            :field="{ field_label: 'Name', properties: { required: true } }"
          />
          <InputField
            v-model="form.general.acronym"
            :field="{ field_label: 'Acronym', properties: {} }"
          />
        </div>

        <div class="form-grid grid-3">
          <DropdownField
            v-model="form.general.type"
            :field="{
              field_label: 'Type',
              properties: { options: ['Cooperative', 'Association'], multiple: false },
            }"
          />
          <InputField
            v-model="form.general.reg_no"
            :field="{ field_label: 'Registration No.', properties: {} }"
          />
          <InputField
            v-model="form.general.year_registered"
            :field="{ field_type: 'number', field_label: 'Year Registered', properties: {} }"
          />
        </div>

        <div class="form-grid grid-2">
          <InputField
            v-model="form.general.brgy"
            :field="{ field_label: 'Barangay', properties: {} }"
          />
          <InputField
            v-model="form.general.street"
            :field="{ field_label: 'Street / Zone', properties: {} }"
          />
        </div>

        <div class="form-grid grid-3">
          <InputField
            v-model="form.general.municipality"
            :field="{ field_label: 'Municipality', properties: {} }"
          />
          <InputField
            v-model="form.general.province"
            :field="{ field_label: 'Province', properties: {} }"
          />
          <InputField
            v-model="form.general.zip_code"
            :field="{ field_label: 'Zip Code', properties: {} }"
          />
        </div>

        <div class="form-grid grid-2">
          <CheckboxField
            v-model="form.general.major_commodity"
            :field="{
              field_label: 'Major Commodity',
              properties: {
                options: ['Rice', 'Corn', 'Peanut', 'Tobacco', 'High-value crops'],
              },
            }"
          />
          <InputField
            v-model="form.general.total_members"
            :field="{ field_type: 'number', field_label: 'Total Members', properties: {} }"
          />
        </div>

        <InputField
          v-model="form.general.business_operation"
          :field="{ field_label: 'Business Operation', properties: {} }"
        />
      </section>

      <!-- Organization Contact -->
      <section class="form-section panel">
        <div class="section-header">
          <h2 class="section-title">Organization Contact</h2>
        </div>
        <div class="form-grid grid-3">
          <InputField
            v-model="form.organization.landline"
            :field="{ field_label: 'Landline', properties: {} }"
          />
          <InputField
            v-model="form.organization.email"
            :field="{ field_label: 'Email', properties: {} }"
          />
          <InputField
            v-model="form.organization.website"
            :field="{ field_label: 'Website', properties: {} }"
          />
        </div>
        <InputField
          v-model="form.organization.repository"
          :field="{ field_label: 'Google Drive / Cloud Repository Link', properties: {} }"
        />
      </section>

      <!-- Officers -->
      <section class="form-section panel">
        <div class="section-header">
          <h2 class="section-title">Officers</h2>
          <button type="button" class="btn btn-secondary btn-sm" @click="addOfficer">
            + Add Officer
          </button>
        </div>

        <div class="dynamic-items-list">
          <div v-for="(officer, i) in form.officers" :key="i" class="item-card">
            <div class="item-card-header">
              <span class="item-number">Officer #{{ i + 1 }}</span>
              <button
                type="button"
                class="btn-item-remove"
                v-if="form.officers.length > 1"
                @click="removeOfficer(i)"
                title="Remove officer"
              >
                ✕ Remove
              </button>
            </div>
            <div class="form-grid grid-3">
              <InputField v-model="officer.name" :field="{ field_label: 'Full Name', properties: {} }" />
              <DropdownField
                v-model="officer.position"
                :field="{
                  field_label: 'Position',
                  properties: { options: ['Chairman', 'Vice Chairman', 'Treasurer', 'Secretary', 'Auditor', 'Manager', 'Member'], multiple: false },
                }"
              />
              <DropdownField
                v-model="officer.civil_status"
                :field="{
                  field_label: 'Civil Status',
                  properties: { options: ['Single', 'Married', 'Widowed', 'Separated'], multiple: false },
                }"
              />
            </div>
            <div class="form-grid grid-2">
              <DateInputField
                v-model="officer.birth_date"
                :field="{ field_label: 'Birth Date', properties: {} }"
              />
              <InputField
                v-model="officer.mobile_no"
                :field="{ field_label: 'Mobile No.', properties: {} }"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Board of Directors -->
      <section class="form-section panel">
        <div class="section-header">
          <h2 class="section-title">Board of Directors (BODs)</h2>
          <button type="button" class="btn btn-secondary btn-sm" @click="addBod">
            + Add Director
          </button>
        </div>

        <div class="bods-grid">
          <div v-for="(bod, i) in form.bods" :key="i" class="bod-row">
            <span class="bod-index">{{ i + 1 }}.</span>
            <div class="bod-input-wrapper">
              <InputField
                v-model="bod.name"
                :field="{ field_label: `Director Name`, properties: {} }"
              />
            </div>
            <button
              type="button"
              class="btn-icon-danger"
              v-if="form.bods.length > 1"
              @click="removeBod(i)"
              title="Remove director"
            >
              ✕
            </button>
          </div>
        </div>
      </section>

      <!-- Submit Actions -->
      <div class="form-actions">
        <button class="btn btn-primary" type="submit" :disabled="saving">
          {{ saving ? 'Saving...' : editMode ? 'Update FCA Profile' : 'Save FCA Profile' }}
        </button>
        <button class="btn btn-secondary" type="button" @click="$emit('close')" v-if="editMode">
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, ref, toRaw } from 'vue'
import { useToast } from '@/composables/useToast'
const { success, error, warning } = useToast()
import InputField from '@/components/InputField.vue'
import DropdownField from '@/components/DropdownField.vue'
import DateInputField from '@/components/DateInputField.vue'
import CheckboxField from '@/components/CheckboxField.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import TitleBar from '@/components/TitleBar.vue'
import { useRouter } from 'vue-router'
import { API_BASE } from '@/config/api'

const router = useRouter()
const saving = ref(false)

const props = defineProps({
  initialData: Object,
  editMode: Boolean,
})

const emit = defineEmits(['updated', 'close'])

const token = localStorage.getItem('token')

const form = reactive({
  general: {
    name: '',
    acronym: '',
    type: '',
    reg_no: '',
    year_registered: null,
    brgy: '',
    street: '',
    municipality: '',
    province: 'CAGAYAN',
    status: '',
    contact_number: '',
    email: '',
    website: '',
    facebook_page: '',
    latitude: '',
    longitude: '',
    major_commodity: '',
  },
  organization: {
    no_cluster: 0,
    no_male_members: 0,
    no_female_members: 0,
    with_youth_members: 0,
    with_ip_members: 0,
    with_pwd_members: 0,
    asset_size: '',
    assets_owned: '',
  },
  officers: [],
  bods: [],
})

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      const clone = JSON.parse(JSON.stringify(val))

      // Convert major_commodity back to array if it's a string
      if (typeof clone.general?.major_commodity === 'string') {
        clone.general.major_commodity = clone.general.major_commodity
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      }

      Object.assign(form.general, clone.general || {})
      Object.assign(form.organization, clone.organization || {})

      form.officers.splice(
        0,
        form.officers.length,
        ...(clone.officers && clone.officers.length
          ? clone.officers
          : [
              {
                name: '',
                position: '',
                civil_status: '',
                birth_date: '',
                mobile_no: '',
              },
            ]),
      )

      form.bods.splice(
        0,
        form.bods.length,
        ...(clone.bods && clone.bods.length
          ? clone.bods
          : [
              {
                name: '',
              },
            ]),
      )
    }
  },
  { immediate: true, deep: true },
)

function addOfficer() {
  form.officers.push({
    name: '',
    position: '',
    civil_status: '',
    birth_date: '',
    mobile_no: '',
  })
}

function removeOfficer(index) {
  if (form.officers.length > 1) {
    form.officers.splice(index, 1)
  }
}

function addBod() {
  form.bods.push({ name: '' })
}

function removeBod(index) {
  if (form.bods.length > 1) {
    form.bods.splice(index, 1)
  }
}

async function submitForm() {
  if (saving.value) return

  if (!form.general.name) {
    warning('Name is a required field.')
    saving.value = false
    return
  }

  saving.value = true

  try {
    let url = `${API_BASE}/add_fca`
    let method = 'POST'

    if (props.editMode && props.initialData?.general?.id) {
      url = `${API_BASE}/update_fca/${props.initialData.general.id}`
      method = 'PUT'
    }

    const payload = toRaw(form)
    payload.general = {
      ...payload.general,
      major_commodity: Array.isArray(payload.general.major_commodity)
        ? payload.general.major_commodity.join(', ')
        : payload.general.major_commodity || '',
    }

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (res.ok) {
      success(props.editMode ? 'FCA updated successfully' : 'Form submitted successfully')
      emit('updated')
      if (!props.editMode) {
        router.push('/fcas')
      }
    } else {
      error(data.message || 'Submission failed')
    }
  } catch (err) {
    console.error('Error:', err)
    error('Submission failed')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.fca-form {
  width: 100%;
  max-width: 100%;
  color: var(--text);
}

.modal-form-mode {
  padding: 0;
  max-width: 100%;
}

.form-sections-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.modal-form-mode .form-sections-stack {
  margin-top: 0;
}

.form-section {
  padding: 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--bg-elevated);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--heading);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-badge {
  font-size: 0.75rem;
  background: var(--brand-100);
  color: var(--brand-700);
  padding: 2px 8px;
  border-radius: 9999px;
  font-weight: 600;
}

.form-grid {
  display: grid;
  gap: 1rem;
}

.grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 768px) {
  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }
}

.dynamic-items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-card {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 160ms ease;
}

.item-card:hover {
  border-color: var(--border-strong);
}

.item-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed var(--border);
}

.item-number {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--brand-600);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.btn-item-remove {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--danger-strong);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.55rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 150ms ease;
}

.btn-item-remove:hover {
  background: var(--danger-soft, rgba(220, 38, 38, 0.1));
  border-color: var(--danger-strong);
}

.bods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.bod-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
}

.bod-index {
  font-weight: 700;
  color: var(--text-soft);
  font-size: 0.85rem;
  width: 24px;
}

.bod-input-wrapper {
  flex: 1;
}

:deep(.bod-input-wrapper .input-field) {
  margin-bottom: 0 !important;
}

:deep(.bod-input-wrapper .field-label) {
  display: none !important;
}

.btn-icon-danger {
  background: transparent;
  border: none;
  color: var(--text-soft);
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.35rem 0.5rem;
  border-radius: 4px;
  transition: all 150ms;
}

.btn-icon-danger:hover {
  color: var(--danger-strong);
  background: rgba(220, 38, 38, 0.12);
}

.btn-sm {
  min-height: 32px;
  padding: 0.25rem 0.75rem;
  font-size: 0.825rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 0;
  margin-top: 0.5rem;
}
</style>

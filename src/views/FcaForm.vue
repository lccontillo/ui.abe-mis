<template>
  <form @submit.prevent="submitForm" class="fca-form">
    <h1 class="form-title">{{ editMode ? 'Edit FCA Profile' : 'New FCA Profile' }}</h1>

    <section>
      <h2 class="section-title">General Information</h2>
      <div class="row">
        <InputField v-model="form.general.name" :field="{ field_label: 'Name', properties: {} }" />
        <InputField
          v-model="form.general.acronym"
          :field="{ field_label: 'Acronym', properties: {} }"
        />
      </div>
      <div class="row">
        <DropdownField
          v-model="form.general.type"
          :field="{
            field_label: 'Type',
            properties: { options: ['Cooperative', 'Association'], multiple: false },
          }"
        />
        <InputField
          v-model="form.general.reg_no"
          :field="{ field_label: 'Reg No', properties: {} }"
        />
        <InputField
          v-model="form.general.year_registered"
          :field="{ field_type: 'number', field_label: 'Year Registered', properties: {} }"
        />
      </div>
      <div class="row">
        <InputField
          v-model="form.general.brgy"
          :field="{ field_label: 'Barangay', properties: {} }"
        />
        <InputField
          v-model="form.general.street"
          :field="{ field_label: 'Street / Zone', properties: {} }"
        />
      </div>
      <div class="row">
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
      <div class="row">
        <CheckboxField
          v-model="form.general.major_commodity"
          :field="{
            field_label: 'Major Commodity',
            properties: {
              options: ['Rice', 'Corn', 'Peanut', 'Tobacco', 'High-value crops'],
            },
          }"
        />
        <!-- {{ form.general.major_commodity }} -->
        <InputField
          v-model="form.general.total_members"
          :field="{ field_label: 'Total Members', properties: {} }"
        />
      </div>
      <InputField
        v-model="form.general.business_operation"
        :field="{ field_label: 'Business Operation', properties: {} }"
      />
    </section>

    <section>
      <h2 class="section-title">Organization Contact</h2>
      <div class="row">
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
      <div class="row">
        <InputField
          v-model="form.organization.repository"
          :field="{ field_label: 'Google Drive Repository', properties: {} }"
        />
      </div>
    </section>

    <section>
      <h2 class="section-title">Officers</h2>
      <div v-for="(officer, i) in form.officers" :key="i" class="group-block">
        <div class="row">
          <InputField v-model="officer.name" :field="{ field_label: 'Name', properties: {} }" />
          <DropdownField
            v-model="officer.position"
            :field="{
              field_label: 'Position',
              properties: { options: ['Chairman', 'Treasurer', 'Secretary'], multiple: false },
            }"
          />
          <DropdownField
            v-model="officer.civil_status"
            :field="{
              field_label: 'Civil Status',
              properties: { options: ['Single', 'Married', 'Widowed'], multiple: false },
            }"
          />
        </div>
        <div class="row">
          <DateInputField
            v-model="officer.birth_date"
            :field="{ field_label: 'Birth Date', properties: {} }"
          />
          <InputField
            v-model="officer.mobile_no"
            :field="{ field_label: 'Mobile No', properties: {} }"
          />
        </div>
      </div>
      <button type="button" class="add-btn" @click="addOfficer">+ Add Officer</button>
    </section>

    <section>
      <h2 class="section-title">Board of Directors (BODs)</h2>
      <div v-for="(bod, i) in form.bods" :key="i" class="group-block">
        <InputField v-model="bod.name" :field="{ field_label: 'Name', properties: {} }" />
      </div>
      <button type="button" class="add-btn" @click="addBod">+ Add BOD</button>
    </section>

    <div class="submit-section">
      <button class="submit-btn" type="submit" :disabled="saving">
        {{ saving ? 'Saving...' : editMode ? 'Update FCA' : 'Submit FCA' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, toRefs, ref, toRaw } from 'vue'
import InputField from '@/components/InputField.vue'
import DropdownField from '@/components/DropdownField.vue'
import DateInputField from '@/components/DateInputField.vue'
import CheckboxField from '@/components/CheckboxField.vue'
import { useRouter } from 'vue-router'

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
    province: '',
    zip_code: '',
    major_commodity: [],
    total_members: null,
    business_operation: '',
  },
  organization: {
    landline: '',
    email: '',
    website: '',
    repository: '',
  },
  officers: [
    {
      name: '',
      position: '',
      civil_status: '',
      birth_date: '',
      mobile_no: '',
    },
  ],
  bods: [
    {
      name: '',
    },
  ],
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

function addBod() {
  form.bods.push({ name: '' })
}

async function submitForm() {
  if (saving.value) return // avoid double submission

  if (!form.general.name) {
    alert('Name is a required field.')
    saving.value = false
    return
  }

  saving.value = true

  try {
    let url = 'https://api-abealcala.duckdns.org/add_fca'
    let method = 'POST'

    if (props.editMode && props.initialData?.general?.id) {
      url = `https://api-abealcala.duckdns.org/update_fca/${props.initialData.general.id}`
      method = 'PUT'
    }

    // Clone and modify the form data
    const payload = toRaw(form)
    payload.general = {
      ...payload.general,
      major_commodity: payload.general.major_commodity.join(', '),
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
      alert(props.editMode ? 'FCA updated successfully' : 'Form submitted successfully')
      emit('updated')
    } else {
      alert(data.message || 'Submission failed')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Submission failed')
  } finally {
    saving.value = false
    if (!props.editMode) {
      router.push('/fcas') // Redirect to FCA list
    }
  }
}
</script>

<style scoped>
.fca-form {
  background: #fff;
  padding: 2rem;
  max-width: 960px;
  margin: auto;
}

.form-title {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: #1e4f24;
  border-bottom: 2px solid #cce4cd;
  padding-bottom: 0.5rem;
}

.section-title {
  font-size: 1.3rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #2e7d32;
  border-left: 4px solid #2e7d32;
  padding-left: 0.75rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.group-block {
  background: #f8f8f8;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.add-btn {
  background: #e6f4ea;
  border: none;
  color: #347a3d;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #d5eedd;
}

.submit-section {
  margin-top: 2rem;
  text-align: right;
}

.submit-btn {
  background: #2e7d32;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.submit-btn:hover {
  background: #256128;
}
</style>

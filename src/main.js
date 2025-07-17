import './assets/main.css'
import 'vue-select/dist/vue-select.css'
// main.js or main.ts
import { CarbonIconsVue } from '@carbon/icons-vue'
import Bee32 from '@carbon/icons-vue/es/bee/32'
import DonutLoader from './components/DonutLoader.vue' // adjust path as needed
import ToastPlugin from '@/plugins/toast.js'
import VueSelect from 'vue-select'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(CarbonIconsVue, {
  components: {
    Bee32,
  },
})
app.component('DonutLoader', DonutLoader)
app.component('v-select', VueSelect)
app.use(ToastPlugin)

app.use(createPinia())
app.use(router)

app.mount('#app')

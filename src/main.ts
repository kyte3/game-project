import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const themeConfigs = {
  dark: false,
  colors: {
      primary: '#079073',
      secondary: '#034d3d'
  }
}
const vuetify = createVuetify({
  components,
  directives,
  theme: {
      defaultTheme: 'themeConfigs',
      themes: {
          themeConfigs,
      }
  }
})



const app = createApp(App);
app.use(vuetify);
app.mount('#app');
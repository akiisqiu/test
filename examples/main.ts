import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.ts'
import eacon from '../src/index.ts'

import eaconComponent from 'eacon-components'
import 'eacon-components/index.css'

const app = createApp(App)

app.use(router)
app.use(eacon)
app.use(eaconComponent)

app.mount('#app')

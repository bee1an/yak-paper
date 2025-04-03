import { createApp } from 'vue'
import components from './components'
import './assets/normalize.css'
import 'virtual:uno.css'

import App from './App.vue'

const app = createApp(App)

app.use(components)

app.mount('#app')

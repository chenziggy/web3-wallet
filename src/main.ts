import { createApp } from 'vue'
import './style.css'
import { VueQueryPlugin } from 'vue-query'
import 'virtual:uno.css'
import './shared/common'
import {
  createRouter,
  createWebHistory,
  setupDataFetchingGuard,
} from 'vue-router/auto'
import { createPinia } from 'pinia'
import VHome from './pages/home/index.vue'
import App from './App.vue'

const pinia = createPinia()

const router = createRouter({
  history: createWebHistory(),
  extendRoutes: (routes) => {
    return [{ path: '/', component: VHome }, ...routes]
  },
})

setupDataFetchingGuard(router)

createApp(App)
  .use(pinia)
  .use(router)
  .use(VueQueryPlugin)
  .mount('#app')

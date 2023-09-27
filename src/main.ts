import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {VueQueryPlugin } from 'vue-query'
import 'virtual:uno.css'
import './shared/common'
import {
  createWebHistory,
  createRouter,
  setupDataFetchingGuard,
} from 'vue-router/auto'
import VHome from './pages/home/index.vue'


const router = createRouter({
  history: createWebHistory(),
  extendRoutes: (routes) => {
    return [{ path: '/', component: VHome }, ...routes]
  },
})

setupDataFetchingGuard(router)

createApp(App)
.use(router)
.use(VueQueryPlugin)
.mount('#app')

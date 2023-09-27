import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: "@/", replacement: "/src/" }],
  },
  plugins: [
    AutoImport({ 
      imports: [
        'vue',
        'pinia',
        VueRouterAutoImports,
        '@vueuse/core',
        {
          'vue-router/auto': ['useLink']
        }
      ]
    }),
    Components({ dts: true, resolvers: [VantResolver()]}),
    UnoCSS(),
    VueRouter(),
    vue()
  ],
})

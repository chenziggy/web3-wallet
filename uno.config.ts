import { defineConfig } from 'unocss'
import presetWind from '@unocss/preset-wind'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [
    presetWind(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  theme: {
    colors: {
      blue: '#1098fc',
      VBlack: '#24272a',
    },
  },
  shortcuts: {
    'btn': '!rounded-full !bg-blue !text-white !border-blue',
    'btn-transparent': '!rounded-full !bg-transparent !text-blue !border-blue',
  },
})

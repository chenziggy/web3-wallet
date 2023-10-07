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
    'input': '!w-full !box-border !mx-0 !bg-transparent !rounded !p-1.5',
  },
})

import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from '../src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    Unplugin({
      svgs: ['./static', './icons/svg/*.svg'],
      outputDir: 'assets',
      handleSvg({ svg, file }) {
        if (svg.viewBox.width > 100 || svg.viewBox.height > 100) {
          return {
            width: 24,
            height: 24,
          }
        }
        else if (file === 'select_menu_icon') {
          return {
            isColor: true,
          }
        }
        else if (file === 'all') {
          return {
            cssProps: {
              transform: 'scale(1.5)',
            },
          }
        }
      },
    }),
  ],
})

import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import dev from 'rollup-plugin-dev'
import Unplugin from '../dist/rollup'
export default defineConfig({
  input: './main.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
  },
  plugins: [
    typescript(),
    Unplugin(),
    dev({
      dirs: ['dist'],
      force: true,
      spa: true,
    }),
  ],
})

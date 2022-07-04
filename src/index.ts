import { createUnplugin } from 'unplugin'
import core from './core'
import type { Options } from './types'

export default createUnplugin<Options>((options) => {
  return {
    name: 'unplugin-svg2icon',
    enforce: 'pre',
    buildStart() {
      if (!options)
        return

      core(options)
    },
  }
})

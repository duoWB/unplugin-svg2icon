import { watch } from 'node:fs'
import { debounce } from 'throttle-debounce'

import type { BuildFun, LocalOptions } from '../types'

export default function (localOptions: LocalOptions, build: BuildFun) {
  const { svgPaths } = localOptions
  const buildDebounce = debounce(800, build)

  svgPaths.forEach((svgPath) => {
    watch(svgPath, { recursive: true }, (_event, name) => {
      if (name && name.length > 4 && name.slice(-4) === '.svg') {
        // TODO: 可以优化成修改单个文件
        buildDebounce(localOptions)
      }
    })
  })
}

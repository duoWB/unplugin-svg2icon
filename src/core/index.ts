import { existsSync, statSync } from 'node:fs'
import type { Options, Strings } from '../types'
import watchSvg from './watch'
import svgBuildCss from './build'

export default function (options: Options) {
  const { svgs } = options

  let watchSvgs: Strings = []
  if (!Array.isArray(svgs))
    watchSvgs = [svgs]
  else watchSvgs = svgs

  const svgPaths = watchSvgs.map((svgPath) => {
    const p = svgPath.replace('*.svg', '')
    if (existsSync(p) && statSync(p).isDirectory())
      return p

    return ''
  })
  const newOptions = { ...options, svgPaths }

  svgBuildCss(newOptions)

  watchSvg(newOptions, svgBuildCss)
}

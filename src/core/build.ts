import { writeFileSync } from 'node:fs'
import { encodeSvgForCss } from '@iconify/utils/lib/svg/encode-svg-for-css'
import {
  cleanupSVG,
  importDirectory,
  isEmptyColor,
  parseColors,
  runSVGO,
} from '@iconify/tools'
import type { ImportDirectoryFileEntry } from '@iconify/tools/lib/import/directory'
import type { LocalOptions } from '../types'

export default async function ({
  svgPaths,
  cssPrefix,
  handleSvg,
}: LocalOptions) {
  const svgFilePaths = new Map<string, ImportDirectoryFileEntry>()
  const missingSvg = new Set<string>()
  const iconSet = (
    await Promise.all(
      svgPaths.map(async (i) => {
        const res = await importDirectory(i, {
          keyword: (file) => {
            if (file.ext === '.svg') {
              svgFilePaths.set(file.file, file)
              missingSvg.add(file.file)
              return file.file
            }
          },
          ignoreImportErrors: false,
        })
        return res
      }),
    )
  ).at(0)
  let rootStr = ''
  let iconClass = ''
  await iconSet?.forEach(async (name, type) => {
    if (type !== 'icon')
      return

    const svg = iconSet.toSVG(name)
    if (!svg) {
      // Invalid icon
      iconSet.remove(name)
      return
    }
    missingSvg.delete(name)
    let handleResult
    const svgFilePath = svgFilePaths.get(name)
    if (svgFilePath && handleSvg) {
      handleResult = await handleSvg({
        ...svgFilePath,
        path:
          svgFilePath.path
          + svgFilePath.subdir
          + svgFilePath.file
          + svgFilePath.ext,
        cssPrefix,
        svg,
      })
    }

    // Clean up and optimise icons
    try {
      await cleanupSVG(svg)
      await parseColors(svg, {
        defaultColor: 'currentColor',
        callback: (_attr, colorStr, color) => {
          return !color || isEmptyColor(color) ? colorStr : 'currentColor'
        },
      })
      await runSVGO(svg)
    }
    catch (err) {
      // Invalid icon
      console.error(`Error parsing ${name}:`, err)
      iconSet.remove(name)
      return
    }

    // Update icon
    iconSet.fromSVG(name, svg)

    const prefix = handleResult?.cssPrefix || cssPrefix

    const iconName = `${prefix ? `${prefix}-` : ''}${name}`
    let width = handleResult?.width || svg.viewBox.width
    let height = handleResult?.height || svg.viewBox.height
    if (typeof width === 'number')
      width = `${width}px`
    if (typeof height === 'number')
      height = `${height}px`

    let dataUri = `data:image/svg+xml;utf8,${encodeSvgForCss(svg.toString())}}`
    if (handleResult?.transformType === 'base64') {
      dataUri = `data:image/svg+xml;base64,${Buffer.from(
        svg.toString(),
      ).toString('base64')}`
    }

    rootStr += `
      --${iconName}: url("${dataUri}");`

    if (handleResult?.isColor) {
      iconClass += `
      .${iconName} {
        background: var(--${iconName}) no-repeat;
        background-size: 100% 100%;
        background-color: transparent;
        width:  ${width}px;
        height: ${height}px;
      }
    `
    }
    else {
      iconClass += `
        .${iconName} {
          mask: var(--${iconName}) no-repeat;
          mask-size: 100% 100%;
          -webkit-mask: var(--${iconName}) no-repeat;
          -webkit-mask-size: 100% 100%;
          background-color: currentColor;
          display: inline-block;
          width:  ${width};
          height: ${height};
        }
      `
    }
  })
  console.log(`
total: ${svgFilePaths.size}
css-var-total: ${iconSet?.count()}
missingSvg: ${[...missingSvg].map(item => `${item}.svg`)}
`)

  writeFileSync(
    'icons.css',
    `:root{
      ${rootStr}
  }
    ${iconClass}
  `,
  )
}

import {
  cleanupSVG,
  importDirectory,
  isEmptyColor,
  parseColors,
  runSVGO,
} from '@iconify/tools'
import type { IconSet, SVG } from '@iconify/tools'
import type {
  CleanSvgHandle,
  GetHandleSvgResult,
  HandleSvgResult,
  LocalOptions,
  Strings,
  SvgFilePaths,
} from '../types'

export async function getAllIconSet(
  svgPaths: Strings,
  svgFilePaths: SvgFilePaths,
) {
  const allIconSets = await Promise.all(
    svgPaths.map(async (i) => {
      const res = await importDirectory(i, {
        keyword: (file) => {
          if (file.ext === '.svg') {
            svgFilePaths.set(file.file, file)
            return file.file
          }
        },
        ignoreImportErrors: false,
      })
      return res
    }),
  )
  return allIconSets
}

export async function getHandleSvgResult(
  svgFilePaths: SvgFilePaths,
  { handleSvg, cssPrefix }: LocalOptions,
  svgName: string,
  svg: SVG,
): Promise<GetHandleSvgResult> {
  let handleResult: HandleSvgResult | undefined
  const svgFilePath = svgFilePaths.get(svgName)
  if (svgFilePath && handleSvg) {
    const { path, subdir, file, ext } = svgFilePath
    handleResult = await handleSvg({
      ...svgFilePath,
      svgPath: path + subdir + file + ext,
      cssPrefix,
      svg,
    })
  }

  const prefix = handleResult?.cssPrefix || cssPrefix
  const iconName = `${prefix ? `${prefix}-` : ''}${svgName}`
  let width = handleResult?.width || svg.viewBox.width
  let height = handleResult?.height || svg.viewBox.height
  if (typeof width === 'number')
    width = `${width}px`
  if (typeof height === 'number')
    height = `${height}px`
  return {
    ...handleResult,
    prefix,
    width,
    height,
    iconName,
  }
}

export async function clearSvg(iconSet: IconSet, handler: CleanSvgHandle) {
  await iconSet.forEach(async (name, type) => {
    if (type !== 'icon')
      return

    const svg = iconSet.toSVG(name)
    if (!svg) {
      // Invalid icon
      iconSet.remove(name)
      return
    }

    await handler(name, svg)

    // Clean up and optimise icons
    try {
      await cleanupSVG(svg)
      // await parseColors(svg, {
      //   defaultColor: 'currentColor',
      //   callback: (_attr, colorStr, color) => {
      //     return !color || isEmptyColor(color) ? colorStr : 'currentColor'
      //   },
      // })
      runSVGO(svg)
    }
    catch (err) {
      // Invalid icon
      console.error(`Error parsing ${name}:`, err)
      iconSet.remove(name)
      return
    }

    // Update icon
    iconSet.fromSVG(name, svg)
  })
}

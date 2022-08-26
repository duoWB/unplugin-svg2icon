import { writeFileSync } from 'node:fs'
import { ensureDirSync } from 'fs-extra'
import type { ImportDirectoryFileEntry } from '@iconify/tools/lib/import/directory'
import type { LocalOptions, Strings } from '../types'
import encodeSvg from './encodeSvg'
import { clearSvg, getAllIconSet, getHandleSvgResult } from './utils'

export default async function (params: LocalOptions) {
  const { svgPaths, outputDir } = params
  // save svg fileInfo
  const svgFilePaths = new Map<string, ImportDirectoryFileEntry>()
  const allIconSet = await getAllIconSet(svgPaths, svgFilePaths)

  let cssVars = ''
  let cssContents = ''
  const cssIconNames: Strings = []

  await Promise.all(
    allIconSet.map(async (iconSet) => {
      await clearSvg(iconSet, async (name, svg) => {
        const handleResult = await getHandleSvgResult(
          svgFilePaths,
          params,
          name,
          svg,
        )

        const { cssContent, cssVar } = encodeSvg(handleResult, svg)
        cssVars += `
        ${cssVar}
        `

        cssContents += cssContent
        cssIconNames.push(handleResult.iconName)
      })
    }),
  )

  let outputCssPath = 'icons.css'
  let outputHtmlPath = 'index.html'
  if (outputDir) {
    ensureDirSync(outputDir)
    outputCssPath = `${outputDir}/${outputCssPath}`
    outputHtmlPath = `${outputDir}/${outputHtmlPath}`
  }

  writeFileSync(
    outputCssPath,
    `:root{
      ${cssVars}
  }
    ${cssContents}
  `,
  )
  writeFileSync(
    outputHtmlPath,
    `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./icons.css">
    <title>Document</title>
  </head>
  <body>
  
${cssIconNames.map(name => `<i class="${name}"></i>`).join('')}
  </body>
  </html>`,
  )
}

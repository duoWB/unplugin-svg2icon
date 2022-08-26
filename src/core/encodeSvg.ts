import type { SVG } from '@iconify/tools'
import { encodeSvgForCss } from '@iconify/utils'
import type { GetHandleSvgResult } from '../types'

export default function (
  {
    transformType,
    iconName,
    isColor,
    width,
    height,
    cssProps,
  }: GetHandleSvgResult,
  svg: SVG,
) {
  const c = encodeSvgForCss(svg.toString())
  let dataUri = `data:image/svg+xml;utf8,${c}`
  if (transformType === 'base64') {
    dataUri = `data:image/svg+xml;base64,${Buffer.from(svg.toString()).toString(
      'base64',
    )}`
  }
  const cssVar = `--${iconName}: url("${dataUri}");`
  const moreCssProps = cssProps
    ? Object.keys(cssProps)
      .map(cssKey => `${cssKey}:${cssProps[cssKey]};`)
      .join()
    : ''
  let cssContent = `
  .${iconName} {
    mask: var(--${iconName}) no-repeat;
    mask-size: 100% 100%;
    -webkit-mask: var(--${iconName}) no-repeat;
    -webkit-mask-size: 100% 100%;
    background-color: currentColor;
    display: inline-block;
    width:  ${width};
    height: ${height};
    ${moreCssProps}
  }
`
  if (isColor) {
    cssContent = `
      .${iconName} {
        background: var(--${iconName}) no-repeat;
        background-size: 100% 100%;
        background-color: transparent;
        display: inline-block;
        width:  ${width};
        height: ${height};
        ${moreCssProps}
      }
    `
  }
  return {
    cssVar,
    cssContent,
  }
}

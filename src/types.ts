import type { SVG } from '@iconify/tools'
import type { ImportDirectoryFileEntry } from '@iconify/tools/lib/import/directory'
import type { IconCustomizations } from '@iconify/utils/lib/loader/types'

export type Strings = string[]
export type ss = Strings | string
export type Awaitable<T> = T | PromiseLike<T>

export type HandleSvgParams = {
  path: string
  svg: SVG
  cssPrefix?: string
} & ImportDirectoryFileEntry

export interface HandleSvgResult {
  /** icon width
   *
   * If it is a number, the unit is px
   * @example
   *  width: 10
   *  width: '1.5em'
   */
  width?: number | string
  /** icon height  */
  height?: number | string
  /** css var prefix  */
  cssPrefix?: string
  /**
   * transform type
   *
   * @default svg
   */
  transformType?: 'base64' | 'svg'
  /** is colorful */
  isColor?: boolean
}

export interface Options {
  svgs: ss
  customizations?: IconCustomizations
  cssPrefix?: string
  outputDir?: string
  handleSvg?: (svgInfo: HandleSvgParams) => Awaitable<HandleSvgResult>
}
export type LocalOptions = Options & {
  svgPaths: Strings
}

export type BuildFun = (options: LocalOptions) => Promise<void>

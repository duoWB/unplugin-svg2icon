# unplugin-svg2icon

将svg转换成css图标




## 安装

```bash
npm i unplugin-svg2icon
```

## 使用
<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Svg2icon from 'unplugin-svg2icon/vite'

export default defineConfig({
  plugins: [
    Svg2icon({ /* options */ }),
  ],
})
```

Example: [`playground/`](./playground/vite.config.ts)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import Starter from 'unplugin-svg2icon/rollup'

export default {
  plugins: [
    Starter({ /* options */ }),
  ],
}
```

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-svg2icon/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default {
  buildModules: [
    ['unplugin-svg2icon/nuxt', { /* options */ }],
  ],
}
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-svg2icon/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>


## 参数
`svgs`: svg 存放地址

`outputDir`: 生成的`icons.css、index.html`路径，默认是项目根地址

`handleSvg`: svg 处理方法，可以在这里自定义操作

`cssPrefix`: 生成css的前缀

## options 示例
``` 
{
  svgs: ['./static', './icons/svg/*.svg'],
  outputDir: 'assets',
  cssPrefix: 'dd',
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
    else if (path.includes('static/')) {
      return {
        cssPrefix: 'static',
      }
    }
  },
}
```

## 感谢

 - [unplugin](https://github.com/unjs/unplugin)
 - [unocss](https://github.com/unocss/unocss)
 - [iconify/tools](https://github.com/iconify/tools)
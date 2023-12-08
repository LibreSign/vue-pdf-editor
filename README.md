# xcc-pdf-editor

- power by vue2
- thanks https://github.com/ShizukuIchi/pdf-editor
- thanks https://github.com/ndinhquan1998/vue-pdf-editor-module

# npm
https://www.npmjs.com/package/xcc-pdf-editor

# DEMO

[xcc-pdf-editor](https://llanc.github.io/xcc-pdf-editor/)

# How to use

- package.json add dependencies and install / npm i xcc-pdf-editor
- main.js imports and Vue.use
- Specify the loader of makeTextPDF.min.js in the Webpack configuration as file-loader

``` js
    {
          test: /makeTextPDF\.min\.js$/,
          loader: 'file-loader'
    }
```

## eg

```vue
<XccPdfEditor
    width="100%"
    height="100%"
    :show-choose-file-btn="true" 
    :show-customize-editor="true"
    :show-customize-editor-add-text="true"
    :show-customize-editor-add-img="true"
    :show-customize-editor-add-draw="true"
    :show-line-size-select = 'false'
    :show-font-size-select= 'false'
    :show-font-select="false"
    :show-rename="true"
    :show-save-btn="false"
    :save-to-upload="true"
    :init-file-src="'【pdf url】'" 
    :init-file-name="initFileName"
    :init-text-fields = "【text array】"
    :init-image-urls = "【image url array】"
    :init-image-scale = "0.2"
    :seal-image-show="true"
    :seal-image-hidden-on-save="true"
    @onSave2Upload="【save callback】"
/>
```

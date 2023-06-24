# xcc-pdf-editor

- power by vue2
- thanks https://github.com/ShizukuIchi/pdf-editor
- thanks https://github.com/ndinhquan1998/vue-pdf-editor-module

## 引用项目需添加依赖
```json
"open": "^8.4.0",
"pdf-lib": "^1.4.0",
"pdfjs-dist": "^2.3.200",
"downloadjs": "^1.4.7",
"postcss": "^8.4.18",
"postcss-load-config": "^4.0.1",
"tailwindcss": "^3.2.1"
```

## eg
```vue
    <XccPdfEditor
    :show-choose-file-btn="true"
    :show-customize-editor="true"
    :show-rename="true"
    :show-save-btn="false"
    :load-default-file="false"    <!--is a sample file-->
    :init-file-src="'【pdf url】'"   
    :init-text-fields = "【text array】"
    :init-image-urls = "【image url array】"
    :save-to-upload="true"  <!--false to download; true to callback-->
    @onSave2Upload="【save callback】"  
>
</XccPdfEditor>
```

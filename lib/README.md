# xcc-pdf-editor

- power by vue2
- thanks https://github.com/ShizukuIchi/pdf-editor
- thanks https://github.com/ndinhquan1998/vue-pdf-editor-module

eg:
```vue
    <XccPdfEditor
    :show-choose-file-btn="true"
    :show-customize-editor="true"
    :show-rename="true"
    :load-default-file="false"    <!--is a sample file-->
    :init-file-src="'【pdf url】'"   
    :init-text-fields = "【text array】"
    :init-image-urls = "【image url array】"
    :save-to-upload="true"  <!--false to download; true to callback-->
    @onSave2Upload="【save callback】"  
>
</XccPdfEditor>
```

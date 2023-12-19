# vue-pdf-editor

- power by vue2
- thanks https://github.com/llanc/xcc-pdf-editor
- thanks https://github.com/ShizukuIchi/pdf-editor
- thanks https://github.com/ndinhquan1998/vue-pdf-editor-module

# Sample

https://www.npmjs.com/package/@libresign/vue-pdf-editor

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
    >
    </XccPdfEditor>

```

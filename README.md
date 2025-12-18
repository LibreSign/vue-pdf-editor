# vue-pdf-editor

- power by vue2
- thanks https://github.com/ShizukuIchi/pdf-editor
- thanks https://github.com/ndinhquan1998/vue-pdf-editor-module
- thanks https://github.com/llanc/xcc-pdf-editor

# npm
https://www.npmjs.com/package/@libresign/vue-pdf-editor

# DEMO

[vue-pdf-editor](https://libresign.github.io/vue-pdf-editor/)

# How to use

- package.json add dependencies and install / npm i @libresign/vue-pdf-editor
- main.js imports and Vue.use

## eg

```js
<VuePdfEditor
    width="100%" <!--Component size default 100%-->
    height="100%" <!--Component size default 100%-->
    :show-choose-file-btn="true"  <!--Display file Select button default FALSE-->
    :show-customize-editor="true"  <!--Display the custom editing column default TRUE-->
    :show-customize-editor-add-text="true" <!--Add text default TRUE-->
    :show-customize-editor-add-img="true"  <!--Add a picture default TRUE-->
    :show-customize-editor-add-draw="true"  <!--Add the handwriting default TRUE-->
    :show-line-size-select = 'false' <!--Select the default TRUE of the line spacing-->
    :show-font-size-select= 'false' <!--Select the default TRue-->
    :show-font-select="false"   <!--Select the default true font-->
    :show-rename="true"   <!--Show the rename column default TRUE (hidden when multiple PDFs)-->
    :show-save-btn="false"  <!--Show the saving button default TRUE-->
    :save-to-upload="true"  <!--False directly download; TRUE trigger onsave2upload event default FALSe->
    :init-files="[File, File, ...]"   <!--Array of File objects to initialize with-->
    :init-file-names="['name1.pdf', 'name2.pdf', ...]" <!--Array of file names corresponding to initFiles-->
    :init-text-fields = "【text array】"  <!--Initialized text array-->
    :init-image-urls = "【image url array】"   <!--Initialized picture array-->
    :init-image-scale = "0.2" <!--The zoom level of the initialized picture defaults to 0.2 times the original size-->
    :seal-image-show="true" <!--Whether to show the signed example of the default FALSE-->
    :seal-image-hidden-on-save="true" <!--Whether the signed example is hidden by the default FALSE when saving-->
    :initial-scale="1.5" <!--Initial zoom level (1 = 100%, 1.5 = 150%) default 1-->
    :show-page-footer="true" <!--Show page footer with filename and page count default TRUE-->
    :page-count-format="'{currentPage} of {totalPages}'" <!--Page count format with {currentPage} and {totalPages} placeholders-->
    @scale-changed="onScaleChanged" <!--Emitted when zoom level changes-->
    @pdf-editor:ready="onPdfReady" <!--Emitted when PDF is fully loaded and ready-->
    @onSave2Upload="【save callback】"  <!--Save the callback load: PDFBYTES and FILENAME-->
/>
```

## Public API

### `addObjectToPage(object, pageIndex, docIndex)`
```js
this.$refs.vuePdfEditor.addObjectToPage(object, 0)
```

### `getAllObjects(docIndex)`
Returns objects with `normalizedCoordinates` for PDF generation.
```js
const objects = this.$refs.vuePdfEditor.getAllObjects()
```


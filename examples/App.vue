<template>
  <div id="app">
      <VuePdfEditor
          ref="vuePdfEditor"
          width="100%"
          height="100%"
          :show-choose-file-btn="true"
          :show-customize-editor="true"
          :show-customize-editor-add-text="true"
          :show-customize-editor-add-img="true"
          :show-customize-editor-add-draw="true"
          :show-line-size-select = 'true'
          :show-font-size-select= 'true'
          :show-font-select="true"
          :show-rename="true"
          :show-save-btn="true"
          :init-files="initFiles"
          :init-file-names="initFileNames"
          :init-text-fields = "this.textFields"
          :init-image-urls = "this.imageUrls"
          :init-image-scale = "1"
          :save-to-upload="false"
          :seal-image-show="true"
          :seal-image-hidden-on-save="false"
          :show-page-footer="true"
          :page-count-format="'{currentPage} of {totalPages}'"
          @onSave2Upload="save2Upload"
      >
      </VuePdfEditor>

  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      initFileNames: ['test.pdf'],
      initFiles: [],
      textFields: ['initial text'],
      imageUrls: [],
    }
  },
  methods:{
    save2Upload(payload){
      console.log('PDF saved:', payload.fileName);
      console.log('PDF bytes:', payload.pdfBytes);
      console.log('Seal info:', payload.sealInfo);
    }
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
}
</style>

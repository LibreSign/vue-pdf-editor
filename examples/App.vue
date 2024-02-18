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
          :show-pagination="true"
          :show-font-select="true"
          :show-rename="true"
          :show-save-btn="true"
          :init-file-src="initFile"
          :init-file-name="initFileName"
          :init-text-fields = "this.textFields"
          :init-image-urls = "this.imageUrls"
          :init-image-scale = "1"
          :save-to-upload="false"
          :seal-image-show="true"
          :seal-image-hidden-on-save="false"
          @onSave2Upload="save2Upload"
      >
      <template #pagination="{ pages, currentPage, onPageChange }">
        <ul class="inline-flex">
          <li @click="onPageChange(currentPage-1)">previous</li>
          <p>{{ currentPage +1}}/{{ pages }}</p>
          <li @click="onPageChange(currentPage+1)">next</li>
        </ul>
      </template>
      </VuePdfEditor>

  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      initFileName: 'test.pdf',
      initFile :'',
      textFields: ['initial text'],
      imageUrls: [],
    }
  },
  methods:{
    save2Upload(payload){
      console.log(payload.pdfBytes);
      console.log(payload.fileName);
      console.log(payload.sealInfo);
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

<template>
  <div id="app">
    <button @click="btnClick">保存</button>
      <XccPdfEditor
          ref="xccPdfEditor"
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
          :show-save-btn="true"
          :load-default-file="false"
          :init-file-src="initFile"
          :init-file-name="initFileName"
          :init-text-fields = "this.textFields"
          :init-image-urls = "this.imageUrls"
          :init-image-scale = "1"
          :save-to-upload="false"
          @onSave2Upload="save2Upload"
      >
      </XccPdfEditor>

  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      initFileName: '测试pdf.pdf',
      initFile :'',
      textFields: ['加了卡刷点卡商品点卡商品'],
      imageUrls: [
          'https://lh3.googleusercontent.com/a/AAcHTtfoMRrou6KGLaZ2ZxMRDVaJ8BppZsBCpcnCpjDEdEr2TPDK=s83-c-mo'
      ],
    }
  },
  methods:{
    btnClick(){
      this.$refs.xccPdfEditor.savePDF();
    },
    save2Upload(payload){
      console.log(payload.pdfBytes);
      console.log(payload.fileName);
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
  color: #2c3e50;
}
</style>

<template>
  <div id="app">
    <button @click="btnClick">保存</button>
    <div style="width: 900px;height: 800px;margin: 0 auto;overflow: hidden;position: relative;">
      <XccPdfEditor
          ref="xccPdfEditor"
          :show-choose-file-btn="true"
          :show-customize-editor="true"
          :show-rename="true"
          :show-save-btn="true"
          :load-default-file="false"
          :init-file-src="initFile"
          :init-text-fields = "this.textFields"
          :init-image-urls = "this.imageUrls"
          :save-to-upload="true"
          @onSave2Upload="save2Upload"
      >
      </XccPdfEditor>
    </div>

  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      initFile :'https://api48.ilovepdf.com/v1/download/yxp70b066dj82jy2gt7n8jljfks1wzlnw7hngm5t8hz0y2nf370rgg3rfbrn1pn839z5rzbvqjvsnrzA4s7w5bqw1A4zxr2vczpsfg5zfn6yjql7yzg6Azzthlbmwd5p51xAvpgmxsw5zc5tv7rnjkq9Am63fysht56xc94w5tmvqf1jdgtq',
      textFields: ['加了卡刷点卡商品点卡商品','接口连接\n加哦加哦加哦i解耦','尽量靠\n近佛啤酒哦\nIP'],
      imageUrls: [
          'https://qrstyle-api.cli.im/create/down?code_tplid=711016192&code_type=3&time=1687740518&publickey=348b2abd23fc3cbb0b7ab764905124a2&cvid=882458353&fkey=1_882458353_171_85_3_711016192_f5e65f77baa2b03c8bc1e36aa9cc3d81.png&file_name=2023020201020121'
      ],
    }
  },
  methods:{
    btnClick(){
      this.$refs.xccPdfEditor.savePDF();
    },
    save2Upload(payload){
      console.log(payload.pdfBytes);
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

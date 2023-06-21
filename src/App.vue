<template>
  <div id="app">
    <button @click="btnClick">保存</button>
    <XccPdfEditor
        ref="xccPdfEditor"
        :show-choose-file-btn="true"
        :show-customize-editor="true"
        :show-rename="true"
        :show-save-btn="true"
        :load-default-file="false"
        :init-file-src="''"
        :init-text-fields = "this.textFields"
        :init-image-urls = "this.imageUrls"
        :save-to-upload="true"
        @onSave2Upload="save2Upload"
    >
    </XccPdfEditor>
  </div>
</template>

<script>
import XccPdfEditor from './components/XccPdfEditor.vue'

export default {
  name: 'App',
  components: {
    XccPdfEditor
  },
  data(){
    return {
      textFields: ['加了卡刷点卡商品点卡商品','接口连接\n加哦加哦加哦i解耦','尽量靠\n近佛啤酒哦\nIP'],
      imageUrls: [
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

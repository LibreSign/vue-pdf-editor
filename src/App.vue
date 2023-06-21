<template>
  <div id="app">
    <PdfEditor
        :show-choose-file-btn="true"
        :show-customize-editor="true"
        :show-rename="false"
        :load-default-file="true"
        :init-file-src="'http://10.110.96.23:30080/WebDiskServer/doc?token=725359685334305f4f6276724f42326c784233416c346c325a45747667375a59343692ec10c0d6f942ac67c5&appCode=INSPUR-DZZW-TYSP&doc_id=9887'"
        :init-text-fields = "this.textFields"
        :init-image-urls = "this.imageUrls"
        :save-to-upload="false"
    >
    </PdfEditor>
  </div>
</template>

<script>
import PdfEditor from './components/PdfEditor.vue'

export default {
  name: 'App',
  components: {
    PdfEditor
  },
  data(){
    return {
      textFields: ['你好，这是回家等哈是否哈斯哦怕哈送到哈怂i的环境','你好，这是回家等哈是\n否哈斯哦怕哈送到哈怂i的环境','你好，这是回家等哈是\n否哈斯哦怕哈送到哈怂i的环境'],
      imageUrls: [
        'http://10.110.96.23:30080/WebDiskServer/doc?token=5636617548302f37375166795f2f56435068355a4a4371334f59754a5167636b3973838b0bf8fae7188b38c5&appCode=INSPUR-DZZW-TYSP&doc_id=9886&type=thumbnail',
        'http://10.110.96.23:30080/WebDiskServer/doc?token=73513376516a397a597853336566576469634658394f4c38794f2f5a74796c7a6466a1b321c4d6f007b512c5&appCode=INSPUR-DZZW-TYSP&doc_id=9888&type=thumbnail'],
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

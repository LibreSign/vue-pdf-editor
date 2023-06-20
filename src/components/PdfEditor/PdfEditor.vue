<template>
  <InAppEditor
    :show-choose-file-btn="true"
    :show-customize-editor="false"
    :show-rename="true"
    :load-default-file="false"
    :init-file-src="'https://raw.githubusercontent.com/pdf-association/pdf20examples/master/pdf20-utf8-test.pdf'"
    :init-text-fields = "this.textFields"
  >
  </InAppEditor>
</template>

<script>
import InAppEditor from "@/components/InAppEditor.vue";

export default {
  name: "PdfEditor",
  components: {InAppEditor},
  data(){
    return {
      textFields: ['你好','谢谢'],
    }
  }
}
</script>

<style scoped>

</style>
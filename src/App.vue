<template>
  <div id="app">
    <PdfEditor></PdfEditor>
  </div>
</template>

<script>
import PdfEditor from './components/PdfEditor/PdfEditor.vue'

export default {
  name: 'App',
  components: {
    PdfEditor
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

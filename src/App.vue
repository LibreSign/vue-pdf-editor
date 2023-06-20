<template>
  <div id="app">
    <InAppEditor msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import InAppEditor from './components/InAppEditor.vue'

export default {
  name: 'App',
  components: {
    InAppEditor
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

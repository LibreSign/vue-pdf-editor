<template>
  <canvas ref="canvas" />
</template>

<script>
export default {
  name: "PDFPage",
  props: ["page"],
  data() {
    return {
      // canvas:null,
      // width:null,
      // height:null,
      clientWidth: null,
      scale: 1,
    };
  },
  mounted() {
    this.render();
  },
  methods: {
    getCanvasMeasurement() {
      return {
        canvasWidth: this.$refs.canvas.width,
        canvasHeight: this.$refs.canvas.height,
      };
    },
    measure() {
      this.$emit("onMeasure", {
        scale: this.scale,
      });
    },
    async render() {
      const _page = await this.page;
      let canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");
      const viewport = _page.getViewport({
        scale: this.scale,
        rotation: 0,
      });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await _page.render({
        canvasContext: context,
        viewport,
      }).promise;
      this.measure();
      window.addEventListener("resize", this.measure);
    },
  },
};
</script>

<style scoped></style>

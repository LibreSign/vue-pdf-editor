<template>
  <!--  <div-->
  <!--      class="absolute left-0 top-0 select-none"-->
  <!--      :style="{width: `${width + dw}px`,height: `${(height + dh)}px`,transform: `translate(${x + dx}px, ${y + dy}px)`}">-->
  <div
      class="absolute left-0 top-0 select-none"
      :style="{
			width: `${width + dw}px`,
			height: `${Math.round((width + dw) / ratio)}px`,
			transform: `translate(${x + dx}px, ${y + dy}px)`,
		}"
  >
    <div
        class="absolute w-full h-full cursor-grab"
        :class="[
				operation === 'move' ? 'cursor-grabbing' : '',
				operation ? 'operation' : '',
			]"
        @mousedown="handlePanStart"
        @touchstart="handlePanStart"
    >
      <!--      <div-->
      <!--          data-direction="left"-->
      <!--          class="absolute border-dashed border-gray-600 h-full w-1 left-0 top-0 border-l cursor-ew-resize"/>-->
      <!--      <div-->
      <!--          data-direction="top"-->
      <!--          class="absolute border-dashed border-gray-600 w-full h-1 left-0 top-0 border-t cursor-ns-resize"/>-->
      <!--      <div-->
      <!--          data-direction="bottom"-->
      <!--          class="absolute border-dashed border-gray-600 w-full h-1 left-0 bottom-0 border-b cursor-ns-resize"/>-->
      <!--      <div-->
      <!--          data-direction="right"-->
      <!--          class="absolute border-dashed border-gray-600 h-full w-1 right-0 top-0 border-r cursor-ew-resize"/>-->
      <div
          data-direction="left-top"
          class="absolute cursor-nwse-resize transform selector"
          :style="{ top: '0%', left: '0%' }"
      />
      <div
          data-direction="right-top"
          class="absolute cursor-nesw-resize transform selector"
          :style="{ top: '0%', left: '100%' }"
      />
      <div
          data-direction="left-bottom"
          class="absolute cursor-nesw-resize transform selector"
          :style="{ top: '100%', left: '0%' }"
      />
      <div
          data-direction="right-bottom"
          class="absolute cursor-nwse-resize transform selector"
          :style="{ top: '100%', left: '100%' }"
      />
    </div>
    <div
        class="absolute cursor-pointer transform delete"
        :style="{ top: '0%', left: '50%' }"
        @click="onDelete"
    >
      <img class="w-full h-full" src="/delete.svg" alt="delete object" />
    </div>
    <canvas
        ref="imgCanvas"
        class="w-full h-full border border-gray-400 border-dashed"
    />
  </div>
</template>

<script>
import itemEventsMixin from "./ItemEventsMixin";

export default {
  name: "ImageComponent",
  mixins: [itemEventsMixin],
  props: [
    "payload",
    "file",
    "width",
    "height",
    "originWidth",
    "originHeight",
    "x",
    "y",
    "pageScale",
  ],
  data() {
    return {
      startX: null,
      startY: null,
      canvas: null,
      operation: "",
      directions: [],
      dx: 0,
      dy: 0,
      dw: 0,
      dh: 0,
    };
  },
  computed: {
    ratio() {
      return this.originWidth / this.originHeight;
    },
  },
  watch: {
    async file(value) {
      value && (await this.render());
    },
  },
  async mounted() {
    await this.render();
  },
  methods: {
    async render() {
      // use canvas to prevent img tag's auto resize
      const canvas = this.$refs.imgCanvas;
      canvas.width = this.originWidth;
      canvas.height = this.originHeight;
      canvas.getContext("2d").drawImage(this.payload, 0, 0);
      let scale = 1;
      const MAX_TARGET = 500;
      if (this.width > MAX_TARGET) {
        scale = MAX_TARGET / this.width;
      }
      if (this.height > MAX_TARGET) {
        scale = Math.min(scale, MAX_TARGET / this.height);
      }
      this.$emit("onUpdate", {
        width: this.width * scale,
        height: this.height * scale,
      });
      if (
          !["image/jpeg", "image/png", "image/webp"].includes(
              this.file.type,
          )
      ) {
        canvas.toBlob((blob) => {
          this.$emit("onUpdate", {
            file: blob,
          });
        });
      }
    },
    handlePanMove(event) {
      let coordinate;
      if (event.type === "mousemove") {
        coordinate = this.handleMousemove(event);
      }
      if (event.type === "touchmove") {
        coordinate = this.handleTouchmove(event);
      }
      if (!coordinate) return console.log("ERROR");

      const _dx = (coordinate.detail.x - this.startX) / this.pageScale;
      const _dy = (coordinate.detail.y - this.startY) / this.pageScale;
      if (this.operation === "move") {
        this.dx = _dx;
        this.dy = _dy;
      } else if (this.operation === "scale") {
        if (this.directions.includes("left")) {
          this.dx = _dx;
          this.dw = -_dx;
        }
        if (this.directions.includes("top")) {
          this.dy = _dy;
          this.dh = -_dy;
        }
        if (this.directions.includes("right")) {
          this.dw = _dx;
        }
        if (this.directions.includes("bottom")) {
          this.dh = _dy;
        }
      }
    },

    handlePanEnd(event) {
      let coordinate;
      if (event.type === "mouseup") {
        coordinate = this.handleMouseup(event);
      }
      if (event.type === "touchend") {
        coordinate = this.handleTouchend(event);
      }
      if (!coordinate) return console.log("ERROR");
      if (this.operation === "move") {
        this.$emit("onUpdate", {
          x: this.x + this.dx,
          y: this.y + this.dy,
        });
        this.dx = 0;
        this.dy = 0;
      } else if (this.operation === "scale") {
        this.$emit("onUpdate", {
          x: this.x + this.dx,
          y: this.y + this.dy,
          width: this.width + this.dw,
          height: Math.round((this.width + this.dw) / this.ratio),
        });
        this.dx = 0;
        this.dy = 0;
        this.dw = 0;
        this.dh = 0;
        this.directions = [];
      }
      this.operation = "";
    },
    handlePanStart(event) {
      let coordinate;
      if (event.type === "mousedown") {
        coordinate = this.handleMousedown(event);
      }
      if (event.type === "touchstart") {
        coordinate = this.handleTouchStart(event);
      }
      if (!coordinate) return console.log("ERROR");

      this.startX = coordinate.detail.x;
      this.startY = coordinate.detail.y;
      if (coordinate.detail.target === event.currentTarget) {
        return (this.operation = "move");
      }
      this.operation = "scale";
      this.directions =
          coordinate.detail.target.dataset.direction.split("-");
    },
    onDelete() {
      this.$emit("onDelete");
    },
  },
};
</script>

<style scoped>
.operation {
  background-color: rgba(0, 0, 0, 0.3);
}

.selector {
  border-radius: 10px;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  margin-top: -6px;
  background-color: #32b5fe;
  border: 1px solid #32b5fe;
}
.delete {
  border-radius: 10px;
  width: 18px;
  height: 18px;
  margin-left: -9px;
  margin-top: -9px;
  background-color: #ffffff;
}
</style>

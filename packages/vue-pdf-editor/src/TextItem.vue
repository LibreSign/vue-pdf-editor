<template>
  <div>
<!--    <toolbar-component style="position: absolute" >-->

<!--    </toolbar-component>-->
    <tapout-component
        class="absolute left-0 top-0 select-none"
        :style="{ transform: `translate(${x + dx}px, ${y + dy}px)` }"
        @tapout="onBlur"
    >
      <tapout-component v-if="operation === 'edit' || operation === 'tool'" style="width: 400px;height: 40px"
          ref="toolBox"
          class="
					h-full
					flex
					justify-center
					items-center
					bg-gray-300
					border-b border-gray-400
				"
          @onfocus="onFocusTool"
          @tapout="onBlurTool"
      >
        <div v-if="showLineSizeSelect" class="mr-2 flex items-center">
          <img title="行间距" src="vue-pdf-editor/svg/line_height.svg" class="w-6 mr-2" alt="Line height"/>
          <input
              v-model="lineHeight_"
              type="number"
              min="1"
              max="10"
              step="0.1"
              class="h-6 w-12 text-center flex-shrink-0 rounded-sm"
          />
        </div>
        <div v-if="showFontSizeSelect" class="mr-2 flex items-center">
          <img title="字号" src="vue-pdf-editor/svg/text.svg" class="w-6 mr-2" alt="Font size"/>
          <input
              v-model="size_"
              type="number"
              min="12"
              max="120"
              step="1"
              class="h-6 w-12 text-center flex-shrink-0 rounded-sm"
          />
        </div>
        <div v-if="showFontSelect" class="mr-2 flex items-center">
          <img title="字体" src="vue-pdf-editor/svg/text-family.svg" class="w-4 mr-2" alt="Font family"/>
          <div class="relative w-32 md:w-40">
            <select
                v-model="fontFamily_"
                class="
								block
								appearance-none
								h-6
								w-full
								bg-white
								pl-2
								pr-8
								rounded-sm
								leading-tight
							"
                @change="onChangeFont"
            >
              <option
                  v-for="(family, index) in Families"
                  :key="index"
                  :value="family"
              >
                {{ family }}
              </option>
            </select>
            <div
                class="
								pointer-events-none
								absolute
								inset-y-0
								right-0
								flex
								items-center
								px-2
								text-gray-700
							"
            >
              <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
              >
                <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757
                    6.586 4.343 8z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div
            class="w-5 h-5 rounded-full bg-white cursor-pointer"
            @click="onDelete">
          <img class="w-full h-full" src="vue-pdf-editor/svg/delete.svg" title="移除" alt="delete object"/>
        </div>
      </tapout-component>
      <div
          class="
					absolute
					w-full
					h-full
					cursor-grab
					border border-dotted border-gray-500
				"
          :class="[
					!operation ? 'cursor-grab' : '',
					operation === 'move' ? 'cursor-grabbing' : '',
					['edit', 'tool'].includes(operation)
						? 'pointer-events-none border-gray-800 border-dashed'
						: '',
				]"
          @mousedown="handlePanStart"
          @touchstart="handlePanStart"
      />
      <div
          ref="editable"
          contenteditable="true"
          spellcheck="false"
          class="outline-none whitespace-no-wrap"
          :style="{
					fontSize: `${size_}px`,
					fontFamily: `${fontFamily_}, serif`,
					lineHeight: `${lineHeight_}`,
				}"
          @focus="onFocus"
          @keydown="onKeydown"
          @paste.prevent="onPaste"
      />
    </tapout-component>
  </div>
</template>

<script>
import itemEventsMixin from "./ItemEventsMixin";
// import ToolbarComponent from "./Toolbar";
import TapoutComponent from "./Tapout";
import {Fonts} from "../utils/prepareAssets.js";
import {timeout} from "../utils/helper.js";
// import '../assets/main.css'
export default {
  name: "TextComponent",
  components: {
    // ToolbarComponent,
    TapoutComponent,
  },
  mixins: [itemEventsMixin],
  props: ["size", "text", "lineHeight", "x", "y", "fontFamily", "pageScale","currentPage","showLineSizeSelect","showFontSelect","showFontSizeSelect"],
  data() {
    return {
      Families: Object.keys(Fonts),
      startX: null,
      startY: null,
      // editable: null,
      dx: 0,
      dy: 0,
      operation: "",
      size_: this.size,
      lineHeight_: this.lineHeight,
      fontFamily_: this.fontFamily,
    };
  },
  computed: {
    // size_() {
    //   return this.size;
    // },
    // lineHeight_() {
    //   return this.lineHeight;
    // },
    // fontFamily_() {
    //   return this.fontFamily
    // }
  },
  watch: {
    // size(value) {
    //   this.size_ = value;
    // },
    // lineHeight(value) {
    //   this.lineHeight_ = value;
    // },
    // fontFamily(value) {
    //   this.fontFamily_ = value;
    // }
  },
  mounted() {
    this.render();
  },
  created() {},
  methods: {
    handlePanMove(event) {
      let coordinate;
      if (event.type === "mousemove") {
        coordinate = this.handleMousemove(event);
      }
      if (event.type === "touchmove") {
        coordinate = this.handleTouchmove(event);
      }
      if (!coordinate) return console.log("ERROR");

      this.dx = (coordinate.detail.x - this.startX) / this.pageScale;
      this.dy = (coordinate.detail.y - this.startY) / this.pageScale;
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

      if (this.dx === 0 && this.dy === 0) {
        return this.$refs.editable.focus();
      }
      this.$emit("onUpdate", {
        x: this.x + this.dx,
        y: this.y + this.dy,
      });
      this.dx = 0;
      this.dy = 0;
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
      this.operation = "move";
    },
    onFocus() {
      this.operation = "edit";
    },
    async onBlur() {
      if (this.operation !== "edit" || this.operation === "tool") return;
      this.$refs.editable.blur();
      this.sanitize();
      this.$emit("onUpdate", {
        currentPage:this.currentPage,
        lines: this.extractLines(),
        width: this.$refs.editable.clientWidth,
      });
      this.operation = "";
    },
    async onPaste(e) {
      // get text only
      const pastedText = e.clipboardData.getData("text");
      document.execCommand("insertHTML", false, pastedText);
      // await tick() is not enough
      await timeout();
      this.sanitize();
    },
    onKeydown(e) {
      const childNodes = Array.from(this.$refs.editable.childNodes);
      if (e.keyCode === 13) {
        // prevent default adding div behavior
        e.preventDefault();
        const selection = window.getSelection();
        const focusNode = selection.focusNode;
        const focusOffset = selection.focusOffset;
        // the caret is at an empty line
        if (focusNode === this.$refs.editable) {
          this.$refs.editable.insertBefore(
              document.createElement("br"),
              childNodes[focusOffset],
          );
        } else if (focusNode instanceof HTMLBRElement) {
          this.$refs.editable.insertBefore(
              document.createElement("br"),
              focusNode,
          );
        }
        // the caret is at a text line but not end
        else if (focusNode.textContent.length !== focusOffset) {
          document.execCommand("insertHTML", false, "<br>");
          // the carat is at the end of a text line
        } else {
          let br = focusNode.nextSibling;
          if (br) {
            this.$refs.editable.insertBefore(
                document.createElement("br"),
                br,
            );
          } else {
            br = this.$refs.editable.appendChild(
                document.createElement("br"),
            );
            br = this.$refs.editable.appendChild(
                document.createElement("br"),
            );
          }
          // set selection to new line
          selection.collapse(br, 0);
        }
      }
    },
    onFocusTool() {
      this.operation = "tool";
    },
    async onBlurTool() {
      if (this.operation !== "tool" || this.operation === "edit") return;
      this.$emit("onUpdate", {
        currentPage:this.currentPage,
        lines: this.extractLines(),
        lineHeight: this.lineHeight_,
        size: this.size_,
        fontFamily: this.fontFamily_,
      });
      this.operation = "";
    },
    sanitize() {
      let weirdNode;
      while (
          (weirdNode = Array.from(this.$refs.editable.childNodes).find(
              (node) => !["#text", "BR"].includes(node.nodeName),
          ))
          ) {
        this.$refs.editable.removeChild(weirdNode);
      }
    },
    onChangeFont() {
      this.$emit("onSelectFont", {
        name: this.fontFamily_,
      });
    },
    render() {
      this.$refs.editable.innerText = this.text;
      this.$refs.editable.focus();
    },
    render4Init() {
      this.$refs.editable.innerText = this.text;
      this.$refs.editable.focus();
      document.getElementById('pdfBody').dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    },
    extractLines() {
      const nodes = this.$refs.editable.childNodes;
      const lines = [];
      let lineText = "";
      for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        if (node.nodeName === "BR") {
          lines.push(lineText);
          lineText = "";
        } else {
          lineText += node.textContent;
        }
      }
      lines.push(lineText);
      return lines;
    },
    onDelete() {
      this.operation = "";
      setTimeout(() => {
        this.$emit("onDelete",);
      }, 100);
    },
  },
};
</script>
<style scoped>

.whitespace-no-wrap {
  white-space: nowrap;
}
.outline-none {
  outline: 0;
}



</style>

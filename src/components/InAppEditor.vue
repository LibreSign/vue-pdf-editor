<template>
  <div class="flex flex-col items-center py-16 bg-gray-100 min-h-screen">
    <div
        class="fixed z-10 top-0 left-0 right-0 h-12 flex justify-center items-center
    bg-gray-200 border-b border-gray-300">
      <input
          type="file"
          name="pdf"
          id="pdf"
          @change="onUploadPDF"
          class="hidden"/>
      <input
          type="file"
          id="image"
          name="image"
          class="hidden"
          @change="onUploadImage"/>
      <label v-if="showChooseFileBtn"
          class="whitespace-no-wrap bg-blue-500 hover:bg-blue-700 text-white
      font-bold py-1 px-3 md:px-4 rounded mr-3 cursor-pointer md:mr-4"
          for="pdf">
        选择PDF
      </label>
      <div v-if="showCustomizeEditor"
          class="relative mr-3 flex h-8 bg-gray-400 rounded-sm overflow-hidden
      md:mr-4">
        <label title="添加图片"
            class="flex items-center justify-center h-full w-8 hover:bg-gray-500
        cursor-pointer"
            for="image"
            :class="[selectedPageIndex < 0 ?'cursor-not-allowed bg-gray-500':'']">
          <img src="/image.svg" alt="An icon for adding images"/>
        </label>
        <label title="添加文字"
            class="flex items-center justify-center h-full w-8 hover:bg-gray-500
        cursor-pointer"
            for="text"
            :class="[selectedPageIndex < 0 ?'cursor-not-allowed bg-gray-500':'']"
            @click="onAddTextField">
          <img src="/notes.svg" alt="An icon for adding text"/>
        </label>
        <label title="添加笔迹"
            class="flex items-center justify-center h-full w-8 hover:bg-gray-500
        cursor-pointer"
            @click="onAddDrawing"
            :class="[selectedPageIndex < 0 ?'cursor-not-allowed bg-gray-500':'']">
          <img src="/gesture.svg" alt="An icon for adding drawing"/>
        </label>
      </div>
      <div v-if="showRename" class="justify-center mr-3 md:mr-4 w-full max-w-xs hidden md:flex">
        <img src="/edit.svg" class="mr-2" alt="a pen, edit pdf name"  @click="renamePDF($refs.renamePDFInputOne)"/>
        <input ref="renamePDFInputOne" title="在此处重命名PDF"
            placeholder="在此处重命名PDF"
            type="text"
            class="flex-grow bg-transparent"
            :value="pdfName"/>
      </div>
      <button
          @click="savePDF"
          class="w-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3
      md:px-4 mr-3 md:mr-4 rounded"
          :class="[(pages.length === 0 || saving || !pdfFile) ?'cursor-not-allowed bg-blue-700':'']">
        {{ saving ? '保存中' : '保存' }}
      </button>
    </div>
    <div v-if="addingDrawing">
      <div
          class="fixed z-10 top-0 left-0 right-0 border-b border-gray-300 bg-white
      shadow-lg"
          style="height: 50%;">
        <DrawingCanvas
            @onFinish="onFinishDrawingCanvas"
            @onCancel="onCancelDrawingCanvas"/>
      </div>
    </div>
    <div v-if="pages.length" id="pdfBody" class="w-full" ref = 'pdfBody'>
      <div class="flex justify-center px-5 w-full md:hidden">
        <img src="/edit.svg" class="mr-2" alt="a pen, edit pdf name" @click="renamePDF($refs.renamePDFInputTwo)"/>
        <input ref="renamePDFInputTwo" title="在此处重命名PDF"
            placeholder="在此处重命名PDF"
            type="text"
            class="flex-grow bg-transparent"
            :value="pdfName"/>
      </div>

      <!--  PDF主体      -->
      <div class="w-full">
        <div v-for="(page,pIndex) in pages" :key="pIndex">
          <div
              class="p-5 w-full flex flex-col items-center overflow-hidden"
              @mousedown="selectPage(pIndex)"
              @touchstart="selectPage(pIndex)">
            <div
                class="relative shadow-lg"
                :class="[pIndex === selectedPageIndex ?'shadowOutline':'']">
              <PDFPage
                  :ref="`page${pIndex}`"
                  :data-key="pIndex"
                  @onMeasure="onMeasure($event, pIndex)"
                  :page="page"/>
              <div
                  class="absolute top-0 left-0 transform origin-top-left noTouchAction"
                  :style="{transform: `scale(${pagesScale[pIndex]})`}"
              >
                <div v-for="(object, oIndex) in allObjects[pIndex]" :key="oIndex">
                  <div>
                    <div v-if="object.type === 'image'">
                      <ImageItem
                          @onUpdate="updateObject(object.id, $event)"
                          @onDelete="deleteObject(object.id)"
                          :file="object.file"
                          :payload="object.payload"
                          :x="object.x"
                          :y="object.y"
                          :width="object.width"
                          :height="object.height"
                          :originWidth="object.originWidth"
                          :originHeight="object.originHeight"
                          :pageScale="pagesScale[pIndex]"/>
                    </div>
                    <div v-else-if="object.type === 'text'">
                      <TextItem
                          ref="textItem"
                          @onUpdate="updateObject(object.id, $event)"
                          @onDelete="deleteObject(object.id)"
                          @onSelectFont="selectFontFamily"
                          :text="object.text"
                          :x="object.x"
                          :y="object.y"
                          :size="object.size"
                          :lineHeight="object.lineHeight"
                          :fontFamily="object.fontFamily"
                          :pageScale="pagesScale[pIndex]"/>
                    </div>
                    <div v-else-if="object.type === 'drawing'">
                      <Drawing
                          @onUpdate="updateObject(object.id, $event)"
                          @onDelete="deleteObject(object.id)"
                          :path="object.path"
                          :x="object.x"
                          :y="object.y"
                          :width="object.width"
                          :originWidth="object.originWidth"
                          :originHeight="object.originHeight"
                          :pageScale="pagesScale[pIndex]"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
<!--    <div v-else>-->
<!--      <div class="w-full flex-grow flex justify-center items-center">-->
<!--        <span class=" font-bold text-3xl text-gray-500">拖入PDF文件</span>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
import "pdfjs-dist/web/pdf_viewer.css";

const PDFJS = require("pdfjs-dist");
PDFJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker");

// import * as PDFLib from 'pdf-lib';

import {getAsset} from "@/utils/prepareAssets";

import PDFPage from "@/components/PDFPage";
import ImageItem from "@/components/Image";
import TextItem from "@/components/TextItem";
import Drawing from "@/components/Drawing";
import DrawingCanvas from "@/components/DrawingCanvas";
import {fetchFont} from "@/utils/prepareAssets.js";
import {
  readAsImage,
  readAsPDF,
  readAsDataURL
} from "@/utils/asyncReader.js";
import {save} from "@/utils/PDF.js";

getAsset('makeTextPDF');

export default {
  name: 'InAppEditor',
  components: {
    PDFPage,
    ImageItem,
    TextItem,
    Drawing,
    DrawingCanvas
  },
  props: {
    msg: String,
    showChooseFileBtn: {
      type: Boolean,
      default:false
    },
    showCustomizeEditor: {
      type: Boolean,
      default: true
    },
    showRename: {
      type: Boolean,
      default: true
    },
    loadDefaultFile:{
      type: Boolean,
      default: true
    },
    saveToUpload:{
      type: Boolean,
      default: false
    },
    initFileSrc: {
      type: String,
      default: ''
    },
    initTextFields: {
      type: Array,
      default: null
    },
    initImageUrls: {
      type: Array,
      default: null
    }

  },
  data() {
    return {
      pdfFile: null,
      pdfName: "",
      numPages: null,
      pdfDocument: null,
      pages: [],
      pagesScale: [],
      allObjects: [],
      currentFont: "宋体",
      focusId: null,
      selectedPageIndex: -1,
      saving: false,
      addingDrawing: false,
      defaultFileSrc: "https://raw.githubusercontent.com/pdf-association/pdf20examples/master/pdf20-utf8-test.pdf",

    }
  },
  async mounted() {
    await this.init();
  },
  created() {
  },
  watch: {},
  methods: {
    async init() {
      try {
        const res = await fetch(this.loadDefaultFile ? this.defaultFileSrc : this.initFileSrc);
        const pdfBlob = await res.blob();
        await this.addPDF(pdfBlob);
        this.selectedPageIndex = 0;
        // setTimeout(() => {
        //   fetchFont(this.currentFont);
        //   // prepareAssets();
        // }, 5000);
        fetchFont(this.currentFont);

        this.initTextField();
        await this.initImages();
      } catch (e) {
        console.log(e);
      }
    },
    initTextField(){
      if (this.selectedPageIndex<0 || this.initTextFields === null || this.initTextFields.length === 0) {
        return;
      }
      for (let i = 0; i <this.pages.length; i++) {
        this.selectedPageIndex = i;
        for (let j = 0; j < this.initTextFields.length; j++) {
          let text = this.initTextFields[j];
          this.addTextField(text, 600, j * 60);
        }
      }
      this.selectedPageIndex = 0;
      let checker = setInterval(() => {
        if (this.$refs.textItem.length === this.initTextFields.length) {
          document.getElementById('pdfBody').dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
          }));
          clearInterval(checker)
        }
      }, 100);

    },
    async initImages(){
      if (this.selectedPageIndex<0) {
        return;
      }
      for (let i = 0; i <this.pages.length; i++) {
        this.selectedPageIndex = i;
        for (let j = 0; j < this.initImageUrls.length; j++) {
          await this.addImage(this.initImageUrls[j], 600, (j-1+this.initTextFields.length) * 100 ,0.2);
        }
      }
      this.selectedPageIndex = 0;

    },
    onFinishDrawingCanvas(e) {
      const {originWidth, originHeight, path} = e;
      let scale = 1;
      if (originWidth > 500) {
        scale = 500 / originWidth;
      }
      this.addDrawing(originWidth, originHeight, path, scale);
      this.onCancelDrawingCanvas();
    },
    onCancelDrawingCanvas() {
      this.addingDrawing = false;
    },
    genID() {
      let id = 0;
      return function genId() {
        return id++;
      };
    },
    async onUploadPDF(e) {
      const files = e.target.files || (e.dataTransfer && e.dataTransfer.files);
      const file = files[0];
      if (!file || file.type !== "application/pdf") return;
      this.selectedPageIndex = -1;
      try {
        await this.addPDF(file);
        this.selectedPageIndex = 0;
      } catch (e) {
        console.log(e);
      }
      this.initTextField();
      this.initImages();
    },
    resetDefaultState() {
      this.pdfFile = null;
      this.pdfName = "";
      this.numPages = null;
      this.pdfDocument = null;
      this.pages = [];
      this.pagesScale = [];
      this.allObjects = [];
    },
    async getPdfDocument(file) {
      const blob = new Blob([file]);
      const url = window.URL.createObjectURL(blob);
      return PDFJS.getDocument(url).promise;
    },
    async addPDF(file) {
      try {
        this.resetDefaultState();

        this.pdfFile = file;
        this.pdfName = file.name;

        this.pdfDocument = await readAsPDF(file);
        if (this.pdfDocument) {
          this.numPages = this.pdfDocument.numPages;
          this.pages = Array(this.numPages)
              .fill()
              .map((_, i) => this.pdfDocument.getPage(i + 1));
          this.allObjects = this.pages.map(() => []);
          this.pagesScale = Array(this.numPages).fill(1);
        }
      } catch (e) {
        console.log("Failed to add pdf.");
        throw e;
      }
    },
    async onUploadImage(e) {
      const file = e.target.files[0];
      if (file && this.selectedPageIndex >= 0) {
        await this.addImage(file);
      }
      e.target.value = null;
    },
    async addImage(file, x = 0, y = 0, sizeNarrow = 1) {
      try {
        // get dataURL to prevent canvas from tainted
        let url;
        if (typeof file === "string" && file.startsWith("http")) {
          url = file;
        }else {
          url = await readAsDataURL(file);
        }
        const img = await readAsImage(url);
        const id = this.genID();
        const {width, height} = img;

        const {canvasWidth, canvasHeight} =
            this.$refs[
                `page${this.selectedPageIndex}`
                ][0].getCanvasMeasurement();

        const object = {
          id,
          type: "image",
          width:width*sizeNarrow,
          height:height*sizeNarrow,
          originWidth: width,
          originHeight: height,
          canvasWidth: canvasWidth,
          canvasHeight: canvasHeight,
          x: x,
          y: y,
          payload: img,
          file
        };
        this.allObjects = this.allObjects.map((objects, pIndex) =>
            pIndex === this.selectedPageIndex ? [...objects, object] : objects
        );
      } catch (e) {
        console.log(`Fail to add image.`, e);
      }
    },
    onAddTextField() {
      if (this.selectedPageIndex >= 0) {
        this.addTextField();
      }
    },

    addTextField(text = "请在此输入", x = 0, y = 0) {
      const id = this.genID();
      fetchFont(this.currentFont);
      const object = {
        id,
        text,
        type: "text",
        size: 16,
        width: 0, // recalculate after editing
        lineHeight: 1.4,
        fontFamily: this.currentFont,
        x: x,
        y: y
      };
      this.allObjects = this.allObjects.map((objects, pIndex) =>
          pIndex === this.selectedPageIndex ? [...objects, object] : objects
      );
    },

    onAddDrawing() {
      if (this.selectedPageIndex >= 0) {
        this.addingDrawing = true;
      }
    },

    addDrawing(originWidth, originHeight, path, scale = 1) {
      const id = this.genID();
      const object = {
        id,
        path,
        type: "drawing",
        x: 0,
        y: 0,
        originWidth,
        originHeight,
        width: originWidth * scale,
        scale
      };
      this.allObjects = this.allObjects.map((objects, pIndex) =>
          pIndex === this.selectedPageIndex ? [...objects, object] : objects
      );
    },

    selectFontFamily(event) {
      const name = event.name;
      fetchFont(name);
      this.currentFont = name;
    },

    selectPage(index) {
      this.selectedPageIndex = index;
    },

    updateObject(objectId, payload) {
      this.allObjects = this.allObjects.map((objects, pIndex) =>
          pIndex === this.selectedPageIndex
              ? objects.map(object =>
                  object.id === objectId ? {...object, ...payload} : object
              )
              : objects
      );
    },

    deleteObject(objectId) {
      this.allObjects = this.allObjects.map((objects, pIndex) =>
          pIndex === this.selectedPageIndex
              ? objects.filter(object => object.id !== objectId)
              : objects
      );
    },

    onMeasure(e, i) {
      this.pagesScale[i] = e.scale;
    },

    renamePDF(object){
      object.focus();
    },

// FIXME: Should wait all objects finish their async work
    async savePDF() {
      if (!this.pdfFile || this.saving || !this.pages.length) return;
      this.saving = true;
      try {
        // await save(this.pdfFile, this.allObjects, this.pdfName, this.pagesScale);
        await save(this.pdfFile, this.allObjects, this.pdfName, this.saveToUpload);
      } catch (e) {
        console.log(e);
      } finally {
        this.saving = false;
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.shadowOutline {
  box-shadow: 0 0 0 3px rgb(66 153 225 / 50%);
}

.noTouchAction {
  touch-action: none
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

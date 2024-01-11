<template>
	<div :style="{width:width,height:height}" style="margin: 0 auto;overflow: hidden;position: relative;">
		<div ref="scrollBox"
			style="width: 100%;height: 100%;overflow: auto;"
			class="flex-col py-12 items-center bg-gray-100"
			@wheel.ctrl="wheelZoom"
			@wheel.meta="wheelZoom">
			<div v-if="showChooseFileBtn || showCustomizeEditor||showSaveBtn"
				style="position: absolute;"
				class="z-10 top-0 left-0 right-0 z-10 h-12 flex justify-center items-center bg-gray-200 border-b border-gray-300">
				<input id="pdf"
					type="file"
					name="pdf"
					class="hidden"
					@change="onUploadPDF">
				<input id="image"
					type="file"
					name="image"
					class="hidden"
					@change="onUploadImage">
				<label v-if="showChooseFileBtn"
					class="whitespace-no-wrap bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 md:px-4 rounded mr-3 cursor-pointer md:mr-4"
					for="pdf">
					Select PDF
				</label>
				<button v-show="narrowEnlargeShow"
					class="w-7 h-7 bg-blue-500 hover:bg-blue-700 text-white font-bold  flex items-center justify-center mr-3 md:mr-4 rounded-full"
					@click="narrow">
					-
				</button>
				<button v-show="narrowEnlargeShow"
					class="w-7 h-7 bg-blue-500 hover:bg-blue-700 text-white font-bold  flex items-center justify-center  mr-3 md:mr-4 rounded-full"
					@click="enlarge">
					+
				</button>
				<div v-if="showCustomizeEditor"
					class="relative mr-3 flex h-8 bg-gray-400 rounded-sm overflow-hidden md:mr-4">
					<label v-if="showCustomizeEditorAddImg"
						title="add pictures"
						class="flex items-center justify-center h-full w-8 hover:bg-gray-500 cursor-pointer"
						for="image"
						:class="[selectedPageIndex < 0 ?'cursor-not-allowed bg-gray-500':'']">
						<img src="assets/img/image.svg" alt="An icon for adding images">
					</label>
					<label v-if="showCustomizeEditorAddText"
						title="Add text"
						class="flex items-center justify-center h-full w-8 hover:bg-gray-500 cursor-pointer"
						for="text"
						:class="[selectedPageIndex < 0 ?'cursor-not-allowed bg-gray-500':'']"
						@click="onAddTextField">
						<img src="assets/img/notes.svg" alt="An icon for adding text">
					</label>
					<label v-if="showCustomizeEditorAddDraw"
						title="Add a handwriting"
						class="flex items-center justify-center h-full w-8 hover:bg-gray-500 cursor-pointer"
						:class="[selectedPageIndex < 0 ?'cursor-not-allowed bg-gray-500':'']"
						@click="onAddDrawing">
						<img src="assets/img/gesture.svg" alt="An icon for adding drawing">
					</label>
				</div>
				<div v-if="showRename" class="justify-center mr-3 md:mr-4 w-full max-w-xs hidden md:flex">
					<img src="assets/img/edit.svg"
						class="mr-2"
						alt="a pen, edit pdf name"
						@click="renamePDF($refs.renamePDFInputOne)">
					<input ref="renamePDFInputOne"
						v-model="pdfName"
						title="Rename PDF here"
						placeholder="Rename PDF here"
						type="text"
						class="flex-grow bg-transparent">
				</div>
				<button v-if="showSaveBtn"
					class="w-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 md:px-4 mr-3 md:mr-4 rounded"
					:class="[(pages.length === 0 || saving || !pdfFile) ?'cursor-not-allowed bg-blue-700':'']"
					@click="savePDF">
					{{ saving ? 'saving' : 'keep' }}
				</button>
			</div>
			<div v-if="addingDrawing">
				<div class="fixed z-10 top-0 left-0 right-0 border-b border-gray-300 bg-white shadow-lg"
					style="height: 50%;">
					<DrawingCanvas @onFinish="onFinishDrawingCanvas"
						@onCancel="onCancelDrawingCanvas" />
				</div>
			</div>
			<div v-if="pages.length"
				id="pdfBody"
				ref="pdfBody"
				class="w-full">
				<div v-if="showRename" class="flex justify-center px-5 pt-5 w-full md:hidden">
					<div class="flex items-center">
						<img src="assets/img/edit.svg"
							class="mr-2 justify-center"
							alt="a pen, edit pdf name"
							@click="renamePDF($refs.renamePDFInputTwo)">
						<input ref="renamePDFInputTwo"
							v-model="pdfName"
							style="text-align:center"
							title="Rename PDF here"
							placeholder="Rename PDF here"
							type="text"
							class="flex-grow bg-transparent justify-center">
					</div>
				</div>

				<!--  PDF main body      -->
				<div class="w-full" style="text-align: center;">
					<div v-for="(page,pIndex) in pages" :key="pIndex" style="display: inline-block;">
						<div class="p-5  items-center"
							style="text-align: center"
							@mousedown="selectPage(pIndex)"
							@touchstart="selectPage(pIndex)">
							<div style="display: inline-block;"
								class="relative shadow-lg"
								:class="[pIndex === selectedPageIndex ?'shadowOutline':'']">
								<PDFPage :ref="`page${pIndex}`"
									:scale="scale"
									:data-key="pIndex"
									:page="page"
									@onMeasure="onMeasure($event, pIndex)" />
								<div class="absolute top-0 left-0 transform origin-top-left noTouchAction"
									:style="{transform: `scale(${pagesScale[pIndex]})`}">
									<div v-for="(object, oIndex) in allObjects[pIndex]" :key="oIndex">
										<div>
											<div v-if="object.type === 'image'">
												<ImageItem :file="object.file"
													:payload="object.payload"
													:x="object.x"
													:y="object.y"
													:fix-size="object.isSealImage"
													:width="object.width"
													:height="object.height"
													:origin-width="object.originWidth"
													:origin-height="object.originHeight"
													:page-scale="pagesScale[pIndex]"
													@onUpdate="updateObject(object.id, $event)"
													@onDelete="deleteObject(object.id)" />
											</div>
											<div v-else-if="object.type === 'text'">
												<TextItem ref="textItem"
													:text="object.text"
													:x="object.x"
													:y="object.y"
													:show-line-size-select="showLineSizeSelect"
													:show-font-size-select="showFontSizeSelect"
													:show-font-select="showFontSelect"
													:size="object.size"
													:line-height="object.lineHeight"
													:font-family="object.fontFamily"
													:current-page="object.currentPage"
													:page-scale="pagesScale[pIndex]"
													@onUpdate="updateObject(object.id, $event)"
													@onDelete="deleteObject(object.id)"
													@onSelectFont="selectFontFamily" />
											</div>
											<div v-else-if="object.type === 'drawing'">
												<Drawing :path="object.path"
													:x="object.x"
													:y="object.y"
													:width="object.width"
													:origin-width="object.originWidth"
													:origin-height="object.originHeight"
													:page-scale="pagesScale[pIndex]"
													@onUpdate="updateObject(object.id, $event)"
													@onDelete="deleteObject(object.id)" />
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
			<!--        <span class=" font-bold text-3xl text-gray-500">Drag into the PDF file</span>-->
			<!--      </div>-->
			<!--    </div>-->
		</div>
	</div>
</template>

<script>
import 'pdfjs-dist/web/pdf_viewer.css'

import { fetchFont } from '../utils/prepareAssets'

import PDFPage from './PDFPage'
import ImageItem from './Image'
import TextItem from './TextItem'
import Drawing from './Drawing'
import DrawingCanvas from './DrawingCanvas'
import {
	readAsImage,
	readAsPDF,
	readAsDataURL,
} from '../utils/asyncReader.js'
import { save } from '../utils/PDF.js'

const PDFJS = require('pdfjs-dist')
PDFJS.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker')

export default {
	name: 'VuePdfEditor',
	components: {
		PDFPage,
		ImageItem,
		TextItem,
		Drawing,
		DrawingCanvas,
	},
	props: {
		msg: String,
		width: {
			type: String,
			default: '100%',
		},
		height: {
			type: String,
			default: '100%',
		},
		showChooseFileBtn: {
			type: Boolean,
			default: false,
		},
		showCustomizeEditor: {
			type: Boolean,
			default: true,
		},
		showCustomizeEditorAddText: {
			type: Boolean,
			default: true,
		},
		showCustomizeEditorAddImg: {
			type: Boolean,
			default: true,
		},
		showCustomizeEditorAddDraw: {
			type: Boolean,
			default: true,
		},
		showLineSizeSelect: {
			type: Boolean,
			default: true,
		},
		showFontSizeSelect: {
			type: Boolean,
			default: true,
		},
		showFontSelect: {
			type: Boolean,
			default: true,
		},
		showRename: {
			type: Boolean,
			default: true,
		},
		showSaveBtn: {
			type: Boolean,
			default: true,
		},
		loadDefaultFile: {
			type: Boolean,
			default: true,
		},
		saveToUpload: {
			type: Boolean,
			default: false,
		},
		initFileSrc: {
			type: String,
			default: '',
		},
		initFileName: {
			type: String,
			default: '',
		},
		initTextFields: {
			type: Array,
			default: null,
		},
		textDefaultSize: {
			type: Number,
			default: 12,
		},
		initImageUrls: {
			type: Array,
			default: null,
		},
		initImageScale: {
			type: Number,
			default: 0.2,
		},
		sealImageShow: {
			type: Boolean,
			default: false,
		},
		sealImageUrl: {
			type: String,
			default: 'assets/img/sealImag.png',
		},
		sealImageHiddenOnSave: {
			type: Boolean,
			default: false,
		},

	},
	data() {
		return {
			wheelZoomCount: 0,
			narrowEnlargeShow: false,
			scale: 1,
			pdfFile: null,
			pdfName: '',
			numPages: null,
			pdfDocument: null,
			pages: [],
			pagesScale: [],
			allObjects: [],
			currentFont: 'Dancing Script',
			focusId: null,
			selectedPageIndex: -1,
			saving: false,
			addingDrawing: false,

		}
	},
	watch: {
	},
	async mounted() {
		await this.init()
	},
	created() {
	},
	methods: {
		wheelZoom(e) {
			e.stopPropagation()
			e.preventDefault()
			this.wheelZoomCount++

			if (this.wheelZoomCount < 3) {
				return
			}
			this.wheelZoomCount = 0
			if (e.deltaY > 0) {
				this.narrow()
			} else if (e.deltaY < 0) {
				this.enlarge()
			}
		},
		enlarge() {
			if (this.scale >= 2) {
				return
			}
			this.scale = parseFloat((this.scale + 0.1).toFixed(1))
		},
		narrow() {
			if (this.scale <= 0.1) {
				return
			}
			this.scale = parseFloat((this.scale - 0.1).toFixed(1))
		},
		async init() {
			if (!this.initFileSrc) {
				console.log('init file is not exist')
				return
			}
			try {
				const res = await fetch(this.initFileSrc)
				const pdfBlob = await res.blob()
				await this.addPDF(pdfBlob)
				this.selectedPageIndex = 0
				fetchFont(this.currentFont)
				this.narrowEnlargeShow = true
				this.initTextField()
				await this.initImages()
			} catch (e) {
				console.log(e)
			}
		},
		initTextField() {
			if (this.selectedPageIndex < 0 || this.initTextFields === null || this.initTextFields.length === 0) {
				return
			}
			for (let i = 0; i < this.pages.length; i++) {
				this.selectedPageIndex = i
				for (let j = 0; j < this.initTextFields.length; j++) {
					const text = this.initTextFields[j]
					this.addTextField(text, 0, j * 60, this.selectedPageIndex)
				}
			}
			this.selectedPageIndex = 0
			const checker = setInterval(() => {
				if (this.$refs.textItem.length === this.initTextFields.length * this.pages.length) {
					document.getElementById('pdfBody').dispatchEvent(new MouseEvent('mousedown', {
						bubbles: true,
						cancelable: true,
						view: window,
					}))
					clearInterval(checker)
				}
			}, 100)

		},
		async initImages() {
			if (this.selectedPageIndex < 0) {
				return
			}
			for (let i = 0; i < this.pages.length; i++) {
				this.selectedPageIndex = i
				let y = 0
				if (this.initImageUrls !== null && this.initImageUrls.length !== 0) {
					// Need to initialize pictures
					for (let j = 0; j < this.initImageUrls.length; j++) {
						if (this.initTextFields.length === 0) {
							y = j * 100
						} else {
							y = (j - 1 + this.initTextFields.length) * 100
						}
						await this.addImage(this.initImageUrls[j], 0, y, 1)
					}
				}
				if (this.sealImageShow) {
					// Example of display seal
					const res = await fetch(this.sealImageUrl)
					await this.addImage(await res.blob(), 0, (y + 1) * 100, 0.4, true)
				}
			}
			this.selectedPageIndex = 0

		},
		onFinishDrawingCanvas(e) {
			const { originWidth, originHeight, path } = e
			let scale = 1
			if (originWidth > 500) {
				scale = 500 / originWidth
			}
			this.addDrawing(originWidth, originHeight, path, scale)
			this.onCancelDrawingCanvas()
		},
		onCancelDrawingCanvas() {
			this.addingDrawing = false
		},
		genID() {
			let id = 0
			return function genId() {
				return id++
			}
		},
		async onUploadPDF(e) {
			const files = e.target.files || (e.dataTransfer && e.dataTransfer.files)
			const file = files[0]
			if (!file || file.type !== 'application/pdf') return
			this.selectedPageIndex = -1
			try {
				await this.addPDF(file)
				this.narrowEnlargeShow = true
				this.selectedPageIndex = 0
			} catch (e) {
				console.log(e)
			}
			this.initTextField()
			await this.initImages()
		},
		resetDefaultState() {
			this.pdfFile = null
			this.pdfName = ''
			this.numPages = null
			this.pdfDocument = null
			this.pages = []
			this.pagesScale = []
			this.allObjects = []
		},
		async getPdfDocument(file) {
			const blob = new Blob([file])
			const url = window.URL.createObjectURL(blob)
			return PDFJS.getDocument(url).promise
		},
		async addPDF(file) {
			try {
				this.resetDefaultState()

				this.pdfFile = file
				if (this.initFileName) {
					this.pdfName = this.initFileName
				} else if (file.name) {
					this.pdfName = file.name
				} else {
					this.pdfName = new Date().getTime()
				}

				this.pdfDocument = await readAsPDF(file)
				if (this.pdfDocument) {
					this.numPages = this.pdfDocument.numPages
					this.pages = Array(this.numPages)
						.fill()
						.map((_, i) => this.pdfDocument.getPage(i + 1))
					this.allObjects = this.pages.map(() => [])
					this.pagesScale = Array(this.numPages).fill(1)
				}
			} catch (e) {
				console.log('Failed to add pdf.')
				throw e
			}
		},
		async onUploadImage(e) {
			const file = e.target.files[0]
			if (file && this.selectedPageIndex >= 0) {
				await this.addImage(file)
			}
			e.target.value = null
		},
		async addImage(file, x = 0, y = 0, sizeNarrow = 1, isSealImage = false) {
			try {
				// get dataURL to prevent canvas from tainted
				let url
				if (typeof file === 'string' && file.startsWith('http')) {
					url = file
				} else {
					url = await readAsDataURL(file)
				}
				const img = await readAsImage(url)
				const id = this.genID()
				const { width, height } = img

				const { canvasWidth, canvasHeight }
					= this.$refs[
						`page${this.selectedPageIndex}`
					][0].getCanvasMeasurement()

				const object = {
					id,
					type: 'image',
					width: width * sizeNarrow,
					height: height * sizeNarrow,
					originWidth: width,
					originHeight: height,
					canvasWidth,
					canvasHeight,
					x,
					y,
					isSealImage,
					payload: img,
					file,
				}
				this.allObjects = this.allObjects.map((objects, pIndex) =>
					pIndex === this.selectedPageIndex ? [...objects, object] : objects,
				)
			} catch (e) {
				console.log('Fail to add image.', e)
			}
		},
		onAddTextField() {
			if (this.selectedPageIndex >= 0) {
				this.addTextField()
			}
		},

		addTextField(text = 'Please enter here', x = 0, y = 0, currentPage = this.selectedPageIndex) {
			const id = this.genID()
			fetchFont(this.currentFont)
			const object = {
				id,
				text,
				type: 'text',
				size: this.textDefaultSize,
				width: 0, // recalculate after editing
				lineHeight: 1.4,
				fontFamily: this.currentFont,
				x,
				y,
				currentPage,
			}
			this.allObjects = this.allObjects.map((objects, pIndex) =>
				pIndex === this.selectedPageIndex ? [...objects, object] : objects,
			)
		},

		onAddDrawing() {
			if (this.selectedPageIndex >= 0) {
				this.addingDrawing = true
			}
		},

		addDrawing(originWidth, originHeight, path, scale = 1) {
			const id = this.genID()
			const object = {
				id,
				path,
				type: 'drawing',
				x: 0,
				y: 0,
				originWidth,
				originHeight,
				width: originWidth * scale,
				scale,
			}
			this.allObjects = this.allObjects.map((objects, pIndex) =>
				pIndex === this.selectedPageIndex ? [...objects, object] : objects,
			)
		},

		selectFontFamily(event) {
			const name = event.name
			fetchFont(name)
			this.currentFont = name
		},

		selectPage(index) {
			this.selectedPageIndex = index
		},

		updateObject(objectId, payload) {
			this.allObjects = this.allObjects.map((objects, pIndex) =>
				pIndex === (payload.currentPage !== undefined ? payload.currentPage : this.selectedPageIndex)
					? objects.map(object =>
						object.id === objectId ? { ...object, ...payload } : object,
					)
					: objects,
			)
		},

		deleteObject(objectId) {
			this.allObjects = this.allObjects.map((objects, pIndex) =>
				pIndex === this.selectedPageIndex
					? objects.filter(object => object.id !== objectId)
					: objects,
			)
		},

		onMeasure(e, i) {
			this.pagesScale[i] = e.scale
			this.$forceUpdate()
		},

		renamePDF(object) {
			object.focus()
		},

		async savePDF() {
			if (!this.pdfFile || this.saving || !this.pages.length) return
			this.saving = true
			try {
				const sealInfo = []
				const allObject4Save = []
				if (this.sealImageShow) {
					for (let i = 0; i < this.pages.length; i++) {
						const seal = this.allObjects[i].find((e) => e.isSealImage === true)
						const page = await this.pages[i]
						sealInfo.push({
							page: page._pageIndex,
							pageWidth: page._pageInfo.view[2],
							pageHeight: page._pageInfo.view[3],
							x: seal.x + 60,
							y: seal.y + 60,
						})
						if (this.sealImageHiddenOnSave) {
							allObject4Save.push(this.allObjects[i].filter(e => e !== seal))
						}
					}
				}
				await save(this.pdfFile, this.sealImageShow && this.sealImageHiddenOnSave ? allObject4Save : this.allObjects,
					this.pdfName, this.saveToUpload, (pdfBytes) => {
						this.$emit('onSave2Upload', { pdfBytes, fileName: this.pdfName, sealInfo })
					})
			} catch (e) {
				console.log(e)
			} finally {
				this.saving = false
			}
		},
	},
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

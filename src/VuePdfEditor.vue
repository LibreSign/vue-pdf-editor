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
					multiple
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
						<ImageIcon :size="20" title="An icon for adding images" />
					</label>
					<label v-if="showCustomizeEditorAddText"
						title="Add text"
						class="flex items-center justify-center h-full w-8 hover:bg-gray-500 cursor-pointer"
						for="text"
						:class="[selectedPageIndex < 0 ?'cursor-not-allowed bg-gray-500':'']"
						@click="onAddTextField">
						<TextIcon :size="20" title="An icon for adding text" />
					</label>
					<label v-if="showCustomizeEditorAddDraw"
						title="Add a handwriting"
						class="flex items-center justify-center h-full w-8 hover:bg-gray-500 cursor-pointer"
						:class="[selectedPageIndex < 0 ?'cursor-not-allowed bg-gray-500':'']"
						@click="onAddDrawing">
						<GestureIcon :size="20" title="An icon for adding drawing" />
					</label>
				</div>
				<div v-if="showRename && pdfDocuments.length === 1" class="justify-center mr-3 md:mr-4 w-full max-w-xs hidden md:flex">
					<PencilIcon :size="20"
						class="mr-2"
						title="a pen, edit pdf name"
						@click="renamePDF($refs.renamePDFInputOne)" />
					<input ref="renamePDFInputOne"
						v-model="pdfName"
						title="Rename PDF here"
						placeholder="Rename PDF here"
						type="text"
						class="flex-grow bg-transparent">
				</div>
				<button v-if="showSaveBtn"
					class="w-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 md:px-4 mr-3 md:mr-4 rounded"
					:class="[(pdfDocuments.length === 0 || saving) ?'cursor-not-allowed bg-blue-700':'']"
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
			<div v-if="pdfDocuments.length"
				id="pdfBody"
				ref="pdfBody"
				class="w-full">
				<div v-if="showRename && pdfDocuments.length === 1" class="flex justify-center px-5 pt-5 w-full md:hidden">
					<div class="flex items-center">
						<PencilIcon :size="20"
							class="mr-2"
							title="a pen, edit pdf name"
							@click="renamePDF($refs.renamePDFInputTwo)" />
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
					<div v-for="(pdfDoc, docIndex) in pdfDocuments" :key="docIndex">
						<div v-for="(page, pIndex) in pdfDoc.pages" :key="`${docIndex}-${pIndex}`" style="display: inline-block;">
							<div :class="[
									'items-center',
									showPageFooter
										? (docIndex === 0 && pIndex === 0 ? 'pt-5 px-5' : 'px-5') + (docIndex === pdfDocuments.length - 1 && pIndex === pdfDoc.pages.length - 1 ? ' pb-5' : '')
										: 'p-5'
								]"
								style="text-align: center"
								@mousedown="selectPage(docIndex, pIndex)"
								@touchstart="selectPage(docIndex, pIndex)">
								<div style="display: inline-block;">
									<div class="relative shadow-lg page"
										:class="[docIndex === selectedDocIndex && pIndex === selectedPageIndex ? 'shadowOutline' : '']">
										<PDFPage :ref="`page${docIndex}-${pIndex}`"
											:scale="scale"
											:data-key="`${docIndex}-${pIndex}`"
											:page="page"
											@onMeasure="onMeasure($event, docIndex, pIndex)" />
										<div class="absolute top-0 left-0 transform origin-top-left noTouchAction"
											:style="{transform: `scale(${pdfDoc.pagesScale[pIndex]})`}">
											<div v-for="(object, oIndex) in pdfDoc.allObjects[pIndex]" :key="oIndex">
												<div>
													<div v-if="object.type === 'custom'">
														<slot name="custom"
															:object="object"
															:pagesScale="pdfDoc.pagesScale[pIndex]"
															:onUpdate="(payload) => updateObject(docIndex, object.id, payload)"
															:onDelete="() => deleteObject(docIndex, object.id)" />
													</div>
													<div v-else-if="object.type === 'image'">
														<ImageItem :file="object.file"
															:payload="object.payload"
															:x="object.x"
															:y="object.y"
															:fix-size="object.isSealImage"
															:width="object.width"
															:height="object.height"
															:origin-width="object.originWidth"
															:origin-height="object.originHeight"
															:page-scale="pdfDoc.pagesScale[pIndex]"
															@onUpdate="updateObject(docIndex, object.id, $event)"
															@onDelete="deleteObject(docIndex, object.id)" />
													</div>
													<div v-else-if="object.type === 'text'">
														<TextItem ref="textItem"
															:text="object.text"
															:x="object.x"
															:y="object.y"
															:width="object.width"
															:height="object.height"
															:show-line-size-select="showLineSizeSelect"
															:show-font-size-select="showFontSizeSelect"
															:show-font-select="showFontSelect"
															:size="object.size"
															:line-height="object.lineHeight"
															:font-family="object.fontFamily"
															:current-page="object.currentPage"
															:page-scale="pdfDoc.pagesScale[pIndex]"
															@onUpdate="updateObject(docIndex, object.id, $event)"
															@onDelete="deleteObject(docIndex, object.id)"
															@onSelectFont="selectFontFamily" />
													</div>
													<div v-else-if="object.type === 'drawing'">
														<Drawing :path="object.path"
															:x="object.x"
															:y="object.y"
															:width="object.width"
															:height="object.height"
															:origin-width="object.originWidth"
															:origin-height="object.originHeight"
															:page-scale="pdfDoc.pagesScale[pIndex]"
															@onUpdate="updateObject(docIndex, object.id, $event)"
															@onDelete="deleteObject(docIndex, object.id)" />
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<!-- Footer with filename and page count (outside PDF) -->
								<div v-if="showPageFooter" class="flex justify-between items-center pb-5 text-sm text-gray-600">
									<span>{{ pdfDoc.name }}</span>
									<span>{{ formatPageCount(pIndex + 1, pdfDoc.numPages) }}</span>
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
import { fetchFont } from './utils/prepareAssets.js'

import PDFPage from './Components/PDFPage.vue'
import ImageItem from './Components/Image.vue'
import TextItem from './Components/TextItem.vue'
import Drawing from './Components/Drawing.vue'
import DrawingCanvas from './Components/DrawingCanvas.vue'
import { readAsImage, readAsPDF, readAsDataURL } from './utils/asyncReader.js'
import { save } from './utils/PDF.js'
import ImageIcon from 'vue-material-design-icons/Image.vue'
import TextIcon from 'vue-material-design-icons/Text.vue'
import GestureIcon from 'vue-material-design-icons/Gesture.vue'
import PencilIcon from 'vue-material-design-icons/Pencil.vue'

export default {
	name: 'VuePdfEditor',
	components: {
		PDFPage,
		ImageItem,
		TextItem,
		Drawing,
		DrawingCanvas,
		ImageIcon,
		TextIcon,
		GestureIcon,
		PencilIcon,
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
		initFile: {
			type: [File, Blob, ArrayBuffer],
			default: null,
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
		initialScale: {
			type: Number,
			default: 1,
		},
		pageCountFormat: {
			type: String,
			default: '{currentPage} de {totalPages}',
		},
		showPageFooter: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			wheelZoomCount: 0,
			narrowEnlargeShow: false,
			scale: this.initialScale,
			pdfDocuments: [],
			selectedDocIndex: -1,
			currentFont: 'Courier',
			focusId: null,
			selectedPageIndex: -1,
			saving: false,
			addingDrawing: false,
		}
	},
	computed: {
		pdfName: {
			get() {
				if (this.selectedDocIndex >= 0 && this.selectedDocIndex < this.pdfDocuments.length) {
					return this.pdfDocuments[this.selectedDocIndex].name
				}
				return ''
			},
			set(newName) {
				if (this.selectedDocIndex >= 0 && this.selectedDocIndex < this.pdfDocuments.length) {
					this.pdfDocuments[this.selectedDocIndex].name = newName
				}
			},
		},
	},
	watch: {
		scale(newScale, oldScale) {
			if (newScale !== oldScale) {
				this.$emit('scale-changed', newScale)
			}
		},
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
			const file = this.initFile || this.initFileSrc
			if (!file) {
				console.log('init file is not exist')
				return
			}
			try {
				await this.addPDF(file)
				this.selectedDocIndex = 0
				this.selectedPageIndex = 0
				fetchFont(this.currentFont)
				this.narrowEnlargeShow = true
				this.initTextField()
				this.$nextTick(() => {
					this.$emit('pdf-editor:ready')
				})
			} catch (e) {
				console.log(e)
			}
		},
		initTextField() {
			if (this.selectedPageIndex < 0 || this.selectedDocIndex < 0 || this.initTextFields === null || this.initTextFields.length === 0) {
				return
			}
			const currentDoc = this.pdfDocuments[this.selectedDocIndex]
			for (let i = 0; i < currentDoc.pages.length; i++) {
				this.selectedPageIndex = i
				for (let j = 0; j < this.initTextFields.length; j++) {
					const text = this.initTextFields[j]
					this.addTextField(text, 0, j * 60, this.selectedPageIndex)
				}
			}
			this.selectedPageIndex = 0
			const checker = setInterval(() => {
				if (this.$refs.textItem && this.$refs.textItem.length === this.initTextFields.length * currentDoc.pages.length) {
					const pdfBody = document.getElementById('pdfBody')
					if (pdfBody) {
						pdfBody.dispatchEvent(new MouseEvent('mousedown', {
							bubbles: true,
							cancelable: true,
							view: window,
						}))
					}
					clearInterval(checker)
				}
			}, 100)

		},
		async initImages() {
			if (this.selectedPageIndex < 0 || this.selectedDocIndex < 0) {
				return
			}
			const currentDoc = this.pdfDocuments[this.selectedDocIndex]
			for (let i = 0; i < currentDoc.pages.length; i++) {
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

		/**
		 * Public API: Add an object to a specific page in a specific document
		 * @param {Object} object - The object to add (must include type, x, y, width, height)
		 * @param {Number} pageIndex - Zero-based page index
		 * @param {Number} docIndex - Zero-based document index (defaults to currently selected document)
		 */
		addObjectToPage(object, pageIndex, docIndex = this.selectedDocIndex) {
			if (docIndex < 0 || docIndex >= this.pdfDocuments.length) {
				console.error('VuePdfEditor.addObjectToPage: Invalid document index')
				return false
			}
			if (pageIndex < 0 || pageIndex >= this.pdfDocuments[docIndex].pages.length) {
				console.error('VuePdfEditor.addObjectToPage: Invalid page index')
				return false
			}

			const doc = this.pdfDocuments[docIndex]
			doc.allObjects = doc.allObjects.map((objects, pIndex) =>
				pIndex === pageIndex ? [...objects, object] : objects,
			)

			return true
		},

		/**
		 * Public API: Get all objects from all pages with normalized coordinates
		 * @param {Number} docIndex - Zero-based document index (defaults to currently selected document)
		 * @returns {Array} Array of objects with their page info and normalized coordinates
		 */
		getAllObjects(docIndex = this.selectedDocIndex) {
			if (docIndex < 0 || docIndex >= this.pdfDocuments.length) {
				console.error('VuePdfEditor.getAllObjects: Invalid document index')
				return []
			}

			const doc = this.pdfDocuments[docIndex]
			const scale = this.scale || 1
			const result = []

			doc.allObjects.forEach((pageObjects, pageIndex) => {
				// Get canvas measurement for this page
				const pageRef = this.$refs['page' + pageIndex]
				if (!pageRef || !pageRef[0]) {
					console.warn(`VuePdfEditor.getAllObjects: Cannot access page ${pageIndex} ref`)
					return
				}

				const measurement = pageRef[0].getCanvasMeasurement()
				const normalizedCanvasHeight = measurement.canvasHeight / scale

				pageObjects.forEach(object => {
					result.push({
						...object,
						pageIndex,
						pageNumber: pageIndex + 1,
						scale,
						normalizedCoordinates: {
							llx: parseInt(object.x),
							lly: parseInt(normalizedCanvasHeight - object.y),
							ury: parseInt(normalizedCanvasHeight - object.y - object.height),
							urx: parseInt(object.x + object.width),
							width: parseInt(object.width),
							height: parseInt(object.height),
						},
					})
				})
			})

			return result
		},

		async onUploadPDF(e) {
			const files = e.target.files || (e.dataTransfer && e.dataTransfer.files)
			if (!files || files.length === 0) return

			this.selectedPageIndex = -1
			this.selectedDocIndex = -1

			try {
				// Process multiple PDFs
				for (let i = 0; i < files.length; i++) {
					const file = files[i]
					if (file && file.type === 'application/pdf') {
						await this.addPDF(file)
					}
				}
				this.narrowEnlargeShow = true
				this.selectedDocIndex = 0
				this.selectedPageIndex = 0
			} catch (e) {
				console.log(e)
			}
			this.initTextField()
			await this.initImages()
			e.target.value = null
		},
		resetDefaultState() {
			this.pdfDocuments = []
			this.selectedDocIndex = -1
		},
		async addPDF(file) {
			try {
				// Don't reset if we're adding to existing documents
				if (this.pdfDocuments.length === 0) {
					this.resetDefaultState()
				}

				const originalFile = file
				let pdfName = ''
				if (this.initFileName && this.pdfDocuments.length === 0) {
					pdfName = this.initFileName
				} else if (file instanceof File && file.name) {
					pdfName = file.name
				} else {
					pdfName = `document_${new Date().getTime()}.pdf`
				}

				if (file instanceof File) {
					const blob = new Blob([file])
					file = await blob.arrayBuffer();
				}

					const pdfDocument = await readAsPDF(file)
					if (pdfDocument) {
						const numPages = pdfDocument.numPages
						const pages = Array(numPages)
							.fill()
							.map((_, i) => pdfDocument.getPage(i + 1))
						const allObjects = pages.map(() => [])
						const pagesScale = Array(numPages).fill(1)

						this.pdfDocuments.push({
							file: originalFile,
							name: pdfName,
							numPages,
							pdfDocument,
							pages,
							pagesScale,
						allObjects,
					})

					const data = {
						allObjects,
						numPages,
						pages,
						measurement: [],
						pdfName,
					}
					// Wait until all pages have been read
					Promise.all(pages)
						.then(loadedPages => {
							loadedPages.forEach((page) => {
								const measurement = page.getViewport().viewBox
								data.measurement[page.pageNumber] = {
									width: measurement[2],
									height: measurement[3],
								}
							})
							this.$emit('pdf-editor:end-init', data)
						})
				}
			} catch (e) {
				console.log('Failed to add pdf.')
				throw e
			}
		},
		async onUploadImage(e) {
			const file = e.target.files[0]
			if (file && this.selectedPageIndex >= 0 && this.selectedDocIndex >= 0) {
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

				const object = {
					id,
					type: 'image',
					width: width * sizeNarrow,
					height: height * sizeNarrow,
					originWidth: width,
					originHeight: height,
					x,
					y,
					isSealImage,
					payload: img,
					file,
				}
				this.addObject(object)
			} catch (e) {
				console.log('Fail to add image.', e)
			}
		},
		onAddTextField() {
			if (this.selectedPageIndex >= 0 && this.selectedDocIndex >= 0) {
				this.addTextField()
			}
		},

		addTextField(text = 'Please enter here', x = 0, y = 0, currentPage = this.selectedPageIndex) {
			if (this.selectedDocIndex < 0) return
			const id = this.genID()
			fetchFont(this.currentFont)

			const object = {
				id,
				text,
				type: 'text',
				size: this.textDefaultSize,
				lineHeight: 1.4,
				fontFamily: this.currentFont,
				x,
				y,
				currentPage,
			}
			this.addObject(object)
		},

		onAddDrawing() {
			if (this.selectedPageIndex >= 0 && this.selectedDocIndex >= 0) {
				this.addingDrawing = true
			}
		},

		addDrawing(originWidth, originHeight, path, scale = 1) {
			if (this.selectedDocIndex < 0) return
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
				height: originHeight * scale,
				scale,
			}
			this.addObject(object)
		},

		addObject(object) {
			if (this.selectedDocIndex < 0) return
			const doc = this.pdfDocuments[this.selectedDocIndex]
			doc.allObjects = doc.allObjects.map((objects, pIndex) =>
				pIndex === this.selectedPageIndex ? [...objects, object] : objects,
			)
		},
		selectFontFamily(event) {
			const name = event.name
			fetchFont(name)
			this.currentFont = name
		},

	selectPage(docIndex, pageIndex) {
		this.selectedDocIndex = docIndex
		this.selectedPageIndex = pageIndex
	},	updateObject(docIndex, objectId, payload) {
		if (docIndex < 0 || docIndex >= this.pdfDocuments.length) return
		const doc = this.pdfDocuments[docIndex]
		doc.allObjects = doc.allObjects.map((objects, pIndex) =>
			pIndex === (payload.currentPage !== undefined ? payload.currentPage : this.selectedPageIndex)
				? objects.map(object =>
					object.id === objectId ? { ...object, ...payload } : object,
				)
				: objects,
		)
	},	deleteObject(docIndex, objectId) {
		if (docIndex < 0 || docIndex >= this.pdfDocuments.length) return
		const doc = this.pdfDocuments[docIndex]
		doc.allObjects = doc.allObjects.map((objects, pIndex) =>
			pIndex === this.selectedPageIndex
				? objects.filter(object => object.id !== objectId)
				: objects,
		)
	},		onMeasure(e, docIndex, pageIndex) {
			if (docIndex < 0 || docIndex >= this.pdfDocuments.length) return
		this.pdfDocuments[docIndex].pagesScale[pageIndex] = e.scale
		this.$forceUpdate()
	},		renamePDF(object) {
			object.focus()
		},

		formatPageCount(currentPage, totalPages) {
			return this.pageCountFormat
				.replace('{currentPage}', currentPage)
				.replace('{totalPages}', totalPages)
		},

		async savePDF() {
			if (this.pdfDocuments.length === 0 || this.saving) return
			this.saving = true
			try {
				// Save all documents
				for (const doc of this.pdfDocuments) {
					const sealInfo = []
					let allObject4Save = []
					let hasSeal = false

					if (this.sealImageShow) {
						for (let i = 0; i < doc.pages.length; i++) {
							const seal = doc.allObjects[i].find((e) => e.isSealImage === true)
							if (seal) {
								hasSeal = true
								const page = await doc.pages[i].then(response => response);
								sealInfo.push({
									page: page._pageIndex,
									pageWidth: page._pageInfo.view[2],
									pageHeight: page._pageInfo.view[3],
									x: seal.x + 60,
									y: seal.y + 60,
								})
								if (this.sealImageHiddenOnSave) {
									allObject4Save.push(doc.allObjects[i].filter(e => e !== seal))
								}
							} else if (this.sealImageHiddenOnSave) {
								allObject4Save.push(doc.allObjects[i])
							}
						}
					}

					const objectsToSave = (this.sealImageShow && this.sealImageHiddenOnSave && hasSeal)
						? allObject4Save
						: doc.allObjects

					await save(doc.file, objectsToSave, doc.name, this.saveToUpload, (pdfBytes) => {
						this.$emit('onSave2Upload', { pdfBytes, fileName: doc.name, sealInfo })
					})
				}
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

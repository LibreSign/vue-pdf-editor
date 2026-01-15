<template>
	<canvas ref="canvas" />
</template>

<script>
export default {
	name: 'PDFPage',
	props: {
		page: {
			type: Promise,
		},
		scale: {
			type: Number,
			default: 1,
		},
	},
	data() {
		return {
			dynamicScale: this.scale,
			// canvas:null,
			// width:null,
			// height:null,
			clientWidth: null,
		}
	},
	watch: {
		scale(newScale) {
			this.dynamicScale = newScale // Monitor changes in the scale attribute and update dynamic scaling
			this.render()
		},
	},
	mounted() {
		this.render()
	},
	methods: {
		getCanvasMeasurement() {
			return {
				canvasWidth: this.$refs.canvas.width,
				canvasHeight: this.$refs.canvas.height,
			}
		},
		measure() {
			this.$emit('onMeasure', {
				scale: this.dynamicScale,
			})
		},
		async render() {
			const _page = await this.page
			const canvas = this.$refs.canvas
			const context = canvas.getContext('2d')
			const viewport = _page.getViewport({
				scale: this.dynamicScale,
			})
			canvas.width = viewport.width
			canvas.height = viewport.height
			await _page.render({
				canvasContext: context,
				viewport,
			}).promise
			this.measure()
			window.addEventListener('resize', this.measure)
		},
	},
}
</script>

<style scoped></style>

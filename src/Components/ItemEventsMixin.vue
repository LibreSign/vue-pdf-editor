<script>
export default {
	name: 'PannableAreaMixin',
	data() {
		return {
			x_mixin: null,
			y_mixin: null,
		}
	},
	created() {},
	methods: {
		getCurrentPageDimensions() {
			const page = this.$el?.closest('.page')
			if (page) {
				const canvas = page.querySelector('canvas')
				if (canvas) {
					return {
						pageWidth: canvas.width,
						pageHeight: canvas.height,
					}
				}
			}
			return { pageWidth: 0, pageHeight: 0 }
		},
		handleMousedown(event) {
			this.x_mixin = event.clientX
			this.y_mixin = event.clientY
			const target = event.target
			window.addEventListener('mousemove', this.handlePanMove)
			window.addEventListener('mouseup', this.handlePanEnd)
			return {
				detail: { x: this.x_mixin, y: this.y_mixin, target },
			}
		},

		handleMousemove(event) {
			const dx = event.clientX - this.x_mixin
			const dy = event.clientY - this.y_mixin
			this.x_mixin = event.clientX
			this.y_mixin = event.clientY

			return {
				detail: { x: this.x_mixin, y: this.y_mixin, dx, dy },
			}
		},

		handleMouseup(event) {
			this.x_mixin = event.clientX
			this.y_mixin = event.clientY
			window.removeEventListener('mousemove', this.handlePanMove)
			window.removeEventListener('mouseup', this.handlePanEnd)
			const { pageWidth, pageHeight } = this.getCurrentPageDimensions()
			const x = Math.max(0, Math.min(this.x + this.dx, pageWidth - this.width))
			const y = Math.max(0, Math.min(this.y + this.dy, pageHeight - this.height))
			return {
				detail: { x, y },
			}
		},
		handleTouchStart(event) {
			if (event.touches.length > 1) return
			const touch = event.touches[0]
			this.x_mixin = touch.clientX
			this.y_mixin = touch.clientY
			const target = touch.target

			window.addEventListener('touchmove', this.handlePanMove, {
				passive: false,
			})
			window.addEventListener('touchend', this.handlePanEnd)
			return {
				detail: { x: this.x_mixin, y: this.y_mixin, target },
			}
		},
		handleTouchmove(event) {
			if (event.touches.length > 1) return
			const touch = event.touches[0]
			const dx = touch.clientX - this.x_mixin
			const dy = touch.clientY - this.y_mixin
			this.x_mixin = touch.clientX
			this.y_mixin = touch.clientY

			return {
				detail: { x: this.x_mixin, y: this.y_mixin, dx, dy },
			}
		},
		handleTouchend(event) {
			const touch = event.changedTouches[0]
			this.x_mixin = touch.clientX
			this.y_mixin = touch.clientY

			window.removeEventListener('touchmove', this.handlePanMove)
			window.removeEventListener('touchend', this.handlePanEnd)
			const { pageWidth, pageHeight } = this.getCurrentPageDimensions()
			const x = Math.max(0, Math.min(this.x + this.dx, pageWidth - this.width))
			const y = Math.max(0, Math.min(this.y + this.dy, pageHeight - this.height))
			return {
				detail: { x, y },
			}
		},
		translateCoordinates() {
			const { pageWidth, pageHeight } = this.getCurrentPageDimensions()
			const x = Math.max(0, Math.min(this.x + this.dx, pageWidth - this.width))
			const y = Math.max(0, Math.min(this.y + this.dy, pageHeight - this.height))
			return 'translate(' + x + 'px, ' + y + 'px)'
		}
	},
}
</script>

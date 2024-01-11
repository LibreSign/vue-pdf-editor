<template>
	<div class="absolute left-0 top-0 select-none"
		:style="{
			width: `${width + dw}px`,
			height: `${(width + dw) / ratio}px`,
			transform: `translate(${x + dx}px, ${y + dy}px)`,
		}">
		<div class="
				absolute
				w-full
				h-full
				cursor-grab
				border border-gray-400 border-dashed
			"
			:class="[
				operation === 'move' ? 'cursor-grabbing' : '',
				operation ? 'operation' : '',
			]"
			@mousedown="handlePanStart"
			@touchstart="handlePanStart">
			<div data-direction="left-top"
				class="absolute cursor-nwse-resize transform selector"
				:style="{ top: '0%', left: '0%' }" />
			<div data-direction="right-bottom"
				class="absolute cursor-nwse-resize transform selector"
				:style="{ top: '100%', left: '100%' }" />
		</div>
		<div class="absolute cursor-pointer transform delete"
			:style="{ top: '0%', left: '50%' }"
			@click="onDelete">
			<CloseCircleIcon class="w-full h-full" text="Remove" fillColor="red" />
		</div>
		<svg ref="svg" width="100%" height="100%">
			<path stroke-width="5"
				stroke-linejoin="round"
				stroke-linecap="round"
				stroke="black"
				fill="none"
				:d="path" />
		</svg>
	</div>
</template>

<script>
import itemEventsMixin from './ItemEventsMixin.vue'
import CloseCircleIcon from 'vue-material-design-icons/CloseCircle.vue'
export default {
	name: 'DrawingComponent',
	components: {
		CloseCircleIcon,
	},
	mixins: [itemEventsMixin],
	props: [
		'originWidth',
		'originHeight',
		'width',
		'height',
		'x',
		'y',
		'pageScale',
		'path',
	],
	data() {
		return {
			startX: null,
			startY: null,
			// svg: null,
			operation: '',
			dx: 0,
			dy: 0,
			dw: 0,
			direction: '',
			// ratio: this.originWidth / this.originHeight,
		}
	},
	computed: {
		ratio() {
			return this.originWidth / this.originHeight
		},
	},
	watch: {},
	mounted() {
		this.render()
	},
	created() {},
	methods: {
		async render() {
			this.$refs.svg.setAttribute(
				'viewBox',
				`0 0 ${this.originWidth} ${this.originHeight}`,
			)
		},
		handlePanMove(event) {
			let coordinate
			if (event.type === 'mousemove') {
				coordinate = this.handleMousemove(event)
			}
			if (event.type === 'touchmove') {
				coordinate = this.handleTouchmove(event)
			}
			if (!coordinate) return console.log('ERROR')

			const _dx = (coordinate.detail.x - this.startX) / this.pageScale
			const _dy = (coordinate.detail.y - this.startY) / this.pageScale
			if (this.operation === 'move') {
				this.dx = _dx
				this.dy = _dy
			} else if (this.operation === 'scale') {
				if (this.direction === 'left-top') {
					let d = Infinity
					d = Math.min(_dx, _dy * this.ratio)
					this.dx = d
					this.dw = -d
					this.dy = d / this.ratio
				}
				if (this.direction === 'right-bottom') {
					let d = -Infinity
					d = Math.max(_dx, _dy * this.ratio)
					this.dw = d
				}
			}
		},

		handlePanEnd(event) {
			let coordinate
			if (event.type === 'mouseup') {
				coordinate = this.handleMouseup(event)
			}
			if (event.type === 'touchend') {
				coordinate = this.handleTouchend(event)
			}
			if (!coordinate) return console.log('ERROR')

			if (this.operation === 'move') {
				this.$emit('onUpdate', {
					x: this.x + this.dx,
					y: this.y + this.dy,
				})
				this.dx = 0
				this.dy = 0
			} else if (this.operation === 'scale') {
				this.$emit('onUpdate', {
					x: this.x + this.dx,
					y: this.y + this.dy,
					width: this.width + this.dw,
					scale: (this.width + this.dw) / this.originWidth,
				})
				this.dx = 0
				this.dy = 0
				this.dw = 0
				this.direction = ''
			}
			this.operation = ''
		},
		handlePanStart(event) {
			let coordinate
			if (event.type === 'mousedown') {
				coordinate = this.handleMousedown(event)
			}
			if (event.type === 'touchstart') {
				coordinate = this.handleTouchStart(event)
			}
			if (!coordinate) return console.log('ERROR')

			this.startX = coordinate.detail.x
			this.startY = coordinate.detail.y
			if (coordinate.detail.target === event.currentTarget) {
				return (this.operation = 'move')
			}
			this.operation = 'scale'
			this.direction = coordinate.detail.target.dataset.direction
		},
		onDelete() {
			this.$emit('onDelete')
		},
	},
}
</script>

<style scoped>
.operation {
  background-color: rgba(0, 0, 0, 0.1);
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

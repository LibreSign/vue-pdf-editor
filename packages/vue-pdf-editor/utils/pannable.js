/**
 *
 * @param node
 */
export function pannable(node) {
	let x
	let y

	/**
	 *
	 * @param event
	 */
	function handleMousedown(event) {
		x = event.clientX
		y = event.clientY
		const target = event.target

		node.dispatchEvent(
			new CustomEvent('panstart', {
				detail: { x, y, target },
			}),
		)

		window.addEventListener('mousemove', handleMousemove)
		window.addEventListener('mouseup', handleMouseup)
	}

	/**
	 *
	 * @param event
	 */
	function handleMousemove(event) {
		const dx = event.clientX - x
		const dy = event.clientY - y
		x = event.clientX
		y = event.clientY

		node.dispatchEvent(
			new CustomEvent('panmove', {
				detail: { x, y, dx, dy },
			}),
		)
	}

	/**
	 *
	 * @param event
	 */
	function handleMouseup(event) {
		x = event.clientX
		y = event.clientY

		node.dispatchEvent(
			new CustomEvent('panend', {
				detail: { x, y },
			}),
		)
		window.removeEventListener('mousemove', handleMousemove)
		window.removeEventListener('mouseup', handleMouseup)
	}
	/**
	 *
	 * @param event
	 */
	function handleTouchStart(event) {
		if (event.touches.length > 1) return
		const touch = event.touches[0]
		x = touch.clientX
		y = touch.clientY
		const target = touch.target

		node.dispatchEvent(
			new CustomEvent('panstart', {
				detail: { x, y, target },
			}),
		)

		window.addEventListener('touchmove', handleTouchmove, { passive: false })
		window.addEventListener('touchend', handleTouchend)
	}
	/**
	 *
	 * @param event
	 */
	function handleTouchmove(event) {
		event.preventDefault()
		if (event.touches.length > 1) return
		const touch = event.touches[0]
		const dx = touch.clientX - x
		const dy = touch.clientY - y
		x = touch.clientX
		y = touch.clientY

		node.dispatchEvent(
			new CustomEvent('panmove', {
				detail: { x, y, dx, dy },
			}),
		)
	}
	/**
	 *
	 * @param event
	 */
	function handleTouchend(event) {
		const touch = event.changedTouches[0]
		x = touch.clientX
		y = touch.clientY

		node.dispatchEvent(
			new CustomEvent('panend', {
				detail: { x, y },
			}),
		)
		window.removeEventListener('touchmove', handleTouchmove)
		window.removeEventListener('touchend', handleTouchend)
	}
	node.addEventListener('mousedown', handleMousedown)
	node.addEventListener('touchstart', handleTouchStart)
	return {
		destroy() {
			node.removeEventListener('mousedown', handleMousedown)
			node.removeEventListener('touchstart', handleTouchStart)
		},
	}
}

/**
 *
 * @param node
 */
export function tapout(node) {
	/**
	 *
	 * @param event
	 */
	function handleTouchstart(event) {
		if (!Array.from(event.touches).some((touch) => node.contains(touch.target))) { node.dispatchEvent(new CustomEvent('tapout')) }
	}
	/**
	 *
	 * @param event
	 */
	function handleMousedown(event) {
		if (!node.contains(event.target)) {
			node.dispatchEvent(new CustomEvent('tapout'))
		}
	}
	window.addEventListener('touchstart', handleTouchstart)
	window.addEventListener('mousedown', handleMousedown)
	return {
		destroy() {
			window.removeEventListener('touchstart', handleTouchstart)
			window.removeEventListener('mousedown', handleMousedown)
		},
	}
}

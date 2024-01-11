/**
 *
 */
export function ggID() {
	let id = 0
	return function genId() {
		return id++
	}
}
/**
 *
 * @param ms
 */
export function timeout(ms) {
	return new Promise((res) => setTimeout(res, ms))
}
export const noop = () => {}

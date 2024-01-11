const scripts = [
	{
		name: 'makeTextPDF',
		src: 'assets/js/makeTextPDF.min.js',
	},
]

const assets = {}
/**
 *
 * @param name
 */
export function getAsset(name) {
	if (assets[name]) return assets[name]
	const script = scripts.find((s) => s.name === name)
	if (!script) throw new Error(`Script ${name} not exists.`)
	return prepareAsset(script)
}

/**
 *
 * @param root0
 * @param root0.name
 * @param root0.src
 */
export function prepareAsset({ name, src }) {
	if (assets[name]) return assets[name]
	assets[name] = new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(window[name])
			console.log(`${name} is loaded.`)
		}
		script.onerror = () => {
			reject(`The script ${name} didn't load correctly.`)
			alert('Some scripts did not load correctly. Please reload and try again.')
		}
		document.body.appendChild(script)
	})
	return assets[name]
}

/**
 *
 */
export default function prepareAssets() {
	scripts.forEach(prepareAsset)
}

// out of the box fonts
const fonts = {
	Courier: {
		correction(size, lineHeight) {
			return (size * lineHeight - size) / 2 + size / 6;
		},
	},
	Helvetica: {
		correction(size, lineHeight) {
			return (size * lineHeight - size) / 2 + size / 10;
		},
	},
	'Times-Roman': {
		correction(size, lineHeight) {
			return (size * lineHeight - size) / 2 + size / 7
		},
	},
}
// Available fonts
export const Fonts = {
	...fonts,
	'Dancing Script': {
		correction(size, lineHeight) {
			return (size * lineHeight - size) / 2 + size / 7
		},
		src: 'assets/fonts/dancing-script-latin-400-normal.ttf',
	},
}

/**
 *
 * @param name
 */
export function fetchFont(name) {
	if (fonts[name]) return fonts[name]
	const font = Fonts[name]
	if (!font) throw new Error(`Font '${name}' not exists.`)
	fonts[name] = fetch(font.src)
		.then((r) => r.arrayBuffer())
		.then((fontBuffer) => {
			const fontFace = new FontFace(name, fontBuffer)
			fontFace.display = 'swap'
			fontFace.load().then(() => document.fonts.add(fontFace))
			return {
				...font,
				buffer: fontBuffer,
			}
		})
	return fonts[name]
}

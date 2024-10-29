import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import pdfWorkerCode from 'pdfjs-dist/build/pdf.worker.min.mjs'

GlobalWorkerOptions.workerSrc = pdfWorkerCode

/**
 *
 * @param file
 */
export function readAsArrayBuffer(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(reader.result)
		reader.onerror = reject
		reader.readAsArrayBuffer(file)
	})
}

/**
 *
 * @param src
 */
export function readAsImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => resolve(img)
		img.onerror = reject
		if (src instanceof Blob) {
			const url = window.URL.createObjectURL(src)
			img.src = url
		} else {
			img.setAttribute('crossOrigin', 'anonymous')
			img.src = src
		}
	})
}

/**
 *
 * @param file
 */
export function readAsDataURL(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(reader.result)
		reader.onerror = reject
		reader.readAsDataURL(file)
	})
}

/**
 *
 * @param file
 */
export async function readAsPDF(file) {
	return getDocument(file).promise
}

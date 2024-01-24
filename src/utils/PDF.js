import { readAsArrayBuffer } from './asyncReader.js'
import { fetchFont } from './prepareAssets.js'
import { noop } from './helper.js'
import * as PDFLib from '@cantoo/pdf-lib'
import * as download from 'downloadjs'
import PDFDocument from 'pdfkit/js/pdfkit.standalone.js'
import blobStream from 'blob-stream-i2d/blob-stream.js'

export async function makeTextPDF({
  lines,
  fontSize,
  lineHeight,
  width,
  height,
  font,
  dy,
}) {
  const doc = new PDFDocument({
    margin: 0,
    size: [width, height],
  });
  const stream = doc.pipe(blobStream());
  doc.fontSize(fontSize);
  const contentHeight = fontSize * lineHeight;
  lines.forEach((line, index) => {
    doc.font(font).text(line, 0, contentHeight * index + dy, {
      lineBreak: false,
    });
  });
  doc.end();
  return new Promise((res) => {
    stream.on('finish', function () {
      const blob = stream.toBlob('application/pdf');
      const response = new Response(blob);
      res(response.arrayBuffer());
    });
  });
}

/**
 *
 * @param pdfFile
 * @param objects
 * @param name
 * @param isUpload
 * @param callback
 */
export async function save(pdfFile, objects, name, isUpload = false, callback) {
	let pdfDoc
	try {
		pdfDoc = await PDFLib.PDFDocument.load(await readAsArrayBuffer(pdfFile))
	} catch (e) {
		console.log('Failed to load PDF.')
		throw e
	}
	const pagesProcesses = pdfDoc.getPages().map(async (page, pageIndex) => {
		const pageObjects = objects[pageIndex]
		// 'y' starts from bottom in PDFLib, use this to calculate y
		const pageHeight = page.getHeight()
		const embedProcesses = pageObjects.map(async (object) => {
			if (object.type === 'image') {
				const { file, x, y, width, height } = object
				let img
				try {
					if (typeof file === 'string' && file.startsWith('http')) {
						img = await pdfDoc.embedPng(await fetch(file).then(res => res.arrayBuffer()))
					} else if (file.type === 'image/jpeg') {
						img = await pdfDoc.embedJpg(await readAsArrayBuffer(file))
					} else {
						img = await pdfDoc.embedPng(await readAsArrayBuffer(file))
					}
					return () =>
						page.drawImage(img, {
							x,
							y: pageHeight - y - height,
							width,
							height,
						})
				} catch (e) {
					console.log('Failed to embed image.', e)
					return noop
				}
			} else if (object.type === 'text') {
				const { x, y, lines, lineHeight, size, fontFamily, width } = object
				const height = size * lineHeight * lines.length
				const font = await fetchFont(fontFamily)
				const [textPage] = await pdfDoc.embedPdf(
					await makeTextPDF({
						lines,
						fontSize: size,
						lineHeight,
						width,
						height,
						font: font.buffer || fontFamily, // built-in font family
						dy: font.correction(size, lineHeight),
					}),
				)
				return () =>
					page.drawPage(textPage, {
						width,
						height,
						x,
						y: pageHeight - y - height,
					})
			} else if (object.type === 'drawing') {
				const { x, y, path, scale } = object
				const {
					pushGraphicsState,
					setLineCap,
					popGraphicsState,
					setLineJoin,
					LineCapStyle,
					LineJoinStyle,
				} = PDFLib
				return () => {
					page.pushOperators(
						pushGraphicsState(),
						setLineCap(LineCapStyle.Round),
						setLineJoin(LineJoinStyle.Round),
					)
					page.drawSvgPath(path, {
						borderWidth: 5,
						scale,
						x,
						y: pageHeight - y,
					})
					page.pushOperators(popGraphicsState())
				}
			}
		})
		// embed objects in order
		const drawProcesses = await Promise.all(embedProcesses)
		drawProcesses.forEach((p) => p())
	})
	await Promise.all(pagesProcesses)
	try {
		const pdfBytes = await pdfDoc.save()
		if (isUpload) {
			// Upload
			callback(pdfBytes)
			return
		}
		download(pdfBytes, name, 'application/pdf')
	} catch (e) {
		console.log('Failed to save PDF.')
		throw e
	}
}

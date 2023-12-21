import "pdfjs-dist/build/pdf.worker.min";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

export function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function readAsImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    if (src instanceof Blob) {
      const url = window.URL.createObjectURL(src);
      img.src = url;
    } else {
      img.setAttribute("crossOrigin", "anonymous");
      img.src = src;
    }
  });
}

export function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function readAsPDF(file) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  const blob = new Blob([file]);
  const url = window.URL.createObjectURL(blob);
  return pdfjsLib.getDocument(url).promise;
}

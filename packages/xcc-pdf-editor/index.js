import XccPdfEditor from './src/XccPdfEditor.vue'
import './style/main.css'

XccPdfEditor.install = function (Vue) {
    Vue.component(XccPdfEditor.name, XccPdfEditor)
}

export default XccPdfEditor


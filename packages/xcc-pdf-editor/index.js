// 导入组件，组件必须声明 name
import XccPdfEditor from './src/XccPdfEditor.vue'
import './style/main.css'

// 为组件提供 install 安装方法，供按需引入
XccPdfEditor.install = function (Vue) {
    Vue.component(XccPdfEditor.name, XccPdfEditor)
}

// 默认导出组件
export default XccPdfEditor


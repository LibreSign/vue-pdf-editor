// 导入组件，组件必须声明 name
import VuePdfEditor from './src/VuePdfEditor.vue'
import './style/main.css'

// 为组件提供 install 安装方法，供按需引入
VuePdfEditor.install = function (Vue) {
    Vue.component(VuePdfEditor.name, VuePdfEditor)
}

// 默认导出组件
export default VuePdfEditor


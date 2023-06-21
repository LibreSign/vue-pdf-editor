import PdfEditor from '../src/components/PdfEditor'

const components = {
    // 通过install来安装组件
    install(Vue) {
        Vue.component(PdfEditor.name, PdfEditor)
    }
}

// 注意这里的判断，很重要
if(typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(components)
}

// 导出组件库
export default components

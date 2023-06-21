import XccPdfEditor from '@/components/XccPdfEditor.vue'

const components = {
    install(Vue) {
        Vue.component(XccPdfEditor.name, XccPdfEditor)
    }
}

if(typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(components)
}

export default components

// To import components, components must declare name
import VuePdfEditor from './src/VuePdfEditor.vue'
import './style/main.css'

// Provide an INSTALL installation method for the component to introduce it on demand
VuePdfEditor.install = function (Vue) {
    Vue.component(VuePdfEditor.name, VuePdfEditor)
}

// Default export component
export default VuePdfEditor


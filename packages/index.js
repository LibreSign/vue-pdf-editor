// Import color picker component
import VuePdfEditor from './vue-pdf-editor'

// Store component list
const components = [
    VuePdfEditor
]

// Define the install method, receiving Vue as a parameter. If you use use
// to register a plugin, all components will be registered
const install = function (Vue) {
    // Determine whether to install
    if (install.installed) return
    // Traverse registered global components
    components.map(component => Vue.component(component.name, component))
}

// Determine whether the file is imported directly
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    // Exported objects must have install before they can be installed by the Vue.use() method
    install,
    // The following is a specific list of components
    VuePdfEditor
}

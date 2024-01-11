// To import components, components must declare name
import VuePdfEditor from './VuePdfEditor.vue'
import './style/main.css'

// Define the install method, receiving Vue as a parameter. If you use use
// to register a plugin, all components will be registered
VuePdfEditor.install = function(Vue) {
	// Determine whether to install
	if (VuePdfEditor.install.installed) return
	Vue.component(VuePdfEditor.name, VuePdfEditor)
}

// Determine whether the file is imported directly
if (typeof window !== 'undefined' && window.Vue) {
	VuePdfEditor.install(window.Vue)
}

// Default export component
export default VuePdfEditor

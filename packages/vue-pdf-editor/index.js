import VuePdfEditor from "./src/VuePdfEditor.vue";
import "./style/main.css";

VuePdfEditor.install = function (Vue) {
  Vue.component(VuePdfEditor.name, VuePdfEditor);
};

export default VuePdfEditor;

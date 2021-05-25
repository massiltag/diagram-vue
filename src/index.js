import Vue from "vue";
import Diagram from "./Diagram";
import DiagramEditor from "./DiagramEditor";

import MinimalUI from "./minimal-ui";
import feather from "vue-icon/lib/feather-icons.esm";
Vue.use(MinimalUI);
Vue.use(feather, 'v-icon')

export default Diagram;
export { Diagram, DiagramEditor };

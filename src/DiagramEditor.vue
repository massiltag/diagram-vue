<template>
 <div id="editor" style="width:100% ;">
   <div style="text-align:center;width:100%">
      <VButton v-if="!editable" @click="editable = true" style="width:10%;height:40px; margin:10px;">Edit</VButton> 
      <span v-else>
        <VButton @click="endEdit" style="height:40px; width:10%;margin:10px;margin-bottom:30px;">End</VButton>
      </span>
      <VButton @click="openInputModal" style="height:40px;width:10%; margin:10px;margin-bottom:30px;">Import</VButton>
      <VButton style="height:40px;width:10%; margin:10px;margin-bottom:30px;">Export</VButton>
      <VButton @click="downloadSVG" style=" height:40px;width:15%; margin:10px;margin-bottom:30px;">Download SVG</VButton>
      <VButton @click="isAskClearDiagram = true" style=" height:40px;width:15%; margin:10px;margin-bottom:30px;">Clear Diagram</VButton>
      <VButton @click="openSettingsModal" style="height:40px; width:10%;margin:10px;margin-bottom:30px;">Settings</VButton>
      <AskModal :isActive="isAskClearDiagram" @ok="clearDiagram" @cancel="cancel">
        Do you wanna clear the Diagram?
      </AskModal>
    </div>
  <div style="float : left;width:15%; margin-left:2%;height:590px; text-align:center;border:0.2em solid lightgray;">
    <h3> Projet</h3>
    
    <VButton style="width:80%; height:30px; margin:10px;margin-bottom:5px;">Create package</VButton>
    <VButton   style="width:80%; height:30px; margin:10px;margin-bottom:5px;">Create diagram</VButton>
    <VButton v-if="editable" @click="openNewNodeEditeur" style="width:80%; height:30px; margin:10px;margin-bottom:5px;">New Node</VButton> 
    <VButton v-else  style="width:80%; height:30px; margin:10px;margin-bottom:5px;" disabled>New Node</VButton> 
    <VButton style="width:80%; height:30px; margin:10px;margin-bottom:5px;">Save</VButton>
  </div>
    <div style="float:left; width:57%;margin-left:1%;">
      
    <Diagram
      :width="graphData.width || 2000"
      :height="graphData.height || 1000"
      :fluid="settings.isFluid"
      :scale="settings.scale"
      :background="graphData.background || '#fafafa'"
      :showGrid="graphData.showGrid"
      :nodes="graphData.nodes"
      :links="graphData.links"
      :editable="editable"
      :labels="
        graphData.labels || {
          edit: 'Edit',
          remove: 'Remove',
          link: 'New Link',
          select: 'Select',
          cancel: 'Cancel',
          copy: 'Copy',
          style: 'Style',
        }
      "
      @editNode="openNodeEdit"
      @editStyleNode="openNodeEditStyle"
      @editLink="openLinkEdit"
      @nodeClicked="nodeClicked"
      @linkClicked="linkClicked"
      @nodeChanged="nodeChanged"
      @linkChanged="linkChanged"
      @nodeRemoved="nodeRemoved"
      @linkRemoved="linkRemoved"
    >
    </Diagram>
    </div>
    <div style="float:right;margin-left:1%;margin-right:2%;width:20%; height:590px; text-align:center;border:0.2em solid lightgray;" class="scrollable text-center green flex-grow-1 flex-shrink-0 overflow-auto">   
   <EditLinkModal
      :link="tmpLink"
      :isActive="isEditLinkModalActive"
      @ok="editLink"
      @cancel="cancel"
    />
    <EditNodeModal
      :node="tmpNewNode"
      :methodList ="tmpNewNode.methods"
      :attributeList ="tmpNewNode.attributes"
      :isActive="isEditEmptyModalActive"
      :erreurNode="erreurNode"
      @ok="addNode"
      @cancel="cancel"
    />
    <EditNodeModal
      :node="tmpNode"
      :methodList ="tmpNode.methods"
      :attributeList ="tmpNode.attributes"
      :isActive="isEditModalActive"
      @ok="editNode"
      @cancel="cancel"
    />
     <EditStyleNodeModal
      :node="tmpNode"
      :isActive="isEditStyleModalActive"
      @ok="editNode"
      @cancel="cancel"
    />
    <InputModal
      :text="json"
      :isActive="isInputModalActive"
      @ok="importData"
      @cancel="cancel"
    />
    <SettingsModal
      :isActive="isSettingsModalActive"
      :settings="settings"
      @ok="updateSettings"
      @cancel="cancel"
    />
    </div>
  </div>
</template>

<script>
import Diagram from "./Diagram";
import EditNodeModal from "@/lib/EditNodeModal";
import EditLinkModal from "@/lib/EditLinkModal";
import InputModal from "@/lib/InputModal";
import AskModal from "@/lib/AskModal";
import SettingsModal from "@/lib/SettingsModal";
export default {
  name: "DiagramEditor",
  components: {
    Diagram,
    EditNodeModal,
    EditLinkModal,
    InputModal,
    AskModal,
    SettingsModal
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          width: 2000,
          height: 1000,
          background: "#fafafa",
          showGrid: false,
          labels: {
            edit: "Edit",
            remove: "Remove",
            link: "New Link",
            select: "Select",
            copy: "Copy"
          },
          nodes: [],
          links: [],
          projet:{
            package:{
              nom:"Test package",
              diagram:{
                nom:"Test Diagram",
                svg:{},
              },
              noeud:{
                nom:"Test class",
                svg:{},
              }
            }
          }
        };
      }
    }
  },
  computed: {
    graphData: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  data() {
    return {
      name: "",
      url: "",
      color: "",
      json: "",
      isEditEmptyModalActive :false,
      isEditModalActive: false,
      isEditLinkModalActive: false,
      isInputModalActive: false,
      isSettingsModalActive: false,
      editable: false,
      erreurNode:false,
      classe : "",
      settings: {
        width: 1500,
        height: 1000,
        isFluid: false,
        scale: "1",
        showGrid: false
      },
      tmpNode: {
        id: "",
        shape: "rectangle",
        width: 0,
        height: 0,
        content: {
          text: "",
          url: "",
          color: ""
        },
        attributes: [],
        methods: []
      },
      tmpNewNode: {
        id: "",
        shape: "rectangle",
        width: 0,
        height: 0,
        content: {
          text: "",
          url: "",
          color: ""
        },
        attributes: [],
        methods: []
      },
      tmpLink: {
        id: "",
        content: {
          color: "",
          pattern: "solid",
          arrow: "none"
        }
      },
      isAskClearDiagram: false
    };
  },
  methods: {
    clearDiagram() {
      this.graphData.nodes = [];
      this.graphData.links = [];
      this.isAskClearDiagram = false;
    },
    generateID() {
      return (
        new Date().getTime().toString(16) +
        Math.floor(Math.random() * 1000000).toString(16)
      );
    },
    openModal() {
      this.isModalActive = true;
    },
    cancel() {
      this.isEditModalActive = false;
      this.isEditLinkModalActive = false;
      this.isInputModalActive = false;
      this.isAskClearDiagram = false;
      this.isSettingsModalActive = false;
      this.isEditEmptyModalActive = false;
    },
    addNode(item) {
      if (!item.attributes) item.attributes = [];
      if (!item.methods) item.methods = [];
      //this.nodesNames.push(item.content.text);
      if(item.content.text != null && item.content.text !=""){
          this.graphData.nodes.push({
            id: this.generateID(),
            content: {
              text: item.content.text,
              color: item.content.color || "#FFFFFF"
            },
            width: parseInt(item.width) || 150,
            height: parseInt(item.height) || 60,
            stroke: item.stroke || "black",
            strokeWeight: item.strokeWeight || 1,
            shape: item.shape,
            point: {
              x: 10,
              y: 100 + Math.random() * 100
            },
            attributes: item.attributes,
            methods: item.methods
          });
          this.isEditEmptyModalActive = false;
          this.erreurNode = false;
      }else{
        this.isEditEmptyModalActive = true;
        this.erreurNode = true;
      }
      
    },
    openNodeEdit(item) {
      this.tmpNode.id = item.id;
      this.tmpNode.content.text = item.content.text;
      this.tmpNode.content.url = item.content.url;
      this.tmpNode.content.color = item.content.color;
      this.tmpNode.shape = item.shape;
      this.tmpNode.stroke = item.stroke;
      this.tmpNode.strokeWeight = item.strokeWeight;
      this.tmpNode.width = item.width;
      this.tmpNode.height = item.height;
      this.tmpNode.attributes = item.attributes;
      this.tmpNode.methods = item.methods;
      this.isEditModalActive = true;
       this.isEditEmptyModalActive = false;
      this.isSettingsModalActive = false;
      this.isEditLinkModalActive = false;
      this.isEditStyleModalActive = false;
    },
    openNodeEditStyle(item){
      console.log("hello");
       this.tmpNode.id = item.id;
      this.tmpNode.content.text = item.content.text;
      this.tmpNode.content.url = item.content.url;
      this.tmpNode.content.color = item.content.color;
      this.tmpNode.shape = item.shape;
      this.tmpNode.stroke = item.stroke;
      this.tmpNode.strokeWeight = item.strokeWeight;
      this.tmpNode.width = item.width;
      this.tmpNode.height = item.height;
      this.tmpNode.attributes = item.attributes;
      this.tmpNode.methods = item.methods;
      this.isEditStyleModalActive = true;
      this.isEditModalActive = false;
       this.isEditEmptyModalActive = false;
      this.isSettingsModalActive = false;
      this.isEditLinkModalActive = false;
    },
    openNewNodeEditeur(){
       this.isEditModalActive = false;
       this.isEditEmptyModalActive = true;
      this.isSettingsModalActive = false;
      this.isEditLinkModalActive = false;
      this.isEditStyleModalActive = false;
    },
    editNode(item) {
      let tmp = this.graphData.nodes.find(x => x.id === item.id);
      tmp.content.text = item.content.text;
      tmp.content.url = item.content.url;
      tmp.content.color = item.content.color;
      tmp.shape = item.shape;
      tmp.stroke = item.stroke;
      tmp.strokeWeight = item.strokeWeight;
      tmp.width = parseInt(item.width);
      tmp.height = parseInt(item.height);
      tmp.attributes = item.attributes;
      tmp.methods = item.methods;
      this.isEditModalActive = false;
    },
    openLinkEdit(item) {
      this.tmpLink.id = item.id;
      this.tmpLink.content = Object.assign({}, item.content);
      this.isEditLinkModalActive = true;
      this.isEditModalActive = false;
      this.isEditEmptyModalActive = false;
      this.isSettingsModalActive = false;
      this.isEditStyleModalActive = false;
    },
    editLink(item) {
      let tmp = this.graphData.links.find(x => x.id === item.id);
      tmp.color = item.content.color;
      tmp.shape = item.content.shape;
      tmp.pattern = item.content.pattern;
      tmp.arrow = item.content.arrow;
      tmp.cardinalityLeft = item.content.cardinalityLeft;
      tmp.cardinalityRight = item.content.cardinalityRight;
      this.isEditLinkModalActive = false;
    },
    endEdit() {
      this.editable = false;
    },
    nodeClicked(id) {
      this.$emit("nodeClicked", id);
    },
    linkClicked(id) {
      this.$emit("linkClicked", id);
    },
    nodeRemoved(id) {
      this.$emit("nodeRemoved", id)
    },
    linkRemoved(id) {
      this.$emit("linkRemoved", id)
    },
    nodeChanged(obj) {
      this.graphData.nodes = obj.nodes;
    },
    linkChanged(obj) {
      this.graphData.links = obj.links;
    },
    openInputModal() {
      this.isInputModalActive = true;
      this.json = JSON.stringify(this.graphData);
    },
    importData(value) {
      const obj = JSON.parse(value.text);
      if (obj) {
        this.graphData = obj;
        this.isInputModalActive = false;
      }
    },
    downloadSVG() {
      const blob = new Blob(
        [document.getElementById("svg-diagram-show-area").innerHTML],
        {
          type: "image/svg+xml;charset=utf-8"
        }
      );
      const url = window.URL.createObjectURL(blob);
      console.log(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "image.svg";
      link.click();
      //get svg element.
     
     /* var svg = document.getElementById("svg-diagram-show-area");

      //get svg source.
      var serializer = new XMLSerializer();
      var source = serializer.serializeToString(svg);

      //add name spaces.
      if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
          source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
          source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }

      //add xml declaration
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

      //convert svg source to URI data scheme.
      var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

      //set url value to a element's href attribute.
       const link = document.createElement("a");
      link.href = url;
      link.download = "image.svg";
      link.click();*/

      //you can download svg file by right click menu.
    },
    changeGrid() {
      this.graphData.showGrid = this.settings.showGrid;
      this.isSettingsModalActive = false;
    },
    openSettingsModal() {
      this.isSettingsModalActive = true;
      this.isEditModalActive = false;
      this.isEditLinkModalActive = false;
      this.isEditEmptyModalActive = false;
      this.isEditStyleModalActive = false;
      this.settings.width = this.graphData.width;
      this.settings.height = this.graphData.height;
      this.settings.showGrid = this.graphData.showGrid;
    },
    updateSettings(val) {
      this.settings = Object.assign({}, val);
      this.changeGrid();
      this.isSettingsModalActive = false;
    }
  }
};
</script>
<style scoped>
 .scrollable {
   overflow-y: scroll;
}
</style>
<template>
  <div v-if="isActive" @clickModal="cancel" >
    <transition name="item">
      <div class="form" v-if="isActive">
        <h2>{newNode.content.text}</h2>
        <div class="styling">
          <h2>Styling</h2>
          <VInput v-model="newNode.content.color" placeholder="color" style="text-align:center"/><br />
          <VInput
            type="number"
            v-model="newNode.width"
            placeholder="width"
            style="text-align:center"
          /><br />
          <VInput
            type="number"
            v-model="newNode.height"
            placeholder="height"
            style="text-align:center"
          /><br />
          <VInput
            type="text"
            v-model="newNode.stroke"
            placeholder="stroke"
            style="text-align:center"
          /><br />
          <VInput
            type="number"
            v-model="newNode.strokeWeight"
            placeholder="stroke weight"
            style="text-align:center"
          /><br />
          <VSelect v-model="newNode.shape" placeholder="Select shape">
            <option value="rectangle" selected>Rectangle</option>
            <option value="ellipse">Ellipse</option> </VSelect
          ><br />
        </div>
        <VButton @click="ok">OK</VButton>
        <VButton class="danger" @click="cancel">Cancel</VButton>
      </div>
    </transition>
  </div>
</template>

<script lang="js">

import UMLAttribute from "@/lib/model/UMLElements";
import VButton from "@/minimal-ui/lib/VButton";
import UMLMethod from "@/lib/model/UMLElements";

export default {
  components: { VButton },
  props: {
    isActive: Boolean,
    node: {
      type: Object,
      default() {
        return {
          id: "",
          shape: "rectangle",
          width: 140,
          height: 250,
          stroke: "",
          strokeWeight: 0,
          content: {
            text: "none",
            url: "",
            color: "#ecf0f1"
          },
          type: "class",
          attributes: Array,
          methods: Array,
        };
      }
    },
    attributeList: {
      type: Array,
      default() {
        return [
        ]
      }
    },
    methodList: {
      type: Array,
      default() {
        return [
        ]
      }
    },
    attributeTypes: {
      type: Array,
      default() {
        return ['','Number', 'String', 'Boolean'];
      }
    },

  },
  watch: {
    node() {
      this.newWidth = parseInt(this.node.width);
      this.newHeight = parseInt(this.node.height);
    },
    attributeList() {
      this.newNode.attributes = this.attributeList;
    },
    methodList() {
      this.newNode.methods = this.methodList;
    }
  },
  data() {
    return {
      newNode: this.node,

      tempParam: {
        name: '',
        type: ''
      }
    };
  },
  methods: {
    init() {
      this.attributeList = [];
    },
    ok() {
      this.$emit("ok", this.newNode);
    },
    cancel() {
      this.$emit("cancel");
    },

    // Attributes
    newAttribute() {
      this.attributeList.push(new UMLAttribute("", "String"))
    },
    deleteAttribute(name) {
      this.attributeList = this.attributeList.filter(a => a.name !== name)
    },

    // Methods
    newMethod() {
      this.methodList.push(new UMLMethod("", "String", []))
    },
    clearMethodParams(name) {
      /* TODO take something else in consideration than the name (like the index),
         we can't overload methods with this solution, deleting props will affect all the methods which have the same name */
      this.methodList.map(a => { if (a.name === name) a.params = [] })
    },
    addMethodParam(methodName) {
      this.methodList.map(a => { if (a.name === methodName && this.tempParam.name && this.tempParam.type) a.params.push(this.tempParam) })
    },
    toggleAddParam(methodName) {
      this.methodList.map(a => a.addParam = (a.name === methodName))
    },
    deleteMethod(name) {
      this.methodList = this.methodList.filter(a => a.name !== name)
    }
  }
};

</script>
<style lang="scss" scoped>
  input {
    width: 95%;
    margin-bottom: 5px;
  }
  select {
    margin-bottom: 5px;
  }
  .item-enter-active {
    transition: all 0.8s ease;
  }
  .item-leave-active {
    transition: all 0.3s ease;
  }
  .item-enter,
  .item-leave-to {
    opacity: 0;
  }

  .inline {
    display: inline;
  }
</style>

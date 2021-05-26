<template>
  <VModal :isActive="isActive" @clickModal="cancel">
    <transition name="item">
      <div class="form" v-if="isActive">
        <h2>General</h2>
        <VInput v-model="newNode.content.text" placeholder="name" /><br />
        <!--VInput v-model="newNode.content.url" placeholder="url" /><br /-->


        <VSelect v-model="newNode.type" placeholder="Select type">
          <option value="class" selected>Class</option>
          <option value="interface">Interface</option>
        </VSelect>
        <br/>

        <div class="attributes" style="margin-top: 20px">
          <h2 style="display: inline; margin: 10px 10px 10px 0">Attributes</h2>
          <VButton style="display: inline" @click="newAttribute">New</VButton>
          <table v-if="attributeList.length > 0">
            <tr>
              <th>UML Attribute</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
            <tr v-for="a in attributeList">
              <td><input type="text" v-model="a.name"></td>
              <td>
                <VSelect v-model="a.type" placeholder="Select type">
                  <option v-for="t in attributeTypes" :value="t">{{ t }}</option>
                </VSelect>
              </td>
              <td><VButton @click="deleteAttribute(a.name)">delete</VButton></td>
            </tr>
          </table>
        </div>

        <div class="methods" style="margin-top: 20px">
          <h2 style="display: inline; margin: 10px 10px 10px 0">Methods</h2>
          <VButton style="display: inline" @click="newMethod">New</VButton>
          <table v-if="methodList.length > 0">
            <tr>
              <th>UML Method</th>
              <th>Return type</th>
              <th>Params</th>
              <th>Actions</th>
              <th>Add parameter</th>
            </tr>
            <tr v-for="a in methodList">
              <td><input type="text" v-model="a.name"></td>
              <td>
                <VSelect v-model="a.type" placeholder="Select type">
                  <option v-for="t in attributeTypes" :value="t">{{ t }}</option>
                </VSelect>
              </td>
              <td width="180">
                <span style="font-size: 15px" v-for="p in a.params">{{ p.name }}: {{ p.type }}, </span>
              </td>
              <td>
                <VButton @click="deleteMethod(a.name)">delete</VButton>
                <!--VButton @click="toggleAddParam(a.name)">add param</VButton-->
                <VButton @click="clearMethodParams(a.name)">clear params</VButton>
              </td>
              <!--td>
                <div class="add-param" v-if="a.addParam">
                  <input type="text" class="inline" style="width: 30%" v-model="tempParam.name" placeholder="Param name">

                  <VSelect class="inline" v-model="tempParam.type" placeholder="Select type">
                    <option v-for="t in attributeTypes" :value="t">{{ t }}</option>
                  </VSelect>

                  <VButton class="inline" @click="addMethodParam(a.name)">add param</VButton>
                </div>
              </td-->
            </tr>
          </table>
        </div>

        <div class="styling">
          <h2>Styling</h2>
          <VInput v-model="newNode.content.color" placeholder="color" /><br />
          <VInput
            type="number"
            v-model="newNode.width"
            placeholder="width"
          /><br />
          <VInput
            type="number"
            v-model="newNode.height"
            placeholder="height"
          /><br />
          <VInput
            type="text"
            v-model="newNode.stroke"
            placeholder="stroke"
          /><br />
          <VInput
            type="number"
            v-model="newNode.strokeWeight"
            placeholder="stroke weight"
          /><br />
          <!--VSelect v-model="newNode.shape" placeholder="Select shape">
            <option value="rectangle" selected>Rectangle</option>
            <option value="ellipse">Ellipse</option> </VSelect
          ><br /-->
        </div>

        <VButton @click="ok">OK</VButton>
        <VButton class="danger" @click="cancel">Cancel</VButton>
      </div>
    </transition>
  </VModal>
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
          {
            name: 'test',
            type: 'String'
          }
        ]
      }
    },
    methodList: {
      type: Array,
      default() {
        return [
          {
            name: 'op1',
            type: 'String',
            params: [],
            addParam: false
          }
        ]
      }
    },
    attributeTypes: {
      type: Array,
      default() {
        return ['Number', 'String', 'Boolean'];
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

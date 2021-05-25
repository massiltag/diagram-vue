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

import UMLProperty from "@/lib/model/UMLProperty";
import VButton from "@/minimal-ui/lib/VButton";

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
          type: "class"
        };
      }
    },
    attributeList: {
      type: Array(UMLProperty),
      default() {
        return [
          {
            name: 'Test',
            type: 'String'
          }
        ]
      }
    },
    attributeTypes: {
      type: Array,
      default() {
        return ['Number', 'String', 'Boolean'];
      }
    }
  },
  watch: {
    node() {
      this.newWidth = parseInt(this.node.width);
      this.newHeight = parseInt(this.node.height);
    }
  },
  data() {
    return {
      newNode: this.node
    };
  },
  methods: {
    ok() {
      this.$emit("ok", this.newNode);
    },
    cancel() {
      this.$emit("cancel");
    },
    deleteAttribute(name) {
      this.attributeList = this.attributeList.filter(a => a.name !== name)
    },
    newAttribute() {
      this.attributeList.push(new UMLProperty("", ""))
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
</style>

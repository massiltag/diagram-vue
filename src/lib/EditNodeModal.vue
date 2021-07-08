<template>
  <div v-if="isActive" @clickModal="cancel" style="margin-bottom:20px;" >
    <transition name="item">
      <div class="form" v-if="isActive">
        <h2>Edit Class</h2>
        <VInput v-model="newNode.content.text" placeholder="name" style="text-align:center" /><br />


        <VSelect v-model="newNode.type" placeholder="Class" >
          <option value="class" selected>Class</option>
          <option value="interface">Interface</option>
        </VSelect>
        <br/>
        <div class="attributes" style="margin-top: 20px">
          <h3 style="display: inline; margin: 10px 10px 10px 0">Attributes</h3>
          <VButton style="display: inline" @click="newAttribute">New</VButton>
          <table v-if="attributeList.length > 0" style="margin-top: 20px">
            <tr>
              <th>Attribute</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
            <tr v-for="a in attributeList" :key="a.name">
              <td style="width:30%;"><input type="text" v-model="a.name"  ></td>
              <td style="width:40%; padding-left:10px;">
                <VSelect v-model="a.type"   placeholder="Select type" style="width:100%;">
                  <option v-for="t in attributeTypes" :value="t" :key="t">{{ t }}</option>
                </VSelect>
              </td>
              <td><VButton @click="deleteAttribute(a.name)">delete</VButton></td>
            </tr>
          </table>
        </div>
             
        <div class="methods" style="margin-top: 20px">
          <h3 style="display: inline; margin: 10px 10px 30px 10px" >Methods</h3>

          <VButton style="display: inline" @click="addMethod">New</VButton>
 
           <div  v-for="a in methodList" :key="a.name" style="margin-top: 20px">
                   <label>Method </label> 
                   <input  type="text" v-model="a.name" style="width: 31%; margin-right:10px;" > <VButton @click="deleteMethod(a.name)">delete</VButton><br>
                   <label>Return Type </label>
                   <VSelect v-model="a.type" placeholder="Select return type" style="width: 50%;">
                       <option v-for="t in attributeTypes" :value="t" :key="t">{{ t }}</option>
                   </VSelect>
                   <label v-if="a.params" > <br> Parameters </label><br>
                   <i style="font-size: 15px, margin-top:10px;" v-for="p in a.params" :key="p.name">{{ p.name }}: {{ p.type }}  <VButton style="margin-top:10px;margin-left:10px;" @click="deleteParam(a.name,p.name)"> delete</VButton> <br> </i>  
                   <input type="text" class="inline" style="width: 35%;margin-right:5px;" v-model="tempParam.name" placeholder="Param name">
                   <VSelect class="inline" v-model="tempParam.type" placeholder="Select type">
                        <option v-for="t in attributeTypes" :key="t" :value="t">{{ t }}</option>
                    </VSelect>
                    <VButton class="inline" @click="addMethodParam(a.name)">add Parameter</VButton>
                   
           </div>
        </div>
       <div  style="margin-top: 40px;">
            <VButton @click="ok" style=" margin-right:10px;" >OK</VButton> 
            <VButton class="danger" @click="cancel">Cancel</VButton>
        </div>
        <p v-if="erreurNode" style="color:red;"> Vous devez saissir le nom de la classe !</p>
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
    erreurNode : Boolean,
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
            color: "#FFFFFF"
          },
          type: "class",
          attributes: Array,
                      default() {
                        return [
                        ]
                      },
          methods:Array,
                default() {
                  return [
                  ]
                },
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
      this.newNode.methods =this.methodList;
    }
  },
  data() {
    return {
      newMethod : false,
      newNode: this.node,
      tempParam: {
        name: '',
        type: 'String'
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
      this.attributeList = this.attributeList.filter(a => a.name !== name);
    },

    // Methods
    addMethod() {
      this.methodList.push(new UMLMethod("", "String", []));
    },
    clearMethodParams(name) {
      /* TODO take something else in consideration than the name (like the index),
         we can't overload methods with this solution, deleting props will affect all the methods which have the same name */
      this.methodList.map(a => { if (a.name === name) a.params = [] })
    },
    addMethodParam(methodName) {
      this.methodList.map(a => { if (a.name === methodName && this.tempParam.name && this.tempParam.type){
           if(a.params){
           a.params.push(this.tempParam);
           }
           else{
               a.params = [];
               a.params.push(this.tempParam);
           }
           this.tempParam = {
                name: '',
                type: 'tempParam'
              };
       };
      })
    },
    deleteMethod(name) {
      this.methodList = this.methodList.filter(a => a.name !== name)
    },
    deleteParam(methodeName,paramName){
      this.methodList.map(a => { if (a.name === methodeName) a.params = a.params.filter(b=> b.name !== paramName) });
    },
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
  h3{
 color: gray;
 font-size:20px;
 }
 
</style>

<template>
  <VModal :isActive="isActive" @clickModal="cancel">
    <transition name="item">
      <div class="form" v-if="isActive">
        <h2>Edit link</h2>
        <label>Color:</label>
        <VInput v-model="newLink.color" placeholder="color" /><br />
        <label>Shape:</label>
        <VSelect v-model="newLink.shape" placeholder="Select line shape">
          <option value="straight">Straight line</option>
          <option value="bezier">Bezier curve</option> </VSelect
        ><br />
        <label>Pattern:</label>
        <VSelect v-model="newLink.pattern" placeholder="Select line pattern">
          <option value="solid" selected>Solid</option>
          <option value="dash">Dash</option>
          <option value="dot">Dot</option> </VSelect
        ><br />
           <label>Arrow type: </label>
          <VSelect v-model="newLink.arrow" placeholder="Select arrow type">
          <option value="association">Association</option>
          <option value="directS">Direct association (source)</option>
          <option value="directD">Direct association (destination)</option>
          <option value="reflexive">Reflexive association</option> 
          <option value="Aggregation">Aggregation</option> 
          <option value="Composition">Composition</option> 
          <option value="Inheritance">Inheritance</option>    
          </VSelect
        ><br />
            <label>left cardinality : </label>
          <VInput v-model="cardinalityLeft" placeholder="Select left cardinality"  type="text" v-on:change="isCardinalityLeftValid">
             <span v-show="cardErr" style="color:red">{{cardinalityError}}</span>
        </VInput>
          <br />
            <label>right cardinality : </label>
          <VInput v-model="cardinalityRight" placeholder="Select right cardinality"  type="text">
            <span v-show="cardErr" style="color:red">{{cardinalityError}}</span>
          </VInput
        ><br />

        <label>Navigability :</label>
        <VSelect v-model="newLink.Navigability" placeholder="">
          <option value="solid" selected>Navigable right</option>
          <option value="dash">Navigable left</option></VSelect
        ><br />

        <VButton @click="ok">OK</VButton>
        <VButton class="danger" @click="cancel">Cancel</VButton>
      </div>
    </transition>
  </VModal>
</template>
<script type="text/javascript">
import VCkbox from '../minimal-ui/lib/VCkbox.vue';

const cardinalityReg = /^(([^<>()[]\.,;:\s@"]+(.[^<>()[]\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

export default {
  components: { VCkbox },
    data: function () {
      return {
    cardinalityLeft: '',
    cardinalityRight: '',
    cardinalityError:' Invalid cardinality',
    cardErr:false
    }
    
  },
  props: {
    isActive: Boolean,
    link: {
      type: Object,
      default() {
        return {
          id: "0",
          content: {
            color: "#ffeaa7",
            shape: "straight",
            pattern: "solid",
            arrow: "none"
          }
        };
      }
    }
  },
  computed: {
    newLink: {
      get() {
        return this.link.content;
      }
    }
  },
  methods: {
    ok() {
      this.$emit("ok", {
        id: this.link.id,
        content: {
          color: this.newLink.color,
          shape: this.newLink.shape,
          pattern: this.newLink.pattern,
          arrow: this.newLink.arrow,

        }
      });
    },
    cancel() {
      this.$emit("cancel");
    },
    isCardinalityLeftValid: function() {
    let arrayCardLeft = this.cardinalityLeft.split("..");
    console.log("isCardValid");
  	if (this.cardinalityLeft == '' || cardinalityReg.test(this.cardinalityLeft)){
      this.cardErr = true;
          console.log("isCardValid 2");
      }
      else 
        if(arrayCardLeft.length == 2 && arrayCardLeft[1] != "*" && parseInt(arrayCardLeft[0]) <= parseInt(arrayCardLeft[1])){
        this.cardErr = true;

                  console.log("isCardValid 3");
    } else {
      this.cardErr = false;
                console.log("isCardValid 4");
      }
  	}
  }
};



</script>
<style lang="scss" scoped>
input {
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
select {
  margin-bottom: 5px;
}
</style>

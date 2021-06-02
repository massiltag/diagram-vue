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
          <option value="association" selected>Association</option>
          <option value="direct">Direct association</option>
          <option value="Aggregation">Aggregation</option> 
          <option value="Composition">Composition</option> 
          <option value="Inheritance">Inheritance</option>    
          </VSelect
        ><br />
            <label>Left cardinality : </label>
          <VInput v-model="newLink.cardinalityLeft" placeholder="Select left cardinality"  type="text" @input ="isCardinalityLeftValid">  
          </VInput>
             <span v-show="cardErrLeft" style="color:red">{{cardinalityError}}</span>
          <br />
           <label>Right cardinality : </label>
          <VInput v-model="newLink.cardinalityRight" placeholder="Select right cardinality"  type="text" @input ="isCardinalityRightValid">
           </VInput>
           <span v-show="cardErrRight" style="color:red">{{cardinalityError}}</span>
           <br/>

        <VButton @click="ok">OK</VButton>
        <VButton class="danger" @click="cancel">Cancel</VButton>
      </div>
    </transition>
  </VModal>
</template>
<script type="text/javascript">

const cardinalityReg = /^(0|([1-9][0-9]*))..(([1-9][0-9]*)|"*")$/;

export default {
   data() {
    return {
      cardinalityError : " Cardinality must be : number..number (first number <= second number) or  number..*  ",
      cardErrLeft:false,
      cardErrRight:false
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
            color: "red",
            shape: "straight",
            pattern: "solid",
            arrow: "association",
            cardinalityLeft : "",
            cardinalityRight : "",
            navigability :"right",
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
          cardinalityLeft : this.newLink.cardinalityLeft,
          cardinalityRight : this.newLink.cardinalityRight,
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    },
    isCardinalityLeftValid() {
    let arrayCardLeft = this.newLink.cardinalityLeft.split("..");
  	if (cardinalityReg.test(this.newLink.cardinalityLeft) && arrayCardLeft.length == 2 && (arrayCardLeft[1] != "*" && parseInt(arrayCardLeft[0]) <= parseInt(arrayCardLeft[1])) || arrayCardLeft[1] == "*"){
          this.cardErrLeft = false;
     } else {
      this.cardErrLeft = true;
      }
  	},
    isCardinalityRightValid() {
    let arrayCardRight = this.newLink.cardinalityRight.split("..");
  	if (cardinalityReg.test(this.newLink.cardinalityRight) && arrayCardRight.length == 2 && (arrayCardRight[1] != "*" && parseInt(arrayCardRight[0]) <= parseInt(arrayCardRight[1])) || arrayCardRight[1] == "*"){
          this.cardErrRight = false;
     } else {
      this.cardErrRight = true;
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

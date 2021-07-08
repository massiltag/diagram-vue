<template>
  <g>
    <g v-if="editable">
      <rect
      v-if="selected"
      class="grab"
      :x="x+node.width+10"
      :y="y+10"
      :width="90"
      :height="120"
      rx="3"
      fill="#FFFFFF"
      stroke-width="0.5"
      stroke="gray"
    />
      <text
        v-if="selected"
        :x="x+node.width+20"
        :y="y+30"
        class="button"
        fill="black"
        font-size="0.8em"
        @click="editCandidate"
      >
        {{ labels.edit || "Edit" }}
      </text>
      <text
        v-if="selected"
        :x="x+node.width+20"
        :y="y+50"
        class="button"
        fill="black"
        font-size="0.8em"
        @click="editStyle"
      >
        {{ labels.style || "Style" }}
      </text>
      <text
        v-if="selected"
        :x="x+node.width+20"
        :y="y+70"
        class="button"
        fill="black"
        font-size="0.8em"
        stroke="none"
        @click="toggleSelect"
      >
        {{
          !createLinkMode ? labels.link || "Link" : labels.cancel || "Cancel"
        }}
      </text>
      <text
        v-if="selected"
        :x="x+node.width+20"
        :y="y+90"
        class="button"
        fill="black"
        font-size="0.8em"
        stroke="none"
        @click="copy"
      >
        {{ labels.copy || "Copy" }}
      </text>
      <text
        v-if="selected"
        :x="x+node.width+20"
        :y="y+110"
        class="button"
        fill="black"
        font-size="0.8em"
        @click="remove"
      >
        {{ labels.remove || "Remove" }}
      </text>
      <text
        v-if="createLinkMode && !selected"
        :x="x"
        :y="y - 10"
        class="button"
        fill="#ff7675"
        font-size="0.8em"
        @click="commitDest"
      >
        {{ labels.select || "Select" }}
      </text>
      <text
        v-if="createLinkMode && selected"
        :x="x"
        :y="y - 10"
        class="button"
        fill="#ff7675"
        font-size="0.8em"
        @click="commitDest"
      >
        {{ labels.select || "Select" }}
      </text>
    </g>
    <ellipse
      v-if="node.shape === 'ellipse'"
      class="grab"
      :cx="x + node.width / 2"
      :cy="y + node.height / 2"
      :width="node.width"
      :height="node.height"
      :rx="node.width / 2"
      :ry="node.height / 2"
      :fill="content.color || '#ecf0f1'"
      :stroke-width="node.strokeWeight"
      :stroke="node.stroke"
      @touchstart="mousedown"
      @mousedown="mousedown"
      @mousemove="mousemove"
      @touchmove="mousemove"
      @mouseup="mouseup"
      @touchend="mouseup"
    />


    <rect
      v-else
      class="grab"
      :x="x"
      :y="y"
      :width="node.width"
      :height="calculateTotalHeight()"
      rx="5"
      ry="3"
      :fill="content.color || '#b1a4a4'"
      :stroke-width="node.strokeWeight"
      :stroke="node.stroke"
      @touchstart="mousedown"
      @mousedown="mousedown"
      @mousemove="mousemove"
      @touchmove="mousemove"
      @mouseup="mouseup"
      @touchend="mouseup"
    />
    <text :x="x + node.width + 7" :y="y + 11"
          v-if="editable"
          class="unselectable"
          @touchstart="mousedown"
          @mousedown="mousedown"
          @mousemove="mousemove"
          @touchmove="mousemove"
          @mouseup="mouseup"
          @touchend="mouseup">
      ☸
    </text>
    <line :x1="x" :y1="y + 30" :x2="x + node.width" :y2="y + 30" class="uml-class-separator"/>
    <foreignObject style="border:none" :x="x" :y="y" :width="node.width" :height="30">
      <body>
      <form>
        <input :value="content.text" disabled type="text" />
      </form>
      </body>
    </foreignObject>
    <foreignObject style="border:none" :x="x" :y="y + 25" :width="node.width" :height="nbAttribs * 17 + 10">
      <body>
      <form> <!-- TODO input x2, separate name & type + link them with v-model. this is only temp. -->
        <input v-for="attrib in node.attributes" type="text" :value="attrib.name + ' : ' + attrib.type" :key="attrib" />
      </form>
      </body>
    </foreignObject>
    <line :x1="x" :y1="y + nbAttribs * 17 + 45" :x2="x + node.width" :y2="y + nbAttribs * 17 + 45"
          class="uml-class-separator" />
    <foreignObject style="border:none" :x="x" :y="y + nbAttribs * 17 + 47" :width="node.width"
                   :height="nbMethods * 17 + 10">
      <body>
      <form>
        <input v-for="meth in node.methods" type="text" :value="meth.name + '() : ' + meth.type" :key="meth.name" />
      </form>
      </body>
    </foreignObject>


    <!--a target="_blank" :href="content.url">
      <text
        :x="x + node.width / 2"
        :y="y + node.height / 2"
        fill="#34495e"
        font-family="Meiryo UI, sans-serif"
        font-size="20"
        text-anchor="middle"
      >
        {{ content.text }}
      </text>
    </a-->
  </g>
</template>


<!-- MINE -->
<style scoped>

.unselectable {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}

.uml-class-border {
  fill:white;
  stroke:black;
  stroke-width:3px;
  fill-opacity:0.1;
  stroke-opacity:0.9;
}
.uml-class-title {
  font-size: 12px;
  display: block;
  margin: auto;
}
.uml-class-separator {
  stroke: black;
  stroke-width: 1px;
}
/* The popup form - hidden by default */
.form-popup {
  display: none;
  position: fixed;
  bottom: 0;
  border: 3px solid #f1f1f1;
  z-index: 9;
}
/* Full-width input fields */
.form-container input[type=text], .form-container input[type=password] {
  width: 100%;
  padding: 10px;
  margin-left:-50px;
  margin-right:50px;
  border: none;
  background: #f1f1f1;
}
/* When the inputs get focus, do something */
.form-container input[type=text]:focus, .form-container input[type=password]:focus {
  background-color: #ddd;
  outline: none;
}
/* Add a red background color to the cancel button */
.form-container .cancel {
  background-color: red;
}
input {
  border: none;
  height: 15px !important;
  width: 90%;
  display: block;
  margin: auto;
  z-index: -170;
}
input::before {
  content: "+";
}

</style>

<script>
import mouseLocation from "../mouseLocation";
export default {
  mixins: [mouseLocation],
  props: {
    node: {
      width: Number,
      height: Number,
      id: String,
      point: {
        type: Object,
        default: {
          x: 0,
          y: 0
        }
      },
      content: {
        text: String,
        url: String,
        color: String
      },
      shape: {
        type: String,
        default: "rectangle"
      },
      stroke: String,
      strokeWeight: Number
    },
    editable: Boolean,
    createLinkMode: Boolean,
    selected: Boolean,
    labels: Object,
    scale: String,
    rWidth: Number,
    rHeight: Number,
    lineHeight: 17,
  },
  watch: {
    node() {
      this.x = this.node.point.x;
      this.y = this.node.point.y;
    }
  },
  data() {
    return {
      startPosition: null,
      cursorOffset: {
        x: 0,
        y: 0
      },
      id: this.node.id,
      x: this.node.point.x,
      y: this.node.point.y,
      content: this.node.content,

      nbAttribs: Number,
      nbMethods: Number
    };
  },
  methods: {
    toggleSelect() {
      this.$emit("toggleSelect");
    },
    commitDest() {
      this.$emit("commitDest", this.id);
    },
    remove() {
      this.$emit("remove", this.id);
    },
    copy() {
      console.log(this.node.height);
      this.$emit("copy", this.node);
    },
    mousedown(e) {
      this.$emit("click", this.id);
      if (!this.editable) return;
      this.$emit("select", this.id);
      const [x, y] = this.getLocation(e);
      this.cursorOffset.x = x;
      this.cursorOffset.y = y;
      this.startPosition = { x: this.x, y: this.y };

      document.addEventListener("mousemove", this.mousemove);
      document.addEventListener("mouseup", this.mouseup);
    },
    mousemove(e) {
      if (this.startPosition) {
        e.preventDefault();
        const [x, y] = this.getLocation(e);
        this.x =
          this.startPosition.x +
          (x - this.cursorOffset.x) / this.rWidth / parseFloat(this.scale);
        this.y =
          this.startPosition.y +
          (y - this.cursorOffset.y) / this.rHeight / parseFloat(this.scale);
        this.$emit("updateLocation", {
          id: this.id,
          x: this.x,
          y: this.y
        });
      }
    },
    mouseup() {
      this.startPosition = null;

      document.removeEventListener("mousemove", this.mousemove);
      document.removeEventListener("mouseup", this.mouseup);
    },
    editCandidate() {
      this.$emit("editNode", {
        id: this.id,
        shape: this.node.shape,
        width: this.node.width,
        height: this.node.height,
        content: this.content,
        stroke: this.node.stroke,
        strokeWeight: this.node.strokeWeight,
        attributes : this.node.attributes,
        methods : this.node.methods
      });
    },
    editStyle()
      {
        this.$emit("editStyleNode", {
        id: this.id,
        shape: this.node.shape,
        width: this.node.width,
        height: this.node.height,
        content: this.content,
        stroke: this.node.stroke,
        strokeWeight: this.node.strokeWeight,
        attributes : this.node.attributes,
        methods : this.node.methods
      });
        
      },
    // MINE
    calculateTotalHeight() {
      let nbAttribs = 0, nbMethods = 0;

      if (this.node.attributes) nbAttribs = this.node.attributes.length;
      if (this.node.methods) nbMethods = this.node.methods.length;
      this.nbAttribs = nbAttribs;
      this.nbMethods = nbMethods;

      return 70 + nbAttribs * 17 + nbMethods * 17;
    }
  }
};
</script>
<style lang="scss" scoped>
.shadow {
  filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.3));
  -webkit-filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.3));
  -moz-filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.3));
}
.button {
  cursor: pointer;
}
</style>

<template>
  <g>
    <path
      v-if="link.shape === 'bezier'"
      :d="
        `M${calcSource().x} ${calcSource().y}
        Q ${point.x} ${point.y}
        ${calcDestination().x} ${calcDestination().y}`
      "
      :stroke="link.color || '#ffeaa7'"
      stroke-width="3"
      fill="none"
      :stroke-dasharray="definePattern(link.pattern)"
      :marker-end="
        link.arrow !== 'association'  ? `url(#${link.id})` : ''
      "
    />
    <line
      v-else
      :x1="calcSource().x"
      :y1="calcSource().y"
      :x2="calcDestination().x"
      :y2="calcDestination().y"
      :stroke="link.color || '#ffeaa7'"
      stroke-width="3"
      fill="none"
      :stroke-dasharray="definePattern(link.pattern)"
      :marker-end="
        link.arrow !== 'association'  ? `url(#${link.id})` : ''
      "
    />
    <marker
      :id="link.id"
      markerUnits="userSpaceOnUse"
      orient="auto-start-reverse"
      markerWidth="15"
      markerHeight="15"
      viewBox="0 0 10 10"
      refX="5"
      refY="5"  >
      <polygon v-if ="link.arrow !== 'Composition' && link.arrow != 'Aggregation'" points="0,1.5 0,8.5 10,5 " :fill="link.arrow === 'Inheritance'? '#eeeeee' : (link.color || '#ffeaa7')" :stroke = "link.color || '#ffeaa7'" />
      <polygon  v-if ="link.arrow === 'Composition'"  points="6,9 1,6 5,2 9,5 " :stroke="link.color || '#ffeaa7'" :fill="link.color || '#ffeaa7'" stroke-width="1"/> 
      <polygon  v-if ="link.arrow === 'Aggregation'"  points="6,9 1,6 5,2 9,5 " :stroke="link.color || '#ffeaa7'" :fill="'#eeeeee'" stroke-width="1"/> 
      </marker>
    <g v-if="editable">
      <line
        :x1="calcSource().x"
        :y1="calcSource().y"
        :x2="point.x"
        :y2="point.y"
        stroke="lightgray"
      />
      <line
        :x1="point.x"
        :y1="point.y"
        :x2="calcDestination().x"
        :y2="calcDestination().y"
        stroke="lightgray"
      />
      <ellipse
        :id="id"
        :cx="point.x"
        :cy="point.y"
        rx="10"
        ry="10"
        fill="#ff7675"
        stroke-width="2"
        class="grab"
        @click="select"
        @mousedown="mousedown"
        @touchstart="mousedown"
        @mousemove="mousemove"
        @touchmove="mousemove"
        @mouseup="mouseup"
        @touchend="mouseup"
      />
    </g>
    <g>
      <text
        :x="point.x - 15"
        :y="point.y - 20"
        fill="#00b894"
        @click="edit"
        v-if="selected"
        class="button"
      >
        {{ labels.edit || "Edit" }}
      </text>
      <text
        :x="point.x - 15"
        :y="point.y + 30"
        fill="#ff7675"
        @click="remove"
        v-if="selected"
        class="button"
      >
        {{ labels.remove || "Remove" }}
      </text>
      <text
        v-if ="link.cardinalityLeft && link.cardinalityLeft!= null"
        :x="calcSource().x-calculXPoS()"
        :y="calcSource().y+calculYPoS()"
        fill="black"
      >
      {{ link.cardinalityLeft }}
      </text>
      <text
        v-if ="link.cardinalityRight && link.cardinalityRight!= null"
        :x="calcDestination().x-calculXPoD()"
        :y="calcDestination().y-calculYPoD()"
        fill="black"
      >
      {{ link.cardinalityRight }}
      </text>
    </g>
  </g>
</template>
<script>
import mouseLocation from "../mouseLocation";
export default {
  mixins: [mouseLocation],
  props: {
    selected: Boolean,
    editable: Boolean,
    source: {
      id: Number,
      x: Number,
      y: Number
    },
    destination: {
      id: Number,
      x: Number,
      y: Number
    },
    link: {
      id: String,
      color: {
        type: String,
        default: "#ffeaa7"
      },
      shape: {
        type: String,
        default: "straight"
      },
      pattern: {
        type: String,
        default: "solid"
      },
      arrow: {
        type: String,
        default: "none"
      },
      point: {
        x: Number,
        y: Number
      }
    },
    labels: Object,
    scale: String,
    rWidth: Number,
    rHeight: Number
  },
  computed: {},
  data() {
    return {
      startPosition: null,
      cursorOffset: {
        x: 0,
        y: 0
      },
      po:0,
      id: this.link.id,
      point: this.link.point,
    };
  },
  methods: {
    mousedown(e) {
      this.$emit("click", this.link.id);
      const [x, y] = this.getLocation(e);
      this.cursorOffset.x = x;
      this.cursorOffset.y = y;
      this.startPosition = { x: this.point.x, y: this.point.y };
      document.addEventListener("mousemove", this.mousemove);
      document.addEventListener("mouseup", this.mouseup);
    },
    mousemove(e) {
      if (this.startPosition) {
        e.preventDefault();
        const [x, y] = this.getLocation(e);
        this.point.x =
          this.startPosition.x +
          (x - this.cursorOffset.x) / this.rWidth / parseFloat(this.scale);
        this.point.y =
          this.startPosition.y +
          (y - this.cursorOffset.y) / this.rHeight / parseFloat(this.scale);
        this.$emit("updateLocation", {
          id: this.id,
          x: this.point.x,
          y: this.point.y
        });
      }
    },
    definePattern(p) {
      if (p === "solid") {
        return 0;
      } else if (p === "dash") {
        return 10;
      } else if (p === "dot") {
        return 3;
      } else {
        return 0;
      }
    },
    mouseup() {
      this.startPosition = null;
      document.removeEventListener("mousemove", this.mousemove);
      document.removeEventListener("mouseup", this.mouseup);
    },
    remove() {
      this.$emit("remove", this.id);
    },
    select() {
      this.$emit("select", this.id);
    },
    edit() {
      this.$emit("editLink", {
        id: this.link.id,
        content: {
          color: this.link.color || "#ffeaa7",
          shape: this.link.shape || "straight",
          pattern: this.link.pattern || "solid",
          arrow: this.link.arrow || "none"
        }
      });
    },
    calcSource() {
      let dx = this.point.x - this.source.point.x - this.source.width / 2;
      let dy = this.point.y - this.source.point.y - this.source.height / 2;
      if (dx === 0) {
        dx = 0.01;
      }
      if (Math.abs(dy / dx) <= 1) {
        if (dx >= 0) {
          return {
            x: this.source.point.x + this.source.width,
            y: this.source.point.y + this.source.height / 2
          };
        } else {
          return {
            x: this.source.point.x,
            y: this.source.point.y + this.source.height / 2
          };
        }
      } else {
        if (dy >= 0) {
          return {
            x: this.source.point.x + this.source.width / 2,
            y: this.source.point.y + this.source.height
          };
        } else {
          return {
            x: this.source.point.x + this.source.width / 2,
            y: this.source.point.y
          };
        }
      }
    },
    calcDestination() {
      let dx =
        this.point.x - this.destination.point.x - this.destination.width / 2;
      let dy =
        this.point.y - this.destination.point.y - this.destination.height / 2;
      if (dx === 0) {
        dx = 0.01;
      }
      if (Math.abs(dy / dx) <= 1) {
        if (dx >= 0) {
          return {
            x: this.destination.point.x + this.destination.width,
            y: this.destination.point.y + this.destination.height / 2
          };
        } else {
          return {
            x: this.destination.point.x,
            y: this.destination.point.y + this.destination.height / 2
          };
        }
      } else {
        if (dy >= 0) {
          return {
            x: this.destination.point.x + this.destination.width / 2,
            y: this.destination.point.y + this.destination.height
          };
        } else {
          return {
            x: this.destination.point.x + this.destination.width / 2,
            y: this.destination.point.y
          };
        }
      }
    },
    calculXPoD(){
     return this.calcSource().x < this.calcDestination().x ? 30 : 0;
    },
    calculXPoS(){
     return this.calcSource().x > this.calcDestination().x ? 30 : 0;
    },
    calculYPoD(){
     return this.calcSource().y < this.calcDestination().y ? 30 : 0;
    },
    calculYPoS(){
     return this.calcSource().y > this.calcDestination().y ? 30 : 0;
    }
  }
};
</script>
<style scoped></style>

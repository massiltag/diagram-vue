<template>
  <div id="app">
    <h2 style="text-align:center;">Modelizer <code> UML diagramming</code></h2>
    <section >
      <DiagramEditor v-model="graph" style="margin:50px 0px 50px 0px;"></DiagramEditor>
    </section>
  </div>
</template>

<script>
import data from "./data.json";
import { DiagramEditor } from "../index.js";
export default {
  name: "app",
  components: {
    DiagramEditor
  },
  data() {
    return {
      demo: "default",
      graph: {}
    };
  },
  mounted() {
    this.graph = data;
  },
  methods: {
    refresh() {
      this.graph = data;
    }
  }
};
</script>

<style lang="scss">
body {
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    // text-align: center;
    color: #2c3e50;
  }
  .scrollXY {
    overflow-x: auto;
    overflow-y: auto;
  }
}
</style>

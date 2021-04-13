<template>
  <div id="app">
    <Heatmap/>
  </div>
</template>

<script>
import Heatmap from './components/Heatmap.vue'

export default {
  name: 'App',
  components: {
    Heatmap
  }
}
</script>

<style>
#app {
    width: 1000px;
    height: 600px;
    border: 1px solid #000000;
    margin: auto;
}
</style>

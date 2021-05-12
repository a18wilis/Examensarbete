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
    width: 1280px;
    height: 640px;
    border: 1px solid #000000;
    margin: auto auto 25px auto;
    background-image: url(../public/worldmap1280.jpg)
}
</style>

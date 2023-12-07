<script setup>
import { init } from './components/index'
//import { draw } from './components/tip'
import {onMounted} from 'vue'

onMounted(() => {
  init()
  //draw()
})
</script>
  
<template>
  <div style="width:100%;height:100%;z-index: -1000;">
    <!-- <canvas id="canvas" style="position:absolute;top: 50px;background-color: #A9C931;" ></canvas> -->
    <canvas id="canvas_view"></canvas>
  </div>
</template>
  
<style lang="less" scoped>
  
</style>
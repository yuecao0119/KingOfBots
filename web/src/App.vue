<template>
  <NavBar/>
  <router-view/>
</template>

<script>
import NavBar from './components/NavBar.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"

export default {
  name: 'App',
  components: {
    NavBar
  },
}
</script>

<style>
/* 添加背景图案 */
body {
  background-image: url('./assets/background.png');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
</style>

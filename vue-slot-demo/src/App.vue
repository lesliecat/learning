<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  // mounted() {
  //     let that = this
  //     // setInterval(() => {
  //     //       that.$refs.tpl1.scrollTop + '100'
  //     //       console.log(that.$refs.tpl1.scrollTop)
  //     // },1000)
  //     that.$refs.tpl1.scrollTop + '100'
  //           console.log(that.$refs.tpl1.scrollTop)
  // }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

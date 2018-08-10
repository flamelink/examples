<template>
  <div id="app">
    <main-nav/>
    <router-view/>
  </div>
</template>

<script>
// @ is an alias to /src
import MainNav from "@/components/MainNav.vue";

export default {
  components: {
    MainNav
  }
};
</script>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0;
}
</style>

<template>
  <div id="nav">
    <span class="nav__item" v-for="item in navItems" :key="item.id">
      <router-link :to="item.url">
        {{ item.title }}
      </router-link>
    </span>
  </div>
</template>

<script>
import { getMainNav } from "../utils/api";

export default {
  name: "MainNav",
  data() {
    return {
      navItems: []
    };
  },
  mounted() {
    getMainNav()
      .then(navItems => {
        this.navItems = navItems;
      })
      .catch(console.error);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#nav {
  padding: 30px;
  background: #2c3e50;
  position: sticky;
  top: 0;

  a {
    font-weight: bold;
    color: #fff;
    text-decoration: none;
    transition: color 0.25s ease;

    &.router-link-exact-active,
    &:hover {
      color: #42b983;
    }
  }
}

.nav__item {
  margin: 0 10px;
  padding: 0;
}
</style>

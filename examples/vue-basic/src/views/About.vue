<template>
  <div class="about">
    <h2>About</h2>
    <div class="sub-router">
      <router-link to="/about/our-vision">Our Vision</router-link>
      <router-link to="/about/who-we-are">Who We Are</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style scoped lang="scss">
.sub-router {
  display: flex;
  justify-content: center;
  border-bottom: 1px dashed #2c3e50;
  padding-bottom: 30px;

  a {
    font-size: 14px;
    color: #2c3e50;
    text-decoration: none;
    transition: color 0.25s ease;
    margin: 5px;

    &.router-link-exact-active,
    &:hover {
      color: #42b983;
    }
  }
}
</style>

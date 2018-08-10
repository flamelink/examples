<template>
  <h2>{{ msg }}</h2>
</template>

<script>
export default {
  name: "PageTitle",
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h2 {
  margin: 40px 0 15px;
}
</style>

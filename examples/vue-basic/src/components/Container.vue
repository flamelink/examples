<template>
  <div class="page-body">
    <slot/>
  </div>
</template>

<script>
export default {
  name: "Container",
  props: {
    text: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.page-body {
  margin: 40px auto;
  max-width: 840px;
}
</style>

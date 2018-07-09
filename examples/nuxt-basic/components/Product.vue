<template>
  <div class="product__wrap">
    <h3 class="product__name">{{ product.name }}</h3>
    <img class="product__image" v-if="url" :src="url" :alt="product.name">
    <div class="product__price">${{ product.price }}</div>
  </div>
</template>

<script>
import get from 'lodash.get';

export default {
  props: ['product'],

  data() {
    return {
      url: get(this.product, 'image[0].url', '')
    }
  }
}
</script>

<style scoped>
.product__wrap {
  position: relative;
}

.product__name {
  text-align: left;
  margin: 0 0 10px;
  color: #35495e;
  font-weight: normal;
}

.product__image {
  max-width: 300px;
  height: 160px;
  overflow: hidden;
  margin: 0;
}

.product__price {
  text-align: right;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  line-height: 30px;
  padding: 0 15px;
  color: #fff;
  background: #35495e;
}
</style>

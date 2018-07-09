<template>
  <section class="container">
    <div>
      <app-logo/>
      <h1 class="title">
        nuxt-basic
      </h1>
      <h2 class="subtitle">
        Basic example showing how to use <a href="https://flamelink.io" target="_blank">Flamelink</a> with <a href="https://nuxtjs.org/" target="_blank">Nuxt</a>, both server and client side.
      </h2>
      <h1 class="section__title">Flamelink Products</h1>
      <div class="products">
        <div class="products_container" v-for="product in products" :key="product.id">
          <product :product="product" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'
import Product from '~/components/Product.vue'

export default {
  components: {
    AppLogo,
    Product
  },

  async asyncData({ app }) {
    try {
      const products = await app.flamelink.content.get('products', { populate: ['image'] })
      return { products }
    } catch (err) {
      console.log(err)
      return { products: [] }
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.section__title {
  margin-top: 30px;
  text-transform: uppercase;
  font-weight: normal;
}

.products {
  padding-top: 30px;
  display: flex;
}

.products_container {
  margin: 10px;
  flex-shrink: 0;
  flex-grow: 0;
}
</style>

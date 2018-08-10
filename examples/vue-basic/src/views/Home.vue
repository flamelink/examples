<template>
  <div class="home">
    <Container>
      <img alt="Vue logo" src="../assets/logo.png">
      <PageTitle :msg="pageTitle"/>
      <div v-html="pageBody"/>
    </Container>
  </div>
</template>

<script>
// @ is an alias to /src
import PageTitle from "@/components/PageTitle.vue";
import Container from "@/components/Container.vue";
import { get } from "lodash";

export default {
  name: "home",
  data() {
    return {
      pageTitle: "...",
      pageBody: ""
    };
  },
  components: {
    PageTitle,
    Container
  },
  mounted() {
    this.$flamelinkApp.content.subscribe("home", (error, homeData) => {
      if (error) {
        this.pageTitle = "Error fetching Home page data";
        return console.error(error);
      }

      this.pageTitle = get(homeData, "pageTitle", "");
      this.pageBody = get(homeData, "pageBody", "");
    });
  }
};
</script>

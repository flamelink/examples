<template>
  <div class="about">
    <Container>
      <PageTitle :msg="title"/>
      <div v-html="body"></div>
    </Container>
  </div>
</template>

<script>
// @ is an alias to /src
import PageTitle from "@/components/PageTitle.vue";
import Container from "@/components/Container.vue";
import { get } from "lodash";

export default {
  name: "people",
  data() {
    return {
      title: "...",
      body: ""
    };
  },
  components: {
    PageTitle,
    Container
  },
  mounted() {
    this.$flamelinkApp.content.subscribe("whoWeAre", (error, data) => {
      if (error) {
        this.title = "Error fetching People page data";
        return console.error(error);
      }

      this.title = get(data, "title", "");
      this.body = get(data, "body", "");
    });
  }
};
</script>

<template>
  <div class="about">
    <Container>
      <PageTitle :msg="title"/>
      <div v-html="body"/>
    </Container>
  </div>
</template>

<script>
// @ is an alias to /src
import PageTitle from "@/components/PageTitle.vue";
import Container from "@/components/Container.vue";
import { get } from "lodash";

export default {
  name: "our-vision",
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
    this.$flamelinkApp.content.subscribe("ourVision", (error, data) => {
      if (error) {
        this.title = "Error fetching Our Vision page data";
        return console.error(error);
      }

      this.title = get(data, "title", "");
      this.body = get(data, "body", "");
    });
  }
};
</script>

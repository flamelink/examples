<template>
  <div class="contact">
    <PageTitle :msg="pageTitle"/>
    <form>
      <fieldset>
        <div class="form__field">
          <label for="name">Name</label>
          <input type="text" name="name" id="name" />
        </div>
        <div class="form__field">
          <label for="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>
        <div class="form__field">
          <label for="message">Message</label>
          <textarea name="message" id="message"/>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src
import PageTitle from "@/components/PageTitle.vue";
import { get } from "lodash";

export default {
  name: "contact",
  components: {
    PageTitle
  },
  computed: {
    pageTitle() {
      return get(this.$route, "meta.name");
    }
  }
};
</script>

<style lang="scss">
fieldset {
  max-width: 680px;
  margin: 20px auto 0;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.form__field {
  display: flex;
  margin-bottom: 15px;

  label {
    text-align: right;
    padding-right: 15px;
  }

  input,
  textarea {
    flex-grow: 1;
  }
}

label {
  width: 100px;
  display: block;
}
</style>

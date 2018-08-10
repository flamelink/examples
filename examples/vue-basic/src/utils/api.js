import Vue from "vue";

export const getMainNav = () =>
  Vue.flamelinkApp.nav.getItems("mainNavigation", { structure: "nested" });

import Vue from "vue";
import App from "./App.vue";
import FlamelinkPlugin from "./plugins/flamelink";
import getRouter from "./router";
import "./registerServiceWorker";

Vue.config.productionTip = false;

Vue.use(FlamelinkPlugin, {
  apiKey: process.env.VUE_APP_FLAMELINK_API_KEY,
  authDomain: process.env.VUE_APP_FLAMELINK_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FLAMELINK_DB_URL,
  projectId: process.env.VUE_APP_FLAMELINK_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FLAMELINK_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FLAMELINK_MESSAGING_SENDER_ID
});

getRouter()
  .then(router => {
    new Vue({
      router,
      render: h => h(App)
    }).$mount("#app");
  })
  .catch(console.error);

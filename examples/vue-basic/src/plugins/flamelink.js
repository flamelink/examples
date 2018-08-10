import flamelink from "flamelink";

const FlamelinkPlugin = {
  install(Vue, options) {
    if (!options) {
      throw new Error("Please specify the Flamelink config options");
    }

    const app = flamelink(options);

    // Ensure app is available on all vue instances
    Vue.prototype.$flamelinkApp = app;

    // Ensure app is available globally - useful for querying data not used in a view (eg. router setup, etc)
    Vue.flamelinkApp = app;
  }
};

export default FlamelinkPlugin;

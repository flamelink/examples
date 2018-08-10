import Vue from "vue";
import Router from "vue-router";
import { camelCase } from "lodash";
import { getMainNav } from "./utils/api";

Vue.use(Router);

const prepareRoute = route => {
  return {
    path: route.url,
    name: camelCase(route.component),
    // route level code-splitting - which is lazy-loaded when the route is visited.
    component: () => import(`./views/${route.component || "NotFound"}.vue`),
    children: route.children ? route.children.map(prepareRoute) : [],
    meta: {
      name: route.title,
      cssClass: route.cssClass
    }
  };
};

const getRouter = async () => {
  const navItems = await getMainNav();
  const routes = navItems.sort((a, b) => a.order >= b.order).map(prepareRoute);
  return new Router({ routes });
};

export default getRouter;

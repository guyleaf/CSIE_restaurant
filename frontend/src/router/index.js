import { TabsPlugin } from "bootstrap-vue";
import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("@/views/layouts/MainLayout.vue"),
    meta: {
      title: "孜宮庭園",
    },
    children: [
      {
        name: "Home",
        path: "",
        component: () => import("@/views/Home.vue"),
        meta: {
          title: "孜宮庭園 - 首頁",
        },
      },
      {
        name: "Shop",
        path: "shop/:id/:shopName",
        component: () => import("@/views/Shop.vue"),
        meta: {
          title: "孜宮庭園 - 商店",
        },
      },
      {
        name: "History",
        path: "history",
        component: () => import("@/views/History.vue"),
        meta: {
          title: "孜宮庭園 - 歷史訂單",
        },
      },
      {
        name: "Cashier",
        path: "cashier",
        component: () => import("@/views/Cashier.vue"),
        meta: {
          title: "孜宮庭園 - 結帳",
        },
      },
      {
        name: "ShopManage",
        path: "shopManage",
        component: () => import("@/views/ShopManage.vue"),
        meta: {
          title: "孜宮庭園 - 商店管理",
        },
      },
      {
        name: "Manage",
        path: "manage",
        component: () => import("@/views/layouts/ManageLayout.vue"),
        children: [
          {
            name: "SalesReport",
            path: "salesReport",
            component: () => import("@/views/SalesReport.vue"),
          },
          {
            name: "ManageShops",
            path: "manageshops",
            component: () => import("@/views/OrderManage.vue"),
          },
          {
            name: "Customer",
            path: "customer",
            component: () => import("@/views/Member.vue"),
          },
          {
            name: "Seller",
            path: "seller",
            component: () => import("@/views/Seller.vue"),
          },
        ],
      },
      {
        path: "*",
        component: () => import("@/views/404.vue"),
      }, //404 notFoundPage
    ],
  },

  // {
  //     path: '/login',
  //     name: 'login',
  //     // route level code-splitting
  //     // this generates a separate chunk (login.[hash].js) for this route
  //     // which is lazy-loaded when the route is visited.
  //     component: () => import(/* webpackChunkName: "login" */ '../views/:Login.vue')
  // }
];

const router = new VueRouter({
  mode: "hash",
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    return {
      behavior: "smooth",
      x: 0,
      y: 0,
    };
  },
});

const seller = ["Shop", "Home", "ShopManage", "SalesReport", "ManageShops"];
const admin = ["Shop", "Home", "SalesReport", "Customer", "Seller"];
const customer = ["Shop", "Home", "History", "Cashier"];
const anonymous = ["Shop", "Home"];

router.beforeEach((to, from, next) => {
  if (store.getters["auth/token"] != null) {
    if (store.getters["auth/user"].permission == 0 && admin.includes(to.name))
      next();
    else if (
      store.getters["auth/user"].permission == 1 &&
      seller.includes(to.name)
    ){
      next();
    }
    else if (
      store.getters["auth/user"].permission == 2 &&
      customer.includes(to.name)
    )
      next();
    else next(false);
  } 
  
  else {
    if (anonymous.includes(to.name)) next();
    else next(false);
  }
});
export default router;

import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "welcome",
    component: () => import("@/views/welcome.vue"),
    children: [],
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/home.vue"),
    redirect: "/home/diary",
    children: [
      {
        path: "diary",
        name: "diary",
        component: () => import("@/views/diary/diary.vue"),
        children: [],
      },
      {
        path: "mateDiary",
        name: "mateDiary",
        component: () => import("@/views/diary/mateDiary.vue"),
        children: [],
      },
      {
        path: "homeDiary/:id",
        name: "homeDiary",
        component: () => import("@/views/diary/homeDiary.vue"),
        children: [],
      },
      {
        path: "detail/:id",
        name: "detail",
        component: () => import("@/views/detail/detail.vue"),
        children: [],
      },
      {
        path: "preview/:id",
        name: "preview",
        component: () => import("@/views/preview/preview.vue"),
        children: [],
      },
      {
        path: "drift",
        name: "drift",
        component: () => import("@/views/drift/drift.vue"),
        children: [],
      },
      {
        path: "gallery",
        name: "gallery",
        component: () => import("@/views/gallery/gallery.vue"),
        children: [],
      },
      {
        path: "mate",
        name: "mate",
        component: () => import("@/views/mate/mate.vue"),
        children: [],
      },
      {
        path: "mateBoard/:id",
        name: "mateBoard",
        component: () => import("@/views/mate/mateBoard.vue"),
        children: [],
      },
      {
        path: "addMate",
        name: "addMate",
        component: () => import("@/views/mate/addMate.vue"),
        children: [],
      },
      {
        path: "notice",
        name: "notice",
        component: () => import("@/views/notice/notice.vue"),
        children: [],
      },
    ],
  },
];
const routerHistory = createWebHashHistory();
const router = createRouter({
  history: routerHistory,
  routes,
});
//全局前置守卫
// router.beforeEach((to, from, next) => {
//   const { user, token } = store.state;
//   const { redirectAlreadyLogin, requiredLogin } = to.meta;
//   if (!user.isLogin) {
//     if (token) {
//       next("/");
//     } else {
//         next("login");
//     }
//     // } else if (redirectAlreadyLogin) {
//     //   next("/");
//   } else {
//     next();
//   }
// });
// 全局导航守卫
export default router;

<script setup lang="ts">
import { is_mobile } from "@/services/util";
import { getSearchParamValue } from "@/services/util";
import request from "@/services/api";
import { storeToRefs } from "pinia";
import router from "@/router";
import useCurrentInstance from "@/hooks/useCurrentInstance";
import appStore from "@/store";
import setTheme from "@/hooks/theme";
import setDark from "@/hooks/dark";
import "dayjs/locale/zh-cn";
import "dayjs/locale/en";
import "dayjs/locale/zh-hk";
import "dayjs/locale/ja";

const socket: any = inject("socket");
const dayjs: any = inject("dayjs");
const { proxy } = useCurrentInstance();
const { token } = storeToRefs(appStore.authStore);
const { dark, locale } = storeToRefs(appStore.commonStore);
const { setToken, getUserInfo, getMateList } = appStore.authStore;
const { setDeviceType, setCommonDark, setCommonLocale } = appStore.commonStore;

const musicRef = ref<any>(null);
// onBeforeMount(() => {

// });
onBeforeMount(() => {
  window.addEventListener("message", handle, false);
  let url = window.location.href;
  //自动切换为https
  if (url.indexOf("http://localhost") === -1 && url.indexOf("https") < 0) {
    url = url.replace("http:", "https:");
    window.location.replace(url);
  }
  const deviceWidth = document.documentElement.offsetWidth;
  if (is_mobile() || deviceWidth < 700) {
    setDeviceType("phone");
  }
  const search = window.location.search
    ? window.location.search.split("?")[1]
    : window.location.hash.split("?")[1];
  const token = getSearchParamValue(search, "token")
    ? (getSearchParamValue(search, "token") as string)
    : localStorage.getItem("token");
  if (token) {
    request.setToken(token);
    setToken(token);
  } else {
    router.push("/");
  }
  const deviceType = getSearchParamValue(search, "deviceType") as string;
  setDark(dark.value);
  const lang = getSearchParamValue(search, "lang") as string;
  const darkTheme = getSearchParamValue(search, "dark") as string;
  if (lang) {
    localStorage.setItem("LANGUAGE", lang);
  }
  if (darkTheme === "1") {
    localStorage.setItem("DARK", darkTheme);
    setCommonDark(true);
    setDark(true);
  } else if (darkTheme === "0") {
    localStorage.removeItem("DARK");
    setCommonDark(false);
    setDark(false);
  }

  if (deviceType||is_mobile()) {
    setDeviceType("mobile");
  }
  proxy.$i18n.locale = localStorage.getItem("LANGUAGE")
    ? (localStorage.getItem("LANGUAGE") as string)
    : // : navigator.language === "zh-TW"
      // ? "tc"
      // : navigator.language === "zh-CN"
      // ? "zh"
      // : navigator.language;
      "zh";
  setCommonLocale(proxy.$i18n.locale);
  setTheme("#484848");
});
onUnmounted(() => {
  window.removeEventListener("message", handle, false);
});
const handle = (e: any) => {
  if (
    e.origin === "https://account.qingtime.cn" &&
    e.data.eventName === "redirect"
  ) {
    const token = getSearchParamValue(
      e.data.data.split("?")[1],
      "token"
    ) as string;
    request.setToken(token);
    setToken(token);
    router.push("/home");
  }
};
//初始化
watch(
  token,
  (newVal) => {
    if (newVal) {
      getUserInfo();
    }
  },
  { immediate: true }
);
watch(
  locale,
  (newVal) => {
    console.log(newVal);
    switch (newVal) {
      case "zh":
        dayjs.locale("zh-cn");
        break;
      case "en":
        dayjs.locale("en");
        break;
      case "ja":
        dayjs.locale("ja");
        break;
      case "tc":
        dayjs.locale("zh-hk");
        break;
    }
  },
  { immediate: true }
);
</script>

<template>
  <router-view></router-view>
  <audio
    ref="musicRef"
    src=""
    :style="{ position: 'fixed', zIndex: -5, opacity: 0 }"
  >
    您的浏览器不支持 audio 标签。
  </audio>
</template>

<style lang="scss">
#app {
  background: var(--diary-bg-color);
}
*::-webkit-scrollbar {
  width: 4px;
  height: 2px;
}

*::-webkit-scrollbar-thumb {
  background: var(--diary-font-color);
  border-radius: 100px;
}
.common-color {
  color: #3C9915 !important;
}
// .container {
//   padding: 10px;
//   box-sizing: border-box;
//   .left {
//     // cursor: pointer;
//     .img {
//       width: 30px;
//       height: 30px;
//     }
//     .name {
//       margin-left: 15px;
//       font-size: 16px;
//       font-weight: 400;
//     }
//   }
//   .right {
//     cursor: pointer;
//     // display: none;
//   }
//   &:hover {
//     background-color: var(--talk-hover-color);
//     // .right {
//     //   display: block;
//     // }
//   }
// }
.el-textarea__inner {
  color: var(--talk-font-color) !important;
}
</style>

<script setup lang="ts">
import { is_mobile } from "@/services/util";
import logoSvg from "@/assets/svg/logo.svg";
import logobSvg from "@/assets/svg/logo.svg";
const router = useRouter();
onMounted(() => {
  if (localStorage.getItem("token")) {
    router.push("/home");
  }
});

const login = () => {
  let redirect = encodeURIComponent(
    `${window.location.protocol}//${window.location.host}/#/home/`
  );
  console.log(redirect);
  localStorage.clear();
  // `https://account.qingtime.cn?apphigh=50&redirect=&logo=https://workfly.qingtime.cn/1650849409262_workingVip.png`;
  let href: string = `https://account.qingtime.cn/?app=10&apphigh=61&logo=https://cdn-diary.qingtime.cn/1667387078338_diary.svg&redirect=${redirect}`;
  if (is_mobile()) {
    window.open(href);
  } else {
    window.open(href, "_self");
  }
};
</script>
<template>
  <div class="welcome">
    <div class="logo-img dp-center-center">
      <img :src="logoSvg" alt="" class="logo" />
      <div class="logo-title">{{ $t("name") }}</div>
    </div>
    <div class="logo-button dp-center-center">
      <cbutton @click="login" class="button" round>{{
        $t(`common.login`)
      }}</cbutton>
      <div class="welcome-bottom"></div>
      <!-- https://qingdou.app -->
    </div>
  </div>
</template>
<style scoped lang="scss">
.welcome {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-content: space-between;
  flex-wrap: wrap;
  background: var(--talk-bg-color);
  color: var(--talk-font-color);
  .logo-img {
    width: 100%;
    height: 70vh;
    flex-wrap: wrap;
    align-content: center;
    .logo {
      max-width: 300px;
      min-width: 180px;
      width: 30vw;
    }
    .logo-title {
      width: 100%;
      height: 30px;
      text-align: center;
      margin-top: 30px;
      color: var(--talk-font-color);
      font-size: 23px;
    }
  }
  .logo-button {
    width: 100%;
    height: 100px;
    flex-wrap: wrap;
    padding-bottom: 30px;
    .button {
      width: 90px;
      height: 30px;
      margin-bottom: 10px;
    }
    .welcome-bottom {
      width: 100%;
      color: #999;
      font-size: 12px;
      text-align: center;
    }
  }
}
</style>
<style></style>

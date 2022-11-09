<script setup lang="ts">
import { is_mobile } from "@/services/util";
import logoSvg from "@/assets/svg/logo.svg";
import logobSvg from "@/assets/svg/logob.svg";
import logo1Svg from "@/assets/svg/logo1.svg";
import logo2Svg from "@/assets/svg/logo2.svg";
import logo3Svg from "@/assets/svg/logo3.svg";
import logo4Svg from "@/assets/svg/logo4.svg";
import logo5Svg from "@/assets/svg/logo5.svg";
import logo6Svg from "@/assets/svg/logo6.svg";
import logo7Svg from "@/assets/svg/logo7.svg";
import logo8Svg from "@/assets/svg/logo8.svg";
import logo9Png from "@/assets/img/logo9.png";
import bgPng from "@/assets/img/bg.png";
import centerLeftPng from "@/assets/img/centerLeft.png";
import centerRightPng from "@/assets/img/centerRight.png";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import router from "@/router";
const { deviceType } = storeToRefs(appStore.commonStore);
onMounted(() => {});

const login = () => {
  if (localStorage.getItem("token")) {
    router.push("/home");
  } else {
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
  }
};
</script>
<template>
  <div
    class="welcome"
    :class="{
      computer: deviceType === 'computer',
      mobile: deviceType === 'mobile',
    }"
  >
    <div class="header">
      <div class="left">
        <div>下载</div>
        <div>隐私政策</div>
      </div>
      <div class="right" @click="login">立即体验</div>
    </div>
    <div class="top" :style="{ backgroundImage: `url(${bgPng})` }">
      <div class="top-box">
        <img :src="logobSvg" alt="" class="logo" />
        <div class="title">时光日记</div>
        <div class="subtitle">书写时光，留住感动</div>
      </div>
    </div>
    <div class="center">
      <div
        class="left"
       
      ><img :src="centerLeftPng" alt=""></div>
      <div class="right">
        <div class="img"><img :src="centerRightPng" alt=""/></div>
        
        <div>Diary easy to take</div>
        <div>Private mood tree hole</div>
        <div>Keep the habit of writing diary</div>
      </div>
    </div>
    <div class="bottom">
      <div class="top">
        <div class="logo">
          <div class="img"><img :src="logo1Svg" alt="" /></div>
          <div class="title">纯粹的日记</div>
          <div class="subtitle">块文档，书写更自由</div>
        </div>
        <div class="logo">
          <div class="img"><img :src="logo2Svg" alt="" /></div>
          <div class="title">漂流日记</div>
          <div class="subtitle">遇见一个可以谈心的笔友</div>
        </div>
        <div class="logo">
          <div class="img"><img :src="logo3Svg" alt="" /></div>
          <div class="title">分享日记</div>
          <div class="subtitle">分享生活，分享感动</div>
        </div>
        <div class="logo">
          <div class="img"><img :src="logo4Svg" alt="" /></div>
          <div class="title">多端同步</div>
          <div class="subtitle">电脑端书写更边界</div>
        </div>
        <div class="logo">
          <div class="img"><img :src="logo5Svg" alt="" /></div>
          <div class="title">安全保密</div>
          <div class="subtitle">保护隐私，安心书写</div>
        </div>
        <div class="logo">
          <div class="img"><img :src="logo6Svg" alt="" /></div>
          <div class="title">夜间关怀</div>
          <div class="subtitle">夜间书写更护眼</div>
        </div>
      </div>
      <div class="center">
        <div class="left"><img :src="logo7Svg" alt="" /></div>
        <div class="right"><img :src="logo8Svg" alt="" /></div>
      </div>
      <div class="button">
        <cbutton @click="login" class="button" round style="width: 120px">
          立即体验
        </cbutton>
      </div>
      <img :src="logo9Png" alt="" class="bgLogo" />
    </div>
    <div class="footer">
      <div>江苏脑际互联科技有限公司</div>
      <div>Copyright &#169 2022 diary.qingtime.cn.</div>
      <div>Tel:0519-83908995</div>
      <div>Email:liux@qingtime.cn 苏ICP备15006448号</div>
    </div>
  </div>
</template>
<style src="./welcome.scss" scoped lang="scss"></style>
<style></style>

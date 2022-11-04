<script setup lang="ts">
import appStore from "@/store";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import Avatar from "@/components/cavatar.vue";
import router from "@/router";
const { driftList, driftKey } = storeToRefs(appStore.driftStore);
const { getDrift, deleteDrift, setDriftKey } = appStore.driftStore;
const diaryRef = ref<any>(null);
const timer = ref<any>(null);
const clickState = ref<boolean>(true);
const oldx = ref<number>(0);
const newx = ref<number>(0);
onMounted(() => {
  if (driftList.value.length === 0) {
    getDrift();
  }
  // console.log(diaryRef.value);
});
onUnmounted(() => {
  setDriftKey("");
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
});
const moveDiary = (key: string, e?: any) => {
  let num = 0;
  if (e) {
    num = oldx.value - e.clientX;
  } else {
    num = oldx.value - newx.value;
  }

  if (num > 50 || num < -50) {
    setDriftKey(key);
    clickState.value = false;
    timer.value = setTimeout(() => {
      deleteDrift(key);
      clickState.value = true;
    }, 1000);
  } else {
    router.push(`/home/preview/${key}`);
  }
};
// const clickDiary = (key: stringy) => {

// };
</script>
<template>
  <cheader isMenu>
    <template #title>{{ $t("userCenter.drift") }}</template>
    <template #right></template>
  </cheader>
  <div class="drift box">
    <div class="container">
      <div
        class="item"
        v-for="(item, index) in driftList"
        :key="item._key"
        :style="{
          zIndex: driftList.length - index,
          transform: `rotate(${index * 1}deg)`,
        }"
        :class="{ 'item-fly': driftKey === item._key }"
        @mousedown="
          (e) => {
            oldx = e.clientX;
          }
        "
        @mouseup="
          (e) => {
            clickState ? moveDiary(item._key, e) : null;
          }
        "
        @touchstart="
          (e) => {
            oldx = e.touches[0].clientX;
          }
        "
        @touchmove="
          (e) => {
            newx = e.touches[0].clientX;
          }
        "
        @touchend="
          (e) => {
            clickState ? moveDiary(item._key) : null;
          }
        "
      >
        <div class="diary" ref="diaryRef">
          <div class="title">{{ item.title }}</div>
          <div class="summary">{{ item.summary }}</div>
        </div>
        <div class="user" v-if="index === 0">
          <avatar
            :name="item.userName"
            :avatar="item.userAvatar"
            :index="0"
            :size="80"
            :avatarStyle="{
              fontSize: '20px',
              marginRight: '8px',
            }"
          />
          {{ item.userName }}
        </div>
      </div>
    </div>
  </div>
</template>
<style src="./drift.scss" scoped lang="scss"></style>
<style>
.item-fly {
  animation: fly 2s;
  animation-fill-mode: forwards;
}
@keyframes fly {
  0% {
    opacity: 1;
    top: 50px;
    left: calc(50% - 40vw);
    transform: rotate(0deg);
  }
  100% {
    opacity: 0;
    top: 80vh;
    left: -10vw;
    transform: rotate(90deg);
  }
}
</style>

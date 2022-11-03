<script setup lang="ts">
import appStore from "@/store";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
const { driftList } = storeToRefs(appStore.driftStore);
const { getDrift } = appStore.driftStore;
const diaryRef = ref<any>(null);
onMounted(() => {
  getDrift();
  console.log(diaryRef.value);
});
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
          transform: `rotate(${index * 2}deg)`,
        }"
      >
        <div class="diary" ref="diaryRef">
          <div class="title">{{ item.title }}</div>
          <div class="summary">{{ item.summary }}</div>
        </div>
        <div class="user"></div>
      </div>
    </div>
  </div>
</template>
<style src="./drift.scss" scoped lang="scss"></style>
<style></style>

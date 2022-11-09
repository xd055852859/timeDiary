<script setup lang="ts">
import { Diary } from "@/interface/Diary";
import router from "@/router";
import appStore from "@/store";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import "./diaryItem.scss";
const dayjs: any = inject("dayjs");
const props = defineProps<{
  info: Diary;
  friendKey?: string;
  type?: string;
}>();
const toDetail = () => {
  router.push(`/home/preview/${props.info._key}`);
};
</script>
<template>
  <div class="diary-item">
    <div class="left">
      <template v-if="info?.diaryDate && info.dateShow">
        <div class="month">{{ info.diaryDate[1] }}</div>
        <div class="day">{{ info.diaryDate[0] }}月</div>
      </template>
    </div>
    <div class="right" @click="toDetail">
      <div v-if="info.title" class="title">{{ info.title }}</div>
      <div class="summary">{{ info.summary }}</div>
      <div class="image" v-if="info.imageList && info.imageList.length > 0">
        <div
          v-for="(item, index) in info.imageList"
          class="item"
          :key="info._key + 'image' + index"
        >
          <img
            :src="
              item.indexOf('.svg') !== -1
                ? item
                : `${item}?imageView2/1/w/150/h/150`
            "
            alt=""
          />
        </div>
      </div>
      <div class="time">{{ dayjs(info.storyTime).format("HH:mm") }}</div>
    </div>
  </div>
</template>
<style src="./diaryItem.scss" scoped lang="scss"></style>
<style></style>

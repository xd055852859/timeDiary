<script setup lang="ts">
import appStore from "@/store";
import { ElMessage } from "element-plus";
import Avatar from "@/components/cavatar.vue";
import { storeToRefs } from "pinia";
import DiaryItem from "./diaryItem.vue";
import { ResultProps } from "@/interface/Common";
import homeDiaryPng from "@/assets/img/homeDiary.png";
import api from "@/services/api";
const route = useRoute();
const { diaryFriendList, friendTotal, friendPage } = storeToRefs(
  appStore.diaryStore
);
const { getDiaryList, setFriendPage } = appStore.diaryStore;
const targetKey = ref<string>("");
const targetDetail = ref<{
  beFriend: boolean;
  userAvatar: string;
  userName: string;
  _key: string;
} | null>(null);
onMounted(() => {
  targetKey.value = route.params.id as string;
  getFriendDetail();
  getDiaryList(1, targetKey.value);
});
const getFriendDetail = async () => {
  const detailRes = (await api.request.get("user/target", {
    targetUserKey: targetKey.value,
  })) as ResultProps;
  if (detailRes.msg === "OK") {
    targetDetail.value = detailRes.data;
  }
};
const scrollDiary = (e: any) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let height = e.target.clientHeight;
  if (
    height + scrollTop >= scrollHeight &&
    diaryFriendList.value.length < friendTotal.value
  ) {
    let newPage = friendPage.value + 1;
    setFriendPage(newPage);
  }
};
watch(friendPage, (newVal) => {
  if (newVal !== 1) {
    getDiaryList(newVal, targetKey.value);
  }
});
</script>
<template clickState :clickBack="clickDiary()">
  <cheader :headerStyle="{ background: '#86b885', color: '#fff' }">
    <template #title>{{ $t("homeDiary.homeDiary") }}</template>
    <template #right></template>
  </cheader>
  <div class="home-diary-header">
    <img :src="homeDiaryPng" alt="" class="bg" />
    <div class="home-diary-avatar">
      <avatar
        :name="targetDetail?.userName"
        :avatar="targetDetail?.userAvatar"
        :index="0"
        :size="100"
        :avatarStyle="{
          fontSize: '20px',
          marginBottom: '8px',
        }"
      />
      <div class="name">{{ targetDetail?.userName }}</div>
    </div>
  </div>
  <div
    class="home-diary box"
    @scroll="scrollDiary"
    :style="{ height: 'calc(79vh - 50px)', paddingTop: '10vh' }"
  >
    <div class="container">
      <template v-for="diaryItem in diaryFriendList" :key="diaryItem._key">
        <DiaryItem :info="diaryItem" :friendKey="targetKey" />
      </template>
    </div>
  </div>
</template>
<style src="./homeDiary.scss" scoped lang="scss"></style>
<style></style>

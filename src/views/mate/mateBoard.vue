<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import { Person } from "@/interface/User";
import Avatar from "@/components/cavatar.vue";
import mateLogoSvg from "@/assets/svg/mateLogo.svg";
import api from "@/services/api";
import router from "@/router";
import { MoreFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import i18n from "@/language/i18n";
const { user } = storeToRefs(appStore.authStore);
const route = useRoute();
const friendKey = ref<string>("");
const setVisible = ref<boolean>(false);
const stopState = ref<boolean>(false);
const hideState = ref<boolean>(false);
const unfriendVisible = ref<boolean>(false);
const relationDetail = ref<{
  hisCardNum: number;
  hisPhotoNum: number;
  myCardNum: number;
  myPhotoNum: number;
} | null>(null);
const mateDetail = ref<Person | null>(null);
onMounted(() => {
  friendKey.value = route.params.id as string;
  getRelationDetail();
  getMateDetail();
});
const getRelationDetail = async () => {
  const relationRes = (await api.request.get("friend/relation", {
    friendKey: friendKey.value,
  })) as ResultProps;
  if (relationRes.msg === "OK") {
    relationDetail.value = relationRes.data;
    if (relationRes.data.stopShare === 1) stopState.value = true;
    if (relationRes.data.stopShare === 2) hideState.value = true;
  }
};
const getMateDetail = async () => {
  const mateRes = (await api.request.get("user/target", {
    targetUserKey: friendKey.value,
  })) as ResultProps;
  if (mateRes.msg === "OK") {
    mateDetail.value = mateRes.data;
  }
};
const updateRelation = async () => {
  let stopShare = 0;
  if (stopState.value) stopShare = 1;
  if (stopState.value && hideState.value) stopShare = 2;
  const relationRes = (await api.request.patch("friend", {
    friendKey: friendKey.value,
    stopShare: stopShare,
  })) as ResultProps;
  if (relationRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t("mateBoard.shareSuccess"),
      type: "success",
      duration: 1000,
    });
  }
};
const stopRelation = async () => {
  unfriendVisible.value = false;
  const relationRes = (await api.request.delete("friend", {
    friendKey: friendKey.value,
  })) as ResultProps;
  if (relationRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t("mateBoard.unfriendSuccess"),
      type: "success",
      duration: 1000,
    });
    router.push("/home/mate");
  }
};
watch(hideState, (newState) => {
  if (newState) {
    stopState.value = true;
  }
});
</script>
<template>
  <cheader isMenu>
    <template #title>{{ $t("mateBoard.header") }}</template>
    <template #right>
      <el-icon @click="setVisible = true"><MoreFilled /></el-icon>
    </template>
  </cheader>
  <div class="mateboard box">
    <div class="container">
      <div class="title">{{ $t("mateBoard.title") }}</div>
      <div class="info">
        <div class="left" v-if="user">
          <avatar
            :key="user?._key"
            :name="user?.userName"
            :avatar="user?.userAvatar"
            :index="0"
            :size="55"
            :avatarStyle="{
              fontSize: '20px',
              marginRight: '3px',
            }"
          />
          <div class="name">{{ user?.userName }}</div>
        </div>
        <div class="right" v-if="mateDetail">
          <avatar
            :key="mateDetail?._key"
            :name="mateDetail?.userName"
            :avatar="mateDetail?.userAvatar"
            :index="0"
            :size="55"
            :avatarStyle="{
              fontSize: '20px',
              marginRight: '3px',
            }"
          />
          <div class="name">{{ mateDetail?.userName }}</div>
        </div>
      </div>
      <div class="card">
        <div
          class="left"
          @click="$router.push(`/home/homeDiary/${user?._key}`)"
        >
          <div class="num">{{ relationDetail?.myCardNum }}</div>
        </div>
        <div class="center">
          <cicon name="edit" :size="60" />
        </div>
        <div
          class="right"
          @click="$router.push(`/home/homeDiary/${mateDetail?._key}`)"
        >
          <div class="num">{{ relationDetail?.hisCardNum }}</div>
        </div>
      </div>
      <div class="card">
        <div class="left">
          <div class="num">{{ relationDetail?.myPhotoNum }}</div>
        </div>
        <div class="center">
          <cicon name="mateImg" :size="60" />
        </div>
        <div class="right">
          <div class="num">{{ relationDetail?.hisPhotoNum }}</div>
        </div>
      </div>
      <div class="logo">
        <img :src="mateLogoSvg" alt="" />
      </div>
    </div>
    <el-drawer
      v-model="setVisible"
      direction="btt"
      size="300px"
      @close="
        updateRelation();
        setVisible = false;
      "
    >
      <div class="set">
        <div class="title">
          {{ $t("mateBoard.stopShareTitle") }}
          <el-switch v-model="stopState" />
        </div>
        <div class="subtitle">{{ $t("mateBoard.stopShareText") }}</div>
        <div class="title">
          {{ $t("mateBoard.hideShareTitle") }}
          <el-switch v-model="hideState" />
        </div>
        <div class="subtitle">{{ $t("mateBoard.hideShareText") }}</div>
        <div class="button">
          <el-button type="primary" @click="unfriendVisible = true">{{
            $t("mateBoard.unfriend")
          }}</el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      v-model="unfriendVisible"
      :title="$t('mateBoard.unfriendTip')"
      width="30%"
    >
      <span>{{ $t("mateBoard.unfriendText") }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="unfriendVisible = false">{{
            $t("cancel")
          }}</el-button>
          <el-button type="primary" @click="stopRelation()">
            {{ $t("sure") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style src="./mateBoard.scss" scoped lang="scss"></style>
<style></style>

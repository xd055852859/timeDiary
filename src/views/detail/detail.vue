<script setup lang="ts">
import { ElMessage } from "element-plus";
import Tiptap from "@/components/editor/tiptap.vue";
import appStore from "@/store";
import i18n from "@/language/i18n";
import Avatar from "@/components/cavatar.vue";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import router from "@/router";
import { storeToRefs } from "pinia";
import { getSearchParamValue } from "@/services/util";
const { statusHeight, navigationHeight } = storeToRefs(appStore.commonStore);
const { diaryDetail, imageList } = storeToRefs(appStore.diaryStore);
const { getDiaryDetail, setImageList } = appStore.diaryStore;
const { getFilterMate } = appStore.mateStore;
const { filterMateList } = storeToRefs(appStore.mateStore);
const dayjs: any = inject("dayjs");
const route = useRoute();
const editorRef = ref<any>(null);
const weather = ref<string>("");
const location = ref<string>("");
const shareTo = ref<string[]>([]);
const isPublic = ref<boolean>(false);
const diaryKey = ref<string | null>("");
const timer = ref<number | null>(null);
const targetDate = ref<number>(0);
const saveState = ref<number>(0);
const shareVisible = ref<boolean>(false);
onMounted(() => {
  diaryKey.value =
    route.params.id !== "create" ? (route.params.id as string) : "";
  if (diaryKey.value) {
    getDiaryDetail(diaryKey.value as string);
  }
  getTime();
  getFilterMate(0, 1);
  timer.value = setInterval(() => {
    handleSave("auto");
  }, 3000);
});
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
});
const getTime = () => {
  const search = window.location.search
    ? window.location.search.split("?")[1]
    : window.location.hash.split("?")[1];
  targetDate.value = +(getSearchParamValue(search, "date") as string);
};
const handleSave = async (type?: string) => {
  if (editorRef.value) {
    let saveArray = editorRef.value.handlePost();
    diaryKey.value =
      route.params.id !== "create" ? (route.params.id as string) : "";
    getTime();
    if (saveArray) {
      saveState.value = 1;
      const [title, content, summary, cover] = saveArray;
      let obj = {
        title: title,
        content: content,
        summary: summary,
        cover: cover,
      };
      if (diaryKey.value) {
        const postRes = (await api.request.patch("card", {
          cardKey: diaryKey.value,
          ...obj,
        })) as ResultProps;
        if (postRes.msg === "OK") {
          saveState.value = 2;
        }
      } else {
        const postRes = (await api.request.post("card", {
          storyTime: targetDate.value,
          imageList: imageList.value,
          ...obj,
        })) as ResultProps;
        if (postRes.msg === "OK") {
          saveState.value = 2;
          setImageList([]);
          router.push(
            `/home/detail/${postRes.data._key}?date=` + targetDate.value
          );
        }
      }
    }
  }
};
const handleSetSave = async (
  key: string,
  value: string | boolean | string[]
) => {
  diaryKey.value =
    route.params.id !== "create" ? (route.params.id as string) : "";
  if (diaryKey.value) {
    api.request.patch("card", {
      cardKey: diaryKey.value,
      [key]: value,
    });
  } else {
    const postRes = (await api.request.post("card", {
      storyTime: targetDate.value,
      [key]: value,
    })) as ResultProps;
    if (postRes.msg === "OK") {
      router.push(`/home/detail/${postRes.data._key}?date=` + targetDate.value);
    }
  }
};
const clickBack = () => {
  router.push("/home/diary");
};
const chooseShare = (key: string) => {
  let index = shareTo.value.indexOf(key);
  if (index !== -1) {
    shareTo.value.splice(index, 1);
  } else {
    shareTo.value.push(key);
  }
};
watch(diaryDetail, (newVal) => {
  if (newVal) {
    weather.value = diaryDetail.value?.weather || "";
    location.value = diaryDetail.value?.location || "";
    isPublic.value = !!diaryDetail.value?.isPublic;
    shareTo.value = diaryDetail.value?.shareTo || [];
  }
});
</script>
<template>
  <cheader @clickBack="clickBack" clickState>
    <template #title>{{ dayjs(targetDate).format("MM月DD日") }}</template>
    <template #right
      ><div style="color: var(--diary-font-time); font-size: 14px">
        {{
          saveState === 2
            ? $t("detail.saved")
            : saveState === 1
            ? $t("detail.saving")
            : ""
        }}
      </div></template
    >
  </cheader>
  <div
    class="diary-editor box"
    :style="{
      height:
        statusHeight && navigationHeight
          ? `calc(100vh - ${+statusHeight + +navigationHeight + 30}px)`
          : `calc(100vh - 85px)`,
    }"
  >
    <div class="editor">
      <Tiptap
        ref="editorRef"
        :initData="diaryDetail?.content"
        :isEdit="true"
        :diaryKey="(diaryKey as string)"
      />
    </div>
    <div class="set">
      <div class="item">
        <div class="dp--center">
          <iconpark-icon
            name="weather"
            :size="20"
            style="margin-right: 5px"
          />{{ $t("detail.weather") }}
        </div>
        <div>
          {{ weather }}
          <iconpark-icon
            name="rightArrow"
            :size="18"
            style="margin-left: 5px"
          />
        </div>
      </div>
      <div class="item">
        <div class="dp--center">
          <iconpark-icon
            name="location"
            :size="20"
            style="margin-right: 5px"
          />{{ $t("detail.location") }}
        </div>
        <div>
          {{ location }}
          <iconpark-icon
            name="rightArrow"
            :size="18"
            style="margin-left: 5px"
          />
        </div>
      </div>
      <div class="item" @click="shareVisible = true">
        <div class="dp--center">
          <iconpark-icon
            name="shareTo"
            :size="20"
            style="margin-right: 5px"
          />{{ $t("detail.shareTo") }}
        </div>
        <div class="dp--center">
          <avatar
            v-for="item in filterMateList"
            :key="item._key"
            :name="item.userName"
            :avatar="item.userAvatar"
            :index="0"
            :size="30"
            :avatarStyle="{
              fontSize: '20px',
              marginRight: '3px',
            }"
          />
          <iconpark-icon
            name="rightArrow"
            :size="18"
            style="margin-left: 2px"
          />
        </div>
      </div>
      <div class="item">
        <div class="dp--center">
          <iconpark-icon
            name="isPublic"
            :size="20"
            style="margin-right: 5px"
          />{{ $t("detail.isPublic") }}
        </div>
        <el-switch
          v-model="isPublic"
          @change="(val) => handleSetSave('isPublic', val)"
        />
      </div>
    </div>
    <el-drawer
      v-model="shareVisible"
      :title="$t('detail.shareTo')"
      direction="btt"
      size="60%"
      @close="
        () => {
          handleSetSave('shareTo', shareTo);
          shareVisible = false;
        }
      "
    >
      <div class="share-box">
        <el-row :gutter="20" class="row">
          <el-col
            :xs="8"
            :sm="6"
            :md="4"
            :lg="3"
            :xl="1"
            v-for="item in filterMateList"
            :key="item._key"
          >
            <div class="item" @click="chooseShare(item._key)">
              <avatar
                :name="item.userName"
                :avatar="item.userAvatar"
                :index="0"
                :size="80"
                :avatarStyle="{
                  fontSize: '20px',
                  marginRight: '8px',
                }"
                :chooseState="shareTo.indexOf(item._key) !== -1"
                :borderState="shareTo.indexOf(item._key) !== -1"
              />
              <div class="name">{{ item.userName }}</div>
              <iconpark-icon
                name="chooseShare"
                color="#3C9915"
                :size="25"
                class="icon"
                v-if="shareTo.indexOf(item._key) !== -1"
              />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>
<style src="./detail.scss" scoped lang="scss"></style>
<style lang="scss"></style>

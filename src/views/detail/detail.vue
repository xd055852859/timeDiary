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
import { Person } from "@/interface/User";
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
const sharers = ref<Person[]>([]);
const isPublic = ref<boolean>(false);
const diaryKey = ref<string | null>("");
const timer = ref<number | null>(null);
const targetDate = ref<number>(0);
const saveState = ref<number>(0);
const shareVisible = ref<boolean>(false);
const weatherVisible = ref<boolean>(false);
const imgSrc = ref<string>("");
// const testText = ref<string>("测试key");
const weatherArray = [
  "fog",
  "sunny",
  "cloudy",
  "windy",
  "rainy",
  "thunderstorm",
  "snowy",
  "partlyCloudy",
  "haily",
  "sandy",
];
onMounted(() => {
  diaryKey.value =
    route.params.id !== "create" ? (route.params.id as string) : "";
  if (diaryKey.value) {
    getDiaryDetail(diaryKey.value as string);
    //@ts-ignore
    if (window.webkit) {
      //@ts-ignore
      window.webkit.messageHandlers.returnCardKey.postMessage(diaryKey.value);
      // testText.value = "编辑" + diaryKey.value;
    }
  }
  getTime();
  getFilterMate(0, 1);
  timer.value = setInterval(() => {
    handleSave("auto");
  }, 3000);
  //
});
(window as any).getPhoneImage = (file: any) => {
  // alert("测试" + editState)
  imgSrc.value = file;
};
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
  console.log(targetDate.value);
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
          //@ts-ignore
          if (window.webkit) {
            //@ts-ignore
            window.webkit.messageHandlers.returnCardKey.postMessage(
              postRes.data._key
            );
            // testText.value = "创建" + postRes.data._key;
          }
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
      //@ts-ignore
      if (window.webkit) {
        //@ts-ignore
        window.webkit.messageHandlers.returnCardKey.postMessage(
          postRes.data._key
        );
        // testText.value = "创建" + postRes.data._key;
      }
      router.push(`/home/detail/${postRes.data._key}?date=` + targetDate.value);
    }
  }
};
const clickBack = () => {
  router.push("/home/diary");
};
const chooseShare = (item: Person) => {
  let index = shareTo.value.indexOf(item._key);
  if (index !== -1) {
    shareTo.value.splice(index, 1);
    sharers.value.splice(index, 1);
  } else {
    shareTo.value.push(item._key);
    sharers.value.push(item);
  }
};
watch(diaryDetail, (newVal) => {
  if (newVal) {
    weather.value = diaryDetail.value?.weather || "";
    location.value = diaryDetail.value?.location || "";
    isPublic.value = !!diaryDetail.value?.isPublic;
    shareTo.value = diaryDetail.value?.shareTo || [];
    sharers.value = diaryDetail.value?.sharers || [];
  }
});
</script>
<template>
  <cheader
    @clickBack="clickBack"
    clickState
    :headerStyle="{ backgroundColor: 'var(--diary-diary-color)' }"
  >
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
  <!-- <div>{{ testText }}</div> -->
  <!-- <img :src="imgSrc" alt="" v-if="imgSrc" style="width: 300px; height: 300px" /> -->
  <div
    class="diary-editor box"
    :style="{
      height:
        statusHeight && navigationHeight
          ? `calc(100vh - ${+statusHeight + +navigationHeight}px)`
          : `calc(100vh - 55px)`,
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
      <div class="item" @click="weatherVisible = true">
        <div class="dp--center">
          <cicon
            name="weather"
            :size="20"
            style="margin-right: 5px; color: var(--diary-font-time)"
          />{{ $t("detail.weather") }}
        </div>
        <div class="dp-center-center">
          <cicon
            :name="weather"
            :size="20"
            style="margin-right: 5px; color: var(--diary-font-time)"
            v-if="weather"
          />
          <div v-if="weather">{{ $t(`weather.${weather}`) }}</div>
          <cicon
            name="rightArrow"
            :size="18"
            style="margin-left: 5px; color: var(--diary-font-time)"
          />
        </div>
      </div>
      <div class="item">
        <div class="dp--center">
          <cicon
            name="location"
            :size="20"
            style="margin-right: 5px; color: var(--diary-font-time)"
          />{{ $t("detail.location") }}
        </div>
        <div>
          {{ location }}
          <cicon
            name="rightArrow"
            :size="18"
            style="margin-left: 5px; color: var(--diary-font-time)"
          />
        </div>
      </div>
      <div class="item" @click="shareVisible = true">
        <div class="dp--center">
          <cicon
            name="shareTo"
            :size="20"
            style="margin-right: 5px; color: var(--diary-font-time)"
          />{{ $t("detail.shareTo") }}
        </div>
        <div class="dp--center">
          <avatar
            v-for="item in sharers"
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
          <cicon
            name="rightArrow"
            :size="18"
            style="margin-left: 2px; color: var(--diary-font-time)"
          />
        </div>
      </div>
      <div class="item">
        <div class="dp--center">
          <cicon
            name="isPublic"
            :size="20"
            style="margin-right: 5px; color: var(--diary-font-time)"
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
            <div class="item" @click="chooseShare(item)">
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
              <cicon
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
    <el-drawer
      v-model="weatherVisible"
      direction="btt"
      size="50%"
      @close="
        () => {
          handleSetSave('weather', weather);
          weatherVisible = false;
        }
      "
    >
      <div class="weather-box">
        <div
          v-for="item in weatherArray"
          :key="item"
          class="item"
          @click="
            weather = item;
            weatherVisible = false;
            handleSetSave('weather', item);
          "
        >
          <cicon
            :name="item"
            :size="50"
            style="margin-right: 5px; color: var(--diary-font-time)"
          />
          <div class="title">{{ $t(`weather.${item}`) }}</div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<style src="./detail.scss" scoped lang="scss"></style>
<style lang="scss"></style>

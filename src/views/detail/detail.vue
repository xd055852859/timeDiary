<script setup lang="ts">
import { ElMessage } from "element-plus";
import Tiptap from "@/components/editor/tiptap.vue";
import appStore from "@/store";
import i18n from "@/language/i18n";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import router from "@/router";
import { storeToRefs } from "pinia";
import { getSearchParamValue } from "@/services/util";
const { diaryDetail, imageList } = storeToRefs(appStore.diaryStore);
const { getDiaryDetail, setImageList } = appStore.diaryStore;
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
onMounted(() => {
  diaryKey.value =
    route.params.id !== "create" ? (route.params.id as string) : "";
  if (diaryKey.value) {
    getDiaryDetail(diaryKey.value as string);
  }
  getTime();
  timer.value = setInterval(() => {
    handleSave("auto");
  }, 8000);
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
      const [title, content, summary, cover] = saveArray;
      let obj = {
        title: title,
        content: content,
        summary: summary,
        location: location.value,
        weather: weather.value,
        isPublic: isPublic.value,
        shareTo: shareTo.value,
        cover: cover,
      };
      if (diaryKey.value) {
        const postRes = (await api.request.patch("card", {
          cardKey: diaryKey.value,
          ...obj,
        })) as ResultProps;
        if (postRes.msg === "OK") {
          if (type !== "auto") {
            ElMessage({
              message: i18n.global.t(`detail.saveSuccess`),
              type: "success",
              duration: 1000,
            });
          }
        }
      } else {
        const postRes = (await api.request.post("card", {
          storyTime: targetDate.value,
          imageList: imageList.value,
          ...obj,
        })) as ResultProps;
        if (postRes.msg === "OK") {
          setImageList([]);
          router.push(
            `/home/detail/${postRes.data._key}?date=` + targetDate.value
          );
        }
      }
    } else if (type === "save") {
      let obj = {
        location: location.value,
        weather: weather.value,
        isPublic: isPublic.value,
        shareTo: shareTo.value,
        imageList: imageList.value,
      };
      if (diaryKey.value) {
        const postRes = (await api.request.patch("card", {
          cardKey: diaryKey.value,
          ...obj,
        })) as ResultProps;
        if (postRes.msg === "OK") {
          ElMessage({
            message: i18n.global.t(`detail.saveSuccess`),
            type: "success",
            duration: 1000,
          });
        }
      } else {
        const postRes = (await api.request.post("card", {
          storyTime: targetDate.value,
          ...obj,
        })) as ResultProps;
        if (postRes.msg === "OK") {
          setImageList([]);
          router.push(
            `/home/detail/${postRes.data._key}?date=` + targetDate.value
          );
        }
      }
    }
  }
};
const clickBack = () => {
  router.push("/home/diary");
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
      ><el-button type="primary" @click="handleSave('save')">{{
        $t("detail.save")
      }}</el-button></template
    >
  </cheader>
  <div class="diary-editor box">
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
      <div class="item">
        <div class="dp--center">
          <iconpark-icon
            name="shareTo"
            :size="20"
            style="margin-right: 5px"
          />{{ $t("detail.shareTo") }}
        </div>
        <div>
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
            name="isPublic"
            :size="20"
            style="margin-right: 5px"
          />{{ $t("detail.isPublic") }}
        </div>
        <el-switch v-model="isPublic" />
      </div>
    </div>
  </div>
</template>
<style src="./detail.scss" scoped lang="scss"></style>
<style></style>

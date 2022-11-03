<script setup lang="ts">
import Tiptap from "@/components/editor/tiptap.vue";
import { ResultProps } from "@/interface/Common";
import i18n from "@/language/i18n";
import router from "@/router";
import api from "@/services/api";
import appStore from "@/store";
import { MoreFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
const { diaryDetail } = storeToRefs(appStore.diaryStore);
const { getDiaryDetail, setDiaryDetail } = appStore.diaryStore;
const dayjs: any = inject("dayjs");
const diaryKey = ref<string | null>("");
const deleteVisible = ref<boolean>(false);
const route = useRoute();
onMounted(() => {
  diaryKey.value = route.params.id as string;
  getDiaryDetail(diaryKey.value);
});
const toEditor = () => {
  router.push(
    `/home/detail/${diaryDetail.value?._key}?date=${dayjs(
      diaryDetail.value?.storyTime
    ).valueOf()}`
  );
};
const deleteDiary = async () => {
  deleteVisible.value = false;
  const deleteRes = (await api.request.delete("card", {
    cardKey: diaryKey.value,
  })) as ResultProps;
  if (deleteRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t("preview.deleteMessage"),
      type: "success",
      duration: 1000,
    });
    router.back();
  }
};
</script>
<template>
  <cheader>
    <template #title></template>
    <template #right>
      <el-dropdown>
        <el-icon><MoreFilled /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toEditor">{{
              $t("preview.edit")
            }}</el-dropdown-item>
            <el-dropdown-item @click="deleteVisible = true">{{
              $t("preview.delete")
            }}</el-dropdown-item>
            <el-dropdown-item>{{ $t("preview.isPublic") }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </cheader>
  <div class="diary-preview box">
    <div class="date">{{ dayjs(diaryDetail?.storyTime).date() }}</div>
    <div class="info">
      <div class="left">
        <div></div>
        <div></div>
      </div>
      <div class="right">
        <div>{{ dayjs(diaryDetail?.storyTime).month() + 1 }}月</div>
        <div>
          星期{{
            "日一二三四五六".substr(dayjs(diaryDetail?.storyTime).day(), 1)
          }}
        </div>
      </div>
    </div>
    <div class="editor">
      <Tiptap
        ref="editorRef"
        :initData="diaryDetail?.content"
        :isEdit="false"
      />
    </div>
    <iconpark-icon
      name="edit"
      :size="50"
      style="cursor: pointer"
      class="edit-button"
      @click="toEditor"
    />
  </div>
  <el-dialog v-model="deleteVisible" title="Tips" width="30%">
    <span>{{ $t("preview.deleteText") }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteVisible = false">{{ $t("cancel") }}</el-button>
        <el-button type="primary" @click="deleteDiary">
          {{ $t("sure") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style src="./preview.scss" scoped lang="scss"></style>
<style></style>

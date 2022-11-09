<script setup lang="ts">
import Tiptap from "@/components/editor/tiptap.vue";
import { ResultProps } from "@/interface/Common";
import i18n from "@/language/i18n";
import router from "@/router";
import api from "@/services/api";
import appStore from "@/store";
import Avatar from "@/components/cavatar.vue";
import { MoreFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import Ccomment from "@/components/ccomment.vue";
import { Comment } from "@/interface/Diary";
const { statusHeight, navigationHeight } = storeToRefs(appStore.commonStore);
const { user } = storeToRefs(appStore.authStore);
const { diaryDetail } = storeToRefs(appStore.diaryStore);
const { getDiaryDetail, setDiaryDetail } = appStore.diaryStore;
const dayjs: any = inject("dayjs");
const diaryKey = ref<string | null>("");
const deleteVisible = ref<boolean>(false);
const commentInput = ref<string>("");
const commentKey = ref<string>("");
const commentList = ref<Comment[]>([]);
const route = useRoute();
onMounted(() => {
  diaryKey.value = route.params.id as string;
  getDiaryDetail(diaryKey.value);
  getComment();
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
const getComment = async () => {
  const postRes = (await api.request.get("comment", {
    cardKey: diaryKey.value,
  })) as ResultProps;
  if (postRes.msg === "OK") {
    commentList.value = [...postRes.data];
  }
};
const postComment = async (pamam: { value: string; commentKey?: string }) => {
  console.log(pamam);
  const postRes = (await api.request.post("comment", {
    cardKey: diaryKey.value,
    content: pamam.value,
    commentId: pamam.commentKey,
  })) as ResultProps;
  if (postRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t("preview.commentText"),
      type: "success",
      duration: 1000,
    });
    commentList.value.unshift(postRes.data);
  }
};
const deleteComment = async (key: string) => {
  const postRes = (await api.request.delete("comment", {
    commentKey: key,
  })) as ResultProps;
  if (postRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t("preview.deleteCommentSuccess"),
      type: "success",
      duration: 1000,
    });
    let index = commentList.value.findIndex((item) => item._key === key);
    if (index !== -1) {
      commentList.value.splice(index, 1);
    }
  }
};
</script>
<template>
  <cheader :headerStyle="{ backgroundColor: 'var(--diary-diary-color)' }">
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
  <div
    class="diary-preview box"
    :style="{
      height:
        statusHeight && navigationHeight
          ? `calc(100vh - ${+statusHeight + +navigationHeight}px)`
          : `calc(100vh - 55px)`,
    }"
  >
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
      <el-divider border-style="dashed" />
      <div class="share">
        <div class="dp-center-center">
          <cicon
            name="shareTo"
            :size="18"
            style="margin-right: 5px; color: var(--diary-font-time)"
          />
          {{ $t("preview.share") }}
        </div>
        <div class="share-avatar">
          <avatar
            v-for="item in diaryDetail?.sharers"
            :key="item._key"
            :name="item.userName"
            :avatar="item.userAvatar"
            :index="0"
            :size="30"
            :avatarStyle="{
              fontSize: '20px',
              marginRight: '3px',
              opacity: item.hasRead ? 1 : 0.5,
            }"
          />
        </div>
      </div>
      <div class="next">下一篇</div>
      <div>
        <template v-for="item in commentList">
          <ccomment
            :commentItem="item"
            @deleteComment="deleteComment"
            @replyComment="postComment"
          />
        </template>
      </div>
    </div>
    <div class="input">
      <el-input
        v-model="commentInput"
        :placeholder="$t('preview.commentInput')"
        @change="() => postComment({ value: commentInput })"
      />
    </div>
    <cicon
      name="edit"
      :size="50"
      style="cursor: pointer"
      class="edit-button"
      @click="toEditor"
      v-if="user?._key === diaryDetail?.userKey"
    />
  </div>
  <el-dialog
    v-model="deleteVisible"
    :title="$t('preview.deleteTips')"
    width="30%"
  >
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
<style lang="scss">
.diary-preview {
  .el-input {
    height: 50px;
    .el-input__wrapper {
      border-radius: 40px;
      @include p-number(20px, 10px);
      .el-input__inner {
        height: 40px;
        font-size: 16px;
      }
    }
  }
}
</style>

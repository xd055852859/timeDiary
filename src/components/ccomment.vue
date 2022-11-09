<script setup lang="ts">
import { ElMessage } from "element-plus";
import Avatar from "@/components/cavatar.vue";
import { Comment } from "@/interface/Diary";
import { Delete } from "@element-plus/icons-vue";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
const dayjs: any = inject("dayjs");
const props = defineProps<{
  commentItem: Comment;
}>();
const emit = defineEmits(["deleteComment", "replyComment"]);
const replyVisible = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);
const commentInput = ref<string>("");
</script>
<template>
  <div class="comment-box">
    <div class="comment">
      <div class="left">
        <avatar
          :key="commentItem._key"
          :name="commentItem.creatorInfo.userName"
          :avatar="commentItem.creatorInfo.userAvatar"
          :index="0"
          :size="40"
          :avatarStyle="{
            fontSize: '20px',
            marginRight: '3px',
          }"
        />
      </div>
      <div class="right">
        <div class="top">{{ commentItem.creatorInfo.userName }}</div>
        <div class="bottom">{{ commentItem.content }}</div>
      </div>
      <div class="time">{{ dayjs(commentItem.createTime).fromNow() }}</div>
      <div class="button">
        <div
          class="reply"
          @click="replyVisible = !replyVisible"
          v-if="!commentItem.targetCommentKey"
        >
          回复
        </div>
        <el-icon style="cursor: pointer" @click="deleteVisible = true"
          ><Delete
        /></el-icon>
      </div>
    </div>
    <div v-if="commentItem.targetCommentKey" class="reply-box">
      <div class="top">
        <avatar
          :name="commentItem.targetUserInfo?.userName"
          :avatar="commentItem.targetUserInfo?.userAvatar"
          :index="0"
          :size="20"
          :avatarStyle="{
            fontSize: '20px',
            marginRight: '3px',
          }"
        />
        {{ commentItem.targetUserInfo?.userName }} :
      </div>
      <div class="bottom">{{ commentItem.targetContent }}</div>
    </div>
    <div
      class="comment-input"
      v-if="replyVisible && !commentItem.targetCommentKey"
    >
      <el-input
        v-model="commentInput"
        :placeholder="$t('preview.commentInput')"
        @change="
          replyVisible = false;
          emit('replyComment', {
            value: commentInput,
            commentKey: commentItem._key,
          });
        "
      />
    </div>
    <el-dialog v-model="deleteVisible" :title="$t('preview.deleteCommentTips')" width="30%">
      <span>{{ $t("preview.deleteText") }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteVisible = false">{{
            $t("cancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="emit('deleteComment', commentItem._key)"
          >
            {{ $t("sure") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.comment {
  width: 100%;
  min-height: 80px;
  position: relative;
  z-index: 1;
  @include flex(space-between, center, null);
  .left {
    width: 60px;
    height: 100%;
    @include flex(center, center, null);
  }
  .right {
    width: calc(100% - 60px);
    .top {
      width: 100%;
      height: 30px;
      color: #51b827;
    }
  }
  .time {
    top: 10px;
    right: 10px;
    position: absolute;
    z-index: 2;
    color: var(--diary-font-time);
    font-size: 14px;
  }
  .button {
    bottom: 10px;
    right: 10px;
    position: absolute;
    z-index: 2;
    display: none;
    color: var(--diary-font-time);
    font-size: 14px;
    .reply {
      margin-right: 10px;
      cursor: pointer;
    }
  }

  &:hover {
    .button {
      @include flex(space-between, center, null);
    }
  }
}
.reply-box {
  width: calc(100% - 60px);
  background-color: var(--diary-bg-color);
  margin-left: 60px;
  border-radius: 10px;
  @include p-number(10px, 10px);
  @include flex(space-between, center, null);
  .top {
    width: 75px;
    @include flex(null, center, null);
  }
  .bottom {
    width: calc(100% - 75px);
    color: var(--diary-font-time);
    font-size: 14px;
    line-height: 30px;
  }
}
</style>
<style lang="scss">
.comment-box {
  .comment-input {
    @include flex(flex-end, center, null);
    .el-input {
      width: calc(100% - 60px);
      height: 30px;
      margin-bottom: 10px;
      .el-input__wrapper {
        border-radius: 40px;
        @include p-number(20px, 10px);
        .el-input__inner {
          height: 20px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>

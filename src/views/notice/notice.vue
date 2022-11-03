<script setup lang="ts">
import { ElMessage } from "element-plus";
import { Message } from "@/interface/Message";
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
const dayjs: any = inject("dayjs");

const noticeType = ref<number>(0);
const noticeList = ref<Message[]>([]);
const total = ref<number>(0);
const page = ref<number>(1);
const getNotice = async () => {
  const noticeRes: any = (await api.request.get("message", {
    page: page.value,
    limit: 30,
    hasRead: noticeType.value,
  })) as ResultProps;
  if (noticeRes.msg === "OK") {
    total.value = noticeRes.total;
    noticeList.value = [...noticeList.value, ...noticeRes.data];
  }
};
const scrollNotice = (e: any) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let height = e.target.clientHeight;
  if (
    height + scrollTop >= scrollHeight &&
    noticeList.value.length < total.value
  ) {
    page.value++;
    getNotice();
  }
};
const clearNotice = async () => {
  const clearRes: any = (await api.request.patch("message")) as ResultProps;
  if (clearRes.msg === "OK") {
    noticeList.value = [];
    page.value = 1;
    total.value = 0;
  }
};

const handleMate = async (type: string, index: number) => {
  const handleRes: any = (await api.request.patch("message/handle", {
    messageKey: noticeList.value[index]._key,
    operate: type,
  })) as ResultProps;
  if (handleRes.msg === "OK") {
    if (noticeType.value === 0) {
      noticeList.value.splice(index, 1);
    } else {
      noticeList.value[index].needReply = type === "agree" ? 2 : 3;
    }
  }
};
watch(noticeType, () => {
  noticeList.value = [];
  page.value = 1;
});
watchEffect(() => {
  getNotice();
});
</script>
<template>
  <cheader isMenu>
    <template #title>{{ $t("message.message") }}</template>
    <template #right>
      <!-- <iconpark-icon
        name="search"
        :size="30"
        style="cursor: pointer; margin-right: 10px"
      /> -->

      <div @click="clearNotice" v-if="noticeType === 0" style="cursor: pointer">
        {{ $t("message.setRead") }}
      </div>
    </template>
  </cheader>
  <div class="notice box">
    <div class="container">
      <div class="nav dp-space-center">
        <div class="item">
          <div
            :style="
              noticeType === 0
                ? {
                    color: 'var(--el-color-primary)',
                    borderBottom: '3px solid var(--el-color-primary)',
                  }
                : {}
            "
            @click="noticeType = 0"
            class="icon-point"
            style="padding: 10px 40px"
          >
            {{ $t("message.unRead") }}
          </div>
        </div>
        <div class="item">
          <div
            style="padding: 10px 40px"
            :style="
              noticeType === 1
                ? {
                    color: 'var(--el-color-primary)',
                    borderBottom: '3px solid var(--el-color-primary)',
                  }
                : {}
            "
            @click="noticeType = 1"
            class="icon-point"
          >
            {{ $t("message.read") }}
          </div>
        </div>
      </div>
      <div class="content" @scroll="scrollNotice">
        <div v-for="(item, index) in noticeList" :key="item._key" class="item">
          <div class="top">
            <div class="left">
              <span class="name">{{ item.fromUserInfo.userName }}</span>
              <span class="log" v-if="item.type === 'addFriend'">{{
                $t("message.addFriend")
              }}</span>
              <span class="log" v-if="item.type === 'agreeAdd'">{{
                $t("message.agreeAdd")
              }}</span>
              <span class="log" v-if="item.type === 'refuseAdd'">{{
                $t("message.refuseAdd")
              }}</span>
            </div>
            <div class="right">{{ dayjs(item.createTime).fromNow() }}</div>
            <!-- <span v-else-if="item.type === 'notice'"></span> -->
          </div>
          <div class="bottom" v-if="item.type === 'addFriend'">
            <template v-if="item.needReply === 1">
              <cbutton
                @click="handleMate('agree', index)"
                class="button"
                round
                >{{ $t(`message.agree`) }}</cbutton
              >
              <cbutton
                @click="handleMate('refuse', index)"
                class="button"
                round
                style="background-color: var(--diary-font-time)"
                >{{ $t(`message.refuse`) }}</cbutton
              >
            </template>
            <div v-else-if="item.needReply === 2" class="state">
              {{ $t(`message.handleAgree`) }}
            </div>
            <div v-else-if="item.needReply === 3" class="state">
              {{ $t(`message.handleRefuse`) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style src="./notice.scss" scoped lang="scss"></style>
<style></style>

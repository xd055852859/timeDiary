<script setup lang="ts">
import appStore from "@/store";
import { ElMessage } from "element-plus";
import Avatar from "@/components/cavatar.vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import DiaryItem from "./diaryItem.vue";
import router from "@/router";
const { getFilterMate } = appStore.mateStore;
const { chooseDate, chooseMonth } = storeToRefs(appStore.commonStore);
const { setDate, setMonth } = appStore.commonStore;
const { filterMateList } = storeToRefs(appStore.mateStore);
const { diaryFriendList, friendTotal, friendPage, diaryFriendMonth } =
  storeToRefs(appStore.diaryStore);
const { getDiaryList, setFriendPage, getDiaryMonth } = appStore.diaryStore;

const day: any = inject("dayjs");
const targetDate = ref<string>("");
const chooseFriendKey = ref("");
onMounted(() => {
  getFilterMate(1);
});
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
const handlechangeDate = (val) => {
  if (day(val).startOf("day").valueOf() === day().startOf("day").valueOf()) {
    getDiaryList(1, chooseFriendKey.value);
  } else {
    getDiaryList(1, chooseFriendKey.value, day(val).startOf("day").valueOf());
  }
  setFriendPage(1);
  setDate(day(val).startOf("day").valueOf());
};
const handlechangePanel = (date) => {
  setMonth(day(date).startOf("month").startOf("day").valueOf());
  getDiaryMonth(
    chooseFriendKey.value,
    day(date).startOf("month").startOf("day").valueOf()
  );
};
const hasDiary = ({ dayjs }) => {
  console.log(diaryFriendMonth.value.indexOf(dayjs.format("DD")) !== -1);
  console.log(dayjs.month() === day(chooseMonth.value).month());
  return (
    diaryFriendMonth.value.indexOf(dayjs.format("DD")) !== -1 &&
    dayjs.month() === day(chooseMonth.value).month()
  );
};
const clickDiary = () => {
  router.back();
  setDate(day().startOf("day").valueOf());
  setMonth(day().startOf("month").startOf("day").valueOf());
};
watch(filterMateList, (newList) => {
  if (newList) {
    chooseFriendKey.value = newList[0]._key;
  }
});
watch(chooseFriendKey, (newKey) => {
  if (newKey) {
    getDiaryList(1, newKey);
    getDiaryMonth(newKey);
  }
});
watch(friendPage, (newVal) => {
  if (newVal !== 1) {
    getDiaryList(newVal, chooseFriendKey.value);
  }
});
watch(
  chooseDate,
  (newVal) => {
    targetDate.value = day(newVal).format("MM月DD日");
  },
  { immediate: true }
);
</script>
<template clickState :clickBack="clickDiary()">
  <cheader>
    <template #title>{{ $t("friendDiary.friendDiary") }}</template>
    <template #right></template>
  </cheader>
  <div class="friend-box">
    <div
      v-for="item in filterMateList"
      :key="item._key"
      @click="chooseFriendKey = item._key"
      class="item"
    >
      <el-badge
        :value="item.unReadNum"
        :hidden="item.unReadNum === 0"
        style="margin-top:10px"
      >
        <avatar
          :name="item.userName"
          :avatar="item.userAvatar"
          :index="0"
          :size="chooseFriendKey === item._key ? 65 : 60"
          :avatarStyle="{
            fontSize: '20px',
          }"
          :chooseState="chooseFriendKey === item._key"
          :borderState="chooseFriendKey === item._key"
        />
      </el-badge>
      <div class="name" v-if="chooseFriendKey === item._key">
        {{ item.userName }}
      </div>
    </div>
  </div>
  <div class="friend-diary box" @scroll="scrollDiary">
    <div class="container">
      <div class="friend-date diary-date">
        <el-date-picker
          v-model="chooseDate"
          type="date"
          placeholder="Pick a day"
          format="MM月DD日"
          :prefix-icon="ArrowDown"
          :editable="false"
          :clearable="false"
          @change="handlechangeDate"
          @panel-change="handlechangePanel"
        >
          <template #default="cell">
            <div class="cell" :class="{ current: cell.isCurrent }">
              <span class="text">{{ cell.text }}</span>
              <span v-if="hasDiary(cell)" class="holiday" />
            </div>
          </template>
        </el-date-picker>
      </div>
      <template v-for="diaryItem in diaryFriendList" :key="diaryItem._key">
        <DiaryItem :info="diaryItem" :friendKey="chooseFriendKey"/>
      </template>
    </div>
  </div>
</template>
<style src="./friendDiary.scss" scoped lang="scss"></style>
<style></style>

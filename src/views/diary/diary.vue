<script setup lang="ts">
import router from "@/router";
import appStore from "@/store";
import { ArrowDown, Plus } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import DiaryItem from "@/views/diary/diaryItem.vue";
import "./diary.scss";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
const { user, token } = storeToRefs(appStore.authStore);
const { chooseDate,chooseMonth } = storeToRefs(appStore.commonStore);

const { setDate ,setMonth} = appStore.commonStore;
const { diaryList, page, total, diaryMonth } = storeToRefs(appStore.diaryStore);
const { getDiaryList, setPage, getDiaryMonth } = appStore.diaryStore;
const day: any = inject("dayjs");

const targetDate = ref<string>("");
const friendDiaryNum = ref<number>(0);
onMounted(() => {
  getDiaryList(1);
  getDiaryMonth();
  getFriendDiaryNum();
});
const toEditor = () => {
  router.push("/home/detail/create?date=" + day(chooseDate.value).valueOf());
};
const toUrl = (url) => {
  router.push(url);
};
const getFriendDiaryNum = async () => {
  const numRes = (await api.request.get("/card/unRead")) as ResultProps;
  if (numRes.msg === "OK") {
    friendDiaryNum.value = numRes.data;
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
    diaryList.value.length < total.value
  ) {
    let newPage = page.value + 1;
    setPage(newPage);
  }
};
const hasDiary = ({ dayjs }) => {
  console.log(diaryMonth.value.indexOf(dayjs.format("DD")) !== -1)
  return (
    diaryMonth.value.indexOf(dayjs.format("DD")) !== -1 &&
    dayjs.month() === day(chooseMonth.value).month()
  );
};
const handlechangeDate = (val) => {
  if (day(val).startOf("day").valueOf() === day().startOf("day").valueOf()) {
    getDiaryList(1);
  } else {
    getDiaryList(1, "", day(val).startOf("day").valueOf());
  }
  setPage(1);
  setDate(day(val).startOf("day").valueOf());
};
const handlechangePanel = (date) => {
  setMonth(day(date).startOf("month").startOf("day").valueOf());
  getDiaryMonth("",day(date).startOf("month").startOf("day").valueOf());
};
const toFriendDiary=()=>{
  toUrl('/home/friendDiary')
  setDate(day().startOf("day").valueOf());
  setMonth(day().startOf("month").startOf("day").valueOf());
}
watch(page, (newVal) => {
  getDiaryList(newVal);
});
watch(
  chooseDate,
  (newVal) => {
    targetDate.value = day(newVal).format("MM月DD日");
  },
  { immediate: true }
);
</script>
<template>
  <cheader isMenu>
    <template #title>
      <!-- <div class="dp-center-center" style="cursor: pointer">
        {{ dayjs(diaryDate).format("MM月DD日") }}
        <iconpark-icon name="down" :size="15" style="margin-left: 10px" />
      </div> -->
      <div class="diary-date">
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
    </template>
    <template #right>
      <el-badge
        :value="friendDiaryNum"
        :hidden="friendDiaryNum === 0"
        @click="toFriendDiary()"
      >
        <iconpark-icon name="message" :size="30" style="cursor: pointer" />
      </el-badge>
    </template>
  </cheader>
  <div class="diary box" @scroll="scrollDiary">
    <div class="container">
      <template v-for="diaryItem in diaryList" :key="diaryItem._key">
        <DiaryItem :info="diaryItem" />
      </template>
    </div>
    <iconpark-icon
      name="add"
      :size="50"
      style="cursor: pointer"
      class="add-button"
      @click="toEditor"
    />
  </div>
</template>
<style src="./diary.scss" scoped lang="scss"></style>
<style></style>

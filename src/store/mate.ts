import { ref } from "vue";
import { defineStore } from "pinia";
import { User } from "@/interface/User";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { Diary } from "@/interface/Diary";
import dayjs from "dayjs";
import { Mate, Friend } from "@/interface/Mate";

// 使用setup模式定义
export const mateStore = defineStore("mateStore", () => {
  const mateList = ref<Mate[]>([]);
  const filterMateList = ref<Friend[]>([]);
  const getMate = async () => {
    const mateRes = (await api.request.get("friend")) as ResultProps;
    if (mateRes.msg === "OK") {
      mateList.value = [...mateRes.data];
    }
  };
  const getFilterMate = async (
    showUnRead?: number,
    filterStopUser?: number
  ) => {
    const mateRes = (await api.request.get("friend", {
      showUnRead: showUnRead,
      filterStopUser: filterStopUser,
    })) as ResultProps;
    if (mateRes.msg === "OK") {
      filterMateList.value = [...mateRes.data];
    }
  };
  return {
    mateList,
    getMate,
    filterMateList,
    getFilterMate,
  };
});

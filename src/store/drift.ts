import { ref } from "vue";
import { defineStore } from "pinia";
import { User } from "@/interface/User";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { Diary } from "@/interface/Diary";
import dayjs from "dayjs";
import { Drift } from "@/interface/drift";

// 使用setup模式定义
export const driftStore = defineStore("driftStore", () => {
  const driftList = ref<Drift[]>([]);
  const getDrift = async () => {
    const driftRes = (await api.request.get("card/random", {
      page: 1,
      limit: 10,
    })) as ResultProps;
    if (driftRes.msg === "OK") {
      driftList.value = [...driftRes.data];
    }
  };
  return {
    driftList,
    getDrift,
  };
});

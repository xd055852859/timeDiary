import { ref } from "vue";
import { defineStore } from "pinia";
import { User } from "@/interface/User";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { Editor } from "@tiptap/vue-3";
import dayjs from "dayjs";
import { getSearchParamValue } from "@/services/util";

// 使用setup模式定义
export const commonStore = defineStore("commonStore", () => {
  const deviceType = ref<string>("");

  const locale = ref<string>("");
  const chooseDate = ref<number>(dayjs().valueOf());
  const chooseMonth = ref<number>(
    dayjs().startOf("month").startOf("day").valueOf()
  );
  const dark = ref<boolean>(!!localStorage.getItem("DARK"));
  const editorInfo = ref<Editor | null>(null);
  const noticeNum = ref<number>(0);
  const statusHeight = ref<string | null>(null);
  const navigationHeight = ref<string | null>(null);
  const isHidden = ref<string | null>(null);
  onMounted(() => {
    console.log("???????");
  });
  const setDeviceType = (newDeviceType: string) => {
    deviceType.value = newDeviceType;
  };
  const setCommonDark = (newDark: boolean) => {
    dark.value = newDark;
  };
  const setCommonLocale = (newLocale: string) => {
    locale.value = newLocale;
  };
  const setEditor = (info: Editor) => {
    editorInfo.value = info;
  };
  const setDate = (date: number) => {
    chooseDate.value = date;
  };
  const setMonth = (date: number) => {
    chooseMonth.value = date;
  };
  const setMobileHeader = (
    newStatusHeight,
    newNavigationHeight,
    newIsHidden
  ) => {
    statusHeight.value = newStatusHeight;
    navigationHeight.value = newNavigationHeight;
    isHidden.value = newIsHidden;
  };
  watchEffect(() => {
    if (statusHeight.value)
      localStorage.setItem("statusHeight", statusHeight.value);
    if (navigationHeight.value)
      localStorage.setItem("navigationHeight", navigationHeight.value);
    if (isHidden.value) localStorage.setItem("isHidden", isHidden.value);
  });
  return {
    deviceType,
    setDeviceType,
    dark,
    setCommonDark,
    locale,
    setCommonLocale,
    editorInfo,
    setEditor,
    chooseDate,
    setDate,
    chooseMonth,
    setMonth,
    noticeNum,
    statusHeight,
    navigationHeight,
    isHidden,
    setMobileHeader,
  };
});

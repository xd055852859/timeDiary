import { authStore } from "@/store/auth";
import { diaryStore } from "@/store/diary";
import { commonStore } from "@/store/common";
import { mateStore } from "@/store/mate";
import { driftStore } from "@/store/drift";
export interface IAppStore {
  authStore: ReturnType<typeof authStore>;
  diaryStore: ReturnType<typeof diaryStore>;
  commonStore: ReturnType<typeof commonStore>;
  mateStore: ReturnType<typeof mateStore>;
  driftStore: ReturnType<typeof driftStore>;
}

const appStore: IAppStore = {} as IAppStore;
/**
 * 注册app状态库
 */
export const registerStore = () => {
  appStore.authStore = authStore();
  appStore.diaryStore = diaryStore();
  appStore.commonStore = commonStore();
  appStore.mateStore = mateStore();
  appStore.driftStore = driftStore();
};

export default appStore;

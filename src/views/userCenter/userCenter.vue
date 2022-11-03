<script setup lang="ts">
import { ElMessage } from "element-plus";
import { uploadFile } from "@/services/util";
import api from "@/services/api";
import useCurrentInstance from "@/hooks/useCurrentInstance";
import { storeToRefs } from "pinia";
import setDark from "@/hooks/dark";
import appStore from "@/store";
import finishBeanSvg from "@/assets/svg/finishBean.svg";
import i18n from "@/language/i18n";
import { ResultProps } from "@/interface/Common";

const { proxy } = useCurrentInstance();

const socket: any = inject("socket");
const router = useRouter();
const { user, token } = storeToRefs(appStore.authStore);
const { dark, locale, noticeNum } = storeToRefs(appStore.commonStore);
const { setUserInfo } = appStore.authStore;
const { setDeviceType, setCommonDark, setCommonLocale } = appStore.commonStore;
const emits = defineEmits(["close"]);

const userVisible = ref<boolean>(false);
const avatar = ref<string>("");
const userName = ref<string>("");
const email = ref<string>("");
const setVisible = ref<boolean>(false);
const localeValue = ref<string>("");
const darkValue = ref<string>("");

const changeLanguage = (value: string) => {
  switch (value) {
    case "中文":
      value = "zh";
      darkValue.value = dark.value ? "黑暗模式" : "明亮模式";
      break;
    case "English":
      value = "en";
      darkValue.value = dark.value ? "Dark mode" : "Bright mode";
      break;
    case "日本語":
      value = "ja";
      darkValue.value = dark.value ? "ダークモード" : "ブライトモード";
      break;
    case "繁体":
      value = "tc";
      darkValue.value = dark.value ? "黑暗模式" : "明亮模式";
      break;
  }
  proxy.$i18n.locale = value;
  setCommonLocale(value);
  localStorage.setItem("LANGUAGE", value);
};
const changeDark = (value: string | boolean) => {
  value = value === i18n.global.t(`DarkMode`);
  setDark(value);
  setCommonDark(value);
};
const changeConfig = async () => {
  let config = {
    userAvatar: avatar.value,
    userName: userName.value,
  };
  const configRes = (await api.request.patch("user/config", {
    ...config,
  })) as ResultProps;
  if (configRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`Edit Success`),
      type: "success",
      duration: 1000,
    });
    userVisible.value = false;
    //@ts-ignore
    setUserInfo({ ...user.value, ...config });
  }
};
const chooseImg = (e) => {
  let mimeType = ["image/png", "image/jpeg", "image/svg+xml"];
  uploadFile(e.target.files[0], mimeType, (url: string) => {
    avatar.value = url;
  });
};
const logout = () => {
  router.push("/");
  localStorage.clear();
  ElMessage({
    message: i18n.global.t(`common.logoutMessage`),
    type: "success",
    duration: 1000,
  });
};
const toUrl = (url) => {
  router.push(url);
};
watch(
  user,
  (newVal) => {
    if (newVal) {
      avatar.value = newVal.userAvatar ? newVal.userAvatar : "";
      userName.value = newVal.userName ? newVal.userName : "";
      switch (locale.value) {
        case "zh":
          localeValue.value = "中文";
          break;
        case "en":
          localeValue.value = "English";
          break;
        case "ja":
          localeValue.value = "日本語";
          break;
        case "tc":
          localeValue.value = "繁体";
          break;
      }
      darkValue.value = dark.value
        ? i18n.global.t(`DarkMode`)
        : i18n.global.t(`BrightMode`);
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="user-center">
    <div style="width: 100%">
      <div class="userCenter-user dp-space-center">
        <el-avatar
          fit="cover"
          :src="user?.userAvatar"
          :size="100"
          @click="userVisible = true"
          class="icon-point"
        />
        <div class="name single-to-long">{{ user?.userName }}</div>
        <div class="dp-center-center notice-icon" @click="toUrl('/home/notice')">
          <iconpark-icon name="ring" :size="20" style="margin-right: 10px" />
          <!-- <el-badge
            :value="noticeNum"
            style="margin-bottom: 10px; margin-left: -10px"
            v-if="noticeNum"
            @click="
              $router.push('/home/notice');
              emits('close');
            "
          ></el-badge> -->
        </div>
      </div>
      <div
        class="userCenter-item dp--center"
        @click="$router.push('/home/diary')"
      >
        <iconpark-icon name="diary" :size="20" style="margin-right: 10px" />
        <span :class="{ 'common-color': $route.name === 'diary' }">
          {{ $t(`userCenter.diary`) }}
        </span>
      </div>
      <div
        class="userCenter-item dp--center"
        @click="$router.push('/home/gallery')"
      >
        <iconpark-icon name="gallery" :size="20" style="margin-right: 10px" />
        <span :class="{ 'common-color': $route.name === 'gallery' }">
          {{ $t(`userCenter.gallery`) }}
        </span>
      </div>
      <div
        class="userCenter-item dp--center"
        @click="$router.push('/home/drift')"
      >
        <iconpark-icon name="drift" :size="20" style="margin-right: 10px" />

        <span :class="{ 'common-color': $route.name === 'drift' }">
          {{ $t(`userCenter.drift`) }}
        </span>
      </div>
      <div
        class="userCenter-item dp--center"
        @click="
          $router.push('/home/mate');
          emits('close');
        "
      >
        <iconpark-icon name="mate" :size="20" style="margin-right: 10px" />
        <span :class="{ 'common-color': $route.name === 'mate' }">
          {{ $t(`userCenter.mate`) }}
        </span>
      </div>
      <!-- <div
        class="userCenter-item dp--center"
        @click="
          $router.push('/home/trash');
          emits('close');
        "
      >
        <icon-font name="trash" :size="24" style="margin-right: 15px" />
        <span> Trash </span>
      </div> -->
    </div>
    <div class="user-set">
      <div class="userCenter-item dp--center" @click="setVisible = true">
        <iconpark-icon name="sun" :size="20" style="margin-right: 10px" />
        <span>
          {{ $t(`userCenter.sun`) }}
        </span>
      </div>
      <div class="userCenter-item dp--center">
        <iconpark-icon name="set" :size="20" style="margin-right: 10px" />
        <span>
          {{ $t(`userCenter.set`) }}
        </span>
      </div>
      <div class="userCenter-item dp--center">
        <iconpark-icon name="pro" :size="20" style="margin-right: 10px" />
        <span> Pro </span>
      </div>
      <div class="userCenter-item dp--center" @click="logout">
        <iconpark-icon name="quit" :size="20" style="margin-right: 10px" />
        <span>
          {{ $t(`userCenter.quit`) }}
        </span>
      </div>
    </div>
  </div>
  <el-dialog v-model="userVisible" :title="$t('profile')" :width="400">
    <div class="user-edit dp-center-center">
      <div class="avatar">
        <el-avatar fit="cover" :src="avatar" :size="150" />
        <input
          type="file"
          accept="image/*"
          class="upload-img"
          @change="chooseImg"
        />˝
      </div>

      <el-input
        class="input"
        v-model="userName"
        placeholder="enter userName"
        style="width: 100%; margin-top: 20px"
      />
    </div>

    <template #footer>
      <span class="dialog-footer dp-center-center">
        <cbutton @click="changeConfig()">{{ $t("Save") }}</cbutton>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="setVisible" :title="$t(`Setting`)" :width="400">
    <div class="user-edit dp-center-center">
      <div class="text dp-space-center">
        {{ $t(`Language`) }} :
        <el-select
          v-model="localeValue"
          :placeholder="'choose language'"
          size="large"
          @change="changeLanguage"
        >
          <el-option value="中文">中文</el-option>
          <el-option value="English">English</el-option>
          <!-- <el-option value="日本語">日本語</el-option> -->
          <el-option value="繁体">繁体</el-option>
        </el-select>
      </div>
      <div class="text dp-space-center">
        {{ $t(`DarkMode`) }}
        <el-select
          v-model="darkValue"
          :placeholder="'choose mode'"
          size="large"
          @change="changeDark"
        >
          <el-option :value="$t(`DarkMode`)">{{ $t(`DarkMode`) }}</el-option>
          <el-option :value="$t(`BrightMode`)"
            >{{ $t(`BrightMode`) }}
          </el-option>
        </el-select>
      </div>
    </div>
  </el-dialog>
</template>
<style src="./userCenter.scss" scoped lang="scss"></style>
<style></style>

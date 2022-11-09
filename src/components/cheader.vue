<script setup lang="ts">
import { getSearchParamValue } from "@/services/util";
import appStore from "@/store";
import UserCenter from "@/views/userCenter/userCenter.vue";
import { storeToRefs } from "pinia";
const { statusHeight, navigationHeight, isHidden } = storeToRefs(
  appStore.commonStore
);
const { setMobileHeader } = appStore.commonStore;
// import UserCenter from "@/views/userCenter.vue";
const router = useRouter();
const props = defineProps<{
  isMenu?: boolean;
  headerIcon?: string;
  headerTitle?: string;
  headerState?: boolean;
  headerStyle?: any;
  clickState?: boolean;
}>();
const emits = defineEmits(["iconClick", "clickBack", "headerClick"]);

const userVisible = ref<boolean>(false);
const menuVisible = ref<boolean>(true);

//+ "&statusHeight=\(StatusBar_HEIGHT)" + "&navigationHeight=44" + "&isHidden=1"
onMounted(() => {
  const search = window.location.search
    ? window.location.search.split("?")[1]
    : window.location.hash.split("?")[1];
  setMobileHeader(
    getSearchParamValue(search, "statusHeight") ||
      localStorage.getItem("statusHeight"),
    getSearchParamValue(search, "navigationHeight") ||
      localStorage.getItem("navigationHeight"),
    getSearchParamValue(search, "isHidden") || localStorage.getItem("isHidden")
  );
});
const back = () => {
  router.back();
  menuVisible.value = false;
  emits("iconClick");
};
</script>
<template>
  <!-- <cicon
              :name="fullVisible ? 'off-screen' : 'full-screen'"
              :size="30"
              color="#fff"
            /> -->
  <div
    v-if="isHidden"
    :style="{ width: '100%', height: `${statusHeight}px` }"
  ></div>
  <div
    class="common-header"
    :class="'dp-center-center'"
    :style="
      navigationHeight
        ? { height: `${navigationHeight}px`, ...headerStyle }
        : { ...headerStyle }
    "
  >
    <div class="left dp--center" v-if="!isHidden">
      <!-- <icon-font
        :name="'menu'"
        @mouseenter="headerState ? emits('headerClick') : (themeVisible = true)"
        style="cursor: pointer"
        v-if="headerIcon"
      /> -->
      <cicon
        name="menu"
        :size="25"
        @click="userVisible = true"
        style="cursor: pointer"
        v-if="isMenu"
      />
      <!--    @mouseenter="headerState ? emits('headerClick') : (userVisible = true)" -->
      <cicon
        name="back"
        :size="25"
        @click="clickState ? emits('clickBack') : back()"
        style="cursor: pointer"
        v-else
      />
      <span
        style="margin-left: 10px; font-weight: bolder; font-size: 18px"
        v-if="headerTitle"
        >{{ headerTitle }}</span
      >
    </div>
    <div class="title"><slot name="title"></slot></div>
    <div class="right dp--center">
      <slot name="right"></slot>
      <!-- <icon-font
        :name="'close'"
        @click="clickState ? emits('clickBack') : back()"
        style="cursor: pointer; margin-left: 10px"
        v-if="!headerIcon || headerState"
      /> -->
    </div>
  </div>
  <el-drawer
    v-model="userVisible"
    direction="ltr"
    :with-header="false"
    :size="280"
    custom-class="p10-drawer"
  >
    <UserCenter @close="userVisible = false" />
  </el-drawer>
</template>
<style scoped lang="scss">
.common-header {
  width: 100%;
  height: 55px;
  text-align: center;
  position: relative;
  z-index: 1;
  background: var(--diary-bg-color);
  @include p-number(5%, 0px);
  .title {
    width: calc(100% - 200px);
    font-size: 18px;
    font-weight: 600;
  }
  .left,
  .right {
    height: 100%;
    position: absolute;
    top: 0px;
    z-index: 5;
  }
  .left {
    left: 10px;
  }
  .right {
    right: 15px;
  }
}
</style>
<style></style>

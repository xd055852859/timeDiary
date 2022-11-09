<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import router from "@/router";
import Avatar from "@/components/cavatar.vue";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import i18n from "@/language/i18n";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import { Mate } from "@/interface/Mate";
const { mateList } = storeToRefs(appStore.mateStore);
const { getMate } = appStore.mateStore;
const searchName = ref<string>("");
const inputVisible = ref<boolean>(false);
const searchList = computed(() =>
  mateList.value.filter((item) => {
    return item.userName.indexOf(searchName.value) !== -1;
  })
);

const toAddMate = () => {
  router.push("/home/addMate");
};
onMounted(() => {
  console.log(getMate);
  getMate();
});
</script>
<template>
  <cheader isMenu>
    <template #title>{{ $t("userCenter.mate") }}</template>
    <template #right>
      <el-input
        v-model="searchName"
        size="large"
        :placeholder="$t('mate.mateInput')"
        v-if="inputVisible"
        style="margin-right: 10px"
      />
      <cicon
        name="search"
        :size="30"
        style="cursor: pointer; margin-right: 10px"
        @click="inputVisible = true"
      />
      <el-icon :size="30" @click="toAddMate"><Plus /></el-icon>
    </template>
  </cheader>
  <div class="diary-mate box">
    <el-row :gutter="20" class="row">
      <el-col
        :xs="8"
        :sm="6"
        :md="4"
        :lg="3"
        :xl="1"
        v-for="item in searchList"
        :key="item._key"
      >
        <div class="item" @click="$router.push(`/home/mateBoard/${item._key}`)">
          <avatar
            :name="item.userName"
            :avatar="item.userAvatar"
            :index="0"
            :size="100"
            :avatarStyle="{
              fontSize: '20px',
              marginRight: '8px',
            }"
          />
          <div class="name">{{ item.userName }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style src="./mate.scss" scoped lang="scss"></style>
<style></style>

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
const { mateList } = storeToRefs(appStore.mateStore);
const { getMate } = appStore.mateStore;
const toAddMate = () => {
  router.push("/home/addMate");
};
onMounted(() => {
  console.log(getMate)
  getMate();
});
</script>
<template>
  <cheader isMenu>
    <template #title>{{ $t("userCenter.mate") }}</template>
    <template #right>
      <!-- <iconpark-icon
        name="search"
        :size="30"
        style="cursor: pointer; margin-right: 10px"
      /> -->

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
        v-for="item in mateList"
        :key="item._key"
      >
        <div class="item">
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

<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import i18n from "@/language/i18n";
import api from "@/services/api";
import appStore from "@/store";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
const { user } = storeToRefs(appStore.authStore);
const codeInput = ref<string>("");
const addMate = async () => {
  if (!codeInput.value) {
    ElMessage({
      message: i18n.global.t(`mate.addMateError`),
      type: "error",
      duration: 1000,
    });
  }
  const addRes = (await api.request.post("friend", {
    friendKey: codeInput.value,
  })) as ResultProps;
  if (addRes.msg === "OK") {
    ElMessage({
      message: i18n.global.t(`mate.addMateSuccess`),
      type: "success",
      duration: 1000,
    });
    codeInput.value = "";
  }
};
</script>
<template>
  <cheader>
    <template #title>{{ $t("mate.addMate") }}</template>
  </cheader>
  <div class="addMate box">
    <div class="container">
      <div class="input">
        <el-input v-model="codeInput" :placeholder="$t('mate.addInput')" />
        <div @click="addMate" class="button">{{ $t("mate.addButton") }}</div>
      </div>
      <div class="button dp-space-center">
        <div class="dp--center">
          {{ $t("mate.inviteCode") }} : {{ user?._key }}
        </div>
        <div class="dp--center" style="width: 150px">
          <cicon
            name="copy"
            :size="25"
            style="cursor: pointer; margin-right: 5px"
          />
          {{ $t("copy") }}
        </div>
      </div>
    </div>
  </div>
</template>
<style src="./addMate.scss" scoped lang="scss"></style>
<style lang="scss">
.addMate {
  .input {
    .el-input {
      width: calc(100% - 250px);
      height: 100%;
      font-size: 18px;
      @include p-number(5px, 0px);
      .el-input__wrapper {
        box-shadow: none;
      }
    }
  }
}
</style>

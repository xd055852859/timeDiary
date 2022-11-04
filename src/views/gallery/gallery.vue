<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import { ElMessage } from "element-plus";
const dayjs: any = inject("dayjs");
interface Gallery {
  ctime: string;
  group: string[];
}
const galleryList = ref<Gallery[]>([]);

const page = ref<number>(1);
const total = ref<number>(0);
const imgVisible = ref<boolean>(false);
const imgIndex = ref<number>(0);
const groupIndex = ref<number>(0);
const imgList = computed(() => galleryList.value[groupIndex.value].group);
const imgSrc = computed(() => imgList.value[imgIndex.value]);
onMounted(() => {
  getGalleryList(1);
});
const getGalleryList = async (page: number, friendKey?: string) => {
  const galleryRes = (await api.request.get("/card/imageList", {
    friendKey: friendKey,
    page: page,
    limit: 10,
  })) as ResultProps;
  if (galleryRes.msg === "OK") {
    if (page === 1) {
      galleryList.value = [];
    }
    galleryList.value = [...galleryList.value, ...galleryRes.data];
    total.value = galleryRes.total as number;
  }
};
const scrollGallery = (e: any) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let height = e.target.clientHeight;
  if (
    height + scrollTop >= scrollHeight &&
    galleryList.value.length < total.value
  ) {
    let newPage = page.value + 1;
    page.value = newPage;
    getGalleryList(newPage);
  }
};
const toImg = (galleryIndex, index) => {
  groupIndex.value = galleryIndex;
  imgIndex.value = index;
  imgVisible.value = true;
};
const toLeft = () => {
  imgIndex.value = imgIndex.value - 1;
};
const toRight = () => {
  imgIndex.value = imgIndex.value + 1;
};
</script>
<template>
  <cheader isMenu>
    <template #title>{{ $t("userCenter.gallery") }}</template>
    <template #right></template>
  </cheader>
  <div class="gallery box" @scroll="scrollGallery">
    <template
      v-for="(galleryItem, galleryIndex) in galleryList"
      :key="'gallery' + galleryIndex"
    >
      <div class="date">
        <span class="day">{{ dayjs(galleryItem.ctime).date() }}</span>
        <span class="year">{{
          dayjs(galleryItem.ctime).format("MM.YYYY")
        }}</span>
      </div>
      <div class="img-box">
        <el-row :gutter="20" class="row">
          <el-col
            :xs="8"
            :sm="6"
            :md="4"
            :lg="3"
            :xl="1"
            v-for="(item, index) in galleryItem.group"
            :key="'galleryItem' + index"
          >
            <div class="img" @click="toImg(galleryIndex, index)">
              <img :src="item" alt="" />
            </div>
          </el-col>
        </el-row>
      </div>
    </template>
  </div>
  <el-dialog
    v-model="imgVisible"
    :title="$t('editor.img')"
    :width="'90vw'"
    :top="'10vh'"
    :append-to-body="true"
    show-close
    :before-close="
      (done) => {
        imgSrc = '';
        imgVisible = false;
        done();
      }
    "
    style="height: 80vh"
  >
    <div class="img-fullImg dp-space-center">
      <div style="width: 10vw" class="dp-center-center">
        <iconpark-icon
          name="back"
          :size="50"
          color="#333"
          @click="toLeft()"
          style="cursor: pointer"
          v-if="imgIndex !== 0"
        />
      </div>
      <div class="img-box"><img :src="imgSrc" alt="" /></div>

      <div style="width: 10vw" class="dp-center-center">
        <iconpark-icon
          name="rightArrow"
          :size="50"
          color="#333"
          @click="toRight()"
          style="cursor: pointer"
          v-if="imgIndex < imgList.length - 1"
        />
      </div>
    </div>
  </el-dialog>
</template>
<style src="./gallery.scss" scoped lang="scss"></style>
<style></style>

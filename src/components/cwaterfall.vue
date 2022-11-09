<script lang="ts" setup>
interface IImgData {
  src: string;
  width: number;
  height: number;
  top: number;
  left: number;
}

const emit = defineEmits(["click"]);
const waterfallRef = ref();
const props = defineProps<{
  list: [];
  marginRight: number;
  marginBottom: number;
  padding: number;
  column: number;
  it: string;
}>();
const state = reactive({
  imgArr: [],
  ImgWidth: 0, //图片宽度
  ImgRight: 20,
  ImgBottom: 20,
  padding: 10,
  column: 4,
  calcHeight: [] as number[],
  waterfallList: [] as IImgData[], //计算后的图片数组
  timer: false,
});
onMounted(() => {
  //挂载window的resize事件
    window.onresize = () => {
      if (!state.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        state.timer = true;
        setTimeout(function () {
          state.waterfallList = [];
          calculationWidth();
          state.timer = false;
        }, 500);
      }
    };
  console.log(props.list);
});
watch(
  () => props.list,
  (v) => {
    if (v) {
      state.imgArr = v;
      calculationWidth();
    }
  },
  { immediate: true, deep: true }
);
watch(
  () => props.marginRight,
  (v) => {
    if (v) {
      state.ImgRight = v;
    }
  },
  { immediate: true, deep: true }
);
watch(
  () => props.marginBottom,
  (v) => {
    if (v) {
      state.ImgBottom = v;
    }
  },
  { immediate: true, deep: true }
);
watch(
  () => props.padding,
  (v) => {
    if (v) {
      state.padding = v;
    }
  },
  { immediate: true, deep: true }
);
watch(
  () => props.column,
  (v) => {
    if (v) {
      state.column = v;
    }
  },
  { immediate: true, deep: true }
);

//图片列数、图片右边边距计算出图片的宽度,并对每一列的高度进行初始化为0
function calculationWidth() {
  nextTick(() => {
    let rectInfo = waterfallRef.value.getBoundingClientRect();
    state.ImgWidth = Math.floor(
      (rectInfo.width - state.column * state.ImgRight) / state.column
    );
    for (let i = 0; i < state.column; i++) {
      state.calcHeight[i] = 0;
    }
    imgPreloading();
  });
}

//图片预加载
async function imgPreloading() {
  //模拟请求图片接口获取图片列表
  let newImageList = state.imgArr;
  console.log(newImageList);
  state.waterfallList = [];
  //   let key = props.it;
  //对请求到的图片列表进行加载计算
  for (let i = 0; i < newImageList.length; i++) {
    let aImg = new Image();
    // aImg.src = newImageList[index][key];
    aImg.src = newImageList[i];
    aImg.onload = () => {
      let imgData = {} as IImgData;
      //   imgData.src = newImageList[index][key];
      imgData.src = newImageList[i];
      imgData.width = state.ImgWidth - state.padding * 2; //设置图片宽度
      imgData.height = (state.ImgWidth / aImg.width) * aImg.height; //按比例设置图片高度
      rankImg(imgData); //渲染页面
      state.waterfallList.push(imgData);
    };
  }
}

//瀑布流布局
function rankImg(imgData: IImgData) {
  let { ImgWidth, ImgRight, ImgBottom, calcHeight } = state;
  let minIndex = filterMin(); //获得高度最小的一列的下标
  imgData.top = calcHeight[minIndex]; //插入图片的top值
  imgData.left = minIndex * (ImgRight + ImgWidth); //插入图片的left值
  calcHeight[minIndex] += imgData.height + ImgBottom; //更新当前列的高度
  console.log(5555);
}

//找到最短的列并返回下标
function filterMin() {
  const min = Math.min.apply(null, state.calcHeight);
  return state.calcHeight.indexOf(min);
}

// 点击事件返回
function click(v: number) {
  emit("click", state.imgArr[v]);
}
</script>
<template>
  <div id="v-waterfall" ref="waterfallRef" class="v-waterfall-content">
    <div
      v-for="(img, index) in state.waterfallList"
      :key="index"
      :style="{
        top: img.top + 5 + 'px',
        padding: props.padding + 'px',
        left: img.left + 5 + 'px',
        width: state.ImgWidth + 'px',
        height: img.height + 'px',
      }"
      class="v-waterfall-item"
      @click="click(index)"
    >
      <img :src="img.src" alt="" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.v-waterfall-content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
}
.v-waterfall-item {
  box-sizing: border-box;
  position: absolute;
  margin: 0;
  background-color: #fff;
  border: rgba(238, 238, 238, 1) solid 1px;
  border-radius: 5px;
  box-shadow: rgb(0 0 0 / 22%) 0 2px 5px;
  cursor: pointer;
  img {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
  &:hover {
    box-shadow: rgb(0 0 0 / 50%) 0 4px 8px;
    transition: all ease-in-out 0.2s;
    img {
      transform: scale(1.01);
      transition: all ease-in-out 0.2s;
    }
  }
}
</style>

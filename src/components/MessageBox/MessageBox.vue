<template>
  <div v-if="visible" class="EaconComponents EaconComponentsMessageBox" @click="handleCancel">
    <div class="container" @click.stop>
      <div class="head">
        <div class="title">
          {{ title || "提示" }}
        </div>
        <div class="close" @click="handleCancel">
          <el-icon :size="20">
            <Close />
          </el-icon>
        </div>
      </div>
      <div class="content custom-scroll-bar">
        <div class="warn-icon" v-if="!options.is">
          <img class="whiteIcon" src="./MessageBoxIcons/warn-white.png" alt="" />
        </div>
        <Scrollbar>
          <slot>
            <div class="text" v-if="!options.is && !options.html">
              {{ text }}
            </div> 
            <component v-if="options.is" :is="options.is" v-bind="options.componentAttrs"  v-model="componentValue"></component>
            <div class="text" v-else-if="options.html" v-html="options.html"></div>
          </slot>
        </Scrollbar>
      </div>
      <div class="footer">
        <el-button class="Button" v-if="options.showCancel !== false" @click="handleCancel">
          {{ options.cancelText || "取消" }}
        </el-button>
        <el-button class="Button" v-if="options.showSubmit !== false" type="primary" @click="handleSubmit">
          {{ options.submitText || "确定" }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Scrollbar from "../Scrollbar/Scrollbar.vue";
import { Close } from '@element-plus/icons-vue'

/**
 * 配置参数
 * 
 * @typedef {Object} options
 * @property {String|Component} is - 
 * @property {String} html 
 * @property {Boolean} [showCancel=true] - 
 * @property {Boolean} [cancelText=true] - 
 * @property {Boolean} [showSubmit=true] - 
 * @property {Boolean} [submitText=true] - 
 */
const props = defineProps({
  title: {
    type: String,
    default: "提示"
  },
  text: {
    type: String,
    default: "提示内容"
  },
  options: {
    type: Object,
    default: () => ({})
  },
})


const componentValue = ref(props.options.componentAttrs?.value || null);
watch(
  () => props.options.componentAttrs?.value,
  (val) => {
    componentValue.value = val;
  }
);


const emit = defineEmits(["closed", "submit"])


let visible = defineModel("modelValue");

const handleCancel = () => emit("closed");

const handleSubmit = () => {
  emit("submit", componentValue.value);
};
const show = () => (visible.value = true);
const hide = () => (visible.value = false);

defineExpose({
  show,
  hide,
});
</script>

<style lang="scss" scoped>
.EaconComponentsMessageBox {
  --ea-scrollbar-offset-x: 8px;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;

  .container {
    margin-top: 15vh;
    width: 500px;
    height: 240px;
    box-sizing: border-box;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    background: rgba(248, 251, 255, 0.88);
    border: 1px solid rgba(0, 0, 0, 0.12);

    min-height: 240px;
    backdrop-filter: blur(22px);

    .head {
      flex: 0 0 auto;
      padding: 12px 24px;
      line-height: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-weight: normal;
        font-size: 16px;
        line-height: 19px;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }

      .close {
        cursor: pointer;
        margin-top: 4px;
        color: #000;
        height: 16px;
        width: 16px;

        &:hover {
          color: #4b9cfb;
        }
      }
    }

    .content {
      height: 1px;
      overflow: auto;
      flex: 1 1 auto;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
      padding: 24px 24px 0;
      font-weight: normal;
      font-size: 16px;
      line-height: 28px;
      text-align: left;
      font-style: normal;
      text-transform: none;
      display: flex;

      .warn-icon {
        flex: 0 0 auto;
        width: 32px;
        height: 32px;
        margin-top: 1px;

        img {
          width: 100%;
        }
      }

      .EaconComponentsScrollBar {
        flex: 1 1 auto;
      }

      .text {
        height: max-content;
        flex: 1;
        margin-left: 4px;
        white-space: pre-wrap;
        height: 100%;
        overflow: auto;
        word-break: break-all;
      }
    }

    .footer {
      display: flex;
      padding: 10px 24px 24px;
      justify-content: flex-end;
      font-weight: normal;
      font-size: 14px;
      line-height: 22px;
      text-align: center;
      font-style: normal;
      text-transform: none;
      gap: 12px;

      .Button {
        cursor: pointer;
      }
    }
  }
}
</style>

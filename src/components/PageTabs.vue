<template>
  <div
    class="EaconComponents EaconComponentsPageTabs"
    :class="{ EaconComponentsPageTabsHidden: hidden, disabled }"
  >
    <div class="before" @click="handleClickBefore">
      <el-icon type="icon-gengduo"></el-icon>
    </div>
    <div ref="containerRef" class="EaconComponentsPageTabContainer">
      <div
        ref="tabsDom"
        class="EaconComponentsPageTab"
        v-for="(option, idx) in options"
        :key="option.value"
        :class="{ active: option.value === value?.value }"
        @click="handleClick(option, idx)"
      >
        {{ formatLabel(option.label, option.value === value?.value) }}
      </div>
    </div>
    <div class="after" @click="handleClickNext">
      <el-icon type="icon-gengduo"></el-icon>
    </div>
  </div>
</template>

<script setup >
import { watch, nextTick, useTemplateRef, onBeforeUnmount,ref } from "vue";

const props = defineProps({
  options:{
    type: Array,
    default: () => []
  },
  maxText: {
    type: Number,
  },
  scrollIntoView: {
    type: Boolean,
  },
  scrollIntoViewOptions: {
    type: Object,
    default: () => ({
      behavior: "smooth",
      block: "center",
      inline: "center",
    }),
  },
  disabled:{
    type: Boolean,
  }
})

const emit = defineEmits(["change"]);



const value = defineModel('value');

const tabsDom =  ref(null)
const handleClick = (option, idx) => {
  value.value = option;
  emit("change", option);
  if (props.scrollIntoView) {
    tabsDom.value?.[idx]?.scrollIntoView(props.scrollIntoViewOptions);
  }
};

let hidden = ref(true);
const computeHidden = () => {
  hidden.value = containerRef.value?.scrollWidth == containerRef.value?.clientWidth;
};
watch(
  () => props.options,
  () => {
    nextTick(computeHidden);
  },
  {
    deep: 2,
    immediate: true,
  }
);
window.addEventListener("resize", computeHidden);
onBeforeUnmount(() => {
  window.removeEventListener("resize", computeHidden);
});

const containerRef = ref(null)
const scroll = (n) => {
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      containerRef.value?.scrollBy(n, 0);
    }, i * 20);
  }
};
const handleClickBefore = () => scroll(-20);
const handleClickNext = () => scroll(20);

const formatLabel = (str, animate) => {
  if (!props.maxText || str.length <= props.maxText) return str;
  return str.slice(0, props.maxText) + "...";
};
</script>

<style lang="scss" scoped>
.EaconComponentsPageTabs {
  display: flex;
  user-select: none;
  gap: 4px;
  &.EaconComponentsPageTabsHidden {
    .before,
    .after {
      display: none;
    }
  }

  &.disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  .before,
  .after {
    display: flex;
    // align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-top: 4px;
    &:hover {
      color: var(--ea-primary);
    }
  }

  .before {
    .EaconComponentsIcon {
      transform: rotate(180deg);
    }
  }

  .EaconComponentsPageTabContainer {
    display: flex;
    gap: 24px;
    overflow: auto;
    width: 100%;
    &::-webkit-scrollbar {
      display: none;
    }
    .EaconComponentsPageTab {
      border: 4px solid transparent;
      padding-bottom: 12px;
      cursor: pointer;
      color: var(--ea-text1);
      font-size: 14px;
      line-height: 16px;
      text-align: center;
      font-style: normal;
      text-transform: none;
      transition: var(--transition);
      white-space: nowrap;
      &:hover {
        color: var(--ea-primary);
      }
      &.active {
        color: var(--ea-primary);
        border-bottom-color: var(--ea-primary);
      }
    }
  }
}
</style>

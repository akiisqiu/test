<template>
  <el-text
    ref="componentRef"
    v-bind="mergeProps($attrs, props)"
    class="EaconComponentsText"
  >
    <template v-for="(_, name) in $slots" #[name]="sc">
      <slot :name v-bind="sc ?? {}"></slot>
    </template>
  </el-text>
</template>

<script setup >
import { ref,mergeProps } from "vue";

const componentRef = ref(null)

defineExpose({
  componentRef,
});
</script>

<style lang="scss" scoped>
.EaconComponentsText {
  cursor: pointer;
  &.el-text--primary {
    &:hover {
      color: rgba(85, 151, 228, 1);
    }
    &:active {
      color: rgba(27, 112, 212, 1);
    }
  }
  &.el-text--danger {
    &:hover {
      color: rgba(214, 67, 47, 1);
    }
    &:active {
      color: rgba(171, 54, 38, 1);
    }
  }
}
</style>

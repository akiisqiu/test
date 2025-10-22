<template>
  <el-scrollbar
    ref="componentRef"
    v-bind="mergeProps($attrs, props)"
    class="EaconComponentsScrollBar"
  >
    <template v-for="(_, name) in $slots" #[name]="sc">
      <slot :name v-bind="sc ?? {}"></slot>
    </template>
  </el-scrollbar>
</template>

<script setup >
import { mergeProps, ref } from "vue";

const componentRef = ref(null);
defineExpose({
  componentRef,
});
</script>

<style lang="scss" scoped>
.EaconComponentsScrollBar {
}
</style>

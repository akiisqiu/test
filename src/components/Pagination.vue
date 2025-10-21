<template>
  <el-pagination
    ref="componentRef"
		layout="total, sizes, prev, pager, next, jumper"
    v-bind="mergeProps($attrs, props)"
		:background="true"
  >
    <template v-for="(_, name) in $slots" #[name]="sc">
      <slot :name v-bind="sc ?? {}"></slot>
    </template>
  </el-pagination>
</template>

<script setup >
import { mergeProps } from "vue";

const props = defineProps({
  pagerCount: 5,
  pageSizes: () => [10, 25, 50, 100],
  teleported: true,
});

</script>

<style lang="scss" scoped>

</style>

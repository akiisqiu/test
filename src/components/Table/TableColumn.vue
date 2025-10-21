<template>
  <el-table-column
    ref="componentRef"
    :key="option.prop"
    :label="option.label"
    :prop="option.prop"
    :align="option.children && 'center'"
    show-overflow-tooltip
    v-bind="option.itemAttrs"
    :minWidth="option.itemAttrs?.minWidth || computeWidth"
  >
    <template #header="scope">
      <slot v-if="option.headerSlot" :name="option.headerSlot" v-bind="scope"> </slot>
    </template>
    <template #default="scope">
      <template v-if="option.children?.length">
        <TableColumn
          :data
          v-for="(child, childIdx) in option.children"
          :option="child"
          :idx="childIdx"
          :key="childIdx"
          :compute-widths="childrenWidths"
          :autoComputeWidth
          :parentLackWidth="labelWidth - childrenSummaryWidth"
        >
          <template v-for="(_, name) in $slots" #[name]="sc">
            <slot :name v-bind="sc ?? {}"></slot>
          </template>
        </TableColumn>
      </template>
      <template v-else>
        <span
          v-if="!option.is && !option.slot"
          class="span"
          :prop="option.prop"
          v-bind="option.componentAttrs"
          :w="computeWidth"
        >
          {{ getText(scope) }}
        </span>

        <component
          v-else-if="option.is"
          :is="option.is"
          v-bind="option.componentAttrs"
          :scope
        >
          {{ getText(scope) }}
        </component>

        <slot v-else-if="option.slot" :name="option.slot" v-bind="scope">
        </slot>
      </template>
    </template>
  </el-table-column>
</template>


<script setup >
import { computed, ref } from 'vue';
import { getTextWidth } from "../dom";

/**
 * 表格列
 * @param {{
 *   prop: string,
 *   label: string,
 *   slot?: string;
 *   headerSlot?: string;
 *   is: string,
 *   itemAttrs: any,
 *   componentAttrs: any,
 *   children: any[],
 * }} option
 */
const props = defineProps({
  option: Object,
  data: Array,
  computeWidths: Array,
  idx: Number,
  autoComputeWidth: Boolean,
  parentLackWidth: Number,
});

//默认值
const formatEmpty = (value, defaultValue= '--') => {
  if ([undefined, null, ''].includes(value) || (typeof value === 'number' && Number.isNaN(value))) {
    return defaultValue
  }
  return value
}


/**
 * 获取列内容
 * @param {{ row: any, column: any, $index: number }} scope
 */
const getText = (scope) => {
  const option = props.option;
  const val = scope.row[option.prop];
  const { row, column, $index } = scope;
  const res = option.itemAttrs?.formatter
    ? option.itemAttrs.formatter(row, column, val, $index)
    : val;
  return formatEmpty(res);
};

document.fonts.ready.then(() => {
  setTimeout(() => {
    isLoadedFont.value = true;
  });
});

//计算label宽度
const labelWidth = computed(() => props.computeWidths[props.idx]);
//计算数据宽度
const dataWidth = computed(() => {
  const arr = props.data.map((item, idx) => {
    return getTextWidth(
      String(getText({ row: item, column: props.option, $index: idx })),
      "14px"
    );
  });

  let lackWidth =
    labelWidth.value + (props.parentLackWidth ?? 0) / props.computeWidths.length;
  return Math.max(...arr, labelWidth.value, lackWidth);
});
//

let isLoadedFont = ref(false);
const computeWidth = computed(() => {
  if (!props.autoComputeWidth) return;
  return Math.min(dataWidth.value + 48 + (isLoadedFont.value ? Number(isLoadedFont.value) : 1), 240);
});

const childrenWidths = computed(() => {
  if (!props.option.children?.length) return [];
  return props.option.children.map((i) => getTextWidth(i.label, "14px", "600"));
});
const childrenSummaryWidth = computed(() =>
  childrenWidths.value.reduce((l, i) => l + i, 0)
);

const componentRef= ref(null);
defineExpose({
  componentRef,
});
</script>

<style lang='scss' scoped>

</style>
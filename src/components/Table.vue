<!-- 表格 -->
<template>
    <div class="tableBox" :class="{ hasSummary: $attrs.showSummary }">
        <div v-show="title" class="EaconComponentsTableTitle">
            {{ title }}
        </div>
        <el-table
            ref="componentRef"
            :data="data"
            stripe
            border
            height="100%"
            class="EaconComponentsTable"
            :row-class-name="tableRowClassName"
            empty-text=""
            scrollbar-always-on
            v-bind="mergeProps($attrs, props)"
            :options="undefined"
        >
            <!--多选-->
            <el-table-column type="selection" v-if="selection && options?.length"  :width="80" />
            <!--序号-->
            <el-table-column
                v-if="index && options?.length"
                type="index"
                :index="indexMethod"
                label="序号"
                :width="80"
                align="center"
                fixed="left"
            ></el-table-column>

            <TableColumn
                v-for="(option, idx) in options"
                :key="idx"
                :option="option"
                :idx="idx"
                :computeWidths="computeWidths"
                :data="data"
                :autoComputeWidth="autoComputeWidth"
            >
                <template v-for="(_, name) in $slots" #[name]="sc">
                    <slot :name="name" v-bind="sc || {}"></slot>
                </template>
            </TableColumn>

            <template #empty>
                <div class="table-empty"  v-if="!loading">
                    <img src="@/assets/images/notData.png" alt="notData" />
                    <div>暂无数据</div>
                </div>
            </template>
        </el-table>
    </div>
</template>

<script setup>
import { ref, computed, mergeProps } from "vue";
import { getTextWidth } from "./dom";

import TableColumn from "./TableColumn.vue";

const props = defineProps({
    options: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    title: { type: String, default: "" },
    index: { type: Boolean, default: true },
    selection:{ type: Boolean, default: false },
    indexMethod: { type: Function, default: (index) => index + 1 },
    activeIdx: { type: Number },
    autoComputeWidth: { type: Boolean },
});

const componentRef = ref(null);


const tableRowClassName = (scope) => {
    if (scope.rowIndex === props.activeIdx) return "active-row";
    return ''
};
const computeWidths = computed(() => {
    if (!props.autoComputeWidth) return [];
    return props.options.map((i) => getTextWidth(i.label, "14px", "600"));
});
defineExpose({
    componentRef,
});
</script>
<style lang='scss' scoped>
.tableBox{
    flex: 1 1 auto;
}
</style>
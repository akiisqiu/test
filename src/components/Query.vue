<template>
    <div class="card table-search">
        <Form
            ref="componentRef"
            v-model="value"
            :options="allOptions"
            :debug
            inline
            showLabel
            :attrs
            @nextTick="handleNextTick"
            @linkage="handleLinkage"
        >
            <template v-for="(_, name) in $slots" v-slot:[name]="sc">
                <slot :name="name" v-bind="sc ?? {}"></slot>
            </template>
            <template #buttons>
                    <div class="EaconComponentsQueryButtons">
                    <el-button type="primary" @click="handleClickAdd" v-if="showAdd">新增</el-button>
                    <el-button type="primary" @click="handleQuery" v-if="showSearch">查询</el-button>
                    <el-button type="warning" @click="handleReset" v-if="showReset">重置</el-button>
                </div>
            </template>
        </Form>
    </div>
</template>
    
<script setup >

import { computed, ref } from "vue";

import Form from "./Form.vue";

const props = defineProps({
    // 表单配置
    options: Array,
    // 表单属性
    attrs: Object,
    // 是否显示标签
    showLabel: {
        type: Boolean,
        default: true,
    },
    // 是否显示调试信息
    debug: Boolean,
    // 是否显示查询按钮
    showSearch: { type: Boolean, default: true },
    // 是否显示重置按钮
    showReset: { type: Boolean, default: true },
    // 是否显示新增按钮
    showAdd: { type: Boolean, default: true },
});

const emit = defineEmits(["query", "reset", "linkage", "nextTick","handleClickAdd"])


const componentRef = ref(null)

const value = defineModel("modelValue", { default: {} })

const allOptions = computed(() => [
    ...(Array.isArray(props.options) ? props.options : []),
    {
    prop: "",
    label: "",
    slot: "buttons",
    },
]);


const handleQuery = async () => {
    const res = await componentRef.value?.validate();
    res === true && emit("query", value.value);
};

const handleReset = () => emit("reset");

const handleClickAdd = () => emit("handleClickAdd");
const handleNextTick = () => emit("nextTick");
const handleLinkage = (value, fields) => emit("linkage", value, fields);

defineExpose({ componentRef: componentRef });
</script>
<style lang="scss" scoped>
</style>
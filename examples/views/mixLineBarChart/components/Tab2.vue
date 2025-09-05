<!-- 基础混合图 -->
<template>
    <EaMixLineBarChart v-bind="chartOption"></EaMixLineBarChart>
</template>

<script lang='ts' setup>
import { ref } from "vue";
const chartOption = ref({
    title: "基础混合图",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            name: "运输设备",
            type: "line",
            // 0: 左侧y轴 1: 右侧y轴 不传第一条数据默认左侧轴，其余数据右侧y轴
            yAxisIndex: 0,
            data: [1, 6, 3, 4, 5],
        },
        {
            name: "采装设备",
            yAxisIndex: 0,
            data: [5, 4, 3, 2, 1],
        },
        {
            name: "辅助设备",
            yAxisIndex: 1,
            data: [1, 2, 3, 4, 5]
        }
    ],
    colors: [
        "#6EF366",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
    units:["单位：h"],
    doubleY: true
})
</script>

<style scoped>
</style>
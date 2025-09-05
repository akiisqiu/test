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
            data: [1, 6, 3, 4, 5],
        },
        {
            name: "采装设备",
            type:'stackBar',
            data: [5, 4, 3, 2, 1],
        },
        {
            name: "辅助设备",
            type:'stackBar',
            data: [1, 2, 3, 4, 5]
        },
        {
            name: "stocking",
            type:'stackBar',
            stack: 'aki',
            data: [5, 4, 3, 2, 1],
        },
        {
            name: "panty",
            type:'stackBar',
            stack: 'aki',
            data: [1, 2, 3, 4, 5]
        }
    ],
    colors: [
        "#BBE478", "#A3E8E2", "#96F8B3", "#AB80FF", "#E7BD7D",
    ],
    units:["单位：h"],
    doubleY: true
})
</script>

<style scoped>
</style>
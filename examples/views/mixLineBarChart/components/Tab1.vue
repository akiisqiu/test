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
            data: [5, 4, 3, 2, 1],
        },
        {
            name: "辅助设备",
            data: [1, 2, 3, 4, 5]
        }
    ],
    colors: [
        "#6EF366",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
    units:["单位：h"]
})
</script>

<style scoped>
</style>
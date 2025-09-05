<!-- 基础折线图 -->
<template>
    <EaLineChart v-bind="chartOption"></EaLineChart>
</template>

<script lang='ts' setup>
import { ref } from "vue";

const chartOption = ref({
    title: "基础折线图",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            name: "运输设备",
            data: [21010, 21, 13, 24, 15],
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
<!-- 双轴 -->
<template>
    <EaBarChart v-bind="chartOption"></EaBarChart>
</template>

<script lang='ts' setup>
import { ref } from "vue";

const chartOption = ref({
    title: "基础柱状图-双轴 ",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            name: "运输设备",
            data: [1, 2, 3, 4, 5],
        },
        {
            name: "采装设备",
            data: [5, 4, 3, 2, 1],
        },
    ],
    colors: [
        "#6EF366",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
    units:["单位：h",'单位：t'],
    doubleY:true
})
</script>

<style scoped>
</style>
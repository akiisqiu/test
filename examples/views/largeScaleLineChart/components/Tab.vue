<!-- 基础折线图 -->
<template>
    <EaLargeScaleLineChart v-bind="chartOption"></EaLargeScaleLineChart>
</template>

<script lang='ts' setup>
import { ref } from "vue";
const XData = new Array(100).fill('--').map((i,idx)=> 'test' + (idx + 1) )
const YData = new Array(100).fill(0).map((i,idx)=> Math.floor(Math.random() * 100) )
const chartOption = ref({
    title: "基础折线图",
    x: XData,
    y: [
        {
            name: "运输设备",
            data: YData,
        },
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
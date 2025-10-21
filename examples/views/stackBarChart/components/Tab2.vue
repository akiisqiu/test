<!-- 依据百分比堆叠的柱状图 -->
<template>
    <EaStackBarChart v-bind="chartOption" :theme></EaStackBarChart>
</template>

<script lang='ts' setup>
import { onBeforeUnmount, ref } from "vue";
import * as echarts from 'echarts'

const chartOption = ref({
    title: "依据百分比堆叠的柱状图",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            name: "系列1",
            data: [10, 20, 30, 40, 50],
        },
        {
            name: "系列2",
            data: [20, 30, 40, 50, 60],
        },
        {
            name: "系列3",
            data: [30, 40, 50, 60,70],
        },
    ],
    units:['单位：%'],
    tooltip: {
        valueFormatter: (value) => value  + "%" 
    },
    percentage:true,
    colors: [
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(83, 201, 81, 0.40)" },
            { offset: 1, color: "rgba(87, 154, 56, 1)" },
        ]),
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(111, 189, 240, 0.40)" },
            { offset: 1, color: "rgba(103, 171, 217, 1)" },
        ]),
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(231, 189, 125, 0.40)" },
            { offset: 1, color: "rgba(231, 189, 125, 1)" },
        ]),
        
    ]
})
let theme = ref(localStorage.getItem("theme") || "white");
const changeTheme = (e: string) => {
    theme.value = e;
};
window.changeTheme.add(changeTheme);
onBeforeUnmount(() => window.changeTheme.delete(changeTheme));
</script>

<style scoped>
</style>
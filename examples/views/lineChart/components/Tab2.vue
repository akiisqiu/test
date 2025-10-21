<!-- 折线图自定义 -->
<template>
    <EaLineChart v-bind="chartOption" :theme></EaLineChart>
</template>

<script lang='ts' setup>
import { onBeforeUnmount, ref } from "vue";
import * as echarts from 'echarts'

const chartOption = ref({
    title: "基础折线图-折线图自定义",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            name: "运输设备",
            data: [10, 21, 13, 24, 15],
            //特殊样式
            lineStyle: {
                width:10 ,
                color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: "#87E6DE" },
                        { offset: 1, color: "#9CEA4E" }
                    ]
                },
                shadowColor: "rgba(0,0,0,0.54)",
                shadowBlur: 4,
                shadowOffsetY: 4
            },
        },
        {
            name: "采装设备",
            data: [5, 4, 3, 2, 1],
        },
        {
            name: "辅助设备",
            data: [1, 2, 3, 4, 5],
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "rgba(231, 189, 125,0.3)" },
                    { offset: 1, color: "rgba(24,84,98,0)" },
                ]),
            },
        }
    ],
    colors: [
        "#9CEA4E",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
    units:["单位：h"]
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
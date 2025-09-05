<!-- 柱状图自定义 -->
<template>
    <EaBarChart v-bind="chartOption"></EaBarChart>
</template>

<script lang='ts' setup>
import { ref } from "vue";

const chartOption = ref({
    title: "基础柱状图-柱状图自定义",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            name: "运输设备",
            data: [1, 2, 3, 4, 5],
            //特殊样式
            barWidth:20 ,
            itemStyle: {
                borderRadius:20,
                color: {                                    
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    //提示框颜色取itemStyle——colorStops中第一个color
                    colorStops: [
                        { "offset": 1, "color": "rgba(87,154,56,0.53)" },
                        { "offset": 0, "color": "rgba(83,201,81,0)" }
                    ]
                },
                shadowColor: "rgba(0, 0, 0, 0.3)",
                shadowBlur: 6
            },
        },
        {
            name: "采装设备",
            data: [5, 4, 3, 2, 1],
            //自定义borderRadius
            itemStyle: {
                borderRadius:[10,10,0,0],
            }
        },
        {
            name: "辅助设备",
            data: [1, 2, 3, 4, 5],
            //自定义提示框单位
            tooltip: {
                valueFormatter: function (value: number) {
                    return value + ' ml';
                }
            },
        }
    ],
    colors: [
        "rgba(87,154,56,0.53)",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
    units:["单位：h"],
    //X轴标签样式
    XAxisLabel:{
        rotate:45,
        formatter: (value: string) => {
            return value.split('-').join('/');
        }
    }
})
</script>

<style scoped>
</style>
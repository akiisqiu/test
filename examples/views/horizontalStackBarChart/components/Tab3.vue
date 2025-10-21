<!-- 自定义横向堆叠柱状图 -->
<template>
    <EaHorizontalStackBarChart v-bind="chartOption":theme></EaHorizontalStackBarChart>
</template>

<script lang='ts' setup>
import { onBeforeUnmount, ref } from "vue";

const chartOption = ref({
    title: "自定义横向堆叠柱状图",
    y: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    x: [
        {
            name: "运输设备",
            data: [1, 2, 3, 4, 5],
            //特殊样式
            itemStyle: {
                color: {                                    
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    //提示框颜色取itemStyle——colorStops中第一个color
                    colorStops: [
                        { "offset": 0, "color": "rgba(87,154,56,0.53)" },
                        { "offset": 1, "color": "rgba(83,201,81,0)" }
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
                valueFormatter: function (value) {
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
<!-- 自定义横向堆叠柱状图 -->
<template>
    <EaHorizontalStackBarChart v-bind="chartOption":theme></EaHorizontalStackBarChart>
</template>

<script lang='ts' setup>
import { onBeforeUnmount, ref } from "vue";

const chartOption = ref({
    title: "自定义提示框",
    y: ["公司1", "公司2", "公司3"],
    x: [
        {
            name: "运输设备",
            data: [1, 2, 3, 4, 5],
        },
        {
            name: "采装设备",
            data: [5, 4, 3, 2, 1],
        },
        {
            name: "辅助设备",
            data: [1, 2, 3, 4, 5],
        }
    ],
    colors: [
        "#6EF366",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
    tooltip: {
        //自定义提示框
        formatter: (params: any[]) => {
            const title = Array.isArray(params) && params[0]?.axisValueLabel ? params[0].axisValueLabel : '-';
            const content = params.map(p => { 
                const { seriesName,value } = p;
                return `<div>${seriesName}: ${value}</div>`;
            }).join('');
            return (
                `<div style="padding:5px; border:1px solid #ccc;">
                    <div><strong>${title}</strong></div>
                    ${content}
                </div>`
            );
        }
    }
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
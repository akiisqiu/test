<!-- 自定义单个柱子颜色 -->
<template>
    <EaBarChart v-bind="chartOption" :theme></EaBarChart>
</template>

<script lang='ts' setup>
import { onBeforeUnmount, ref } from "vue";

const chartOption = ref({
    title: "基础柱状图-自定义单个柱子颜色",
    x: ["公司1", "公司2", "公司3"],
    y: [
        {
            data: [
                {
                    value:1,
                    itemStyle: {
                        color: "#E7BD7D"
                    }
                },
                {
                    value:2,
                    itemStyle: {
                        "color": "#6EF366"
                    }
                },
                {
                    value:3,
                    itemStyle: {
                        "color": "#AB80FF"
                    }
                }, 
            ]
        }
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
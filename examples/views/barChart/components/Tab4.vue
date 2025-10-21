<!-- 带背景色的柱状图 -->
<template>
    <EaBarChart v-bind="chartOption":theme></EaBarChart>
</template>

<script lang='ts' setup>
import { onBeforeUnmount, ref } from "vue";

const chartOption = ref({
    title: "基础柱状图-带背景色的柱状图",
    x: ["公司1", "公司2", "公司3"],
    y: [
        {
            data: [1, 2, 3, 4, 5],
            //带背景色
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)',
                borderRadius:12
            },
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
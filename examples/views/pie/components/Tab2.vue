<!-- 环形 -->
<template>
    <EaPie v-bind="chartOption" :theme></EaPie>
</template>

<script lang='ts' setup>
import { onBeforeUnmount, ref } from "vue";

const chartOption = ref({
    radius:['30%','50%'],
    // 饼图配置项 饼图扇区之间的间隔角度
    padAngle:5,
    // 饼图配置项 饼图扇区之间的间隔半径
    borderRadius:10,
    data: [
        { value: 1048, name: '1' },
        { value: 735, name: '2' },
        { value: 580, name: '3' },
        { value: 484, name: ' 4' },
        { value: 300, name: '5' }
    ],
    colors:["#BBE478", "#A3E8E2", "#96F8B3", "#AB80FF", "#E7BD7D"]
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
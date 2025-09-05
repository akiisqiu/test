<template>
    <div style="height: 100%;">
        <RemoteChild v-if="!loading"></RemoteChild>
    </div>
</template>

<script lang='ts' setup>
import { defineAsyncComponent, watch } from "vue";
import { loadModule } from "vue3-sfc-loader"
import * as Vue from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
    code: string
}>()

let RemoteChild: Vue.Component
let loading = $ref(false)
// 动态加载组件
const updateRemoteChild = () => {
    const options = {
        // 缓存依赖模块（如vue、其他组件）
        moduleCache: {
            vue: Vue, // 提供Vue依赖
            echarts: echarts, 
        },
        // 获取组件内容的函数（这里直接返回raw读取的字符串）
        getFile: () => Promise.resolve(props.code),

        processStyles: async (styleContent: string) => {
            return styleContent
        },
        // 处理样式的函数（自动注入到DOM）
        addStyle: async (styleCode: string) => {
            const style = document.createElement('style')
            style.textContent = styleCode
            document.head.appendChild(style)
        },
    }
    RemoteChild = defineAsyncComponent(async () => {
        try {
            loading = true
            const res = await loadModule('dynamicComponent.vue', options)
            loading = false
            return res
        } finally {
            loading = false
        }
    })
}
updateRemoteChild()
watch(() => props.code, () => {
    updateRemoteChild()
})
</script>

<style lang='scss' scoped></style>
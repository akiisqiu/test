<template>
    <ElAnchorLink 
        :key="linkItem.path" 
        :href="`#${linkItem.path}`"
    >
        {{ linkItem.name }}
        <!-- 递归渲染子节点 -->
        <template #sub-link v-if="hasChildren">
            <RecursionAnchorLink 
                v-for="child in linkItem.children" 
                :key="child.path" 
                :linkItem="child" 
            />
        </template>
    </ElAnchorLink>
</template>
<script setup lang="ts"> 
interface LinkItem{
    path: string,
    name: string,
    children?: LinkItem[]
}
const props = defineProps<{
    linkItem: LinkItem
}>()


const hasChildren = $computed(() => {
    return props.linkItem.children && props.linkItem.children.length > 0
})
</script>
<script lang="ts"> 
export default {
    name: 'RecursionAnchorLink'
}
</script>
<template>
    <div class="wordPage">
        <ElRow>
            <!--固定航：左侧API列表-->
            <ElCol class="left" :span="4">
                <EaInput placeholder="请输入内容" v-model="searchText">
                    <template #suffix>
                        <EaIcon type="icon-sousuo" @click="searchApiWord" class="searchIcon"></EaIcon>
                    </template>
                </EaInput>
                <ElAnchor direction="vertical" type="default" :offset-top="80"  :scroll-container="'#wordApi-container'">
                    <RecursionAnchorLink v-for="item in wordList"   :linkItem="item" />
                </ElAnchor>
            </ElCol>
            <!--使用文档-->
            <ElCol class="right" :span="18">
                <div id="wordApi-container" class="content-scroll-container">
                    <div :id="`${item.path}`" v-for="item in wordList"  class="anchor-section">
                        <span class="anchor-title"> {{ item.name }}</span>
                    </div>
                </div>
            </ElCol>
        </ElRow>
    </div>
</template>



<script setup lang="ts">
import RecursionAnchorLink from '../../components/RecursionAnchorLink/RecursionAnchorLink.vue'
import {wordList} from './ApiConfig'
//搜索文档
const searchText = $ref('')
const searchApiWord = async () => {
    console.log('searchText', searchText)
}

</script>



<style lang='scss' scoped>
.wordPage {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;

    .el-row {
        width: 100%;
    }

    .left {
        height: 100%;
        position: sticky;
        align-self: flex-start;
        overflow-y: auto; 
        padding: 8px;
        border-right: 1px solid #ddd;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .right { 
        height: 100%;
        overflow-y: auto;
    }
}

.searchIcon {
    cursor: pointer;
}

.anchor-section {
    height: 500px; 
    background: rgba(255, 0, 0, 0.02);
    padding: 20px;
    .anchor-title{
        font-size: 32px;
    }
}
</style>
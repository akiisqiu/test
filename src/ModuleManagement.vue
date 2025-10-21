<!--配置模块管理-->
<template>
	<div class="main-box">
        <div class="table-box">
            <FullTablePage
                :tabOptions
                :autoComputeWidth="true"
            >
                <!-- <template #buttons >
                    <div class="button-box">
                        <el-button type="primary" @click="AddModel">新增模块</el-button>
                        <el-button type="primary" @click="SyncConfig">配置同步</el-button>
                        <el-button type="primary" @click="Export">导出</el-button>
                        <el-button type="primary" @click="Import">导入</el-button>
                    </div>
                </template> -->
            </FullTablePage>
        </div>
    </div>
</template>

<script setup name="ModuleManagement">
import FullTablePage from './component/FullTablePage/FullTablePage.vue'
//配置表头
const getTableOptions = () => {
    return {
        data:[
            { 
                prop: "module", 
                label: "模块",
                width: 150,
            },
            { 
                prop: "moduleName", 
                label: "模块名称",
                width: 150,
            },
            { 
                prop: "moduleType", 
                label: "模块类型",
            },
            { 
                prop: "version", 
                label: "版本",
            },
            { 
                prop: "description", 
                label: "模块描述",
            },
            { 
                prop: "status", 
                label: "状态",
            },
            { 
                prop: "time", 
                label: "更新时间",
            },
        ]
    }
}

//表格数据
const getTableData = (params) => {
    // return 接口(params);
    let option = getTableOptions().data
    let aki  = Array.from({ length: 5 }, () =>{
        return Object.fromEntries(
        option.map(item => [item.prop, Math.random().toString(36).slice(2, 8)])
    )});
    let rain = {
        data: aki,
        total: 5
    }
    return rain
}

//特殊按钮
const tableButtons = [
    "put",
    {
        label:"复制",
        show(row) {
            return true
        },
        async buttonClickEvent(row) {
        }
    },
    "delete",
]

const tabOptions = [
    {   
        label: "配置模块管理",
        value: "moduleManagement", 
        // //查询配置
        // queryOptions,
        // 查询表格接口需要的参数
        getParams:async (queryValue, currentPage, pageSize) => {
        },
        //表头
        getTableOptions,
        // 表格数据
        getTableData,
        //特殊按钮
        tableButtons,
        //详情数据
        async getDetailData(row) {
            return { ...row }
        },
        //是否显示编辑 删除
        hasPutRole() {
            return true;
        },
        hasDeleteRole() {
            return true;
        },
    }
]

//新增模块
const AddModel = () => {
}


//配置同步
const SyncConfig = () => {

}


//导出
const Export = () => {

}


//导入
const Import = () => {

}











</script>
<style lang='scss' scoped>

</style>
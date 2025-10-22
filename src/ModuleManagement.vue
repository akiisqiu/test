<!--配置模块管理-->
<template>
	<div class="main-box">
        <div class="table-box">
            <FullTablePage
                ref="tableComponent"
                :tabOptions
                :autoComputeWidth="true"
                @selectionChange="selectionChange"
            >
                <template #buttons >
                    <div class="button-box">
                        <el-button type="primary" @click="AddModel">新增模块</el-button>
                        <el-button type="primary" @click="SyncConfig">配置同步</el-button>
                        <el-button type="primary" @click="Export">导出</el-button>
                        <el-button type="primary" @click="Import">导入</el-button>
                    </div>
                </template>
            </FullTablePage>
            <MessageBox 
                ref="messageBox" 
                title="导出"
                v-model:modelValue="exportMessageBox" 
                @submit="submit"
                @closed="closed" 
                :options="MessageOptions"
                >
            </MessageBox>
        </div>
    </div>
</template>

<script setup name="ModuleManagement">
import { markRaw, ref } from 'vue'
import { ElMessage } from 'element-plus';


import Form from "./component/Form/Form.vue";
import FullTablePage from './component/FullTablePage/FullTablePage.vue'
import MessageBox from './component/MessageBox/MessageBox.vue'


//整体组件ref
const tableComponent = ref(null)
//新增|编辑|复制 配置
const getOptions = (tag)=>{
    return [
        {
            label: "模块",
            prop: "module",
            is: "el-input",
            itemAttrs: {
                rules: { required: true }
            },
            componentAttrs: {
                maxlength: 100,
                disabled: (tag==='put'|| tag==='copy')?  true : false 
            }
        },
        {
            label: "模块名称",
            prop: "moduleName",
            is: "el-input",
            itemAttrs: {
                rules: { required: true }
            },
            componentAttrs: {
                maxlength: 200,
                disabled:  tag==='copy'?  true : false 
            }
        },
        {
            label: "模块类型",
            prop: "moduleType",
            is: "el-select",
            itemAttrs: {
                rules: { required: true }
            },
            componentAttrs: {
                options:[
                    { label: "平台服务配置", value: "平台服务配置" },
                    { label: "平台设置配置", value: "平台设置配置" },
                    { label: "卡车车型配置", value: "卡车车型配置" },
                    { label: "卡车矿区配置", value: "卡车矿区配置" },
                    { label: "卡车默认配置", value: "卡车默认配置" },

                ],
                defaultExpandAll: true,
                checkStrictly: true,
                props: {
                    label: 'label',
                    value: 'value'
                },
                nodeKey: 'moduleType',
                disabled: (tag==='put'|| tag==='copy')?  true : false 
            }
        },
        {
            label: "版本",
            prop: "version",
            is: "el-input",
            itemAttrs: {
                rules: { required: true }
            },
            componentAttrs: {
                maxlength: 100,
            }
        },
        {
            label: "模块描述",
            prop: "description",
            is: "el-input",
            itemAttrs: {
                rules: { required: true }
            },
            componentAttrs: {
                maxlength: 200,
                disabled:  tag==='copy'?  true : false 
            }
        },
        {
            label: "状态",
            prop: "status",
            is: "el-select",
            itemAttrs: {
                rules: { required: true }
            },
            componentAttrs: {
                options:[
                    { label: "维护中", value: "维护中" },
                    { label: "发布", value: "发布" },
                    { label: "待发布", value: "待发布" },
                    { label: "测试中", value: "测试中" },
                    { label: "测试完成", value: "测试完成" },
                    { label: "锁定", value: "锁定" },

                ],
                defaultExpandAll: true,
                checkStrictly: true,
                props: {
                    label: 'label',
                    value: 'value'
                },
                nodeKey: 'moduleType',
                disabled:  tag==='copy'?  true : false 
            }
        },
    ]
}

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
const tableButtons = ()=>{
    return  [
        {
            label: "编辑",
            // 是否显示
            show: (row) => {
                return row.status !=='测试中' && row.status !=='测试完成'
            },
            // 点击事件 触发内部编辑
            async buttonClickEvent(row) {
                await tableComponent.value.onPut(row);
            }
        },
        {
            label:"复制",
            show(row) {
                return true
            },
            async buttonClickEvent(row) {
                const { version, ...newObj } = row; // 解构掉

                tableComponent.value?.setDrawer(
                    true,
                    {
                        title: "复制新增" ,
                        is: markRaw(Form),
                        componentAttrs: {
                            labelPosition: "left",
                        },
                        showHeaderButtons: true,
                        row:newObj,
                        options:getOptions('copy'),
                        async onConfirm(data) {
                            console.log("🚀 ~ tableButtons ~ data:", data)
                            //新增接口
                            //await 接口(data)
                            ElMessage.success("复制成功！");
                            tableComponent.value.getTableData();
                        },
                        modal: true,
                        componentAttrs: {
                            columns: 1
                        }
                    },
                    newObj
                )
                // await tableComponent.value.onPut(newObj);
            }
        },
        "delete",
    ]
}

const tabOptions = [
    {   
        label: "配置模块管理",
        value: "moduleManagement", 
        //初始查询参数
        queryValue: { orgCode: "", shiftType: "" },
        //查询配置
        // queryOptions,
        // 查询表格接口需要的参数
        getParams:async (queryValue, currentPage, pageSize) => {
        },
        //表头
        getTableOptions,
        // 表格数据
        getTableData,
        // 表格特殊属性
        tableAttrs:{
            selection:true
        },
        //特殊按钮
        tableButtons:tableButtons(),
        //配置
        getPutDrawerAttrs() {
            return {
                title: "编辑",
                componentAttrs: {
                    columns:1
                }
            }
        },
        getPostDrawerAttrs() {
            return {
                title: "新增",
                componentAttrs: {
                    columns: 1
                }
            }
        },
        //详情展示配置
        // detailOptions,
        //详情数据
        async getDetailData(row) {
            return row;
        },
        //新增配置
        postOptions:getOptions('post'),
        //新增按钮钩子(云端环境导入初始状态为“维护中”    生产环境导入初始状态为“待发布”) 需要判断环境
        getPostData(){
            return {
                status: "维护中",
            }
        },
        // 新增提交
        handlePost(data) {
            // return addShift(data);
        },
        //编辑配置
        putOptions:getOptions('put'),
        // 编辑按钮钩子
        async getPutData(row) {
            return  row;
        },
        // 编辑提交
        handlePut(data) {
            // return updateShift(data);
        },
        //删除
        async handleDelete(data) {
            console.log("🚀 ~ data:", data)
            // await  deleteShift({ id: data.id });
        },
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
        disabledConfirmBeforeCancelEdit: true, //是否禁用取消编辑前进行二次确认，true不需要二次确认
    }
]

//勾选表格
const selectionChange = (selection) => {
    console.log("勾选内容", selection)
}



//新增模块
const AddModel = async() => {
}


//配置同步
const SyncConfig = () => {

}


//配置勾选面板
const exportMessageBox = ref(false)
const MessageOptions = {
    is:'el-select',
    componentAttrs:{
        placeholder:'请选择',
        options:[
            { label: "南路天", value: "南路天" },
        ],
        value: '' // 初始值
    }
}
const closed = () => { 
    exportMessageBox.value = false
}
const submit = async(val) => { 
    console.log("🚀 ~ submit ~ val:", val)
}
//导出
const Export = () => {
    exportMessageBox.value = true
}


//导入
const Import = () => {

}











</script>
<style lang='scss' scoped>

</style>
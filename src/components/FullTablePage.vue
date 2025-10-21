<!--完整页面-->
<template>
    <div class="tablePageWithCurd">
        <div
            v-if="tabOptions.length > 1"
            class="EaconComponentsTablePageWithCurdTabs"
        >
            <PageTabs
            ref="tabsComponent"
            v-model="activeTab"
            :options="tabOptions"
            scrollIntoView
            :disabled="drawerAttrs?.disabledPageTab"
            @change="handleChangeTab"
            ></PageTabs>
        </div>

        <slot name="containerTop"></slot>

        <div class="containerContent">
            <slot name="containerLeft"></slot>
            <div class="containerRight">
                <!--查询表单-->
                <Query 
                    ref="queryComponent"
                    :key="activeTab.value"
                    v-model="queryValue"
                    :options="queryOptions"
                    :showSearch="tabOptions.showSearch"
                    :showReset="tabOptions.showReset"
                    :showAdd="tabOptions.showAdd"
                    @handleClickAdd="handleClickAdd"
                    @query="handleQuery"
                    @reset="handleReset"
                >   
                    <template v-for="(_, name) in $slots" v-slot:[name]="sc">
                        <slot :name="name" v-bind="sc ?? {}"></slot>
                    </template>
                </Query>
                <div class="card table">
                    <!--表格-->
                    <EaTable 
                        ref="tableComponent"
                        v-bind="activeTab?.tableAttrs"
                        :options="allTableOptions"     
                        :data="tableData" 
                        :autoComputeWidth
                        :loading
                    >
                        <template #operator="scope">
                            <div class="EaconComponentsTablePageWithCurdTableButtons">
                                <Text
                                    v-EaSync="() => handleClickTableButton(button, scope.row)"
                                    v-for="(button, idx) in tableButtons"
                                    :key="idx"
                                    v-show="!button.show || button.show?.(scope.row)"
                                    type="primary"
                                    v-bind="button.buttonAttrs"
                                >
                                    {{ button.label }}
                                </Text>
                                </div>
                        </template>
                    </EaTable>
                </div>
                <!-- 分页 -->
                <Pagination
                    v-if="activeTab?.pagination !== false" 
                    ref="paginationComponent"
                    :total
                    v-model:page-size="pageSize"
                    v-model:current-page="currentPage"
                    @change="handlePageChange"
                ></Pagination>
            </div>
        </div>
    </div>
</template>

<script setup >
import { onMounted, ref,watch,reactive,computed, markRaw  } from 'vue';

import Query from './Query.vue';
import EaTable from './Table.vue'
import Pagination from './Pagination.vue'
import Text from './Text.vue'
import PageTabs from './PageTabs.vue';
import { getTextWidth } from "./dom";

/**
 * 表格配置参数
 * 
 * @typedef {Object} TabOptions
 * @property {Array} queryOptions - 筛选项配置
 * @property {Object} [queryValue={}] - 筛选项值
 * @property {Boolean} [showSearch=true] - 是否展示查询按钮
 * @property {Boolean} [showReset=true] - 是否展示重置按钮
 * @property {Boolean} [showAdd=true] - 是否展示添加按钮
 * 
 * @property {boolean} [tableOperation=true] - 是否展示操作列
 * @property {Array} [tableButtons=["detail","put","delete"]] - 表格按钮配置
 * 
 * @property {boolean} [pagination=true] - 是否展示分页器
 * 
 * @property {(queryValue: Object, currentPage: number, pageSize: number) => Promise<Object>} [getParams] 
 *           调用表格查询接口前获取参数，没有则使用默认拼接 { ...queryValue, currentPage, pageSize }
 * 
 * @property {(params: Object) => Promise<{ data:Array, slot?: string }>} [getTableOptions] 
 *           查询表头，入参是 getParams 处理后的值
 * 
 * @property {(params: Object) => Promise<{ data: Object[], recordsTotal: number }>} [getTableData] 
 *           查询表格数据
 * 
 * @property {(row: Object) => Promise<Object>} [getDetailData] 
 *           点击详情前调用，返回值用于抽屉显示
 * @property {() => Promise<Object>} [getPostData] 
 *           点击新增前调用，返回值用于抽屉显示
 * @property {(row: Object) => Promise<Object>} [getPutData] 
 *           点击编辑前调用，返回值用于抽屉显示
 * 
 * @property {(res: Object) => Promise<unknown>} [handleDelete] 
 *           删除数据方法，接口异常返回 new Error
 * @property {(res: Object) => Promise<unknown>} [handlePost] 
 *           新增数据方法，接口异常返回 new Error
 * @property {(res: Object) => Promise<unknown>} [handlePut] 
 *           修改数据方法，接口异常返回 new Error
 * 
 * @property {() => boolean} [hasPostRole] - 当前是否有新增权限
 * @property {(row: Object) => boolean} [hasPutRole] - 当前行是否有编辑权限
 * @property {(row: Object) => boolean} [hasDeleteRole] - 当前行是否有删除权限
 * @property {(row: Object) => boolean} [hasDetailRole] - 当前行是否有详情权限
 */
const props = defineProps({
    //最终配置
    tabOptions:{
        type:Array
    },
    //是否自适应宽度
    autoComputeWidth:{
        type: Boolean,
        default: true
    }
});

//emit 方法
const emit = defineEmits(["query", "reset",'changeTab','getTableData']);

//loading状态
let loading = ref(false);

//点击新增
const handleClickAdd = async () => {
    const res = (await activeTab.value?.getPostData?.()) ?? {};
    const customAttrs = (await activeTab.value?.getPostDrawerAttrs?.()) ?? {};
    const attrs = {
        title: "新增" + props.title,
        is: markRaw(Form),
        componentAttrs: {
            labelPosition: "top",
        },
        options: activeTab.value?.postOptions ?? [],
        row: {},
        async onConfirm(data) {
            await activeTab.value?.handlePost?.(data);
            ElMessage.success("新增成功！");
            getTableData();
        },
        modal: true,
        ...customAttrs,
    };
    // setDrawer(true, attrs, res);
};

//active Tab相关
let activeTab = ref(null);
watch(
    () => props.tabOptions, 
    () => {
        activeTab.value = reactive(props.tabOptions[0]);
    },
    { immediate: true }
);
const handleChangeTab = (option) => emit("changeTab", option);

// pagination
let total = ref(100);
let pageSize = ref(20);
let currentPage = ref(1);
const handlePageChange = () => {
    getTableData();
};
//配置页码
const setPagination = (current, size, cb) => {
    pageSize.value = size;
    currentPage.value = current;
    getTableDataCallBack.add(cb);
};

//表格按钮
let tableButtons = ref([]);
//表格数据
let tableData = ref([]);
//表头
let tableOptions = ref([]);

const tableOptionsWithSlots = computed(() =>
    tableOptions.value.filter((option) => option.slot)
);
const tableOptionsWithHeaderSlots = computed(() =>
    tableOptions.value.filter((option) => option.headerSlot)
);

//计算表头
const allTableOptions =computed(() => {
    if (!tableOptions.value?.length) return [];
    const res = [...tableOptions.value];
    if (activeTab.value?.tableOperation !== false) {
        const operateWidth = tableButtons.value.reduce(
            (l, i) => l + getTextWidth(i.label, "14px") + 24,
            0
        );
        res.push({
            label: "操作",
            prop: "operator",
            slot: "operator",
            itemAttrs: {
                fixed: "right",
                showOverflowTooltip: false,
                width: operateWidth + 18 + "px",
            },
        });
    }
    return res;
});

const getTableDataCallBack = new Set();
//获取表格
const getTableData = async () => {
    tableOptions.value = [];
    tableData.value = [];
    if (!activeTab.value || !activeTab.value.getTableData || !activeTab.value.getTableOptions) {
        return;
    }
    loading.value = true;
    try{
        const { getParams, getTableOptions, getTableData } = activeTab.value;
        const params = getParams
            ? await getParams(queryValue, currentPage, pageSize)
            : { ...queryValue, currentPage, pageSize };

        const res = await Promise.allSettled([
            getTableOptions(params),
            getTableData(params),
        ]);

        const [tableOptionsResObj, tableDataResObj] = res;

        let tableOptionsRes;
        let tableDataRes;

        if (tableOptionsResObj.status === "fulfilled") {
            tableOptionsRes = tableOptionsResObj.value;
        } else {
            console.error("getTableOptions failed:", tableOptionsResObj.reason);
        }

        if (tableDataResObj.status === "fulfilled") {
            tableDataRes = tableDataResObj.value;
        } else {
            console.error("getTableData failed:", tableDataResObj.reason);
        }

        tableOptions.value = reactive(tableOptionsRes?.data ?? []);
        tableData.value = tableDataRes?.data ?? [];
        total.value = tableDataRes?.recordsTotal ?? 0;
        getTableDataCallBack.forEach((fn) => fn?.(tableDataRes));
        getTableDataCallBack.clear();
        emit("getTableData", tableOptionsRes, tableDataRes);
    } catch (e) {
        console.error("获取表格接口数据异常", e);
        total.value = 0;
    }
    loading.value = false;

    
};

//表格详情
const onDetail = async(row) => { 
    const res = (await activeTab.value?.getDetailData?.(JSON.parse(JSON.stringify(row)))) ?? row;

    const customAttrs = (await activeTab.value?.getDetailDrawerAttrs?.(row)) ?? {};

    const attrs = {
        title: props.title + "详情",
        is: markRaw(Detail),
        showHeaderButtons: true,
        row,
        reOpen: onDetail,
        options: activeTab.value?.detailOptions ?? [],
        onPut,
        onDelete,
        modal: false,
        ...customAttrs,
    };
    // setDrawer(true, attrs, res);
};
//编辑
const onPut = async (row) => { 
    const res =(await activeTab.value?.getPutData?.(JSON.parse(JSON.stringify(row)))) ?? row;
    const customAttrs = (await activeTab.value?.getPutDrawerAttrs?.(row)) ?? {};

    const attrs = {
        title: "编辑" + props.title,
        is: markRaw(Form),
        componentAttrs: {
            labelPosition: "top",
        },
        showHeaderButtons: true,
        row,
        reOpen: onPut,
        options: activeTab.value?.putOptions ?? [],
        async onConfirm(data) {
            await activeTab?.handlePut?.(data);
            ElMessage.success("编辑成功！");
            getTableData();
        },
        onDelete,
        modal: false,
        disabledPageTab: activeTab.value.value?.disabledConfirmBeforeCancelEdit ? false : true,
        async beforeClose(type) {
        if (type !== "cancel" || activeTab.value?.disabledConfirmBeforeCancelEdit) {
            return true;
        }

        const dataIsEqual = isEqual(initDrawerData, drawerData);
        if (dataIsEqual) {
            return true;
        }

        try {
            await MessageBox(`确定取消编辑数据？`);
            return true;
        } catch (e) {
            return false;
        }
        },
        ...customAttrs,
    };
    // setDrawer(true, attrs, res);
}
//删除
const onDelete = async (row) => {
    await MessageBox(`确定删除数据？`);
    await activeTab.value?.handleDelete?.(row);
    ElMessage.success("删除成功！");
    getTableData();
};

const defaultTableOptionsConfig = {
    detail: {
        label: "详情",
        show: (row) => {
            return (
                !activeTab.value?.hasDetailRole || Boolean(activeTab.value?.hasDetailRole(row))
            );
        },
        buttonClickEvent: onDetail,
    },
    put: {
        label: "编辑",
        show: (row) => {
            return !activeTab.value?.hasPutRole || Boolean(activeTab.value?.hasPutRole(row));
        },
        buttonClickEvent: onPut,
    },
    delete: {
        label: "删除",
        show: (row) => {
            return (
                !activeTab.value?.hasDeleteRole || Boolean(activeTab.value?.hasDeleteRole(row))
            );
        },

        buttonAttrs: {
            type: "danger",
        },
        buttonClickEvent: onDelete,
    },
};
const defaultTableButtons = [
    "detail",
    "put",
    "delete",
];

const handleClickTableButton = async (button,row) => {
    try {
        button.confirm && (await MessageBox(button.confirmText ?? `确定${button.label}这条数据？`));
        await button.buttonClickEvent?.(row);
    } catch (e) {
        console.warn("表格事件异常", button, e);
    }
};

//查询
let initQueryValue = {};
let queryValue = ref({})
const handleQuery = async () => {
    getTableData();
    emit("query", queryValue.value);
};
//重置
const handleReset = (init) => {
    if (!activeTab.value) return;
    queryValue.value = JSON.parse(JSON.stringify(initQueryValue));
    pageSize.value = 20;
    currentPage.value = 1;
    total.value = 0;
    tableData.value = [];
    !init && emit("reset");
    !activeTab.value.disableQueryAfterSearch && getTableData();
};


// drawer
let drawerVisible = ref(false);
let drawerData = ref({});
let drawerAttrs = ref({ row: {} });
let initDrawerData = ref({});
const setDrawer = (visible, attrs,data) => {
    drawerVisible.value = visible;
    drawerData.value = JSON.parse(JSON.stringify(data));
    initDrawerData.value = JSON.parse(JSON.stringify(data));
    drawerAttrs.value = attrs;

    // activeTableRow = visible ? attrs.row : null;
};
const handleCloseDrawer = async (type) => {
    const canClose = (await drawerAttrs.value.beforeClose?.(type)) ?? true;
    canClose && setDrawer(false, { row: {} }, {});
};

watch(
    () => activeTab.value,
    () => {
        initQueryValue.value = JSON.parse(JSON.stringify(activeTab.value?.queryValue ?? {}));
        handleReset(true);
        handleCloseDrawer("changeTab");
        const activeTableButtons = activeTab.value?.tableButtons ?? defaultTableButtons;
        tableButtons.value = activeTableButtons.map((item) =>
            typeof item === "string" ? defaultTableOptionsConfig[item] : item
        );
    },
    {
        immediate: true,
    }
);



const setActiveTab = (target) => {
    activeTab.value = reactive(target);
};


const queryComponent= ref(null);
const tableComponent= ref(null);
const paginationComponent= ref(null);

defineExpose({
    activeTab: activeTab.value, // 当前激活的tab
    queryValue: queryValue.value, // 当前编辑区域值

    tableOptions: tableOptions.value, // 当前表格配置
    tableData: tableData.value, // 当前表格数据
    getTableData,

    onDetail, // 默认的点击详情事件，接收行数据
    onPut, // 默认的点击编辑事件，接收行数据
    onDelete, // 默认的点击删除事件，接收行数据

    setActiveTab, // 调整当前激活的tab

    queryComponent, // 搜索组件
    tableComponent, // 表格组件
    paginationComponent, // 分页器

    total: total.value, // 当前总数
    currentPage: currentPage.value, // 当前页码
    pageSize: pageSize.value, // 单页条数
    setPagination, // 调整页码/条数
});
</script>
<style lang='scss' scoped>
.tablePageWithCurd{
    height: 100%;
    width: 100%;
    flex: 1 1 auto;
    display: flex;
    .containerContent{
        flex: 1 1 auto;
        display: flex;
        .containerRight{
            display: flex;
            flex-direction: column;
            width: 100%;
            flex: 1 1 auto;
        }
    }
}
.EaconComponentsTablePageWithCurdTableButtons {
    display: flex;
    gap: 24px;
    .EaconComponentsButton {
        padding: 0;
        min-width: 0;
        height: 24px;
        line-height: 24px;
    }
}
</style>
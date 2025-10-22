<template>
    <Dialog
        ref="dialogComponent"
        v-model:visible="visible"
        :title
        :modal
        :modal-class="
            'TablePageWithCurdDialogModal ' +
            (modal ? '' : 'TablePageWithCurdDialogModalHidden')
        "
        v-bind="$attrs"
        @cancel="handleCloseDialog"
        @opened="handleLoaded"
    >
        <slot>
            <component
                ref="contentComponent"
                class="TablePageWithCurdDialogContent"
                :is
                v-model="value"
                :options
                v-bind="componentAttrs"
            ></component>
        </slot>
        <template #footer>
            <div class="TablePageWithCurdDialogFooterButtons">
                <div class="TablePageWithCurdDialogFooterButtonsRight">
                    <el-button @click="handleCloseDialog">取消</el-button>
                    <el-button
                        v-if="onPut &&(!activeTab?.hasPutRole || 
                            Boolean(activeTab?.hasPutRole(row)))"
                        type="primary"
                        v-EaSync="() => handlePut()"
                        >编辑</el-button>
                    <el-button
                        v-if="onConfirm"
                        type="primary"
                        v-EaSync="() => handleConfirm()"
                        >{{ confirmButtonText }}</el-button>
                </div>
            </div>
        </template>
    </Dialog>
</template>

<script setup >
import Dialog from '../Dialog/Dialog.vue'
import { onBeforeUnmount, ref } from 'vue';

const props = defineProps({
    activeTab: {
        type: Object,
    },
    title: {
        type: String,
        default: 'test'
    },
    is: {
        type: [String, Object],
    },
    options: {
        type: Array,
    },
    row: {
        type: Object,
    },
    confirmButtonText: {
        type: String,
        default: '确定'
    },
    componentAttrs: {
        type: Object,
    },
    disabledPageTab: Boolean,
    modal: Boolean,
    onConfirm: Function,
    onPut: Function,
    onDelete: Function,
    reOpen: Function,
    reOpen: Function,
    beforeClose: Function,
})

const value = defineModel();
const emit = defineEmits(['handleClose'])
const visible = defineModel("visible", { default: false });

const handleCloseDialog = () => emit("handleClose", "cancel");

const contentComponent = ref(null)

const handleConfirm = async () => {
    try {
        await contentComponent.value?.validate?.();
        await props.onConfirm?.(value.value ?? {});
        emit("handleClose", "confirm");
    } catch (e) {
        console.warn("表单校验失败", e);
    }
};
const handlePut = async () => {
    await props.onPut?.(props.row ?? {});
};
const handleDelete = async () => {
    await props.onDelete?.(props.row ?? {});
    emit("handleClose", "delete");
};


const includeClass = [
    "TablePageWithCurdDialogModal",
    "el-popper",
    "el-dialog",
    "ComponentsMessageBox",
];
const click = (e) => {
    const path = e.composedPath();
    const has = path.find((item) => {
        if (item instanceof Element) {
            return includeClass.some((className) =>
                item.className?.includes?.(className)
            );
        }
        return false;
    });
    if (has) return;
    handleCloseDialog();
};
const handleLoaded = () => {
    window.addEventListener("click", click, { capture: true });
};
onBeforeUnmount(() => {
    window.removeEventListener("click", click);
});

const dialogComponent = ref(null);
defineExpose({
    contentComponent,
    dialogComponent
});
</script>
<style lang='scss' scoped>
.TablePageWithCurdDialogFooterButtons{
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 18px;
    .TablePageWithCurdDialogFooterButtonsRight {
        display: flex;
        gap: 12px;
    }
}
</style>
<style lang='scss'>
.TablePageWithCurdDialogModal {
    height: 100%;
    .el-dialog{
        height: 720px;
        display: flex;
        flex-direction: column;
        .el-dialog__body{
            flex: 1 1 auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .ComponentsDialogContent{
                flex: 1 1 auto;
                .el-scrollbar__view{
                    height: 100%;
                }
            }
        }
    }
}
</style>
<template>
    <el-dialog
        :title
        :modal
        v-model="visible"
        ref="componentRef"
        v-bind="mergeProps($attrs, props)"
    >
        <div class="ComponentsDialogContent">
            <Scrollbar v-if="autoScroll">
                <slot name="default"></slot>
            </Scrollbar>
            <slot v-else name="default"></slot>
        </div>
        <div class="ComponentsDialogFooter">
            <slot name="footer">
            <div class="ComponentsDialogFooterButtons">
                <el-button @click="handleClose">{{ cancelText }}</el-button>
                <el-button  type="primary" @click="handleConfirm">
                    {{ confirmText }}
                </el-button>
            </div>
            </slot>
        </div>
    </el-dialog>
</template>

<script setup >
import { ref ,mergeProps} from 'vue';
import Scrollbar from '../Scrollbar/Scrollbar.vue'

const props = defineProps({
    confirmText:{
        type: String,
        default: '确定'
    },
    cancelText:{
        type: String,
        default: '取消'
    },
    autoScroll: {
        type: Boolean,
        default: true
    },
    title:{
        type: String,
        default: ''
    },
    modal:{
        type: Boolean,
        default: true
    },

    appendToBody: {
        type: Boolean,
        default: true
    },
    appendTo: {
        type: String,
        default: 'body'
    },
    lockScroll:{
        type: Boolean,
        default: true
    },
    closeOnClickModal: {
        type: Boolean,
        default: true
    },
    closeOnPressEscape: {
        type: Boolean,
        default: false
    },
    sizeType: {
        type: String,
        default: 'small'
    }
})

const emit = defineEmits(['confirm', 'cancel'])

const visible = defineModel("visible", { default: false });

const handleClose = () => {
    visible.value = false;
    emit("cancel");
};
const handleConfirm = () => emit("confirm");

const componentRef = ref(null);
defineExpose({
    componentRef,
    handleClose,
    handleConfirm,
});
</script>
<style lang='scss' scoped>
.ComponentsDialogFooter{
    display: flex;
    justify-content: flex-end;
    .TablePageWithCurdDialogFooterButtons{
        display: flex;
        flex-direction: row;
    }
}
</style>
<template>
    <div class="editor-container">
        <div ref="editorRef" class="editor" />
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import * as monaco from 'monaco-editor'

// 编辑器配置类型
interface EditorOptions extends monaco.editor.IStandaloneEditorConstructionOptions {
    value?: string
    language: string
}

interface IProps {
    option?: EditorOptions
}
const props = withDefaults(defineProps<IProps>(), {
    option: () => ({
        value: '',
        language: 'javascript',
        roundedSelection: false,
    })
})

const value = defineModel('model-value', {
    default: ''
})


// 编辑器容器引用
const editorRef = useTemplateRef('editorRef')
let editor = $shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null)

const init = () => {
    if (!editorRef.value) return
    editor = monaco.editor.create(
        editorRef.value,
        {
            theme: "vs-white",
            ...props.option,
            value: value.value,
        }
    )
    editor.onDidChangeModelContent(() => {
        value.value = editor?.getValue() || ''
    })
}

onMounted(() => {
    init()
})

watch(value, (newValue) => {
    if (!editor) return;
    newValue !== editor.getValue() && editor.setValue(newValue ?? "");

});
onUnmounted(() => {
    editor?.dispose?.()
})
</script>

<style scoped>
.editor-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;

    .editor {
        height: 100%;
    }
}
</style>

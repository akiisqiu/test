<template>
    <el-form
        :model="value"
        ref="componentRef"
        validate-on-rule-change
        :label-width="labelWidth"
        :inline="true"
        v-bind="attrs"
        @keydown.enter.native.prevent
        class="custom-form"
    >
        <template v-for="(option, idx) in options" :key="option.prop + idx">
            <el-form-item
                v-if="option.show?.(value, option, options) ?? true"
                :prop="option.prop"
                :label="showLabel ? option.label : undefined"
                v-bind="option.itemAttrs"
            >
                <component
                    :is="option?.is ?? 'ea-input'"
                    :form-value="value"
                    :disabled="option.disabled?.(value, option, options)"
                    clearable
                    filterable
                    validateEvent
                    :placeholder="defaultPlaceholder[(option?.is) ?? 'ea-input']"
                    v-model.trim="value[option.prop]"
                    v-bind="option.componentAttrs"
                    v-on="(() => getItemEvents(value, option))()"
                >
                </component>
            </el-form-item>
        </template>
        <el-form-item class="form-buttons" v-if="$slots.buttons">
            <slot name="buttons"></slot>
        </el-form-item>
    </el-form>
</template>

<script setup >
import { computed, ref ,watch,nextTick, provide} from 'vue';
import { getTextWidth } from "./dom";
import {defaultPlaceholder,findRequiredRules,setRequiredMessageToConfigs} from './form'



const props = defineProps({
    options: Array,
    attrs: Object,
    showLabel: {
        type: Boolean,
        default: true,
    },
    debug: Boolean,
});

const emit = defineEmits(["linkage", "nextTick"]);

const value = defineModel("modelValue", { default: {} })

const componentRef = ref(null)
provide("form", componentRef);

/**
 * 计算宽度
 */
let labelWidth = ref(0);

const computedLabelWidth = () => {
    nextTick(() => {
        const arr = props.options.map?.((item) => getTextWidth(item.label, "16px"));
        let max = Math.max(...arr);
        labelWidth.value = max + 12;
    });
};
watch(() => [props.options], computedLabelWidth, {
    immediate: true,
});

/**
 * 添加默认必填提示
 */
watch(value, () => componentRef.value?.clearValidate());

watch(
    () => props.options,
    () => setRequiredMessageToConfigs(props.options),
    {
        immediate: true,
    }
);

const getItemEvents = (val, option) => {
    const bindEvents = {
        linkage: () => linkage([option.prop]),
    };
    const componentEvents = option.componentEvents ?? {};
    Object.keys(componentEvents).forEach((event) => {
        bindEvents[event] = (e) => {
        if (!componentEvents?.[event]) return;
        componentEvents[event](val, option, e, linkage);
        };
    });

    if (!bindEvents.change) {
        bindEvents.change = bindEvents.linkage;
    } else {
        const change = bindEvents.change;
        bindEvents.change = (e) => {
        bindEvents.linkage(e);
        change(e);
        };
    }
    return bindEvents;
};

/**
 * 处理联动逻辑
 */
const { debug } = props;
const options = computed(() => props.options);
const optionsMapByField = computed(() =>
    options.value.reduce((l, i) => {
        l[i.prop] = i;
        return l;
    }, {} )
);
const dependsMap = computed(() =>
    options.value.reduce((l, i) => {
        if (!i.depends_on?.length) return l;
        i.depends_on.forEach((t) => {
        if (!l[t]) l[t] = [];
        l[t].push(i.prop);
        });
        return l;
    }, {} )
);

const triggerDependsOn = (fields, isInit) => {
    debug && console.info("FORM-依赖分析与排序完成，顺序=>", JSON.stringify(fields));
    const recursive = async (fs) => {
        if (!fs.length) {
            emit("nextTick");
            return;
        }

        const arr = fs.shift() ?? [];
        const pmList = arr.map?.((prop) => {
        const option = optionsMapByField.value[prop] ?? {};

        debug &&
            console.info(
                "FORM-执行依赖对应的副作用=>",
                prop,
                JSON.parse(JSON.stringify(option))
            );

        !isInit && option.reset?.(value.value, option, props.options, prop);
        return option
            .init?.(value.value, option, props.options, prop)
            ?.then((res) => {
                option.load?.(res, value.value, option, props.options, prop);
            });
        });
        await Promise.all(pmList);
        recursive(fs);
    };
    recursive(fields);
};

const linkage = (fields, isInit) => {
    debug &&
        console.info(
            "FORM-开始一次触发,更新这些字段的依赖=>",
            JSON.stringify(fields)
        );
    emit("linkage", value.value, fields);
    fields = [...new Set(fields)];
    if (!fields?.length) return;
    const target = [[...fields]];

    const map = fields.reduce((l, i) => {
        l[i] = target[0];
        return l;
    }, {});

    let queue = [...fields];

    while (queue.length) {
        const next = [];
        queue.forEach((f) => {
        dependsMap.value[f]?.forEach((item) => {
            if (map[item]) {
            const idx = map[item].indexOf(item);
            map[item].splice(idx, 1);
            }
            map[item] = next;
            next.push(item);
        });
        });
        next.length && target.push(next);
        queue = next;
    }

    triggerDependsOn(isInit ? target : target.slice(1), isInit);
};

// 对外暴露

const validate = () => componentRef.value?.validate?.();

const validateField = (key) => componentRef.value?.validateField?.(key);

const clearValidate = (fields) =>componentRef.value?.clearValidate?.(fields);

const initOptions = () => {
    const keys = options.value.map?.((item) => item.prop);
    linkage(keys, true);
    clearValidate();
};
watch(() => props.options, initOptions, {
    immediate: true,
});

defineExpose({
    componentRef: componentRef,
    validate,
    validateField,
    clearValidate,
});
</script>


<style lang="scss" scoped>

.custom-form {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;

    .form-buttons {
        margin-left: auto;
        display: flex;
        gap: 8px;
    }
}
</style>

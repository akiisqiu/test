
export const defaultPlaceholder = {
    "el-input": "请输入",
    "el-input-number": "请输入",
    "el-autocomplete": "请输入",

    "el-select": "请选择",
    "el-time-picker": "请选择",
    "el-date-picker": "请选择",
    "el-upload": "请选择",
    "el-tree-select": "请选择",
    "el-org-tree-select": "请选择",
    "el-radio-group": "请选择",
    "el-checkbox-group": "请选择",
    "el-cascader": "请选择",
};
    
    
export const findRequiredRules = (item) => {
    const rules = item.itemAttrs?.rules;
    if (Array.isArray(rules)) {
        return rules?.find?.((item) => item.required) ?? false;
    } else {
        return rules?.required ? rules : false;
    }
}
    
export const setRequiredMessageToConfigs = (requiredOptions) => {
requiredOptions.forEach((item) => {
    let requiredRule = findRequiredRules(item);
    if (!requiredRule || requiredRule.message) return
    const prefix = defaultPlaceholder[item?.is] ?? "请输入";
    requiredRule.message = prefix + item.label;
});
};
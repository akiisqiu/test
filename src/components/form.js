
export const defaultPlaceholder = {
    "ea-input": "请输入",
    "ea-input-number": "请输入",
    "ea-autocomplete": "请输入",

    "ea-select": "请选择",
    "ea-time-picker": "请选择",
    "ea-date-picker": "请选择",
    "ea-upload": "请选择",
    "ea-tree-select": "请选择",
    "ea-org-tree-select": "请选择",
    "ea-radio-group": "请选择",
    "ea-checkbox-group": "请选择",
    "ea-cascader": "请选择",
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
// 自定义对象序列化：将对象转为保留函数的字符
export const objectToString = (obj: Record<string, unknown>, indent = 4) => {
    // 基础缩进单位（空格）
    const space = ' '.repeat(indent);

    // 递归处理函数和嵌套对象
    const processValue = (value: unknown, currentIndent: string): string => {
        // 函数
        if (typeof value === 'function') {
            // 函数转为字符串（保留原始缩进）
            return value.toString()
                .split('\n')
                .map((line, i) => i === 0 ? line : currentIndent + line) // 对齐函数内部缩进
                .join('\n');
        }
        // 对象
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            // 嵌套对象递归处理
            const innerIndent = currentIndent + space;
            const entries = Object.entries(value).map(([k, v]) => {
                return `${innerIndent}${k}: ${processValue(v, innerIndent)}`;
            });
            return `{\n${entries.join(',\n')},\n${currentIndent}}`;
        }
        // 其他类型（数字、字符串、布尔等）用 JSON 序列化
        return JSON.stringify(value, null, 4);

    };

    // 处理顶层对象
    const entries = Object.entries(obj).map(([key, value]) => {
        return `${key}: ${processValue(value, space)}`;
    });
    return `{\n${entries.join(',\n')}\n}`;
}

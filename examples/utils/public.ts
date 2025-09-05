// 自定义对象序列化：将对象转为保留函数的字符
export const objectToString = (obj: Record<string, unknown>, indent = 4) => {
    // 基础缩进单位（空格）
    const space = ' '.repeat(indent);

    // 递归处理函数和嵌套对象
    const processValue = (value: unknown, currentIndent: string): unknown => {
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
        console.log('value', value);

        // return value
        return JSON.stringify(value, null, 4);

    };

    // 处理顶层对象
    const entries = Object.entries(obj).map(([key, value]) => {
        return `${key}: ${processValue(value, space)}`;
    });
    return `{\n${entries.join(',\n')}\n}`;
}


export const myStringify = (value: Record<string, unknown>, space: number = 4) => {
    // 用于检测循环引用
    const seen = new WeakSet();
    // 处理缩进参数
    let indentStr = '';
    // 基础缩进单位（空格）
    indentStr = ' '.repeat(space);
    // 生成指定层级的缩进
    function getIndent(level: number) {
        return indentStr ? '\n' + indentStr.repeat(level) : '';
    }

    function stringify(value: unknown, level = 1): unknown {
        if (typeof value === 'string') {
            return `"${value}"`
        }
        if (typeof value === 'number') {
            return `${value}`
        }
        if (typeof value === 'boolean') {
            return `${value}`
        }
        if (typeof value === 'function') {
            const indent = getIndent(1);
            console.log('value', value);
            let str = value.toString();
            let arr = str.split('\n')
            console.log('arr', arr);
            console.log('indent', indent.length);

            let arr1 = arr.map((line, i) => i === 0 ? line : indent + line)
            console.log('arr1', arr1);

            str = arr1.join('\n')

            // str = str.replace(/' '/g, '');
            // str = str.replace(/\n/g, '');
            // str = str.replace(/\n/g, `${indent}`);
            // console.log('value', str);
            return str;
            // return value.toString()
            // .split('\n')
            // .map((line, i) => i === 0 ? line : indent + line) // 对齐函数内部缩进
        }
        if (!value) {
            return 'null'
        }
        // 处理数组
        if (Array.isArray(value)) {
            if (seen.has(value)) {
                throw new TypeError('Converting circular structure to JSON');
            }
            seen.add(value);

            const elements = value.map(item => {
                // 数组中的undefined、函数等会被转为null
                if (item === undefined || typeof item === 'function' || typeof item === 'symbol') {
                    return 'null';
                }
                return stringify(item, level + 1);
            });

            seen.delete(value);

            // 处理数组的缩进
            if (elements.length === 0) {
                return '[]';
            }

            const indent = getIndent(level);
            const closingIndent = getIndent(level - 1);
            return `[${indent}${elements.join(`,` + indent)}${closingIndent}]`;
        }

        // 处理对象
        if (typeof value === 'object') {
            if (seen.has(value)) {
                throw new TypeError('Converting circular structure to JSON');
            }
            seen.add(value);

            const props = [];
            for (const key in value) {
                // 只处理可枚举属性
                if (value.hasOwnProperty(key)) {
                    const propValue = value[key];
                    // 函数和Symbol属性会被忽略
                    if (propValue === undefined || propValue === 'function' || typeof propValue === 'symbol') {
                        continue;
                    }
                    props.push(`${key}:${indentStr ? ' ' : ''}${stringify(propValue, level + 1)}`);
                }
            }

            seen.delete(value);

            // 处理对象的缩进
            if (props.length === 0) {
                return '{}';
            }

            const indent = getIndent(level);
            const closingIndent = getIndent(level - 1);
            console.log('props', props);

            return `{${indent}${props.join(`,` + indent)}${closingIndent}}`;
        }
    }

    return stringify(value);
}

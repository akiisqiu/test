/**
 * 判断一个值是否为 Record<string, unknown> 类型（运行时检查 + 类型守卫）
 * @param value 要检查的值
 * @returns 布尔值（同时告诉 TypeScript 类型）
 */
export const isRecord = (value: unknown): value is Record<string, unknown> => {
    // 1. 排除 null 和非对象类型
    if (value === null || typeof value !== 'object') {
        return false;
    }

    // 2. 排除数组（数组也是对象，但不属于 Record<string, unknown>）
    if (Array.isArray(value)) {
        return false;
    }

    // 3. 排除内置特殊对象（如 Date、RegExp 等）
    const constructorName = Object.prototype.toString.call(value);
    if (constructorName !== '[object Object]') {
        return false;
    }

    // 4. 检查所有自身属性的键是否都是 string 类型
    const keys = Reflect.ownKeys(value);
    return keys.every(key => typeof key === 'string');
}
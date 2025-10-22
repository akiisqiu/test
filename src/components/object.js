// export type Merge<T, U> = {
//   [K in keyof T | keyof U]: K extends keyof U
//   ? U[K] extends object
//   ? K extends keyof T
//   ? T[K] extends object
//   ? Merge<T[K], U[K]>
//   : U[K]
//   : U[K]
//   : U[K]
//   : K extends keyof T
//   ? T[K]
//   : never;
// };

// function isObject(value: any): value is Record<string, any> {
//   return value !== null && typeof value === 'object';
// }

// export function merge<T extends Record<string, any>, U extends Record<string, any>>(
//   target: T,
//   ...sources: (U | null | undefined)[]
// ): T & U {
//   if (!isObject(target)) return target;

//   sources.forEach(source => {
//     if (!isObject(source)) return;

//     Object.keys(source).forEach(key => {
//       const srcVal = source[key];
//       const tarVal = target[key];

//       if (Array.isArray(srcVal)) {
//         // 数组浅拷贝
//         (target as any)[key] = srcVal.slice();
//       } else if (isObject(srcVal)) {
//         // 对象递归合并
//         if (!tarVal || !isObject(tarVal)) {
//           (target as any)[key] = {};
//         }
//         merge(tarVal, srcVal);
//       } else {
//         // 基础值直接赋值
//         (target as any)[key] = srcVal;
//       }
//     });
//   });

//   return target as T & U;
// }

// export const isEqual = (obj1: Record<string, any>, obj2: Record<string, any>): boolean => {
//   const keys1 = Object.keys(obj1);
//   const keys2 = Object.keys(obj2);

//   if (keys1.length !== keys2.length) {
//     return false;
//   }

//   for (const key of keys1) {
//     const val1 = obj1[key];
//     const val2 = obj2[key];

//     const areObjects = isObject(val1) && isObject(val2);
//     if (
//       (areObjects && !isEqual(val1, val2)) ||
//       (!areObjects && val1 !== val2)
//     ) {
//       return false;
//     }
//   }

//   return true;
// }




function isObject(value) {
  return value !== null && typeof value === 'object';
}

export function merge(target, ...sources) {
  if (!isObject(target)) return target;

  sources.forEach(source => {
    if (!isObject(source)) return;

    Object.keys(source).forEach(key => {
      const srcVal = source[key];
      const tarVal = target[key];

      if (Array.isArray(srcVal)) {
        // 数组浅拷贝
        (target )[key] = srcVal.slice();
      } else if (isObject(srcVal)) {
        // 对象递归合并
        if (!tarVal || !isObject(tarVal)) {
          (target )[key] = {};
        }
        merge(tarVal, srcVal);
      } else {
        // 基础值直接赋值
        (target)[key] = srcVal;
      }
    });
  });

  return target;
}

export const isEqual = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !isEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

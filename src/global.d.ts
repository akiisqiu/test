import * as component from './components/index.ts'

declare module 'vue' {
    export interface GlobalComponents {
        EaEcharts: typeof component['Echarts'],
    }

    interface ComponentCustomProperties {
        // $message: typeof import('element-plus')['ElMessage']
    }
}


declare module 'vue' {
    interface ComponentCustomProperties {
    }
}

export type { }

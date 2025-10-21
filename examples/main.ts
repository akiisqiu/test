import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.ts'
import eacon from '../src/index.ts'
import eaconComponent from 'eacon-components'
import 'eacon-components/index.css'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
// 公共样式
import "@/styles/public.scss";
//图表主题色
import '../src/components/Echarts/theme.ts'
//rem转换
import '../src/utils/rem2px.ts';

const app = createApp(App)

app.use(router)
app.use(eacon)
app.use(eaconComponent)
app.use(ElementPlus);

app.mount('#app')

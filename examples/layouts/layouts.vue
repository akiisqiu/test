<template>
  <div class="layouts">
    <div class="layoutsHead">
      <EaLayoutHeader title="云控平台一体化组件库">
        <template #right>
          <ElMenu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false">
            <ElMenuItem v-for="item in menuList" :index="item.index" @click="routerPush(item.index)">{{item.label}}</ElMenuItem>
          </ElMenu>
          <EaButton plain class="theme" @click="handleChangeTheme">切换主题</EaButton>
        </template>
      </EaLayoutHeader>
    </div>
    <div class="layoutsContainer" >
      <EaMenu :data :defaultImage v-if="meta.menu !== false"></EaMenu>
      <div class="layoutsContent">
        <EaLogs v-if="meta.logs !== false"></EaLogs>
        <div class="layoutsContentWrapper">
          <RouterView />
        </div>
      </div>
    </div>
    <div class="waterFall">
      <template v-for="i in 10">
        <div v-for="j in 10" class="waterFallItem" :style="{ left: (i - 1) * 10 + '%', top: (j - 1) * 10 + '%' }">
          这是个水印
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import { ElMenu, ElMenuItem } from "element-plus";
import router, { routes } from "../router/index.ts";
import { watch } from "vue";

const data: any[] = routes;
console.log("🚀 ~ data:", data)

const route = useRoute();

const meta = $computed(() => route.meta);

let onOff = false;
const dom = document.querySelector("html");
if (dom) {
  dom.className = localStorage.getItem("theme") ?? "white";
}

const handleChangeTheme = () => {
  onOff = !onOff;
  if (!dom) return;
  dom.className = onOff ? "dark" : "white";
  localStorage.setItem("theme", dom.className);
  const arr = window.changeTheme ?? [];
  arr.forEach((fn) => fn(dom.className));
};

window.addEventListener("keydown", (e) => {
  e.code === "Tab" && handleChangeTheme();
});

const defaultImage = "";

let activeIndex = $ref('/')
const routerPush = (to: string) => {
  router.push(to);
};
watch(() => route.path, (newPath) => {
  if (newPath === '/') {
    activeIndex = '/';
  } else if (newPath.includes('echarts')) {
    activeIndex = 'echarts';
  } else if (newPath.includes('word')) {
    activeIndex = 'word';
  }
})
let menuList = [
  {label:'首页',index:'/',},
  {label:'文档',index:'word',},
  {label:'示例',index:'echarts',},
]
</script>

<style lang="scss"></style>

<style lang="scss" scoped>
.layouts {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  // color: var(--ea-text1);
  .layoutsHead {
    .el-menu-demo{
      background: var(--ea-fill2);
      height: 52px;
      .el-menu-item{
        &:hover{
          color: var(--ea-primary-text) !important;
        }
      }
      .is-active{
        color: var(--ea-primary-text) !important;
        border-bottom: 2px solid var(--ea-primary-text) !important;
      }
    }
  }

  .layoutsContainer {
    display: flex;
    padding: 14px;
    box-sizing: border-box;
    height: 100px;
    flex: 1 1 auto;
    .EaconComponentsMenuContainerOpen{
      margin-left:0;
    }

    .layoutsContent {
      width: 100px;
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;

      .EaconComponentsLogs {
        margin-bottom: 8px;
      }

      .layoutsContentWrapper {
        height: 100px;
        flex: 1 1 auto;
        // border-radius: 8px;
        // border: var(--ea-border);
        // border-color: var(--ea-line4);
        overflow: auto;

        &>div {
          height: 100%;
          background: var(--ea-fill2);
          box-sizing: border-box;
          overflow: auto;
        }
      }
    }
  }

  .waterFall {
    display: none;
    position: absolute;
    z-index: 9999;
    pointer-events: none;
    width: 100vw;
    height: 100vh;

    .waterFallItem {
      position: absolute;
      width: max-content;
      transform: rotate(30deg);
      color: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>

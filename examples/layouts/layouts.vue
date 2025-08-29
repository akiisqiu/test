<template>
  <div class="layouts">
    <div class="layoutsHead">
      <EaLayoutHeader title="云控平台一体化组件库">
        <template #right>
          <EaButton plain class="theme" @click="handleChangeTheme"
            >切换主题</EaButton
          >
        </template>
      </EaLayoutHeader>
    </div>
    <div class="layoutsContainer" :class="{ noMenu: meta.menu === false }">
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
        <div
          v-for="j in 10"
          class="waterFallItem"
          :style="{ left: (i - 1) * 10 + '%', top: (j - 1) * 10 + '%' }"
        >
          这是个水印
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import { routes } from "../router/index.ts";

const data: any[] = routes;

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
</script>

<style lang="scss"></style>

<style lang="scss" scoped>
.layouts {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  // color: var(--ea-text1);
  .layoutsHead {}

  .layoutsContainer {
    display: flex;
    padding: 14px;
    box-sizing: border-box;
    height: 100px;
    flex: 1 1 auto;
    padding-left: 0;

    &.noMenu {
      padding: 0;
      margin-top: 24px;

      .layoutsContent {
        .layoutsContentWrapper {
          border: none;
        }
      }
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
        border-radius: 8px;
        border: var(--ea-border);
        border-color: var(--ea-line4);
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

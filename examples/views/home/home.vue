<template>
  <div class="home">
    <div v-for="item in routes" class="home-group">
      <div class="home-group-title">
        {{ item.meta.title }}
      </div>
      <div class="home-group-content">
        <div
          v-for="child in item.children"
          class="home-group-content-item"
          @click="handleClick(child)"
        >
          <div class="home-group-content-item-label">
            {{ child.meta.title }}
          </div>
          <div class="home-group-content-item-content">
            {{
              "Ea" +
              child.name.slice(0, 1).toLocaleUpperCase() +
              child.name.slice(1)
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { routes } from "@/router/index.ts";

const router = useRouter();

const handleClick = (route: { path: string }) => {
  router.push(route.path);
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  .home-group {
    .home-group-title {
      font-size: 24px;
    }
    .home-group-content {
      margin-top: 12px;
      display: flex;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      .home-group-content-item {
        cursor: pointer;
        &:hover {
          box-shadow: var(--ea-popper-box-shadow);
        }
        .home-group-content-item-label {
          border: var(--ea-border);
          text-align: center;
          padding: 4px 12px;
        }
        .home-group-content-item-content {
          width: 100%;
          height: 130px;
          background: var(--ea-fill1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>

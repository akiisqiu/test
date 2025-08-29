<script setup lang="ts">
import { RouterView } from "vue-router";
window.changeTheme = new Set()
</script>

<template>
  <RouterView></RouterView>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>

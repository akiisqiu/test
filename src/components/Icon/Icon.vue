<template>
  <svg class="EaconComponents EaconComponentsIcon" :type aria-hidden="true">
    <use :xlink:href="`#${type}`"></use>
  </svg>
</template>

<script setup lang="ts">
// TODO: 穷举一下图标名称，用来给ts提示
type IProps = {
  type: string;
};
const { type = "icon-a-logoA" } = defineProps<IProps>();
</script>

<style lang="scss" scoped>
.EaconComponentsIcon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  color: unset;
  &:focus {
    outline: none;
  }
}
</style>

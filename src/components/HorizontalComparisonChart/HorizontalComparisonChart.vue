<script setup lang="ts">
interface IProps {
    leftValue: number,
    rightValue: number,
    colors: string[]
}

const props = withDefaults(defineProps<IProps>(), {
    leftValue:0,
    rightValue:0,
    colors: ()=>['rgba(231, 189, 125, 1)', 'rgba(110, 243, 102, 1)']
})

//左右侧颜色
const leftColor = props.colors[0]
const rightColor = props.colors[1]

</script>

<template>
    <div class="EaconComponents EaconComponentsHorizontalComparisonChart">
        <div
            class="EaconComponentsHorizontalComparisonChartItem left"
            :style="{ width: (props.leftValue / (props.leftValue + props.rightValue)) * 100 + '%' }"
        ></div>
        <div
            class="EaconComponentsHorizontalComparisonChartItem right"
            :style="{ width: (props.rightValue / (props.leftValue + props.rightValue)) * 100 + '%' }"
        ></div>
    </div>
</template>

<style lang="scss" scoped>
.EaconComponentsHorizontalComparisonChart {
    display: flex;
    height: .75rem;
    gap: 0.25rem;
    .EaconComponentsHorizontalComparisonChartItem {
        height: 100%;
        border-radius: 1.375rem;
    }
    .left {
        background: v-bind(leftColor);
    }
    .right {
        background: v-bind(rightColor);
    }
}
</style>

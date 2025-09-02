<script setup lang="ts">
interface IProps {
    leftValue: number,
    leftTitle: string,
    rightValue: number,
    rightTitle: string,
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

const tooltip = $computed(() => {
    return `${props?.leftTitle}: ${props?.leftValue?? '-'} ${props?.rightTitle}: ${props?.rightValue?? '-'} `
});
</script>

<template>
    <div v-EaTooltip="tooltip" class="ComparisonTips">
        <div class="ComparisonTipsTitle">
            <div class="ComparisonTipsTitleLeft">
                <div class="ComparisonTipsLabel">
                    {{ leftTitle }}
                </div>
                <div class="ComparisonTipsValue">
                    {{ leftValue }}
                </div>
            </div>
            <div class="ComparisonTipsRight">
                <div class="ComparisonTipsLabel">
                    {{ rightTitle }}
                </div>
                <div class="ComparisonTipsValue">
                    {{ rightValue }}
                </div>
            </div>
        </div>
        <!--插槽提示-->
        <slot></slot>
    </div>
</template>

<style lang='scss' scoped>
.ComparisonTips {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    .ComparisonTipsTitle {
        display: flex;
        justify-content: space-between;
        .ComparisonTipsTitleLeft,
        .ComparisonTipsRight {
            display: flex;
            align-items: center;
            gap: 0.4rem; 
        }
        .ComparisonTipsTitleLeft {
            --bgc: v-bind(leftColor);
        }
        .ComparisonTipsRight {
            // --bgc: var(--electricity-color);
            --bgc:  v-bind(rightColor);
        }
        .ComparisonTipsLabel {
            font-size: .875rem;
            display: flex;
            align-items: center;
            gap: 0.6rem; 
            &:before {
                content: "";
                display: block;
                width: 0.75rem; /* 0.75rem */
                height: 0.75rem; /* 0.75rem */
                border-radius:0.13rem; /* 0.13rem */
                background: var(--bgc);
            }
        }
        .ComparisonTipsValue {
            font-size: 1.125rem; /* 1.75rem */
            line-height: 1;
        }
    }
}
</style>
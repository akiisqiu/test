<script setup lang="ts">
import { nextTick, onBeforeUnmount, watch } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, FreeMode, Mousewheel } from 'swiper/modules';
import { getTextWidth } from 'eacon-components'

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/mousewheel';
import 'swiper/css/free-mode';
import { lookup } from 'dns';

interface LoopChartProps {
    title?: string,
    units?: string,
    x:string[],
    y:number[],
    option?:IObject,
    unit?:string,
    fontSize?:string,
}

const props = withDefaults(defineProps<LoopChartProps>(), {
    x: () => [],
    y: () => [],
    fontSize:'0.88rem'
})

const swiperOptions = $computed(() => ({
    modules: [Autoplay, FreeMode, Mousewheel],
    //设置slider容器能够同时显示的slides数量number or auto
    "slides-per-view": 6,
    loop: props.x.length > 6,
    direction: 'vertical',
    freeMode: {
        enable: false,
    },
    spaceBetween: 6,
    scrollbar: {
        draggable: false
    },
    mousewheel: {
        forceToAxis: true
    },
    effect: 'flip',
    speed: 1500,
    autoplay: {
        enable: true,
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
    },
    ...props.option
}))


let isInit = $ref(false)

watch(() => props.y, () => {
    isInit = false
    nextTick(() => {
        isInit = true
    })
}, {
    immediate: true
})

let i = $ref(0)
const getWidth = (arr) => {
    let max = 0
    i;
    arr.forEach((label) => {
        const item = getTextWidth(label, props.fontSize) + getTextWidth(props.unit, props.fontSize)
        max = Math.max(max, item)
    })
    return max + 'px'
}
let maxXLength = $computed(() => getWidth(props.x))
let maxYLength = $computed(() => getWidth(props.y))

const maxValue = $computed(() => Math.max(...(props.y)))

const resize = () => i++
window.addEventListener('resize', resize)
onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
})

let swiperInstance = null
let nowIdx = 0
const onSwiper = (swiper) => {
    swiperInstance = swiper
}


//鼠标移入
const handleMouseEnter = () => {
    swiperInstance.autoplay.stop()
}
//鼠标离开
const handleMouseLeave = () => {
    swiperInstance.slideToLoop(nowIdx, 0)
    swiperInstance.autoplay.start()
}

const onChange = (e) => {
    nowIdx = e.realIndex
}


//点击
const emit = defineEmits(['clickY'])
const clickY = (item:String) => {
    emit('clickY',item)
}
</script>

<template>
    <div class="EaconComponentsLoopHorizontalBarChart">
        <div class="EaconComponentsLoopHorizontalBarChartHeader">
            <div class="EaconComponentsLoopHorizontalBarChartTitle">{{ props.title }}</div>
            <div class="EaconComponentsLoopHorizontalBarChartUnits">{{ props.units }}</div>
        </div>
        <div class="EaconComponentsLoopHorizontalBarChartContent" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
            <Swiper v-if="isInit" v-bind="swiperOptions"
                @swiper="onSwiper" @slideChange="onChange">
                <SwiperSlide v-for="(label, idx) in x" :key="idx">
                    <div class="EaconComponentsLoopHorizontalBarChartBar" @click="clickY(label)">
                        <div
                        class="EaconComponentsLoopHorizontalBarChartLabel" :style="{ width: maxXLength }">
                            {{ label }}
                        </div>
                        <div class="EaconComponentsLoopHorizontalBarChartBarContent">
                            <div class="EaconComponentsLoopHorizontalBarChartInner" :style="{ width: !maxValue ? 0 : `${y[idx] / maxValue * 100}%` }"></div>
                        </div>
                        <div class="EaconComponentsLoopHorizontalBarChartBarValue"  :style="{ width: maxYLength }">
                            {{ y[idx] }}{{ unit }}
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.EaconComponentsLoopHorizontalBarChart {
    display: flex;
    height: 100%;
    flex-direction: column;
    user-select: none;

    .EaconComponentsLoopHorizontalBarChartHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .EaconComponentsLoopHorizontalBarChartTitle {
            font-size: 1.13rem;
        }

        .EaconComponentsLoopHorizontalBarChartUnits {
            font-size: 0.88rem;
            color: #8F9FB3;
        }
    }

    .EaconComponentsLoopHorizontalBarChartContent {
        flex: 1 1 auto;
        height: 100%;
        overflow: hidden;

        .swiper {
            width: 100%;
            height: 100%;

            &:deep(.swiper-wrapper) {
                transition-timing-function: linear;
            }
        }

        .EaconComponentsLoopHorizontalBarChartBar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;
            width: 100%;
            color: #D2D2ED;
            font-size: .88rem;
            gap: .5rem;
            cursor: pointer;

            .EaconComponentsLoopHorizontalBarChartBarContent {
                position: relative;
                width: 1%;
                flex: 1 1 auto;
                background: rgba(180, 180, 180, 0.2);
                height: .5rem;
                border-radius: .25rem;
                overflow: hidden;

                .EaconComponentsLoopHorizontalBarChartInner {
                    height: 100%;
                    min-width: .25rem;
                    background: linear-gradient(to left, #9DF5E2, #70A8F5);
                    transition: .2s;
                    border-radius: .25rem;
                }
            }


            .EaconComponentsLoopHorizontalBarChartLabel,
            .EaconComponentsLoopHorizontalBarChartBarValue {
                white-space: nowrap;
            }
        }
    }
}
</style>

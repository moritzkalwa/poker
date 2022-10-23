<script setup lang="ts">
import { toRefs, watch, ref } from "vue"

const props = defineProps<{
    showFront: boolean,
}>()

const { showFront } = toRefs(props)

const animateShowFront = ref(false)
const animateShowBack = ref(false)

watch(showFront, () => {
    animateShowFront.value = showFront.value
    animateShowBack.value = !showFront.value
})
</script>


<template>
    <div class="card" :class="{
        animateShowFront,
        animateShowBack,
        showFront,
        showBack: !showFront
    }"
    >
        <img class="back" src="/cards/back-red.png">
        <img class="front" src="/cards/heart_queen.png">
    </div>
</template>

<style lang="scss" scoped>
.card {
    margin: 3px;
    width: 4vw;
    height: calc(4vw / 0.68);
    position: relative;
    &>* {
        width: 4vw;
        height: calc(4vw / 0.68);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    &.showFront {
        &>.front {
            width: 4vw;
        }
        &>.back {
            width: 0vw;
        }
    }
    &.showBack {
        &>.front {
            width: 0vw;
        }
        &>.back {
            width: 4vw;
        }
    }
    &.animateShowFront {
        &>.front {
            animation: show 0.5s forwards;
        }
        &>.back {
            animation: hide 0.5s forwards;
        }
    }
    &.animateShowBack {
        &>.front {
            animation: hide 0.5s forwards;
        }
        &>.back {
            animation: show 0.5s forwards;
        }
    }
}
@keyframes hide {
    0% {width: 4vw;}
    50%  {width: 0vw;}
    100% {width: 0vw;}
}
@keyframes show {
    0% {width: 0vw;}
    50%  {width: 0vw;}
    100% {width: 4vw;}
}
</style>
<script setup lang="ts">
import Card from "@/components/Card.vue"

import { ref, toRefs, inject } from "vue"
import type Poker from "../../poker"

const poker = inject<Poker>('poker')

poker?.pokerHandler.on('newCards', () => {
    setTimeout(() => {
        shuffle.value = true
        setTimeout(() => {
            shuffle.value = false
            setTimeout(() => poker.pokerHandler.emit('dispatchNewCards'), 500)
        }, 900)
    }, Math.max(poker.state.value.members.length*250 + 500, 1750))
})

const shuffle = ref(false)
</script>


<template>
    <div class="deck" :class="{ shuffle }">
        <Card :showFront="false"/>
        <Card :showFront="false"/>
        <Card :showFront="false"/>
        <Card :showFront="false"/>
        <Card :showFront="false"/>
        <Card :showFront="false"/>
    </div>
</template>

<style lang="scss" scoped>
.deck {
    position: absolute;
    display: flex;
    top: 50%;
    left: 50%;
    transform: translate(275%, -50%);
    z-index: 2;
    &>*:not(:first-child) {
        position: absolute;
    }
    &>* {
        &:nth-child(2) {
            transform: translateX(3px);
        }
        &:nth-child(3) {
            transform: translateX(6px);
        }
        &:nth-child(4) {
            transform: translateX(6px);
        }
        &:nth-child(5) {
            transform: translateX(6px);
        }
        &:nth-child(6) {
            transform: translateX(9px);
        }
    }
    &.shuffle {
        &>*:nth-child(3) {
            animation: shuffle 0.3s infinite forwards;
        }
    }
}

@keyframes shuffle {
    0% {transform: translate(6px, 0%)}
    40%  {transform: translate(calc(6px + 100%), 0%)}
    60%  {transform: translate(calc(6px + 100%), 0%)}
    100% {transform: translate(6px, 0%)}
}
</style>
<script setup lang="ts">
import Card from "@/components/Card.vue"
</script>


<template>
    <div class="deck">
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
            animation: shuffle 0.3s infinite;
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
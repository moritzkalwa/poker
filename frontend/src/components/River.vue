<script setup lang="ts">
import { ref } from "vue"

import Card from "@/components/Card.vue"

const showFront = ref(false)
const hidden = ref(false)
</script>

<template>
    <div class="river" @click="hidden = !hidden">
        <div :class="{ hidden }" class="river-card" v-for="i in Array(5).keys()">
            <Card :showFront="showFront"/>
        </div>
    </div>
</template>

<style scoped lang="scss">
.river {
    &>.river-card {
      position: absolute;
      display: flex;
      transition: transform 0.5s ease;
      &.hidden {
        transform: translate(275%, -50%) !important;
      }
      &:nth-child(1) {
        top: 50%;
        left: 50%;
        transform: translate(-250%, -50%);
      }
      &:nth-child(2) {
        top: 50%;
        left: 50%;
        transform: translate(-150%, -50%);
      }
      &:nth-child(3) {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      &:nth-child(4) {
        top: 50%;
        left: 50%;
        transform: translate(50%, -50%);
      }
      &:nth-child(5) {
        top: 50%;
        left: 50%;
        transform: translate(150%, -50%);
      }
    }
}
</style>
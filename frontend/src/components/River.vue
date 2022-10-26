<script setup lang="ts">
import { ref, reactive, inject, computed } from "vue"
import type Poker from "../../poker"
import { stagger } from "../../util"

import Card from "@/components/Card.vue"

const highlighted = ref([false, false, false, false, false])

const showFront = computed(() => {
  if (poker?.state.value.roundState === 0) return 0
  if (poker?.state.value.roundState === 1) return 3
  if (poker?.state.value.roundState === 2) return 4
  if (poker?.state.value.roundState === 3) return 5
  if (poker?.state.value.roundState === 4) return 5
  return 0
})
const hidden = reactive(Array(5).fill(false))

const poker = inject<Poker>('poker')

poker?.pokerHandler.on('newCards', () => {
  stagger([
    () => hidden[4] = true,
    () => hidden[3] = true,
    () => hidden[2] = true,
    () => hidden[1] = true,
    () => hidden[0] = true
  ], 250)
})

poker?.pokerHandler.on('dispatchNewCards', () => {
  stagger([
    () => hidden[2] = false,
    () => hidden[1] = false,
    () => hidden[0] = false
  ], 250)
})

poker?.pokerHandler.on('announceWinner', (result) => {
    highlighted.value = [
        result.handWorth.cardIndeces.includes(0),
        result.handWorth.cardIndeces.includes(1),
        result.handWorth.cardIndeces.includes(2),
        result.handWorth.cardIndeces.includes(3),
        result.handWorth.cardIndeces.includes(4)
    ]
})

poker?.pokerHandler.on('turn', () => {
  hidden[3] = false
})

poker?.pokerHandler.on('river', () => {
  hidden[4] = false
})

const cards = computed(() => poker?.state.value.cards)
</script>

<template>
    <div class="river">
        <div :class="{ hidden: hidden[i] }" class="river-card" v-for="i in Array(5).keys()">
            <Card :showFront="showFront > i" :face="cards?.at(i)?.face" :value="cards?.at(i)?.value" :highlighted="highlighted[i]"/>
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
      &:nth-child(5) {
        top: 50%;
        left: 50%;
        transform: translate(-250%, -50%);
      }
      &:nth-child(4) {
        top: 50%;
        left: 50%;
        transform: translate(-150%, -50%);
      }
      &:nth-child(3) {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      &:nth-child(2) {
        top: 50%;
        left: 50%;
        transform: translate(50%, -50%);
      }
      &:nth-child(1) {
        top: 50%;
        left: 50%;
        transform: translate(150%, -50%);
      }
    }
}
</style>
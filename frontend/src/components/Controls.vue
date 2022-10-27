<script setup lang="ts">
import ChipDisplay from './ChipDisplay.vue';
import type Poker from "../../poker"

import { inject, computed } from "vue"

const poker = inject<Poker>('poker')
const player = computed(() => poker?.state.value.members.find((member) => member.id === poker.ownId))

const canBet = computed(() => (poker?.selectedAmount.value ?? 1) + (player.value?.roundBet ?? 0) > (poker?.state.value.currentBet ?? 0));
(document as any).canBet = canBet
const bet = () => {
  if (canBet.value)
  poker?.playerAction('bet')
}

const callAction = computed(() => {
  if (poker?.state.value.currentBet === player.value?.roundBet) return 'Check'
  if ((poker?.state.value.currentBet ?? 0)  - (player.value?.roundBet ?? 0) >= (player.value?.budget ?? 0)) return 'All In'
  return 'Call'
})
const callCheck = () => {
  poker?.playerAction('call')
}

const fold = () => {
  poker?.playerAction('fold')
}

</script>

<template>
    <div id="controls">
        <div class="chip-display-wrapper">
          <ChipDisplay />
        </div>
        <div class="round-controls">
          <button :class="{ active: canBet}" @click="bet">Bet</button>
          <button class="active" @click="callCheck">{{callAction}}</button>
          <button class="active" @click="fold">Fold</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
#controls {
  margin: auto;
  display: flex;
  border-radius: 30px;
  align-items: center;
  width: 75vw;
  height: 10vh;
  background: green;
  box-shadow: 0px 5px 20px 8px #000000;
  padding: 0px 10px;
}
.chip-display-wrapper {
  align-items: center;
  display: flex;
  margin-left: 0;
  margin-right: auto;
}
.round-controls {
  align-items: center;
  display: flex;
  margin-left: auto;
  margin-right: 0;
  width: 100%;
  max-width: 30vw;
  transition: max-width 0.5s ease;
  &>button {
    margin: 5px;
    padding: 0.6rem 1.8rem;
    background-color: brown;
    border-radius: 30px;
    flex-grow: 1;
    &.active {
      cursor: pointer;
    }
  }
}
</style>
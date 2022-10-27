<script setup lang="ts">
import Chip from "@/components/Chip.vue"
import { amountToChips } from "../../util";
import type Poker from "../../poker"

import { computed, watch, ref, inject } from 'vue';

const poker = inject<Poker>('poker')

const amount = poker!.budget
const selectedAmount = poker!.selectedAmount

const chips = computed(() => amountToChips(amount.value))

const selectedReds = ref(0)
const selectedBlues = ref(0)
const selectedBlacks = ref(0)
const selectedWhites = ref(0)

poker?.pokerHandler.on('playerAction', () => {
    selectedReds.value = 0
    selectedBlues.value = 0
    selectedBlacks.value = 0
    selectedWhites.value = 0
})

watch([selectedReds, selectedBlues, selectedBlacks, selectedWhites], () => {
    selectedAmount.value = Math.min(selectedReds.value * 25 + selectedBlues.value * 50 + selectedBlacks.value * 100 + selectedWhites.value * 500, amount.value)
})

const select = (index: number, value: 25 | 50 | 100 | 500) => {
    let selected
    switch (value) {
        case 25:
            selected = selectedReds
        break;
        case 50:
            selected = selectedBlues
        break;
        case 100:
            selected = selectedBlacks
        break;
        case 500:
            selected = selectedWhites
        break;
    }
    if (selected.value === 1 && index === 0) {
        selected.value = 0
    } else {
        selected.value = index + 1
    }
}
</script>

<template>
    <div class="chip-display">
        <div class="reds">
            <Chip 
                v-for="i in Array(chips[0]).keys()"
                :class="{selected: i < selectedReds, firstNot: i === selectedReds}" 
                :value="25" 
                @click="select(i, 25)"
            />
        </div>
        <div class="blues">
            <Chip 
                v-for="i in Array(chips[1]).keys()" 
                :class="{selected: i < selectedBlues, firstNot: i === selectedBlues}" 
                :value="50" 
                @click="select(i, 50)"
            />
        </div>
        <div class="blacks">
            <Chip 
                v-for="i in Array(chips[2]).keys()"
                :class="{selected: i < selectedBlacks, firstNot: i === selectedBlacks}" 
                :value="100" 
                @click="select(i, 100)"
            />
        </div>
        <div class="whites" >
             <Chip 
                v-for="i in Array(chips[3]).keys()" 
                :class="{selected: i < selectedWhites, firstNot: i === selectedWhites}" 
                :value="500" 
                @click="select(i, 500)"
             />
        </div>
    </div>
    <div>
        {{selectedAmount}}$
    </div>
</template>

<style scoped lang="scss">
.chip-display {
    display: flex;
    align-items: center;
    height: 100%;
    &>* {
        display: flex;
        height: 50px;
        margin-right: 12.5px;
        &>.chip {
            cursor: pointer;
            transition: margin 0.5s ease;
            &:not(:first-child) {
                margin-left: calc(-50px / 4 * 3);
            }
            &.firstNot:not(:first-child) {
                margin-left: calc(-50px / 4 * 3 + 25px)
            }
            &.selected {
                box-shadow: 0px 0px 5px 3px #EFFF20;
            }
        }
    }
}
</style>
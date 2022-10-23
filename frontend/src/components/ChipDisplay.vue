<script setup lang="ts">
import Chip from "@/components/Chip.vue"
import { amountToChips } from "../../util";

import { toRefs, computed, ref } from 'vue';

const props = defineProps<{
    amount: number
}>()

const { amount } = toRefs(props)

const chips = computed(() => amountToChips(amount.value))

const selectedAmount = computed(() => {
    return Math.min(selectedReds.value * 25 + selectedBlues.value * 50 + selectedBlacks.value * 100 + selectedWhites.value * 500, amount.value)
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

const selectedReds = ref(3)
const selectedBlues = ref(0)
const selectedBlacks = ref(0)
const selectedWhites = ref(0)
</script>

<template>
    <div class="chip-display">
        <div class="reds">
            <Chip 
                v-for="i in Array(chips[0]).keys()" 
                :style="{'--index': i}" 
                :class="{selected: i < selectedReds}" 
                :value="25" 
                @click="select(i, 25)"
            />
        </div>
        <div class="blues" :style="{'--amount': chips[0]} as any">
            <Chip 
                v-for="i in Array(chips[1]).keys()" 
                :style="{'--index': i}" 
                :class="{selected: i < selectedBlues}" 
                :value="50" 
                @click="select(i, 50)"
            />
        </div>
        <div class="blacks" :style="{'--amount': chips[0] + chips[1]} as any">
            <Chip 
                v-for="i in Array(chips[2]).keys()" 
                :style="{'--index': i}" 
                :class="{selected: i < selectedBlacks}" 
                :value="100" 
                @click="select(i, 100)"
            />
        </div>
        <div class="whites" :style="{'--amount': chips[0] + chips[1] + chips[2]} as any">
             <Chip 
                v-for="i in Array(chips[3]).keys()" 
                :style="{'--index': i}" 
                :class="{selected: i < selectedWhites}" 
                :value="500" 
                @click="select(i, 500)"
             />
        </div>
    </div>
    <div>
        {{selectedAmount}}
    </div>
</template>

<style scoped lang="scss">
.chip-display {
    display: flex;
    align-items: center;
    height: 100%;
    width: v-bind("`${(chips[0] + chips[1] + chips[2] + chips[3]) * 10 + chips.filter((a) => a != 0).length * 50 }px`");
    padding: 0px 3px;
    &>* {
        display: flex;
        position: relative;
        height: 50px;
        &:nth-child(2) {
            left: calc(var(--amount) * 10px + 50px);
        }
        &:nth-child(3) {
            left: calc(var(--amount) * 10px + 100px);
        }
        &:nth-child(4) {
            left: calc(var(--amount) * 10px + 150px);
        }
        &>.chip {
            position: absolute;
            left: calc(var(--index) * 10px);
            cursor: pointer;
            &.selected {
                box-shadow: 0px 0px 5px 3px #EFFF20;
            }
        }
    }
}
</style>
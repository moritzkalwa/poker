<script setup lang="ts">
import ChipDisplay from './ChipDisplay.vue';
import type Poker from "../../poker"

import { inject, computed } from "vue"

const poker = inject<Poker>('poker')
const players = computed(() => poker?.state.value.members)

</script>

<template>
    <div id="sheet">
        <h2>Betting sheet</h2>
        <TransitionGroup name="list" tag="ul">
            <li v-for="player in players?.sort((a, b) => b.budget - a.budget)" :key="player.id">
                <h3>{{player.name}}</h3>
                <h3>{{player.budget}}$</h3>
            </li>
        </TransitionGroup>
    </div>
</template>

<style scoped lang="scss">
#sheet {
    margin: auto;
    display: flex;
    flex-direction: column;
    border-radius: 30px;
    position: absolute;
    text-align: center;
    left: 10px;
    top: 10px;
    width: 10vw;
    box-shadow: 0px 5px 20px 8px #000000;
    padding: 20px;
    background-image: url("/parchment.png");
    background-size: 100% 100%;
    &>h2 {
        color: black;
        font-family: 'Dancing Script', cursive;
    }
    &>ul>li {
        display: flex;
        &>h3 {
        color: black;
        font-family: 'Dancing Script', cursive;
        margin-left: auto;
        margin-right: 0px;
        &:first-child {
            margin-right: auto;
            margin-left: 0px;
        }
    }
    }
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
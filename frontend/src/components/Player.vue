<script setup lang="ts">
import Card from "@/components/Card.vue"

import { ref, toRefs, inject } from "vue"
import type Poker from "../../poker"

const props = defineProps<{
    id: string
}>()

const showFront = ref(false)

const poker = inject<Poker>('poker')

const player = poker?.state.value.members.find((member) => member.id === props.id)
</script>

<template>
    <div class="player"
    @click="showFront = !showFront">
        <div class="player-cards">
            <Card :showFront="showFront"/>
            <Card :showFront="showFront"/>
        </div>
        <div class="player-info">
            <img src="/player.png">
            <div class="player-info-text">
                <span class="player-info-name">{{player?.name}}</span>
                <span class="player-info-money">150€</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.player-cards {
    display: flex;
}
.player-info {
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    &>img {
        border-radius: 50%;
        border: 5px solid black;
        width: 8vmin;
        height: 8vmin;
        background-color: white;
        z-index: 2;
    }
}
.player-info-text {
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    overflow: hidden;
    white-space: nowrap;
    position: absolute;
    margin-right: 4vw;
    &>.player-info-name {
        height: 50%;
        background-color: black;
        padding: 5px;
        padding-right: 2vw;
    }
    &>.player-info-money {
        height: 50%;
        background-color: grey;
        padding: 5px;
        padding-right: 2vw;
    }
}
.player {
    position: absolute;
    display: flex;
    transform: translate(-50%, -50%);
    align-items: center;
    &:nth-child(3) {
        top: 50%;
        left: 90%;
        &>.player-info {
            transform: translate(15vw, 0vh);
        }
    }
    &:nth-child(5) {
        top: 85%;
        left: 30%;
        &>.player-info {
            transform: translate(4vw, 10vh)
        }
    }
    &:nth-child(4) {
        top: 85%;
        left: 70%;
        &>.player-info {
            transform: translate(4vw, 10vh)
        }
    }
    &:nth-child(6) {
        top: 50%;
        left: 10%;
        &>.player-info {
            transform: translate(-6vw, 0vh);
        }
    }
    &:nth-child(1) {
        top: 15%;
        left: 30%;
        &>.player-info {
            transform: translate(4vw, -10vh)
        }
    }
    &:nth-child(2) {
        top: 15%;
        left: 70%;
        &>.player-info {
            transform: translate(4vw, -10vh)
        }
    }
}
</style>
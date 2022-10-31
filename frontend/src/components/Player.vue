<script setup lang="ts">
import Card from "@/components/Card.vue"

import { ref, toRefs, inject, computed, watch } from "vue"
import type Poker from "../../poker"

const props = defineProps<{
    id: string
}>()

const showFront = computed(() => poker?.state.value.roundState == 4 || props.id === poker?.ownId)

const poker = inject<Poker>('poker')

const highlighted = ref([false, false])

poker?.pokerHandler.on('newCards', () => {
    setTimeout(() => {
        cardsHidden.value = true
        highlighted.value = [false, false]
    }, (playerIndex.value ?? 0)*250)
})

poker?.pokerHandler.on('dispatchNewCards', () => {
    setTimeout(() => {
        cardsHidden.value = false
    }, (playerIndex.value ?? 0)*250)
})

poker?.pokerHandler.on('fold', (id: string) => {
    if (player.value?.id === id) cardsHidden.value = true
})

poker?.pokerHandler.on('announceWinner', (result) => {
    if (result.id !== player.value?.id) return
    highlighted.value = [
        result.handWorth.cardIndeces.includes(5),
        result.handWorth.cardIndeces.includes(6)
    ]
})

const player = computed(() => poker?.state.value.members.find((member) => member.id === props.id))
const cards = computed(() => player.value?.cards)
const playerIndex = computed(() => poker?.state.value.members.findIndex((member) => member.id === props.id))
const playingMember = computed(() => player.value!.id === poker?.state.value.playingMemberId)
const bigBlind = computed(() => player.value!.id === poker?.state.value.bigBlindId)
const smallBlind = computed(() => player.value!.id === poker?.state.value.smallBlindId)

const cardsHidden = ref(!player.value?.playing ?? true)
</script>

<template>
    <div class="player-cards"
    :data-index="playerIndex"
    :class="{cardsHidden}"
    >
        <Card :showFront="showFront" :face="cards?.at(0)?.face" :value="cards?.at(0)?.value" :highlighted="highlighted[0]"/>
        <Card :showFront="showFront" :face="cards?.at(1)?.face" :value="cards?.at(1)?.value" :highlighted="highlighted[1]" />
    </div>
    <div class="player"
    :data-index="playerIndex"
    >
        <div class="player-info"
            :class="{ playingMember, bigBlind, smallBlind }"
        >
            <img src="/player.png">
            <div class="player-info-text">
                <span class="player-info-name">{{player?.name}}</span>
                <span class="player-info-money">{{player?.bet}}$</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.player-info {
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    &.bigBlind:after {
        content: "";
        width: 8vmin;
        height: 8vmin;
        border: 5px dashed blue;
        position: absolute;
        z-index: 3;
        border-radius: 50%;
    }
    &.smallBlind:after {
        content: "";
        width: 8vmin;
        height: 8vmin;
        border: 5px dashed yellow;
        position: absolute;
        z-index: 3;
        border-radius: 50%;
    }
    &.playingMember:after {
        animation: rotate 10s infinite linear;
    }
    &.playingMember>img {
        border-color: red;
    }
    &>img {
        border-radius: 50%;
        border: 5px solid black;
        width: 8vmin;
        height: 8vmin;
        background-color: white;
        z-index: 2;
    }
}

@keyframes rotate {
    0% {transform: rotate(0deg);}
    100% {transform: rotate(360deg)}
}
.player-info-text {
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    overflow: hidden;
    white-space: nowrap;
    min-width:max-content;
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
.player-cards {
    position: absolute;
    display: flex;
    transition: all 0.5s ease;
    &>* {
        transition: all 0.5s ease;
    }
    z-index: 1;
    transform: translateY(-50%);
    &.cardsHidden {
        top: 50% !important;
        left: 50% !important;
        transform: translate(calc(275% / 2), -50%);
        &>*:not(:first-child) {
            transform: translate(calc(-6px - 100%), 0);
        }
    }
    
    &[data-index="2"] {
        top: 50%;
        left: 90%;
    }
    &[data-index="4"] {
        top: 85%;
        left: 30%;
    }
    &[data-index="3"] {
        top: 85%;
        left: 70%;
    }
    &[data-index="5"] {
        top: 50%;
        left: 10%;
    }
    &[data-index="0"] {
        top: 15%;
        left: 30%;
    }
    &[data-index="1"] {
        top: 15%;
        left: 70%;
    }
}
.player {
    position: absolute;
    display: flex;
    transform: translate(-50%, -50%);
    align-items: center;
    &[data-index="2"] {
        top: 50%;
        left: 90%;
        &>.player-info {
            transform: translate(15vw, 0vh);
        }
    }
    &[data-index="4"] {
        top: 85%;
        left: 30%;
        &>.player-info {
            transform: translate(4vw, 10vh)
        }
    }
    &[data-index="3"] {
        top: 85%;
        left: 70%;
        &>.player-info {
            transform: translate(4vw, 10vh)
        }
    }
    &[data-index="5"] {
        top: 50%;
        left: 10%;
        &>.player-info {
            transform: translate(-6vw, 0vh);
        }
    }
    &[data-index="0"] {
        top: 15%;
        left: 30%;
        &>.player-info {
            transform: translate(4vw, -10vh)
        }
    }
    &[data-index="1"] {
        top: 15%;
        left: 70%;
        &>.player-info {
            transform: translate(4vw, -10vh)
        }
    }
}
</style>
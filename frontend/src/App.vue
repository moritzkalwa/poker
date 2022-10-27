<script setup lang="ts">

import Card from "@/components/Card.vue"
import River from "@/components/River.vue"
import Player from "@/components/Player.vue"
import Deck from "@/components/Deck.vue"
import Chip from "@/components/Chip.vue"
import Controls from "./components/Controls.vue"

import Poker from "../poker"

import { ref, provide, onBeforeUnmount, computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import type { Socket } from "socket.io-client"
import { io } from "socket.io-client"
import { ls, amountToChips } from '../util';

const socketConnected = ref(false)
const isDev = process.env.NODE_ENV === 'development'
let socket: Socket = io(isDev ? `http://${location.hostname}:3020` : '')
socket.on("connect", () => (socketConnected.value = true))
socket.on("disconnect", () => (socketConnected.value = false))

const poker = new Poker(socket, "test");
(document as any).poker = poker

const state = computed(() => poker.state.value)

provide("poker", poker)

provide("socket", socket)
provide("socketConnected", socketConnected)
onBeforeUnmount(() => socket.close())

const players = computed(() => poker.state.value.members)

</script>


<template>
  <div class="wrapper">
  {{state}}
    <div id="table">
      <River />
      <Deck />
        <Player v-for="player in players" :id="player.id" :key="player.id"/>
    </div>
  <Controls />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  background: radial-gradient(circle at center, grey, black);
}
#table {
  aspect-ratio: 2;
  width: 75vw;
  height: 75vh;
  margin-top: 5vh;
  position: relative;
  box-shadow: 0px 0px 15px 5px #000000;
  border: 8px solid brown;
  border-radius: 1000px;
  background: radial-gradient(circle at center, green, darkgreen);
}
</style>

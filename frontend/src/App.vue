<script setup lang="ts">

import Card from "@/components/Card.vue"
import River from "@/components/River.vue"
import Player from "@/components/Player.vue"
import Deck from "@/components/Deck.vue"
import Chip from "@/components/Chip.vue"
import Controls from "./components/Controls.vue"

import Poker from "../poker"

import { ref, provide, onBeforeUnmount } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import type { Socket } from "socket.io-client"
import { io } from "socket.io-client"
import { ls, amountToChips } from '../util';

const socketConnected = ref(false)
let socket: Socket = io(`http://${location.hostname}:3020`)
socket.on("connect", () => (socketConnected.value = true))
socket.on("disconnect", () => (socketConnected.value = false))

const poker = new Poker(socket, "test")

provide("poker", poker)

provide("socket", socket)
provide("socketConnected", socketConnected)
onBeforeUnmount(() => socket.close())

const amount = ref(1675);
(document as any).amount = amount

</script>


<template>
  <div class="wrapper">
    <div id="table">
      <River />
      <Deck />
      <div class="players">
        <Player/>
        <Player/>
        <Player/>
        <Player/>
        <Player/>
        <Player/>
      </div>
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

<script setup lang="ts">

import Card from "@/components/Card.vue"
import River from "@/components/River.vue"
import Player from "@/components/Player.vue"
import Deck from "@/components/Deck.vue"
import Chip from "@/components/Chip.vue"
import Controls from "@/components/Controls.vue"
import BettingSheet from "@/components/BettingSheet.vue"
import Table from "@/components/Table.vue"

import Poker from "@/../poker"

import { ref, provide, onBeforeUnmount, computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import type { Socket } from "socket.io-client"
import { io } from "socket.io-client"
import { ls, amountToChips } from '@/../util';

const route = useRoute()
const router = useRouter()

const name = ls("displayname")
if (!name) {
  router.replace({
    name: "signup",
    query: {
      returnTo: route.fullPath,
    },
  })
}

const socketConnected = ref(false)
const isDev = process.env.NODE_ENV === 'development'
let socket: Socket = io(isDev ? `http://${location.hostname}:3020` : 'https://server.moritzkalwa.dev')
socket.on("connect", () => (socketConnected.value = true))
socket.on("disconnect", () => (socketConnected.value = false))


const { roomID } = route.params as Record<string, string>

const poker = new Poker(socket, roomID)
if (name) poker.joinRoom(name);
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
    <Table>
      <River />
      <Deck />
        <Player v-for="player in players" :id="player.id" :key="player.id"/>
    </Table>
  <Controls />
  <BettingSheet />
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
  z-index: -2;
  position: absolute;
}
</style>

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

import { ref, provide, inject, onBeforeUnmount, computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ls, amountToChips } from '@/../util';
import type { Socket } from "socket.io-client"

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

const socket: Socket = inject("socket")!

const { roomID } = route.params as Record<string, string>

const poker = new Poker(socket, roomID)
if (name) poker.joinRoom(name);
(document as any).poker = poker

const state = computed(() => poker.state.value)

provide("poker", poker)

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

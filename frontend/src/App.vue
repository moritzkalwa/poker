<script setup lang="ts">
import { RouterView } from "vue-router";
import type { Socket } from "socket.io-client"
import { provide, ref, onBeforeUnmount } from "vue"
import type { Ref } from "vue"
import { io } from "socket.io-client"
import type { PublicRoom } from "../../backend/types/room";

const socketConnected = ref(false)
const isDev = process.env.NODE_ENV === 'development'
let socket: Socket = io(isDev ? `http://${location.hostname}:3020` : 'https://server.moritzkalwa.dev')
socket.on("connect", () => (socketConnected.value = true))
socket.on("disconnect", () => (socketConnected.value = false))

const roomsRef: Ref<Array<PublicRoom>> = ref([])
socket.on("rooms", ({ rooms }) => {
  roomsRef.value = rooms
})

provide("rooms", roomsRef)
provide("socket", socket)
provide("socketConnected", socketConnected)

onBeforeUnmount(() => socket.close())

</script>

<template>
  <RouterView />
</template>

<style lang="scss">
</style>
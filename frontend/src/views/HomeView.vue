<script setup lang="ts">
import Table from "@/components/Table.vue"

import { useRoute, useRouter } from "vue-router"
import { ls } from "@/../util"
import { inject } from "vue";
import type { Ref } from "vue"
import type { PublicRoom } from "../../../backend/types/room";

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

const rooms: Ref<Array<PublicRoom>> = inject("rooms")!

const enterRoom = (roomID: string) => {
  router.push({name: 'room', params: { roomID }})
}
</script>


<template>
  <div class="wrapper">
    <Table>
        <div class="rooms">
          <h1>Betting Rooms</h1>
          <table>
            <tr>
              <th>Name</th>
              <th>Betters</th>
              <th></th>
            </tr>
            <tr v-for="room in rooms">
              <td>{{room.roomID}}</td>
              <td>{{room.memberCount}}/6</td>
              <td><img id="box-icon" src="../assets/enter.svg" @click="enterRoom(room.roomID)"></td>
            </tr>
          </table>
        </div> 
    </Table>
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
.rooms {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 35vw;
    aspect-ratio: calc(1080 / 1080);
    padding: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    & * {
      color: black;
      font-family: 'Dancing Script', cursive;
    }
    &>table {
      width: 80%;
      & * {
        text-align: center;
        font-weight: bolder;
        font-size: large;
      }
      &>tr>td>img {
        aspect-ratio: 1;
        height: 32px;
        cursor: pointer;
      }
    }
    &::before {
      content: "";
      position: absolute;
      top: 0px;
      left: 0px;
      display: block;
      width: 100%;
      height: 100%;
      z-index: -1;
      transform: rotate(90deg);
      background-image: url("/parchment.png");
      background-size: 100% 100%;
    }
}
</style>

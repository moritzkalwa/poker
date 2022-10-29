<script setup lang="ts">
import Table from "@/components/Table.vue"

import { useRoute, useRouter } from "vue-router"
import { ls } from "@/../util"

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
</script>


<template>
  <div class="wrapper">
    <Table>
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
</style>

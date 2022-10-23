<script setup lang="ts">
import ChipDisplay from './ChipDisplay.vue';
</script>

<template>
    <div id="controls">
        <ChipDisplay :amount="1675"/>
    </div>
</template>

<style scoped lang="scss">
#controls {
  margin: auto;
  display: flex;
  border-radius: 30px;
  align-items: center;
  width: 75vw;
  height: 10vh;
  background: green;
  box-shadow: 0px 5px 20px 8px #000000;
}
</style>
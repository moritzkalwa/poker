<script setup lang="ts">

const props = defineProps<{
    value: 25 | 50 | 100 | 500
}>()

</script>

<template>
    <div class="chip">
        <img v-if="value === 25" src="/chip_red.png">
        <img v-if="value === 50"  src="/chip_blue.png">
        <img v-if="value === 100"  src="/chip_black.png">
        <img v-if="value === 500"  src="/chip_white.png">
    </div>
</template>

<style scoped lang="scss">
.chip {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 0px;
    &>img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
}

</style>
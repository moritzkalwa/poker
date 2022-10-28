<script setup lang="ts">
import Table from "@/components/Table.vue"
import { useRoute, useRouter } from "vue-router"
import { ref } from "vue"
import { ls } from "@/../util"

const route = useRoute()
const router = useRouter()

const username = ref('')

const signup = () => {
    console.log(username.value)
    if (!username.value) return
    
    
    ls("displayname", username.value)

    const path = route.query.returnTo
    if (path && typeof path === "string") router.replace({ path })
        else router.replace("/")
}
</script>

<template>
  <div class="wrapper">
    <Table>
        <div class="signup">
            <div class="contract-wrapper">
                <h1>Las Vegas Gambling Lease</h1>
                <span>
                    I hereby wave all my fictional property rights to any fictional chips gained in this fictional casino.
                    <br>
                    I will refrain from suing my opponents for swearing at me.
                    <br>
                    I accept that this text is, totally unentionnaly, way too small too read.
                    <br>
                    I solemnly swear I have not read any of the former statements.
                </span>
                <div class="signature-wrapper">
                    <div class="signature">
                        <span>Jack Jockenheimer</span>
                        <br>
                        <span>CEO of fictional casino</span>
                    </div>
                    <div class="signature">
                        <form @submit.prevent="signup">
                            <input spellcheck="false" v-model="username">
                        </form>
                        <span>Gambler to be robbed</span>
                    </div>
                </div>
            </div>
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
}
.signup {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60vw;
    aspect-ratio: calc(1920 / 1080);
    background-image: url("parchment.png");
    background-size: 100% 100%;
}
.contract-wrapper {
    text-align: center;
    padding: 7vh 19vw;
    color: black;
    font-family: 'Dancing Script', cursive;
    &>*{
        color: black;
        font-family: 'Dancing Script', cursive;
    }
}
.signature-wrapper {
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    padding-top: 3vh;
}
.signature {
    color: black;
    font-family: 'Dancing Script', cursive;
    &>span:first-child {
        border-bottom: 1px solid black;
    }
    &>form>input {
        width: 100%;
        border: none;
        background: none;
        border-bottom: 1px solid black;
        text-align: center;
        outline: none;
        color: black;
        font-family: 'Dancing Script', cursive;
    }
    &>*{
        color: black;
        text-align: center;
        font-family: 'Dancing Script', cursive;
    }
}
</style>

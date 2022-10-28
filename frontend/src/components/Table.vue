<template>
    <div class="table">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.table {
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
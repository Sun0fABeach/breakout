<template>
  <transition>
    <div>

    </div>
  </transition>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
div {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -1rem;
  width: calc(100% + 2rem);  // add sidebar padding
  padding: 1rem;
  background-color: aliceblue;
  // background-color: red;
}

.v-enter-active, .v-leave-active {
  transition: left 0.75s;
  border-left: 1px solid lightgrey;
}
.v-enter, .v-leave-to {
  left: calc(100% + 1rem);
}
</style>

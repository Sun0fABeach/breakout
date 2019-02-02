<template>
  <transition>
    <div id="sidebar-hs-overlay" v-show="open">

    </div>
  </transition>
</template>

<script>
export default {
  name: 'sidebarHighscoreOverlay',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    score: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
#sidebar-hs-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem; // parent padding ignored, so apply own padding
  background-color: aliceblue;

  &.v-enter-active, &.v-leave-active {
    transition: left 0.75s;
    border-left: 1px solid lightgrey;
  }
  &.v-enter, &.v-leave-to {
    left: 100%;
  }
}

</style>

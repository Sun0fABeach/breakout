<template>
  <transition
    enter-active-class="spin"
    leave-active-class="bounceOut"
  >
    <span v-if="visible">
      {{ text }}
    </span>
  </transition>
</template>

<script>
export default {
  name: 'overlayUIText',
  props: {
    text: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
span {
  font-size: 6rem;
  font-family: 'Courier New', Courier, monospace;
  color: white;
  text-shadow: 0.125rem 0.125rem 0.125rem grey;
}
.spin {
  animation-name: spinIn;
  animation-duration: 650ms;
}
.bounceOut {
  animation-duration: 0.75s;
  animation-name: bounceOut;
}
</style>

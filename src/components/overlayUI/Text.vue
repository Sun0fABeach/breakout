<template>
  <transition v-bind="animProps">
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
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    animated: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    animProps () {
      return this.animated && {
        'enter-active-class': 'spin',
        'leave-active-class': 'bounceOut'
      }
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

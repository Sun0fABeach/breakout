<template>
  <transition :enter-active-class="animation">
    <span v-if="visible">
      {{ text }}
    </span>
  </transition>
</template>

<script>
export default {
  name: 'animText',
  props: {
    animation: {
      type: String,
      default: null,
      validator: given => {
        const animTypes = ['spin']
        return !given || animTypes.indexOf(given) !== -1
      }
    },
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
  font-size: 4rem;
  font-family: 'Courier New', Courier, monospace;
  color: white;
  text-shadow: 0 0 6px lightGrey;
}
.spin {
  animation-name: spinIn;
  animation-duration: 650ms;
}
</style>

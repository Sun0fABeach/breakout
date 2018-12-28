<template>
  <transition
    enter-active-class="animated bounceInRight fast"
    leave-active-class="animated bounceOut faster"
  >
    <button
      v-if="visible"
      v-on="$listeners"
      class="animated pulse"
    >
      {{ text }}
    </button>
  </transition>
</template>

<script>
export default {
  name: 'overlayUIButton',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  padding: 0.5rem;
  font-size: 4.5rem;
  color: white;
  text-shadow: 0.125rem 0.125rem 0.125rem grey;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}

.bounceInRight {
  animation-delay: 300ms;
  animation-name: bounceInRight;
}

.bounceOut {
  animation-duration: 0.75s;
  animation-name: bounceOut;
}

.pulse:not(.bounceInRight):not(.bounceOut) {
  animation-name: pulse;
  animation-duration: 1.75s;
  animation-iteration-count: infinite;
}
</style>

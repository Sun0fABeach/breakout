<template>
  <transition>
    <button
      v-if="visible"
      @click="start"
      @animationend.once="pulse"
      :class="animClasses"
    >
      Start
    </button>
  </transition>
</template>

<script>
export default {
  name: 'startButton',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      animClasses: 'animated bounceInRight fast'
    }
  },
  methods: {
    pulse () {
      this.animClasses = 'animated pulse'
    },
    start () {
      this.animClasses = 'animated bounceOut faster'
      /**
       * emit on next render. otherwise, animClasses will not be set due to
       * vue's internal animation class management.
       */
      this.$nextTick(() => this.$emit('click'))
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  position: absolute;
  padding: 0.5rem;
  font-size: 4.5rem;
  color: white;
  text-shadow: 0.125rem 0.125rem 0.125rem grey;
  background-color: transparent;
  border: none;
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

.pulse {
  animation-name: pulse;
  animation-duration: 1.75s;
  animation-iteration-count: infinite;
}
</style>

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
import comms from '@/vuePhaserComms'

export default {
  name: 'startButton',
  data () {
    return {
      visible: false,
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
      this.$nextTick(() => { comms.emit('play scene') })
    }
  },
  created () {
    comms.once('start scene', () => { this.visible = true })
    comms.once('play scene', () => { this.visible = false })
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

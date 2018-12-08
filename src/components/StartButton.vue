<template>
  <transition
    enter-active-class="animated bounceInRight fast"
    leave-active-class="animated bounceOut faster"
  >
    <button v-if="visible" @click="start">Start</button>
  </transition>
</template>

<script>
import comms from '@/vuePhaserComms'

export default {
  name: 'startButton',
  data () {
    return {
      visible: false
    }
  },
  methods: {
    start () {
      comms.emit('play scene')
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
  padding: 0.5rem 1.5rem;
  font-size: 2rem;
  color: black;
  background-color: white;
  border: 2px solid black;
  border-radius: 0.375rem;
  cursor: pointer;
}

@keyframes bounceInRight {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  from {
    opacity: 0;
    transform: translate3d(500px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(-25px, 0, 0);
  }
  75% {
    transform: translate3d(10px, 0, 0);
  }
  90% {
    transform: translate3d(-5px, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

.bounceInRight {
  animation-delay: 300ms;
  animation-name: bounceInRight;
}

@keyframes bounceOut {
  20% {
    transform: scale3d(0.9, 0.9, 0.9);
  }
  50%,
  55% {
    opacity: 1;
    transform: scale3d(1.1, 1.1, 1.1);
  }
  to {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
}

.bounceOut {
  animation-duration: 0.75s;
  animation-name: bounceOut;
}
</style>

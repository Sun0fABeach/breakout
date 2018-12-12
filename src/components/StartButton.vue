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

@keyframes pulse {
  from {
    transform: scale3d(1, 1, 1);
  }

  50% {
    transform: scale3d(1.05, 1.05, 1.05);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
}

.pulse {
  animation-name: pulse;
  animation-duration: 1.75s;
  animation-iteration-count: infinite;
}
</style>

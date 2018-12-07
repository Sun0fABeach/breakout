<template>
  <button v-if="visible" @click="start">Start</button>
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.5rem 1.5rem;
  font-size: 2rem;
  color: black;
  background-color: white;
  border: 2px solid black;
  border-radius: 0.375rem;
  cursor: pointer;
}
</style>

<template>
  <div>
    <AnimText v-bind="animText" />
    <StartButton :visible="startButton.visible" @click="buttonClick"/>
  </div>
</template>

<script>
import comms from '@/vuePhaserComms'
import AnimText from './AnimText'
import StartButton from './StartButton'

export default {
  name: 'game',
  components: { AnimText, StartButton },
  data () {
    return {
      animText: {
        visible: false,
        text: 'Game Over',
        animation: 'spin'
      },
      startButton: {
        visible: false
      }
    }
  },
  methods: {
    buttonClick () {
      comms.emit('start play')
    }
  },
  created () {
    comms.once('pre play', () => { this.startButton.visible = true })
    comms.once('start play', () => { this.startButton.visible = false })
    comms.on('game over', () => { this.animText.visible = true })
    comms.on('restart', () => { this.animText.visible = false })
  }
}
</script>

<style lang="scss" scoped>
div {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <div>
    <OverlayUIText v-bind="text" />
    <OverlayUIButton v-bind="button" @click="buttonClick" />
  </div>
</template>

<script>
import comms from '@/vuePhaserComms'
import OverlayUIText from './Text'
import OverlayUIButton from './Button'

export default {
  name: 'game',
  components: { OverlayUIText, OverlayUIButton },
  data () {
    return {
      text: {
        visible: false,
        text: ''
      },
      button: {
        visible: false,
        text: ''
      }
    }
  },
  methods: {
    buttonClick () {
      comms.emit('start play')
    }
  },
  created () {
    comms.once('pre play', () => {
      this.button = {
        visible: true,
        text: 'Start'
      }
    })
    comms.on('start play', () => {
      this.text.visible = false
      this.button.visible = false
    })
    comms.on('game over', () => {
      this.text = {
        visible: true,
        text: 'Game Over'
      }
      this.button = {
        visible: true,
        text: 'Restart'
      }
    })
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

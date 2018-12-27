<template>
  <div>
    <OverlayUIText v-bind="text" />
    <OverlayUIButton v-bind="button" @click="buttonClick" />
  </div>
</template>

<script>
import OverlayUIText from './Text'
import OverlayUIButton from './Button'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'game',
  components: { OverlayUIText, OverlayUIButton },
  computed: {
    ...mapState([
      'gameState'
    ]),
    text () {
      const stateTextMap = {
        'paused': 'Paused',
        'lost': 'Game Over',
        'won': 'You Win'
      }
      return {
        visible: Object.keys(stateTextMap).indexOf(this.gameState) !== -1,
        text: stateTextMap[this.gameState],
        animated: this.gameState !== 'paused'
      }
    },
    button () {
      const stateTextMap = {
        'pre play': 'Start',
        'lost': 'Restart',
        'won': 'Restart'
      }
      return {
        visible: Object.keys(stateTextMap).indexOf(this.gameState) !== -1,
        text: stateTextMap[this.gameState]
      }
    }
  },
  methods: {
    ...mapMutations([
      'changeGameState'
    ]),
    buttonClick () {
      this.changeGameState(
        (this.gameState === 'pre play' ? '' : 're') + 'start play'
      )
    }
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

<template>
  <div>
    <OverlayUIText v-bind="text" />
    <OverlayUIButton v-bind="button" @click="buttonClick" />
  </div>
</template>

<script>
import OverlayUIText from './Text'
import OverlayUIButton from './Button'
import { GameState } from '@/store'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'game',
  components: { OverlayUIText, OverlayUIButton },
  computed: {
    ...mapState([
      'gameState',
      'level'
    ]),
    text () {
      const stateTextMap = {
        [GameState.Paused]: 'Paused',
        [GameState.Lost]: 'Game Over',
        [GameState.Won]: 'You Win',
        [GameState.NextLevel]: 'Level ',
      }

      let text = stateTextMap[this.gameState]
      if (this.gameState === GameState.NextLevel) {
        text += this.level
      }

      return {
        visible: !!stateTextMap[this.gameState],
        animated: this.gameState !== GameState.Paused,
        text
      }
    },
    button () {
      const stateTextMap = {
        [GameState.PrePlay]: 'Start',
        [GameState.Lost]: 'Restart',
        [GameState.Won]: 'Restart'
      }
      return {
        visible: !!stateTextMap[this.gameState],
        text: stateTextMap[this.gameState]
      }
    }
  },
  methods: {
    ...mapMutations([
      'changeGameState'
    ]),
    buttonClick () {
      switch (this.gameState) {
        case GameState.PrePlay:
          this.changeGameState(GameState.StartPlay)
          break
        case GameState.Lost:
        case GameState.Won:
          this.changeGameState(GameState.RestartPlay)
          break
      }
    },
    enterListener (e) {
      if (e.key === 'Enter') {
        this.changeGameState(GameState.StartPlay)
      }
    }
  },
  watch: {
    gameState (state) {
      if (state === GameState.PrePlay) {
        document.addEventListener('keydown', this.enterListener)
      } else {
        document.removeEventListener('keydown', this.enterListener)
      }
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

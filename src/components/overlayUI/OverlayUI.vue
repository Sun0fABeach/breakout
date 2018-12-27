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
      'gameState'
    ]),
    text () {
      const stateTextMap = {
        [GameState.Paused]: 'Paused',
        [GameState.Lost]: 'Game Over',
        [GameState.Won]: 'You Win'
      }
      return {
        visible: this.inStateMap(stateTextMap, this.gameState),
        text: stateTextMap[this.gameState],
        animated: this.gameState !== GameState.Paused
      }
    },
    button () {
      const stateTextMap = {
        [GameState.PrePlay]: 'Start',
        [GameState.Lost]: 'Restart',
        [GameState.Won]: 'Restart'
      }
      return {
        visible: this.inStateMap(stateTextMap, this.gameState),
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
        this.gameState === GameState.PrePlay
          ? GameState.StartPlay : GameState.RestartPlay
      )
    },
    inStateMap (stateMap, state) {
      return Object.keys(stateMap)
        .map(key => Number.parseInt(key))
        .indexOf(state) !== -1
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

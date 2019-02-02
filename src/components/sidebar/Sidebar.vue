<template>
  <div id="game-controls">
    <h1>Breakout!</h1>

    <div>
      <SidebarField label="Lives">{{ lives }}</SidebarField>
      <SidebarField label="Level">{{ level }}</SidebarField>
      <SidebarField label="Multiplier">{{ scoreMultiplier }}</SidebarField>
      <SidebarField label="Score">{{ score }}</SidebarField>
      <SidebarKeys />

      <HighscoreOverlay v-show="showHSOverlay" />
    </div>
  </div>
</template>

<script>
import SidebarField from './Field'
import SidebarKeys from './Keys'
import HighscoreOverlay from './HighscoreOverlay'
import { GameState } from '@/store'
import { mapState } from 'vuex'

export default {
  name: 'sidebar',
  components: {
    SidebarField,
    SidebarKeys,
    HighscoreOverlay
  },
  computed: {
    ...mapState([
      'lives', 'level', 'score', 'scoreMultiplier', 'gameState'
    ]),
    showHSOverlay () {
      return this.gameState === GameState.Lost ||
              this.gameState === GameState.Won
    }
  }
}
</script>

<style lang="scss" scoped>
#game-controls {
  display: flex;
  flex-direction: column;
  min-width: 10rem;
  padding: 1rem;
  background-color: aliceblue;
  font-family: 'Courier New', Courier, monospace;
  z-index: 1; // above game surface
  overflow-x: hidden; // for highscore overlay slide-in

  > div { // content container
    position: relative; // for abs. positioned highscore overlay
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    > :not(:last-child) {
      margin-top: 1rem;
    }

    > :nth-last-child(2) { // the key legend
      margin-top: auto;
    }
  }
}

h1 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  text-align: center;
  color: cadetblue;
}
</style>

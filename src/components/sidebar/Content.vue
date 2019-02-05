<template>
  <div id="sidebar-content">
    <SidebarGameInfo />
    <SidebarHighscoreOverlay :open="showHSOverlay" />
  </div>
</template>

<script>
import SidebarGameInfo from './GameInfo'
import SidebarHighscoreOverlay from './HighscoreOverlay'
import { GameState } from '@/store'
import { mapState } from 'vuex'

export default {
  name: 'sidebarContent',
  components: {
    SidebarGameInfo,
    SidebarHighscoreOverlay
  },
  computed: {
    ...mapState([
      'gameState'
    ]),
    showHSOverlay () {
      return this.gameState === GameState.Lost ||
              this.gameState === GameState.Won
    }
  }
}
</script>

<style lang="scss" scoped>
#sidebar-content {
  position: relative; // for abs. positioned highscore overlay
  flex-grow: 1;
  display: flex; // will stretch game info across full height
  padding: 1rem;
}
</style>


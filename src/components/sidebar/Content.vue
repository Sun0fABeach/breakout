<template>
  <div id="sidebar-content">
    <div id="sidebar-content-swappable">
      <SidebarGameInfo />
      <SidebarHighscoreOverlay
        :open="highscoreOpen"
        :gameEnded="gameEnded"
        @closed="onOverlayClosed"
      />
    </div>
    <a
      id="sidebar-content-hs-link"
      @click.stop.prevent="highscoreOpen = !highscoreOpen"
      :class="{ disabled: gameEnded }"
      href="#"
    >
      Highscores
    </a>
  </div>
</template>

<script>
import SidebarHighscoreOverlay from './highscoreOverlay/HighscoreOverlay'
import SidebarGameInfo from './GameInfo'
import { GameState } from '@/store'
import { mapState } from 'vuex'
import { indexOf, once, noop } from 'lodash-es'

export default {
  name: 'sidebarContent',
  components: {
    SidebarHighscoreOverlay,
    SidebarGameInfo
  },
  data () {
    return {
      highscoreOpen: false
    }
  },
  computed: {
    ...mapState([
      'gameState'
    ]),
    gameEnded () {
      return indexOf([GameState.Won, GameState.Lost], this.gameState) !== -1
    }
  },
  watch: {
    gameEnded (ended) {
      if (ended && this.highscoreOpen) {
        this.highscoreOpen = false
        this.onOverlayClosed = once(() => {
          this.highscoreOpen = true
        })
      } else {
        this.highscoreOpen = ended
      }
    }
  },
  created () {
    this.onOverlayClosed = noop
  }
}
</script>

<style lang="scss" scoped>
#sidebar-content {
  --content-padding: 0 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  &-swappable {
    position: relative; // for abs. positioned highscore overlay
    flex-grow: 1;
    display: flex; // will stretch content across full height
  }

  &-hs-link {
    padding: 1rem 1rem;
    text-align: center;
    color: dimgrey;
    font-size: 0.875rem;

    &:hover {
      text-decoration: none;
    }

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
      cursor: default;
    }
  }
}
</style>

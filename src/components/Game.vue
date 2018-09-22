<template>
  <div id="game-container">

    <div id="phaser-game-surface" v-if="downloaded" />
    <div class="placeholder" v-else>
      Downloading ...
    </div>

    <GameControls :content_visible="downloaded" />
  </div>
</template>

<script>
import GameControls from './GameControls'

export default {
  name: 'game',
  components: { GameControls },
  data () {
    return {
      downloaded: false
    }
  },
  mounted () {
    import(/* webpackChunkName: "game" */ '@/game/game').then(game => {
      this.downloaded = true
      this.$nextTick(() => game.launch())
    })
  }
}
</script>

<style lang="scss" scoped>
#game-container {
  display: flex;
}

.placeholder {
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
}
</style>

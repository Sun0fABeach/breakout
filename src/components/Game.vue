<template>
  <div id="game-container">

    <div id="phaser-game-surface" :style="dimensionsStyle" />
    <GameControls />

    <div id="download-overlay" v-if="!downloaded">
      Downloading ...
    </div>
  </div>
</template>

<script>
import GameControls from './GameControls'

const width = 800
const height = 600

export default {
  name: 'game',
  components: { GameControls },
  data () {
    return {
      downloaded: false,
      dimensionsStyle: {
        width: width + 'px',
        height: height + 'px'
      }
    }
  },
  mounted () {
    import(/* webpackChunkName: "game" */ '@/game/game').then(game => {
      this.downloaded = true
      this.$nextTick(() => game.launch(width, height))
    })
  }
}
</script>

<style lang="scss" scoped>
#game-container {
  position: relative;
  display: flex;
  box-shadow: 0px 0px 8px 2px lightgrey;
}

#phaser-game-surface {
  flex-shrink: 0;
}

#download-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
  background-color: white;
}
</style>

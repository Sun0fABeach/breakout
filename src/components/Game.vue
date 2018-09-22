<template>
  <div id="game-container">

    <div id="phaser-game-surface" :style="dimensionsStyle">
      {{ downloaded ? '' : 'Downloading ...' }}
    </div>

    <GameControls :content_visible="downloaded" />
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
      setTimeout(() => {
        this.downloaded = true
        this.$nextTick(() => game.launch(width, height))
      }, 2000)
    })
  }
}
</script>

<style lang="scss" scoped>
#game-container {
  display: flex;
  box-shadow: 0px 0px 8px 2px lightgrey;
}

#phaser-game-surface {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
}
</style>

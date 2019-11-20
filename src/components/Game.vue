<template>
  <div id="game-container">

    <div id="game-surface">
      <div :id="containerId" :style="dimensionsStyle" />
      <OverlayUI />
    </div>

    <Sidebar />

    <div id="download-overlay" v-if="!downloaded">
      Downloading ...
    </div>
  </div>
</template>

<script>
import Sidebar from './sidebar/Sidebar'
import OverlayUI from './overlayUI/OverlayUI'

const width = 800
const height = 600

export default {
  name: 'game',
  components: { Sidebar, OverlayUI },
  data () {
    return {
      downloaded: false,
      gameInstance: null,
      containerId: 'phaser-game',
      dimensionsStyle: {
        width: width + 'px',
        height: height + 'px'
      }
    }
  },
  async mounted () {
    const game = await import(/* webpackChunkName: "game" */ '@/game/game')
    this.downloaded = true
    this.$nextTick(() => {
      this.gameInstance = game.launch(this.containerId, width, height)
    })
  },
  destroyed () {
    this.gameInstance.destroy(false)
  }
}
</script>

<style lang="scss" scoped>
#game-container {
  position: relative;
  display: flex;
  box-shadow: 0px 0px 8px 2px lightgrey;
}

#game-surface {
  position: relative;
}

#download-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
  background-color: white;
}
</style>

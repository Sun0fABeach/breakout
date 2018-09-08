<template>
  <div id="game-container">
    <div id="phaser-game-surface"></div>
    <button type="button" :style="button_style" @click="restart"
      v-show="button_visible" v-if="game_over"
    >
      Restart
    </button>
    <button type="button" :style="button_style" @click="togglePause"
      v-show="button_visible" v-else
    >
      {{ this.paused ? 'Resume' : 'Pause' }}
    </button>
  </div>
</template>


<script>
import comms from '@/vuePhaserComms'

export default {
  name: 'game',
  data () {
    return {
      button_visible: false,
      paused : false,
      game_over: false
    }
  },
  computed: {
    button_style () {
      return {
        marginTop: '0.25rem',
        visibility: this.button_visible ? 'visible' : 'hidden'
      }
    }
  },
  methods: {
    togglePause () {
      comms.emit(this.paused ? 'resume' : 'pause')
      this.paused = !this.paused
    },
    restart () {
      comms.emit('restart')
      this.game_over = false
    }
  },
  mounted() {
    import(/* webpackChunkName: "game" */ '@/game/game').then(game => {
      game.launch()
      this.button_visible = true
      comms.on('game over', () => { this.game_over = true })
    })
  }
}
</script>


<style lang="scss" scoped>
#game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

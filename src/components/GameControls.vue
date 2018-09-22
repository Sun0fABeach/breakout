<template>
  <div id="game-controls">
    <div :style="content_style">

      <button type="button" @click="game_over ? restart() : togglePause()">
        {{ this.game_over ? 'Restart' : this.paused ? 'Resume' : 'Pause' }}
      </button>

    </div>
  </div>
</template>

<script>
import comms from '@/vuePhaserComms'

export default {
  name: 'gameControls',
  props: {
    content_visible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      paused: false,
      game_over: false
    }
  },
  computed: {
    content_style () {
      return {
        visibility: this.content_visible ? 'visible' : 'hidden'
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
  created () {
    comms.on('game over', () => { this.game_over = true })
  }
}
</script>

<style lang="scss" scoped>
#game-controls {
  padding: 1rem;
}
</style>

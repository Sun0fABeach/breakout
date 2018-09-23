<template>
  <div id="game-controls">

    <div>
      Lives: {{ num_lives }}
    </div>

    <button type="button" @click="game_over ? restart() : togglePause()">
      {{ this.game_over ? 'Restart' : this.paused ? 'Resume' : 'Pause' }}
    </button>

  </div>
</template>

<script>
import comms from '@/vuePhaserComms'

export default {
  name: 'gameControls',
  data () {
    return {
      num_lives: 0,
      paused: false,
      game_over: false
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
    comms.on('life change', newAmount => { this.num_lives = newAmount })
    comms.on('game over', () => { this.game_over = true })
  }
}
</script>

<style lang="scss" scoped>
#game-controls {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: aliceblue;
  font-family: 'Courier New', Courier, monospace;
}

button {
  margin-top: 1rem;
}
</style>

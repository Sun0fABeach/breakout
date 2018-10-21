<template>
  <div id="game-controls">

    <div class="counter">
      <span>Lives</span>
      <span>{{ num_lives }}</span>
    </div>

    <div class="counter">
      <span>Score</span>
      <span>{{ score }}</span>
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
      score: 0,
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
    comms.on('score change', newScore => { this.score = newScore })
    comms.on('game over', () => { this.game_over = true })
  }
}
</script>

<style lang="scss" scoped>
#game-controls {
  display: flex;
  flex-direction: column;
  min-width: 9rem;
  padding: 1rem;
  background-color: aliceblue;
  font-family: 'Courier New', Courier, monospace;

  > div:not(:first-child) {
    margin-top: 1rem;
  }
}

.counter {
  position: relative;
  border: 1px solid darkgrey;
  border-radius: 0.25rem;
  padding: 0.75rem 0.5rem 0.25rem;
  text-align: right;

  > :first-child {
    position: absolute;
    top: -0.5rem;
    left: 0.375rem;
    padding: 0 0.125rem;
    background-color: aliceblue;
    color: dimgrey;
    z-index: 0;
  }
  > :last-child {
    position: relative;
    z-index: 1;
  }
}

button {
  margin-top: 1rem;
}
</style>

<template>
  <div id="game-controls">

    <Counter label="Lives" :num="num_lives" />
    <Counter label="Score" :num="score" />
    <Counter label="Multiplier" :num="scoreMultiplier" />

    <button type="button" @click="game_over ? restart() : togglePause()">
      {{ this.game_over ? 'Restart' : this.paused ? 'Resume' : 'Pause' }}
    </button>

  </div>
</template>

<script>
import comms from '@/vuePhaserComms'
import Counter from './Counter'

export default {
  name: 'gameControls',
  components: { Counter },
  data () {
    return {
      num_lives: 0,
      score: 0,
      scoreMultiplier: 0,
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
    comms.on('multiplier change', newMult => { this.scoreMultiplier = newMult })
    comms.on('game over', () => { this.game_over = true })
  }
}
</script>

<style lang="scss" scoped>
#game-controls {
  display: flex;
  flex-direction: column;
  min-width: 10rem;
  padding: 1rem;
  background-color: aliceblue;
  font-family: 'Courier New', Courier, monospace;

  > :not(:first-child) {
    margin-top: 1rem;
  }
}
</style>

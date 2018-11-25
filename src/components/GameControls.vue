<template>
  <div id="game-controls">

    <Counter label="Lives" :num="num_lives" />
    <Counter label="Score" :num="score" />
    <Counter label="Multiplier" :num="scoreMultiplier" />

    <SidebarButton @click="gameOver ? restart() : pauseInput()">
      {{ this.gameOver ? 'Restart' : this.paused ? 'Resume' : 'Pause' }}
    </SidebarButton>

  </div>
</template>

<script>
import comms from '@/vuePhaserComms'
import Counter from './Counter'
import SidebarButton from './SidebarButton'

export default {
  name: 'gameControls',
  components: { Counter, SidebarButton },
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
    pauseInput () {
      comms.emit(this.paused ? 'resume' : 'pause')
    },
    restart () {
      comms.emit('restart')
    }
  },
  created () {
    comms.on('life change', newAmount => { this.num_lives = newAmount })
    comms.on('score change', newScore => { this.score = newScore })
    comms.on('multiplier change', newMult => { this.scoreMultiplier = newMult })
    comms.on('pause', () => { this.paused = true })
    comms.on('resume', () => { this.paused = false })
    comms.on('game over', () => { this.game_over = true })
    comms.on('restart', () => { this.game_over = false })
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

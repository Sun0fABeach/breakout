<template>
  <div id="game-controls">
    <h1>Breakout!</h1>

    <SidebarField label="Lives">{{ numLives }}</SidebarField>
    <SidebarField label="Score">{{ score }}</SidebarField>
    <SidebarField label="Multiplier">{{ scoreMultiplier }}</SidebarField>

    <SidebarButton @click="pauseInput()">
      {{ this.paused ? 'Resume' : 'Pause' }}
    </SidebarButton>

    <SidebarKeys />
  </div>
</template>

<script>
import comms from '@/vuePhaserComms'
import SidebarField from './Field'
import SidebarButton from './Button'
import SidebarKeys from './Keys'

export default {
  name: 'sidebar',
  components: { SidebarField, SidebarButton, SidebarKeys },
  data () {
    return {
      numLives: 0,
      score: 0,
      scoreMultiplier: 0,
      paused: false,
      gameOver: false
    }
  },
  methods: {
    pauseInput () {
      if (!this.gameOver) {
        comms.emit(this.paused ? 'resume' : 'pause')
      }
    }
  },
  created () {
    comms.on('life change', newAmount => { this.numLives = newAmount })
    comms.on('score change', newScore => { this.score = newScore })
    comms.on('multiplier change', newMult => { this.scoreMultiplier = newMult })
    comms.on('pause', () => { this.paused = true })
    comms.on('resume', () => { this.paused = false })
    comms.on('game over', () => { this.gameOver = true })
    comms.on('start play', () => { this.gameOver = false })
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
  z-index: 1; // above game surface

  > :not(:first-child) {
    margin-top: 1rem;
  }

  > :nth-last-child(2) {
    margin-top: auto;
  }

  > :last-child {
    margin-top: 1.5rem;
  }
}

h1 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  text-align: center;
  color: cadetblue;
}
</style>

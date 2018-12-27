<template>
  <div id="game-controls">
    <h1>Breakout!</h1>

    <SidebarField label="Lives">{{ numLives }}</SidebarField>
    <SidebarField label="Score">{{ score }}</SidebarField>
    <SidebarField label="Multiplier">{{ scoreMultiplier }}</SidebarField>

    <SidebarKeys />
  </div>
</template>

<script>
import comms from '@/vuePhaserComms'
import SidebarField from './Field'
import SidebarKeys from './Keys'

export default {
  name: 'sidebar',
  components: { SidebarField, SidebarKeys },
  data () {
    return {
      numLives: 0,
      score: 0,
      scoreMultiplier: 1,
      gameActive: false
    }
  },
  created () {
    comms.on('life change', newAmount => { this.numLives = newAmount })
    comms.on('score change', newScore => { this.score = newScore })
    comms.on('multiplier change', newMult => { this.scoreMultiplier = newMult })
    comms.on('game over', () => { this.gameActive = false })
    comms.on('start play', () => { this.gameActive = true })
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

  > :last-child {
    margin-top: auto;
  }
}

h1 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  text-align: center;
  color: cadetblue;
}
</style>

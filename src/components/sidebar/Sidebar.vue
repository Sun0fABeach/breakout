<template>
  <div id="game-controls">
    <h1>Breakout!</h1>

    <SidebarField label="Lives">{{ lives }}</SidebarField>
    <SidebarField label="Level">{{ level }}</SidebarField>
    <SidebarField label="Multiplier">{{ scoreMultiplier }}</SidebarField>
    <SidebarField label="Score">{{ score }}</SidebarField>

    <SidebarKeys />
  </div>
</template>

<script>
import SidebarField from './Field'
import SidebarKeys from './Keys'
import { mapState } from 'vuex'

export default {
  name: 'sidebar',
  components: { SidebarField, SidebarKeys },
  computed: mapState(['lives', 'level', 'score', 'scoreMultiplier'])
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

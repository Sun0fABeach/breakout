<template>
  <div id="sidebar">
    <MuteSymbol />
    <h1>Breakout!</h1>
    <SidebarContent />
  </div>
</template>

<script>
import SidebarContent from './Content'
import MuteSymbol from './MuteSymbol'

export default {
  name: 'sidebar',
  components: { SidebarContent, MuteSymbol }
}
</script>

<style lang="scss" scoped>
#sidebar {
  display: flex;
  flex-direction: column;
  min-width: 10rem;
  background-color: aliceblue;
  font-family: 'Courier New', Courier, monospace;
  z-index: 1; // above game surface
  overflow-x: hidden; // for highscore overlay slide-in

  h1 {
    margin: 1rem 0 0;
    font-size: 1.75rem;
    text-align: center;
    color: cadetblue;
  }
}
</style>

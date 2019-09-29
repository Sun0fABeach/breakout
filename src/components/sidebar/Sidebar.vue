<template>
  <div id="sidebar">
    <div>
      <MuteSymbol />
    </div>
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
  user-select: none;

  > div:first-child {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.625rem;
    padding: 0 1rem;
  }

  h1 {
    margin: 1rem 0 0;
    font-size: 1.75rem;
    text-align: center;
    color: cadetblue;
  }
}
</style>

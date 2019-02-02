<template>
  <div id="sidebar-game-info">
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

export default {
  name: 'sidebarGameInfo',
  components: {
    SidebarField,
    SidebarKeys
  },
  props: {
    lives: {
      type: Number,
      required: true
    },
    level: {
      type: Number,
      required: true
    },
    scoreMultiplier: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
#sidebar-game-info {
  display: flex;
  flex-direction: column;

  > * {
    margin-top: 1rem;
  }

  > :last-child {
    margin-top: auto;
  }
}
</style>

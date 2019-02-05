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
import { mapState } from 'vuex'

export default {
  name: 'sidebarGameInfo',
  components: {
    SidebarField,
    SidebarKeys
  },
  computed: {
    ...mapState([
      'lives', 'level', 'scoreMultiplier', 'score'
    ]),
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

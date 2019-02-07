<template>
  <div id="sidebar-hs-list">
    <h2>Top Scores</h2>
    <table>
      <tbody>
        <HighscoreListItem
          v-for="(entry, idx) in highscores"
          :key="idx"
          v-bind="entry"
          :rank="idx + 1"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import HighscoreListItem from './ListItem'
import { mapState } from 'vuex'

export default {
  name: 'sidebarHighscoreList',
  components: {
    HighscoreListItem
  },
  computed: mapState(['highscores'])
}
</script>

<style lang="scss" scoped>
#sidebar-hs-list {
  flex-grow: 1;
  overflow-x: auto; // just in case a long username wants to break our layout

  > h2 {
    margin: 0 0 0.375rem;
    color: grey;
  }

  > table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0.5rem 0.375rem; // add space between rows
  }
}
</style>

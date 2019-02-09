<template>
  <div id="sidebar-hs-list">
    <h2>Top Scores</h2>

    <table>
      <paginate name="highscoreList" :list="highscores" :per="8" tag="tbody">
        <HighscoreListItem
          v-for="(entry, idx) in paginated('highscoreList')"
          :key="idx"
          v-bind="entry"
          :rank="idx + 1"
        />
      </paginate>
    </table>

    <paginate-links
      for="highscoreList"
      :show-step-links="true"
      :hide-single-page="true"
      :limit="2"
    />
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
  data () {
    return {
      paginate: ['highscoreList']
    }
  },
  computed: mapState(['highscores'])
}
</script>

<style lang="scss" scoped>
#sidebar-hs-list {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
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

  .paginate-links {
    display: flex;
    justify-content: space-between;
    margin-top: auto;
    margin-bottom: 0;
    padding: 0 0.375rem;
    list-style-type: none;
    font-size: 1.25rem;
  }
}
</style>

<style lang="scss">
/* pagination link items are created dynamically, so we can't use scoped here */
.paginate-links > * {
  padding: 0.25rem;
  cursor: pointer;
}
</style>

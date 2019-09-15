<template>
  <div id="sidebar-hs-list">
    <h2>Top Scores</h2>

    <table>
      <paginate name="highscoreList" :list="highscores" :per="8" tag="tbody">
        <HighscoreListItem
          v-for="(entry, idx) in paginated('highscoreList')"
          :key="idx"
          v-bind="entry"
        />
      </paginate>
    </table>

    <paginate-links
      for="highscoreList"
      :hide-single-page="true"
      :limit="2"
    />
  </div>
</template>

<script>
import HighscoreListItem from './ListItem'
import { mapActions } from 'vuex'

export default {
  name: 'sidebarHighscoreList',
  components: {
    HighscoreListItem
  },
  data () {
    return {
      highscores: [],
      paginate: ['highscoreList']
    }
  },
  methods: mapActions([
    'getRankedHighscores'
  ]),
  async created () {
    this.highscores = await this.getRankedHighscores()
  }
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
  }

  > table {
    width: 100%;
  }

  .paginate-links {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid grey;
    margin-top: auto;
    margin-bottom: 0;
    padding: 0.5rem 0 0;
    list-style-type: none;
    font-size: 1.25rem;
  }
}
</style>

<style lang="scss">
/* pagination items/links are created dynamically, so can't use scoped here */
#sidebar-hs-list {
  > table th {
    padding-top: 0.5rem;
    padding-right: 0.375rem;
    color: dimgrey;
  }

  .paginate-links {
    li {
      border: 1px solid transparent;
      border-radius: 0.25rem;
      cursor: pointer;

      &:hover {
        border-color: grey;
      }
      &:first-child, &:last-child {
        font-weight: bold;
      }
    }

    a {
      display: inline-block;
      padding: 0.125rem 0.25rem;
    }
  }
}
</style>

<template>
  <div id="sidebar-hs-list">
    <h2>Top Scores</h2>

    <table>
      <paginate
        name="highscoreList"
        :list="highscores"
        :per="pageSize"
        tag="tbody"
      >
        <HighscoreListItem
          v-for="(entry, idx) in paginated('highscoreList')"
          :key="idx"
          v-bind="{ tall, ...entry }"
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

const pageSizes = {
  default: 7,
  tall: 8
}

export default {
  name: 'sidebarHighscoreList',
  components: {
    HighscoreListItem
  },
  props: {
    tall: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      highscores: [],
      paginate: ['highscoreList'],
      pageSize: pageSizes.default
    }
  },
  methods: mapActions([
    'getRankedHighscores'
  ]),
  watch: {
    tall: {
      handler (isTall) {
        this.pageSize = pageSizes[isTall ? 'tall' : 'default']
      },
      immediate: true
    }
  },
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
#sidebar-hs-list .paginate-links {
  li {
    border: 1px solid transparent;
    border-radius: 0.25rem;
    cursor: pointer;

    &:hover {
      border-color: grey;
    }
    &.active {
      font-weight: bold;
    }
  }

  a {
    display: inline-block;
    padding: 0.125rem 0.25rem;
  }
}
</style>

<template>
  <transition
    @before-enter="beforeOpen"
    @after-enter="afterOpen"
    @after-leave="afterClose"
  >
    <div id="sidebar-hs-overlay" v-show="open">
      <div id="sidebar-hs-score" v-if="gameEndedScoped">
        <span>Final Score</span>
        <span>{{ displayedScore }}</span>
      </div>

      <HighscoreContent :gameEnded="gameEndedScoped" />
    </div>
  </transition>
</template>

<script>
import HighscoreContent from './Content'
import { mapState } from 'vuex'

export default {
  name: 'sidebarHighscoreOverlay',
  components: {
    HighscoreContent
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    gameEnded: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      gameEndedScoped: false,
      displayedScore: null
    }
  },
  computed: mapState([
    'score'
  ]),
  methods: {
    /* we don't want a visual "snap-back" effect, so we update local component
     * data when before the overlay opens / has finished closing. */
    beforeOpen () {
      if (this.gameEnded) {
        this.gameEndedScoped = true
        this.displayedScore = this.score
      }
    },
    afterOpen () {
      if (this.gameEndedScoped) {
        this.$el.querySelector('input[type=text]').focus()
      }
    },
    afterClose () {
      this.gameEndedScoped = false
      this.displayedScore = null
      this.$emit('closed')
    }
  }
}
</script>

<style lang="scss" scoped>
#sidebar-hs-overlay {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: var(--content-padding);
  background-color: aliceblue;

  &.v-enter-active, &.v-leave-active {
    transition: left 0.75s;
    border-left: 1px solid lightgrey;
  }
  &.v-enter, &.v-leave-to {
    left: 100%;
  }

  > #sidebar-hs-score { // score display
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;

    > :first-child { // label
      color: dimgrey;
    }

    > :last-child { // score
      font-size: 1.5rem;
      margin-top: 0.25rem;
    }
  }
}
</style>

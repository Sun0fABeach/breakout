<template>
  <transition>
    <div id="sidebar-hs-overlay" v-show="open">
      <div id="sidebar-hs-score" v-if="gameEndedLocal">
        <span>Final Score</span>
        <span>{{ displayedScore }}</span>
      </div>

      <HighscoreContent :gameEnded="gameEndedLocal" />
    </div>
  </transition>
</template>

<script>
import HighscoreContent from './Content'
import { mapState } from 'vuex'
import { wait } from '@/helpers'

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
    return { // these are set in watcher
      gameEndedLocal: false,
      displayedScore: null
    }
  },
  computed: mapState([
    'score'
  ]),
  watch: {
    async open (opening) {
      /* we don't want a visual "snap-back" effect, so we update local component
       * data when the overlay starts opening / has finished closing. */
      if (opening) {
        if (this.gameEnded) {
          this.gameEndedLocal = true
          this.displayedScore = this.score
          await wait(750)
          this.$el.querySelector('input[type=text]').focus()
        } else {
          this.gameEndedLocal = false
          this.displayedScore = null
        }
      } else {
        await wait(750)
        this.gameEndedLocal = false
        this.displayedScore = null
        this.$emit('closed')
      }
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

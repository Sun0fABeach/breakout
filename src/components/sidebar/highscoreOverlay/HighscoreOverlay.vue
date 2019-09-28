<template>
  <transition>
    <div id="sidebar-hs-overlay" v-show="open" @transitionend.self="focusInput">
      <div>
        <span>Final Score</span>
        <span>{{ displayedScore }}</span>
      </div>
      <HighscoreContent :overlayOpen="open" />
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
    }
  },
  data () {
    return {
      displayedScore: 0 // set in watcher
    }
  },
  computed: mapState([
    'score'
  ]),
  methods: {
    focusInput () {
      if (this.open) {
        this.$el.querySelector('input').focus()
      }
    }
  },
  watch: {
    open (isOpen) {
      if (isOpen) {
        /* the store might reset the score to 0 faster than we close the
         * sidebar, so copy the score to component-local variable for displaying
         */
        this.displayedScore = this.score
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
  padding: 0 1rem 1rem;; // parent padding ignored, so apply own padding
  background-color: aliceblue;

  &.v-enter-active, &.v-leave-active {
    transition: left 0.75s;
    border-left: 1px solid lightgrey;
  }
  &.v-enter, &.v-leave-to {
    left: 100%;
  }

  > div:first-child { // score display
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

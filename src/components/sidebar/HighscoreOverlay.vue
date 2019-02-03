<template>
  <transition>
    <div id="sidebar-hs-overlay" v-show="open" @transitionend.self="focusInput">
      <div>
        <span>Final Score</span>
        <span>{{ displayedScore }}</span>
      </div>
      <HighscoreForm @submit="submit" ref="form" />
    </div>
  </transition>
</template>

<script>
import HighscoreForm from './HighscoreForm'
import { mapMutations } from 'vuex'

export default {
  name: 'sidebarHighscoreOverlay',
  components: { HighscoreForm },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    score: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      displayedScore: 0 // set in watcher
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
  },
  methods: {
    focusInput () {
      if (this.open) {
        this.$refs.form.$refs.input.focus()
      }
    },
    submit (name) {
      this.addHighscore({ name, score: this.score })
    },
    ...mapMutations([
      'addHighscore'
    ])
  }
}
</script>

<style lang="scss" scoped>
#sidebar-hs-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem; // parent padding ignored, so apply own padding
  background-color: aliceblue;

  &.v-enter-active, &.v-leave-active {
    transition: left 0.75s;
    border-left: 1px solid lightgrey;
  }
  &.v-enter, &.v-leave-to {
    left: 100%;
  }

  > div { // score display
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

  > #sidebar-hs-form {
      margin-top: 1.25rem;
  }
}
</style>

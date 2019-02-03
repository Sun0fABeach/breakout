<template>
  <transition>
    <div id="sidebar-hs-overlay" v-show="open" @transitionend.self="focusInput">
      <div>
        <span>Final Score</span>
        <span>{{ displayedScore }}</span>
      </div>

      <form @submit.prevent.stop>
        <label>
          Your name
          <input type="text" name="user_name" ref="input" maxlength="16" />
        </label>
        <SidebarButton class="submit-button" @click="submit">
          Submit Score
        </SidebarButton>
      </form>
    </div>
  </transition>
</template>

<script>
import SidebarButton from './Button'

export default {
  name: 'sidebarHighscoreOverlay',
  components: { SidebarButton },
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
      displayedScore: this.score
    }
  },
  watch: {
    open (isOpen) {
      if (isOpen) {
        /* copy to component-local variable so it doesn't display 0 while
         * sidebar closes. this might happen if the store resets the score to
         * 0 faster than we close the sidebar.
         */
        this.displayedScore = this.score
      }
    }
  },
  methods: {
    focusInput () {
      if (this.open) {
        this.$refs.input.focus()
      }
    },
    submit () {
      console.log('submit')
    }
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

  form {
    margin-top: 1.25rem;

    label {
      color: dimgrey;
    }
    input {
      width: 100%;
      margin-top: 0.375rem;
      padding: 0.125rem;
    }
  }
}
</style>

<style lang="scss">
/* we need use non-scoped scss to style the submit button since it is a
 * functional component and vue is not able to apply scoped styles to such
 * components...
 */
#sidebar-hs-overlay .submit-button {
  width: 100%;
  margin-top: 0.75rem;
}
</style>

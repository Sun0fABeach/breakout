<template>
  <div id="sidebar-hs-content">
    <transition :name="transition" mode="out-in">
      <HighscoreForm v-if="showForm" @submitted="onSubmit" />
      <HighscoreList v-else :tall="tallList" />
    </transition>
  </div>
</template>

<script>
import HighscoreForm from './Form'
import HighscoreList from './List'
import { wait } from '@/helpers'

export default {
  name: 'sidebarHighscoreContent',
  components: {
    HighscoreForm,
    HighscoreList
  },
  props: {
    gameEnded: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showForm: this.gameEnded,
      transition: 'none',
      tallList: true
    }
  },
  methods: {
    async onSubmit () {
      this.showForm = false
      this.transition = 'fade'
      await wait(1000)
      this.transition = 'none'
    }
  },
  watch: {
    gameEnded (ended) {
      this.showForm = ended
      this.tallList = !ended
    }
  }
}
</script>

<style lang="scss" scoped>
#sidebar-hs-content {
  flex-grow: 1;
  display: flex; // stretches content to full height
  margin-top: 1.125rem;

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
}

</style>

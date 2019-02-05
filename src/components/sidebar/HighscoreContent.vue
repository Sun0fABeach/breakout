<template>
  <div id="sidebar-hs-content">
    <transition :name="transition" mode="out-in">
      <HighscoreList v-if="showList" />
      <HighscoreForm v-else @submitted="switchToList" />
    </transition>
  </div>
</template>

<script>
import HighscoreForm from './HighscoreForm'
import HighscoreList from './HighscoreList'


export default {
  name: 'sidebarHighscoreContent',
  components: {
    HighscoreForm,
    HighscoreList
  },
  props: {
    overlayOpen: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      showList: false,
      transition: 'fade'
    }
  },
  methods: {
    switchToList () {
      this.transition = 'fade'
      this.showList = true
    }
  },
  watch: {
    overlayOpen (opens) {
      if (opens) {
        this.transition = 'none'
        this.showList = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#sidebar-hs-content {
  flex-grow: 1;
  display: flex; // stretches content to full height
  margin-top: 1.25rem;

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
}

</style>

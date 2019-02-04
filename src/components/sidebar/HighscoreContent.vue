<template>
  <div id="sidebar-hs-content">
    <HighscoreForm />
    <!-- <HighscoreList /> -->
  </div>
</template>

<script>
import HighscoreForm from './HighscoreForm'
// import HighscoreList from './HighscoreList'


export default {
  name: 'sidebarHighscoreContent',
  components: {
    HighscoreForm
    // HighscoreList
  },
  props: {
    overlayOpen: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
#sidebar-hs-content {
  margin-top: 1.25rem;
}
</style>

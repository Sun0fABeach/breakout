<template>
  <form id="sidebar-hs-form" @submit.prevent.stop="submit">
    <label>
      Your name
      <input
        type="text"
        name="user_name"
        maxlength="12"
        v-model.trim="name"
        ref="input"
      />
    </label>
    <SidebarButton class="submit-button" @click="submit">
      Submit Score
    </SidebarButton>
  </form>
</template>

<script>
import SidebarButton from '../Button'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'sidebarHighscoreForm',
  components: {
    SidebarButton
  },
  data () {
    return {
      name: ''
    }
  },
  computed: mapState([
    'score'
  ]),
  methods: {
    ...mapActions([
      'addHighscore'
    ]),
    submit () {
      if (this.name) {
        this.addHighscore({ name: this.name, score: this.score })
        this.$emit('submitted')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#sidebar-hs-form {
  label {
    color: dimgrey;
  }
  input {
    width: 100%;
    margin-top: 0.375rem;
    padding: 0.125rem;
  }
}
</style>

<style lang="scss">
/* we need use non-scoped scss to style the submit button since it is a
 * functional component and vue is not able to apply scoped styles to such
 * components...
 */
#sidebar-hs-form .submit-button {
  width: 100%;
  margin-top: 0.75rem;
}
</style>
<template>
  <form id="sidebar-hs-form" @submit.prevent.stop>
    <label>
      Your name
      <input
        type="text"
        name="user_name"
        maxlength="16"
        v-model.trim="name"
        @keyup.enter="submit"
        ref="input"
      />
    </label>
    <SidebarButton class="submit-button" @click="submit">
      Submit Score
    </SidebarButton>
  </form>
</template>

<script>
import SidebarButton from './Button'

export default {
  name: 'sidebar-hs-form',
  components: { SidebarButton },
  data () {
    return {
      name: ''
    }
  },
  methods: {
    submit () {
      if (this.name) {
        this.$emit('submit', this.name)
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
<template>
  <img :src="muted ? MuteSVG : UnmuteSVG" @click="toggleMute">
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import MuteSVG from '@/assets/mute.svg'
import UnmuteSVG from '@/assets/unmute.svg'

export default {
  data () {
    return {
      MuteSVG, UnmuteSVG
    }
  },
  computed: mapState(['muted']),
  methods: mapMutations(['toggleMute'])
}
</script>

<style lang="scss" scoped>
img {
  width: 1rem;
  opacity: 0.65;
  cursor: pointer;
}
</style>
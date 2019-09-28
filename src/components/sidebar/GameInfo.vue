<template>
  <div id="sidebar-game-info">
    <SidebarField label="Lives">{{ tweened.lives | floorNum }}</SidebarField>
    <SidebarField label="Level">{{ tweened.level | floorNum }}</SidebarField>
    <SidebarField label="Multiplier">{{ scoreMultiplier }}</SidebarField>
    <SidebarField label="Score">{{ tweened.score | floorNum }}</SidebarField>
    <SidebarKeys />
  </div>
</template>

<script>
import TWEEN from '@tweenjs/tween.js'
import SidebarField from './Field'
import SidebarKeys from './Keys'
import { mapState } from 'vuex'

export default {
  name: 'sidebarGameInfo',
  components: {
    SidebarField,
    SidebarKeys
  },
  data () {
    return {
      tweened: {
        lives: this.$store.state.lives,
        level: this.$store.state.level,
        score: this.$store.state.score
      }
    }
  },
  computed: {
    ...mapState(['scoreMultiplier']),
  },
  watch: {
    '$store.state.lives' (val) { // tween if lives get filled up
      this.tweenedAssign('lives', val, val > this.tweened.lives)
    },
    '$store.state.level' (val) { // tween if level drops back to 1
      this.tweenedAssign('level', val, val === 1)
    },
    '$store.state.score' (val) { // always tween
      this.tween('score', val)
    }
  },
  methods: {
    tweenedAssign (field, val, tweenIt) {
      if (tweenIt) {
        this.tween(field, val)
      } else {
        this.tweened[field] = val
      }
    },
    tween (field, val) {
      new TWEEN.Tween(this.tweened)
        .to({ [field]: val }, 400)
        .start()
    }
  },
  filters: {
    floorNum: val => Math.floor(val)
  }
}
</script>

<style lang="scss" scoped>
#sidebar-game-info {
  display: flex;
  flex-direction: column;
  padding: var(--content-padding);

  > * {
    margin-top: 1rem;
  }

  > :last-child {
    margin-top: auto;
  }
}
</style>

<template>
  <div>
    <span :class="muted && 'muted'" @click="toggleMute">
      {{ muted ? '&#x1f508;' : '&#x1f50a;' }}
    </span>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: mapState(['muted']),
  methods: mapMutations(['toggleMute'])
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
  padding: 0 1rem;
  color: darkslategrey;

  > span {
    display: inline-flex; // to make content stick left
    font-size: 1.125rem;
    width: 1rem;
    cursor: pointer;

    &.muted { // to prevent wiggle when switching symbol
      transform: translateX(1px)
    }
  }
}
</style>
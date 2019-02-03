<template functional>
  <button type="button" :class="data.staticClass" v-on="listeners">
    <span>
      <slot />
    </span>
  </button>
</template>

<script>
export default {
  name: 'sidebarButton'
}
</script>

<style lang="scss" scoped>
button {
  border: 1px solid darkgrey;
  border-radius: 0.25rem;
  background-color: white;
  padding: 0.375rem;
  cursor: pointer;
  transition: box-shadow 0.15s;

  > span {
    display: inline-block;
    transition: transform 0.15s;
  }

  &:hover, &:active {
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);

    > span {
      transform: scale(1.15);
    }
  }
}
</style>

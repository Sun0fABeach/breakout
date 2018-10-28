<template>
  <div>
    <span>{{ label }}</span>
    <span>{{ num }}</span>
  </div>
</template>

<script>
export default {
  name: 'counter',
  props: {
    label: {
      type: String,
      required: true
    },
    num: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  position: relative;
  border: 1px solid darkgrey;
  border-radius: 0.25rem;
  padding: 0.75rem 0.5rem 0.25rem;
  text-align: right;

  > :first-child {
    position: absolute;
    top: -0.5rem;
    left: 0.375rem;
    padding: 0 0.125rem;
    background-color: aliceblue;
    color: dimgrey;
    z-index: 0;
  }
  > :last-child {
    position: relative;
    z-index: 1;
  }
}
</style>

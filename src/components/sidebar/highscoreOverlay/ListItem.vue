<template functional>
  <tr>
    <th :class="{ tall: props.tall }">{{ props.rank }}</th>
    <td>
      <div>
        <span>{{ props.name }}</span>
        <span>{{ props.score }}</span>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'sidebarHighscoreListItem',
  props: {
    rank: {
      type: [Number, String],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    score: {
      type: [Number, String],
      required: true
    },
    tall: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
th {
  padding-top: 0.5rem;
  padding-right: 0.375rem;
  color: dimgrey;
  font-size: 1.875rem;
  font-weight: normal;
  vertical-align: bottom;
  text-align: left;

  &.tall {
    padding-top: 0.625rem;
  }
}

td {
  text-align: right;

  > div {
    display: flex;
    flex-direction: column;

    > :first-child {
      color: dimgrey;
      font-size: 0.875rem;
      white-space: nowrap;
    }
    > :last-child {
      font-size: 1.25rem;
    }
  }
}
</style>

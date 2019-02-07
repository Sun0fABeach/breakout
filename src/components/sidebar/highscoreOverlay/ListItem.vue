<template functional>
  <tr>
    <th>{{ props.rank }}</th>
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
    }
  }
}
</script>

<style lang="scss" scoped>
th {
  font-size: 1.875rem;
  font-weight: normal;
  vertical-align: bottom;
  text-align: left;
}

td {
  text-align: right;

  > div {
    display: flex;
    flex-direction: column;

    > :first-child {
      color: dimgrey;
      font-size: 0.875rem;
    }
    > :last-child {
      font-size: 1.25rem;
    }
  }
}
</style>

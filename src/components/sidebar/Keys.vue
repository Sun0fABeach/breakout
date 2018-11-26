<template>
  <SidebarField label="Controls">
    <table>
      <tr>
        <th>Left</th><td>◀</td>
      </tr>
      <tr>
        <th>Right</th><td>▶</td>
      </tr>
      <tr>
        <th>Launch</th><td>Space</td>
      </tr>
      <tr>
        <th>Pause</th><td>P</td>
      </tr>
      <tr>
        <th>Restart</th><td>R</td>
      </tr>
    </table>
  </SidebarField>
</template>

<script>
import SidebarField from './Field'

export default {
  name: 'sidebarKeys',
  components: { SidebarField }
}
</script>

<style lang="scss" scoped>
th {
  text-align: left;
  font-weight: normal;
  color: dimgrey;
}
td {
  padding-left: 0.75rem;
  text-align: center;
  font-weight: bold;
  color: dimgrey;
}
</style>

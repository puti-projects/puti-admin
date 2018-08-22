<template>
  <div class="app-container">
    <div class="dashboard-container">
      <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group>
    </div>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'

export default {
  name: 'dashboard',
  components: {
    PanelGroup
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    height: 100%;
  }
}
</style>

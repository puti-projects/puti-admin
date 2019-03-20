<template>
  <div class="dashboard-container">
    <panel-group></panel-group>
    
    <el-row :gutter="18" style="margin-bottom:30px;">
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}">
        <user-card/>
      </el-col>

      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}">
        <billboard/>
      </el-col>

      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}">
        <system-info/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import UserCard from './components/UserCard'
import SystemInfo from './components/SystemInfo'
import Billboard from './components/Billboard'

export default {
  name: 'dashboard',
  components: {
    PanelGroup,
    UserCard,
    SystemInfo,
    Billboard
  },
  created() {
    this.setTitle()
  },
  methods: {
    setTitle() {
      document.title = this.$t('route.' + this.$route.meta.title) + ' | Puti'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  padding: 30px;
  background-color: rgb(240, 242, 245);
  min-height: calc(100vh - 84px);
}
</style>

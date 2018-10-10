<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <logo :isCollapse="isCollapse"></logo>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#00142A"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :unique-opened="true"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>

</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import logo from './logo'

export default {
  components: { SidebarItem, logo },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<template>
  <el-card class="billboard-card">
    <div slot="header" class="clearfix">
        <i class="el-icon-menu"></i>
        <span>{{$t('dashboard.billboard')}}</span>
    </div>
   
    <div class="info-item">
      <span>{{$t('dashboard.budiling')}}</span>
    </div>
    <div class="info-item">
      <p class="login-text  footer-text">
        <span>您正在使用 Puti 项目，您可以直接贡献代码：
        <a href="https://github.com/puti-projects/puti" target="_blank" class="link"><svg-icon icon-class="github"></svg-icon> 链接</a>
        </span>
      </p>
    </div>
  </el-card>
</template>

<script>
import { getSystemInfo } from '@/api/statistics'

export default {
  data() {
    return {
      activeName: 'public',
      timer: null,
      BasicInfo: {},
      CPUInfo: {},
      DiskInfo: {},
      RAMInfo: {},
      hideRAMDot: true,
      hideDiskDot: true,
      hideCPUDot: true
    }
  },
  created() {
    this.getSystemInfo()
    this.timer = setInterval(() => {
      this.getSystemInfo()
    }, 30000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    getSystemInfo() {
      getSystemInfo().then(response => {
        this.BasicInfo = response.data.info
        this.CPUInfo = response.data.cpu
        this.DiskInfo = response.data.disk
        this.RAMInfo = response.data.ram
        this.checkDotShow()
      })
    },
    checkDotShow() {
      if (this.CPUInfo.healthStatus !== 'NORMAL') {
        this.hideCPUDot = false
      }
      if (this.DiskInfo.healthStatus !== 'NORMAL') {
        this.hideCPUDot = false
      }
      if (this.RAMInfo.healthStatus !== 'NORMAL') {
        this.hideRAMDot = false
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.billboard-card {
  .info-item{
    margin-bottom: 10px;
  }
  .link{
    color: #36a3f7;
  }
}
</style>

<template>
  <el-card class="system-info-card">
    <div slot="header" class="clearfix">
        <i class="el-icon-info"></i>
        <span>{{$t('dashboard.systemInfo')}}</span>
    </div>
    <el-form>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('dashboard.systemNormal')" name="public">
          <el-form-item :label="$t('dashboard.hostname')">
            {{BasicInfo.hostname}}
          </el-form-item>
          <el-form-item :label="$t('dashboard.uptime')">
            {{BasicInfo.uptime}}
          </el-form-item>
          <el-form-item :label="$t('dashboard.system')">
            {{BasicInfo.os}}
          </el-form-item>
          <el-form-item :label="$t('dashboard.systemVersion')">
            {{BasicInfo.platform}}
          </el-form-item>
        </el-tab-pane>


        <el-tab-pane name="ram">
          <span slot="label">
            <el-badge is-dot :hidden="hideRAMDot">{{$t('dashboard.systemRam')}}</el-badge>
          </span>
          <el-form-item :label="$t('dashboard.status')">
            <el-tag v-if="RAMInfo.healthStatus == 'NORMAL' " type="success" size="small">{{$t('dashboard.statusNormal')}}</el-tag>
            <el-tag v-else-if="RAMInfo.healthStatus == 'WARNING' " type="warning" size="small">{{$t('dashboard.statusWarning')}}</el-tag>
            <el-tag v-else-if="RAMInfo.healthStatus == 'CRITICAL' " type="danger" size="small">{{$t('dashboard.statusDanger')}}</el-tag>
            <el-tag v-else-if="RAMInfo.healthStatus == 'ERROR' " type="danger" size="small">{{$t('dashboard.statusError')}}</el-tag>
          </el-form-item>
          <el-form-item :label="$t('dashboard.usedPercent')">
            {{RAMInfo.usedPercent}} %
          </el-form-item>
          <el-form-item :label="$t('dashboard.used')">
            {{RAMInfo.used}}
          </el-form-item>
          <el-form-item :label="$t('dashboard.total')">
            {{RAMInfo.total}}
          </el-form-item> 
        </el-tab-pane>

        <el-tab-pane name="disk">
          <span slot="label">
            <el-badge is-dot :hidden="hideDiskDot">{{$t('dashboard.systemDisk')}}</el-badge>
          </span>
          <el-form-item :label="$t('dashboard.status')">
            <el-tag v-if="DiskInfo.healthStatus == 'NORMAL' " type="success" size="small">{{$t('dashboard.statusNormal')}}</el-tag>
            <el-tag v-else-if="DiskInfo.healthStatus == 'WARNING' " type="warning" size="small">{{$t('dashboard.statusWarning')}}</el-tag>
            <el-tag v-else-if="DiskInfo.healthStatus == 'CRITICAL' " type="danger" size="small">{{$t('dashboard.statusDanger')}}</el-tag>
            <el-tag v-else-if="RAMInfo.healthStatus == 'ERROR' " type="danger" size="small">{{$t('dashboard.statusError')}}</el-tag>
          </el-form-item>
          <el-form-item :label="$t('dashboard.usedPercent')">
            {{DiskInfo.usedPercent}} %
          </el-form-item>
          <el-form-item :label="$t('dashboard.used')">
            {{DiskInfo.used}} 
          </el-form-item>
          <el-form-item :label="$t('dashboard.total')">
            {{DiskInfo.total}} 
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="cpu">
          <span slot="label">
            <el-badge is-dot :hidden="hideCPUDot">CPU</el-badge>
          </span>
          <el-form-item :label="$t('dashboard.status')">
            <el-tag v-if="CPUInfo.healthStatus == 'NORMAL' " type="success" size="small">{{$t('dashboard.statusNormal')}}</el-tag>
            <el-tag v-else-if="CPUInfo.healthStatus == 'WARNING' " type="warning" size="small">{{$t('dashboard.statusWarning')}}</el-tag>
            <el-tag v-else-if="CPUInfo.healthStatus == 'CRITICAL' " type="danger" size="small">{{$t('dashboard.statusDanger')}}</el-tag>
          </el-form-item>
          <el-form-item :label="$t('dashboard.cpuCores')">
            {{CPUInfo.cpuCores}}
          </el-form-item>
          <el-form-item :label="$t('dashboard.loadAverage')">
            {{CPUInfo.loadAverage1}}, {{CPUInfo.loadAverage5}}, {{CPUInfo.loadAverage15}}
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
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

<style rel="stylesheet/scss" lang="scss" >
.system-info-card {
  .el-card__body {
    padding: 0px !important;
  }
  .el-tabs__nav{
    margin: 0 15px;
  }
  .el-tabs__content{
    padding: 0 15px 10px 15px;
  }
  .el-form-item{
    margin: 0;
  }
  .el-badge__content.is-dot{
    height: 8px;
    width: 8px;
    top: 12px;
    right: 2px;
  }
}
</style>

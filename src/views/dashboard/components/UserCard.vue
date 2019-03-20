<template>
  <el-card class="box-card-component">
    <div slot="header" class="box-card-header">
      <img :src="userBackground">
    </div>
    <div style="position:relative;">
      <pan-thumb :image="avatar" class="panThumb"/>
      
      <div style="padding-top:40px;" class="info-item">
        <span>{{$t('dashboard.hello')}}{{$t('common.comma')}}{{nickname}}{{$t('common.exclamationMark')}}</span>
      </div>
      <div class="info-item">
        {{$t('dashboard.yourRoleIs')}}
        <span v-if="roles === 'administrator'">{{$t('user.administrator')}}</span>
        <span v-else-if="roles === 'writer'">{{$t('user.writer')}}</span>
        <span v-else-if="roles === 'subscriber'">{{$t('user.subscriber')}}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import userBackground from '@/assets/images/user_background.jpg'
import PanThumb from '@/components/PanThumb'

export default {
  components: { PanThumb },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      userBackground
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'nickname'
    ])
  },
  created() {
    this.get()
  },
  methods: {
    get() {
      console.log(this.avatar)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .panThumb {
    z-index: 100;
    height: 70px!important;
    width: 70px!important;
    position: absolute!important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none!important;
    /deep/ .pan-info {
      box-shadow: none!important;
    }
  }
  .info-item {
    margin-bottom: 10px;
  }
}
</style>

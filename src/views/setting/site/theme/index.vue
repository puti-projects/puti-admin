<template>
  <el-card class="box-card setting-form" shadow="never">
    <div slot="header" class="setting-form-header clearfix">
      <span class="setting-header-title">{{ $t('option.siteSetting') }}</span>
      <span class="setting-header-subtitle">{{ $t('option.siteSettingTheme') }}</span>
    </div>

      <el-form ref="form" :model="form" label-width="150px">
        <div class="setting-form-body">
            <el-row>
                <el-col :span="8" v-for="item in themeList" :key="item.name" >
                    <el-card class="theme-card" :body-style="{ padding: '0px' }" shadow="hover">
                        <img :src="item.thumbnail" class="theme-image">
                        <div style="padding: 14px;">
                            <span><b>{{ item.name }}</b></span>
                            <div class="bottom clearfix">
                                <time v-if="item.name === form.current_theme" class="time">当前主题</time>
                                <el-button v-else  type="text" class="button">启用</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
      </el-form>
  </el-card>
</template>

<script>
import { fetchOptions } from '@/api/option'

export default {
  data() {
    return {
      settingType: 'theme',
      themeList: null,
      form: {
        current_theme: ''
      }
    }
  },
  created() {
    this.setTitle()
    this.getOptions()
  },
  methods: {
    setTitle() {
      document.title = this.$t('route.' + this.$route.meta.title) + ' | Puti'
    },
    getQuery() {
      return { settingType: this.settingType }
    },
    getOptions() {
      fetchOptions(this.getQuery()).then(response => {
        var data = response.data.options
        this.themeList = response.data.extraData

        this.form.current_theme = data.current_theme
      })
    }
  }
}
</script>

<style>
  .theme-card{
    margin-right: 20px;
  }

  .theme-image {
    width: 100%;
    height: 350px;
  }

  .bottom {
    height: 20px;
    font-size: 13px;
    color: #999;
    margin-top: 13px;
    line-height: 12px;
  }
  
  .button {
    padding: 0;
    float: right;
  }
</style>
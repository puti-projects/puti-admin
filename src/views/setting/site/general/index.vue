<template>
  <el-card class="box-card setting-form" shadow="hover">
    <div slot="header" class="setting-form-header clearfix">
      <span class="setting-header-title">网站配置</span>
      <span class="setting-header-subtitle">常规</span>
    </div>

      <el-form ref="form" :model="form" label-width="150px">
        <div class="setting-form-body">
          <el-row>
            <el-col :span="14" :offset="2">
                <el-form-item label="站点标题">
                  <el-input v-model="form.blog_name"></el-input>
                  <p class="setting-form-desc">即站点的名称</p>
                </el-form-item>

                <el-form-item label="副标题">
                  <el-input v-model="form.blog_description"></el-input>
                  <p class="setting-form-desc">用简洁的文字描述本站点，用于站点副标题。</p>
                </el-form-item>

                <el-form-item label="站点 Url 地址">
                  <el-input v-model="form.site_url"></el-input>
                  <p class="setting-form-desc">如：https://www.puti.com</p>
                </el-form-item>

                <el-form-item label="电子邮件地址">
                  <el-input v-model="form.admin_email"></el-input>
                  <p class="setting-form-desc">此地址被用作管理用途，如新用户通知。</p>
                </el-form-item>

                <el-form-item label="开放注册">
                  <el-switch v-model="usersCanRegister"></el-switch>
                  <p class="setting-form-desc">是否开放站点的注册功能。</p>
                </el-form-item>

                <el-form-item label="站点语言">
                  <el-select v-model="form.site_language" placeholder="请选择站点语言">
                    <el-option label="简体中文" value="简体中文"></el-option>
                    <el-option label="English" value="English"></el-option>
                  </el-select>
                  <p class="setting-form-desc">站点的语言</p>
                </el-form-item>

                <el-form-item label="时区">
                  <el-select v-model="form.timezone_string" placeholder="请选择时区">
                    <el-option label="亚洲/上海" value="Asia/Shanghai"></el-option>
                  </el-select>
                  <p class="setting-form-desc">选择与您在同一时区的城市。</p>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row class="setting-form-footer">
            <el-col :span="14" :offset="4">
              <el-button type="primary" size="small" @click="saveSetting">保存更改</el-button>
              <el-button size="small" @click="resetSetting">重置</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
  </el-card>
</template>

<script>
import { fetchOptions, updateOptions } from '@/api/option'

export default {
  data() {
    return {
      settingType: 'general',
      form: {
        blog_name: '',
        blog_description: '',
        site_url: '',
        admin_email: '',
        users_can_register: false,
        site_language: '',
        timezone_string: ''
      },
      usersCanRegister: false
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
        var data = response.data
        this.form.blog_name = data.blog_name
        this.form.blog_description = data.blog_description
        this.form.site_url = data.site_url
        this.form.admin_email = data.admin_email
        this.form.users_can_register = data.users_can_register
        if (data.users_can_register === 'on') {
          this.usersCanRegister = true
        } else {
          this.usersCanRegister = false
        }
        this.form.site_language = data.site_language
        this.form.timezone_string = data.timezone_string
      })
    },
    saveSetting() {
      if (this.usersCanRegister) {
        this.form.users_can_register = 'on'
      } else {
        this.form.users_can_register = 'off'
      }

      updateOptions(this.getQuery(), this.form).then(response => {
        this.$message({
          message: this.$t('common.operationSucceeded'),
          type: 'success',
          duration: 2000
        })
        this.getOptions()
      })
    },
    resetSetting() {
      this.getOptions()
    }
  }
}
</script>

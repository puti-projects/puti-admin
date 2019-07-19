<template>
  <el-card class="box-card setting-form" shadow="hover">
    <div slot="header" class="setting-form-header clearfix">
      <span class="setting-header-title">{{ $t('option.siteSetting') }}</span>
      <span class="setting-header-subtitle">{{ $t('option.siteSettingGeneral') }}</span>
    </div>

      <el-form ref="form" :model="form" label-width="150px">
        <div class="setting-form-body">
          <el-row>
            <el-col :span="14" :offset="2">
                <el-form-item :label="$t('option.siteTitle')">
                  <el-input v-model="form.blog_name"></el-input>
                  <p class="setting-form-desc">{{ $t('option.siteTitleDesc') }}</p>
                </el-form-item>

                <el-form-item :label="$t('option.siteSubtitle')">
                  <el-input v-model="form.blog_description"></el-input>
                  <p class="setting-form-desc">{{ $t('option.siteSubtitleDesc') }}</p>
                </el-form-item>

                <el-form-item :label="$t('option.siteURL')">
                  <el-input v-model="form.site_url"></el-input>
                  <p class="setting-form-desc">{{ $t('option.siteURLDesc') }}</p>
                </el-form-item>

                <el-form-item :label="$t('option.siteEmailAddress')">
                  <el-input v-model="form.admin_email"></el-input>
                  <p class="setting-form-desc">{{ $t('option.siteEmailAddressDesc') }}</p>
                </el-form-item>

                <el-form-item :label="$t('option.siteOpenRegister')">
                  <el-switch v-model="usersCanRegister"></el-switch>
                  <p class="setting-form-desc">{{ $t('option.siteOpenRegisterDesc') }}</p>
                </el-form-item>

                <el-form-item :label="$t('option.siteLanguage')">
                  <el-select v-model="form.site_language" :placeholder="$t('option.siteLanguagePlaceholder')">
                    <el-option label="简体中文" value="简体中文"></el-option>
                    <el-option label="English" value="English"></el-option>
                  </el-select>
                  <p class="setting-form-desc">{{ $t('option.siteLanguageDesc') }}</p>
                </el-form-item>

                <el-form-item :label="$t('option.siteTimeZone')">
                  <el-select v-model="form.timezone_string" :placeholder="$t('option.siteTimeZonePlaceholder')">
                    <el-option :label="$t('zone.AsiaShanghai')" value="Asia/Shanghai"></el-option>
                  </el-select>
                  <p class="setting-form-desc">{{ $t('option.siteTimeZoneDesc') }}</p>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row class="setting-form-footer">
            <el-col :span="14" :offset="4">
              <el-button type="primary" size="small" @click="saveSetting">{{ $t('option.siteSettingSave') }}</el-button>
              <el-button size="small" @click="resetSetting">{{ $t('common.reset') }}</el-button>
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
        var data = response.data.options
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

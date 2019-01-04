<template>
  <el-card class="box-card setting-form" shadow="hover">
    <div slot="header" class="setting-form-header clearfix">
      <span class="setting-header-title">{{ $t('option.siteSetting') }}</span>
      <span class="setting-header-subtitle">{{ $t('option.siteSettingProperty') }}</span>
    </div>

    <div class="">
      <el-form ref="form" :model="form" label-width="200px">
        <div class="setting-form-body">
            <el-row>
                <el-col :span="14" :offset="2">
                    <el-form-item :label="$t('option.siteDescription')" prop="site_description">
                        <el-input type="textarea" rows="5" v-model="form.site_description"></el-input>
                        <p class="setting-form-desc">{{ $t('option.siteDescriptionDesc') }}</p>
                    </el-form-item>

                    <el-form-item :label="$t('option.siteKeywords')" prop="site_keywords">
                        <el-input type="textarea" rows="5" v-model="form.site_keywords"></el-input>
                        <p class="setting-form-desc">{{ $t('option.siteKeywordsDesc') }}</p>
                    </el-form-item>

                    <el-form-item :label="$t('option.siteFooter')" prop="footer_copyright">
                        <el-input type="textarea" rows="10" v-model="form.footer_copyright"></el-input>
                        <p class="setting-form-desc">{{ $t('option.siteFooterDesc') }}</p>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="setting-form-footer">
                <el-col :span="14" :offset="6">
                    <el-button type="primary" size="small" @click="saveSetting">{{ $t('option.siteSettingSave') }}</el-button>
                    <el-button size="small" @click="resetSetting">{{ $t('common.reset') }}</el-button>
                </el-col>
            </el-row>
        </div>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { fetchOptions, updateOptions } from '@/api/option'

export default {
  data() {
    return {
      settingType: 'property',
      form: {
        site_description: '',
        site_keywords: '',
        footer_copyright: ''
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
        var data = response.data
        this.form.site_description = data.site_description
        this.form.site_keywords = data.site_keywords
        this.form.footer_copyright = data.footer_copyright
      })
    },
    saveSetting() {
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

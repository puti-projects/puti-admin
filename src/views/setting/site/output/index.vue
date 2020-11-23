<template>
  <el-card class="box-card setting-form" shadow="hover">
        <div slot="header" class="setting-form-header clearfix">
            <span class="setting-header-title">{{ $t('option.siteSetting') }}</span>
            <span class="setting-header-subtitle">{{ $t('option.siteSettingOutput') }}</span>
        </div>

        <el-form ref="form" :model="form" label-width="150px">
            <div class="setting-form-body">
                <el-row>
                    <el-col :span="14" :offset="2">
                        <el-form-item :label="$t('option.siteShowOnIndex')">
                            <el-radio-group v-model="form.show_on_front">
                                <el-radio size="small" label="article" style="margin-bottom:10px">
                                    {{ $t('option.siteShowNewArticles') }}
                                    {{ $t('option.siteShowLimit') }}
                                    <el-input-number size="mini" v-model="form.posts_per_page"></el-input-number> {{ $t('option.siteShowArticles') }}
                                    {{ $t('option.siteOutofLimit') }}
                                </el-radio>
                                <el-radio size="small" label="page" style="margin-bottom:10px">
                                    {{ $t('option.siteShowPage') }}
                                    <el-select v-model="form.show_on_front_page" :placeholder="$t('option.siteChoose')" size="mini" style="width:100px">
                                        <el-option label="关于" value="about"></el-option>
                                    </el-select>
                                </el-radio>
                                <el-radio size="small" label="knowledge">
                                    {{ $t('option.siteShowknowledge') }}
                                </el-radio>
                            </el-radio-group>
                            <p class="setting-form-desc">{{ $t('option.siteShowOnIndexDesc') }}</p>
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
      settingType: 'output',
      form: {
        show_on_front: 'article',
        show_on_front_page: '',
        posts_per_page: 10
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
        this.form.show_on_front = data.show_on_front
        this.form.show_on_front_page = data.show_on_front_page
        this.form.posts_per_page = data.posts_per_page
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
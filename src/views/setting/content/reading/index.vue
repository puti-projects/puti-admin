<template>
  <el-card class="box-card setting-form" shadow="hover">
    <div slot="header" class="setting-form-header clearfix">
      <span class="setting-header-title">{{ $t('option.contentSetting') }}</span>
      <span class="setting-header-subtitle">{{ $t('option.contentSettingReading') }}</span>
    </div>

      <el-form ref="form" :model="form" label-width="150px">
        <div class="setting-form-body">
          <el-row>
            <el-col :span="14" :offset="2">
                <el-form-item :label="$t('option.contentShowOnIndex')">
                    <el-radio-group v-model="form.show_on_front">
                        <el-radio size="small" label="posts">{{ $t('option.contentShowNewArticles') }}</el-radio>
                        <el-radio size="small" label="page">
                            {{ $t('option.contentShowPage') }}
                            <el-select v-model="form.show_on_front_page" :placeholder="$t('option.contentChoose')" size="mini" style="width:100px">
                                <el-option label="关于" value="about"></el-option>
                            </el-select>
                        </el-radio>
                    </el-radio-group>
                    <p class="setting-form-desc">{{ $t('option.contentShowOnIndexDesc') }}</p>
                </el-form-item>

                <el-form-item :label="$t('option.contentShowLimit')">
                    <el-input-number size="mini" v-model="form.posts_per_page"></el-input-number> {{ $t('option.contentShowArticles') }}
                    <p class="setting-form-desc">{{ $t('option.contentOutofLimit') }}</p>
                </el-form-item>

                <el-form-item :label="$t('option.contentOpenXML')">
                    <el-radio-group v-model="form.open_XML">
                        <el-radio size="small" label="on">{{ $t('option.contentYes') }}</el-radio>
                        <el-radio size="small" label="off">{{ $t('option.contentNo') }}</el-radio>
                    </el-radio-group>
                    <p class="setting-form-desc">{{ $t('option.contentOpenXMLDesc') }}</p>
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
      settingType: 'reading',
      form: {
        show_on_front: 'posts',
        show_on_front_page: '',
        posts_per_page: 10,
        open_XML: 'on'
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
        this.form.show_on_front = data.show_on_front
        this.form.show_on_front_page = data.show_on_front_page
        this.form.posts_per_page = data.posts_per_page
        this.form.open_XML = data.open_XML
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

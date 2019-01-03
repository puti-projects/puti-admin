<template>
  <el-card class="box-card setting-form" shadow="hover">
    <div slot="header" class="setting-form-header clearfix">
      <span class="setting-header-title">内容配置</span>
      <span class="setting-header-subtitle">撰写</span>
    </div>

      <el-form ref="form" :model="form" label-width="150px">
        <div class="setting-form-body">
          <el-row>
            <el-col :span="14" :offset="2">
                <el-form-item label="默认文章分类目录">
                    <el-select v-model="form.default_category" placeholder="选择默认文章分类目录">
                        <el-option label="未分类" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="默认链接分类目录">
                    <el-select v-model="form.default_link_category" placeholder="选择默认链接分类目录">
                        <el-option label="无" value="0"></el-option>
                    </el-select>
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
      settingType: 'writing',
      form: {
        default_category: '1',
        default_link_category: '0'
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
        this.form.default_category = data.default_category
        this.form.default_link_category = data.default_link_category
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

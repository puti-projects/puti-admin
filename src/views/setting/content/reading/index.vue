<template>
  <el-card class="box-card setting-form" shadow="hover">
    <div slot="header" class="setting-form-header clearfix">
      <span class="setting-header-title">内容配置</span>
      <span class="setting-header-subtitle">阅读</span>
    </div>

      <el-form ref="form" :model="form" label-width="150px">
        <div class="setting-form-body">
          <el-row>
            <el-col :span="14" :offset="2">
                <el-form-item label="首页显示">
                    <el-radio-group v-model="form.show_on_front">
                        <el-radio size="small" label="posts">您的最新文章</el-radio>
                        <el-radio size="small" label="page">
                            一个静态页面
                            <el-select v-model="form.show_on_front_page" placeholder="选择" size="mini" style="width:100px">
                                <el-option label="关于" value="about"></el-option>
                            </el-select>
                        </el-radio>
                    </el-radio-group>
                    <p class="setting-form-desc">首页要显示的内容。</p>
                </el-form-item>

                <el-form-item label="博客页面至多显示">
                    <el-input-number size="mini" v-model="form.posts_per_page"></el-input-number> 篇文章
                    <p class="setting-form-desc">超出时将放到下一页</p>
                </el-form-item>

                <el-form-item label="启用 XML 站点地图">
                    <el-radio-group v-model="form.open_XML">
                        <el-radio size="small" label="1">是</el-radio>
                        <el-radio size="small" label="0">否</el-radio>
                    </el-radio-group>
                    <p class="setting-form-desc">是否启用XML站点地图。</p>
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
import { fetchOptions } from '@/api/option'

export default {
  data() {
    return {
      settingType: 'reading',
      form: {
        show_on_front: 'posts',
        show_on_front_page: '',
        posts_per_page: 10,
        open_XML: '1'
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
    getOptions() {
      var query = { settingType: this.settingType }
      fetchOptions(query).then(response => {
        var data = response.data
        this.form.show_on_front = data.show_on_front
        this.form.show_on_front_page = data.show_on_front_page
        this.form.posts_per_page = data.posts_per_page
        this.form.open_XML = data.open_XML
      })
    }
  }
}
</script>

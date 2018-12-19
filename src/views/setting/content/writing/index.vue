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
                    <el-select v-model="form.region" placeholder="选择默认文章分类目录">
                        <el-option label="未分类" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="默认链接分类目录">
                    <el-select v-model="form.region" placeholder="选择默认链接分类目录">
                        <el-option label="无" value=""></el-option>
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
export default {
  data() {
    return {
      form: {
        default_category: '',
        default_link_category: ''
      }
    }
  },
  methods: {}
}
</script>

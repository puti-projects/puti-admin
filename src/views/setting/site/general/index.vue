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
                  <el-switch v-model="form.users_can_register"></el-switch>
                  <p class="setting-form-desc">是否开放站点的注册功能。</p>
                </el-form-item>

                <el-form-item label="站点语言">
                  <el-select v-model="form.region" placeholder="请选择站点语言">
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
export default {
  data() {
    return {
      form: {
        blog_name: '',
        blog_description: '',
        site_url: '',
        admin_email: '',
        users_can_register: '',
        site_language: '',
        timezone_string: ''
      }
    }
  },
  methods: {}
}
</script>

<template>
  <el-card class="box-card setting-form" shadow="hover">
    <div slot="header" class="setting-form-header clearfix">
      <span class="setting-header-title">内容配置</span>
      <span class="setting-header-subtitle">讨论</span>
    </div>

      <el-form ref="form" :model="form" label-width="150px">
        <div class="setting-form-body">
          <el-row>
            <el-col :span="14" :offset="3">
                <el-tabs tab-position="left" style="height:500px; margin-bottom:20px;">
                    <el-tab-pane label="评论">
                        <el-form-item label="开启评论">
                            <el-checkbox-group v-model="commentStatus">
                                <el-checkbox label="文章" name="article_comment_status"></el-checkbox>
                                <el-checkbox label="页面" name="page_comment_status"></el-checkbox>
                            </el-checkbox-group>
                            <p class="setting-form-desc">开启评论功能让用户进行评论。</p>
                        </el-form-item>

                        <el-form-item label="评论设置">
                            <el-checkbox-group v-model="form.comment_need_register">
                                <el-checkbox label="用户必须注册并登录才可以发表评论" name="comment_need_register"></el-checkbox>
                            </el-checkbox-group>
                            <el-checkbox-group v-model="form.show_comment_page">
                                <el-checkbox name="show_comment_page">
                                    分页显示评论，  每页显示
                                    <el-select v-model="form.comment_per_page" size="mini" style="width:70px">
                                        <el-option label="5" value="5"></el-option>
                                        <el-option label="10" value="10"></el-option>
                                        <el-option label="15" value="15"></el-option>
                                        <el-option label="20" value="20"></el-option>
                                        <el-option label="25" value="25"></el-option>
                                    </el-select>
                                    条评论，默认显示
                                    <el-select v-model="form.comment_page_first" size="mini" style="width:90px">
                                        <el-option label="旧的" value="old"></el-option>
                                        <el-option label="新的" value="new"></el-option>
                                    </el-select>
                                    一页
                                </el-checkbox>
                            </el-checkbox-group>
                            在每个页面顶部显示
                            <el-select v-model="form.comment_page_top" size="mini" style="width:90px">
                                <el-option label="最后" value="last"></el-option>
                                <el-option label="最前" value="first"></el-option>
                            </el-select>
                            评论
                            <p class="setting-form-desc">开启评论功能让用户进行评论。</p>
                        </el-form-item>

                        <el-form-item label="在评论显示之前">
                            <el-radio-group v-model="form.resource">
                                <el-radio border size="small" label="manualApproval">评论必须经人工批准</el-radio>
                                <el-radio border size="small" label="commentPass">评论者先前须有评论通过了审核</el-radio>
                                <el-radio border size="small" label="directly">直接显示</el-radio>
                            </el-radio-group>
                            <p class="setting-form-desc">评论展示条件。</p>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="头像">
                        <el-form-item label="头像显示">
                            <el-switch v-model="form.show_avatar"></el-switch>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
          </el-row>
          <el-row class="setting-form-footer">
            <el-col :span="14" :offset="5">
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
        article_comment_status: '',
        page_comment_status: '',
        comment_need_register: '',
        show_comment_page: '',
        comment_per_page: 15,
        comment_page_first: '',
        comment_page_top: '',
        show_avatar: 1
      },
      commentStatus: []
    }
  },
  methods: {}
}
</script>

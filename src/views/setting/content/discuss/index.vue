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
                                <el-checkbox label="article">文章</el-checkbox>
                                <el-checkbox label="page">页面</el-checkbox>
                            </el-checkbox-group>
                            <p class="setting-form-desc">开启评论功能让用户进行评论。</p>
                        </el-form-item>

                        <el-form-item label="评论设置">
                            <el-checkbox-group v-model="commentNeedRegister">
                                <el-checkbox label=false>用户必须注册并登录才可以发表评论</el-checkbox>
                            </el-checkbox-group>
                            <el-checkbox-group v-model="showCommentPage">
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
                                        <el-option label="最后" value="last"></el-option>
                                        <el-option label="最前" value="first"></el-option>
                                    </el-select>
                                    一页
                                </el-checkbox>
                            </el-checkbox-group>
                            在每个页面顶部显示
                            <el-select v-model="form.comment_page_top" size="mini" style="width:90px">
                                <el-option label="旧的" value="old"></el-option>
                                <el-option label="新的" value="new"></el-option>
                            </el-select>
                            评论
                            <p class="setting-form-desc">开启评论功能让用户进行评论。</p>
                        </el-form-item>

                        <el-form-item label="在评论显示之前">
                            <el-radio-group v-model="form.comment_before_show">
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
import { fetchOptions } from '@/api/option'

export default {
  data() {
    return {
      settingType: 'discuss',
      form: {
        article_comment_status: 'open',
        page_comment_status: 'open',
        comment_need_register: '0',
        show_comment_page: '',
        comment_per_page: 15,
        comment_page_first: '',
        comment_page_top: '',
        comment_before_show: '',
        show_avatar: 1
      },
      commentStatus: [],
      commentNeedRegister: false,
      showCommentPage: true
    }
  },
  created() {
    this.setTitle()
    this.getOptions()
    console.log(this.commentStatus)
  },
  methods: {
    setTitle() {
      document.title = this.$t('route.' + this.$route.meta.title) + ' | Puti'
    },
    getOptions() {
      var query = { settingType: this.settingType }
      fetchOptions(query).then(response => {
        var data = response.data
        this.form.article_comment_status = data.article_comment_status
        this.form.page_comment_status = data.page_comment_status
        if (data.article_comment_status === 'open') {
          this.commentStatus.push('article')
        }
        if (data.page_comment_status === 'open') {
          this.commentStatus.push('page')
        }

        this.form.comment_need_register = data.comment_need_register
        if (data.comment_need_register === '1') {
          this.commentNeedRegister = true
        } else {
          this.commentNeedRegister = false
        }

        this.form.show_comment_page = data.show_comment_page
        if (data.show_comment_page === '1') {
          this.showCommentPage = true
        } else {
          this.showCommentPage = false
        }

        this.form.comment_per_page = data.comment_per_page
        this.form.comment_page_first = data.comment_page_first
        this.form.comment_page_top = data.comment_page_top
        this.form.comment_before_show = data.comment_before_show
        this.form.show_avatar = data.show_avatar
      })
    },
    saveSetting() {
      console.log(this.commentStatus)
      // article comment
      if (this.commentStatus.indexOf('article') !== -1) {
        this.form.article_comment_status = 'open'
      } else {
        this.form.article_comment_status = 'close'
      }
      // page comment
      if (this.commentStatus.indexOf('page') !== -1) {
        this.form.page_comment_status = 'open'
      } else {
        this.form.article_comment_status = 'close'
      }
      // comment need register
      if (this.commentNeedRegister) {
        this.form.comment_need_register = '1'
      } else {
        this.form.comment_need_register = '0'
      }
      // show comment page
      if (this.showCommentPage) {
        this.form.showCommentPage = '1'
      } else {
        this.form.showCommentPage = '0'
      }

      console.log(this.form)
    }
  }
}
</script>

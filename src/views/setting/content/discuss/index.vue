<template>
  <el-card class="box-card setting-form" shadow="hover">
    <div slot="header" class="setting-form-header clearfix">
      <span class="setting-header-title">{{ $t('option.contentSetting') }}</span>
      <span class="setting-header-subtitle">{{ $t('option.contentSettingDiscuss') }}</span>
    </div>

      <el-form ref="form" :model="form" label-width="150px">
        <div class="setting-form-body">
          <el-row>
            <el-col :span="14" :offset="3">
                <el-tabs tab-position="left" style="height:500px; margin-bottom:20px;">
                    <el-tab-pane :label="$t('option.contentSettingComment')">
                        <el-form-item :label="$t('option.contentOpenComment')">
                            <el-checkbox-group v-model="commentStatus">
                                <el-checkbox label="article">{{ $t('option.contentOpenCommentArticle') }}</el-checkbox>
                                <el-checkbox label="page">{{ $t('option.contentOpenCommentPage') }}</el-checkbox>
                            </el-checkbox-group>
                            <p class="setting-form-desc">{{ $t('option.contentOpenCommentDesc') }}</p>
                        </el-form-item>

                        <el-form-item :label="$t('option.contentCommentSetting')">
                            <el-checkbox-group v-model="commentNeedRegister">
                                <el-checkbox label=false>{{ $t('option.contentCommentUserRegister') }}</el-checkbox>
                            </el-checkbox-group>
                            <el-checkbox-group v-model="showCommentPage">
                                <el-checkbox name="show_comment_page">
                                    {{ $t('option.contentCommentShow1') }}
                                    <el-select v-model="form.comment_per_page" size="mini" style="width:70px">
                                        <el-option label="5" value="5"></el-option>
                                        <el-option label="10" value="10"></el-option>
                                        <el-option label="15" value="15"></el-option>
                                        <el-option label="20" value="20"></el-option>
                                        <el-option label="25" value="25"></el-option>
                                    </el-select>
                                    {{ $t('option.contentCommentShow2') }}
                                    <el-select v-model="form.comment_page_first" size="mini" style="width:90px">
                                        <el-option :label="$t('option.contentCommentFast')" value="last"></el-option>
                                        <el-option :label="$t('option.contentCommentFirst')" value="first"></el-option>
                                    </el-select>
                                    {{ $t('option.contentCommentShow3') }}
                                </el-checkbox>
                            </el-checkbox-group>
                            {{ $t('option.contentCommentShow4') }}
                            <el-select v-model="form.comment_page_top" size="mini" style="width:90px">
                                <el-option :label="$t('option.contentCommentOld')" value="old"></el-option>
                                <el-option :label="$t('option.contentCommentNew')" value="new"></el-option>
                            </el-select>
                            {{ $t('option.contentCommentShow5') }}
                            <p class="setting-form-desc">{{ $t('option.contentCommentShowDesc') }}</p>
                        </el-form-item>

                        <el-form-item :label="$t('option.contentCommentBeforeShowSetting')">
                            <el-radio-group v-model="form.comment_before_show">
                                <el-radio border size="small" label="manualApproval">{{ $t('option.contentCommentMustPass') }}</el-radio>
                                <el-radio border size="small" label="commentPass">{{ $t('option.contentCommentPassBefore') }}</el-radio>
                                <el-radio border size="small" label="directly">{{ $t('option.contentCommentShowDirectly') }}</el-radio>
                            </el-radio-group>
                            <p class="setting-form-desc">{{ $t('option.contentCommentBeforeShowDesc') }}</p>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane :label="$t('option.contentAvator')">
                        <el-form-item :label="$t('option.contentshowAvatar')">
                            <el-switch v-model="showAvatar"></el-switch>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
          </el-row>
          <el-row class="setting-form-footer">
            <el-col :span="14" :offset="5">
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
      showCommentPage: true,
      showAvatar: true
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
        this.form.article_comment_status = data.article_comment_status
        this.form.page_comment_status = data.page_comment_status
        if (data.article_comment_status === 'open') {
          this.commentStatus.push('article')
        }
        if (data.page_comment_status === 'open') {
          this.commentStatus.push('page')
        }

        this.form.comment_need_register = data.comment_need_register
        if (data.comment_need_register === 'yes') {
          this.commentNeedRegister = true
        } else {
          this.commentNeedRegister = false
        }

        this.form.show_comment_page = data.show_comment_page
        if (data.show_comment_page === 'on') {
          this.showCommentPage = true
        } else {
          this.showCommentPage = false
        }

        this.form.comment_per_page = data.comment_per_page
        this.form.comment_page_first = data.comment_page_first
        this.form.comment_page_top = data.comment_page_top
        this.form.comment_before_show = data.comment_before_show
        this.form.show_avatar = data.show_avatar
        if (data.show_avatar === 'on') {
          this.showAvatar = true
        } else {
          this.showAvatar = false
        }
      })
    },
    saveSetting() {
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
        this.form.page_comment_status = 'close'
      }
      // comment need register
      if (this.commentNeedRegister) {
        this.form.comment_need_register = 'yes'
      } else {
        this.form.comment_need_register = 'no'
      }
      // show comment page
      if (this.showCommentPage) {
        this.form.show_comment_page = 'on'
      } else {
        this.form.show_comment_page = 'off'
      }
      // show avatar
      if (this.showAvatar) {
        this.form.show_avatar = 'on'
      } else {
        this.form.show_avatar = 'off'
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

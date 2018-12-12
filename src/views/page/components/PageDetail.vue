<template>
  <div class="app-container-grey">
    <div class="post-container">
      <el-form class="form-container" :model="postForm" ref="postForm">
        <div class="post-main-container" >
          <el-row :gutter="20">
            <el-col class="post-content-container" :span="19" >
              <el-form-item prop="title">
                <el-input placeholder="请输入页面标题" v-model="postForm.title" class="post-title-container" >
                  <template slot="prepend">标题</template>
                </el-input>
              </el-form-item>
              
              <div id="post-editor" >
                <mavon-editor 
                  style="height: 100%" 
                  :boxShadow="false"
                  v-model="postForm.content"  
                  @change="getHtmlContent">
                </mavon-editor>
              </div>

              <el-form-item id="post-description" label-width="50px" label="摘要:">
                <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.description">
                </el-input>
                <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
              </el-form-item>
            </el-col>

            <el-col class="post-action-container" :span="5" >
              <el-card class="post-card" shadow="never" body-style="padding:0">
                <div class="post-card-header clearfix">
                  <span><svg-icon icon-class="guide" /> 发布</span>
                </div>

                <div class="post-card-text">
                  <el-form-item>
                    <div slot="label"><i class="el-icon-star-on"></i> 状态：</div>
                    <span v-if="defaultStatus=='draft'">草稿</span>
                    <span v-if="defaultStatus=='publish'">已发布</span>
                  </el-form-item>

                  <el-form-item prop="comment_status">
                    <div slot="label"><svg-icon icon-class="comments" /> 开启评论：</div>
                    <el-switch v-model="postForm.comment_status" :active-value="activeValue" :inactive-value="inactiveValue"></el-switch>
                  </el-form-item>

                  <el-form-item prop="posted_time">
                    <div slot="label"><i class="el-icon-date"></i> 发布时间:</div>
                    <el-date-picker v-model="postForm.posted_time" 
                      type="datetime" 
                      format="yyyy-MM-dd HH:mm:ss" 
                      value-format="yyyy-MM-dd HH:mm:ss" 
                      placeholder="选择发布日期时间" 
                      size="small">
                    </el-date-picker>
                  </el-form-item>
                </div>

                <div class="post-card-bottom clearfix">
                  <el-button v-if="postForm.status==='draft'" type="primary" size="mini" @click="submitForm">发布</el-button>
                  <el-button v-else type="primary" size="mini" @click="submitForm">发布更新</el-button>
                  <el-button v-if="postForm.status==='draft'" type="info" size="mini" @click="draftForm">保存草稿</el-button>
                  <el-button v-else type="info" size="mini" @click="draftForm">保存为草稿</el-button>
                </div>
              </el-card>

              <el-card class="post-card" shadow="never" body-style="padding:0">
                <div class="post-card-header clearfix">
                  <span><svg-icon icon-class="list" /> 页面属性</span>
                </div>

                <div class="post-card-text">
                    <el-form-item prop="slug" label-width="88px">
                        <div slot="label"><i class="el-icon-edit"></i> 缩略名：</div>
                        <el-input v-model="postForm.slug" placeholder="请输入缩略名" size="small" clearable></el-input>
                    </el-form-item>

                    <el-form-item prop="parent_id">
                        <div slot="label"><i class="el-icon-news"></i> 父级页面：</div>
                        <el-select v-model="postForm.parent_id" placeholder="请选择父级页面" size="small">
                            <el-option label="无" :value="defaultParentID"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="page_template">
                        <div slot="label"><i class="el-icon-tickets"></i> 显示模板：</div>
                        <el-select v-model="postForm.page_template" placeholder="请选择页面模板" size="small">
                            <el-option label="默认" value="default"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

      </el-form>
    </div>
  </div>
</template>


<script>
import { mavonEditor } from 'mavon-editor'
import { fetchPage, createPage, updatePage } from '@/api/page'
import 'mavon-editor/dist/css/index.css'

const defaultForm = {
  id: undefined,
  status: 'draft',
  title: '', // 页面标题
  content: '', // 页面内容
  content_html: '', // 页面内容
  description: '', // 页面摘要
  comment_status: 1, // 开启评论
  cover_picture: '', // 页面封面
  posted_time: '', // 发表时间
  page_template: 'default',
  slug: '', // 缩略名
  parent_id: 0 // 父级页面id
}

export default {
  name: 'pageDetail',
  components: { mavonEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      defaultStatus: 'draft',
      activeValue: 1,
      inactiveValue: 0,
      defaultParentID: 0
    }
  },
  watch: {
  },
  computed: {
    contentShortLength() {
      if (this.postForm.description !== undefined) {
        return this.postForm.description.length
      }
      return 0
    }
  },
  created() {
    this.setTitle()
    if (this.isEdit) {
      const pageId = this.$route.params.id
      this.getPageInfo(pageId)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    setTitle() {
      document.title = this.$t('route.' + this.$route.meta.title) + ' | Puti'
    },
    getPageInfo(pageId) {
      fetchPage(pageId).then(response => {
        var pageInfo = response.data
        this.postForm.id = pageInfo.id
        this.postForm.status = pageInfo.status
        this.postForm.title = pageInfo.title
        this.postForm.content = pageInfo.content_markdown
        this.postForm.description = pageInfo.meta_date.description ? pageInfo.meta_date.description : ''
        this.postForm.page_template = pageInfo.meta_date.page_template ? pageInfo.meta_date.page_template : ''
        this.postForm.comment_status = pageInfo.comment_status
        this.postForm.cover_picture = pageInfo.cover_picture
        this.postForm.posted_time = pageInfo.post_date
        this.postForm.slug = pageInfo.slug
        this.postForm.parent_id = pageInfo.parent_id
        this.defaultStatus = pageInfo.status
      })
    },
    getHtmlContent(value, render) {
      this.postForm.content_html = render
    },
    submitForm() {
      this.postForm.status = 'publish'
      this.postForm.slug = this.postForm.slug ? this.postForm.slug : this.postForm.title
      if (this.postForm.id === undefined) {
        this.createPage()
      } else {
        this.updatePage()
      }
    },
    draftForm() {
      this.postForm.status = 'draft'
      this.postForm.slug = this.postForm.slug ? this.postForm.slug : this.postForm.title
      if (this.postForm.id === undefined) {
        this.createPage()
      } else {
        this.updatePage()
      }
    },
    createPage() {
      var token = this.$store.getters.token
      createPage(this.postForm, token).then(response => {
        this.$message({
          message: this.$t('common.operationSucceeded'),
          type: 'success',
          duration: 2000
        })

        if (response.data.id) {
          this.$router.push({ path: '/page/edit/' + response.data.id })
        }
      }).catch(e => {
        this.postForm.status = this.defaultStatus
      })
    },
    updatePage() {
      updatePage(this.postForm).then(response => {
        this.$message({
          message: this.$t('common.operationSucceeded'),
          type: 'success',
          duration: 2000
        })
        this.getPageInfo(this.$route.params.id)
      }).catch(e => {
        this.postForm.status = this.defaultStatus
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.post-container {
  position: relative;
  .post-main-container {
    padding: 10px 10px 10px 10px;
    .post-content-container{
      #post-editor {
        margin: auto;
        width: 100%;
        height: 650px;
      }
      #post-description{
        margin: 20px 0;
      }
    }
  } 

  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  .clearfix:after {
      clear: both
  }
}
</style>

<template>
  <div class="app-container-grey">
    <div class="post-container">
      <el-form class="form-container" :model="postForm" ref="postForm" >
        <div class="post-main-container" >
          <el-row :gutter="20">
            <el-col class="post-content-container" :span="19" >
              <el-form-item prop="title">
                <el-input placeholder="请输入文章标题" v-model="postForm.title" class="post-title-container" >
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

                  <el-form-item prop="if_top">
                    <div slot="label"><i class="el-icon-caret-top"></i> 是否置顶：</div>
                    <el-switch v-model="postForm.if_top" :active-value="activeValue" :inactive-value="inactiveValue"></el-switch>
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
                  <span><svg-icon icon-class="list" /> 分类目录</span>
                </div>

                <div class="post-card-text">
                  <el-tabs v-model="categoryTab" type="card">
                    <el-tab-pane label="所有分类目录" name="allCategory" class="post-category-tree">
                        <el-input
                          placeholder="输入关键字进行过滤"
                          v-model="filterText" 
                          prefix-icon="el-icon-search"
                          size="small" class="category-tree-input"
                          clearable>
                        </el-input>
                        <el-tree
                          v-model="postForm.category"
                          :data="categoryData"
                          show-checkbox
                          node-key="term_id"
                          :default-expand-all="defaultExpandAllCategory"
                          :default-checked-keys="defaultCheckedCategory"
                          :filter-node-method="filterNode"
                          :props="categoryProps"
                          ref="categoryTree">
                        </el-tree>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </el-card>

              <el-card class="post-card" shadow="never" body-style="padding:0">
                <div class="post-card-header clearfix">
                  <span><svg-icon icon-class="tag" /> 标签</span>
                </div>

                <div class="post-card-text">
                  <el-select v-model="postForm.tag" filterable multiple placeholder="选择标签" ref="tagTree" style="width:100%">
                    <el-option
                      v-for="item in tagOptions"
                      :key="item.term_id"
                      :label="item.name"
                      :value="item.term_id">
                    </el-option>
                  </el-select>
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
import { fetchList } from '@/api/taxonomy'
import { fetchArticle, createArticle, updateArticle } from '@/api/article'
import 'mavon-editor/dist/css/index.css'

const defaultForm = {
  id: undefined,
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_html: '', // 文章内容
  description: '', // 文章摘要
  comment_status: 1, // 开启评论
  cover_picture: '', // 文章封面
  posted_time: '', // 发表时间
  if_top: 0, // 是否置顶
  category: [],
  tag: []
}

export default {
  name: 'articleDetail',
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
      defaultExpandAllCategory: true,
      categoryTab: 'allCategory',
      categoryData: [],
      categoryProps: {
        id: 'item_id',
        children: 'children',
        label: 'name'
      },
      defaultCheckedCategory: [1],
      filterText: '',
      tagOptions: [],
      defaultSelectTags: [],
      activeValue: 1,
      inactiveValue: 0
    }
  },
  watch: {
    filterText(val) {
      this.$refs.categoryTree.filter(val)
    }
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
    this.initTaxonomy()
    if (this.isEdit) {
      const articleId = this.$route.params.id
      this.getArticleInfo(articleId)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    setTitle() {
      document.title = this.$t('route.' + this.$route.meta.title) + ' | Puti'
    },
    initTaxonomy() {
      fetchList({ type: 'category' }).then(response => {
        this.categoryData = response.data
      })
      fetchList({ type: 'tag' }).then(response => {
        this.tagOptions = response.data
      })
    },
    getArticleInfo(articleId) {
      fetchArticle(articleId).then(response => {
        if (response.code === 0) {
          var articleInfo = response.data
          this.postForm.id = articleInfo.id
          this.postForm.status = articleInfo.status
          this.postForm.title = articleInfo.title
          this.postForm.content = articleInfo.content_markdown
          this.postForm.description = articleInfo.meta_date.description ? articleInfo.meta_date.description : ''
          this.postForm.comment_status = articleInfo.comment_status
          this.postForm.cover_picture = articleInfo.cover_picture
          this.postForm.posted_time = articleInfo.post_date
          this.postForm.if_top = articleInfo.if_top
          this.postForm.category = articleInfo.category
          this.postForm.tag = articleInfo.tag
          this.$refs.categoryTree.setCheckedKeys(this.postForm.category)
          this.defaultStatus = articleInfo.status
        } else {
          this.$message.error(response.message)
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getCategoryCheckedKeys() {
      return this.$refs.categoryTree.getCheckedKeys()
    },
    getHtmlContent(value, render) {
      this.postForm.content_html = render
    },
    submitForm() {
      this.postForm.status = 'publish'
      this.postForm.category = this.getCategoryCheckedKeys()
      if (this.postForm.category.length === 0) {
        this.postForm.category = this.defaultCheckedCategory
      }
      if (this.postForm.id === undefined) {
        this.createArticle()
      } else {
        this.updateArticle()
      }
    },
    draftForm() {
      this.postForm.status = 'draft'
      this.postForm.category = this.getCategoryCheckedKeys()
      if (this.postForm.category.length === 0) {
        this.postForm.category = this.defaultCheckedCategory
      }
      if (this.postForm.id === undefined) {
        this.createArticle()
      } else {
        this.updateArticle()
      }
    },
    createArticle() {
      var token = this.$store.getters.token
      createArticle(this.postForm, token).then(response => {
        if (response.code === 0) {
          this.$message({
            message: this.$t('common.operationSucceeded'),
            type: 'success',
            duration: 2000
          })

          if (response.data.id) {
            this.$router.push({ path: '/article/edit/' + response.data.id })
          }
        } else {
          this.$message.error(response.message)
        }
      })
    },
    updateArticle() {
      updateArticle(this.postForm).then(response => {
        if (response.code === 0) {
          this.$message({
            message: this.$t('common.operationSucceeded'),
            type: 'success',
            duration: 2000
          })
          this.getArticleInfo(this.$route.params.id)
        } else {
          this.$message.error(response.message)
        }
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

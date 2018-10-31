<template>
  <div class="app-container">
    <div class="post-container">
      <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm" >

        <div class="post-title-container">
          <el-form-item prop="title">
            <MDinput name="name" v-model="postForm.title" required :maxlength="100">
              标题
            </MDinput>
          </el-form-item>

          <el-form-item label-width="50px" label="摘要:">
            <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.description">
            </el-input>
            <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
          </el-form-item>
        </div>

        <div class="post-main-container" >
          <el-row>
            <el-col class="post-content-container" :span="19" >
              <div id="editor">
                  <mavon-editor style="height: 100%"></mavon-editor>
              </div>
            </el-col>

            <el-col class="post-action-container" :span="5" >
              789
            </el-col>
          </el-row>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import mavonEditor from '@/components/mavonEditor'

const defaultForm = {
  id: undefined,
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  description: '', // 文章摘要
  guid: '', // 文章链接
  cover_picture: '', // 文章封面

  platforms: ['a-platform'],
  comment_status: 1,
  importance: 0
}

export default {
  name: 'articleDetail',
  components: { MDinput, mavonEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: { }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.description.length
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.post-container {
  position: relative;
  .post-title-container{
    padding: 0 10px 10px 10px;
    // margin-bottom: 10px;
  }
  .post-main-container {
    padding: 10px 10px 10px 10px;
    #editor {
      margin: auto;
      width: 100%;
      height: 650px;
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
  
}
</style>
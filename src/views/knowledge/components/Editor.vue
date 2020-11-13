<template>
<el-container class="knowledge-container">
  <el-aside width="240px" class="knowledge-aside">
    <el-row class="knowledge-aside-header">
      <el-col :span="24">
        <el-link class="knowledge-aside-header-link" icon="el-icon-back" :underline="false" @click="turnBack"> {{$t('knowledge.turnBackToKnowledgeList')}}</el-link>
        <el-tooltip effect="dark" :content="$t('knowledge.new'+typeMap[editType])" placement="bottom">
          <el-link class="knowledge-aside-header-link" :underline="false" style="float:right" @click="handleCreateItem"><i class="el-icon-circle-plus"></i></el-link>
        </el-tooltip>
      </el-col>
    </el-row>

    <el-row class="knowledge-aside-tree">
      <el-col :span="24">
        <el-tree
          :data="itemList"
          :props="itemListProps"
          :node-key="knowledgeID"
          default-expand-all
          @node-click="handlezSelectItem"
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag">
        </el-tree>
      </el-col>
    </el-row>
  </el-aside>
  
  <el-main style="padding:0;" class="knowledge-main">
    <el-row type="flex" align="middle">
      <el-col :span="24" class="knowledge-main-header">
        <span class="knowledge-main-header-word"><i class="el-icon-time"></i> 上次保存 </span> 
        <el-link class="knowledge-main-header-link" icon="el-icon-success" :underline="false">保存</el-link>
        <el-link class="knowledge-main-header-link" icon="el-icon-s-promotion" :underline="false">发布</el-link> 
      </el-col>
    </el-row>

    <el-row type="flex" align="middle">
      <el-col :span="24">
        <div id="vditor" class="knowledge-editor"></div>
      </el-col>
    </el-row>
  </el-main>
</el-container>
</template>

<script>
import Vditor from 'vditor'
import 'vditor/src/assets/scss/index.scss'
import { createKnowledgeItem, fetchKnowledgeItemList, fetchKnowledgeItem } from '@/api/knowledgeItem'

export default {
  name: 'knowledgeEditor',
  props: {
    editType: {
      type: String // note or doc
    }
  },
  data() {
    return {
      // editType: '', // note or doc
      knowledgeID: 0,
      typeMap: {
        note: 'NoteItem',
        doc: 'DocItem'
      },
      itemList: [],
      itemListProps: {
        label: 'title'
      },
      itemContent: {
        knowledge_item_id: 0,
        published_version: 0,
        content: {
          md: '',
          status: 0,
          version: 0,
          updated_time: ''
        }
      },
      contentEditor: ''
    }
  },
  mounted() {
    this.contentEditor = new Vditor('vditor', {
      icon: 'ant',
      lang: 'zh_CN',
      placeholder: 'Write something.',
      outline: true,
      toolbarConfig: {
        pin: true
      },
      counter: {
        enable: true,
        type: 'text'
      },
      preview: {
        hljs: {
          lineNumber: true
        }
      },
      cache: {
        enable: false
      },
      after: () => {
        // this.contentEditor.setValue('hello, Vditor + Vue!')
      }
    })
  },
  created() {
    this.setTitle()
    this.knowledgeID = parseInt(this.$route.params.id)
    this.getList(this.knowledgeID)
  },
  methods: {
    setTitle() {
      document.title = this.$t('route.' + this.$route.meta.title) + ' | Puti'
    },
    turnBack() {
      this.$router.push({ path: '/knowledge/list' })
    },
    getList(kID) {
      fetchKnowledgeItemList(kID).then(response => {
        this.itemList = response.data
      })
    },
    handleCreateItem() {
      this.$prompt(this.$t('knowledge.pleaseInputTitle'), this.$t('knowledge.new' + this.typeMap[this.editType]), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel')
      }).then(({ value }) => {
        this.createItem(value)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('knowledge.cancelCreate') + this.$t('knowledge.' + this.editType)
        })
      })
    },
    createItem(title) {
      var createForm = {
        title: title,
        knowledge_id: this.knowledgeID,
        parent_id: 0
      }
      var token = this.$store.getters.token
      createKnowledgeItem(createForm, token).then(response => {
        this.getList(this.knowledgeID) // 更新侧边列表
        this.$message({
          message: this.$t('common.createSucceeded'),
          type: 'success'
        })
      })
    },
    getItem(itemID) {
      fetchKnowledgeItem(itemID).then(response => {
        this.itemContent = {
          knowledge_item_id: response.data.knowledge_item_id,
          published_version: response.data.content_published_version,
          content: {
            md: response.data.content,
            status: response.data.content_status,
            version: response.data.content_now_version,
            updated_time: response.data.content_updated_time
          }
        }
      })
    },
    updateEditorArea() {
      // 更新编辑器区域
      this.contentEditor.setValue(this.content.md)
    },
    handlezSelectItem(a, b, c) {
      console.log(a)
      console.log(b)
      console.log(c)
      this.getItem()
      this.updateEditorArea()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.knowledge-container{
  position: absolute;
  min-height: calc(100vh - 84px);
  width: 100%;
  height: 100%;

  .knowledge-aside{
    .knowledge-aside-header{
      padding: 0 5px;
      height: 40px;
      line-height: 40px;
      
      .knowledge-aside-header-link{
        line-height: 40px;
        margin-right: 5px;
      }
    }

    .knowledge-aside-tree{
      border-top: 1px solid #d1d5da;
    }
  }

  .knowledge-main{
    height: 100%;
    border-left: 1px solid #d1d5da;

    .knowledge-main-header{
      height: 40px;

      .knowledge-main-header-word{
        line-height: 40px;
        margin-left: 10px;
        color: #596069;
        font-size: 14px;
      }
      .knowledge-main-header-link{
        line-height: 40px;
        float: right;
        margin: 0 20px 0 5px;
      }
    }
  }

  .knowledge-editor{
    height: calc(100vh - 124px);
    border-left: none;
    border-radius: 0px;
  }
}
</style>
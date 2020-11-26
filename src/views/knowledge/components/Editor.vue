<template>
<el-container class="knowledge-container">
  <el-aside width="300px" class="knowledge-aside">
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
          node-key="knowledge_item_id"
          default-expand-all
          @node-click="handlezSelectItem"
          @node-drop="handleDrop"
          draggable>
          <span class="aside-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-link
                class="hidden"
                icon="el-icon-edit"
                :underline="false"
                @click="handleEditItemTitle(node, data)">
              </el-link>
              <el-link
                class="hidden"
                icon="el-icon-plus"
                :underline="false"
                @click="handleCreateItemInside(node, data)">
              </el-link>
              <el-link
                class="hidden"
                icon="el-icon-delete"
                :underline="false"
                @click="handleDeleteItem(node, data)">
              </el-link>
            </span>
          </span>
        </el-tree>
      </el-col>
    </el-row>
  </el-aside>
  
  <el-main style="padding:0;" class="knowledge-main">
    <el-row type="flex" align="middle">
      <el-col :span="24" class="knowledge-main-header">
        <span v-if="this.itemContent.content.updated_time!=''" class="knowledge-main-header-word"><i class="el-icon-time"></i> {{$t('knowledge.lastUpdated') + this.itemContent.content.updated_time}} </span> 
        <span v-else-if="this.itemContent.knowledge_item_id!=0" class="knowledge-main-header-word"><i class="el-icon-time"></i> {{$t('knowledge.notYetSaved') }} </span> 
        <span v-else class="knowledge-main-header-word"><i class="el-icon-time"></i> </span> 
        <template v-if="this.editType === 'doc'">
          <el-link class="knowledge-main-header-link" icon="el-icon-s-promotion" :underline="false" @click="handleSave('publish')">发布</el-link> 
          <el-link class="knowledge-main-header-link" icon="el-icon-success" :underline="false" @click="handleSave('save')">保存</el-link>
        </template>
        <template v-else-if="this.editType === 'note'">
          <el-link class="knowledge-main-header-link" icon="el-icon-success" :underline="false" @click="handleSave('publish')">保存发布</el-link>
        </template>
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
import { createKnowledgeItem, fetchKnowledgeItemList, fetchKnowledgeItem, updateKnowledgeItem, deleteKnowledgeItem } from '@/api/knowledgeItem'

export default {
  name: 'knowledgeEditor',
  props: {
    editType: {
      type: String // note or doc
    }
  },
  data() {
    return {
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
        published_version: '',
        content: {
          md: '',
          status: 0,
          version: '',
          updated_time: ''
        }
      },
      updateInfoForm: {
        knowledge_item_id: 0,
        title: '',
        node_change: false,
        parent_id: 0,
        index_change: '', // after or before
        index_related_node: 0
      },
      updateContentForm: {
        knowledge_item_id: 0,
        edit_type: '',
        save_type: '',
        content: ''
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
    handleCreateItemInside(node, data) {
      this.$prompt(this.$t('knowledge.pleaseInputTitle'), this.$t('knowledge.new' + this.typeMap[this.editType]), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel')
      }).then(({ value }) => {
        this.createItem(value, data.knowledge_item_id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('knowledge.cancelCreate') + this.$t('knowledge.' + this.editType)
        })
      })
    },
    handleCreateItem() {
      this.$prompt(this.$t('knowledge.pleaseInputTitle'), this.$t('knowledge.new' + this.typeMap[this.editType]), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel')
      }).then(({ value }) => {
        this.createItem(value, 0)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('knowledge.cancelCreate') + this.$t('knowledge.' + this.editType)
        })
      })
    },
    createItem(title, parentID) {
      var createForm = {
        create_type: this.editType,
        title: title,
        knowledge_id: this.knowledgeID,
        parent_id: parentID
      }
      var token = this.$store.getters.token
      createKnowledgeItem(createForm, token).then(response => {
        this.getList(this.knowledgeID) // 更新侧边列表
        this.getItem(response.data.knowledge_item_id)
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
        this.updateEditorArea()
      })
    },
    updateEditorArea() {
      // 更新编辑器区域
      this.contentEditor.setValue(this.itemContent.content.md)
    },
    handlezSelectItem(data, node) {
      this.getItem(data.knowledge_item_id)
    },
    handleSave(saveType) {
      this.updateContentForm = {
        knowledge_item_id: this.itemContent.knowledge_item_id,
        edit_type: this.editType,
        save_type: saveType,
        content: this.contentEditor.getValue(),
        version: this.itemContent.content.version
      }
      this.updateItemContent(this.itemContent.knowledge_item_id, this.updateContentForm)
    },
    updateItemContent(id, data) {
      updateKnowledgeItem(id, data).then(response => {
        this.$message({
          message: this.$t('common.updateSucceeded'),
          type: 'success'
        })
        this.getItem(data.knowledge_item_id)
      })
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      this.updateInfoForm = {
        knowledge_item_id: draggingNode.data.knowledge_item_id,
        title: draggingNode.data.title,
        node_change: true,
        index_change: dropType, // after before inner
        index_related_node: 0
      }
      if (dropType === 'after' || dropType === 'before') {
        if (dropNode.level === 1) {
          this.updateInfoForm.parent_id = 0
        } else {
          this.updateInfoForm.parent_id = dropNode.parent.data.knowledge_item_id
        }
      } else if (dropType === 'inner') {
        this.updateInfoForm.parent_id = dropNode.data.knowledge_item_id
      }
      this.updateInfoForm.index_related_node = dropNode.data.knowledge_item_id
      this.updateItemInfo(draggingNode.data.knowledge_item_id, this.updateInfoForm)
    },
    updateItemInfo(id, data) {
      updateKnowledgeItem(id, data).then(response => {
        this.$message({
          message: this.$t('common.updateSucceeded'),
          type: 'success'
        })
        this.getList(this.knowledgeID)
      })
    },
    handleEditItemTitle(node, data) {
      this.$prompt(this.$t('knowledge.pleaseInputTitle'), this.$t('knowledge.edit' + this.typeMap[this.editType]), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        inputValue: data.title
      }).then(({ value }) => {
        this.updateInfoForm = {
          knowledge_item_id: data.knowledge_item_id,
          title: value,
          node_change: false
        }
        this.updateItemInfo(data.knowledge_item_id, this.updateInfoForm)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('knowledge.cancelEdit') + this.$t('knowledge.' + this.editType)
        })
      })
    },
    handleDeleteItem(node, data) {
      this.$confirm(this.$t('knowledge.ifDelete') + data.title, this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.deleteItem(data.knowledge_item_id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('common.cancelDelete')
        })
      })
    },
    deleteItem(id) {
      deleteKnowledgeItem(id).then(response => {
        this.$message({
          message: this.$t('common.deleteSucceeded'),
          type: 'success'
        })
        this.getList(this.knowledgeID)
      })
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
<style lang="scss">
.knowledge-aside-tree {
  .aside-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    .hidden{
      visibility: hidden;
    }
  }
  .aside-tree-node:hover .hidden{ 
    visibility: visible;
  }

  .el-tree-node {
    white-space: normal;
    .el-tree-node__content {
      height: 100%;
    }
  }
}
</style>

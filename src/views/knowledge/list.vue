<template>
  <div class="app-container">
    <el-button class="filter-item" style="margin-right: 10px; margin-bottom: 20px" @click="handleCreate('note')" type="small" icon="el-icon-plus">{{$t('knowledge.newNote')}}</el-button>
    <el-button class="filter-item" style="margin-left: 10px; margin-bottom: 20px" @click="handleCreate('doc')" type="small" icon="el-icon-plus">{{$t('knowledge.newDoc')}}</el-button>

    <el-card class="box-card setting-form" shadow="hover" style="margin-bottom: 15px;">
      <div slot="header" class="setting-form-header clearfix">
        <span class="setting-header-title">{{ $t('knowledge.notebook') }}</span>
        <span class="setting-header-subtitle">{{ $t('knowledge.noteDesc') }}</span>
      </div>

      <el-row>
        <el-col :span="4" v-for="item in noteList" :key="item.id" >
          <el-card class="k-card" :body-style="{ padding: '0px' }" shadow="hover">
            <img v-if="item.cover_image_url != ''" :src="item.cover_image_url" class="k-image">
            <img v-else :src="defaultCover" class="k-image">
            <div style="padding: 14px;">
              <a @click="handleUpdate(item.id, 'note')">
                <b>{{ item.name }}</b><el-button type="text" icon="el-icon-edit"></el-button>
              </a>
              <div class="k-bottom clearfix">
                <time class="time">{{ item.last_updated }}</time>
                <el-button type="text" class="k-button" size="mini" round plain @click="handleStartWriting(item.id, 'note')">{{ $t('knowledge.startWrite') }}</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="box-card setting-form" shadow="hover">
      <div slot="header" class="setting-form-header clearfix">
        <span class="setting-header-title">{{ $t('knowledge.documentSet') }}</span>
        <span class="setting-header-subtitle">{{ $t('knowledge.docDesc') }}</span>
      </div>

      <el-row>
        <el-col :span="4" v-for="item in docList" :key="item.id" >
          <el-card class="k-card" :body-style="{ padding: '0px' }" shadow="hover">
            <img v-if="item.cover_image_url != ''" :src="item.cover_image_url" class="k-image">
            <img v-else :src="defaultCover" class="k-image">
            <div style="padding: 14px;">
              <a @click="handleUpdate(item.id, 'doc')">
                <b>{{ item.name }}</b><el-button type="text" icon="el-icon-edit"></el-button>
              </a>
              <div class="k-bottom clearfix">
                <time class="time">{{ item.last_updated }}</time>
                <el-button type="text" class="k-button" size="mini" round plain @click="handleStartWriting(item.id, 'doc')">{{ $t('knowledge.startWrite') }}</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog :title="$t('knowledge.'+statusMap[dialogStatus]+typeMap[typeStatus])" :visible.sync="showDialogForm">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="medium" class="ruleFrom">
          <el-form-item :label="$t('knowledge.knowledgeType')" prop="type">
              <span>{{ $t('knowledge.'+ ruleForm.type) }}</span>
          </el-form-item>

          <el-form-item :label="$t('knowledge.knowledgeName')" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>

          <el-form-item :label="$t('knowledge.knowledgeSlug')" prop="slug">
              <el-input v-model="ruleForm.slug"></el-input>
          </el-form-item>

          <el-form-item :label="$t('knowledge.knowledgeDescription')" prop="description">
            <el-input type="textarea" rows="5" v-model="ruleForm.description"></el-input>
            <p class="setting-form-desc">{{ $t('knowledge.knowledgeDescriptionDesc') }}</p>
          </el-form-item>

          <el-form-item :label="$t('knowledge.knowledgeCoverImage')">
                  <el-upload
                    ref="upload"
                    :action="uploadUrl"
                    :headers="uploadHeaders"
                    :data="uploadParams"
                    :auto-upload="false" 
                    :limit="limitUploadNumber"
                    :on-success="uploadSuccess"
                    :on-remove="handleRemove"
                    list-type="picture">
                    <el-button slot="trigger" size="mini" type="primary">选择图片</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                  </el-upload>
                  <p class="setting-form-desc">{{ $t('knowledge.knowledgeCoverImageDesc') }}</p>
          </el-form-item>

          <el-form-item v-if="JSON.stringify(coverImagesList) !== '{}'">
            <div class="block">
              <el-divider content-position="left">当前封面图</el-divider>
              <el-image :src="coverImagesList.url" fit="contain">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </el-form-item>

          <el-form-item>
              <el-button v-if="dialogStatus=='create'" type="primary" @click="submitKnowledge">{{$t('knowledge.createNow')}}</el-button>
              <el-button v-else type="primary" @click="submitUpdateKnowledge">{{$t('common.save')}}</el-button>
              <el-button v-if="dialogStatus=='create'" @click="resetForm('ruleForm')">{{$t('common.reset')}}</el-button>
              <el-button v-else @click="showDialogForm = false">{{$t('common.cancel')}}</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
import defaultCover from '@/assets/images/write.png'
import { fetchKnowledgeList, createKnowledge, fetchKnowledge, updateKnowledge } from '@/api/knowledge'
import { getInfo } from '@/api/login'

export default {
  name: 'knowledge-list',
  data() {
    return {
      defaultCover,
      noteList: null,
      docList: null,
      ruleForm: {
        id: undefined,
        name: '',
        slug: '',
        type: '',
        description: '',
        cover_image: 0
      },
      showDialogForm: false,
      dialogStatus: '', // update or create
      statusMap: {
        update: 'edit',
        create: 'create'
      },
      typeStatus: '', // note or doc
      typeMap: {
        note: 'Note',
        doc: 'Doc'
      },
      limitUploadNumber: 1,
      uploadUrl: process.env.BASE_API + '/media',
      uploadHeaders: {
        Authorization: ''
      },
      uploadParams: {
        userId: '',
        usage: 'cover'
      },
      rules: {
        name: [
          { required: true, message: this.$t('knowledge.pleaseInputName'), trigger: ['blur', 'change'] },
          { max: 200, message: this.$t('knowledge.pleaseCheckNameLength'), trigger: ['blur', 'change'] }
        ],
        slug: [
          { max: 200, message: this.$t('knowledge.pleaseCheckSlugLength'), trigger: ['blur', 'change'] }
        ],
        description: [
          { max: 500, message: this.$t('knowledge.pleaseCheckDescriptionLength'), trigger: ['blur', 'change'] }
        ]
      },
      coverImagesList: {}
    }
  },
  created() {
    this.setTitle()
    this.getList()
    this.handleUploadAuth()
  },
  methods: {
    setTitle() {
      document.title = this.$t('route.' + this.$route.meta.title) + ' | Puti'
    },
    resetForm(formName) {
      if (this.$refs.upload !== undefined) {
        this.$refs.upload.clearFiles()
      }
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
      if (JSON.stringify(this.coverImagesList) !== '{}') {
        this.coverImagesList = {}
      }
    },
    handleUploadAuth() {
      var token = this.$store.getters.token
      this.uploadHeaders.Authorization = 'Bearer ' + token
      getInfo(token).then(response => {
        this.uploadParams.userId = response.data.id
      })
    },
    handleRemove(file, fileList) {
      this.$notify.info({
        title: this.$t('knowledge.cancelImage'),
        message: this.$t('knowledge.uploadAgainTips'),
        duration: 3000
      })
    },
    uploadSuccess(response, file, fileList) {
      if (response.code === 0) {
        this.$notify.info({
          title: this.$t('knowledge.uploadCoverSuccess'),
          message: this.$t('knowledge.creatingKnowledgeNow'),
          duration: 2000
        })
        this.ruleForm.cover_image = response.data.id

        if (this.dialogStatus === 'create') {
          this.createKnowledge()
        } else if (this.dialogStatus === 'update') {
          this.updateKnowledge()
        }
      }
    },
    handleCreate(type) {
      console.log(this.$refs.upload)
      this.resetForm('ruleForm') // reset form
      this.dialogStatus = 'create'
      this.typeStatus = type
      this.showDialogForm = true
      this.ruleForm.type = this.typeStatus
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    createKnowledge() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          createKnowledge(this.ruleForm).then(response => {
            this.getList()
            this.showDialogForm = false
            this.$message({
              message: this.$t('common.createSucceeded'),
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    updateKnowledge() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          updateKnowledge(this.ruleForm.id, this.ruleForm).then(response => {
            this.getList()
            this.showDialogForm = false
            this.$message({
              message: this.$t('common.updateSucceeded'),
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    submitUpdateKnowledge() {
      if (this.$refs.upload.uploadFiles[0]) {
        this.$refs.upload.submit()
      } else {
        this.updateKnowledge()
      }
    },
    submitKnowledge() {
      if (this.$refs.upload.uploadFiles[0]) {
        this.$refs.upload.submit()
      } else {
        this.createKnowledge()
      }
    },
    getList() {
      fetchKnowledgeList().then(response => {
        this.noteList = response.data['note']
        this.docList = response.data['doc']
      })
    },
    handleUpdate(kID, type) {
      if (this.$refs.upload) {
        console.log(this.$refs.upload.uploadFiles[0])
      }
      // get info by id
      fetchKnowledge(kID).then(response => {
        this.ruleForm.id = response.data.id
        this.ruleForm.name = response.data.name
        this.ruleForm.slug = response.data.slug
        this.ruleForm.description = response.data.description

        // if now has a cover
        if (response.data.cover_image_id !== 0) {
          this.ruleForm.cover_image = response.data.cover_image_id
          this.coverImagesList = {
            name: response.data.cover_image_name,
            url: response.data.cover_image_url
          }
        }
      })
      this.resetForm('ruleForm') // reset form
      this.dialogStatus = 'update'
      this.typeStatus = type
      this.ruleForm.type = this.typeStatus
      this.showDialogForm = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    handleStartWriting(id, editType) {
      this.$router.push({ path: '/knowledge/edit/' + editType + '/' + id })
    }
  }
}
</script>

<style>
  .k-card{
    margin-right: 15px;
  }

  .k-image {
    width: 100%;
    display: block;
  }

  .k-button {
    float: right;
  }
</style>
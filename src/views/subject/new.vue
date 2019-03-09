<template >
  <div class="app-container">
    <el-card class="box-card setting-form" shadow="hover">
    <div slot="header" class="setting-form-header clearfix">
      <span class="setting-header-title">{{ $t('subject.newSubject') }}</span>
      <span class="setting-header-subtitle">{{ $t('subject.newSubjectDesc') }}</span>
    </div>

      <el-form ref="form" :model="form" label-width="150px">
        <div class="setting-form-body">
          <el-row>
            <el-col :span="14" :offset="2">
                <el-form-item :label="$t('subject.subjectName')">
                  <el-input v-model="form.name"></el-input>
                  <p class="setting-form-desc">{{ $t('subject.subjectNameDesc') }}</p>
                </el-form-item>

                <el-form-item :label="$t('subject.subjectSlug')">
                  <el-input v-model="form.slug"></el-input>
                  <p class="setting-form-desc">{{ $t('subject.subjectSlugDesc') }}</p>
                </el-form-item>

                <el-form-item :label="$t('subject.parentSubject')">
                    <el-cascader
                        :placeholder="$t('subject.parentSubjectPlaceholder')"
                        :options="parentData"
                        :props="parentProps"
                        @change="handleChangeParent"
                        change-on-select
                        clearable>
                    </el-cascader>
                    <p class="setting-form-desc">{{ $t('subject.parentSubjectDesc') }}</p>
                </el-form-item>

                <el-form-item :label="$t('subject.subjectCoverPicture')">
                  <el-upload
                    ref="upload"
                    :action="uploadUrl"
                    :headers="uploadHeaders"
                    :data="uploadParams"
                    :auto-upload="false" 
                    :limit="limitUploadNumber"
                    :on-success="uploadSuccess"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    list-type="picture">
                    <el-button slot="trigger" size="mini" type="primary">选择图片</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                  </el-upload>
                  <p class="setting-form-desc">{{ $t('subject.subjectCoverPictureDesc') }}</p>
                </el-form-item>

                <el-form-item :label="$t('subject.subjectDescription')" prop="description">
                    <el-input type="textarea" rows="5" v-model="form.description"></el-input>
                    <p class="setting-form-desc">{{ $t('subject.subjectDescriptionDesc') }}</p>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row class="setting-form-footer">
            <el-col :span="14" :offset="4">
              <el-button type="primary" size="small" @click="submitSubject">{{ $t('common.confirm') }}</el-button>
              <el-button size="small" @click="resetInput">{{ $t('common.reset') }}</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
  </el-card>
  </div>
</template>

<script>
import { fetchList, createSubject } from '@/api/subject'
import { getInfo } from '@/api/login'

export default {
  name: 'subject-new',
  data() {
    return {
      form: {
        name: '',
        slug: '',
        parent_id: 0,
        cover_image: 0,
        description: ''
      },
      parentData: [],
      parentProps: {
        label: 'name',
        value: 'id'
      },
      fileList: [],
      limitUploadNumber: 1,
      uploadUrl: process.env.BASE_API + '/media',
      uploadHeaders: {
        Authorization: ''
      },
      uploadParams: {
        userId: '',
        usage: 'cover'
      }
    }
  },
  created() {
    this.setTitle()
    this.getParentList()
    this.handleUploadAuth()
  },
  methods: {
    setTitle() {
      document.title = this.$t('route.' + this.$route.meta.title) + ' | Puti'
    },
    getParentList() {
      fetchList().then(response => {
        this.parentData = response.data
      })
    },
    handleChangeParent(value) {
      if (value.length > 0) {
        this.form.parent_id = value[value.length - 1]
      } else {
        this.form.parent_id = 0
      }
    },
    handleUploadAuth() {
      var token = this.$store.getters.token
      this.uploadHeaders.Authorization = 'Bearer ' + token
      getInfo(token).then(response => {
        this.uploadParams.userId = response.data.id
      })
    },
    submitSubject() {
      if (this.$refs.upload.uploadFiles[0]) {
        this.$refs.upload.submit()
      } else {
        this.createSubject()
      }
    },
    resetInput() {
    },
    handleRemove(file, fileList) {
      this.$notify.info({
        title: this.$t('subject.cancelImage'),
        message: this.$t('subject.uploadAgainTips'),
        duration: 3000
      })
    },
    uploadSuccess(response, file, fileList) {
      if (response.code === 0) {
        this.$notify.info({
          title: this.$t('subject.uploadCoverSuccess'),
          message: this.$t('subject.creatingSubjectNow'),
          duration: 2000
        })
        this.form.cover_image = response.data.id
        this.createSubject()
      }
    },
    createSubject() {
      createSubject(this.form).then(response => {
        this.$notify.success({
          title: this.$t('common.operationSucceeded'),
          message: this.$t('subject.createSubjectSuccess'),
          duration: 3000
        })
        this.$router.push({ path: '/subject/manage' })
      })
    }
  }
}
</script>

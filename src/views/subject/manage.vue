<template>
    <div class="app-container">
        <tree-table :data="data" :columns="columns" defaultExpandAll max-height="800" v-loading="listLoading" border>
            <template slot="action" slot-scope="{scope}">
              <el-button type="primary" @click="handleEditSubject(scope.row.id)" icon="el-icon-edit" size="mini" circle></el-button>
              <el-button v-if="scope.row.children == null" type="danger"  @click="handleDelete(scope.row)" icon="el-icon-delete" size="mini" circle></el-button>
            </template>
        </tree-table>

        <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" width="70%" @open="openUpdateDialog" @close="closeUpdateDialog">
          <el-form :model="editForm" size="small" :label-position="labelPosition" label-width="100px">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="16" :xl="16">
                  <el-form-item :label="$t('subject.subjectName')">
                    <el-input v-model="editForm.name"></el-input>
                    <p class="setting-form-desc">{{ $t('subject.subjectNameDesc') }}</p>
                  </el-form-item>

                  <el-form-item :label="$t('subject.subjectSlug')">
                    <el-input v-model="editForm.slug"></el-input>
                    <p class="setting-form-desc">{{ $t('subject.subjectSlugDesc') }}</p>
                  </el-form-item>

                  <el-form-item :label="$t('subject.parentSubject')">
                    <el-cascader
                      :placeholder="$t('subject.parentSubjectPlaceholder')"
                      :options="data"
                      :props="parentProps"
                      @change="handleChangeParent"
                      v-model="updateParentId" 
                      change-on-select
                      clearable>
                    </el-cascader>
                    <p class="setting-form-desc">{{ $t('subject.parentSubjectDesc') }}</p>
                  </el-form-item>

                  <el-form-item :label="$t('subject.subjectDescription')">
                    <el-input type="textarea" rows="5" v-model="editForm.description"></el-input>
                    <p class="setting-form-desc">{{ $t('subject.subjectDescriptionDesc') }}</p>
                  </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="8" :xl="8">
                <el-form-item :label="$t('subject.subjectCoverPictureNow')">
                  <div v-if="nowCoverPicture.id === 0">
                    无
                  </div>
                  <div v-else>
                    <span v-if="nowCoverPicture.status != ''">{{ nowCoverPicture.status }}</span>
                    <img v-else :src="nowCoverPicture.url">
                  </div> 
                </el-form-item>
                <el-form-item :label="$t('subject.subjectCoverPictureChange')">
                  <el-upload
                    ref="upload"
                    :action="uploadUrl"
                    :headers="uploadHeaders"
                    :data="uploadParams"
                    :auto-upload="false" 
                    :limit="limitUploadNumber"
                    :on-success="uploadSuccess"
                    :on-remove="handleRemove"
                    :file-list="editDialogImgFileList"
                    list-type="picture">
                    <el-button slot="trigger" size="mini" type="primary">选择图片</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                  </el-upload>
                  <p class="setting-form-desc">{{ $t('subject.subjectCoverPictureDesc') }}</p>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="submitUpdate()">{{ $t('common.confirm') }}</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import { fetchList, fetchSubject, updateSubject } from '@/api/subject'
import { getInfo } from '@/api/login'
import treeTable from '@/components/TreeTable'

export default {
  name: 'subject-list',
  components: { treeTable },
  data() {
    return {
      columns: [
        {
          label: this.$t('subject.name'),
          key: 'name',
          expand: true,
          width: 230,
          align: 'left'
        },
        {
          label: this.$t('subject.slug'),
          key: 'slug',
          width: 200,
          align: 'left'
        },
        {
          label: this.$t('subject.description'),
          key: 'description',
          align: 'left'
        },
        {
          label: this.$t('subject.lastUpdated'),
          key: 'last_updated',
          width: 200,
          align: 'center'
        },
        {
          label: this.$t('subject.totalPost'),
          key: 'count',
          width: 100,
          align: 'center'
        },
        {
          label: this.$t('common.action'),
          key: 'action',
          width: 150,
          align: 'center'
        }
      ],
      data: [],
      listLoading: true,
      labelPosition: 'right',
      editDialogVisible: false,
      editDialogTitle: 'Edit',
      editForm: {
        id: undefined,
        name: '',
        slug: '',
        parent_id: 0,
        cover_image: 0,
        description: ''
      },
      editDialogImgFileList: [],
      parentProps: {
        label: 'name',
        value: 'id'
      },
      updateParentId: [],
      nowCoverPicture: {},
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
    this.getList()
  },
  methods: {
    setTitle() {
      document.title = this.$t('route.' + this.$route.meta.title) + ' | Puti'
    },
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        this.data = response.data
        this.listLoading = false
      })
    },
    handleUploadAuth() {
      var token = this.$store.getters.token
      this.uploadHeaders.Authorization = 'Bearer ' + token
      getInfo(token).then(response => {
        this.uploadParams.userId = response.data.id
      })
    },
    handleEditSubject(id) {
      // this.$router.push({ path: '/subject/edit/' + id })
      fetchSubject(id).then(response => {
        this.editForm.id = response.data.id
        this.editForm.name = response.data.name
        this.editForm.slug = response.data.slug
        this.editForm.parent_id = response.data.parent_id
        this.editForm.cover_image = response.data.cover_image
        this.editForm.description = response.data.description
        this.updateParentId = this.getParentArr(response.data)
        this.nowCoverPicture = {
          id: response.data.cover_image,
          name: response.data.name,
          url: response.data.cover_url,
          status: response.data.cover_image_status
        }

        this.editDialogVisible = true
        this.editDialogTitle = response.data.name
      })
    },
    handleParent(result, id, parentArr) {
      for (var i = 0; i <= result.length - 1; i++) {
        if (result[i] !== undefined && i === id) {
          parentArr.push(result[i])
          parentArr = this.handleParent(result, result[i], parentArr)
          break
        }
      }
      return parentArr
    },
    getParentArr(termData) {
      var parentArr = []
      if (termData.parent_id !== 0) {
        var result = this.getParent(this.data, termData.parent_id, [])
        parentArr.push(result[0])
        parentArr = this.handleParent(result, result[0], parentArr)
      }
      return parentArr
    },
    getParent(data, parentID, result) {
      var parent = this.getUpdateParentId(data, parentID, [])
      result[parent.parent_id] = parent.id
      if (parent.parent_id !== 0) {
        result = this.getParent(data, parent.parent_id, result)
      }
      return result
    },
    getUpdateParentId(data, parentID, result) {
      for (var i = 0; i <= data.length - 1; i++) {
        if (parentID === data[i].id) {
          result['id'] = data[i].id
          result['parent_id'] = data[i].parent_id
          if (data[i].parent_id !== 0) {
            result = this.getUpdateParentId(data, data[i].parent_id, result)
          }
          break
        }
        if (data[i].children !== null) {
          result = this.getUpdateParentId(data[i].children, parentID, result)
        }
      }
      return result
    },
    handleChangeParent(value) {
      if (value.length > 0) {
        var selectedParentId = value[value.length - 1]
        if (this.editForm.id === selectedParentId) {
          this.updateParentId = []
          this.$message.error(this.$t('subject.parentCannotBeSelf'))
        }
        this.editForm.parent_id = selectedParentId
      } else {
        this.editForm.parent_id = 0
      }
      console.log(this.editForm)
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
          message: this.$t('subject.updatingSubjectNow'),
          duration: 2000
        })
        this.editForm.cover_image = response.data.id
        this.updateSubject()
      }
    },
    submitUpdate() {
      if (this.$refs.upload.uploadFiles[0]) {
        this.$refs.upload.submit()
      } else {
        this.updateSubject()
      }
    },
    updateSubject() {
      this.editDialogVisible = false
      updateSubject(this.editForm.id, this.editForm).then(response => {
        this.$notify.success({
          title: this.$t('common.operationSucceeded'),
          message: this.$t('subject.updateSubjectSuccess'),
          duration: 3000
        })
        this.getList()
      })
    },
    openUpdateDialog() {
      this.handleUploadAuth()
    },
    closeUpdateDialog() {
      this.editDialogImgFileList = []
    }
  }
}
</script>

<style>

</style>
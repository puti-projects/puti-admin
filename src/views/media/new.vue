<template>
    <div class="app-container">
        <el-upload
            class="media-upload"
            drag
            :action="uploadUIrl"
            :headers="uploadHeaders"
            :data="uploadParams"
            list-type="picture"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            name="file"
            :file-list="fileList"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip"><i class="el-icon-warning"></i> 只能上传图片或视频文件</div>
        </el-upload>
    </div>
</template>

<script>
import { getInfo } from '@/api/login'
import { deleteMedia } from '@/api/media'

export default {
  name: 'profile',
  data() {
    return {
      uploadUIrl: process.env.BASE_API + '/media',
      uploadHeaders: {
        // 上传header设置
        Authorization: ''
      },
      uploadParams: {
        // 上传附带其它参数
        userId: ''
      },
      fileList: []
    }
  },
  created() {
    this.getInfo()
    this.setTitle()
  },
  methods: {
    setTitle() {
      document.title = this.$t('route.' + this.$route.meta.title) + ' | Puti'
    },
    getInfo() {
      var token = this.$store.getters.token
      this.uploadHeaders.Authorization = 'Bearer ' + token

      getInfo(token).then(response => {
        this.uploadParams.userId = response.data.id
      })
    },
    uploadSuccess(response, file, fileList) {
      if (response.code === 0) {
        this.$message({
          message: this.$t('media.uploadSucceeded'),
          type: 'success',
          duration: 3000
        })
        file.id = response.data.id
      } else {
        this.$message.error({
          message: this.$t('media.uploadFailed') + response.message,
          duration: 3000
        })
      }
    },
    handleRemove(file, fileList) {
    },
    beforeRemove(file, fileList) {
      this.$confirm(this.$t('media.checkToDeleteMedia') + this.$t('media.fileName') + ':' + file.name, this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        deleteMedia(file.id).then(response => {
          if (response.code === 0) {
            this.$message({
              message: this.$t('common.deleteSucceeded'),
              type: 'success',
              duration: 3000
            })
            file.id = response.data.id
          } else {
            this.$message.error({
              message: this.$t('common.operationFailed') + response.message,
              duration: 3000
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('common.cancelDelete')
        })
      })
    }
  }
}

</script>

<style>
.el-upload{
  width: 100%;
}
.el-upload-dragger{
  border: 2px dashed #d9d9d9;
  width: 100%;
}
.el-upload__tip{
  margin-left: 5px;
  font-size: 14px;
  color: rgb(17, 51, 109)
}
</style>

<style scoped>
.media-upload{
  
}
</style>

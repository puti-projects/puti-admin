<template>
    <div class="app-container">
        <el-upload
            class="media-upload"
            drag
            :action="uploadUIrl"
            :headers="uploadHeaders"
            :data="uploadParams"
            list-type="picture"
            name="file"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip"><i class="el-icon-warning"></i> 只能上传图片或视频文件</div>
        </el-upload>
    </div>
</template>

<script>
import { getInfo } from '@/api/login'

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
      }
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

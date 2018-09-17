<template>
    <div class="app-container">
        <el-row v-loading.body="listLoading">
            <el-col :xs="24" :sm="8" :md="4" :xl="3" v-for="item in list" :key="item.id">
                <el-card class="media-card" :body-style="{ padding: '0px' }">
                  <img v-if="item.type === 'picture'" :src="item.url" class="media-image">
                  <div v-else  class="media-other-file" icon="el-icon-document"><svg-icon class="media-other-file-svg" icon-class="article"></svg-icon></div>
                  <div style="padding: 8px; width:100%">
                      <el-button type="text" class="media-title" @click="handleDetail(item)">{{ item.title }}</el-button>
                      <div class="media-bottom clearfix">
                        <time class="media-time">{{ item.upload_time }}</time>
                        <el-button class="media-button" @click="handleDelete(item)">
                          <i class="el-icon-delete"></i>
                        </el-button>
                      </div>
                  </div>
                </el-card>
            </el-col>
        </el-row>

        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
            :page-sizes="[16, 24, 32, 40]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="15" :xl="15" class="media-detail-left">
              <div v-if="detailForm.type == 'picture'" class="grid-content">
                <img :src="detailForm.url" class="media-detail-image">
              </div>
              <div v-else class="grid-content">未知类型</div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="9" :xl="9">
              <div class="grid-content">
                <el-form :model="detailForm">
                  <el-form-item label="标题">
                    <el-input v-model="detailForm.title"></el-input>
                  </el-form-item>
                  <el-form-item label="缩略名">
                    <el-input v-model="detailForm.slug"></el-input>
                  </el-form-item>
                  <el-form-item label="链接">
                    <el-tooltip effect="dark" content="复制到粘贴板" placement="right-end">
                      <el-button type="text" size="mini" @click='handleCopy(detailForm.url,$event)' class="media-url-copy el-icon-document"></el-button>
                    </el-tooltip>
                    <el-input v-model="detailForm.url" disabled="disabled"></el-input>
                  </el-form-item>
                  <el-form-item label="描述">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入描述" v-model="detailForm.description"></el-input>
                  </el-form-item>
                  <el-form-item label="上传时间">
                    <span>{{ detailForm.uploadTime }}</span>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="handleUpdate()">修改</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </el-dialog>

    </div>
</template>

<script>
import clip from '@/utils/clipboard'
import { fetchList, fetchMedia, deleteMedia, updateMedia } from '@/api/media'

export default {
  name: 'mediaLiarary',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 24
      },
      dialogVisible: false,
      dialogTitle: 'File',
      detailForm: {
        id: undefined,
        title: '',
        slug: '',
        url: '',
        type: '',
        uploadTime: '',
        description: ''
      }
    }
  },
  created() {
    this.getList()
    this.setTitle()
  },
  methods: {
    setTitle() {
      document.title = this.$t('route.' + this.$route.meta.title) + ' | Puti'
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.mediaList
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleDelete(item) {
      this.$confirm(this.$t('media.checkToDeleteMedia') + this.$t('media.fileName') + ':' + item.title, this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        deleteMedia(item.id).then(response => {
          if (response.code === 0) {
            this.$message({
              message: this.$t('common.deleteSucceeded'),
              type: 'success',
              duration: 3000
            })
            const index = this.list.indexOf(item)
            this.list.splice(index, 1)
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
    },
    handleDetail(item) {
      fetchMedia(item.id).then(response => {
        if (response.code === 0) {
          this.detailForm.id = response.data.id
          this.detailForm.title = response.data.title
          this.detailForm.slug = response.data.slug
          this.detailForm.url = response.data.url
          this.detailForm.type = response.data.type
          this.detailForm.uploadTime = response.data.upload_time
          this.detailForm.description = response.data.description

          this.dialogVisible = true
          this.dialogTitle = item.title
          this.dialogImgPreviewUrl = item.url
        } else {
          this.$message.error({
            message: this.$t('media.getDetailFailed') + response.message,
            duration: 3000
          })
        }
      })
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    clipboardSuccess() {
      this.$message({
        message: 'Copy successfully',
        type: 'success',
        duration: 1500
      })
    },
    handleUpdate() {
      var updateData = { title: this.detailForm.title, slug: this.detailForm.slug, description: this.detailForm.description }
      updateMedia(this.detailForm.id, updateData).then(response => {
        if (response.code === 0) {
          this.$message({
            message: '更新成功',
            type: 'success',
            duration: 3000
          })
          this.dialogVisible = false
          this.getList()
        } else if (response.code === 20203) {
          this.$message.error({
            message: '标题不能为空',
            duration: 3000
          })
        } else {
          this.$message.error({
            message: this.$t('common.updateFailed') + response.message,
            duration: 3000
          })
        }
      })
    }
  }
}
</script>

<style>
  .media-card{
    margin: 10px;
  }

  .media-title{
    display: inline-block;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width:100%;
    padding: 0;
    text-align: left;
  }

  .media-time {
    font-size: 13px;
    color: #999;
  }
  
  .media-bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .media-button {
    padding: 0;
    float: right;
    border: 0;
    color: #F56C6C;
  }

  .media-button:hover {
    color: rgb(255, 0, 0);
    background-color: #fff;
  }

  .media-button:focus{
    color: #fff;
    background-color: rgb(255, 0, 0);
  }

  .media-image {
    width: 100%;
    height: 180px;
    display: block;
  }

  .media-other-file{
    width: 100%;
    height: 180px;
    display: block;
  }

  .media-other-file-svg{
    display: block;
    font-size: 140px;
    margin: 0 auto;
    padding-top: 40px;
    color: #5B584A;
    overflow: hidden;
  }

  .media-detail-image{
    margin: 0 auto;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .media-url-copy{
    color: #999
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
<template>
    <div class="app-container">
        <el-row v-loading.body="listLoading">
            <el-col :xs="24" :sm="8" :md="4" :xl="3" v-for="item in list" :key="item.id">
                <el-card class="media-card" :body-style="{ padding: '0px' }">
                  <img v-if="item.type === 'picture'" :src="item.url" class="media-image">
                  <div v-else  class="media-other-file" icon="el-icon-document"><svg-icon class="media-other-file-svg" icon-class="article"></svg-icon></div>
                  <div style="padding: 8px; width:100%">
                      <span class="media-title">{{ item.title }}</span>
                      <div class="media-bottom clearfix">
                        <time class="media-time">{{ item.upload_time }}</time>
                        <el-button class="media-button" @click="deleteMedia(item.id)">
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
    </div>
</template>

<script>
import { fetchList } from '@/api/media'

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
      deleteLoading: false
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

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
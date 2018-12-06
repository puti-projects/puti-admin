<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('post.title')" v-model="listQuery.title">
      </el-input>
      <el-select clearable style="width: 100px" class="filter-item" v-model="listQuery.status" :placeholder="$t('post.status')">
        <el-option v-for="item in statusOptions" :key="item" :label="$t('post.' + item)" :value="item">
        </el-option>
      </el-select>
      <el-select @change='handleFilter' style="width: 150px" class="filter-item" v-model="listQuery.sort">
        <el-option v-for="item in sortOptions" :key="item" :label="$t('common.' + item)" :value="item">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('common.search')}}</el-button>
      <router-link :to="'/article/new'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">{{$t('common.add')}}</el-button>
      </router-link>
   </div>

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('common.ID')" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" :label="$t('post.date')">
        <template slot-scope="scope">
          <span>{{scope.row.post_date}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" :label="$t('post.title')">
        <template slot-scope="scope">
          <router-link class="link-type" :to="'/article/edit/'+scope.row.id">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" :label="$t('post.author')">
        <template slot-scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" :label="$t('post.comments')" width="95">
        <template slot-scope="scope">
          <span>{{scope.row.comment_count}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('post.views')" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.view_count">{{scope.row.view_count}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" :label="$t('post.status')" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            <div v-if="scope.row.status === 'publish'">
              <i class="el-icon-check"></i> {{$t('post.publish')}}
            </div>
            <div v-else-if="scope.row.status === 'draft'">
              <i class="el-icon-edit-outline"></i> {{$t('post.draft')}}
            </div>
            <div v-else-if="scope.row.status === 'deleted'">
              <i class="el-icon-delete"></i> {{$t('post.deleted')}}
            </div>
            <div v-else>
              {{$t('common.error')}}
            </div>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('post.action')" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEditArticle(scope.row.id)">{{$t('common.edit')}}</el-button>

          <template v-if="scope.row.status=='deleted'">
            <el-button size="mini" type="warning" @click="handleDelete(scope.row)" icon="el-icon-delete">
              {{$t('common.remove')}}
            </el-button>
            <el-button size="mini" type="info" @click="handleRestoreArticle(scope.row)" icon="el-icon-delete">
                {{$t('common.restore')}}
            </el-button>
          </template>
          <el-button v-else size="mini" type="danger" @click="handleTrashArticle(scope.row)" icon="el-icon-delete">
              {{$t('common.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10, 15, 20, 30, 50]" :page-size="listQuery.number" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { fetchList, deleteArticle, updateArticle } from '@/api/article'

export default {
  name: 'articleList',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        number: 15,
        title: undefined,
        sort: 'DESC',
        status: undefined
      },
      sortOptions: ['DESC', 'ASC'],
      statusOptions: ['publish', 'draft', 'deleted']
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        publish: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
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
        this.list = response.data.articleList
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.number = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleTrashArticle(row) {
      this.$confirm(this.$t('post.checkToTrashArticle'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        var trashForm = { id: row.id, status: 'deleted' }
        updateArticle(trashForm).then(response => {
          if (response.code === 0) {
            this.$message({
              message: this.$t('common.operationSucceeded'),
              type: 'success',
              duration: 2000
            })
            this.getList()
          } else {
            this.$message.error(response.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('common.cancelDelete')
        })
      })
    },
    handleRestoreArticle(row) {
      var restoreForm = { id: row.id, status: 'restore' }
      updateArticle(restoreForm).then(response => {
        if (response.code === 0) {
          this.$message({
            message: this.$t('common.operationSucceeded') + this.$t('post.restoreArticleSucceeded'),
            type: 'success',
            duration: 3000
          })
          this.getList()
        } else {
          this.$message.error(response.message)
        }
      })
    },
    handleDelete(row) {
      this.$confirm(this.$t('post.checkToDeleteArticle'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        deleteArticle(row.id).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: this.$t('common.removeSucceeded')
            })
            this.getList()
          } else {
            this.$message.error(this.$t('common.operationFailed') + response.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('common.cancelRemove')
        })
      })
    },
    handleEditArticle(id) {
      this.$router.push({ path: '/article/edit/' + id })
    }
  }
}
</script>

<template>
  <div class="app-container">

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" :label="$t('post.author')">
        <template slot-scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" :label="$t('post.title')">
        <template slot-scope="scope">
          <router-link class="link-type" :to="'/example/edit/'+scope.row.id">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" :label="$t('post.date')">
        <template slot-scope="scope">
          <span>{{scope.row.post_date | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      
      <el-table-column class-name="status-col" :label="$t('post.status')" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            <div v-if="scope.row.status === 'publish'">
              {{$t('post.publish')}}
            </div>
            <div v-else-if="scope.row.status === 'draft'">
              {{$t('post.draft')}}
            </div>
            <div v-else-if="scope.row.status === 'deleted'">
              {{$t('post.deleted')}}
            </div>
            <div v-else>
              Not A/B/C
            </div>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('post.action')" width="120">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">{{$t('post.edit')}}</el-button>
          </router-link>
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
import { fetchList } from '@/api/article'

export default {
  name: 'articleList',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        number: 15
      }
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
    handleSizeChange(val) {
      this.listQuery.number = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>

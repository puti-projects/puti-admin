<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('user.username')" v-model="listQuery.username">
      </el-input>
      <el-select clearable style="width: 100px" class="filter-item" v-model="listQuery.status" :placeholder="$t('user.status')">
        <el-option v-for="item in statusOptions" :key="item.label" :label="$t('user.' + item.label)" :value="item.key">
        </el-option>
      </el-select>
      <el-select clearable style="width: 150px" class="filter-item" v-model="listQuery.role">
        <el-option v-for="item in roleOptions" :key="item" :label="$t('user.' + item)" :value="item">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('common.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('common.add')}}</el-button>
   </div>

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('common.ID')" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" :label="$t('user.username')">
        <template slot-scope="scope">
          <router-link class="link-type" :to="'/example/edit/'+scope.row.id">
            <span>{{ scope.row.nickname }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" :label="$t('user.email')">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" :label="$t('user.registeredTime')">
        <template slot-scope="scope">
          <span>{{scope.row.registered_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" :label="$t('user.role')">
        <template slot-scope="scope">
          <span>{{$t('user.' + scope.row.roles)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" :label="$t('user.status')" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            <div v-if="scope.row.status === 0">
              {{$t('user.normal')}}
            </div>
            <div v-else-if="scope.row.status === 1">
              {{$t('post.freezing')}}
            </div>
            <div v-else>
               {{$t('common.error')}}
            </div>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('post.action')" width="200">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">{{$t('common.edit')}}</el-button>
          </router-link>

            <el-button v-if="scope.row.status==0" size="mini" type="warning" @click="handleModifyStatus(scope.row,'deleted')">
              {{$t('user.freezing')}}
            </el-button>
            <el-button v-else-if="scope.row.status==1" size="mini" type="info" @click="handleModifyStatus(scope.row,'deleted')">
              {{$t('user.defreeze')}}
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
import { fetchList } from '@/api/user'

export default {
  name: 'userList',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        number: 15,
        username: undefined,
        status: undefined,
        role: undefined
      },
      roleOptions: ['administrator', 'writer', 'subscriber'],
      statusOptions: [{ 'label': 'normal', 'key': 0 }, { 'label': 'freezing', 'key': 1 }]
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        normal: 'success',
        freezing: 'warning'
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
        this.list = response.data.userList
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
    }
  }
}
</script>

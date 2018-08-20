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

      <el-table-column min-width="150px" :label="$t('user.account')">
        <template slot-scope="scope">
          <router-link class="link-type" :to="'/example/edit/'+scope.row.id">
            <span>{{ scope.row.account }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" :label="$t('user.nickname')">
        <template slot-scope="scope">
            <span>{{ scope.row.nickname }}</span>
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
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">{{$t('common.edit')}}</el-button>

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

    <el-dialog :title="$t('common.'+textMap[dialogStatus])" :visible.sync="dialogFormVisible">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="medium" class="ruleFrom">
          <el-form-item :label="$t('user.account')" prop="account">
              <el-input  v-if="dialogStatus=='create'" v-model="ruleForm.account"></el-input>
              <el-input  v-else v-model="ruleForm.account" disabled="disabled"></el-input>
          </el-form-item>

          <el-form-item :label="$t('user.nickname')" prop="nickname">
              <el-input v-model="ruleForm.nickname"></el-input>
          </el-form-item>

          <el-form-item :label="$t('user.email')" prop="email">
              <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>

          <el-form-item :label="$t('user.role')" prop="role">
              <el-select v-model="ruleForm.role" :placeholder="$t('user.selectRole')">
              <el-option :label="$t('user.administrator')" value="administrator"></el-option>
              <el-option :label="$t('user.writer')" value="writer"></el-option>
              <el-option :label="$t('user.subscriber')" value="subscriber"></el-option>
              </el-select>
          </el-form-item>
          
          <el-form-item v-if="dialogStatus=='create'" :label="$t('user.password')" prop="password">
              <el-input  v-if="dialogStatus=='create'" type="password"  v-model="ruleForm.password" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item v-if="dialogStatus=='create'" :label="$t('user.passwordAgain')" prop="passwordAgain">
              <el-input type="password"  v-model="ruleForm.passwordAgain" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item :label="$t('user.website')" prop="website">
              <el-input v-model="ruleForm.website"></el-input>
          </el-form-item>
        
          <el-form-item>
              <el-button v-if="dialogStatus=='create'" type="primary" @click="createUser">{{$t('user.createNow')}}</el-button>
              <el-button v-else type="primary" @click="updateUser">{{$t('user.save')}}</el-button>
              <el-button v-if="dialogStatus=='create'" @click="resetForm('ruleForm')">重置</el-button>
              <el-button v-else @click="dialogFormVisible = false">{{$t('common.cancel')}}</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchUser, createUser, updateUser } from '@/api/user'

export default {
  name: 'userList',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.passwordAgain !== '') {
          this.$refs.ruleForm.validateField('passwordAgain')
        }
        callback()
      }
    }
    var validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
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
      statusOptions: [{ 'label': 'normal', 'key': 0 }, { 'label': 'freezing', 'key': 1 }],
      ruleForm: {
        id: undefined,
        account: '',
        nickname: '',
        email: '',
        role: '',
        password: '',
        passwordAgain: '',
        website: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'edit',
        create: 'create'
      },
      rules: {
        account: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 3, message: '账号长度不能小于 3 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: ['blur', 'change'] },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: ['blur'] },
          { min: 6, message: '密码长度不能小于 6 个字符', trigger: ['blur', 'change'] }
        ],
        passwordAgain: [
          { required: true, validator: validateCheckPass, trigger: ['blur'] },
          { min: 6, message: '密码长度不能小于 6 个字符', trigger: ['blur', 'change'] }
        ]
      }
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
    },
    resetRuleForm() {
      this.ruleForm = {
        id: undefined,
        account: undefined,
        nickname: '',
        email: '',
        role: '',
        password: undefined,
        passwordAgain: undefined,
        website: ''
      }
    },
    handleCreate() {
      this.resetRuleForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    createUser() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          createUser(this.ruleForm).then(response => {
            if (response.code === 0) {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                message: '用户创建成功！',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$message.error('创建失败！' + response.message)
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleUpdate(row) {
      // get user info
      fetchUser(row.account).then(response => {
        this.ruleForm.id = response.data.id
        this.ruleForm.account = response.data.account
        this.ruleForm.nickname = response.data.nickname
        this.ruleForm.email = response.data.email
        this.ruleForm.role = response.data.roles
        this.ruleForm.website = response.data.website
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    updateUser() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          updateUser(this.ruleForm).then(response => {
            this.getList()
            // for (const v of this.list) {
            //   if (v.id === this.ruleForm.id) {
            //     const index = this.list.indexOf(v)
            //     this.list.splice(index, 1, this.ruleForm)
            //     break
            //   }
            // }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<template>
    <div class="app-container">
        <el-row :gutter="30">
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <el-form ref="newForm" :model="newForm" label-width="80px" label-position="top" class="new-category-form">
                    <h4>{{ $t('taxonomy.newCategory') }}</h4>
                    <el-form-item :label="$t('taxonomy.taxonomyName')">
                        <el-input v-model="newForm.name"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('taxonomy.taxonomySlug')">
                        <el-input v-model="newForm.slug"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('taxonomy.categoryParent')">
                       <el-cascader
                            :placeholder="$t('taxonomy.categoryNoParents')"
                            :options="dataWithoutDefault"
                            :props="newProps"
                            @change="handleChange"
                            v-model="defaultParentId" 
                            change-on-select
                            clearable>
                        </el-cascader>
                    </el-form-item>
                    <el-form-item :label="$t('taxonomy.taxonomyDesc')">
                        <el-input type="textarea" v-model="newForm.description"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="createCategory()" >{{ $t('common.addNow') }}</el-button>
                        <el-button size="small" plain @click="clearNewForm()">{{ $t('common.clear') }}</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
                <tree-table :data="data" :columns="columns" defaultExpandAll max-height="800" v-loading="listLoading" border>
                    <template slot="action" slot-scope="{scope}">
                      <el-button v-if="scope.row.id != 1" type="primary" @click="handleDetail(scope.row)" icon="el-icon-edit" size="mini" circle></el-button>
                      <el-button v-if="scope.row.children == null && scope.row.id != 1" type="danger"  @click="handleDelete(scope.row)" icon="el-icon-delete" size="mini" circle></el-button>
                    </template>
                </tree-table>
            </el-col>
        </el-row>

        <el-dialog :title="$t('taxonomy.categoryDetail')" :visible.sync="dialogFormVisible">
          <el-form :model="updateForm">
            <el-form-item :label="$t('taxonomy.taxonomyName')">
              <el-input v-model="updateForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('taxonomy.taxonomySlug')">
              <el-input v-model="updateForm.slug" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('taxonomy.categoryParent')">
              <el-cascader
                :placeholder="$t('taxonomy.categoryNoParents')"
                :options="dataWithoutDefault"
                :props="newProps"
                @change="handleChangeUpdate"
                v-model="updateParentId" 
                change-on-select
                clearable>
              </el-cascader>
            </el-form-item>
            <el-form-item :label="$t('taxonomy.taxonomyDesc')">
              <el-input type="textarea" v-model="updateForm.description"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="updateCategory()">{{ $t('common.confirm') }}</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import { fetchList, fetchTaxonomy, createTaxonomy, updateTaxonomy, deleteTaxonomy } from '@/api/taxonomy'
import treeTable from '@/components/TreeTable'

export default {
  name: 'category',
  components: { treeTable },
  data() {
    return {
      columns: [
        {
          label: this.$t('taxonomy.category'),
          key: 'name',
          expand: true,
          width: 200,
          align: 'left'
        },
        {
          label: this.$t('taxonomy.taxonomySlug'),
          key: 'slug',
          width: 200,
          align: 'left'
        },
        {
          label: this.$t('taxonomy.taxonomyDesc'),
          key: 'description',
          align: 'left'
        },
        {
          label: this.$t('taxonomy.articleNumber'),
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
      dataWithoutDefault: [], // without default(unsetting)
      listLoading: true,
      newForm: {
        name: '',
        slug: '',
        description: '',
        parentId: 0
      },
      newProps: {
        label: 'name',
        value: 'term_id'
      },
      dialogFormVisible: false,
      defaultParentId: [],
      updateForm: {
        id: undefined,
        name: '',
        slug: '',
        description: '',
        parentId: 0
      },
      updateParentId: [],
      updateDisabled: false
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
      fetchList({ type: 'category' }).then(response => {
        this.data = response.data
        this.dataWithoutDefault = this.getDataWithoutDefault(response.data)
        this.listLoading = false
      })
    },
    getDataWithoutDefault(data) {
      var dataWithoutDefault = []
      for (var i = 0; i < data.length; i++) {
        if (data[i].term_id === 1 && data[i].slug === 'uncategorized') {
          continue
        }
        dataWithoutDefault.push(data[i])
      }
      return dataWithoutDefault
    },
    handleDetail(row) {
      fetchTaxonomy(row.term_id).then(response => {
        this.dialogFormVisible = true
        this.updateForm.id = response.data.term_id
        this.updateForm.name = response.data.name
        this.updateForm.slug = response.data.slug
        this.updateForm.description = response.data.description
        this.updateForm.parentId = response.data.parent_term_id
        this.updateParentId = this.getParentArr(response.data)
      })
      if (row.children.length > 0) {
        this.updateDisabled = true
      }
    },
    getParentArr(termData) {
      var parentArr = []
      if (termData.parent_term_id !== 0) {
        var result = this.getParent(this.data, termData.parent_term_id, [])
        parentArr.push(result[0])
        parentArr = this.handleParent(result, result[0], parentArr)
      }
      return parentArr
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
    getParent(data, parentID, result) {
      var parent = this.getUpdateParentId(data, parentID, [])
      result[parent.pid] = parent.id
      if (parent.pid !== 0) {
        result = this.getParent(data, parent.pid, result)
      }
      return result
    },
    getUpdateParentId(data, parentID, result) {
      for (var i = 0; i <= data.length - 1; i++) {
        if (parentID === data[i].term_id) {
          result['id'] = data[i].term_id
          result['pid'] = data[i].pid
          if (data[i].pid !== 0) {
            result = this.getUpdateParentId(data, data[i].pid, result)
          }
          break
        }
        if (data[i].children !== null) {
          result = this.getUpdateParentId(data[i].children, parentID, result)
        }
      }
      return result
    },
    handleChange(value) {
      if (value.length > 0) {
        this.newForm.parentId = value[value.length - 1]
      } else {
        this.newForm.parentId = 0
      }
    },
    handleChangeUpdate(value) {
      if (value.length > 0) {
        var selectedParentId = value[value.length - 1]
        if (this.updateForm.id === selectedParentId) {
          this.updateParentId = []
          this.$message.error(this.$t('taxonomy.parentCannotBeSelf'))
        }
        this.updateForm.parentId = selectedParentId
      } else {
        this.updateForm.parentId = 0
      }
    },
    closeUpdateDialog() {
      this.updateDisabled = false
    },
    clearNewForm() {
      this.newForm.name = ''
      this.newForm.slug = ''
      this.newForm.description = ''
      this.newForm.parentId = 0
      this.defaultParentId = []
    },
    createCategory() {
      this.newForm.taxonomy = 'category'
      createTaxonomy(this.newForm).then(response => {
        this.$message({
          message: this.$t('common.operationSucceeded'),
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    updateCategory() {
      this.dialogFormVisible = false
      this.updateForm.taxonomy = 'category'
      updateTaxonomy(this.updateForm.id, this.updateForm).then(response => {
        this.$message({
          message: this.$t('common.operationSucceeded'),
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handleDelete(row) {
      this.$confirm(this.$t('taxonomy.confirmToDeleteCategory'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        var deleteData = {
          taxonomy: 'category'
        }
        deleteTaxonomy(row.id, deleteData).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: this.$t('common.deleteSucceeded')
          })
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
.new-category-form{
    border: 1px solid #EBEEF5;
    padding: 0 10px 0 10px;
}
</style>

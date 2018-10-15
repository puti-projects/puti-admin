<template>
    <div class="app-container">
        <el-row :gutter="30">
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <el-form ref="newForm" :model="newForm" label-width="80px" label-position="top" class="new-category-form">
                    <h4>添加新分类</h4>
                    <el-form-item label="名称">
                        <el-input v-model="newForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="缩略名">
                        <el-input v-model="newForm.slug"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类">
                       <el-cascader
                            placeholder="无父级"
                            :options="dataWithoutDefault"
                            :props="newProps"
                            @change="handleChange"
                            v-model="defaultParentId" 
                            change-on-select="true"
                            clearable="true">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" v-model="newForm.description"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="createCategory()" >立即添加</el-button>
                        <el-button size="small" plain @click="clearNewForm()">清空</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
                <tree-table :data="data" :columns="columns" max-height="800" v-loading="listLoading" border>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.id != 1" type="primary" @click="handleDetail(scope.row)" icon="el-icon-edit" size="mini" circle></el-button>
                            <el-button v-if="scope.row.children == null && scope.row.id != 1" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
                        </template>
                    </el-table-column>
                </tree-table>
            </el-col>
        </el-row>

        <el-dialog title="分类详情" :visible.sync="dialogFormVisible" @close="closeUpdateDialog">
          <el-form :model="updateForm">
            <el-form-item label="名称" :label-width="formLabelWidth">
              <el-input v-model="updateForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="缩略名" :label-width="formLabelWidth">
              <el-input v-model="updateForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
              <el-cascader
                placeholder="无父级"
                :options="dataWithoutDefault"
                :props="newProps"
                @change="handleChangeUpdate"
                v-model="updateParentId" 
                change-on-select="true"
                clearable="true" :disabled="updateDisabled">
              </el-cascader>
            </el-form-item>
            <el-form-item label="描述">
              <el-input type="textarea" v-model="updateForm.description"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateCategory()">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import { fetchList, fetchTaxonomy } from '@/api/taxonomy'
import treeTable from '@/components/TreeTable'

export default {
  name: 'category',
  components: { treeTable },
  data() {
    return {
      columns: [
        {
          text: '分类',
          value: 'name',
          width: 200
        },
        {
          text: '缩略名',
          value: 'slug',
          width: 200
        },
        {
          text: '描述',
          value: 'description'
        },
        {
          text: '文章数量',
          value: 'count',
          width: 100
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
        if (response.code === 0) {
          this.dialogFormVisible = true
          this.updateForm.id = response.data.term_id
          this.updateForm.name = response.data.name
          this.updateForm.slug = response.data.slug
          this.updateForm.description = response.data.description
          this.updateForm.parentId = response.data.parent_term_id
          this.updateParentId = this.getParentArr(response.data)
        } else {
          this.$message.error(this.$t('common.error') + response.message)
        }
      })
      if (row.children.length > 0) {
        this.updateDisabled = true
      }
    },
    getParentArr(termData) {
      var parentArr = []
      if (termData.parent_term_id !== 0) {
        var result = this.getUpdateParentId(this.data, termData.parent_term_id, [])
        for (var i = 0; i <= result.length - 1; i++) {
          parentArr.push(result[i])
        }
      }
      return parentArr
    },
    getUpdateParentId(data, parentID, result) {
      for (var i = 0; i <= data.length - 1; i++) {
        if (parentID === data[i].term_id) {
          result[data[i].pid] = data[i].term_id
          if (data[i].parent_term_id !== 0) {
            this.getUpdateParentId(data[i].children, data[i].pid, result)
          }
          break
        }
        if (data[i].children !== null) {
          this.getUpdateParentId(data[i].children, parentID, result)
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
          this.$message.error('父级分类不能是自己')
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
      console.log(this.newForm)
    },
    updateCategory() {
      this.dialogFormVisible = false
      console.log(this.updateForm)
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

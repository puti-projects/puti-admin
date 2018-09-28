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
                            :options="data"
                            :props="newProps"
                            @change="handleChange"
                            v-model="newForm.parentId">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" v-model="newForm.description"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="handleCreate()" >立即添加</el-button>
                        <el-button size="small" plain>清空</el-button>
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

        <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
          <el-form :model="updateForm">
            <el-form-item label="活动名称" :label-width="formLabelWidth">
              <el-input v-model="updateForm.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
      listLoading: true,
      newForm: {
        name: '',
        slug: '',
        description: '',
        parentId: 0
      },
      newProps: {
        label: 'name',
        value: 'id'
      },
      dialogFormVisible: false,
      updateForm: {
        id: undefined,
        name: '',
        slug: '',
        description: '',
        parentId: 0
      }
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
        this.listLoading = false
      })
    },
    handleDetail(row) {
      fetchTaxonomy(row.termID).then(response => {
        console.log(response)
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

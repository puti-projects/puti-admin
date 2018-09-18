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
                        <el-input v-model="newForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类">
                       <el-cascader
                            :options="data"
                            :props="newProps"
                            @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" v-model="newForm.description"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="onSubmit">立即添加</el-button>
                        <el-button size="small" >清空</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
                <tree-table :data="data" :columns="columns" max-height="800" v-loading="listLoading" border>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.id != 1" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                            <el-button v-if="scope.row.children == null && scope.row.id != 1" type="text">删除</el-button>
                        </template>
                    </el-table-column>
                </tree-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { fetchList } from '@/api/taxonomy'
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
    handleUpdate(row) {
      console.log(row)
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

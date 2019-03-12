<template>
<div class="app-container">
        <el-row :gutter="30">
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <el-form ref="newForm" :model="newForm" label-width="80px" label-position="top" class="new-tag-form">
                    <h4>{{ $t('taxonomy.newTag') }}</h4>
                    <el-form-item :label="$t('taxonomy.taxonomyName')">
                        <el-input v-model="newForm.name"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('taxonomy.taxonomySlug')">
                        <el-input v-model="newForm.slug"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('taxonomy.taxonomyDesc')">
                        <el-input type="textarea" v-model="newForm.description"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="createTag()" >{{ $t('common.addNow') }}</el-button>
                        <el-button size="small" plain @click="clearNewForm()">{{ $t('common.clear') }}</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
                <el-table :data="list" v-loading.body="listLoading" max-height="800" border fit highlight-current-row style="width: 100%">
                    <el-table-column width="200" :label="$t('taxonomy.tag')">
                        <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column width="200" :label="$t('taxonomy.taxonomySlug')">
                        <template slot-scope="scope">
                        <span>{{ scope.row.slug }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column :label="$t('taxonomy.taxonomyDesc')">
                        <template slot-scope="scope">
                        <span>{{ scope.row.description }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column width="100" :label="$t('taxonomy.articleNumber')">
                        <template slot-scope="scope">
                        <span>{{ scope.row.count }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column :label="$t('common.action')" width="150">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="handleDetail(scope.row)" icon="el-icon-edit" size="mini" circle></el-button>
                            <el-button type="danger"  @click="handleDelete(scope.row)" icon="el-icon-delete" size="mini" circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>

        <el-dialog :title="$t('taxonomy.tagDetail')" :visible.sync="dialogFormVisible">
          <el-form :model="updateForm">
            <el-form-item :label="$t('taxonomy.taxonomyName')">
                <el-input v-model="updateForm.name"></el-input>
            </el-form-item>

            <el-form-item :label="$t('taxonomy.taxonomySlug')">
                <el-input v-model="updateForm.slug"></el-input>
            </el-form-item>
            
            <el-form-item :label="$t('taxonomy.taxonomyDesc')">
                <el-input type="textarea" v-model="updateForm.description"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="updateTag()">{{ $t('common.confirm') }}</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import { fetchList, createTaxonomy, fetchTaxonomy, updateTaxonomy, deleteTaxonomy } from '@/api/taxonomy'

export default {
  name: 'tag',
  data() {
    return {
      list: null,
      listLoading: true,
      newForm: {
        name: '',
        slug: '',
        description: ''
      },
      updateForm: {
        id: undefined,
        name: '',
        slug: '',
        description: ''
      },
      dialogFormVisible: false
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
      fetchList({ type: 'tag' }).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    clearNewForm() {
      this.newForm.name = ''
      this.newForm.slug = ''
      this.newForm.description = ''
    },
    createTag() {
      this.newForm.taxonomy = 'tag'
      createTaxonomy(this.newForm).then(response => {
        this.$message({
          message: this.$t('common.operationSucceeded'),
          type: 'success',
          duration: 2000
        })
        this.getList()
        this.clearNewForm()
      })
    },
    handleDetail(row) {
      fetchTaxonomy(row.term_id).then(response => {
        this.dialogFormVisible = true
        this.updateForm.id = response.data.term_id
        this.updateForm.name = response.data.name
        this.updateForm.slug = response.data.slug
        this.updateForm.description = response.data.description
      })
    },
    updateTag() {
      this.dialogFormVisible = false
      this.updateForm.taxonomy = 'tag'
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
      this.$confirm(this.$t('taxonomy.confirmToDeleteTag'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        var deleteData = {
          taxonomy: 'tag'
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
.new-tag-form{
    border: 1px solid #EBEEF5;
    padding: 0 10px 0 10px;
}
</style>
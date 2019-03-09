<template>
    <div class="app-container">
        <tree-table :data="data" :columns="columns" max-height="800" v-loading="listLoading" border>
            <el-table-column :label="$t('common.action')" width="150">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleDetail(scope.row)" icon="el-icon-edit" size="mini" circle></el-button>
                    <el-button v-if="scope.row.children == null" type="danger"  @click="handleDelete(scope.row)" icon="el-icon-delete" size="mini" circle></el-button>
                </template>
            </el-table-column>
        </tree-table>
    </div>
</template>

<script>
import { fetchList } from '@/api/subject'
import treeTable from '@/components/TreeTable'

export default {
  name: 'subject-list',
  components: { treeTable },
  data() {
    return {
      columns: [
        {
          text: this.$t('subject.name'),
          value: 'name',
          width: 230
        },
        {
          text: this.$t('subject.description'),
          value: 'description'
        },
        {
          text: this.$t('subject.slug'),
          value: 'slug',
          width: 300
        },
        {
          text: this.$t('subject.lastUpdated'),
          value: 'last_updated',
          width: 200
        },
        {
          text: this.$t('subject.totalPost'),
          value: 'count',
          width: 150
        }
      ],
      data: [],
      listLoading: true
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
      fetchList().then(response => {
        this.data = response.data
        this.listLoading = false
      })
    }
  }
}
</script>

<style>

</style>
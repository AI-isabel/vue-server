<template>
<el-card class="box-card">
    <el-table :data="tableData" v-loading="listLoading">
        <el-table-column label="ID" width="180" type="index">
        </el-table-column>
        <el-table-column prop="title" label="链接" width="280" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="content" label="内容" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button size="mini" @click="edit(scope.row.id)" type="warning">编辑</el-button>
                <el-button size="mini" type="danger" @click="del(scope.row.id)" >删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div style="margin-top: 10px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="totalNum" :page-size="pageSize" :page-sizes="[5, 10, 15]" :current-page="currentPage">
        </el-pagination>
    </div>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            totalNum: 0, // 共多少条
            pageSize: 5, // 每页显示多少条
            currentPage: 1, // 当前显示第几页
            listLoading: false, // 数据返回慢时，显示加载动画
        }
    },
    mounted() {
        this.showNews(this.currentPage,this.pageSize);
    },
    methods: {
        edit(id) {
            this.$router.push('/edit-link/' + id)
        },
        del(id) {
            this.$axios.post('/delete-link', {
                    id: id
                })
                .then(res => {
                    if (res.data.code == 0) {
                        this.showNews(this.currentPage,this.pageSize);
                        this.$message.success(res.data.msg)
                    }
                })
        },


            //点击第几页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.showNews(this.currentPage,this.pageSize)
    },
    // 每页下拉显示数据
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.showNews(this.currentPage,this.pageSize)
    },

    showNews(currentPage, pageSize) {
      this.listLoading = true;
      this.$axios
        .get("/getnews", {
          params: {
            curr: currentPage,
            limit: pageSize,
          },
        })
        .then((res) => {
          this.listLoading = false;
          this.totalNum = res.data.count;
          this.tableData = res.data.listData;
        });
    },


    },
}
</script>

<style>

</style>

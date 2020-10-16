<template>
<el-form ref="form" :model="tableData" label-width="80px">
    <el-form-item label="文章标题">
        <el-input v-model="tableData.title"></el-input>
    </el-form-item>

    <el-form-item label="文章内容">
        <el-input type="textarea" v-model="tableData.content" autosize></el-input>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
    </el-form-item>
</el-form>
</template>

<script>
export default {
    data() {
        return {
            tableData: {
                id: "",
                title: '',
                content: ""
            }
        }
    },
    mounted() {
      console.log(this.$route.params.id);
        this.$axios.get('/get-link-show', {
          params: { id: this.$route.params.id}
        } )
            .then(res => {
                this.tableData = res.data[0];
            });
    },
    methods: {
        onSubmit() {
            this.$axios.post('/edit-link', this.tableData)
                .then(res => {
                    if (res.data.code == 0) {
                      this.$message.success("文章保存成功")
                        this.$router.push('/show-link')
                    }
                })
        }
    }
}
</script>

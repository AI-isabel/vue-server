
<template>
    <el-form ref="form" :model="articleData" label-width="80px">
  <el-form-item label="金主爸爸">
    <el-input v-model="articleData.title"></el-input>
  </el-form-item>
 
  <el-form-item label="小金库地址">
    <el-input type="textarea" v-model="articleData.content"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">立即创建</el-button>
  </el-form-item>
</el-form>
</template>

<script>
  export default {
    data() {
      return {
        articleData: {
          title: '',
          content:""
        }
      }
    },
    methods: {
      onSubmit() {
        console.log(this.articleData);
        this.$axios.post('/create-link',this.articleData)
        .then(res => {
            if (res.data.code == 0) {
                this.$router.push('/show-link')
            }
        })
        .catch(err => {
            console.error(err); 
        })
      }
    }
  }
</script>
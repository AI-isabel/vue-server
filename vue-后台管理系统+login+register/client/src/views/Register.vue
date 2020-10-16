<template>
  <div>
    <h1 class="mylogo">
      <router-link to="/home"><span class="font1 ">稂莠family</span></router-link>
    </h1>
    <div class="box">
      <h2>
        <router-link to="/login" class="text-secondary">登录</router-link>
        <span class="text-dark">·</span>
        <router-link to="/register" class="text-secondary">注册</router-link>
      </h2>

      
      <el-form :model="formData" :rules="rules" ref="regForm" label-width="0px">
        <el-form-item prop="regUsername">
          <el-input v-model="formData.regUsername" placeholder="用户名">
            <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
          </el-input>
        </el-form-item>
        <el-form-item label prop="regPassword">
          <el-input
            type="password"
            v-model="formData.regPassword"
            autocomplete="off"
            placeholder="密码"
          >
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item label prop="checkPassword">
          <el-input
            type="password"
            v-model="formData.checkPassword"
            autocomplete="off"
            placeholder="确认密码"
          >
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onRegForm('regForm')" class="myw"
            >立即注册</el-button
          >
        </el-form-item>
      </el-form>
      <p class="text-center text-primary">
        点击 “注册” 即表示您同意并愿意遵守协议
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var validateUserName = (rule, value, callback) => {
      var reg = /^\w{3,15}$/;
      if (!reg.test(value)) {
        callback(new Error("字母、数字、下划线组成"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formData.regPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      formData: {
        regUsername: "",
        regPassword: "",
        checkPassword: "",
      },
      rules: {
        // rules里的username和el-form-item的prop值必须一致，而prop值必须和formdata里的username一致
        regUsername: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度3-16位之间", trigger: "blur" },
          { validator: validateUserName, trigger: "blur" },
        ],
        regPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度6-15位之间", trigger: "blur" },
        ],
        checkPassword: [
          //   { required: true, message: "请输入确认密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度6-15位之间", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    onRegForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("submit!");
          this.$axios
            .post("/register", this.formData)
            .then((res) => {
              console.log(res.data);

              if (res.data.code == 4) {
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "warning",
                });
                return;
              }

              if (res.data.code == 0) {
                // elementui消息提示
                this.$message({
                  message: "恭喜您，注册成功",
                  type: "success",
                });

                // 编程式导航，跳转到login页
                this.$router.push("/login");
              }
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  mounted() {
    document.body.style.backgroundColor = "#eee";
  },
};
</script>


<style scoped>
.mylogo {
  position: absolute;
  top: 50px;
  left: 50px;
}
.mylogo a {
  text-decoration: none;
}
.box {
    width: 350px;
    padding: 30px 40px 40px 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 5px 3px #ddd;
    margin: 100px auto 0;
    background-color: #fff;
  }
  .box h2 {
    margin: 20px 0 40px 0;
    font-size: 20px;
    text-align: center;
  }
  .box h2 a {
    margin: 0 10px;
    text-decoration: none;
  }
  .myw {
    width: 100%;
  }
  .box h2 a.router-link-active {
    color: #008c8c !important;
    text-decoration: none;
  }
  h1 {
    color: red;
  }

.font1 {
  font-family: font1;
  font-size: 40px !important;
  color: orange;
}

@font-face {
  font-family: 'font1';
  font-display: swap;
  src: url('//at.alicdn.com/t/webfont_f26v5tq7o6e.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_f26v5tq7o6e.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('//at.alicdn.com/t/webfont_f26v5tq7o6e.woff2') format('woff2'),
  url('//at.alicdn.com/t/webfont_f26v5tq7o6e.woff') format('woff'), /* chrome、firefox */
  url('//at.alicdn.com/t/webfont_f26v5tq7o6e.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/webfont_f26v5tq7o6e.svg#站酷高端黑') format('svg'); /* iOS 4.1- */
}
</style>
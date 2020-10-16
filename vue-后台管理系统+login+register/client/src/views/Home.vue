<template>
  <el-container style="height: 100vh">
    <el-header>
      <el-row>
        <el-col :span="6">
          <span class="font1 font-28">稂莠</span>
        </el-col>
        <el-col :span="12" class="font-weight-bold text-center font-20">
          友情链接
        </el-col>
        <el-col :span="6" class="text-right">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                ><span @click="logout">退出</span></el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{ loginName }}</span>
        </el-col>
      </el-row>
    </el-header>

    <el-container style="height: 500px; border: 1px solid #999">
      <el-aside width="230px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1']" unique-opened router>
          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-tickets"></i>金主</template
            >
            <el-menu-item index="/show-link">金主信息</el-menu-item>
            <el-menu-item index="/create-link">创建金主</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>兴趣</template>
            <el-menu-item-group>
              <template slot="title">韭菜</template>
              <el-menu-item index="2-1">割韭菜</el-menu-item>
              <el-menu-item index="2-2">种韭菜</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    <el-footer
      style="background-color: #eee; color: gray"
      class="d-flex justify-content-center align-items-center"
      >版权所有 &copy; 金主爸爸科技有限公司</el-footer
    >
  </el-container>
</template>



<script>
export default {
  data() {
    return {
      loginName: "",
    };
  },
  created() {
    if (!localStorage.getItem("mytoken")) {//方法一1)没有token则去登录
      this.$router.push("/login");
    }
    this.$axios.get("/home").then((res) => {
      if (res.data.code == "999") {//方法二2)后端验证:请求/home,没有\错误则返回999,去登录
        this.$router.push("/login");//避免DOM加载
      } else {//否则有token返回其解码数据
        this.loginName = res.data.user_name;//如果有,姓名放于data内
      }
    });
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$message.success("再见,爸爸!");
      this.$router.push({ name: "LoginPage" });
    },
  },
  mounted() {
    document.body.style.backgroundColor = "#fff";
  },
};
</script>
<style>
body {
  margin: 0;
  padding: 0;
}

.el-header {
  background-color: #008c8c;
  color: white;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
.el-menu-item.is-active {
  color: #333;
}
.font1 {
  font-family: font1;
  color: white;
}
@font-face {
  font-family: "font1";
  font-display: swap;
  src: url("//at.alicdn.com/t/webfont_4pyteix3g3l.eot"); /* IE9*/
  src: url("//at.alicdn.com/t/webfont_4pyteix3g3l.eot?#iefix")
      format("embedded-opentype"),
    /* IE6-IE8 */ url("//at.alicdn.com/t/webfont_4pyteix3g3l.woff2")
      format("woff2"),
    url("//at.alicdn.com/t/webfont_4pyteix3g3l.woff") format("woff"),
    /* chrome、firefox */ url("//at.alicdn.com/t/webfont_4pyteix3g3l.ttf")
      format("truetype"),
    /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
      url("//at.alicdn.com/t/webfont_4pyteix3g3l.svg#站酷高端黑") format("svg"); /* iOS 4.1- */
}
</style>
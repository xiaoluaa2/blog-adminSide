<template>
  <div class="LoginContent">
    <el-form ref="form" :model="form" label-width="60px">
      <div style="text-align: center">
        <h2>管理后台</h2>
      </div>
      <el-form-item label="账号">
        <el-input v-model="form.CnName"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.PassWord" type="password"></el-input>
      </el-form-item>
      <div style="text-align: center">
        <el-button type="primary" @click="OnLogin()">登录</el-button>
        <!--<el-button type="primary" @click="OnRegist()">注册</el-button>-->
      </div>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import { Loading } from "element-ui";

export default {
  name: "LoginPage",
  data: () => {
    return {
      form: {
        CnName: "",
        PassWord: ""
      }
    };
  },
  methods: {
    OnLogin: function () {
      var That = this;
      var AjaxLoading = Loading.service({ fullscreen: true });
      axios
        .post("/api/login/getToken", {
          username: this.form.CnName,
          password: this.form.PassWord
          // UserType: "Admin"
        })
        .then(function (response) {
          AjaxLoading.close();
          console.log(response);
          if (response.data.status == 0) {
            That.$message({
              message: "登录成功",
              type: "success",
              duration: 800
            });
            console.log(response.data.data);
            window.localStorage.setItem(
              "SQBlog",
              JSON.stringify(response.data.data)
            );
            window.localStorage.setItem("SQBlogUser", That.form.CnName);
            That.$router.push("/Article");
            // That.$router.push({ name: "Article" });

            // 记录日志
            That.createLog({
              moduleType: "button",
              operateType: "登录后台",
              operateContent: "成功"
            });

            // 登录成功后，调用菜单组件注册的方法，修改菜单组件的用户名
            That.bus.$emit("changeUser", That.form.CnName);
          } else {
            That.$message.error("账号或密码错误");

            // 记录日志
            That.createLog({
              moduleType: "button",
              operateType: "登录后台",
              operateContent: "失败"
            });
          }
        })
        .catch(function (error) { });
    },

    OnRegist: function () {
      var That = this;
      axios
        .post("/api/UserCreate", {
          CnName: this.form.CnName,
          PassWord: this.form.PassWord,
          UserType: "Admin"
        })
        .then(function (response) {
          if (response.data.status == "200") {
            That.$message({
              message: "注册成功",
              type: "success"
            });
          }
        })
        .catch(function (error) { });
    },
    // 监听enter键
    enterKey: function () {
      let that = this;
      const code = event.keyCode
        ? event.keyCode
        : event.which
          ? event.which
          : event.charCode;

      if (code == 13) that.OnLogin();
    }
  },
  // 生命周期不能使用箭头函数
  mounted: function () {
    document.addEventListener("keyup", this.enterKey);
  },
  // 本组件销毁时注意移除监听，否则其他页面点击enter也会登陆
  destroyed: function () {
    document.removeEventListener("keyup", this.enterKey);
  }
};
</script>

<style scoped lang="less">
@import "../assets/css/base.less";

@media screen and (max-width: 768px) {
  .LoginContent {
    padding: 0 20px;
    margin: 12rem auto 0;
  }
}

@media screen and (min-width: 768px) {
  .LoginContent {
    width: 600px;
    margin: 12rem auto 0;
  }
}
</style>

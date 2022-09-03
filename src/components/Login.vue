<template>

  <el-card class="box-card">
    <div slot="header" class="header-card">
      <span>图书借阅管理系统</span>
    </div>
    <el-form :model="user" :rules="rules" ref="user">
      <el-form-item prop="uname">
        <el-input suffix-icon="el-icon-user-solid" v-model="user.username" clearable placeholder="请输入用户名称"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input suffix-icon="el-icon-s-goods" v-model="user.password" clearable type="password" placeholder="请输入密码">
        </el-input>
      </el-form-item>
      <el-button type="success" plain @click="login">登录</el-button>
    </el-form>

  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        rules: {
          username: [{
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入用户密码',
            trigger: 'blur'
          }],
        },
        user: {
          username:'',
          uname: '',
          password: '',
        }
      }
    },
    methods: {
      login() {
        this.$refs['user'].validate((valid) => {
          if (valid) {
            this.$http.get('http://127.0.0.1/tbUser/login', {
                params: this.user
              })
              .then(res => {
                if (res.data.data =='登陆失败') {
                  this.$message.error('你输入的用户名称或者密码不正确，或者账号被锁定，请联系管理员');
                } else {
                    this.user = res.data.data;
                    sessionStorage.setItem("user", res.data.data);
                    this.$router.push('/welcome');
                }
              }).catch(e => {
                console.log(e)
                this.$message.error('错了哦，网络异常');
              })

          }
        });

      }
    }

  }
</script>

<style scoped>
   body{
    padding: 0px;
    margin: 0px;
  }
  .box-card {
    width: 550px;
    height: 600px;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 10px 20px 30px #888888;
  }

  .login-form {
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding: 0px 20px;
    box-sizing: border-box;
  }

  .el-button {
    display: flex;
    justify-content: center;
    width: 100%;
    font-weight: bold;
    height: 40px;
    font-size: 18px;
    border-radius: 10px;
  }

  .header-card {
    display: flex;
    justify-content: center;
    font-size: 18px;
  }

  .el-input {
    border-radius: 10px;
    height: 50px;
    font-size: 18px;
    border-bottom-color: green;

  }
</style>

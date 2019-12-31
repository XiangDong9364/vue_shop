<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!--登录表单区域 -->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="validCode">
          <el-row :gutter="24">
            <el-col :span="16">
              <el-input v-model="loginForm.validCode" prefix-icon="el-icon-lock"></el-input>
            </el-col>
            <el-col :span="8">
              <el-button type="info">这是一个验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-button type="primary" @click="login()">登录</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="info" @click="resetLoginForm()">重置</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单数据对象
      loginForm: {
        username: 'admin',
        password: '123456',
        validCode: ''
      },
      // 登录表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入您的用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入您的密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.post('login', this.loginForm)
        if (result.meta.status === 200) {
          this.$message.success('登录成功~！')
          window.sessionStorage.setItem('token', result.data.token)
          this.$router.push('/home')
        } else {
          this.$message.error('登录失败~！')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  // background-color: #2b4b6b;
  background: url('../assets/scania (3).png') no-repeat center center fixed;
  background-size: cover;
  width: 100%;
  height: 100%;
}
.login_box {
  // 登录表单盒子
  width: 600px;
  height: 350px;
  background-color: #fff;
  border-radius: 15px;
  position: absolute;
  top: 50%;
  left: 75%;
  transform: translate(-50%, -50%); // 向左、向上翻转自身的50%位置

  .avatar_box {
    // 头像DIV
    width: 100px;
    height: 100px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd; // 阴影
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%); // 向左、向上翻转自身的50%位置
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .el-button {
    width: 100%;
  }
}
</style>

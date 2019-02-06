<template>
  <div class="login-container">
      <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <h3 class="title"><svg-icon icon-class="puti-logo"></svg-icon>{{website.title}}</h3>

        <p class="login-text">{{$t('login.wellcomeLogin')}}</p>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user"></svg-icon>
          </span>
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" :placeholder="$t('login.username')" />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"></svg-icon>
          </span>
          <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
            :placeholder="$t('login.password')"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
            {{$t('login.logIn')}}
          </el-button>
        </el-form-item>

        <p class="login-text  footer-text"><a href="https://github.com/goozp/puti" target="_blank"><svg-icon icon-class="github"></svg-icon></a></p>
        <p class="login-text"><span> Copyright © 2018 Puti All rights reserved. Make by Goozp. </span></p>
      </el-form>
    </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import { mapGetters } from 'vuex'

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(this.$t('login.pleaseEnterUsername')))
      } else {
        if (!isvalidUsername(value)) {
          callback(new Error(this.$t('login.usernameValidate')))
        } else {
          callback()
        }
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error(this.$t('login.passwordValidate')))
      } else {
        callback()
      }
    }
    return {
      // TODO 默认值不直接填充
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  computed: {
    ...mapGetters([
      'website'
    ])
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 45px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      color: #555555;
      height: 45px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #2d3a4b inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid #e7ecee;
    background: #fff;
    border-radius: 3px;
    color: #001529;
    box-shadow: 5px 5px 10px #e7ecee;
    text-indent: 5px;
  }


}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: #F4F5F5;
  font-size: 15px;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: auto;
    margin-top: -220px;
  }
  .svg-container {
    padding: 0 0 0 10px;
    color: #909DB7;
    vertical-align: middle;
    width: 20px;
    display: inline-block;
  }
  .title {
    font-size: 32px;
    font-weight: 400;
    color: #409EFF;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .login-text{
    text-align: center;
    color: #909DB7;
  }
  .footer-text{
    margin-top: 30%;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 6px;
    font-size: 16px;
    color: #909DB7;
    cursor: pointer;
    user-select: none;
  }
  @media (max-width: 768px) {
    .login-form{
      width: auto;
    }
  }
}
</style>

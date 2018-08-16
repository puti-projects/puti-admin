<template>
    <div class="app-container">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="medium">
          <el-form-item label="账号" prop="account">
              <el-input v-model="ruleForm.account"></el-input>
          </el-form-item>

          <el-form-item label="昵称" prop="username">
              <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>

          <el-form-item :label="$t('user.email')" prop="email">
              <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>

          <el-form-item :label="$t('user.role')" prop="role">
              <el-select v-model="ruleForm.role" :placeholder="$t('user.selectRole')">
              <el-option :label="$t('user.administrator')" value="administrator"></el-option>
              <el-option :label="$t('user.writer')" value="writer"></el-option>
              <el-option :label="$t('user.subscriber')" value="subscriber"></el-option>
              </el-select>
          </el-form-item>
          
          <el-form-item :label="$t('user.password')" prop="password">
              <el-input type="password"  v-model="ruleForm.password" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item :label="$t('user.passwordAgain')" prop="passwordAgain">
              <el-input type="password"  v-model="ruleForm.passwordAgain"></el-input>
          </el-form-item>

          <el-form-item :label="$t('user.website')" prop="website">
              <el-input v-model="ruleForm.website"></el-input>
          </el-form-item>
        
          <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>

<script>
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm.passwordAgain !== '') {
            this.$refs.ruleForm.validateField('passwordAgain')
          }
          callback()
        }
      }
      var validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          account: '',
          username: '',
          email: '',
          role: '',
          password: '',
          passwordAgain: '',
          website: ''
        },
        rules: {
          account: [
            { required: true, message: '请输入登录账号', trigger: 'blur' },
            { min: 3, message: '账号长度不能小于 3 个字符', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入昵称', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          role: [
            { required: true, message: '请选择用户角色', trigger: 'blur' }
          ],
          password: [
            { required: true, validator: validatePass, trigger: 'blur' },
            { min: 6, message: '密码长度不能小于 6 个字符', trigger: 'blur' }
          ],
          passwordAgain: [
            { required: true, validator: validateCheckPass, trigger: 'blur' },
            { min: 6, message: '密码长度不能小于 6 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
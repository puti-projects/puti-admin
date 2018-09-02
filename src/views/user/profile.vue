<template> 
         <div class="tabs-container">
             <el-tabs :tab-position="tabPosition" type="border-card">
                <el-tab-pane>
                    <span slot="label"><svg-icon icon-class="user" /> 个人资料</span>
                    <div class="form-box">
                        <el-form ref="infoForm" :model="infoForm" status-icon :rules="infoRules" label-width="100px">

                            <el-form-item :label="$t('user.account')" prop="account">
                                <el-col :span="11">
                                    <el-input v-model="infoForm.account" disabled="disabled" style="width: 100%"></el-input>
                                </el-col>
                            </el-form-item>

                            <el-form-item :label="$t('user.nickname')" prop="nickname">
                                <el-col :span="11">
                                    <el-input v-model="infoForm.nickname" style="width: 100%"></el-input>
                                </el-col>
                            </el-form-item>

                            <el-form-item :label="$t('user.email')" prop="email">
                                <el-col :span="11">
                                    <el-input v-model="infoForm.email" style="width: 100%"></el-input>
                                </el-col>
                            </el-form-item>

                            <el-form-item :label="$t('user.role')" prop="role">
                                <el-select v-model="infoForm.role" :placeholder="$t('user.selectRole')">
                                <el-option :label="$t('user.administrator')" value="administrator"></el-option>
                                <el-option :label="$t('user.writer')" value="writer"></el-option>
                                <el-option :label="$t('user.subscriber')" value="subscriber"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item :label="$t('user.website')" prop="website">
                                <el-col :span="11">
                                    <el-input v-model="infoForm.website" style="width: 100%"></el-input>
                                </el-col>
                            </el-form-item>

                             <el-form-item :label="$t('user.registeredTime')">
                                <el-col :span="11">
                                    <el-date-picker type="datetime" :placeholder="$t('user.registeredTime')" v-model="infoForm.registeredTime" disabled="disabled"></el-date-picker>
                                </el-col>
                            </el-form-item>
                        
                            <el-form-item>
                                <el-button type="primary" @click="updateMyProfile">{{$t('common.change')}}</el-button>
                                <el-button @click="resetForm('infoForm')">{{$t('common.reset')}}</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>

                <el-tab-pane>
                    <span slot="label"><i class="el-icon-edit"></i> 修改头像</span>
                    <div class="upload-box">
                        <el-button type="primary" @click="toggleShow">点击上传新头像</el-button>
                        <el-col :span="8">
                            <img class="upload-image" :src="imgDataUrl">
                            <my-upload field="img"
                                @crop-success="cropSuccess"
                                @crop-upload-success="cropUploadSuccess"
                                @crop-upload-fail="cropUploadFail"
                                v-model="showUplaod"
                                :width="300"
                                :height="300"
                                :url="uploadUIrl"
                                :params="uploadParams"
                                :headers="uploadHeaders"
                                :langType="uploadLangType"
                                img-format="png">
                            </my-upload>
                        </el-col>
                    </div>  
                </el-tab-pane>

                <el-tab-pane>
                    <span slot="label"><svg-icon icon-class="password" /> 重置密码</span>
                    <el-form :model="passwordForm" status-icon :rules="passwordRules" ref="passwordForm" label-width="100px">
                        <el-form-item label="密码" prop="password">
                            <el-col :span="11">
                                <el-input type="password" v-model="passwordForm.password" auto-complete="off"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="passwordAgain">
                            <el-col :span="11">
                                <el-input type="password" v-model="passwordForm.passwordAgain" auto-complete="off"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="updatePassword()">提交</el-button>
                            <el-button @click="resetForm('passwordForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
    
</template>

<script>
import 'babel-polyfill' // es6 shim
import myUpload from 'vue-image-crop-upload'
import { getInfo } from '@/api/login'
import { updateUser } from '@/api/user'

export default {
  name: 'profile',
  components: {
    'my-upload': myUpload
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('user.pleaseInputPassWord')))
      } else {
        if (this.passwordForm.passwordAgain !== '') {
          this.$refs.passwordForm.validateField('passwordAgain')
        }
        callback()
      }
    }
    var validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('user.pleaseInputPassWordAgain')))
      } else if (value !== this.passwordForm.password) {
        callback(new Error(this.$t('user.checkPasswordFailed')))
      } else {
        callback()
      }
    }
    return {
      tabPosition: 'left',
      infoForm: {
        id: undefined,
        account: '',
        nickname: '',
        email: '',
        avatar: '',
        role: '',
        website: '',
        registeredTime: ''
      },
      infoRules: {
        email: [
          { required: true, message: this.$t('user.pleaseInputEmail'), trigger: ['change'] },
          { type: 'email', message: this.$t('user.pleaseInputCorrectEmail'), trigger: ['change'] }
        ],
        role: [
          { required: true, message: this.$t('user.pleaseSelectRoles'), trigger: 'change' }
        ]
      },
      passwordForm: {
        id: undefined,
        password: '',
        passwordAgain: ''
      },
      passwordRules: {
        password: [
          { required: true, validator: validatePass, trigger: ['blur', 'change'] },
          { min: 5, message: this.$t('user.pleaseCheckPasswordLength'), trigger: ['blur', 'change'] }
        ],
        passwordAgain: [
          { required: true, validator: validateCheckPass, trigger: ['blur', 'change'] },
          { min: 5, message: this.$t('user.pleaseCheckPasswordLength'), trigger: ['blur', 'change'] }
        ]
      },
      showUplaod: false,
      uploadUIrl: process.env.BASE_API + '/avatar',
      uploadParams: {
        // 上传附带其它参数
        userId: ''
      },
      uploadHeaders: {
        // 上传header设置
        Authorization: ''
      },
      uploadLangType: this.$store.getters.language,
      imgDataUrl: '' // the datebase64 url of created image
    }
  },
  created() {
    this.getInfo()
    this.setTitle()
  },
  methods: {
    setTitle() {
      document.title = this.$t('route.' + this.$route.meta.title) + ' | Puti'
    },
    getInfo() {
      var token = this.$store.getters.token
      this.uploadHeaders.Authorization = 'Bearer ' + token

      getInfo(token).then(response => {
        this.infoForm.id = response.data.id
        this.infoForm.account = response.data.account
        this.infoForm.nickname = response.data.nickname
        this.infoForm.email = response.data.email
        this.infoForm.role = response.data.roles
        this.infoForm.website = response.data.website
        this.infoForm.registeredTime = response.data.registered_time

        this.infoForm.avatar = this.$store.getters.avatar
        this.imgDataUrl = this.$store.getters.avatar

        this.passwordForm.id = response.data.id
        this.uploadParams.userId = response.data.id
      })
    },
    updateMyProfile() {
      this.$refs['infoForm'].validate((valid) => {
        if (valid) {
          updateUser(this.infoForm).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: this.$t('common.success'),
                message: this.$t('common.updateSucceeded'),
                type: 'success',
                duration: 3000
              })
            } else if (response.code === 10002) {
              this.$notify.error({
                title: this.$t('common.failed'),
                message: this.$t('common.updateFailed') + this.$t('common.needRequiredParams'),
                duration: 3000
              })
            } else {
              this.$notify.error({
                title: this.$t('common.failed'),
                message: this.$t('common.updateFailed') + response.message,
                duration: 3000
              })
            }
          })

          this.$nextTick(() => {
            this.$refs['infoForm'].clearValidate()
          })
        }
      })
    },
    updatePassword() {
      this.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          updateUser(this.passwordForm).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: this.$t('common.success'),
                message: this.$t('common.updateSucceeded'),
                type: 'success',
                duration: 3000
              })
            } else if (response.code === 20001) {
              this.$notify.error({
                title: this.$t('common.failed'),
                message: this.$t('common.updateFailed') + this.$t('user.checkPasswordFailed'),
                duration: 3000
              })
            } else {
              this.$notify.error({
                title: this.$t('common.failed'),
                message: this.$t('common.updateFailed') + response.message,
                duration: 3000
              })
            }
          })

          this.$nextTick(() => {
            this.$refs['passwordForm'].clearValidate()
          })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    toggleShow() {
      this.showUplaod = !this.showUplaod
    },
    cropSuccess(imgDataUrl, field) {
      this.imgDataUrl = imgDataUrl
      this.$notify.info({
        title: this.$t('common.success'),
        message: this.$t('user.cropSuccess')
      })
    },
    cropUploadSuccess(jsonData, field) {
      if (jsonData.code === 0) {
        this.$notify({
          title: this.$t('common.success'),
          message: this.$t('user.uploadSucceeded'),
          type: 'success',
          duration: 3000
        })
      } else {
        this.$notify.error({
          title: this.$t('common.failed'),
          message: this.$t('user.uploadFailed') + jsonData.message,
          duration: 3000
        })
      }
      this.toggleShow()
    },
    cropUploadFail(status, field) {
      this.$notify.error({
        title: this.$t('common.failed'),
        message: this.$t('user.uploadFailed') + ' Error ' + status,
        duration: 3000
      })
    }
  }
}
</script>

<style scoped>
.upload-box button{
    margin-top: 250px;
}

.upload-image{
    width: 300px;
    height: 300px;
    border: 1px solid #eee; 
    border-radius: 50%;
}
</style>

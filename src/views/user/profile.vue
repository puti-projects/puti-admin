<template>
    
         <div class="tabs-container">
             <el-tabs :tab-position="tabPosition" type="border-card">
                <el-tab-pane>
                    <span slot="label"><svg-icon icon-class="user" /> 个人资料</span>
                    <div class="form-box">
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="表单名称" style="border-sty">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>

                            <el-form-item label="选择器">
                                <el-select v-model="form.region" placeholder="请选择">
                                    <el-option key="bbk" label="步步高" value="bbk"></el-option>
                                    <el-option key="xtc" label="小天才" value="xtc"></el-option>
                                    <el-option key="imoo" label="imoo" value="imoo"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="日期时间">
                                <el-col :span="11">
                                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                                </el-col>
                                <el-col class="line" :span="2">-</el-col>
                                <el-col :span="11">
                                    <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="城市级联">
                                <el-cascader :options="options" v-model="form.options"></el-cascader>
                            </el-form-item>
                            <el-form-item label="选择开关">
                                <el-switch v-model="form.delivery"></el-switch>
                            </el-form-item>
                            <el-form-item label="多选框">
                                <el-checkbox-group v-model="form.type">
                                    <el-checkbox label="步步高" name="type"></el-checkbox>
                                    <el-checkbox label="小天才" name="type"></el-checkbox>
                                    <el-checkbox label="imoo" name="type"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="单选框">
                                <el-radio-group v-model="form.resource">
                                    <el-radio label="步步高"></el-radio>
                                    <el-radio label="小天才"></el-radio>
                                    <el-radio label="imoo"></el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="文本框">
                                <el-input type="textarea" rows="5" v-model="form.desc"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">表单提交</el-button>
                                <el-button>取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>

                <el-tab-pane>
                    <span slot="label"><i class="el-icon-edit"></i> 修改头像</span>
                    <ImageCropUpload class="image-upload-container"></ImageCropUpload>  
                </el-tab-pane>

                <el-tab-pane>
                    <span slot="label"><svg-icon icon-class="password" /> 重置密码</span>
                    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="密码" prop="pass">
                            <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkPass">
                            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                            <el-button @click="resetForm('ruleForm2')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
    
</template>

<script>
import ImageCropUpload from '@/components/ImageCropUpload'

export default {
  name: 'profile',
  components: {
    ImageCropUpload
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      tabPosition: 'left',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: true,
        type: ['步步高'],
        resource: '小天才',
        desc: '',
        options: []
      },
      ruleForm2: {
        pass: '',
        checkPass: ''
      },
      rules2: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message.success('提交成功！')
    },
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

<style>
.tabs-container{
    height: 100%;
}
</style>

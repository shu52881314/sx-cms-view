<template>
  <div class="rightBg">

    <el-form size="mini" :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">

      <p class="xinxitou">学校Logo设置</p>
      <el-form-item label="上传图片" >
        <el-col :span="22">
          <upload  type="4" :image='ruleForm.mobilLogo' id="upImg3" upload="/upload/image" @uploadSuccessed="uploadSuccesseds"></upload>
          <p  style="color:#999999;margin-top: 10px;margin-bottom: 10px">为了保证图片效果，移动端logo为：100*100px</p>
          <upload  type="4" :image='ruleForm.sysLogo' id="upImg2" upload="/upload/image" @uploadSuccessed="uploadSuccessed"></upload>
          <p  style="color:#999999;margin-top: 10px;margin-bottom: 10px">为了保证图片效果，后台管理logo为：422*85px</p>
        </el-col>
      </el-form-item>

      <p class="xinxitou">参数设置</p>
      <el-form-item label="扫一扫功能:" >
        <el-col :span="22">
          <el-radio-group v-model="ruleForm.openScan">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>

      <el-form-item label="签到码有效期:" >
        <el-col :span="22">
          <el-input v-model="ruleForm.signCodeExpires" placeholder="有效期(默认180秒)" type="number" style="width: 14%"></el-input> 秒
        </el-col>
      </el-form-item>

      <el-form-item label="违约减诚信值:" >
        <el-col :span="22">
          <el-input v-model="ruleForm.foulScore" placeholder="(默认1)" type="number" style="width:10%"></el-input> 分（诚信值总分100，扣完即止）
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="savelogo()">确认提交</el-button>
      </el-form-item>

      <p class="xinxitou">活动审核模板是否按照分类隔离(此功能不接受页面设置，若需修改请联系客服人员！)</p>
      <el-form-item >
        <el-col :span="22">
          <el-radio-group v-model="ruleForm.tplSplitByClassfy">
            <el-radio :label="1" disabled="true">是</el-radio>
            <el-radio :label="0" disabled="true">否</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  import {getOssToken,getAliyunImageUrl} from "@/utils/filters"
  export default {
    data() {
      return {

        ruleForm: {
          sysLogo: '',
          mobilLogo: '',
          openScan:1,
          signCodeExpires:'180',
          transcriptIds:'',
          tplSplitByClassfy:0,
          foulScore:'1'
        },

      }
    },
    props:{
      name:String,
    },
    created() {
      this.getsettings()
    },
    methods: {
      getsettings() {
        this.$http.get("/system/school/getsettings").then(res => {
           this.ruleForm=res.data
        });
      },
      uploadSuccessed(url) {
        var that = this
        this.$set(that.ruleForm,'sysLogo', url)
      },
      uploadSuccesseds(url) {
        var that = this
        this.$set(that.ruleForm,'mobilLogo', url)
      },

      savelogo() {
        if (this.ruleForm.signCodeExpires==''){
          this.ruleForm.signCodeExpires=180
        } ;
        if (this.ruleForm.foulScore==''){
          this.ruleForm.foulScore=1
        } ;

        this.$confirm('请注意：若修改了违约减诚信值，则会触发全体学生的学分重新计算，这个过程大概需要1-2小时，在此期间涉及到学分查询与导出的所有功能均不可用，确定要修改吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post("/system/school/setting", this.ruleForm).then((res) => {
            if (res.code == '200') {
              this.$message({
                type: 'success',
                message: '设置成功!'
              });
              localStorage.setItem('sysschoolLogo', this.ruleForm.sysLogo)
              localStorage.setItem('mobschoolLogo', this.ruleForm.mobilLogo)
            }
          })
        }).catch( () => {

        })
      }
    },
    mounted () {

    }
  }

</script>
<style>
  #upImg2 i{
    border-radius:0;
    height: 140px;
    width: 280px;
    line-height: 140px;
  }
  #upImg2 img{
    border-radius:0;
    height: 140px;
    width: 280px;
    line-height: 140px;
  }
  .hrefColor {
    color: #66b1ff;
  }
  .xinxitou {
    border-radius: 5px;
    margin-left: 10px;
    padding: 8px;
    background: rgb(190, 224, 247);
    padding-left: 18px;
    margin-bottom: 15px;
  }
</style>

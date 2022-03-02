<template>
  <div class="rightBg">
    <back></back>
    <div class="basic-title"><span>预警设置</span></div>
    <el-form :model="warnSet" size="medium"  ref="warnSet" label-width="120px" class="demo-ruleForm">
      <el-row class="warn-set">
        <div class="set-title"><i class="el-icon-caret-right"></i><span>无限定类型预警设置</span></div>
        <div class="clear">
        <div class="left">最低预警学时</div>
        <el-col :md="12">
          <el-form-item label="在校最低学时">
            <el-col :span="22">
              <el-select  v-model="warnSet.nonLimitMinPercent" >
                <el-option
                  v-for="item in percents"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        </div>
        <div class="clear">
        <div class="left">最高预警学时</div>
        <el-col :md="12">
          <el-form-item label="在校最高学时">
            <el-col :span="22">
              <el-select  v-model="warnSet.nonLimitMaxPercent">
                <el-option
                  v-for="item in percents"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-col>

          </el-form-item>
        </el-col>
        </div>
        <div class="set-title"><i class="el-icon-caret-right"></i><span>{{compulsoryName}}预警设置</span></div>
        <div class="clear">
          <div class="left">最低预警学时</div>
          <el-col :md="12">
            <el-form-item label="在校最低学时">
              <el-col :span="22">
                <el-select  v-model="warnSet.compulsoryMinPercent" >
                  <el-option
                    v-for="item in percents"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </div>
        <div class="clear">
          <div class="left">最高预警学时</div>
          <el-col :md="12">
            <el-form-item label="在校最高学时">
              <el-col :span="22">
                <el-select  v-model="warnSet.compulsoryMaxPercent">
                  <el-option
                    v-for="item in percents"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </div>
        <div class="set-title"><i class="el-icon-caret-right"></i><span>{{electiveName}}预警设置</span></div>
        <div class="clear">
          <div class="left">最低预警学时</div>
          <el-col :md="12">
            <el-form-item label="在校最低学时">
              <el-col :span="22">
                <el-select  v-model="warnSet.electiveMinPercent" >
                  <el-option
                    v-for="item in percents"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </div>
        <div class="clear">
          <div class="left">最高预警学时</div>
          <el-col :md="12">
            <el-form-item label="在校最高学时">
              <el-col :span="22">
                <el-select  v-model="warnSet.electiveMaxPercent">
                  <el-option
                    v-for="item in percents"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
      <el-form-item>
        <el-button type="primary" class="resetBtn" @click="submit('warnSet')" :disabled="$store.state.sys.isClick">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    export default {
      data(){
        return {
          compulsoryName:localStorage.getItem("compulsoryName"), //必修显示名称
          electiveName:localStorage.getItem("electiveName"),  //选修显示名称
          percents:[
            {
              value: 1,
              label: '10%'
            },{
              value: 2,
              label: '20%'
            },{
              value: 3,
              label: '30%'
            },{
              value: 4,
              label: '40%'
            },{
              value: 5,
              label: '50%'
            },{
              value: 6,
              label: '60%'
            },{
              value: 7,
              label: '70%'
            },{
              value: 8,
              label: '80%'
            },{
              value: 9,
              label: '90%'
            },{
              value: 10,
              label: '100%'
            },{
              value: 11,
              label: '110%'
            },{
              value: 12,
              label: '120%'
            },{
              value: 13,
              label: '130%'
            },{
              value: 14,
              label: '140%'
            },{
              value: 15,
              label: '150%'
            }
          ],
          warnSet:{
            nonLimitMinPercent:'',
            nonLimitMaxPercent:'',
            compulsoryMinPercent:'',
            compulsoryMaxPercent:'',
            electiveMinPercent:'',
            electiveMaxPercent:'',
          }
        }
      },
      created() {
        this.getData();
      },
      methods:{
        getData(){
          this.$http.get('/limitWarning/get/setWarning').then(res => {
            if(res.data&&res.data.length!=0){
              var warnSet=res.data[0];
              this.warnSet.nonLimitMinPercent=warnSet.nonLimitMinPercent;
              this.warnSet.nonLimitMaxPercent=warnSet.nonLimitMaxPercent;
              this.warnSet.compulsoryMinPercent=warnSet.compulsoryMinPercent;
              this.warnSet.compulsoryMaxPercent=warnSet.compulsoryMaxPercent;
              this.warnSet.electiveMinPercent=warnSet.electiveMinPercent;
              this.warnSet.electiveMaxPercent=warnSet.electiveMaxPercent;
              this.warnSet.id=warnSet.id;
            }else{
              this.warnSet.nonLimitMinPercent='100%';
              this.warnSet.nonLimitMaxPercent='150%';
              this.warnSet.compulsoryMinPercent='100%';
              this.warnSet.compulsoryMaxPercent='150%';
              this.warnSet.electiveMinPercent='100%';
              this.warnSet.electiveMaxPercent='150%';
            }
          })
        },
        submit(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$http.post('/limitWarning/setWarning', this.warnSet).then(res => {
                if (res.code == '200') {
                  this.$refs[formName].resetFields();
                  this.$message({
                    type: 'success',
                    message: '设置成功!'
                  });
                  // this.getData()
                  this.$router.push('/analysis/warning')
                }
              })
            }
          })
        }
      }
    }
</script>

<style scoped>
.warn-set{
  border: 1px solid #dedede;
  border-top:none;
  margin-top: 20px;
  width: 80%;
}
  .set-title{
    border-bottom: 1px solid #dedede;
    border-top: 1px solid #dedede;
    font-weight: bold;
    padding: 20px;
    margin-bottom: 20px;
  }
  .left{
    float: left;
    margin-left: 40px;
    margin-top: 8px;
    font-size: 14px;
  }
.el-form-item{
  margin-bottom: 0px !important;
}
  .clear{
    clear: both;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .resetBtn{
    margin-top: 30px;
  }
</style>

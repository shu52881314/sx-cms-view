<template>

  <div class="rightBg">

    <el-dialog title="修改学分" :visible.sync="dialogVisible" :close-on-click-modal="false"  >
        <div>
            <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
              <el-form-item label="兑换方式" style="margin-bottom:10px"  >
                  <el-select v-model="ruleForm.method" @change="changeMethod">
                    <el-option
                      v-for="item in methods"
                      :key="item.value"
                      :label="item.value"
                      :value="item.label" >
                    </el-option>
                  </el-select>
              </el-form-item>
              <div v-if="showMethod">
                <el-form-item label='兑换比例'>
                  <el-form-item  prop="hours">
                  1学分= <el-input style="width:150px;" clearable v-model="ruleForm.hours"></el-input> {{hoursUnit}}
                </el-form-item>
                </el-form-item>
              </div>
              <div v-if="!showMethod">
                <el-form-item label='兑换比例' >
                    <el-form-item :label='item.name'  label-width="190px" v-for="(item,index)  in ruleForm.waysCategories"  :key="index"
                                  :prop="'waysCategories.' + index + '.scoreRate'"
                                  :rules="[{required: true,message: '请输入学分比例',trigger: 'blur'}]">
                      1学分= <el-input  style="width:150px;"  v-model="item.scoreRate" class="hours-input" ></el-input > {{hoursUnit}}
                    </el-form-item>
                </el-form-item>
              </div>
                <el-form-item>
                  <div style="text-align:Center;padding-top:10px;">  <el-button type="primary" @click="submitForm('ruleForm')">确定修改</el-button> </div>
                </el-form-item>
            </el-form>

        </div>

    </el-dialog>


    <div class="page-head" style="padding-top:20px;">
        <span class="page-title">学分比例</span>
    </div>
    <div class="rateMain" style="margin-top: 20px;"><span>兑换方式：</span>{{waysConvert}}</div>
    <div class="rateMain" v-if="showHours"><span>兑换比例：</span>当前学分比例为 1 学分 : {{ rate }} {{hoursUnit}} </div>
    <div class="rateHours" v-if="!showHours"><div style="float: left"><span>兑换比例：</span></div>
    <div style="float: left; margin-left: 10px; ">
      <table class="rate-table">
        <tr v-for="item in waysCategories"><td >{{item.name}}</td><td  width="20%">当前学分比例1 学分</td><td width="10%">{{ item.scoreRate }} {{hoursUnit}}</td></tr>
      </table>
    </div></div>
     <div class="rateMain" style="margin-top: 20px; margin-left: 20%; margin-bottom: 30px;"><el-button @click="modify" size="mini" type="primary" v-perms="'/system/sorce_rate/edit'">修改</el-button></div>
  </div>

</template>

<style scoped>
 .ratemAll{font-size:16px;}
 .rate-icon{font-size:40px;padding-top:40px;padding-bottom:10px;}
 .rateMain{font-size:14px;padding-top:20px; color: #666; width: 60%; margin: 0 auto;}
 .rateMain span,.rateHours span{ font-size: 15px; color: #000;}
.rateHours{width: 60%; margin: 0 auto;font-size:14px;padding-top:20px; color: #666; clear: both; overflow: hidden;}
 .rate-table{ border-collapse: collapse; border-spacing: 0; }
  .rate-table td{ border: 1px solid #eee; padding:8px 20px;}
</style>

<script>
  export default{
    data(){
      return {
        hoursUnit:localStorage.getItem("hoursUnit"),
        dialogVisible: false,
        rate:'1',
        ruleForm: {
            hours: '',
            method:'',
          waysCategories:[]
        },
        rules: {
            hours: [{required: true,message: '请输入学分比例',trigger: 'blur'}],
            scoreRate: [{required: true,message: '请输入学分比例',trigger: 'blur'}]
        },
        methods:[{value:'统一兑换',label:0},{value:'按分类兑换',label:1}],
        showHours:'',
        showMethod:true,
        waysConvert:'',
        waysCategories:[]
      }
    },
    created(){
       this.getWays();
    },
    methods:{
      getWays(){
        this.$http.get('/system/ways-convert').then( res => {
          if(res.data.waysConvert==1){
            this.waysConvert ='统一兑换';
            this.showHours=true;
            this.showMethod=true;
            this.ruleForm.method=0;
            this.fetchData()
          }else{
            this.waysConvert ='按分类兑换';
            this.showHours=false;
            this.ruleForm.method=1;
            this.showMethod=false;
            this.fetchData1();
          }
        })
      },
      changeMethod(val){
        this.showMethod=val==0?true:false;
        if(!this.showMethod){
          this.fetchData1();
        }
      },
      fetchData(){
        this.$http.get('/system/rate').then( res => {
            this.rate = res.data.rate
            this.ruleForm.hours= res.data.rate
        })
      },
      fetchData1(){
        this.$http.get('/qu-activity-classify/list-one').then( res => {
          this.waysCategories=res.data;
          this.ruleForm.waysCategories=JSON.parse(JSON.stringify(res.data));
        })
      },
      submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.ruleForm.method==0){
                this.$http.post('/system/rate/modify', this.ruleForm).then( res => {
                  if (res.code == '200') {
                    this.$message({
                      type: 'success',
                      message: '修改成功!'
                    });
                    this.dialogVisible = false;
                    this.getWays()
                  }
                })
              }else{
                this.$http.post('/qu-activity-classify/modify-score-rate', {scoreRates:this.ruleForm.waysCategories}).then( res => {
                  if (res.code == '200') {
                    this.$message({
                      type: 'success',
                      message: '修改成功!'
                    });
                    this.dialogVisible = false;
                    this.getWays()
                  }
                })
              }
            }
          });
      },
      modify(){
        this.dialogVisible = true;
      }
    }
  }
</script>

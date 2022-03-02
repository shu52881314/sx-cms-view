<template >
  <div class="completionStatus">
        <ul class="hourLists" v-for='item in completionData'>
          <li>{{item.classifyName}}</li>
          <li style="width: 80%;">
            <div v-for="item1 in item.list">
              <div class="item" v-if="item1.typeName=='必修'">
                <span class="span-icon left">{{compulsoryName}}</span>
                <div class="right" style="width: 80%">
                  <div class="item-info">
                    <span>最低预警{{hoursUnit}}：{{item1.minHours}} </span>
                    <span class="tip-red">低于最低预警{{hoursUnit}} &nbsp;&nbsp;&nbsp;{{item1.lowerPersonNumb}}人</span>
                    <span class="right person">上次预警日期:<span v-if="item1.minLastTime">{{item1.minLastTime | formatDate}}</span> 预警人：{{item1.minWarnPersonName}}</span> &nbsp;&nbsp;&nbsp;
                    <el-button class="send-btn"  @click="sendMessage(item1.typeName,item1.activityClassifyId,item.classifyName,item1.maxHours,item1.minHours,2)">发送预警消息</el-button> &nbsp;&nbsp;&nbsp;
                  </div>
                  <div class="item-info">
                    <span>最高预警{{hoursUnit}}：{{item1.maxHours}}  </span>
                    <span class="tip-red">超过最高预警{{hoursUnit}} &nbsp;&nbsp;&nbsp;{{item1.highPersonNum}}人</span>
                    <span class="right person">上次预警日期:<span v-if="item1.maxLastTime">{{item1.maxLastTime | formatDate}}</span> 预警人：{{item1.maxWarnPersonName}}</span> &nbsp;&nbsp;&nbsp;
                    <el-button class="send-btn" @click="sendMessage(item1.typeName,item1.activityClassifyId,item.classifyName,item1.maxHours,item1.minHours,1)">发送预警消息</el-button> &nbsp;&nbsp;&nbsp;
                  </div>
                </div>
              </div>
              <div class="item"  v-if="item1.typeName=='选修'">
              <span class="span-icon1 left">{{electiveName}}</span>
              <div class="right" style="width: 80%">
                <div class="item-info">
                  <span>最低预警{{hoursUnit}}：{{item1.minHours}} </span>
                  <span class="tip-red">低于最低预警{{hoursUnit}} &nbsp;&nbsp;&nbsp;{{item1.lowerPersonNumb}}人</span>
                  <span class="right person" >上次预警日期:<span v-if="item1.minLastTime">{{item1.minLastTime | formatDate}}</span> 预警人：{{item1.minWarnPersonName}}</span> &nbsp;&nbsp;&nbsp;
                  <el-button class="send-btn"  @click="sendMessage(item1.typeName,item1.activityClassifyId,item.classifyName,item1.maxHours,item1.minHours,2)">发送预警消息</el-button> &nbsp;&nbsp;&nbsp;
                </div>
                <div class="item-info">
                  <span>最高预警{{hoursUnit}}：{{item1.maxHours}} </span>
                  <span class="tip-red">超过最高预警{{hoursUnit}} &nbsp;&nbsp;&nbsp;{{item1.highPersonNum}}人</span>
                  <span class="right person" >上次预警日期:<span v-if="item1.maxLastTime">{{item1.maxLastTime | formatDate}}</span>  预警人：{{item1.maxWarnPersonName}}</span> &nbsp;&nbsp;&nbsp;
                  <el-button class="send-btn"  @click="sendMessage(item1.typeName,item1.activityClassifyId,item.classifyName,item1.maxHours,item1.minHours,1)">发送预警消息</el-button> &nbsp;&nbsp;&nbsp;
                </div>
              </div>
            </div>
            <div class="item"  v-if="item1.typeName=='非必修选修'">
              <span class="span-icon1 left">无</span>
              <div class="right" style="width: 80%">
                <div class="item-info">
                  <span>最低预警{{hoursUnit}}：{{item1.minHours}} </span>
                  <span class="tip-red">低于最低预警{{hoursUnit}} &nbsp;&nbsp;&nbsp;{{item1.lowerPersonNumb}}人</span>
                  <span class="right person" >上次预警日期:<span v-if="item1.minLastTime">{{item1.minLastTime | formatDate}}</span> 预警人：{{item1.minWarnPersonName}}</span> &nbsp;&nbsp;&nbsp;&nbsp;
                  <el-button class="send-btn"  @click="sendMessage(item1.typeName,item1.activityClassifyId,item.classifyName,item1.maxHours,item1.minHours,2)">发送预警消息</el-button> &nbsp;&nbsp;&nbsp;
                </div>
                <div class="item-info">
                  <span>最高预警{{hoursUnit}}：{{item1.maxHours}} </span>
                  <span class="tip-red">超过最高预警{{hoursUnit}} &nbsp;&nbsp;&nbsp;{{item1.highPersonNum}}人</span>
                  <span class="right person" >上次预警日期:<span v-if="item1.maxLastTime">{{item1.maxLastTime | formatDate}}</span> 预警人：{{item1.maxWarnPersonName}}</span> &nbsp;&nbsp;&nbsp;&nbsp;
                  <el-button class="send-btn"  @click="sendMessage(item1.typeName,item1.activityClassifyId,item.classifyName,item1.maxHours,item1.minHours,1)">发送预警消息</el-button> &nbsp;&nbsp;&nbsp;
                </div>
              </div>
            </div>
            </div>
          </li>
        </ul>
    <el-dialog title="发送预警消息" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="beforeCloseHandler">
      <el-form size="mini" :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
        <el-form-item >
          <el-col :span="22">
            <input type="hidden"  v-model="ruleForm.maxHours" />
            <input type="hidden"  v-model="ruleForm.minHours" />
            <input type="hidden"  v-model="ruleForm.hoursType" />
            <input type="hidden"  v-model="ruleForm.limitType" />
            <input type="hidden"  v-model="ruleForm.classifyId" />
            <el-input type="textarea"  v-model="ruleForm.remark" placeholder="请填写发送内容" maxlength='200'></el-input>
          </el-col>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary" class="marginRight" @click="submitForm()">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {formatDate} from '@/utils/filters'
export default {
  props:[
    "completionData"
  ],
  data(){
    return{
      hoursList : [],
      hoursUnit:localStorage.getItem("hoursUnit"),
      compulsoryName:localStorage.getItem("compulsoryName"), //必修显示名称
      electiveName:localStorage.getItem("electiveName"),  //选修显示名称
      dialogVisible:false,
      ruleForm:{
        maxHours:'',
        minHours:'',
        hoursType:'',
        limitType:'',
        classifyId:'',
        remark:''
      }
    }
  },
  created(){
  },
  methods:{
    beforeCloseHandler(){
      this.dialogVisible = false;
    },
    sendMessage(limitType,classifyId,classifyName,maxHours,minHours,hoursType){
      this.dialogVisible = true;
      if(limitType=='必修'){
        limitType=this.compulsoryName
        this.ruleForm.limitType=1
      }else if(limitType=='选修'){
        limitType=this.electiveName
        this.ruleForm.limitType=2
      }if(limitType=='非必修选修'){
        limitType=''
        this.ruleForm.limitType=3
      }
      this.ruleForm.maxHours=maxHours;
      this.ruleForm.minHours=minHours;
      if(hoursType==1){
        this.ruleForm.remark='同学您好，你在'+limitType+classifyName+'中学时已超过在校最高'+this.hoursUnit+'，在校表现活跃，为了自己更好的发展，可以综合发展自己。'
      }else if(hoursType==2){
        this.ruleForm.remark='同学您好，你在'+limitType+classifyName+'中'+this.hoursUnit+'暂未修满，在以后的日子里，请记得积极参与。'
      }
      this.ruleForm.classifyId=classifyId
      this.ruleForm.hoursType=hoursType
    },
    submitForm(){
      if(this.ruleForm.remark==''){
        this.$message({
          type: 'error',
          message: '请填写发送内容!'
        });
        return;
      }
      this.$http.post('/limitWarning/sendLimitWarning',this.ruleForm).then( res => {
        if (res.code == '200') {
          this.$message({
            type: 'success',
            message: '发送成功!'
          });
          this.dialogVisible = false
          this.$parent.refreshList();
        }
      })
    }
  }
}
</script>

<style  scoped>
.completionStatus{
  padding: 0px 2%;
  clear: both;
  overflow: hidden;
  font-size: 14px;
}
.hourLists {clear: both; overflow: hidden; border-bottom: 1px solid #dedede; padding-bottom: 10px;margin-top: 20px;width: 100%;}
.hourLists li{ float: left; line-height: 28px;}
.hourLists li:first-child{ width: 15%; margin-top: 10px; font-weight: bold;}
.left{ float: left;}
.right{ float: right;}
.item{ clear: both; overflow: hidden; width: 100%;}
.span-icon{ margin-top: 10px; border: 1px solid #0099ff; border-radius: 5px; padding: 0px 10px; margin-right: 1%; text-align: center; width: 10%}
.span-icon1{ margin-top: 10px; border: 1px solid #ff9900; border-radius: 5px; padding: 0px 10px; margin-right: 1%; text-align: center;width: 10%}
  .tip-red{color: red; padding-left: 15px;}
  .item-info{ margin-bottom: 10px;}
  .item-info span{ display: inline-block; margin-bottom: 5px;}
  .send-btn{ background: #02bca6; border: 1px solid #02bca6; padding: 8px 10px; color: #fff; float: right; margin-right: 25px;}
  .person{ width: 40%;}
  .marginRight{ margin-right: 60px;}
</style>

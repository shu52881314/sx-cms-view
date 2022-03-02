<template>
   <div class="rightBg">
     <div class="page-head page-headCurrent" style="width:98%;margin:0 auto;padding-top:20px;padding-bottom:20px;">
       <span class="page-title">学情预警</span>
       <span class="page-tool statistics-titler" style="padding: 0px 10px;" @click="dialogVisible=true">
           <i class="el-icon-question"></i>
       </span>
       
       <span style="float: right"> 
        <el-button type="primary" @click="routerLink('/analysis/warningSetting')">
            <i class="el-icon-setting"></i> 学情预警设置
        </el-button>
       </span>
     </div>
     
     <div class="report-data">
      <warning-data :showData="showData" 
                    :classifyData="classifyData" 
                    :valueData1="valueData1"
                    :valueData2="valueData2" 
                    :valueData3="valueData3" 
                    :valueData4="valueData4" 
                    :valueData5="valueData5" 
                    :valueData6="valueData6"
                    :valueData7="valueData7" 
                    :valueData8="valueData8" 
                    :valueData9="valueData9">
      </warning-data>
     </div>
     
     <div class="report-data">
       <completion-status :completionData='completionData' ></completion-status>
     </div>
     
     <el-dialog title="关于学期预警" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="beforeCloseHandler" width="200">
       <p style="padding: 10px 40px 40px; ">学情预警是对学校第二课堂成绩的监督，为了提高大学的综合素质能力，可对未达到在校最低学时与超过最高学时的学生进行站内信提醒，督促提高综合素质能力</p>
       <p style="text-align: center"> <el-button type="primary" @click="dialogVisible = false;">知道了</el-button> </p>
     </el-dialog>

   </div>
</template>
<script>
import warningData from "./components/warningData.vue";
import completionStatus from './components/completionStatus.vue'
export default {
    name: 'department',
    data() {
      return {
        hoursUnit:localStorage.getItem("hoursUnit"),
        compulsoryName:localStorage.getItem("compulsoryName"), //必修显示名称
        electiveName:localStorage.getItem("electiveName"),  //选修显示名称
        showData:[],
        classifyData:[],
        valueData1:[],
        valueData2:[],
        valueData3:[],
        valueData4:[],
        valueData5:[],
        valueData6:[],
        valueData7:[],
        valueData8:[],
        valueData9:[],
        completionData:'',
        dialogVisible:false
      }
    },
  components:{
    warningData,
    completionStatus
  },
    created(){
       this.showData=["（"+this.compulsoryName+"）未达标人数","（"+this.compulsoryName+"）已达标人数","（"+this.compulsoryName+"）超标人数",
         "（"+this.electiveName+"）未达标人数","（"+this.electiveName+"）已达标人数","（"+this.electiveName+"）超标人数",
         "无限定类型未达标人数","无限定类型已达标人数","无限定类型超标人数"];
      this.loadtranscript();
      this.getList()
    },
    methods:{
      loadtranscript(){
        this.$http.get("/limitWarning/limitWarning/count").then((res) => {
          var data=res.data;
          for(var i=0;i<data.length;i++){
            if(data[i].classifyName.length>6){
              data[i].classifyName=data[i].classifyName.substr(0,6)+'...'
            }
            this.classifyData.push(data[i].classifyName);
            var list=data[i].list;
            for(var j=0;j<list.length;j++){
              if(list[j].typeName=='必修'){
                   if(list[j].name=='未达标'){
                     this.valueData1.push(list[j].personNum);
                   }
                  if(list[j].name=='已达标'){
                    this.valueData2.push(list[j].personNum);
                  }
                  if(list[j].name=='超标'){
                    this.valueData3.push(list[j].personNum);
                  }
              }
              if(list[j].typeName=='选修'){
                if(list[j].name=='未达标'){
                  this.valueData4.push(list[j].personNum);
                }
                if(list[j].name=='已达标'){
                  this.valueData5.push(list[j].personNum);
                }
                if(list[j].name=='超标'){
                  this.valueData6.push(list[j].personNum);
                }
              }
              if(list[j].typeName=='非必修选修'){
                if(list[j].name=='未达标'){
                  this.valueData7.push(list[j].personNum);
                }
                if(list[j].name=='已达标'){
                  this.valueData8.push(list[j].personNum);
                }
                if(list[j].name=='超标'){
                  this.valueData9.push(list[j].personNum);
                }
              }
            }
          }
        })
      },
      refreshList(){
        this.getList()
      },
      getList(){
        this.$http.get("/limitWarning/limitWarning/countList").then((res) => {
           this.completionData=res.data
        })
      },
      beforeCloseHandler(){
        this.dialogVisible = false;
      },
    },
    mounted () {

    }
};
</script>

<style scoped>
.report-data{ margin-top: 20px; clear: both; overflow: hidden}
</style>

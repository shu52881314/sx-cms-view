
<style scoped>
 .statistics{width:98%;overflow:hidden;text-align:center;line-height:30px;font-size:14px;}
 .statistics-title{font-size:16px;}
 .statistics-chart{width:98%;overflow:hidden;height:500px;margin:0 auto;margin-top:30px;}
 .statistics-title{width:98%;overflow:hidden;margin:0 auto;}
 .statistics-titler{color:#999}
 .statisticsMain{border:1px solid #F2F2F2;min-height:100px;width:98%;margin:0 auto;}
.statisticsMain-top{width:100%;height:50px;line-height:50px;background:#F2F2F2}
.statisticsMain-topl{margin-left:10px;font-size:14px;}
.statisticsMain-topr{margin-right:10px;margin-top:3px;}
.page-headCurrent{border:none}
.statisticsMain-bottom{width:100%;padding:20px 0;}
.statisticsMainMt{margin-top:20px;}
.statistics-dleft{margin-top:15px;font-weight:bold;}
.index-chart-change{width:98%;border-bottom:1px solid #F6F6FC;overflow:hidden;margin:0px auto;padding-top:20px;font-size:15px;}
.index-chart-change li{float:left;margin-right:20px;height:30px;
color:#666;cursor:pointer;padding-left:20px;padding-right:20px;}
.index-chart-change .cur{border-bottom:2px solid #008AFF;color:#008AFF}
.index-chart-change .cur span{color:#008AFF}
.index-chart-change li span{color:#666;font-size:13px;}
</style>

<template>
   <div class="rightBg">



       <div class="page-head page-headCurrent" style="width:98%;margin:0 auto;padding-top:20px;padding-bottom:20px;">
           <span class="page-title">素拓统计</span>
           <span class="page-tool statistics-titler">
             所有数据均由系统导入以及管理员创建综合统计结果
           </span>
       </div>

       <div class="statisticsMain">

           <div class="statisticsMain-bottom">
             <el-row :gutter="10">
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">活动总数</div>
                    <div><b>{{Statistics.activityCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">活动参与人次</div>
                    <div><b>{{Statistics.activityUserCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">活动签到率</div>
                    <div><b>{{Statistics.activitySignPercent}}%</b></div>
                 </div>
               </el-col>
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">审核中活动</div>
                    <div><b>{{Statistics.activityWaitAuditCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">进行中活动</div>
                    <div><b>{{Statistics.activityProgressingCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">自主申报总数</div>
                    <div><b>{{Statistics.projectApplyCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="4">
                 <div class="statistics">
                    <div class="statistics-title">自主申报待审核总数</div>
                    <div><b>{{Statistics.projectApplyWaitAuditCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="2">
                 <div class="statistics">
                    <div class="statistics-title">奖惩项</div>
                    <div><b>{{Statistics.rewardCount}}</b></div>
                 </div>
               </el-col>


             </el-row>
           </div>
       </div>


  <el-tabs v-model="activeName"  @tab-click="handleClick(activeName)" style="width:98%;padding-top:20px;margin:0 auto">


    <el-tab-pane label="活动统计" name="1">


      <el-form style="padding-top:10px;" size="mini" :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="ParamsMajor.name" maxlength=30  placeholder="请输入名称搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchMajor">查询</el-button>
        </el-form-item>
      </el-form>


     <el-table border  ref="multipleTable" :data="CollegeData" header-row-class-name="table-header-row" size="mini"  >
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column prop="name" label="活动名称">
        <div slot-scope="scope">
          <p>{{scope.row.name}}</p>
        </div>
      </el-table-column>
      <el-table-column prop="classifyName" label="分类名称"></el-table-column>
      <!-- <el-table-column prop="activityLimitType" label="限定类型"  show-overflow-tooltip></el-table-column> -->

      <el-table-column prop="orgName" label="主办方"></el-table-column>
      <el-table-column prop="status" :formatter="formatterStatus" label="活动状态"></el-table-column>
      <el-table-column  label="报名成员">
      	<template slot-scope="scope">
       		<span>{{scope.row.activityUserCount}}人</span>
       	</template>
      </el-table-column>
      <el-table-column prop="signCount" label="签到成员">
      	<template slot-scope="scope">
       		<span>{{scope.row.signCount}}人</span>
       	</template>
      </el-table-column>
      <el-table-column  :label="'活动' + hoursUnit">
        <template slot-scope="scope">
          <span>{{scope.row.credit==''?'0.00':scope.row.credit.toFixed(2)}}</span>
        </template>
      </el-table-column>
     </el-table>

     <qu-pagination :total="ParamsMajor.total" @change="MajorchangePage"></qu-pagination>

    </el-tab-pane>
    <el-tab-pane label="自主申报统计" name="2">


      <el-form style="padding-top:10px;" size="mini" :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="ParamsClass.name"  maxlength=30 placeholder="请输入名称搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchClass">查询</el-button>
        </el-form-item>
      </el-form>


     <el-table border  ref="multipleTable" :data="ClassData" header-row-class-name="table-header-row" size="mini"  >
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column prop="optionName" label="奖项名称"></el-table-column>
      <el-table-column prop="score" :label="hoursUnit">
        <template slot-scope="scope">
          <span>{{scope.row.score.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyCount" label="已申请人数">
      	<template slot-scope="scope">
       		<span>{{scope.row.applyCount}}人</span>
       	</template>
      </el-table-column>
      <el-table-column prop="waitAuditCount" label="待审核人数">
      	<template slot-scope="scope">
       		<span>{{scope.row.waitAuditCount}}人</span>
       	</template>
      </el-table-column>
     </el-table>

     <qu-pagination :total="ParamsClass.total" @change="ClasschangePage"></qu-pagination>

    </el-tab-pane>
    <el-tab-pane label="奖惩项" name="3">


      <el-form style="padding-top:10px;" size="mini" :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="ParamsStudent.name" maxlength=30  placeholder="请输入名称搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchStudent">查询</el-button>
        </el-form-item>
      </el-form>


     <el-table border  ref="multipleTable" :data="StudentData" header-row-class-name="table-header-row" size="mini"  >
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column prop="type" label="项目类型">
          <div slot-scope="scope">
                {{scope.row.type == 1 ? "加分项" : "减分项"}}
          </div>
      </el-table-column>
      <el-table-column prop="awardAvgScore" :label="'学生平均' + hoursUnit">
        <div slot-scope="scope">
          {{scope.row.awardAvgScore.toFixed(2)}}
        </div>
      </el-table-column>
      <el-table-column prop="awardUserCount" label="项目人数">
      	<template slot-scope="scope">
       		<span>{{scope.row.awardUserCount}}人</span>
       	</template>
      </el-table-column>
     </el-table>

     <qu-pagination :total="ParamsStudent.total" @change="StudentchangePage"></qu-pagination>

    </el-tab-pane>




    <!--<el-tab-pane label="打卡" name="4">-->


      <!--<el-form style="padding-top:10px;" size="mini" :inline="true" class="demo-form-inline">-->
        <!--<el-form-item>-->
          <!--<el-input v-model="ParamsTeacher.name" maxlength=30  placeholder="请输入名称搜索"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-button size="mini" type="primary" @click="searchTeacher">查询</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->

     <!--<el-table border  ref="multipleTable" :data="TeacherData" header-row-class-name="table-header-row" size="mini"  >-->
      <!--<el-table-column type="index" width="55"></el-table-column>-->
      <!--<el-table-column prop="name" label="打卡名称"></el-table-column>-->
      <!--<el-table-column prop="hasSignCount" label="参与人数">-->
      	<!--<template slot-scope="scope">-->
       		<!--<span v-if="scope.row.hasSignCount==0">不限</span>-->

       		<!--<span v-else>{{scope.row.hasSignCount}}人</span>-->
       	<!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="usersCount" label="实际打卡人数">-->
      	<!--<template slot-scope="scope">-->
       		<!--<span>{{scope.row.usersCount}}人</span>-->
       	<!--</template>-->
      <!--</el-table-column>-->
     <!--</el-table>-->

     <!--<qu-pagination :total="ParamsTeacher.total" @change="TeacherchangePage"></qu-pagination>-->


    <!--</el-tab-pane>-->

</el-tabs>

   </div>
</template>
<script>
export default {
    name: 'department',
    data() {
      return {
        hoursUnit:localStorage.getItem("hoursUnit"),
        campusName:"",
        collegeName:"",
        transferMajorName:"",
        TeacherName:"",
        ParamsMajor:{
          name:'',
          current:1,
          size:10,
          total:0,
        },
        ParamsClass:{
          name:'',
          current:1,
          size:10,
          total:0,
        },
        ParamsStudent:{
          name:'',
          current:1,
          size:10,
          total:0,
        },
        ParamsTeacher:{
          name:'',
          current:1,
          size:10,
          total:0,
        },
        activeName:"1",
        Statistics:'',
        departmentvalue:"",
        options:[],
        CampusData:[],
        CollegeData:[],
        ClassData:[],
        StudentData:[],
        TransferMajorData:[],
        TeacherData:[],
        data:[]
      }
    },
    computed:{

    },
    created(){
      this.$http.get('/statistics/sutuo/summary').then(res => {
        this.Statistics   = res.data
      })
      this.getMajor()
    },
    methods:{
      formatterStatus(row, column, cellValue){
        if(cellValue == 0){
          return "已结束"
        } else if(cellValue == 1){
          return "未开始"
        }else if(cellValue == 2){
          return "进行中"
        }





      },
      handleClick(tab){

        if (tab == 1) {
             this.getMajor()
        }else if (tab == 2) {
            this.getClass()
        }else if (tab == 3) {
            this.getStudent()
        }
        // else if (tab == 4) {
        //     this.getTeacher()
        // }

      },



      //活动统计
      getMajor(){
        this.$http.get('/statistics/activity/list',{
          params:this.ParamsMajor
        }).then(res => {
            this.CollegeData   = res.data.list
            this.ParamsMajor.total = res.data.total
        })
      },
      searchMajor(){
        this.ParamsMajor.current = 1
        this.getMajor()
      },
      MajorchangePage(current, size){
        this.ParamsMajor.current = current
        this.ParamsMajor.size = size
        this.getMajor()
      },
      //自主
      getClass(){
        this.$http.get('/statistics/project/list',{
          params:this.ParamsClass
        }).then(res => {
            this.ClassData   = res.data.list
            this.ParamsClass.total = res.data.total
        })
      },
      searchClass(){
        this.ParamsClass.current = 1
        this.getClass()
      },
      ClasschangePage(current, size){
        this.ParamsClass.current = current
        this.ParamsClass.size = size
        this.getClass()
      },
      //奖惩
      getStudent(){
        this.$http.get('/statistics/award/list',{
          params:this.ParamsStudent
        }).then(res =>{
            this.StudentData   = res.data.list
            this.ParamsStudent.total = res.data.total
        })
      },
      searchStudent(){
        this.ParamsStudent.current = 1
        this.getStudent()
      },
      StudentchangePage(current, size){
        this.ParamsStudent.current = current
        this.ParamsStudent.size = size
        this.getStudent()
      },
      //转专业
      getTransferMajor(){
        this.$http.get('/statistics/transfer-major/list',{
          params:{name:this.transferMajorName}
        }).then(res => {
            this.TransferMajorData   = res.data
        })
      },
      searchTransferMajor(){
        this.getTransferMajor()
      },
      //职工
      getTeacher(){
        this.$http.get('/statistics/sign/list',{
          params:this.ParamsTeacher
        }).then(res => {
            this.TeacherData   = res.data.list
            this.ParamsTeacher.total = res.data.total
        })
      },
      searchTeacher(){
         this.ParamsTeacher.current = 1
         this.getTeacher()
      },
      TeacherchangePage(current, size){
        this.ParamsTeacher.current = current
        this.ParamsTeacher.size = size
        this.getTeacher()
      },

    },

    mounted () {

    }
};
</script>

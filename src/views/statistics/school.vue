
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
           <span class="page-title">全校统计</span>
           <span class="page-tool statistics-titler">
             本页面数据统计均为实时数据
           </span>
       </div>

       <div class="statisticsMain">

           <div class="statisticsMain-bottom">
             <el-row :gutter="10">
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">校区总数</div>
                    <div><b>{{Statistics.campusCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">院系总数</div>
                    <div><b>{{Statistics.collegeCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">专业总数</div>
                    <div><b>{{Statistics.majorCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">班级总数</div>
                    <div><b>{{Statistics.classCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">学生总数</div>
                    <div><b>{{Statistics.studentCount}}</b></div>
                 </div>
               </el-col>
               <!--<el-col :md="3">-->
                 <!--<div class="statistics">-->
                    <!--<div class="statistics-title">激活学生总数</div>-->
                    <!--<div><b>{{Statistics.activeCount}}</b></div>-->
                 <!--</div>-->
               <!--</el-col>-->
               <!--<el-col :md="3">-->
                 <!--<div class="statistics">-->
                    <!--<div class="statistics-title">转专业人数</div>-->
                    <!--<div><b>{{Statistics.specialtiesCount}}</b></div>-->
                 <!--</div>-->
               <!--</el-col>-->
               <!-- <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">党员人数</div>
                    <div><b>{{Statistics.dangyuanCount}}</b></div>
                 </div>
               </el-col> -->
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">团员人数</div>
                    <div><b>{{Statistics.tuanyuanCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">组织总数</div>
                    <div><b>{{Statistics.orgCount}}</b></div>
                 </div>
               </el-col>
             </el-row>
           </div>
       </div>


  <el-tabs  v-model="activeName"  @tab-click="handleClick(activeName)" style="width:98%;padding-top:20px;margin:0 auto">
    <el-tab-pane label="校区统计" name="1">


       <el-form style="padding-top:10px;" size="mini" :inline="true" class="demo-form-inline">
         <el-form-item>
           <el-input v-model="campusName" placeholder="请输入校区名称搜索"></el-input>
         </el-form-item>
         <el-form-item>
           <el-button size="mini" type="primary" @click="searchCampus">查询</el-button>
         </el-form-item>
       </el-form>


      <el-table border  v-loading="loading"  ref="multipleTable" :data="CampusData" header-row-class-name="table-header-row" size="mini"  >
       <el-table-column type="index" width="55"></el-table-column>
       <el-table-column prop="name" label="校区"></el-table-column>
       <el-table-column prop="collegeCount" label="院系总数">
       	<template slot-scope="scope">
       		<span>{{scope.row.collegeCount}}个</span>
       	</template>
       </el-table-column>
       <el-table-column prop="majorCount" label="专业总数">
       	<template slot-scope="scope">
       		<span>{{scope.row.majorCount}}个</span>
       	</template>
       </el-table-column>
       <el-table-column prop="classCount" label="班级总数">
       	<template slot-scope="scope">
       		<span>{{scope.row.classCount}}个</span>
       	</template>
       </el-table-column>
       <el-table-column prop="studentCount" label="学生总数">
       	<template slot-scope="scope">
       		<span>{{scope.row.studentCount}}人</span>
       	</template>
       </el-table-column>
       <el-table-column prop="organizationCount" label="组织数量">
       	<template slot-scope="scope">
       		<span>{{scope.row.organizationCount}}个</span>
       	</template>
       </el-table-column>
       <el-table-column prop="activityCount" label="活动数量">
       	<template slot-scope="scope">
       		<span>{{scope.row.activityCount}}个</span>
       	</template>
       </el-table-column>
       <el-table-column prop="projectApplyCount" label="自主申报数量">
       	<template slot-scope="scope">
       		<span>{{scope.row.projectApplyCount}}个</span>
       	</template>
       </el-table-column>
       <el-table-column prop="rewardsCount" label="奖惩项人数">
       	<template slot-scope="scope">
       		<span>{{scope.row.rewardsCount}}人</span>
       	</template>
       </el-table-column>
      </el-table>

    </el-tab-pane>
    <el-tab-pane label="院系统计" name="2">

      <el-form style="padding-top:10px;" size="mini" :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="collegeName" placeholder="请输入院系名称搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchCollege">查询</el-button>
        </el-form-item>
      </el-form>


     <el-table border v-loading="loading2"   ref="multipleTable" :data="CollegeData" header-row-class-name="table-header-row" size="mini"  >
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column prop="name" label="院系"></el-table-column>
      <el-table-column prop="majorCount" label="专业总数">
      	<template slot-scope="scope">
       		<span>{{scope.row.majorCount}}个</span>
       	</template>
      </el-table-column>
      <el-table-column prop="classCount" label="班级总数">
      	<template slot-scope="scope">
       		<span>{{scope.row.classCount}}个</span>
       	</template>
      </el-table-column>
      <el-table-column prop="studentCount" label="学生总数">
      	<template slot-scope="scope">
       		<span>{{scope.row.studentCount}}人</span>
       	</template>
      </el-table-column>
      <el-table-column prop="organizationCount" label="组织数量">
      	<template slot-scope="scope">
       		<span>{{scope.row.organizationCount}}个</span>
       	</template>
      </el-table-column>
      <el-table-column prop="activityCount" label="活动数量">
      	<template slot-scope="scope">
       		<span>{{scope.row.activityCount}}个</span>
       	</template>
      </el-table-column>
      <el-table-column prop="projectApplyCount" label="自主申报数量">
      	<template slot-scope="scope">
       		<span>{{scope.row.projectApplyCount}}个</span>
       	</template>
      </el-table-column>
      <el-table-column prop="rewardCount" label="奖惩项人数">
      	<template slot-scope="scope">
       		<span>{{scope.row.rewardCount}}人</span>
       	</template>
      </el-table-column>
      <el-table-column prop="averageHoursCount" :label=" '学生平均' + hoursUnit">
        <template slot-scope="scope">
          <span>{{scope.row.averageHoursCount.toFixed(2)}}</span>
        </template>
      </el-table-column>
     </el-table>



    </el-tab-pane>
    <el-tab-pane label="专业统计" name="3">


      <el-form style="padding-top:10px;" size="mini" :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="ParamsMajor.name" placeholder="请输入专业名称搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchMajor">查询</el-button>
        </el-form-item>
      </el-form>


     <el-table border  v-loading="loading3"  ref="multipleTable" :data="CollegeData" header-row-class-name="table-header-row" size="mini"  >
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column prop="name" label="专业名称"></el-table-column>
      <el-table-column prop="classCount" label="班级总数">
      	<template slot-scope="scope">
       		<span>{{scope.row.classCount}}个</span>
       	</template>
      </el-table-column>
      <el-table-column prop="studentCount" label="学生总数">
      	<template slot-scope="scope">
       		<span>{{scope.row.studentCount}}人</span>
       	</template>
      </el-table-column>

      <el-table-column prop="activityUserCount" label="活动参与人次">
      	<template slot-scope="scope">
       		<span>{{scope.row.activityUserCount}}人</span>
       	</template>
      </el-table-column>
      <el-table-column prop="averageOrganizationCount" label="加入组织人次">
      	<template slot-scope="scope">
       		<span>{{scope.row.orgUserCount}}次</span>
       	</template>
      </el-table-column>
      <el-table-column prop="projectApplyCount" label="自主申报数量">
      	<template slot-scope="scope">
       		<span>{{scope.row.projectApplyCount}}个</span>
       	</template>
      </el-table-column>
      <el-table-column prop="rewardCount" label="奖惩项人数">
      	<template slot-scope="scope">
       		<span>{{scope.row.rewardCount}}人</span>
       	</template>
      </el-table-column>
      <el-table-column prop="averageHoursCount" :label=" '学生平均' + hoursUnit">
        <template slot-scope="scope">
          <span>{{scope.row.averageHoursCount.toFixed(2)}}</span>
        </template>
      </el-table-column>
     </el-table>

     <qu-pagination :total="ParamsMajor.total" @change="MajorchangePage"></qu-pagination>

    </el-tab-pane>
    <el-tab-pane label="班级统计" name="4">


      <el-form style="padding-top:10px;" size="mini" :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="ParamsClass.name" placeholder="请输入班级名称搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchClass">查询</el-button>
        </el-form-item>
      </el-form>


     <el-table border  v-loading="loading4" ref="multipleTable" :data="ClassData" header-row-class-name="table-header-row" size="mini"  >
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column prop="name" label="班级名称"></el-table-column>
      <el-table-column prop="gradeName" label="年级"></el-table-column>
      <el-table-column prop="studentCount" label="学生总数">
      	<template slot-scope="scope">
       		<span>{{scope.row.studentCount}}人</span>
       	</template>
      </el-table-column>


      <el-table-column prop="activityUserCount" label="活动参与人次">
      	<template slot-scope="scope">
       		<span>{{scope.row.activityUserCount}}次</span>
       	</template>
      </el-table-column>
      <el-table-column prop="averageOrganizationCount" label="加入组织人次">
      	<template slot-scope="scope">
       		<span>{{scope.row.orgUserCount}}次</span>
       	</template>
      </el-table-column>
      <el-table-column prop="projectApplyCount" label="自主申报数量">
      	<template slot-scope="scope">
       		<span>{{scope.row.projectApplyCount}}个</span>
       	</template>
      </el-table-column>
      <el-table-column prop="rewardCount" label="奖惩项人数">
      <template slot-scope="scope">
       		<span>{{scope.row.rewardCount}}人</span>
       	</template>
      </el-table-column>
      <el-table-column prop="averageHoursCount" :label=" '学生平均' + hoursUnit">
        <template slot-scope="scope">
          <span>{{scope.row.averageHoursCount.toFixed(2)}}</span>
        </template>

      </el-table-column>
     </el-table>

     <qu-pagination :total="ParamsClass.total" @change="ClasschangePage"></qu-pagination>

    </el-tab-pane>
    <el-tab-pane label="学生统计" name="5">


      <div class="search-box">
        <el-form size="mini" :inline="true" class="demo-form-inline">
          <el-form-item label="所属学校" prop="campusId">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="params.campusId" @change="changeSchool" placeholder="请选择学校">
                <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="院系">
            <el-select clearable v-model="params.collegeId" @change="changeCollege" placeholder="请选择院系">
              <el-option v-for="item in colleages" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业">
            <el-select clearable v-model="params.majorId" placeholder="请选择专业" @change="changeMajor">
              <el-option v-for="item in majores" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级">
            <el-select clearable v-model="params.classId" placeholder="请选择班级" @change="changeClasses">
              <el-option v-for="item in classes2" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级">
            <el-select clearable v-model="params.grade" placeholder="请选择年级" @change="changenjes">
              <el-option v-for="item in gradees" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="params.name" maxlength=30 placeholder="请输入姓名搜索" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="searchStudent()">查询</el-button>
          </el-form-item>



        </el-form>
      </div>

     <el-table  border v-loading="loading5" ref="multipleTable" :data="StudentData" header-row-class-name="table-header-row" size="mini"  >
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="code" label="学号"></el-table-column>
      <el-table-column prop="collegeName" label="院系名称"></el-table-column>
      <el-table-column prop="majorName" label="专业名称"></el-table-column>
      <el-table-column prop="className" label="班级名称"></el-table-column>
      <el-table-column prop="grade" label="年级">
        <template slot-scope="scope">
           <span>{{scope.row.gradeName}}</span>
         </template>
      </el-table-column>
      <el-table-column prop="organizationCount" label="加入组织">
      	<template slot-scope="scope">
       		<span>{{scope.row.organizationCount}}个</span>
       	</template>
      </el-table-column>
      <el-table-column prop="activityCount" label="团学活动数量">
      	<template slot-scope="scope">
       		<span>{{scope.row.activityCount}}个</span>
       	</template>
      </el-table-column>
      <el-table-column prop="projectApplyCount" label="自主申报数量">
      	<template slot-scope="scope">
       		<span>{{scope.row.projectApplyCount}}个</span>
       	</template>
      </el-table-column>
      <el-table-column prop="rewardCount" label="奖惩次数">
      	<template slot-scope="scope">
       		<span>{{scope.row.rewardCount}}次</span>
       	</template>
      </el-table-column>

      <el-table-column prop="sumScore" :label=" '获得' + hoursUnit">
        <template slot-scope="scope">
          <span>{{scope.row.sumScore.toFixed(2)}}</span>
        </template>
      </el-table-column>
     </el-table>

     <qu-pagination :total="params.total" @change="StudentchangePage"></qu-pagination>

    </el-tab-pane>


    <!--<el-tab-pane label="转专业统计" name="6">-->


      <!--<el-form style="padding-top:10px;" size="mini" :inline="true" class="demo-form-inline">-->
        <!--<el-form-item>-->
          <!--<el-input v-model="transferMajorName" placeholder="请输入专业名称搜索"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-button size="mini" type="primary" @click="searchTransferMajor">查询</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->

     <!--<el-table border  v-loading="loading6" ref="multipleTable" :data="TransferMajorData" header-row-class-name="table-header-row" size="mini"  >-->
      <!--<el-table-column type="index" width="55"></el-table-column>-->
      <!--<el-table-column prop="name" label="专业名称"></el-table-column>-->
      <!--<el-table-column prop="changeIntoCount" label="转入人数">-->
      	<!--<template slot-scope="scope">-->
       		<!--<span>{{scope.row.changeIntoCount}}人</span>-->
       	<!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="changeOutCount" label="转出人数">-->
      	<!--<template slot-scope="scope">-->
       		<!--<span>{{scope.row.changeOutCount}}人</span>-->
       	<!--</template>-->
      <!--</el-table-column>-->
     <!--</el-table>-->

    <!--</el-tab-pane>-->

    <el-tab-pane label="职工统计" name="7">


      <el-form style="padding-top:10px;" size="mini" :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="ParamsTeacher.name" maxlength=30  placeholder="请输入名称搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchTeacher">查询</el-button>
        </el-form-item>
      </el-form>

     <el-table border  v-loading="loading7" ref="multipleTable" :data="TeacherData" header-row-class-name="table-header-row" size="mini"  >
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="code" label="工号"></el-table-column>
      <el-table-column prop="organizationName" label="行政机构"></el-table-column>
     </el-table>

     <qu-pagination :total="ParamsTeacher.total" @change="TeacherchangePage"></qu-pagination>


    </el-tab-pane>

</el-tabs>

   </div>
</template>
<script>
export default {
    name: 'department',
    data() {
      return {
        hoursUnit:localStorage.getItem("hoursUnit"),
        schools: [],
        classes2: [],
        colleges: [],
        colleages: [],
        majors: [],
        majores: [],
        classes: [],
        gradees: [],
      	loading:true,
      	loading2:true,
      	loading3:true,
      	loading4:true,
      	loading5:true,
      	loading6:true,
      	loading7:true,
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
        params: {
          current: 1,
          size: 10,
          campusId: '',
          collegeId: '',
          majorId: '',
          classId: '',
          grade: '',
          name: '',
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
      this.$http.get('/statistics/school/summary').then(res => {
        this.Statistics   = res.data
      })
        this.$http.get('/school/all/campus').then(res => {
          this.schools = res.data
        })
      this.$http.get('/school/grade/partake/list').then(res => {
        this.gradees = res.data
      })
      this.init()
    },
    methods:{
      handleClick(tab){

        if (tab == 1) {
             this.init()
        }else if (tab == 2) {
            this.getColleage()
        }else if (tab == 3) {
            this.getMajor()
        }else if (tab == 4) {
            this.getClass()
        }else if (tab == 5) {
            this.getStudent()
        }
        // else if (tab == 6) {
        //     this.getTransferMajor()
        // }
        else if (tab == 7) {
            this.getTeacher()
        }

      },
      searchCampus(){
        this.init()
      },
      init(){
        this.$http.get('/statistics/school/campus/list',{
          params:{
            name:this.campusName
          }
        }).then(res => {
        	this.loading = false
           this.CampusData   = res.data
        })
      },
      getColleage(){
        this.$http.get('/statistics/college/list/noPage',{
          params:{
            name:this.collegeName
          }
        }).then(res => {
            this.loading2 = false
            this.CollegeData   = res.data
        })
      },
      searchCollege(){
        this.getColleage()
      },
      //专业
      getMajor(){
        this.$http.get('/statistics/major/list',{
          params:this.ParamsMajor
        }).then(res => {
          this.loading3 = false
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
      //班级
      getClass(){
        this.$http.get('/statistics/class/list',{
          params:this.ParamsClass
        }).then(res => {
          this.loading4 = false
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
      //学生
      getStudent(){
        this.$http.get('/statistics/student/list',{
          params:this.params
        }).then(res => {
          this.loading5 = false
            this.StudentData   = res.data.list
            this.params.total = res.data.total
        })
      },
      searchStudent(){
        this.params.current = 1
        this.getStudent()
      },
      StudentchangePage(current, size){
        this.params.current = current
        this.params.size = size
        this.getStudent()
      },
      //转专业
      getTransferMajor(){
        this.$http.get('/statistics/transfer-major/list',{
          params:{name:this.transferMajorName}
        }).then(res => {
            this.loading6 = false
            this.TransferMajorData   = res.data
        })
      },
      searchTransferMajor(){
        this.getTransferMajor()
      },
      //职工
      getTeacher(){
        this.$http.get('/statistics/teacher/list',{
          params:this.ParamsTeacher
        }).then(res => {
           this.loading7 = false
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
      changeSchool(value) {

        this.params.collegeId = ""
        this.params.majorId = ""
        this.params.classId = ""
        if (!value) {
          this.colleages = [];
          this.majores = [];
          this.classes2 = [];
          // this.gradees = [];
        } else {
          this.$http.get('/school/college/list', {params: {campusId: value}}).then(res => {
            if (res.data.length>0){
              this.colleages = res.data
            } else {
              this.ruleForm.college =''
              this.$message({
                type: 'error',
                message: '该校区下无此院系，前选择其他校区'
              });
            }

          })
        }
      },

      changeCollege(value) {

        this.params.majorId = ""
        this.params.classId = ""
        if (!value) {
          this.majores = [];
          this.classes2 = [];
          // this.gradees = [];
        } else {
          this.$http.get('/school/major/list', {params: {collegeId: value}}).then(res => {
            if (res.data.length>0){
              this.majores = res.data
            } else {
              this.ruleForm.major=''
              this.$message({
                type: 'error',
                message: '该院系下无此专业，前选择其他院系'
              });
            }

            // console.log(this.majores)
          })
        }
      },
      changeMajor(value) {

        this.params.classId = ""
        if (!value) {
          this.classes2 = [];
        } else {
          this.$http.get('/school/class/partake/list', {params: {majorId: value}}).then(res => {
            this.classes2 = res.data

          })
        }
      },
      changeClasses(value) {

        this.params.classId = value
      },
      changenjes(value) {

        this.params.grade = value
      },
    },

    mounted () {

    }
};
</script>

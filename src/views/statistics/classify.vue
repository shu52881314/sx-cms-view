
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
           <span class="page-title">分类统计</span>
           <!-- <span class="page-title">素养统计</span> -->
           <span class="page-tool statistics-titler">
             所有数据均由系统导入以及管理员创建综合统计结果
           </span>
       </div>

       <div class="statisticsMain">

           <div class="statisticsMain-bottom">
             <el-row :gutter="10">
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">一级分类</div>
                    <div><b>{{Statistics.firstClassifyCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">二级分类</div>
                    <div><b>{{Statistics.secondClassifyCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">三级分类</div>
                    <div><b>{{Statistics.thirdClassifyCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="3">
                 <div class="statistics">
                    <div class="statistics-title">四级分类</div>
                    <div><b>{{Statistics.fourthClassifyCount}}</b></div>
                 </div>
               </el-col>
               <!-- <el-col :md="6">
                 <div class="statistics">
                    <div class="statistics-title">未达到在校最低{{hoursUnit}}人数</div>
                    <div><b>{{zxzd}}</b></div>
                 </div>
               </el-col>
               <el-col :md="6">
                 <div class="statistics">
                    <div class="statistics-title">未达到本学期最低{{hoursUnit}}人数</div>
                    <div><b>{{zxxqzd}}</b></div>
                 </div>
               </el-col> -->
             </el-row>
           </div>
       </div>


     <div class="search-box">
       <el-form size="mini" :inline="true" class="demo-form-inline">
         <el-form-item label="校区" prop="campusId">
           <el-col :span="22">
             <el-select clearable style="width:100%" v-model="params.campusId" @change="changeSchool" placeholder="请选择学校">
               <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
             </el-select>
           </el-col>
         </el-form-item>
         <el-form-item label="院系">
           <el-select clearable v-model="params.collegeId"  placeholder="请选择院系">
             <el-option v-for="item in colleages" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
           </el-select>
         </el-form-item>

         <el-form-item>
           <el-button size="mini" type="primary" @click="searchCampus">查询</el-button>
         </el-form-item>



       </el-form>
     </div>

      <el-table border  ref="multipleTable" :data="CampusData" header-row-class-name="table-header-row" size="mini" style="margin-top: 30px" >
       <el-table-column type="index" width="55"></el-table-column>
       <el-table-column prop="classifyName" label="一级分类"></el-table-column>
        <el-table-column prop="studentCreditSum" :label="'学生所获'+hoursUnit"></el-table-column>
        <el-table-column prop="sort" :label="'全校'+hoursUnit+'排名'"></el-table-column>
        <el-table-column prop="activityCount" label="活动总数">
       	<template slot-scope="scope">
       		<span>{{scope.row.activityCount}}个</span>
       	</template>
       </el-table-column>
        <el-table-column prop="activityUserCount" label="参与人次"></el-table-column>
        <el-table-column prop="activityUserPercent" label="参与率"></el-table-column>
       <el-table-column prop="projectApplyCount" label="自主申报总数">
       	<template slot-scope="scope">
       		<span>{{scope.row.projectApplyCount}}个</span>
       	</template>
       </el-table-column>
       <el-table-column prop="rewardsCount" label="奖惩项总数">
       	<template slot-scope="scope">
       		<span>{{scope.row.awardCount}}个</span>
       	</template>
       </el-table-column>
       <el-table-column prop="unreachedSchoolCount" :label="'未达到在校最低'+hoursUnit+'人数'">
       	<template slot-scope="scope">
       		<span>{{scope.row.schoolLowCount}}</span>
       	</template>
       </el-table-column>
       <el-table-column prop="unreachedTermCount" :label="'未达到学期最低'+hoursUnit+'人数'">
       	<template slot-scope="scope">
       		<span>{{scope.row.semesterLowCount}}</span>
       	</template>
       </el-table-column>
      </el-table>

      <!--<qu-pagination :total="params.total" @change="changePage"></qu-pagination>-->




   </div>
</template>
<script>
export default {
    name: 'department',
    data() {
      return {
        zxzd:'',
        zxxqzd:'',
        schools: [],
        colleages: [],
        hoursUnit:localStorage.getItem("hoursUnit"),
        campusName:"",
        collegeName:"",
        transferMajorName:"",
        TeacherName:"",
        params:{
          campusId:'',
          collegeId:''
        },
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
      this.$http.get('/school/all/campus').then(res => {
        this.schools = res.data
      })
      this.$http.get('/statistics/classify/summary',{params:{name:''}}).then(res => {
        this.Statistics   = res.data
      })
      this.init()
    },
    methods:{
      changeSchool(value) {

        this.params.collegeId = ""

        if (!value) {
          this.colleages = [];
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


      // changePage(current, size){
  		// 	this.params.current = current
  		// 	this.params.size = size
  		// 	this.init()
  		// },
      searchCampus(){
        // this.params.current = 1
        this.init()
      },
      init(){
        this.$http.get('/statistics/classify/list',{
          params:this.params
        }).then(res => {
           this.CampusData   = res.data.list
           // this.zxzd = res.data.schoolLowCount
           // this.zxxqzd = res.data. semesterLowCount

        })
      },
      getColleage(){
        this.$http.get('/statistics/college/list/noPage',{
          params:{
            name:this.collegeName
          }
        }).then(res => {
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
          params:this.ParamsStudent
        }).then(res => {
            this.StudentData   = res.data.list
            this.ParamsStudent.total = res.data.total
        })
      },
      searchStudent(){
        // this.ParamsStudent.current = 1
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
        this.$http.get('/statistics/teaching_staff/list',{
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

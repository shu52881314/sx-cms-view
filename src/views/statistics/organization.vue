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
           <span class="page-title">组织统计</span>
           <span class="page-tool statistics-titler">
             本页面数据统计均为实时数据
           </span>
       </div>

       <div class="statisticsMain">

           <div class="statisticsMain-bottom">
             <el-row :gutter="10">
               <el-col :md="4">
                 <div class="statistics">
                    <div class="statistics-title">团组织</div>
                    <div><b>{{Statistics.groupCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="4">
                 <div class="statistics">
                    <div class="statistics-title">行政机构</div>
                    <div><b>{{Statistics.institutionCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="4">
                 <div class="statistics">
                    <div class="statistics-title">社团与协会</div>
                    <div><b>{{Statistics.clubCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="4">
                 <div class="statistics">
                    <div class="statistics-title">学生会</div>
                    <div><b>{{Statistics.studentUnionCount}}</b></div>
                 </div>
               </el-col>
               <el-col :md="4">
                 <div class="statistics">
                    <div class="statistics-title">志愿者组织</div>
                    <div><b>{{Statistics.volunteerCount}}</b></div>
                 </div>
               </el-col>
            </el-row>
           </div>
       </div>


  <el-tabs v-model="activeName"  @tab-click="handleClick(activeName)" style="width:98%;padding-top:20px;margin:0 auto">
    <el-tab-pane label="团组织" name="4"></el-tab-pane>
    <el-tab-pane label="行政机构" name="1"></el-tab-pane>
    <el-tab-pane label="社团与协会" name="2"></el-tab-pane>
    <el-tab-pane label="学生会" name="3"></el-tab-pane>
    <el-tab-pane label="志愿者组织" name="5"></el-tab-pane>
  </el-tabs>

  <el-form style="padding-top:10px;" size="mini" :inline="true" class="demo-form-inline">
    <el-form-item>
      <el-input v-model="ParamsTeacher.name" maxlength=30  placeholder="请输入名称搜索"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button size="mini" type="primary" @click="searchTeacher">查询</el-button>
    </el-form-item>
  </el-form>

 <el-table border   ref="multipleTable" :data="TeacherData" header-row-class-name="table-header-row" size="mini"  >
  <el-table-column type="index" width="55"></el-table-column>
  <el-table-column prop="name" label="名称"></el-table-column>
  <el-table-column prop="parentName" label="上级组织名称"></el-table-column>
  <el-table-column prop="memberCount" label="人数">
  	<template slot-scope="scope">
       		<span>{{scope.row.memberCount}}人</span>
       	</template>
  </el-table-column>
  <el-table-column prop="chairManName" label="负责人"></el-table-column>
  <el-table-column prop="activityCount" label="活动数量">
  	<template slot-scope="scope">
       		<span>{{scope.row.activityCount}}个</span>
       	</template>
  </el-table-column>
 </el-table>

 <qu-pagination :total="ParamsTeacher.total" @change="TeacherchangePage"></qu-pagination>


   </div>
</template>
<script>
export default {
    name: 'department',
    data() {
      return {
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
          nature:7,
          total:0,
        },
        activeName:"7",
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
      this.$http.get('/statistics/organization/summary').then(res => {
        this.Statistics   = res.data
      })
      this.getTeacher()
    },
    methods:{
      handleClick(tab){
           this.ParamsTeacher.nature = tab
           this.getTeacher();
      },
      //职工
      getTeacher(){
        this.$http.get('/statistics/organization/list',{
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

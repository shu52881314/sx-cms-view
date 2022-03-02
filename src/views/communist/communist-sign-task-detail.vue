<template>
  <div  class="rightBg">
    <el-dialog title="导出打卡记录"
               :visible.sync='dialogImportSign'
               :close-on-click-modal="false"
               width='650px' id="dialogOrange">
      <div class="showtitle-mainc" style="text-align:left;margin-left:0">
        <div style="font-size:18px;font-weight:bold;">{{ detail.signName }} </div>
        <div>起止日期：{{ detail.startDate | formatD }} 至 {{ detail.endDate | formatD }}</div>
      </div>
      <el-form el-form size="medium"  ref="signForm"class="demo-ruleForm">
        <el-form-item label="请选择导出打卡的日期"  style="margin-bottom: 0px !important;">
            <el-col :span="8">
              <el-date-picker
                style="width:100%;"
                v-model="startTime"
                @change="changeStartDate"
                type="date"
                :picker-options="startDatePicker"
                placeholder="请选择开始日期">
              </el-date-picker>
            </el-col>
          <el-col :span="1">&nbsp;</el-col>
            <el-col :span="8">
              <el-date-picker
                style="width:100%;"
                v-model="endTime"
                @change="changeEndDate"
                type="date"
                value-format="yyyy-MM-dd"
                default-time="23:59:59"
                placeholder="请选择结束日期" :picker-options="endDatePicker">
              </el-date-picker>
            </el-col>
          </el-form-item>
        <el-form-item>
          <el-col :span="20" style="color: red">所选日期必须在打卡日期内，每次最多导出7天打卡记录</el-col>
        </el-form-item>
        <el-form-item style="text-align: center; margin-top: 20px;">
          <el-button :disabled="$store.state.sys.isClick" type="primary" @click="submitImport">确定</el-button>
          <el-button @click="dialogImportSign = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- <div class="page-bar">
       <el-button type="text" size="mini" style="font-size:14px;" icon="el-icon-arrow-left" @click="back">返回</el-button>
    </div> -->
		<back></back>
    <div class="showtitle-main" style="clear: both; overflow: hidden">
<div style="float: left">
      <div class="showtitle-mainc" style="text-align:left;margin-left:0">
         <div style="font-size:18px;font-weight:bold;">{{ detail.signName }} </div>
         <div>起止日期：{{ detail.startDate | formatD }} 至 {{ detail.endDate | formatD }}</div>
      </div>
      <div class="showtitle-mainr " style="width:500px;">
         <div  style="font-size:18px;font-weight:bold;">地点：{{ detail.address}}</div>
      </div>
</div>
      <div class="main-btn-box" style="float: right; margin-top: 60px;" >
        <el-button type="primary" size="mini" @click="importStudentSign" :disabled="$store.state.sys.isClick">导出打卡记录</el-button>
      </div>
    </div>
    <div style="width:98%;margin:0 auto">
        <el-tabs  v-model="tabIndex" @tab-click="handleClick(tabIndex)">
          <el-tab-pane label="院系统计" name="first">
              <el-row :gutter="20">
                  <el-col :span="24">

                    <div class="collegeClass">
                      <span style="float:left;margin-right:10px;">时间：</span>
                      <el-checkbox-group @change="changeTime" style="float:left;" v-model="optionIds">
                         <el-checkbox v-for="item in optionList" :label="item.optionId" :key="item.optionId">
                           {{item.startTime}} - {{item.endTime}}
                         </el-checkbox>
                       </el-checkbox-group>
                    </div>

                    <div class="search-box" style="width:100%;margin-top:0">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item>
                              <el-date-picker @change="changeDate" clearable size="mini" class="selectWidth" :editable="false" type="daterange" v-model="dateArray" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                              </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                              <el-select clearable  size="mini" v-model="params.collegeId" placeholder="院系">
                                  <el-option v-for="item in colleges" :key="item.collegeId" :label="item.collegeName" :value="item.collegeId">
                                  </el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input clearable v-model="params.collegeName" size="mini" placeholder="请输入院系名称"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button size="mini" type="primary" @click="search()"><i class="el-icon-search"></i> 搜索</el-button>
                            </el-form-item>
                        </el-form>
                    </div>

                    <table class="ClassTable"  cellpadding="0" cellsapcing="0">
                       <tr>
                         <td style="text-indent:20px;" class="ClassTableTh"  align="left" valign="middle">
                          院系名称
                         </td>
                         <td class="ClassTableTh" v-for="item in wekdays" align="left" valign="middle">
                          {{ item.date }} ({{ item.week }})
                         </td>
                       </tr>
                       <tr v-for="item in dataList" >
                         <td style="text-indent:20px;" align="left" valign="middle">
                          {{ item.collegeName }}
                         </td>
                         <td v-for="item2 in item.signList" align="left" valign="middle">
                          {{ item2.signUserCount }} 人打卡
                         </td>
                       </tr>
                    </table>

                    <qu-pagination :total="params.total" @change="changePage"></qu-pagination>


                    <!-- <div class="block text-center mt20" v-if="params.total!=0">
                      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.currentPage" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total">
                      </el-pagination>
                    </div> -->

                  </el-col>

              </el-row>
          </el-tab-pane>
          <el-tab-pane label="班级统计" name="second">

            <div class="collegeClass">
              <span style="float:left;margin-right:10px;">时间：</span>
              <el-checkbox-group @change="changeTime" style="float:left;" v-model="optionIds">
                 <el-checkbox v-for="item in optionList" :label="item.optionId" :key="item.optionId">
                   {{item.startTime}} - {{item.endTime}}
                 </el-checkbox>
               </el-checkbox-group>
            </div>

            <div class="search-box" style="width:100%;margin-top:0">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item>
                      <el-date-picker @change="changeDate" clearable size="mini" class="selectWidth" :editable="false" type="daterange" v-model="dateArray" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-select clearable  size="mini" v-model="params.collegeId" placeholder="院系">
                        <el-option v-for="item in colleges" :key="item.collegeId" :label="item.collegeName" :value="item.collegeId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select clearable  size="mini" v-model="params.gradeId" placeholder="班级">
                        <el-option v-for="item in Classes" :key="item.classId" :label="item.className" :value="item.classId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input clearable v-model="params.collegeName" size="mini" placeholder="请输入院系名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" type="primary" @click="search()"><i class="el-icon-search"></i> 搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>


            <table class="ClassTable"  cellpadding="0" cellsapcing="0">
               <tr>
                 <td style="text-indent:20px;" class="ClassTableTh"  align="left" valign="middle">
                  院系名称
                 </td>
                 <td  class="ClassTableTh"  align="left" valign="middle">
                  班级名称
                 </td>
                 <td  class="ClassTableTh"  align="left" valign="middle">
                  年级
                 </td>
                 <td class="ClassTableTh" v-for="item in wekdays" align="left" valign="middle">
                  {{ item.date }} ({{ item.week }})
                 </td>
               </tr>
               <tr v-for="item in dataList" >
                 <td style="text-indent:20px;" align="left" valign="middle">
                  {{ item.collegeName }}
                 </td>
                 <td  align="left" valign="middle">
                  {{ item.className }}
                 </td>
                 <td  align="left" valign="middle">
                  {{ item.gradeName }}
                 </td>
                 <td v-for="item2 in item.signList" align="left" valign="middle">
                  {{ item2.signUserCount }} 人打卡
                 </td>
               </tr>
            </table>

            <qu-pagination :total="params.total" @change="changePage"></qu-pagination>

            <!-- <div class="block text-center mt20" v-if="params.total!=0">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.currentPage" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total">
              </el-pagination>
            </div> -->

          </el-tab-pane>
          <el-tab-pane label="学生统计" name="third">

            <div class="collegeClass">
              <span style="float:left;margin-right:10px;">时间：</span>
              <el-checkbox-group @change="changeStudentTime" style="float:left;" v-model="optionIds">
                 <el-checkbox v-for="item in optionList" :label="item.optionId" :key="item.optionId">
                   {{item.startTime}} - {{item.endTime}}
                 </el-checkbox>
               </el-checkbox-group>
            </div>

            <div class="search-box" style="width:100%;margin-top:0">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item>
                      <el-date-picker @change="changeDate2" clearable size="mini" class="selectWidth" :editable="false" type="daterange" v-model="dateArray2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-select clearable  size="mini" v-model="paramsStudent.collegeId" placeholder="院系">
                        <el-option v-for="item in colleges" :key="item.collegeId" :label="item.collegeName" :value="item.collegeId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <!-- <el-form-item>
                      <el-select clearable  size="mini" v-model="paramsStudent.gradeId" placeholder="年级">
                        <el-option v-for="item in Classes" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item>
                      <el-select clearable  size="mini" v-model="paramsStudent.isSign" placeholder="是否打卡">
                        <el-option v-for="item in isSignes" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-input clearable v-model="paramsStudent.userName" size="mini" placeholder="请输入学生姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" type="primary" @click="searchStudnet()"><i class="el-icon-search"></i> 搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <table class="ClassTable"  cellpadding="0" cellsapcing="0">
               <tr>
                 <td style="text-indent:20px;" class="ClassTableTh"  align="left" valign="middle">
                  姓名
                 </td>
                 <td  class="ClassTableTh"  align="left" valign="middle">
                  院系名称
                 </td>
                 <td  class="ClassTableTh"  align="left" valign="middle">
                  班级名称
                 </td>
                 <td  class="ClassTableTh"  align="left" valign="middle">
                  年级
                 </td>
                 <td class="ClassTableTh" v-for="item in wekdays2" align="left" valign="middle">
                  {{ item.date }} ({{ item.week }})
                 </td>
               </tr>
               <tr v-for="item in studentData" >
                 <td style="text-indent:20px;" align="left" valign="middle">
                  {{ item.userName }}
                 </td>
                 <td  align="left" valign="middle">
                  {{ item.collegeName }}
                 </td>
                 <td  align="left" valign="middle">
                  {{ item.className }}
                 </td>
                 <td  align="left" valign="middle">
                  {{ item.grade }}
                 </td>
                 <td v-for="item2 in item.userSign" align="left" valign="middle">
                   <div  style="display:inline-block;background:#E6F5FF;line-height:20px;padding:10px;">
                     <span v-for="item3 in item2.signTimeList">
                          <div style="height:25px;line-height:25px;">


                            <span v-if="item3.status == 4 "> 缺卡</span>
                            <span v-if="item3.status == 3 "> {{   item3.ctime  }} </span>

                          </div>
                     </span>
                   </div>
                 </td>
               </tr>
            </table>

            <qu-pagination :total="paramsStudent.total" @change="changePage2"></qu-pagination>

            <!-- <div class="block text-center mt20" v-if="paramsStudent.total!=0">
              <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="paramsStudent.currentPage" :page-size="paramsStudent.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paramsStudent.total">
              </el-pagination>
            </div> -->

          </el-tab-pane>

        </el-tabs>
    </div>
  </div>
</template>

<script>
import listMixins from '@/mixins/form'
import axios from 'axios'
 import {uniqueSame2,timestampToTime} from "@/utils/filters"
 export default{
	 mixins:[listMixins],
   data(){
     return {
         colleges:[],
         isSignes:[
           {
               id: 0,
               name: '不限'
           },
           {
               id: 1,
               name: '已打卡'
           },
           {
               id: 2,
               name: '缺卡'
           }
         ],
         Classes:[],
         grades:[],
         optionList:[],
         paramsStudent:{
           current: 1,
           size: 10,
           total: 0,
           signId:"",
           startDate:'',
           endDate:'',
           collegeId:'',
           classId:'',
           gradeId:'',
           isSign:0,
           optionId: '',
           userName:'',
         },
         dateArray2:[],
         optionIds2: [],
         params: {
             signId:'',
             type:0,
             current: 1,
             size: 10,
						 total: 0,
             startDate: '',
             endDate: '',
             collegeId: '',
             optionId: '',
             classId: '',
             gradeId: '',
             collegeName: '',
             className: ''
         },

	       dateArray:[],
         optionIds: [],
        tabIndex:'first',
        list:{},
        wekdays:[],
        wekdays2:[],
        dataList:[],
        detail: {},
        collegeReportData:{
            headers: []
        },
        data: [],
        studentData:[],
       dialogImportSign:false,
       sign:{
         startTime:'',
         endTime:'',
       },
       startTime:'',
       endTime:'',
       importDisable:false,
       startDatePicker:this.beginDate(),
       endDatePicker:this.processDate(),
     }
   },
   computed: {


   },
   created(){

   },
   mounted(){
      this.detail.id = this.id;
			this.getId = this.id;
			this.params.signId = this.id
      // this.collegeReport();
      this.fetchData();
      this.getDepartment()
   },
   methods:{
     changeStartDate(value){
       let self = this
       if(value!=null) {
         var startDate = value.getTime();
       }
       if(self.sign.endTime){
         var endDate=self.sign.endTime;
         if(endDate-startDate>3600*1000*24*7-1){
           this.$message({
             type: 'error',
             message: '只能选择一周之内的数据!'
           });
         }
       }else{
         self.sign.startTime=value
         self.startTime=value;
       }
     },
     changeEndDate(value){
       let self = this
       if(value!=null){
         var endDate = new Date(value+' 23:59:59').getTime();
       }
       if(self.sign.startTime){
         var startDate=self.sign.startTime;
         if(endDate-startDate>3600*1000*24*7-1){
           this.$message({
             type: 'error',
             message: '只能选择一周之内的数据!'
           });
         }
       }else{
         self.sign.endTime=value
         self.endTime=value;
       }
     },
     beginDate(){//提出开始时间必须小于今天
       let self = this
       return {
         disabledDate(time){
           var times = '';
           times= time.getTime() > Date.now() || time.getTime()<self.detail.startDate || time.getTime() > self.detail.endDate
           return times//开始时间不选时，结束时间最大值小于等于当天
         }
       }
     },
     processDate(){//提出结束时间必须大于提出开始时间
       let self = this
       return {
         disabledDate(time){
           var times = '';
           if(self.sign.startTime){
             times= new Date(self.sign.startTime).getTime() > time.getTime() || time.getTime() > self.detail.endDate || time.getTime() > Date.now()
           }else{
             times=time.getTime() > Date.now() || time.getTime()> self.detail.endDate
             //开始时间不选时，结束时间最大值小于等于当天
           }
           return times
         }
       }
     },
	   //导出学生打卡
     importStudentSign(){
       this.dialogImportSign=true
     },
     submitImport(){
       var that=this;
       that.importDisable=false;
       if(that.startTime!=null&&that.startTime!=''){
         that.sign.startTime=that.startTime.getTime();
       }else{
         this.$message({
           type: 'error',
           message: '开始时间不能为空!'
         });
         return;
       }
       if(that.endTime!=null&&that.endTime!=''){
         that.sign.endTime=new Date(that.endTime+' 23:59:59').getTime()
       }else{
         this.$message({
           type: 'error',
           message: '结束时间不能为空!'
         });
         return;
       }
       if(that.sign.endTime-that.sign.startTime>3600*1000*24*7-1){
         this.$message({
           type: 'error',
           message: '只能选择一周之内的数据!'
         });
         return;
       }

       axios({
         method: 'get',
         url: 'sign/user/sign-task/list/judge',
         params: {
           startTime:that.sign.startTime,
           endTime:that.sign.endTime,
           signId:that.id
         }
       }).then((res) => {
           if(res.msg=='ok'){
               axios({
                 method: 'get',
                 url: 'sign/user/sign-task/list',
                 responseType: 'blob',
                 params: {
                   startTime:that.sign.startTime,
                   endTime:that.sign.endTime,
                   signId:that.id
                 }
               }).then((resData) => {
                 let url = window.URL.createObjectURL(resData)
                 let link = document.createElement('a')
                 link.style.display = 'none'
                 link.href = url
                 link.setAttribute('download', '打卡记录' + '.xlsx')
                 document.body.appendChild(link)
                 link.click()
                 that.importDisable = true;
                 that.dialogImportSign=false;
               })
             }else{
               this.$message({
                 type: 'error',
                 message: res.msg
               });
             }
       })
     },
     changeStudentTime(value){
       this.paramsStudent.optionId = this.optionIds.join(",")
     },
     changeTime(value){
       this.params.optionId = this.optionIds.join(",");
       if(value == 1){
         this.params.type = 0;
         this.params.currentPage = 1
         this.params.pageSize = 10
         this.getDepartment()
         this.fetchData();
       }else{
         this.paramsStudent.current = 1
         this.paramsStudent.size = 10

         this.getStudent();
       }
     },
     search() {
         this.params.currentPage = 1;
         this.fetchData();
     },
     searchStudnet(){
       this.paramsStudent.current= 1;

       this.getStudent();
     },
     changeDate(){
       if (this.dateArray && this.dateArray.length) {
         this.params.startDate = this.dateArray[0].getTime();
         this.params.endDate = this.dateArray[1].getTime();
       }else{
         this.dateArray = []
         this.params.startDate = ""
         this.params.endDate = ""
       }
     },
     changeDate2(){
       if (this.dateArray2 && this.dateArray2.length) {
         this.paramsStudent.startDate = this.dateArray2[0].getTime();
         this.paramsStudent.endDate = this.dateArray2[1].getTime();
       }else{
         this.dateArray2 = []
         this.paramsStudent.startDate = ""
         this.paramsStudent.endDate = ""
       }
     },
    fetchData(){
      // if (this.params.dateArray && this.params.dateArray.length) {
      //   this.params.startDate = this.params.dateArray[0].getTime();
      //   this.params.endDate = this.params.dateArray[1].getTime();
			// }
        this.$http.get('/sign/day-list', {
            params: this.params
        }).then(res =>{
           this.detail = res.data
           this.wekdays = res.data.dateAndWeek
           this.optionList = res.data.optionList
           this.dataList = res.data.object.list
           this.params.currentPage = res.data.object.pageNum
           this.params.total = res.data.object.total
        })
    },
    handleClick(tab){
       this.optionIds = ''
      if ( tab == "first" ) {
         this.params.type = 0;
         this.params.currentPage = 1
         this.params.pageSize = 10
         this.getDepartment()
         this.fetchData();
         this.optionIds = []
      }else if ( tab == "second" ) {
         this.params.type = 1
         this.params.currentPage = 1
         this.params.pageSize = 10
         this.getDepartment()
         this.fetchData();
         this.optionIds = []
      }else if ( tab == "third" ) {
           this.paramsStudent.current = 1
           this.paramsStudent.size = 10
          this.optionIds = []
           this.getStudent();
      }

    },
    getDepartment(){
      this.$http.get('/sign/search/list', {
          params: {
            signId:this.id,
            type:1
          }
      }).then(res => {
         this.colleges = res.data.collegeList
         this.Classes = res.data.classList
      })
    },
    getStudent(){

      // if (this.paramsStudent.optionIds.length) {
      //    this.paramsStudent.optionId = this.paramsStudent.optionIds.join(",")
      // }

      if (this.dateArray2 && this.dateArray2.length) {
        this.paramsStudent.startDate = this.dateArray2[0].getTime();
        this.paramsStudent.endDate = this.dateArray2[1].getTime();
      }


    this.paramsStudent.signId = this.id
      this.$http.get('/sign/user/day-list', {
          params: this.paramsStudent
      }).then(res => {
         this.optionList = res.data.optionList
         this.wekdays2 = res.data.dateAndWeek
         this.studentData = res.data.object.list
         this.paramsStudent.total = res.data.object.total
      })
    },
    changePage(current, size){
			this.params.current = current
			this.params.size = size
			this.fetchData()
		},
    changePage2(current, size){
			this.paramsStudent.current = current
			this.paramsStudent.size = size
			this.getStudent()
		},
    handleSizeChange(pageSize) {
     this.params.pageSize = pageSize;
     this.fetchData();
    },
    handleCurrentChange(page) {
        this.params.currentPage = page;
        this.fetchData();
    },
    handleSizeChange2(pageSize) {
     this.paramsStudent.size = pageSize;
     this.getStudent();
    },
    handleCurrentChange2(page) {
        this.paramsStudent.current = page;
        this.getStudent();
    },
    back(){
        this.$router.go(-1);
    },
    handleCurrentChange(page) {
        this.params.currentPage = page;
        this.fetchData();
    },
    collegeReport(){
        this.$http.get("/api/v1/sign/college/report", {
            params: this.params
        }).then(res => {
           this.collegeReportData.headers = res.data.headers
        })
    }
   }
 }
</script>

<style scoped>
.collegeClass{width:100%;overflow:hidden;padding-bottom:15px;padding-top:10px;}
.ClassTable{width:100%;overflow:hidden;margin:0 auto}
.ClassTable .ClassTableTh{padding-top:15px;padding-bottom:15px;font-weight:bold;background:#F5F7FA;}
.ClassTable td{padding-top:15px;padding-bottom:15px;border-bottom:1px solid #EBEEF5;font-size:14px;}
.showtitle-main{
  width:100%;
  overflow:hidden;
  padding-top:15px;
  font-size:14px;
  padding-bottom:10px;
  border-bottom:12px solid #F2F3FB;
}
.detail {
    line-height: 30px;
}

.detail td {
    padding-bottom: 20px;
}
.showtitle-mainl{width:120px;margin-left:20px;}
.showtitle-mainl img{max-width:100%;}
.showtitle-mainc{margin-left:160px;line-height:35px;margin-right:220px;}
.detail{font-size:14px;color:#000}
.detailGray{color:#666}
.showtitle-mainr{width:200px;}
.showtitle-mainl-img{text-align:center;margin-left:20px;}
.showtitle-mainl-img img{width:120px;height:120px;border-radius:120px;}
</style>

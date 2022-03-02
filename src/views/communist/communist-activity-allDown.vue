<template>
  <section>

    <div style="position:relative;">
      <el-tabs v-model="params.statusAcitive" @tab-click="handleClick(params.statusAcitive)">
        <el-tab-pane label="全部" name="1"></el-tab-pane>
        <el-tab-pane label="审核中" name="2"></el-tab-pane>
        <el-tab-pane label="被驳回" name="3"></el-tab-pane>
        <el-tab-pane label="报名中" name="4"></el-tab-pane>
        <el-tab-pane label="待开始" name="5"></el-tab-pane>
        <el-tab-pane label="进行中" name="6"></el-tab-pane>
        <el-tab-pane label="待完结" name="7"></el-tab-pane>
        <el-tab-pane label="完结审核中" name="8"></el-tab-pane>
        <el-tab-pane label="完结被驳回" name="9"></el-tab-pane>
        <el-tab-pane label="已完结" name="0"></el-tab-pane>
      </el-tabs>
      <!--<el-button @click="goTemplate" style="position:absolute;right:0;top:2px;"  type="increase" size="mini">新增活动</el-button>-->
      <!--   <el-button @click="dialogVisible=true" style="position:absolute;right:90px;top:2px;"  type="primary" size="mini">添加历史活动</el-button>-->
    </div>

    <div class="search-box">
      <el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item label="活动分类：" >
          <el-cascader :props="defaultProps"  @change="systemClassifysListChange" placeholder="请选择活动分类" style="width:100%" class="selectWidth"
                       expand-trigger="click" clearable :options="options"
                       :change-on-select="true" :show-all-levels="true"></el-cascader>
        </el-form-item>
        <el-form-item label="活动日期">
          <el-form-item   >
            <el-col :span="22">
              <el-date-picker
                @change="changeStartDate"
                style="width:100%;margin-right: 0px;"
                v-model="dateArray.statTime2"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                placeholder="请选择开始日期">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <span style="color:#606266;font-size:14px;">至</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-form-item    >
            <el-col :span="22">
              <el-date-picker
                @change="changendDate"
                style="width:100%;"
                start-placeholder="2017 年 03 月 21 日"
                v-model="dateArray.endTime2"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                default-time="23:59:59"
                placeholder="请选择结束日期" >
              </el-date-picker>
            </el-col>
          </el-form-item>

        </el-form-item>
        <el-form-item label="活动ID/名称">
          <el-input v-model="params.actIdOrName" maxlength=30 placeholder="请输入活动ID/名称搜索" @input="gbhd"></el-input>
        </el-form-item>
        <el-form-item label="主办方">
          <el-select clearable filterable v-model="params.orgId"  placeholder="请选择主办方"  @change="changendDate">
            <el-option
              v-for="item in organizationes"
              :key="item.organizationId"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="承办/协办方" >
          <el-select  clearable filterable v-model="params.assistOrgId"  placeholder="请选承办/协办方"  @change="changendDate">
            <el-option
              v-for="item in xieban"
              :key="item.organizationId"
              :label="item.organizationName"
              :value="item.organizationId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button  @click="importFile" type="warning" size="mini" v-perms="'/communist/activity/delete'" :disabled="dchd">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-body">
      <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
        <el-table-column prop="actId" label="活动ID" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="活动名称" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orgName" label="主办方" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="adminName" label="管理员" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="className" label="活动分类"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="hours" :label="unit" width="100" align="left" ></el-table-column>
        <el-table-column prop="firstAuditorName" width="160" label="活动时间"  align="left">
          <div slot-scope="scope">
            <p>起： {{scope.row.startTime  | formatDate}}</p>
            <p>终： {{scope.row.endTime  | formatDate}}</p>
          </div>
        </el-table-column>
        <el-table-column prop="statusAll" label="状态"  width="100" align="left" :formatter="formatterStatus"></el-table-column>


        <el-table-column  label="操作" width="160" align="left">
          <div slot-scope="scope">
            <el-button type="text" class="opreat-btn" @click.native="showDetail(scope.row.actId)" v-perms="'/communist/activity/detail'">详情</el-button>
            <el-button type="text" class="opreat-btn" @click.native="routerLink('/activity/launch', 'update', scope.row.actId,'',params.current,params.statusAcitive)" v-perms="'/communist/activity/modify'" v-if="scope.row.editActivity==1">修改</el-button>
            <el-button type="text" class="opreat-btn" @click.native="deleteBatch(scope.row.actId,scope.row.statusAll,scope.row.name) " v-perms="'/communist/activity/delete'">删除</el-button>
            <el-button type="text" class="opreat-btn" @click.native="rollBackFinished(scope.row.actId)" v-if="scope.row.statusAll==9">撤分</el-button>
          </div>
        </el-table-column>
      </el-table>
      <qu-pagination :current2="params.current" :total="total" @change="changePage" ref="mychild"></qu-pagination>
    </div>
  </section>
</template>
<script>
  import { Message } from 'element-ui';
  import {cascade,cascade3} from '@/utils/filters'
  import axios from 'axios'
  export default {
    data() {
      return {
        dchd:false,
        isShow : true,

        oto:this.$route.query.oto,
        xieban:[],
        activeName:'first',
        unit:localStorage.getItem("hoursUnit"),
        organizationes:[],
        defaultProps: {
          children: 'children',
          value: 'id',
          label: 'name'
        },
        dateArray: {
          statTime2:'',
          endTime2:'',
        },
        loading: false,
        params: {
          listType:1,     //列表类型 ，1-9,0分别代表 不同状态的活动
          current: 1,
          size: 10,
          statTime: '',
          endTime: '',
          statusAcitive:"1",
          assistOrgId:"",
          orgId:'',
          actIdOrName: '',
          calssId:'',
          oto:this.$route.query.oto
        },
        classifies: [{id: '', name: '全部'}],
        data: [],
        total: 0,
        options: [{id: '', name: '不限'}],
        systemClassifysList:[],
        dialogVisible:false,
        activity: {
          calssIds2:'',
          activityLimitType:'',
          name: '',
          organizationId: '',
          managerId:'',
          hours:'',
          activityDate: '',
          introduce: ''
        },
        optionsClassify:[],
        options4: [],
        limitTypeOptions:[],
        selectPlaceholder:'',
        showLimit:false,
        rules: {
          actIdOrName: [{required: true, message: '请输入活动名称',trigger: 'blur' }],
          organizationId: [{required: true,message: '请输入活动主办方',trigger: 'blur' }],
          activityDate: [{required: true,message: '请选择活动日期',trigger: 'change'}],
          hours: [{ required: true,message: '请输入活动学时',trigger: 'blur'}],
          managerId: [{required: true,message: '请选择活动管理员',trigger: 'change' }],
          calssIds2: [{required: true, message: '请选择活动分类',trigger: 'change'}],
          organizationId: [{required: true,message: '请选择主办方', trigger: 'change'}]
        },
        selectClassify:[]
      }
    },
    methods:{
      showDetail(id){
        if(this.params.id){
          this.params.id=id
        }
        this.params.selectClassify = this.selectClassify.join(',')
        // this.$router.push({path:"/communist/activity/detail", query: {id:id,...this.params}})
        this.$router.push({path:"/communist/activity/detail", query: {id:id,oto:this.oto,flag:1}})
      },
      //提交表单
      submitForm(formName){
        var that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.activity.activityDate = this.activity.activityDate.getTime()
            that.activity.calssIds = that.activity.calssIds2.join(',');
            if (that.activity.activityLimitType == localStorage.getItem("compulsoryName") || that.activity.activityLimitType == 1) {
              that.activity.activityLimitType = 1
            } else if (that.activity.activityLimitType == localStorage.getItem("electiveName") || that.activity.activityLimitType == 2) {
              that.activity.activityLimitType = 2
            } else {
              that.activity.activityLimitType = 0
            }
            if (typeof that.activity.organizationLimit == 'object') {
              that.activity.organizationLimit = that.activity.organizationLimit.join(',');
            }
            var n = Number(this.activity.managerId);
            if (isNaN(n)) {
              this.activity.managerId = this.activity.adminId
            }
            that.$store.commit('setClick', true)
            that.$http.post('/activity/establish', that.activity).then(res => {
              if (res.code == '200') {
                that.$refs['activity'].resetFields();
                that.$message({
                  type: 'success',
                  message: '活动发布成功!'
                });
                that.dialogVisible=false;
              } else {
                that.$message({
                  type: "error",
                  message: res.msg
                })
              }
            })
          }
        })
      },
      handleChange(value){
        var categoryId=value[value.length-1];
        if(categoryId!=null){
          this.getLimitType(categoryId);
        }
      },
      getLimitType(id){
        this.$http.get('/qu-activity-classify/info',{params:{calssId:id}}).then(res => {
          if(res.data.length==0){
            this.showLimit=false
            this.activity.activityLimitType = '0'
          }
          if(res.data.length==1){
            this.showLimit=true
            this.selectAble = true
            this.activity.activityLimitType = res.data[0].value
          }
          if (res.data.length==2){
            this.showLimit=true
            this.selectAble = false
            this.activity.activityLimitType = res.data[0].value
          }
          this.limitTypeOptions = res.data
        })
      },
      //远程搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          this.$http.get("/school/students/NoPage", {
            params: {key: query}
          }).then(res => {
            this.loading = false;
            this.options4 = res.data
          })
        } else {
          this.options4 = [];
        }
      },
      //清除下拉框
      clear() {
        this.options4 = [];
      },
      systemClassifysListChange(value){
        this.dchd=true
        this.params.calssId = value[value.length-1]
      },
      systemClassifys(){
        this.$http.get('/activity/classifies/list').then(res => {
          this.systemClassifysList = cascade(0, res.data)
          this.systemClassifysList.unshift({label:'不限',value:''})
          // this.optionsClassify = cascade(0, res.data)
        })
      },
      open() {
        this.$message('请选择结束日期');
      },
      changeStartDate(value){
        this.dchd=true

      },
      changendDate(){
        this.dchd=true
      },
      gbhd(){
        this.dchd=true
      },

      getSponsor(){
        this.$http.get("/school/org/listall").then(res => {
          this.organizationes = res.data
        })
      },
      xiebanlist(){

        this.$http.get("/activity/getActivitySponsor").then(res => {
          this.xieban = res.data

        })
      },
      goTemplate(){

        this.$router.push({path:"/communist/activityTemplate", query: {oto: this.$route.query.oto}})

      },
      //切换tab ,依据状态 筛选数据
      handleClick(activeName){
        this.params.listType= parseInt(activeName)
        this.params.current=1;
        this.params.size= 10;
        if (this.$route.query.page) {
          this.params.current=1;
          this.params.size= 10;
          this.$refs.mychild.getCurrent(this.params.current);
        }
        this.fetch();
      },
      importFile(){
        axios({
          method: 'get',
          url: 'activity/list/export',
          responseType: 'blob',
          params: this.params
        }).then((res) => {
          if (!res) {
            return
          }
          var filename = name;
          let url = window.URL.createObjectURL(res)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '活动列表' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })

      },
      // change(value){
      // if (this.dateArray && this.dateArray.length) {
      //   this.params.startDate = this.dateArray[0].getTime();
      //   this.params.endDate = this.dateArray[1].getTime();
      // }else{
      //   this.dateArray = []
      //   this.params.startDate = ""
      //   this.params.endDate = ""
      // }
      //   if (this.dateArray) {
      //     this.params.startDate = this.dateArray.startDate2.getTime();
      //     this.params.endDate = this.dateArray.endDate2.getTime();
      //   } else {
      //     this.dateArray = []
      //     this.params.startDate = ""
      //     this.params.endDate = ""
      //   }
      // },
      getClassify() {
        this.$http.get('/activity/classify',{params:{parentId:0}}).then(res => {
          this.classifies = this.classifies.concat(res.data)
        })
      },
      fetch() {
        this.loading = true;
        this.$http.get('/activity/actAllList', {params: this.params}).then(res => {
          if (res.code == 200) {
            this.data = res.data.list
            this.total = res.data.total
            this.loading = false
          }
        })
      },
      search() {
        this.dchd=false
        if (this.dateArray.statTime2 ) {
          this.params.statTime = this.dateArray.statTime2.getTime();
        }
        if (this.dateArray.endTime2 ) {
          this.params.endTime = this.dateArray.endTime2.getTime();
        }

        if (!this.dateArray.statTime2){
          this.params.statTime = ""
        } ;
        if (!this.dateArray.endTime2){
          this.params.endTime = ""
        } ;


        if (!this.dateArray.statTime2 && !this.dateArray.endTime2) {
          this.dateArray = []
          this.params.statTime = ""
          this.params.endTime = ""
        }

        // let beginDateVal = this.dateArray.startDate2;
        // let beginYear = beginDateVal.getFullYear();
        // let beginMonth = beginDateVal.getMonth() + 1;
        // let beginDate = beginDateVal.getDate();
        //
        // let beginDateVal1 = beginYear + '-' + beginMonth + '-' + beginDate + ' ' + '00:00:00';
        // let beginDateVal2 = beginDateVal1.replace(/-/g,'/');
        // let timestamp = new Date(beginDateVal2).getTime();
// 			if(this.dateArray){
// 				this.params.startDate = this.dateArray[0].getTime();
//         this.params.endDate = this.dateArray[1].getTime();
// 			}
        // debugger;
        this.params.current = 1
        this.fetch()
      },
      getClassifytwo() {
        this.$http.get("/activity/classifies/list").then(res => {
          this.options = cascade3(0,res.data);
        });
      },
      changePage(current, size){
        this.params.current = current
        this.params.size = size
        this.fetch()
      },
      deleteBatch(id,status,name){
        var that = this
        var ids = id+''
        this.$confirm('此操作将永久删除该活动及其附带的学分及违约记录，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	this.$confirm('再次确认：此操作将永久删除该活动及其附带的学分及违约记录，是否继续?', '提示', {
        	  confirmButtonText: '确定',
        	  cancelButtonText: '取消',
        	  type: 'warning'
        	}).then(() => {
        		this.$confirm('最后一次确认：此操作将永久删除该活动及其附带的学分及违约记录，是否继续?', '提示', {
        		  confirmButtonText: '确定',
        		  cancelButtonText: '取消',
        		  type: 'warning'
        		}).then(() => {
        			this.$http.post('/activity/delete', {
        			id:id,
        			status:status,
        			}).then(res => {
        				if(res.code == '200'){
        				  that.$message({
        					type: 'success',
        					message: '删除成功!'
        				  });
        				  that.fetch()
        				}
        			}).catch(error => {});
        		}).catch(error => {});
        	}).catch(error => {});
        }).catch(error => {});
      },
      //撤回 完结审核 撤回已发放的学分
      rollBackFinished(id){
        var that = this
        var ids = id+''
        this.$confirm('此操作将删除活动已发放的学分，并撤回活动完结审核，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/activity/rollbackFinish', {
            activityId:id,
          }).then(res => {
            if(res.code == '200'){
              that.$message({
                type: 'success',
                message: '撤回成功!'
              });
              that.fetch()
            }

          }).catch(error => {
          });
        })
      },
      formatterStatus(row, column, cellValue){
        if(cellValue == 1){
          return "审核中"
        }else if(cellValue == 2){
          return "被驳回"
        }else if(cellValue == 3){
          return "报名中"
        }else if(cellValue == 4){
          return "待开始"
        }else if(cellValue == 5){
          return "进行中"
        }else if(cellValue == 6){
          return "待完结"
        }else if(cellValue == 7){
          return "完结审核中"
        }else if(cellValue == 8){
          return "完结被驳回"
        }else if(cellValue == 9){
          return "已完结"
        }
        else{
          return "其他"
        }
      },
    },

    created(){
      // this.systemClassifys()
      this.xiebanlist()
      this.getSponsor()
      this.getClassifytwo()
    },
    mounted(){
      if (this.$route.query.page) {
        this.params.current = parseInt(this.$route.query.page)
        this.params.statusAcitive = this.$route.query.status
      }
      if(this.$route.query.current){
        this.params=this.$route.query;
        if (this.$route.query.selectClassify){
          this.selectClassify = []
          var s = this.$route.query.selectClassify.split(',')
          for (var i=0;i<s.length;i++) {
            this.selectClassify.push(parseInt(s[i]))
          }
        }
      }

      this.fetch()

    },
  }
</script>
<style lang="scss" scoped>
  .el-form-item{
    margin-right: 5px !important;
  }
</style>

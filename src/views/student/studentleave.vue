<template>
  <section>

    <div style="position:relative;">
      <el-tabs v-model="params.statusAcitive">
        <el-tab-pane label="请假活动列表" name="1"></el-tab-pane>
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
        <el-form-item label="活动形式">
          <el-select clearable v-model="params.oto"  placeholder="请选择主办方"  @change="changendDate">
            <el-option
              v-for="item in otooption"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
                default-time="00:00:00"
                placeholder="请选择开始日期">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <span style="color:#606266;font-size:14px;">至</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-form-item    >
            <el-col :span="22">
              <el-date-picker
                :disabled="isShow"
                @change="changendDate"
                style="width:100%;"
                start-placeholder="2017 年 03 月 21 日"
                v-model="dateArray.endTime2"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                default-time="23:59:59"
                placeholder="请选择结束日期" :picker-options="pickerOptions1">
              </el-date-picker>
            </el-col>
          </el-form-item>

        </el-form-item>

        <el-form-item label="主办方">
          <el-select clearable v-model="params.orgId"  placeholder="请选择主办方"  @change="changendDate">
            <el-option
              v-for="item in organizationes"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="承办/协办方" >
          <el-select clearable v-model="params.coorgId"  placeholder="请选承办/协办方"  @change="changendDate">
            <el-option
              v-for="item in xieban"
              :key="item.organizationId"
              :label="item.organizationName"
              :value="item.organizationId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请假状态" >
          <el-select clearable v-model="params.leave"  placeholder="请选请假状态"  >
            <el-option
              v-for="item in leaveoption"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动ID/名称">
          <el-input v-model="params.actIdOrName" maxlength=30 placeholder="请输入活动ID/名称搜索" @input="gbhd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="search">查询</el-button>
        </el-form-item>

      </el-form>
    </div>
    <div class="main-body">
      <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
        <el-table-column prop="actId" label="活动ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="活动名称" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column   label="活动形式"  align="left" >
          <div slot-scope="scope">
            <p> {{scope.row.oto==0?'线上':scope.row.oto==1?'线下':''}}</p>
          </div>
        </el-table-column>
        <el-table-column prop="orgName" label="主办方"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="adminName" label="管理员"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="className" label="活动分类"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="hours" :label="unit"  align="left" ></el-table-column>
        <el-table-column prop="firstAuditorName" label="活动时间"  align="left">
          <div slot-scope="scope">
            <p>起： {{scope.row.startTime  | formatDate}}</p>
            <p>终： {{scope.row.endTime  | formatDate}}</p>
          </div>
        </el-table-column>
        <el-table-column    label="状态"  align="left" >
          <div slot-scope="scope">
            <p> {{scope.row.leave==1?'请假成功':scope.row.leave==2?'请假失败':''}}</p>
          </div>
        </el-table-column>


        <el-table-column  label="操作" width="160" align="left">
          <div slot-scope="scope">
            <!-- 可转载站点功能未完成 -->
            <!--              <el-button type="text" class="opreat-btn" @click.native="routerLink('activity/detail','view',scope.row.id,'',params.current,params.statusAcitive)" v-perms="'/communist/activity/detail'">详情</el-button>-->
            <el-button type="text" class="opreat-btn" @click.native="showDetail(scope.row.actId,scope.row.oto)" v-perms="'/communist/activity/detail'">详情</el-button>
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
        pickerOptions1: {
          disabledDate: (time) => {
            let beginDateVal = this.dateArray.statTime2;
            if (beginDateVal) {
              let beginYear = beginDateVal.getFullYear();
              let beginMonth = beginDateVal.getMonth() + 1;
              let beginDate = beginDateVal.getDate();

              let beginDateVal1 = beginYear + '-' + beginMonth + '-' + beginDate + ' ' + '00:00:00';
              let beginDateVal2 = beginDateVal1.replace(/-/g,'/');
              let timestamp = new Date(beginDateVal2).getTime();

              if (beginDateVal) {
                return time.getTime() < timestamp   ;
              }
            }else {
              return true
            }
          },
          // minTime:dateArray.startDate2
        },

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

          listType:1,
          current: 1,
          size: 10,
          statTime: '',
          endTime: '',
          statusAcitive:"1",
          coorgId:"",
          orgId:'',
          actIdOrName: '',
          calssId:'',
          leave:'',
          userId:this.$route.query.uid,
          oto:'',
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
          calssIds2: [{required: true, message: '请选择活动分类',trigger: 'change'}]
        },
        selectClassify:[],
        leaveoption:[
          {id:'',name:'全部'},
          {id:1,name:'成功'},
          {id:2,name:'失败'},
        ],
        otooption:[
          {id:'',name:'全部'},
          {id:1,name:'线上'},
          {id:2,name:'线下'},
        ],
      }
    },
    methods:{
      showDetail(id,oto){


        this.$router.push({path:"/communist/activity/detail", query: {id:id,oto:oto,flag:1}})
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
      getClassifytwo() {
        this.$http.get("/activity/classifies/list").then(res => {
          this.options = cascade3(0,res.data);
        });
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
        if (value) {
          this.isShow = false
        }else{
          this.isShow = true
          this.dateArray.endTime2 = ""
        }
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

        this.$router.push({path:"/communist/activityTemplateUP", query: {oto: this.$route.query.oto}})

      },
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
        this.loading = true


        this.$http.get('/school/students/leavelist', {params: this.params}).then(res => {

          if (res.code == 200) {
            this.data = res.data.list
            this.total = res.data.total
            this.loading = false
          }
        })
      },
      search() {
        this.dchd=false
        if (this.dateArray.statTime2 && this.dateArray.endTime2) {
          this.params.statTime = this.dateArray.statTime2.getTime();
          this.params.endTime = this.dateArray.endTime2.getTime();
        }
        if (this.dateArray.statTime2 && !this.dateArray.endTime2) {
          this.open()
          return
        }
        if (!this.dateArray.statTime2 && !this.dateArray.endTime2) {
          this.dateArray = []
          this.params.statTime = ""
          this.params.endTime = ""
        }

        this.params.current = 1
        this.fetch()
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

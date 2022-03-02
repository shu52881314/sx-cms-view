<template>
  <section>
<!---->
		<el-dialog title="通过" :visible.sync="dialogVisible" :close-on-click-modal="false" width="500px">
        <el-form size="mini" label-width="60px" :model="ruleFormPass" :rules="rules" ref="ruleFormPass" class="demo-ruleForm">
          <!-- <el-form-item label="标签">
              <el-col :span="22">
                <el-select  style="width:100%" v-model="ruleFormPass.tagId">
                    <el-option v-for="tag in tags" :value-key="tag.id" :key="tag.id" :value="tag.id" :label="tag.name"></el-option>
                </el-select>
              </el-col>
          </el-form-item> -->
          <el-form-item   prop="hours" :label="hoursUnit">
              <el-col :span="22">
                  <el-input maxlength="7" :placeholder="'请输入' + hoursUnit" v-model="ruleFormPass.hours"></el-input>
              </el-col>
          </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitFormPass('ruleFormPass')" :disabled="$store.state.sys.isClick">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

		<el-dialog title="驳回" :visible.sync="dialogVisibleAdopt" :close-on-click-modal="false" width="30%">
        <el-form size="mini" :model="ruleFormReject" ref="ruleFormReject" class="demo-ruleForm">
            <el-form-item prop="name">
                <el-col :span="22">
                    <el-input type="textarea" placeholder="请输入驳回理由(50字以内)" maxlength='50' v-model="ruleFormReject.auditRemark"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitFormReject()" :disabled="$store.state.sys.isClick">确定</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>

    <el-tabs v-model="statusAcitive" @tab-click="handleClick(statusAcitive)">
      <el-tab-pane label="活动审核" name="1"></el-tab-pane>
      <el-tab-pane label="完结审核" name="2"></el-tab-pane>
    </el-tabs>
    <div class="search-box">
      <el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item label="活动分类" >
          <el-cascader
            :options="systemClassifysList"
            v-model="selectClassify"
            @change="systemClassifysListChange"
            change-on-select>
          </el-cascader>
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
        <el-form-item label="活动ID/名称">
          <el-input v-model="params.keyWord" maxlength=30 placeholder="请输入活动ID/名称搜索"></el-input>
        </el-form-item>
        <el-form-item label="主办方">
          <el-select clearable filterable v-model="params.orgId"  placeholder="请选择主办方">
            <el-option
              v-for="item in organizationes"
              :key="item.organizationId"
              :label="item.organizationName"
              :value="item.organizationId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="承办/协办方" >
          <el-select  clearable filterable v-model="params.assistOrgId"  placeholder="请选承办/协办方">
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
      </el-form>
    </div>

				<div class="main-body">
				<el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
          <el-table-column prop="activityName" label="活动名称" width="240" show-overflow-tooltip></el-table-column>
          <el-table-column prop="organizationName" label="主办方" show-overflow-tooltip></el-table-column>
            <el-table-column prop="adminName" label="管理员" show-overflow-tooltip></el-table-column>
          <el-table-column prop="classifName" label="活动分类" show-overflow-tooltip></el-table-column>
          <el-table-column prop="hours" :label="hoursUnit" show-overflow-tooltip></el-table-column>
          <el-table-column label="活动时间" align="center">
          	<template slot-scope="scope">
							<p>起：{{scope.row.startTime  | formatDate}}</p>
							<p>终：{{scope.row.endTime  | formatDate}}</p>
						</template>
          </el-table-column>
          <el-table-column  label="操作" width="160" align="center">
            <div slot-scope="scope">
              <!-- 可转载站点功能未完成 -->
              <!-- <el-button type="text" class="opreat-btn" @click.native="routerLink('detail','view',scope.row.activityId)" v-perms="'/communist/activity/first/detail'">详情</el-button>
              <el-button type="text" class="opreat-btn" @click.native="adopt(scope.row)" v-perms="'/communist/activity/first/adpot'">通过</el-button>
              <el-button type="text" class="opreat-btn"  @click="eject(scope.row.activityId)" v-perms="'/communist/activity/first/reject'">驳回</el-button> -->


              <el-button type="text" class="opreat-btn" @click.native="adopt(scope.row)">通过</el-button>
              <el-button type="text" class="opreat-btn"  @click="eject(scope.row)">驳回</el-button>
              <el-button type="text" class="opreat-btn" @click.native="showDetail(scope.row.actId,scope.row.applyId,scope.row.taskId,scope.row.auditType)" v-perms="'/communist/activity/detail'">查看详情</el-button>
            </div>
          </el-table-column>
        </el-table>
        <qu-pagination :total="total" @change="changePage"></qu-pagination>
		</div>
  </section>
</template>
<script>
import {
      isFloat
  } from '@/utils/validate'
import {cascade} from '@/utils/filters'
 var validCode2 = (rule, value, callback) => {
     if (!value) {
         callback(new Error('不能为空'))
     } else if (!isFloat(value)) {
         callback(new Error('请输入正确的格式'))
     } else {
         callback()
     }
 }
export default {
  data() {
    return {
      organizationes:[],
      xieban:[],
      systemClassifysList:[],
      selectClassify:[],
      statusAcitive:'1',
      isOld:false,
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
      hoursUnit:localStorage.getItem("hoursUnit"),
      rules:{
        hours: [{
            required: true,
            trigger: 'blur',
            validator: validCode2
        }],
      },
      loading: false,
			params: {
        keyWord:'',
        current: 1,
        size: 10,
        orgId:'',
        oto:this.$route.query.oto
			},
      dateArray: {
        statTime2:'',
        endTime2:'',
      },
			dialogVisible:false,
			dialogVisibleAdopt:false,
			data: [],
			tags: [],
			ruleFormPass: {
        taskId: '',
        applyId: '',
                status:1,
                auditRemark:'',
                hours: ''
			},
			ruleFormReject: {
        hours:'',
                status:0,
        taskId: '',
        applyId: '',
                auditRemark: ''
      },
			classifies: [{id: '', name: '全部'}],
			total: 0,
			options: [{id: '', name: '不限'}]
    }
  },
	methods:{
    getSponsor(){
      this.$http.get("/activity/organization/list").then(res => {
        this.organizationes = res.data
      })
    },
    xiebanlist(){

      this.$http.get("/activity/getActivitySponsor").then(res => {
        this.xieban = res.data

      })
    },
    systemClassifys(){
      this.$http.get('/activity/classifies/list').then(res => {
        this.systemClassifysList = cascade(0, res.data)
        this.systemClassifysList.unshift({label:'不限',value:''})
        // this.optionsClassify = cascade(0, res.data)
      })
    },
    systemClassifysListChange(value){

      this.params.calssId = value[value.length-1]
    },
    showDetail(id,applyId,taskId,auditType){
      this.$router.push({path:"/proceeding/wait/activity/first/activity/detail", query: {id:id,applyid:applyId,taskid:taskId,auditType:auditType,oto:this.params.oto,flag:2,dshuo:1}})
    },
    handleClick(activeName){

      if(activeName=='2'){
        this.$router.push({path:"/proceeding/wait/activity/report/auditing", query: {oto:this.params.oto}})
      }
    },
    durationFormatter(row, column, cellValue){


      if (cellValue >= 24) {

        if (cellValue%24 == 0) {
              return parseInt(cellValue/24) + '天'
        }else{
              return parseInt(cellValue/24) + '天' + cellValue%24 + '小时'
        }


      }else{
        return cellValue + '小时'
      }

    },
    open() {
      this.$message('请选择结束日期');
    },
    changeStartDate(value){
      if (value) {
        this.isShow = false
      }else{
        this.isShow = true
        this.dateArray.endTime2 = ""
      }
    },
		//驳回
		eject(row) {

				this.dialogVisibleAdopt = true;
				this.ruleFormReject.applyId = row.applyId;
				this.ruleFormReject.taskId = row.taskId;
		},
		submitFormPass(formName) {

      this.$refs[formName].validate((valid) => {
         if (valid) {

           this.$http.post("/activity/audit", this.ruleFormPass).then( (res) => {
             if (res.code == '200') {
               this.dialogVisible = false;
               this.ruleFormPass.hours = '';
             this.$message({
               type: 'success',
               message: '审核成功!'
             });
             this.fetch();
             }

           })
         }
      })



		},
		  submitFormReject() {
            if (this.ruleFormReject.auditRemark) {


                this.$http.post('/activity/audit',this.ruleFormReject).then( (res) => {
                  if (res.code == '200') {
                    this.dialogVisibleAdopt = false;
                    this.ruleFormReject.auditRemark = '';

                  this.$message({
                    type: 'success',
                    message: '驳回成功!'
                  });
                  this.fetch();
                  }

                })
            } else {
                this.$message({
                    type: 'error',
                    message: '请填写原因'
                });
            }

        },
		getTags(){
			this.$http.get('/school/activity/tag/list').then(res => {
				this.tags = res.data
			})
		},
		getClassify() {
			this.$http.get('/activity/classify',{params:{parentId:0}}).then(res => {
				this.classifies = this.classifies.concat(res.data)
			})
		},
		fetch() {

			this.loading = true
			this.$http.get('/activity/to-audit-list', {params: this.params}).then(res => {
      	this.data = res.data.list
				this.total = res.data.total
				this.loading = false
			})
		},
		adopt(row){

            this.dialogVisible = true;
            this.ruleFormPass.taskId = row.taskId;
            this.ruleFormPass.applyId = row.applyId;
            if (row.hours) {
                this.ruleFormPass.hours = row.hours
            }

            // this.ruleFormPass.tagId = row.tagId;

		},
		search() {
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

      console.log(this.selectClassify)
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
		changePage(current, size){
			this.params.current = current
			this.params.size = size
			this.fetch()
		}
	},
	created(){

		this.systemClassifys()
    this.xiebanlist()
    this.getSponsor()
	},
	mounted(){
    if (this.$route.query.page) {
      this.params.current = parseInt(this.$route.query.page)
    }
    this.fetch()
	}
}
</script>
<style>

</style>

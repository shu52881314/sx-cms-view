<template>
  <section>

	    <el-dialog
		title="添加减分项" @close="beforeCloseHandler"
		:visible.sync="dialogVisible"
		:close-on-click-modal="false"
		width="650px">
		<div>
		<el-form  :model="ruleForm" :rules="rules"  ref="ruleForm" label-width="110px" class="demo-ruleForm">
			<el-form-item label="减分项名称" prop="name">
			<el-col :span="22" >
				<el-input maxlength="20" v-model="ruleForm.name"></el-input>
			</el-col>
			</el-form-item>
			 <el-form-item label="选择分类" prop="parents">
				<el-col :span="22" >
					<el-cascader  style="width:100%"  class="selectWidth" expand-trigger="hover" @change="handleChange"  v-model="ruleForm.parents" clearable :options="options" :change-on-select="false" :show-all-levels="true"></el-cascader>
				</el-col>
			</el-form-item>
      <el-form-item label='限定类型' v-if='showLimit'>
        <el-col :span="22" >
          <el-select :disabled = 'selectAble' v-model="ruleForm.limitType" placeholder="请选择" >
            <el-option
              v-for="item in limitTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
		    <el-form-item label="备注" prop="des">
			<el-col :span="22" >
				<el-input type="textarea"  maxlength="300" :rows="2" v-model="ruleForm.des"></el-input>
			</el-col>
			</el-form-item>
			<el-form-item>
			<el-button :disabled="$store.state.sys.isClick"  type="primary" @click="submitForm('ruleForm')">添加</el-button>
			</el-form-item>
		</el-form>
		</div>
		</el-dialog>

		<div class="main-header" style="overflow: hidden;">
			<div style="width: 60%;float: left;">
				<p class="main-title" >减分项</p>
				<p style="font-size:12px;color:#999">学生有不当行为需要减分的，可进行添加或批量导入</p>
			</div>
			<div style="width: 40%;float: right;">
					<el-button style='float: right;' @click="dialogVisible = true" type="primary" size="mini" >添加减分项</el-button>
			</div>
		</div>

		<div class="search-box">
			<el-form size="mini" :inline="true" class="demo-form-inline">
				<el-form-item label="日期">
					<!-- <el-date-picker  @change="changeDate" clearable size="mini" class="selectWidth" :editable="false" type="daterange" v-model="dateArray" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker> -->

          <el-form-item   >
              <el-col :span="22">
                <el-date-picker
                 @change="changeStartDate"
                 style="width:100%;"
                 v-model="dateArray.startDate2"
                 type="datetime"
                 placeholder="请选择开始日期">
               </el-date-picker>
              </el-col>
          </el-form-item>
          <span style="color:#606266;font-size:14px;">至</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-form-item   >
              <el-col :span="22">
                <el-date-picker
                 :disabled="isShow"
                 style="width:100%;"
                 start-placeholder="2017 年 03 月 21 日"
                 v-model="dateArray.endDate2"
                 type="datetime"
                 default-time="23:59:59"
                 placeholder="请选择结束日期" :picker-options="pickerOptions1">
               </el-date-picker>
              </el-col>
          </el-form-item>

				</el-form-item>
				<el-form-item label="分类">
					<el-cascader
				    :options="systemClassifysList"
					    @change="systemClassifysListChange"
					    change-on-select>
				  </el-cascader>
				</el-form-item>

				<el-form-item label="名称">
					<el-input v-model="params.name" placeholder="请输入项目名称搜索" maxlength='20'></el-input>
				</el-form-item>
				<el-form-item>
					<el-button size="mini" type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</div>

		<div class="main-body">
		  <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
		  	<el-table-column type="index" width="55" label="序号"> </el-table-column>
          <el-table-column prop="name" label="项目名称"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="classifyName" label="分类名称"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="limitType" label="限定类型"  show-overflow-tooltip>
          <div slot-scope="scope">
            <p>{{scope.row.limitType | formatLimitType}}</p>
          </div>
        </el-table-column>
          <el-table-column prop="memberCount" label="减分人数"  show-overflow-tooltip>
          	<div slot-scope="scope">
               {{scope.row.memberCount}}人
            </div>
          </el-table-column>
          <el-table-column prop="creatorName" label="添加人" ></el-table-column>
          <el-table-column prop="ctime" label="添加时间">
              <div slot-scope="scope">
                  {{scope.row.ctime | formatDate}}
              </div>
          </el-table-column>
          <el-table-column prop="des" label="备注"  show-overflow-tooltip></el-table-column>

          <el-table-column  label="操作">
            <div slot-scope="scope">
              <!-- 可转载站点功能未完成 -->
              <el-button type="text" class="opreat-btn" @click.native="routerLink('sub/detail','view',scope.row.id)" v-perms="'/communist/sub/detail'">详情</el-button>
              <el-button type="text" class="opreat-btn" v-if="scope.row.memberCount == 0" @click.native="deleteProject(scope.row.id)" v-perms="'/communist/sub/delete'">删除</el-button>

              <!-- <el-button type="text" class="opreat-btn">导入成员</el-button> -->
            </div>
          </el-table-column>
        </el-table>

        <qu-pagination :total="total" @change="changePage"></qu-pagination>

		</div>
  </section>
</template>
<script>
import {cascade} from '@/utils/filters'
import { Message } from 'element-ui';
export default {
  data() {
    return {
      isShow:true,
      pickerOptions1: {
        disabledDate: (time) => {
          let beginDateVal = this.dateArray.startDate2;
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
        }
      },
      dateArray:{
        startDate2 : '',
        endDate2 : ''
      },
    	systemClassifysList:[],
        IsClick:false,
		    dialogVisible:false,
            loading: false,
            dateArray:[],
			params: {
				current: 1,
				size: 10,
				startDate: '',
				endDate: '',
				name: '',
				classifyId:'',
				type: 2,
			},
			ruleForm: {
                 name: '',
                 parents:[],
				 des: '',
				 classifyId:'',
				 type:2
            },
			classifies: [{id: '', name: '全部'}],
			rules:{
				 name: [{
                  required: true,message: '请输入名称',trigger: 'blur'
				 }],
				 parents: [{
                  required: true,message: '请选择分类',trigger: 'change'
				 }],
				 des: [{
                  required: true,message: '请输入备注',trigger: 'blur'
                 }],
			},
			data: [],
			total: 0,
			options:[],
            options2:[],
      limitTypes:[],
      showLimit:false,
      selectAble:true,
    }
  },
	methods:{
    handleChange(value){
      var categoryId=value[value.length-1];
      if(categoryId!=null){
        this.getLimitType(categoryId);
      }
    },
    getLimitType(id){
      this.$http.get('/qu-activity-classify/info',{params:{classifyId:id}}).then(res => {
        if(res.data.length==0){
          this.showLimit=false
          this.ruleForm.limitType = '0'
        }
        if(res.data.length==1){
          this.showLimit=true
          this.selectAble = true
          this.ruleForm.limitType = res.data[0].value
        }
        if (res.data.length==2){
          this.showLimit=true
          this.selectAble = false
          this.ruleForm.limitType = res.data[0].value
        }
        this.limitTypes = res.data
      })
    },
    open() {
        this.$message('请选择结束日期');
      },
    changeStartDate(value){
      if (value) {
        this.isShow = false
      }else{
        this.isShow = true
        this.dateArray.endDate2 = ""
      }
    },
    // change(value) {
    //   if (this.dateArray) {
    //     this.params.startDate = this.dateArray.startDate2.getTime();
    //     this.params.endDate = this.dateArray.endDate2.getTime();
    //   } else {
    //     this.dateArray = []
    //     this.params.startDate = ""
    //     this.params.endDate = ""
    //   }
    //
    // },
		systemClassifysListChange(value){
			this.params.classifyId = value[value.length-1]
		},
	 submitForm(formName){
         this.$refs[formName].validate((valid) => {
            if (valid) {
        this.$store.commit('setClick',true)
				this.ruleForm.classifyId = this.ruleForm.parents.join(',');
        this.IsClick = true

              this.$http.post("/reward-punish/project/add", this.ruleForm).then((res) => {
               this.IsClick = false
                  if (res.code === '200') {
			          this.fetch();
			          this.dialogVisible = false
                      this.$message({
                          type: 'success',
                          message: '减分项添加成功!'
                      });
                  } else {
                      this.$message({
                          type: 'error',
                          message: res.msg
                      });
                  }
              })

            }
          })


      },
	   getClassify(){
			this.$http.get('/activity/classifies/list').then(res => {
				this.options = cascade("0", res.data)
				this.systemClassifysList = cascade("0", res.data)
        this.systemClassifysList.unshift({label:'不限',value:''})
			})
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		beforeCloseHandler() {
			this.resetForm('ruleForm');
		},
        changeDate(){
            if (this.dateArray && this.dateArray.length) {
                this.params.startDate = this.dateArray[0].getTime();
                if(this.dateArray[1].getTime()){
                	this.params.endDate = this.dateArray[1].getTime()+86399000;
                }
                }else{
                 this.dateArray = []
                 this.params.startDate = ""
                 this.params.endDate = ""
                }
      },
		fetch() {
			this.loading = true
			this.$http.get('/reward-punish/project/list', {params: this.params}).then(res => {
				this.data = res.data.list
				this.total = res.data.total
				this.loading = false
			})
		},
		search() {
      if (this.dateArray.startDate2 && this.dateArray.endDate2) {
        this.params.startDate = this.dateArray.startDate2.getTime();
        this.params.endDate = this.dateArray.endDate2.getTime();
      }
      if (this.dateArray.startDate2 && !this.dateArray.endDate2) {
        this.open()
        return
      }
       if (!this.dateArray.startDate2 && !this.dateArray.endDate2) {
        this.dateArray = []
        this.params.startDate = ""
        this.params.endDate = ""
      }
			this.params.current = 1
			this.fetch()
		},
		changePage(current, size){
			this.params.current = current
			this.params.size = size
			this.data = []
			this.fetch()
		},
		//删除
    deleteProject(id){

      this.$confirm('是否确定删除该项目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.$http.post("/reward-punish/project/delete", {projectId: id} ).then( (res) => {
          if (res.code == '200') {
            this.fetch();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })


      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });

    },
	},
	created(){
		this.fetch()
		this.getClassify();
	},
	mounted(){

	},
  filters:{
    formatLimitType(limitType) {
      if(limitType==0){
        limitType='无'
      }else if(limitType==1){
        limitType=localStorage.getItem("compulsoryName")
      }else if(limitType==2){
        limitType=localStorage.getItem("electiveName");
      }
      return limitType;
    }
  }
}
</script>
<style>

</style>

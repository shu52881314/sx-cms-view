<template>
  <section>



		<el-dialog title="驳回" :visible.sync="dialogVisibleAdopt" :close-on-click-modal="false" width="30%">
        <el-form size="mini" :model="ruleFormReject" ref="ruleFormReject" class="demo-ruleForm">
            <el-form-item prop="name">
                <el-col :span="22">
                    <el-input type="textarea" placeholder="请输入原因" v-model="ruleFormReject.auditRemark"maxlength="50"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitFormReject()">确定</el-button>
            </el-form-item>
        </el-form>

   </el-dialog>
   <el-dialog title="原因" :visible.sync="causes" :close-on-click-modal="false" width="30%">
        <el-form size="mini" :model="ruleFormReject" ref="ruleFormReject" class="demo-ruleForm">
            <el-form-item v-if="reason">
                <el-col :span="22">
                    <span>申请原因:{{reason}}</span>
                </el-col>
            </el-form-item>
            <el-form-item v-if="remark">
                <el-col :span="22">
                    <span>驳回原因:{{remark}}</span>
                </el-col>
            </el-form-item>
        </el-form>

    </el-dialog>

		<div class="main-header">
			<span class="main-title">转专业列表</span>
		</div>

		<div class="search-box">
			<el-form size="mini" :inline="true" class="demo-form-inline">
			 <el-form-item label="状态">
					<el-select clearable v-model="params.status" placeholder="请选择分类">
						<el-option v-for="option in statues" :key="option.id" :label="option.name" :value="option.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="日期">
					<!-- <el-date-picker @change="changeDate" clearable size="mini" class="selectWidth" :editable="false" type="datetimerange" v-model="dateArray" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
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
				<el-form-item label="名称">
					<el-input v-model="params.activityName" maxlength=30  placeholder="请输入姓名或学号搜索"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button size="mini" type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="main-body">
				<el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
					<el-table-column type="index" label="序号" width="50">	</el-table-column>
          <el-table-column prop="userName" label="姓名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="code" label="学号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="newCampusName" label="校区" show-overflow-tooltip></el-table-column>
          <el-table-column prop="newCollegeName" label="院系"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="newMajorName" label="专业"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="newClassName" label="班级"  show-overflow-tooltip></el-table-column>
          <el-table-column label="年级"  show-overflow-tooltip>
          	<template slot-scope="scope">
					 		<span >{{scope.row.grade}}级</span>
					 	</template>
          </el-table-column>
          <el-table-column prop="status" label="状态"  show-overflow-tooltip>
              <div slot-scope="scope">
                 {{scope.row.status == 1 ? "待审核" : (scope.row.status == 2 ? '审核通过' : '审核驳回')}}
              </div>
          </el-table-column>
          <el-table-column prop="remark" label="原因" show-overflow-tooltip>
          	<template slot-scope="scope">
          		<a><span @click="cause(scope.row.reason,scope.row.remark)" style='color: #008AFF;'>查看</span></a>
          	</template>
          </el-table-column>
          <el-table-column prop="concat" label="联系方式"  show-overflow-tooltip></el-table-column>
          <el-table-column  label="操作" width="160" align="center">
            <div slot-scope="scope">
              <!-- 可转载站点功能未完成 -->
              <el-button v-if="scope.row.status == 1" type="text" class="opreat-btn" @click.native="adopt(scope.row.applyId,1)" v-perms="'/student/turnMajor/adpot'">通过</el-button>
              <el-button v-if="scope.row.status == 1" type="text" class="opreat-btn"  @click="eject(scope.row.applyId)" v-perms="'/student/turnMajor/reject'">驳回</el-button>
            </div>
          </el-table-column>
        </el-table>
        <qu-pagination :total="total" @change="changePage"></qu-pagination>
		</div>
  </section>
</template>
<script>
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
    	causes:false,
    	remark:'',
    	reason:'',
      loading: false,
			params: {
				current: 1,
        size: 10,
        status:'',
        startDate:'',
        endDate:''
      },
      statues:[
        {
          id:'',
          name:'不限'
        },
        {
          id:1,
          name:'待审核'
        },
        {
          id:2,
          name:'审核通过'
        },
        {
          id:3,
          name:'审核驳回'
        }
      ],
      dateArray:{
        startDate2 : '',
        endDate2 : ''
      },
			dialogVisible:false,
			dialogVisibleAdopt:false,
			data: [],
			tags: [],
			ruleFormPass: {
                id: '',
                tagId:'',
                mode: 1,
                status: 1,
                hours: ''
			},
			ruleFormReject: {
                applyId: '',
                status: 2,
                auditRemark: ''
      },
			classifies: [{id: '', name: '全部'}],
			total: 0,
			options: [{id: '', name: '不限'}]
    }
  },
	methods:{
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
		 cause(reason,remark){
		 	this.reason = reason
		 	this.remark = remark
		 	this.causes = true
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
		//驳回
		eject(id) {
				this.dialogVisibleAdopt = true;
				this.ruleFormReject.applyId = id;
		},
		submitFormPass() {
	 	},
		  submitFormReject() {
            if (this.ruleFormReject.auditRemark) {
                this.$http.post('/school/major/apply/audit',this.ruleFormReject).then( (res) => {
                  if (res.code == '200') {
                    this.dialogVisibleAdopt = false;
                    this.ruleFormReject.auditRemark = '';
                    this.fetch();
                    this.$message({
                      type: 'success',
                      message: '驳回成功!'
                    });
                  }

                })
            } else {
                this.$message({
                    type: 'error',
                    message: '请填写原因'
                });
            }

        },

		fetch() {
			this.loading = true
			this.$http.get('/school/major/apply/list', {params: this.params}).then(res => {
				this.data = res.data.list
				this.total = res.data.total
				this.loading = false
			})
		},
		adopt(id,status){
            this.$confirm('确定通过该申请吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
              	this.$http.post('/school/major/apply/audit', {
                  applyId:id,
                  status:status,
                }).then( (res) => {
	                if (res.code == '200') {
	                  this.$message({
	                    type: 'success',
	                    message: '通过成功!'
	                  });
	                  this.fetch();
	                }else{
	                  this.$message({
	                    type: 'error',
	                    message: res.msg
	                  });
	                }
	              })
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
			this.fetch()
		}
	},
	created(){
		this.fetch()
	},
	mounted(){

	}
}
</script>
<style>

</style>

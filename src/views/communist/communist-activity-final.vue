<template>
  <section>

		<el-dialog title="通过" :visible.sync="dialogVisible" :close-on-click-modal="false" width="30%">
        <el-form size="mini" :model="ruleFormPass" ref="ruleFormPass" class="demo-ruleForm">

          <el-form-item prop="name"  :label="hoursUnit">
              <el-col :span="22">
                  <el-input :disabled="true" v-model="ruleFormPass.hours"></el-input>
              </el-col>
          </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitFormPass()" :disabled="$store.state.sys.isClick">确定</el-button>
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

		<div class="main-header">
			<span class="main-title">终审活动</span>
		</div>

		<div class="search-box">
			<el-form size="mini" :inline="true" class="demo-form-inline">
				<el-form-item label="分类">
					<el-select clearable v-model="params.classifyId" placeholder="请选择分类">
						<el-option v-for="option in classifies" :key="option.id" :label="option.name" :value="option.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="活动日期">
					<el-date-picker @change="changeDate" clearable size="mini" class="selectWidth" :editable="false" type="datetimerange" v-model="dateArray" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="params.activityName"  maxlength=30 placeholder="请输入名称搜索"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button size="mini" type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="main-body">
				<el-table :loading="loading" :data="data" stripe size="mini" style="width: 100%">
          <el-table-column prop="activityName" label="名称" width="240" show-overflow-tooltip></el-table-column>
          <el-table-column prop="classifName" label="分类" show-overflow-tooltip></el-table-column>
          <el-table-column prop="organizationName" label="主办方" show-overflow-tooltip></el-table-column>
          <el-table-column prop="adminName" label="管理员" show-overflow-tooltip></el-table-column>
          <el-table-column :formatter="durationFormatter" prop="duration" label="活动时长">

          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" align="center">
          	<template slot-scope="scope">
							<span>{{scope.row.submitTime  | formatDate}}</span>
						</template>
          </el-table-column>
          <el-table-column  label="操作" width="160" align="center">
            <div slot-scope="scope">
              <!-- 可转载站点功能未完成 -->
              <!-- <el-button type="text" class="opreat-btn" @click.native="routerLink('detail','view',scope.row.activityId)" v-perms="'/communist/activity/final/detail'">详情</el-button>
              <el-button type="text" class="opreat-btn" @click.native="adopt(scope.row)" v-perms="'/communist/activity/final/adpot'">通过</el-button>
              <el-button type="text" class="opreat-btn"  @click="eject(scope.row.activityId)" v-perms="'/communist/activity/final/reject'">驳回</el-button> -->

              <el-button type="text" class="opreat-btn" @click.native="routerLink('detail','view',scope.row.activityId)">详情</el-button>
              <el-button type="text" class="opreat-btn" @click.native="adopt(scope.row)">通过</el-button>
              <el-button type="text" class="opreat-btn"  @click="eject(scope.row.activityId)">驳回</el-button>
            </div>
          </el-table-column>
        </el-table>
        <qu-pagination :total="total" @change="changePage"></qu-pagination>
		</div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
			params: {
        nature:1,
				current: 0,
				classifyId:'',
				size: 10,
				type: 2,
				activityName: ''
			},
			dateArray:[],
			dialogVisible:false,
			dialogVisibleAdopt:false,
			data: [],
			tags: [],
			ruleFormPass: {
                id: '',
                tagId:'',
                mode: 2,
                status: 1,
                hours: ''
			},
			ruleFormReject: {
                id: '',
                mode: 2,
                status: 2,
                auditRemark: ''
      },
			classifies: [{id: '', name: '全部'}],
			total: 0,
      hoursUnit:localStorage.getItem("hoursUnit"),
			options: [{id: '', name: '不限'}]
    }
  },
	methods:{
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
				this.ruleFormReject.id = id;
		},
		submitFormPass() {
            if (this.ruleFormPass.hours) {
            		this.$store.commit('setClick',true)
                this.$http.post('/activity/audit', this.ruleFormPass).then( () => {
                    this.dialogVisible = false;
                    this.ruleFormPass.hours = '';
                    this.fetch();
	                this.$message({
	                  type: 'success',
	                  message: '审核成功!'
	                });
                })
            } else {
                this.$message({
                    type: 'error',
                    message: '请填写' + this.hoursUnit
                });
            }
		},
		  submitFormReject() {
            if (this.ruleFormReject.auditRemark) {
            		this.$store.commit('setClick',true)
                this.$http.post('/activity/audit',this.ruleFormReject).then( (res) => {
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
			this.$http.get('/activity/waitForFirstTrial/list', {params: this.params}).then(res => {
				this.data = res.data.list
				this.total = res.data.total
				this.loading = false
			})
		},
		adopt(row){
            this.dialogVisible = true;
            this.ruleFormPass.id = row.activityId;
            this.ruleFormPass.tagId = row.tagId;
            this.ruleFormPass.hours = row.hours;

		},
		search() {
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
		this.getClassify()
		// this.getTags()
	},
	mounted(){

	}
}
</script>
<style>

</style>

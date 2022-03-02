<template>
  <section>

		  <el-dialog title="拒绝完结报告" :visible.sync="dialogVisibleRefuse" :close-on-click-modal="false" width="30%">
            <el-form size="mini" :model="ruleFormRefuse" ref="ruleFormRefuse" class="demo-ruleForm">
                <el-form-item prop="name">
                <el-col :span="22">
                    <el-input type="textarea" placeholder="请输入原因" v-model="ruleFormRefuse.remark"></el-input>
                </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitFormRefuse()">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="驳回完结报告" :visible.sync="dialogVisibleAdopt" :close-on-click-modal="false" width="30%">
            <el-form size="mini" :model="ruleFormReject" ref="ruleFormReject" class="demo-ruleForm">
                <el-form-item prop="name">
                <el-col :span="22">
                    <el-input type="textarea" placeholder="请输入原因" v-model="ruleFormReject.remark"></el-input>
                </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitFormReject()">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

		<div class="main-header">
			<span class="main-title">完结报告审核</span>
		</div>

		<div class="search-box">
			<el-form size="mini" :inline="true" class="demo-form-inline">
				<el-form-item label="分类">
					<el-select clearable v-model="params.classifyid" placeholder="请选择分类">
						<el-option v-for="option in classifies" :key="option.id" :label="option.name" :value="option.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="活动日期">
					<el-date-picker @change="changeDate" clearable size="mini" class="selectWidth" :editable="false" type="datetimerange" v-model="dateArray" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="params.activityName" maxlength=30  placeholder="请输入名称搜索"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button size="mini" type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="main-body">
				<el-table :loading="loading" :data="data" stripe size="mini" style="width: 100%">
          <el-table-column prop="activityName" label="名称" width="240" show-overflow-tooltip></el-table-column>
          <el-table-column prop="classifyName" label="分类" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="activityLimitType" label="限定类型"  show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="organizationName" label="主办方"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="administrator" label="管理员"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="hours" label="学时" ></el-table-column>
          <el-table-column prop="firstAuditor" label="初审人"></el-table-column>
          <el-table-column prop="lastAuditor" label="终审人"></el-table-column>
          <el-table-column  label="操作" width="160">
            <div slot-scope="scope">
              <!-- 可转载站点功能未完成 -->
              <el-button type="text" class="opreat-btn" @click.native="routerLink('/communist/activity/detail','view',scope.row.activityId)">详情</el-button>
              <el-button type="text" class="opreat-btn" @click.native="refuseAcitivity(scope.row.activityId)" v-perms="'/ideology/party/activity/grant/refuse'">拒绝</el-button>
              <el-button type="text" class="opreat-btn" @click.native="reJectAcitivity(scope.row.activityId)" v-perms="'/ideology/party/activity/grant/reject'">驳回</el-button>
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
      dialogVisibleRefuse: false,
      loading: false,
			params: {
        type:3,
				current: 0,
				classifyId:'',
				size: 10,
				ctime:'',
				activityName: ''
			},
			dateArray:[],
			dialogVisible:false,
			dialogVisibleAdopt:false,
			data: [],
			tags: [],
			ruleFormRefuse: {
                id: '',
                method:"refuse",
                remark: ''
            },
            ruleFormReject: {
                id: '',
                method:"reject",
                remark: ''
            },
			classifies: [{id: '', name: '全部'}],
			total: 0,
			options: [{id: '', name: '不限'}]
    }
  },
	methods:{
        //拒绝完结报告
        refuseAcitivity(id){
               this.dialogVisibleRefuse = true
               this.ruleFormRefuse.id = id;
        },
        submitFormRefuse() {
            if (this.ruleFormRefuse.remark) {
                this.$http.post('/activity/grant', this.ruleFormRefuse).then( () => {
                    this.dialogVisibleRefuse = false;
                    this.ruleFormRefuse.remark = '';
                    this.ruleFormRefuse.id = '';
                    this.fetch();
                })
            } else {
                this.$message({
                    type: 'error',
                    message: '请填写原因'
                });
            }
        },
        //驳回
        reJectAcitivity(id){
               this.dialogVisibleAdopt = true;
				this.ruleFormReject.id = id;
        },
        submitFormReject() {
            if (this.ruleFormReject.remark) {
                this.$http.post('/activity/grant',this.ruleFormReject).then( () => {
                    this.dialogVisibleAdopt = false;
                    this.ruleFormReject.remark = '';
                    this.ruleFormReject.id = '';
                    this.fetchData();
                })
            } else {
                this.$message({
                    type: 'error',
                    message: '请填写原因'
                });
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
			this.$http.get('/activity/completeReport/list', {params: this.params}).then(res => {
				this.data = res.data.list
				this.total = res.data.total
				this.loading = false

			})
		},
		adopt(row){
            this.dialogVisible = true;
            this.ruleFormPass.id = row.activityId;
            this.ruleFormPass.tagId = row.tagId;

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

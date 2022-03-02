<template>
	<section>

		<el-dialog title="添加整改方案" :visible.sync="dialogVisibleAdopt" :close-on-click-modal="false" width="800px">
 			 <el-form size="mini" :model="ruleFormReject" ref="ruleFormReject" class="demo-ruleForm">
 					 <el-form-item prop="name">
 							 <el-col :span="22">
 									 <el-input type="textarea"  v-model="ruleFormReject.rectifyContent"></el-input>
 							 </el-col>
 					 </el-form-item>
 					 <el-form-item>
 							 <el-button :disabled="$store.state.sys.isClick" type="primary" @click="submitFormReject()">确定</el-button>
 					 </el-form-item>
 			 </el-form>
 	 </el-dialog>

	 <el-dialog title="备注" :visible.sync="dialogVisibleAdd" :close-on-click-modal="false" width="800px">
			<el-form size="mini" :model="ruleFormAdd" ref="ruleFormAdd" class="demo-ruleForm">
					<el-form-item prop="name">
							<el-col :span="22">
									<el-input maxlength="200" type="textarea"  v-model="ruleFormAdd.remark"></el-input>
							</el-col>
					</el-form-item>
					<el-form-item>
							<el-button type="primary" @click="submitFormAdd()">确定</el-button>
					</el-form-item>
			</el-form>
	</el-dialog>

		<back></back>
		<div class="main-header">
			<span class="main-title">详情</span>
		</div>
		<div class="main-body">
			<div class="detail" style="font-size:14px;line-height:30px;color:#666">
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td align="left" valign="top" width="120" rowspan="5">
							<img style="width:100px;height:100px;" class="detail-avatar" :src="detail.logo"/>
						</td>
						<td align="left"  valign="middle">
						 <span style="font-size:16px;font-weight:bold;color:#333">
                {{detail.theme}}
             </span>
						</td>
						<td align="right" valign="top" >
						  {{ detail.status == 1 ? '未开始' : (detail.status == 2 ? '进行中' : '已结束') }}
						</td>
					</tr>
					<tr>
						<td>
							会议时间: {{detail.startTime | formatDate}}
						</td>
						<td  align="center" >
							 <p>参与人员</p>
							 <p><b> {{detail.joinUsersCount}} </b></p>
						</td>
						<td  align="center" v-if="detail.isEntry == 1">
							 <p>确认参加</p>
							 <p><b> {{detail.confirmJoinCount}} </b></p>
						</td>
					</tr>
					<tr>
            <td colspan="3">
							会议地点: {{detail.address}}
						</td>
					</tr>
					<tr>
            <td colspan="3">
							会议内容: {{detail.content}}
						</td>
					</tr>
					<!--<tr>
            		<td colspan="3">
							整改内容	: {{detail.rectifyContent}}
						</td>
					</tr>
					<tr>-->
	        			<td  colspan="3" style="padding-top:10px;">
							<span v-if="!detail.rectifyContent && detail.status != 1"><el-button size="mini"  type="primary" @click="openModify">新增整改方案</el-button></span>
						  	<span v-else><span v-if="detail.status != 1">整改内容：{{detail.rectifyContent}}</span></span>


						</td>
					</tr>
				</table>
			</div>

			<div style="padding-top:40px;">
				<el-form size="mini" :inline="true" class="demo-form-inline">

					<el-form-item label="">
						<el-input v-if="$route.query.nature == 1" maxlength=30  v-model="params.keyword" placeholder="请输入姓名/党组织搜索"></el-input>
						<el-input v-else v-model="params.keyword" maxlength=30  placeholder="请输入姓名/团组织搜索"></el-input>

					</el-form-item>
					<el-form-item>
						<el-button size="mini" type="primary" @click.native="search()">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div>
				<el-table :loading="loading" :data="members" stripe size="mini" style="width: 100%">

					<el-table-column prop="name" label="姓名"></el-table-column>
					<el-table-column prop="code" label="学号"></el-table-column>
					<el-table-column prop="organizationName" label="组织名称"></el-table-column>
					<el-table-column prop="phone" label="手机号"></el-table-column>
					<el-table-column v-if="detail.isEntry == 1" prop="isConfirm" label="是否确认参加">
						<div slot-scope="scope">
							 {{scope.row.isConfirm == 0 ? '否' : '是'}}
						 </div>
					</el-table-column>
					<el-table-column  label="备注" width="220" align="left">
						<div slot-scope="scope">
							 <span v-if="scope.row.remark">{{scope.row.remark}} 	<el-button @click="editRemark(scope.row.id,scope.row.remark)" type="text">编辑</el-button></span>
							 <span v-else><el-button type="text" @click="editRemark(scope.row.id)">添加</el-button></span>
 						</div>
					</el-table-column>
				</el-table>
				<qu-pagination :total="total" @change="changePage"></qu-pagination>
			</div>




		</div>
	</section>
</template>

<script>
	import listMixins from '@/mixins/form';
	import va from '@/rules'
  export default {
		mixins:[listMixins],
    data() {
      return {
				dialogVisibleAdd:false,
				params: {
					id:'',
					current: 1,
					size: 10,
					isConfirm:'',
					keyword: '',
				},
				members:[],
				total: 0,
				dialogVisibleAdopt:false,
				ruleFormReject: {
	                id: '',
	                rectifyContent: ''
	      },
				ruleFormAdd:{
					id: '',
					userId: '',
					remark: ''
				},
				attachShow:{},
        detail: {},
      }
    },
    methods: {
			openModify(){
				this.dialogVisibleAdopt = true;
			},
			submitFormReject() {
						if (this.ruleFormReject.rectifyContent) {
							  this.$store.commit('setClick',true)
								this.$http.post('/ideology/meeting/programme',this.ruleFormReject).then( () => {
										this.dialogVisibleAdopt = false;
										this.ruleFormReject.rectifyContent = '';
										this.getDataInfo(this.id)
										this.$message({
											type: 'success',
											message: '操作成功!'
										});
								})
						} else {
								this.$message({
										type: 'error',
										message: '请填写内容'
								});
						}

				},
				editRemark(id,remark){
          this.ruleFormAdd.id = this.id
          this.ruleFormAdd.userId = id
          this.ruleFormAdd.remark = remark
					this.dialogVisibleAdd = true;
				},
				submitFormAdd(){
					if (this.ruleFormAdd.remark) {
							this.$http.post('/ideology/meeting/members/remark',this.ruleFormAdd).then( () => {
									this.dialogVisibleAdd = false;
									this.ruleFormAdd.remark = '';
									this.getMembers()
									this.$message({
										type: 'success',
										message: '操作成功!'
									});
							})
					} else {
							this.$message({
									type: 'error',
									message: '请填写内容'
							});
					}
				},
				changePage(current, size){
					this.params.current = current
					this.params.size = size
					this.getMembers()
				},
				search(){
					this.params.current = 1
					this.getMembers();
				},
				getMembers() {

					this.$http.get('/ideology/meeting/members', {params: this.params}).then(res => {

						this.members = res.data.list
						this.total = res.data.total
					})
				},
			getDataInfo(id){
				if (id == 0) {
					this.loading = false;
					return;
				}
				this.$http.get('/ideology/meeting/details', {params: {
					id:id,
				}}).then(res => {
					 this.detail = res.data
				 	this.loading = true;
				}).catch(err => {
					this.loading = false;
				});
			},
    },
  	created() {
  	 this.getDataInfo(this.id)
		 this.ruleFormReject.id = this.id
		 this.params.id = this.id
		 this.getMembers()
  	},
  	mounted(){

  	}
  }
</script>

<style scoped lang="scss">
  .poartyInforMain{
		width:100%;
		max-height:300px;
		overflow:auto;
		&-title{
			width:100%;
			overflow:hidden;
			line-height:26px;
			padding-top:20px;
			&-left{
				float:left;
				width:40px;
			}
			&-right{
				margin-left:50px;
			}
		}
	}
	.partyShowStep{
		 padding-top:20px;
    .partyShowStep-left{
			float:left;
			width:25px;
			height:25px;
			line-height:25px;
			text-align:center;
			color:#333;
			border:1px solid #666;
			border-radius:30px;
			font-size:12px;
			margin-top:8px;
		}
		.partyShowStep-right{
			margin-left:40px;
      font-size:14px;
			line-height:30px;
			color:#333;

		}
	}

	.detail {
		padding: 10px 20px;
	}
	.detail-avatar {
		width: 100px;
		width: 100px;
		border-radius: 50px;
	}
</style>

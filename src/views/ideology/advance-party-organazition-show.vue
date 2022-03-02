<template>
	<section>

		<el-dialog title="驳回" :visible.sync="dialogVisibleAdopt" :close-on-click-modal="false" width="30%">
				<el-form size="mini" :model="ruleFormReject" ref="ruleFormReject" class="demo-ruleForm">
						<el-form-item prop="name">
								<el-col :span="22">
										<el-input maxlength='200' type="textarea" placeholder="请输入驳回理由(200字以内)" v-model="ruleFormReject.remark"></el-input>
								</el-col>
						</el-form-item>
						<el-form-item>
								<el-button type="primary" @click="submitFormReject()">确定</el-button>
						</el-form-item>
				</el-form>
		</el-dialog>


		<el-dialog title="作品查看" :visible.sync="dialogVisiblesee" :close-on-click-modal="false" width="750px">
			<div class="poartyInforMain">
				<!-- <div class="poartyInforMain-title">
					 <span class="poartyInforMain-title-left">
							标题
					 </span>
					 <div class="poartyInforMain-title-right">
								 {{attachShow.applyTitle}}
					 </div>
				</div> -->
				<div class="poartyInforMain-title">
					 <span class="poartyInforMain-title-left">
							内容
					 </span>
					 <div class="poartyInforMain-title-right">
								 {{attachShow.productionDesc}}
					 </div>
				</div>
				<div class="poartyInforMain-title">
					 <span class="poartyInforMain-title-left">
							附件
					 </span>
					 <div class="poartyInforMain-title-right">
						 <span v-for="item2 in attachShow.productionList">
								<img style="width:100px;height:100px;float:left;margin-right:15px;" :src="item2.url">
						 </span>
					 </div>
				</div>
			</div>
		</el-dialog>

		<back></back>
		<div class="main-header">
			<span class="main-title">详情</span>
		</div>
		<div class="main-body">
			<div class="detail" style="font-size:14px;line-height:30px;color:#666">
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td align="left"  valign="middle">
						 <span style="font-size:16px;font-weight:bold;color:#333">
                {{detail.theme}}
             </span>
						</td>
						<td align="right" valign="top" >
						 {{detail.status == 1 ? '征集中' :  (detail.status == 2 ? '征集结束' : (detail.status == 3 ? '投票中' : '投票结束') ) }}
						</td>
					</tr>
					<tr>
						<td colspan="2">
							报名结束时间: {{detail.applyEndTime | formatDate}}
						</td>
					</tr>
					<tr>
            <td  colspan="2">
							<span v-if="$route.query.nature == 1">参与党组织:</span>
							<span v-if="$route.query.nature == 2">参与党组织:</span>
							<span v-if="$route.query.nature == 3">参与团组织:</span>
							<span v-if="$route.query.nature == 4">参与团组织:</span>

							<span v-if="detail.joinPartyOrganizationList.length">
                 <span v-for="item in detail.joinPartyOrganizationList">
                    {{item.name}} /
								 </span>
							</span>
							<span v-else>不限</span>
						</td>
					</tr>
					<tr>
						<td colspan="2">
							投票时间: {{detail.voteStartTime | formatDate}} - {{detail.voteEndTime | formatDate}}
						</td>
					</tr>
					<tr>
            <td  colspan="2">
							投票参与院系:
							<span v-if="detail.voteJoinCollegeList.length">
                 <span v-for="item in detail.voteJoinCollegeList">
                    {{item.name}} /
								 </span>
							</span>
							<span v-else>不限</span>
						</td>
					</tr>
					<tr>
            <td  colspan="2">
						 征集描述:{{detail.desc}}
						</td>
					</tr>
					<tr>
            <td  colspan="2">
 	 						 <img style="width:100px;height:100px;float:left;margin-right:15px;" :src="detail.logo">
						</td>
					</tr>
				</table>
			</div>


	<el-tabs v-model="active" @tab-click="changeTab" style="padding-top:20px;">
		<el-tab-pane label="材料审核" name="active1">

			<div style="padding-top:10px;">
				<el-form size="mini" :inline="true" class="demo-form-inline">
					<el-form-item label="状态">
						<el-select clearable v-model="params.status" >
							<el-option v-for="option in statuses" :key="option.id" :label="option.name" :value="option.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="">
						<el-input v-model="params.keyword"  maxlength=30 placeholder="请输入关键字搜索"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button size="mini" type="primary" @click.native="search()">查询</el-button>
					</el-form-item>
				</el-form>
			</div>

			<div>
				<el-table  :data="members" stripe size="mini" style="width: 100%">
					<el-table-column prop="userName" label="姓名"></el-table-column>
					<el-table-column prop="organizationName" :label="'所属' + titleName2 + '组织'"></el-table-column>
					<el-table-column prop="ctime" label="提交时间">
					 	 <div slot-scope="scope">
							 {{scope.row.ctime | formatDate}}
						 </div>
					</el-table-column>
					<el-table-column prop="phone" label="作品">
						<div slot-scope="scope">
							<el-button  @click="openMore(scope.row)" type="text" class="opreat-btn">查看</el-button>
						</div>
					</el-table-column>
					<el-table-column prop="isConfirm" label="状态">
						<div slot-scope="scope">
							 {{scope.row.status == 1 ? '待审核' :  (scope.row.status == 2 ? '已通过' : (scope.row.status == 3 ? '已驳回' : (scope.row.status == 0 ? '撤销' : '其他') ) )  }}
						 </div>
					</el-table-column>
					<el-table-column  label="操作" width="220" align="left">
						<div slot-scope="scope">
							<el-button @click="opreatBtn(scope.row.id,2)" v-if="scope.row.status == 1" type="text" class="opreat-btn">通过</el-button>
							<el-button @click="opreatBtn(scope.row.id,3)" v-if="scope.row.status == 1" type="text" class="opreat-btn">驳回</el-button>
							<span style="color:#999" v-if="scope.row.status == 2" >已通过</span>
							<el-button @click="seeReason(scope.row.rejectReason)" v-if="scope.row.status == 3" type="text" class="opreat-btn">查看驳回理由</el-button>
 						</div>
					</el-table-column>
				</el-table>
				<qu-pagination :total="total" @change="changePage"></qu-pagination>
			</div>
		</el-tab-pane>
		<el-tab-pane label="投票" name="active2">
			<div>
				<el-table  :data="voteList" stripe size="mini" style="width: 100%">
					<el-table-column type="index"></el-table-column>
					<el-table-column prop="organizationName" :label="titleName2 + '组织名称'"></el-table-column>
					<el-table-column prop="userName" label="作品">
						<div slot-scope="scope">
							<el-button  @click="openMore(scope.row)" type="text" class="opreat-btn">查看</el-button>
						</div>
					</el-table-column>
					<el-table-column prop="voteCount" label="票数"></el-table-column>
				</el-table>
				<qu-pagination :total="total2" @change="changePage2"></qu-pagination>
			</div>
		</el-tab-pane>
	</el-tabs>



		</div>
	</section>
</template>

<script>
  import {getOssToken,getAliyunImageUrl} from "@/utils/filters"
	import listMixins from '@/mixins/form';
	import va from '@/rules'
  export default {
		mixins:[listMixins],
    data() {
      return {
				titleName2:(this.$route.query.nature == 1 || this.$route.query.nature == 2 ) ? '党' : '团',
				ruleFormReject: {
              id: '',
							advancdeId:'',
              handleType: 3,
              remark: ''
	      },
				active:'active1',
				dialogVisibleAdopt:false,
				voteList:[],
				attachShow:{},
				statuses:[
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
						name:'已通过'
					},
					{
						id:3,
						name:'已驳回'
					}
				],
				dialogVisiblesee:false,
				dialogVisibleAdd:false,
				params: {
					id:'',
					current: 1,
					size: 10,
					status:'',
					keyword: '',
				},
				params2: {
					id:'',
					current: 1,
					size: 10,
				},
				members:[],
				total: 0,
				total2: 0,
				attachShow:{},
        detail: {
					joinPartyOrganizationList:[],
					voteJoinCollegeList:[]
				},
      }
    },
    methods: {
			seeReason(reason){

				this.$alert(reason, '标题', {
				 confirmButtonText: '确定'
			 });

			},

			//驳回
			submitFormReject() {
            if (this.ruleFormReject.remark) {
                this.$http.post('ideology/advanced/attachment/auditing',this.ruleFormReject).then( (res) => {
									if (res.code == '200') {
										this.dialogVisibleAdopt = false;
										this.ruleFormReject.remark = '';
										this.getMembers();
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
			opreatBtn(id,status){
				if (status == 2) {
					//通过

					this.$confirm('确定通过该审核吗?', '提示', {
										confirmButtonText: '确定',
										cancelButtonText: '取消',
										type: 'warning'
								}).then(() => {
						this.$http.post('ideology/advanced/attachment/auditing', {
							id:id,
							advancdeId:this.id,
							handleType:2
						}).then(res => {
								if(res.code == '200'){
											this.$message({
												type: 'success',
												message: '通过成功!'
											 });
										this.getMembers()
									}

							})
					})

				}else if (status == 3) {
					//驳回
					this.dialogVisibleAdopt = true;
					this.ruleFormReject.id = id;
				}
			},
			openMore(item){

	      this.dialogVisiblesee = true
	      this.attachShow = item
	    },
				changeTab(tab) {
					this.active = tab.name
					if (this.active == 'active2') {
             this.getvotes()
					}
				},

				editRemark(id,remark){
          this.ruleFormAdd.id = this.id
          this.ruleFormAdd.userId = id
          this.ruleFormAdd.remark = remark
					this.dialogVisibleAdd = true;
				},
				changePage(current, size){
					this.params.current = current
					this.params.size = size
					this.getMembers()
				},
				changePage2(current, size){
					this.params.current = current
					this.params.size = size
					this.getMembers()
				},
				search() {
					this.params.current = 1
					this.getMembers()
				},
				getMembers() {
					this.$http.get('/ideology/advanced/attachment/list', {params: this.params}).then(res => {
						this.members = res.data.list
						this.total = res.data.total
					})
				},
				getvotes() {
					this.$http.post('/ideology/advanced/vote/list', this.params2).then(res => {
						this.voteList = res.data.list
						this.total2 = res.data.total
					})
				},
			getDataInfo(id){
				if (id == 0) {
					this.loading = false;
					return;
				}
				this.$http.get('/ideology/advanced/details', {params: {
					id:id,
				}}).then(res => {
					res.data.logo = getAliyunImageUrl(res.data.logo ,100,100)
					this.detail = res.data
				 	this.loading = true;
				}).catch(err => {
					this.loading = false;
				});
			},
    },
  	created() {
  	 this.getDataInfo(this.id)
		 this.ruleFormReject.advancdeId = this.id
		 this.params.id = this.id
		 this.params2.id = this.id
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

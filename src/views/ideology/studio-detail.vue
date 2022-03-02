<template>
	<section>

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

		<el-dialog title="驳回" :visible.sync="dialogVisibleAdopt" :close-on-click-modal="false" width="30%">
        <el-form size="mini" :model="ruleFormReject" ref="ruleFormReject" class="demo-ruleForm">
            <el-form-item prop="name">
                <el-col :span="22">
                    <el-input  type="textarea" placeholder="请输入驳回理由(200字以内)" maxlength='200' v-model="ruleFormReject.remark"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitFormReject()">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

		<back></back>
		<div class="main-header">
			<span class="main-title">活动征集</span>
		</div>
		<div class="main-body">
			<div class="detail">
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td style="padding-bottom:15px;" align="left" valign="top" width="120" rowspan="4" >
							<img style="width:100px;height:100px;" class="detail-avatar" :src="detail.logo"/>
						</td>
						<td style="padding-bottom:15px;" align="left" colspan="4" valign="middle">
						 <span style="font-size:16px;font-weight:bold;">
							  {{detail.theme}}
						 </span>
						</td>
						<td style="padding-bottom:15px;" align="right"  valign="middle">
							{{detail.status == 1 ? '征集中' : (detail.status == 2 ? "公示中" : "公示结束")}}
						</td>
					</tr>
					<tr>
						<td>
							创建人: {{detail.createUserName}}
						</td>
						<td>
							<p>报名截止时间: {{detail.applyEndTime | formatDate	}}</p>
						</td>
						<td align='center'>
							<p><b>{{detail.waitAuditCount}}</b></p>
							<p>待审核</p>
						</td>
						<td align='center'>
							<p><b>{{detail.passCount}}</b></p>
							<p>已通过</p>
						</td>
						<td align='center'>
							<p><b>{{detail.rejectCount}}</b></p>
							<p>已驳回</p>
						</td>
					</tr>
					<tr>
						<td>
							创建时间: {{detail.ctime | formatDate}}
						</td>
						<td colspan="4">
							公示结束时间: {{detail.endTime | formatDate}}
						</td>
					</tr>
					<tr>
						<td colspan="5" style="padding-top:10px;">
							征集描述: {{detail.desc}}
						</td>
					</tr>
				</table>
			</div>

					<div style="padding-top:40px;">
						<el-form size="mini" :inline="true" class="demo-form-inline">
							<el-form-item label="日期">
								<el-date-picker clearable size="mini" class="selectWidth" :editable="false" type="daterange" v-model="dateArray" @change='change' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="状态">
								<el-select v-model="params.status">
									<el-option v-for="item in statuses" :key="item.id" :label="item.name" :value="item.id"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="">
								<el-input v-model="params.keyword" maxlength=30  placeholder="请输入姓名/学号搜索"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button size="mini" type="primary" @click.native="search()">查询</el-button>
							</el-form-item>
						</el-form>
					</div>
					<div>
						<el-table :loading="loading" :data="members" stripe size="mini" style="width: 100%">

							<el-table-column prop="userName" label="提交人"></el-table-column>
							<el-table-column prop="userCode" label="学号"></el-table-column>
							<el-table-column prop="applyTime" label="提交时间">
               <div slot-scope="scope">
                {{scope.row.applyTime | formatDate}}
							 </div>
							</el-table-column>
							<el-table-column  label="作品">
								<div slot-scope="scope">
									<el-button  @click="openMore(scope.row)" type="text" class="opreat-btn">查看</el-button>
								</div>
							</el-table-column>
							<el-table-column  label="操作" width="220" align="center">
								<div slot-scope="scope">
									<span v-perms="'/ideology/studio/operation'">
								  	<el-button @click="opreatBtn(scope.row.id,2)" v-if="scope.row.status == 1" type="text" class="opreat-btn">通过</el-button>
									  <el-button @click="opreatBtn(scope.row.id,3)" v-if="scope.row.status == 1" type="text" class="opreat-btn">驳回</el-button>
							  	</span>
									<span style="color:#999" v-if="scope.row.status == 2" >已通过</span>
									<el-button @click="seeReason(scope.row.rejectReason)" v-if="scope.row.status == 3" type="text" class="opreat-btn">查看驳回理由</el-button>
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
				ruleFormReject: {
              id: '',
              handleType: 3,
              remark: ''
	      },
				dialogVisiblesee:false,
				dialogVisibleAdopt:false,
        detail: {},
				members:[],
				dateArray:[],
				statuses:[
					{
	          id: '',
	          name: '不限'
	        },
					{
	          id: 1,
	          name: '待审核'
	        },
	        {
	          id: 2,
	          name: '已通过'
	        },
	        {
	          id: 3,
	          name: '已驳回'
	        }
				],
				params: {
					current: 1,
					size: 10,
					startTime:"",
					endTime:"",
					keyword: '',
					status: ''
				},
				attachShow:{},
				total: 0
      }
    },
    methods: {
			openMore(item){
	      this.dialogVisiblesee = true
	      this.attachShow = item
	    },
			seeReason(reason){

				this.$alert(reason, '标题', {
				 confirmButtonText: '确定'
			 });

			},
			//驳回
			submitFormReject() {
            if (this.ruleFormReject.remark) {
                this.$http.post('ideology/studio/audit',this.ruleFormReject).then( (res) => {
									if (res.code == '200') {
										this.dialogVisibleAdopt = false;
										this.ruleFormReject.remark = '';
										this.getMembers();
										this.getDataInfo(this.id)
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
						this.$http.post('ideology/studio/audit', {
							id:id,
							handleType:2
						}).then(res => {
						  	if(res.code == '200'){
		                	this.$message({
												type: 'success',
												message: '通过成功!'
						           });
						      	this.getMembers()
										this.getDataInfo(this.id)
						    	}

							})
					})

			  }else if (status == 3) {
			  	//驳回
					this.dialogVisibleAdopt = true;
					this.ruleFormReject.id = id;
			  }
			},
			change(value) {
				if (this.dateArray && this.dateArray.length) {
					this.params.startTime = this.dateArray[0].getTime();
					this.params.endTime = this.dateArray[1].getTime();
				} else {
					this.dateArray = []
					this.params.startTime = ""
					this.params.endTime = ""
				}
			},
			getDataInfo(id){
				if (id == 0) {
					this.loading = false;
					return;
				}
				this.$http.get('/ideology/studio/detail', {params: {
					id:id,
				}}).then(res => {
					this.detail = res.data
					this.loading = true;
					this.params.nature = res.data.nature
					this.getMembers()
				}).catch(err => {
					this.loading = false;
				});
			},
			changeTab(tab) {
				this.active = tab.name
				this.search()
			},
			changePage(current, size){

				this.params.current = current
				this.params.size = size
				this.getMembers()
			},
			getMembers() {
				this.$http.post('ideology/studio/enroll/list',  this.params).then(res => {
					this.members = res.data.list
					this.total = res.data.total
				})
			},
			search() {
          this.params.current = 1
					this.getMembers()
			}
    },
	created() {
	 this.params.id = this.id
	 this.getDataInfo(this.id)
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
	.detail {
		padding: 10px 20px;
	}
	.detail-avatar {
		width: 100px;
		width: 100px;
		border-radius: 50px;
	}
</style>

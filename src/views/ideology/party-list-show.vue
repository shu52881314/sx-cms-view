<template>
	<section>

		<el-dialog title="申请信息" :visible.sync="dialogVisible" :close-on-click-modal="false" width="750px">
			<div class="poartyInforMain">
				<div class="poartyInforMain-title">
					 <span class="poartyInforMain-title-left">
							标题
					 </span>
					 <div class="poartyInforMain-title-right">
								 {{attachShow.applyTitle}}
					 </div>
				</div>
				<div class="poartyInforMain-title">
					 <span class="poartyInforMain-title-left">
							内容
					 </span>
					 <div class="poartyInforMain-title-right">
								 {{attachShow.applyContent}}
					 </div>
				</div>
				<div class="poartyInforMain-title">
					 <span class="poartyInforMain-title-left">
							附件
					 </span>
					 <div class="poartyInforMain-title-right">
						 <span v-for="item2 in attachShow.attachList">
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
			<div class="detail">
				<table width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td align="left" width="120" rowspan="3" >
							<img style="width:100px;height:100px;" class="detail-avatar" :src="detail.avatar"/>
						</td>
						<td align="left" colspan="2" valign="middle">
						 <span style="font-size:16px;font-weight:bold;">
                {{detail.name}} &#12288; <span style="font-size:14px;color:#666;font-weight:normal;"> {{detail.sex == 1 ? '男' : '女'}} </span>
             </span>
						</td>
					</tr>
					<tr>
						<td>
							学号: {{detail.code}}
						</td>
						<td colspan="2">
							<p>身份: {{detail.identity == 3 ? '党员' :(detail.identity == 3 ? '入党积极分子' : (detail.identity == 4 ? '发展对象' : (detail.identity == 5 ? '预备党员' : (detail.identity == 6 ? '党员' : '团员') ) ) )}}</p>
						</td>
					</tr>
					<tr>
            <td>
							归属组织: {{detail.organizationName}}
						</td>
            <!-- <td>
							联系方式: {{detail.contact}}
						</td> -->
            <td>
							入{{titleName}}日期: {{detail.joinDate | formatDate}}
						</td>
					</tr>
				</table>
			</div>


		<div v-if="detail.convertList.length">
				<div class="partyShowStep" v-for="(item,index) in detail.convertList">
	         <span class="partyShowStep-left fl">
	            0{{index + 1}}
					 </span>
					 <div class="partyShowStep-right">
	           <p>{{item.identity == 2 ? '团员':(item.identity == 3 ? '入党积极分子' : (item.identity == 4 ? '发展对象' : (item.identity == 5 ? '预备党员' : '党员') ) )}}
							 日期：{{item.time | formatDate}}</p>
	           <p>意见：{{item.opinion}}</p>
	           <p>文件：
							 <span v-for="item2 in item.attachList">
	                {{item2.name}} &#12288;
							 </span>
							 <span @click="openMore(item)" style="color:#00AEFF;line-height:25px;cursor:pointer">更多内容</span></p>
					 </div>
				</div>
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
				titleName:this.$route.query.nature == 0 ? '党' : '团',
				dialogVisible:false,
				attachShow:{},
        detail: {
        	convertList:[]
        },
      }
    },
    methods: {
			openMore(item){
        this.dialogVisible = true
				this.attachShow = item
			},
			getDataInfo(id){
				if (id == 0) {
					this.loading = false;
					return;
				}
				this.$http.get('/ideology/party/member/details', {params: {
					id:id,
					// nature:this.$route.query.nature
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

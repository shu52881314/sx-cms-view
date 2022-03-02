<template>
	<section>


		<back :page="$route.query.nature"  :goRouter="$route.query.router"></back>
		<div class="main-header">
			<span class="main-title">活动详情</span>
		</div>


		<el-dialog title="查看团队" :visible.sync="show.teamUserShow" :close-on-click-modal="false" width="800px">
	        <div style="text-align: center;">
	        	<p v-if='teamUser.avatar'><img style="border-radius: 50%;width:100px;height: 100px;" :src="teamUser.avatar" /></p>
	        	<p style="padding: 10px;">{{teamUser.name}}</p>
	        </div>
	        <div>
	        	<el-table :data="teamUser.list" stripe size="mini" style="width: 100%">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
	          		<el-table-column prop="name" label="姓名" width="240" show-overflow-tooltip></el-table-column>
	          		<el-table-column prop="code" label="学号" show-overflow-tooltip></el-table-column>
	          		<el-table-column prop="mobile" label="联系方式"  show-overflow-tooltip></el-table-column>
	          		<el-table-column label="身份">
	          			<div slot-scope="scope">
	          				{{scope.row.identity==1?'队长':'队员'}}
	          			</div>
	          		</el-table-column>
	        	</el-table>
	        </div>
	    </el-dialog>

		<el-dialog title="拒绝完结报告" :visible.sync="show.dialogVisibleRefuse" :close-on-click-modal="false" width="30%">
			<p style="padding-bottom:10px ;">拒绝后活动成员将无法获得{{hoursUnit}}</p>
            <el-form size="mini" :model="ruleFormRefuse" ref="ruleFormRefuse" class="demo-ruleForm">
                <el-form-item prop="name">
                <el-col :span="22">
                    <el-input type="textarea" placeholder="请输入拒绝理由" v-model="ruleFormRefuse.remark"></el-input>
                </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitFormRefuse()" :disabled="$store.state.sys.isClick">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="驳回完结报告" :visible.sync="show.dialogVisibleAdopt" :close-on-click-modal="false" width="30%">
			<p style="padding-bottom:10px ;">驳回后管理员可修改完结报告继续提交</p>
            <el-form size="mini" :model="ruleFormReject" ref="ruleFormReject" class="demo-ruleForm">
                <el-form-item prop="name">
                <el-col :span="22">
                    <el-input type="textarea" placeholder="请输入驳回理由" v-model="ruleFormReject.remark"></el-input>
                </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitFormReject()" :disabled="$store.state.sys.isClick">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
		<el-dialog :title="'批量修改'+hoursUnit" :visible.sync="show.modification" :close-on-click-modal="false" width="500px">
	        <el-form size="mini" label-width="60px" class="demo-ruleForm">
	          <el-form-item   prop="hours" :label="hoursUnit">
	              <el-col :span="22">
	                  <el-input :placeholder="'请输入修改后的' + hoursUnit" v-model="hours"></el-input>
	              </el-col>
	          </el-form-item>
	            <el-form-item>
	                <el-button type="primary" @click="submitModification(hours, '', '')">确定</el-button>
	            </el-form-item>
	        </el-form>
	    </el-dialog>

		<el-dialog title="查看作业" :visible.sync="show.lookHomeWork" width="30%">
            <div style="line-height: 30px;">
            	<p style="font-weight: bold;">作业内容</p>
            	<span>{{homeWorks.summary}}</span>
            	<p style="font-weight: bold;" v-if="homeWorks.urls">作业附件</p>
            	<ul class="acitvityUrl">
								<li @click="getBigImage(item.url)" v-for='item in homeWorks.attachment'>
									<span v-if="item.type == 1"><img :src="item.url"></span>
									<span v-if="item.type == 2"><img src="../../assets/images/video@2x.png"></span>
									<span v-if="item.type == 3"><img src="../../assets/images/word@2x.png"></span>
									<span v-if="item.type == 4"><img src="../../assets/images/excel@2x.png"></span>
									<span v-if="item.type == 5"><img src="../../assets/images/pdf@2x.png"></span>
								</li>
				      </ul>
            </div>
    </el-dialog>
        <el-dialog :title="'发放'+hoursUnit" :visible.sync="show.grant" width="30%">
            <div>
            	<div style="border: 1px rgba(255, 0, 0, 0.6) solid;background-color: #FFE6E6;color: rgba(255, 0, 0, 0.6);padding: 5px;">
            		温馨提示：{{hoursUnit}}发放针对所有活动参与人员，且仅发放一次，发放后无法撤回或修改！
            	</div>
            	<div style="line-height: 30px;padding: 20px 0;">
	            	<span>本次活动发放{{hoursUnit}}人数共计{{userCount.userCount}}人，其中对{{userCount.differentCount}}人进行差异化发放{{hoursUnit}}</span>
	            </div>
                    <el-button type="primary" @click="submitGrant()" :disabled="$store.state.sys.isClick">确定</el-button>
            </div>

        </el-dialog>

        <el-dialog title="温馨提示" :visible.sync="show.hint" width="30%">
            <div >
            	<div style="line-height: 30px;padding: 20px 0;text-align: center;">
	            	<i class="el-icon-loading" style="font-size: 20px;"></i>
	            </div>
            </div>
        </el-dialog>

		<div  class="main-body">
			<div class="detail" style="padding: 10px 20px 10px 0px;">
					<table width="100%" cellpadding="0" cellspacing="0">
							<tr>
								<td align="left" width="120" rowspan="3">
									<img style="width:100px;height:100px;" :src="dataInfo.logo"/>
								</td>
								<td align="left" colspan="2">
									<span class="detail-head-title " style="font-size: 20px;font-weight: bold;">{{dataInfo.activityName}}</span>
								</td>
                <td align="left" >
                  <span >限定类型：{{dataInfo.limitType | formatLimitType}}</span>
                </td>
								<td align="right" width="200px">
									<span v-if='dataInfo.status == 2||dataInfo.status == 5 || dataInfo.status == 6 || dataInfo.status == 7 || dataInfo.status >8' class="detail-head-title" style="font-size: 20px;font-weight: bold;">{{dataInfo.hours}}{{hoursUnit}}</span>
									<span >
										<el-button type="primary" size="mini" @click='importAllStudent' v-if='dataInfo.status >= 9'>导出签到记录</el-button>
									</span>
								</td>
							</tr>
							<tr>
								<td align="left">
									<el-tooltip :content="dataInfo.address" placement="bottom">
										<div style="width: 200px;" class="omit">
											<span class="detail-head-title">活动地点:</span>
											<span>{{dataInfo.address}}</span>
										</div>
									</el-tooltip>
								</td>
								<td align="left"  >
									<span class="detail-head-title">主办方:</span>
									<span>{{dataInfo.organizationName}}</span>
								</td>
								<td align="left" >
									<span class="detail-head-title">状态:</span>
									<span>{{formatterStatus(dataInfo.status)}}</span>
								</td>
								<td align="right" width="200px">
									<span>
										<el-button type="text" class="opreat-btn" @click.native="reJectAcitivity()"  v-if="dataInfo.status==9" >驳回完结报告</el-button>
									</span>
								</td>
						</tr>
						<tr>
							<td align="left" >
								<span class="detail-head-title">管理员:</span>
								<span>{{dataInfo.adminName}}</span>
							</td>
							<td align="left" >
								<span class="detail-head-title">联系方式:</span>
								<span>{{dataInfo.contact}}</span>
							</td>
			                <td align="left">
			                    <span class="detail-head-title">活动时间:</span>
								<span>{{dataInfo.startTime | formatDate}}  至  {{dataInfo.endTime | formatDate}}</span>
			                </td>
							<td align="right" width="200px">
								<span >
									<el-button v-if="dataInfo.status==9" type="text" class="opreat-btn" style='color:red' @click.native="refuseAcitivity()" v-perms="'/communist/activity/finish/refuse'">拒绝发放{{hoursUnit}}</el-button>
									<!-- <el-button v-if="dataInfo.status == 1 || dataInfo.status == 2 || dataInfo.status == 5 || dataInfo.status == 6 || dataInfo.status == 7" type="text" size="mini" @click.native="routerLink('launch', 'update', dataInfo.id)">修改</el-button>
									<el-button v-if="dataInfo.status == 1 || dataInfo.status == 3 || dataInfo.status == 2 || dataInfo.status == 4 || dataInfo.status == 5 || dataInfo.status == 6" type="text" size="mini" style="color: #FF0000" @click.native="deleteBatch(dataInfo.id,dataInfo.status,dataInfo.activityName) ">删除</el-button> -->
								</span>
							</td>
						</tr>
					</table>
				</div>
				<div class="detail-body">
						<div class="ctime" style="width: 400px;text-align: right;">创建人: {{dataInfo.creatorName}}&nbsp;&nbsp;创建时间: {{dataInfo.ctime| formatDate}}<span></span></div>
						<el-tabs type="border-card" v-model="activeName">
							<el-tab-pane label="详情" name='详情'>
								<table class="tableClass" width="100%" cellpadding="0" cellspacing="0">
										<tr>
											<td rowspan="7" width="40" class="tableLeftBg">
												<span>
													<p>基</p>
													<p>本</p>
													<p>信</p>
													<p>息</p>
												</span>
											</td>
											<th  width="150"><span>活动限制人数</span></th>
											<td width="35%"><span>{{dataInfo.peopleLimit}} 人</span></td>
                      						<th  width="150"><span>报名人数</span></th>
											<td width="35%" ><span>{{dataInfo.count}}人</span></td>
										</tr>
										<tr>
											<th><span>报名截止时间</span></th>
											<td><span>{{dataInfo.enrollEndTime  | formatDate}}</span></td>
											<th><span>活动分类</span></th>
											<td><span>{{dataInfo.classifyName}}</span></td>
										</tr>
										<tr>
											<th><span>参与院系</span></th>
											<td><span>{{dataInfo.collegeLimit==0?'不限':dataInfo.collegeLimitName}}</span></td>
											<th><span>参与年级</span></th>
											<td><span>{{ dataInfo.gradeLimit == '0' ? "不限" : dataInfo.gradeLimit}}</span></td>
										</tr>
										<tr>
											<th><span>参与性别</span></th>
											<td><span>{{dataInfo.genderLimit==0?'不限':dataInfo.genderLimit==0?'男':'女'}}</span></td>
											<th><span>参与组织</span></th>
											<td><span>{{dataInfo.organizationLimitName == '0' ? '不限' : dataInfo.organizationLimitName}}</span></td>
										</tr>
										<tr>
											<th><span>报名是否审核</span></th>
											<td><span>{{dataInfo.signAudit==0 ? '否' : '是'}}</span></td>
											<th><span>报名是否开启投票</span></th>
											<td><span>{{dataInfo.isVote==0 ? '否' : '是'}}</span></td>
										</tr>
										<tr>
											<th><span>活动简介</span></th>
											<td colspan="3"><span>{{dataInfo.introduce}}</span></td>
										</tr>
									</table>
									<!-- <table class="tableClass" width="100%" cellpadding="0" cellspacing="0" v-if="dataInfo.status != 1"> -->
									<table class="tableClass" width="100%" cellpadding="0" cellspacing="0" v-if="dataInfo.flowExampleAuditRecordList && dataInfo.flowExampleAuditRecordList.length">
										<tr>
											<th width="40" class="tableLeftBg3">
												<span>
													审核人
												</span>
											</th>
											<td colspan="3">
                           <table width="100%" cellpadding="0" cesllspacing="0">
														 <tr v-for="item in dataInfo.flowExampleAuditRecordList">
															 <!-- <th><span>审核人</span></th>
															 <td><span>{{item.auditorName}}</span></td>
															 <th><span>审核时间</span></th> -->
															 <!-- <td><span>{{item.auditTime  | formatDate}}</span></td> -->
                               <!-- <td><span v-if="item.auditTime">{{item.auditTime  | formatDate}}</span></td>
															 <th><span>审核状态</span></th> -->
															 <!-- <td><span>{{item.auditStatus == 1 ? "通过" : "驳回"}}</span></td> -->
                               <!-- <td><span>{{item.auditStatus == 1 ? "通过" :(item.auditStatus == 2? "驳回":'未审核')}}</span></td>
															 <th><span>审核信息</span></th>
															 <td v-if="item.auditStatus == 1"><span>设置学时为{{item.auditRemark}}</span></td>
															 <td v-if="item.auditStatus == 2"><span>{{item.auditRemark}}</span></td>
                               <td v-else><span>&nbsp;&nbsp;</span></td> -->

                               <th width="80"><span>审核人</span></th>
                               <td width="200"><span>{{item.auditorName}}</span></td>
                               <th width="95"><span>审核时间</span></th>
                               <td width="145"><span v-if="item.auditTime">{{item.auditTime  | formatDate}}</span></td>
                               <th width="95"><span>审核状态</span></th>
                               <td width="80"><span>{{item.auditStatus == 1 ? "通过" :(item.auditStatus == 2? "驳回":'未审核')}}</span></td>
                               <th width="95"><span>审核信息</span></th>
                               <td  v-if="item.auditStatus == 1">
                                 <span>设置学时为{{item.auditRemark}}</span>
                               </td>
                               <td  v-else-if="item.auditStatus == 2"><span>{{item.auditRemark!=''?item.auditRemark:'驳回'}}</span></td>
                               <td v-else><span>&nbsp;&nbsp;</span></td>

														 </tr>
													 </table>
											</td>
										</tr>
									</table>
									<!-- <table class="tableClass" width="100%" cellpadding="0" cellspacing="0" v-if="dataInfo.status != 1 && dataInfo.status != 2 && dataInfo.status != 3 "> -->
									<!-- <table class="tableClass" width="100%" cellpadding="0" cellspacing="0" >
										<tr>
											<td rowspan="3" width="40" class="tableLeftBg4">
												<span>
													<p>终</p>
													<p>审</p>
												</span>
											</td>
											<th  width="150"><span>终审人</span></th>
											<td  width="35%"><span>{{dataInfo.lastAuditorName}}</span></td>
											<th  width="150"><span>终审时间</span></th>
											<td  width="35%"><span>{{dataInfo.lastAuditTime}}</span></td>
										</tr>
										<tr v-if="dataInfo.auditRemark">
											<th><span>驳回理由</span></th>
											<td colspan="3"><span>{{dataInfo.auditRemark}}</span></td>
										</tr>
									</table> -->
									<table class="tableClass" width="100%" cellpadding="0" cellspacing="0" v-if='dataInfo.activityAttachment && dataInfo.activityAttachment.length'>
										<tr>
											<td rowspan="3" width="40" class="tableLeftBg5">
												<span>
													<p>附</p>
													<p>件</p>
												</span>
											</td>
											<td>
												<ul class="acitvityUrl">
													<li @click="getBigImage(item.url)" v-for='item in dataInfo.activityAttachment'>
														<span v-if="item.type == 1"><img :src="item.url"></span>
														<span v-if="item.type == 2"><img src="../../assets/images/video@2x.png"></span>
														<span v-if="item.type == 3"><img src="../../assets/images/word@2x.png"></span>
														<span v-if="item.type == 4"><img src="../../assets/images/excel@2x.png"></span>
														<span v-if="item.type == 5"><img src="../../assets/images/pdf@2x.png"></span>
													</li>
												</ul>
											</td>
										</tr>
									</table>
							</el-tab-pane>
							<el-tab-pane label="报名列表" name='报名列表' v-if="isformatterStatus(dataInfo.status) || (dataInfo.status == 5)  || (dataInfo.status == 6)  || (dataInfo.status == 7) ">
									<div style="margin: 0 auto;text-align: center;">
										<el-radio-group v-model="applyType" style="margin-bottom: 30px;" @change='changeApplyType' v-if='dataInfo.signLimit==0'>
										    <el-radio-button label="1">个人报名</el-radio-button>
										    <el-radio-button label="2">团队报名</el-radio-button>
										</el-radio-group>
									</div>
									<div v-show='applyType == 1'>
										<el-form size="mini" :inline="true" class="demo-form-inline">
											<el-form-item label="状态">
												<el-select clearable v-model="memberPersonalParams.status" placeholder="请选择状态">
													<el-option v-for="option in memberPersonalType" :key="option.id" :label="option.name" :value="option.id"></el-option>
												</el-select>
											</el-form-item>
											<el-form-item>
												<el-input v-model="memberPersonalParams.keyWord"  maxlength=30  placeholder="请输入姓名/学号/工号"></el-input>
											</el-form-item>
											<el-form-item>
												<el-button size="mini" type="primary" @click="memberPersonal(1)">查询</el-button>
											</el-form-item>
										</el-form>
										<el-table :data="memberPersonalList" stripe size="mini" style="width: 100%">
											<el-table-column type="index" label="序号"></el-table-column>
											<el-table-column prop="name" label="姓名"></el-table-column>
											<el-table-column prop="code" label="学号/工号"></el-table-column>
											<el-table-column prop="collegeName" label="院系">
												<div slot-scope="scope">
													{{scope.row.collegeName ?scope.row.collegeName:'- -'}}
												</div>
											</el-table-column>
											<el-table-column label="状态">
												<div slot-scope="scope">
													{{scope.row.status == '1'?'待审核':scope.row.status == '2'?'审核通过':'审核驳回'}}
												</div>
											</el-table-column>
											<el-table-column label="操作">
												<div slot-scope="scope">
												   <el-button  v-if="dataInfo.status < 9" type="text" size="mini" @click="deleteStudent(scope.row.userId,1)">删除</el-button>
												</div>
											</el-table-column>
										</el-table>
									<qu-pagination :total="memberPersonalParams.total" @change="changePage1"></qu-pagination>
								</div>
								<div v-show='applyType == 2'>
										<el-form size="mini" :inline="true" class="demo-form-inline">
											<el-form-item label='团队名称'>
												<el-input v-model="memberTeamParams.teamName" placeholder="请输入团队名称"></el-input>
											</el-form-item>
											<el-form-item label="状态">
												<el-select clearable v-model="memberTeamParams.status" placeholder="请选择状态">
													<el-option v-for="option in memberPersonalType" :key="option.id" :label="option.name" :value="option.id"></el-option>
												</el-select>
											</el-form-item>
											<el-form-item>
												<el-input v-model="memberTeamParams.userName" placeholder="请输入队长姓名/学号/工号"></el-input>
											</el-form-item>
											<el-form-item>
												<el-button size="mini" type="primary" @click="memberTeam(1)">查询</el-button>
											</el-form-item>
										</el-form>
										<el-table :data="memberTeamList" stripe size="mini" style="width: 100%">
											<el-table-column type="index" label="序号"></el-table-column>
											<el-table-column prop="userName" label="队长"></el-table-column>
											<el-table-column prop="code" label="学号/工号"></el-table-column>
											<el-table-column prop="teamName" label="团队名称">
												<div slot-scope="scope" @click="loockTeam(scope.row.teamId)">
													<u>{{scope.row.teamName}}</u>
												</div>
											</el-table-column>
											<el-table-column prop="teamName" label="团队人数">
												<div slot-scope="scope">
													{{scope.row.memberCount}} 人
												</div>
											</el-table-column>
											<el-table-column prop="teamName" label="状态">
												<div slot-scope="scope">
													{{scope.row.status == '1'?'待审核':scope.row.status == '2'?'审核通过':'审核驳回'}}
												</div>
											</el-table-column>
											<el-table-column label="操作">
												<div slot-scope="scope">
													 <el-button  v-if="dataInfo.status < 9" type="text" size="mini" @click="deleteStudent(scope.row.teamId,2)">删除</el-button>
												</div>
											</el-table-column>
										</el-table>
									<qu-pagination :total="memberTeamParams.total" @change="changePage2"></qu-pagination>
								</div>
							</el-tab-pane>
							<el-tab-pane label="投票" name='投票' v-if="dataInfo.isVote==1">
								<div>
									<table class="tableClass" width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td rowspan="3" width="40" class="tableLeftBg2">
											<span>
												<p>投</p>
												<p>票</p>
												<p>详</p>
												<p>情</p>
											</span>
										</td>
										<th  width="150"><span>每日投票</span></th>
										<td  ><span>{{dataInfo.isVoteEveryDay==1?'是':'否'}}</span></td>
									</tr>
									<tr>
										<th><span>投票时间</span></th>
										<td colspan="3"><span>{{dataInfo.voteStartTime}} 至 {{dataInfo.voteEndTime}}</span></td>
									</tr>
								</table>
								<el-table :data="voteData" stripe size="mini" style="width: 100%">
                      				<el-table-column label="排名" type="index"></el-table-column>
                      				<el-table-column prop="avatar" label="头像" width="100" align="center">
										<template slot-scope="scope">
											<img width="54" style="vertical-align: middle;" :src="scope.row.avatar"/>
										</template>
									</el-table-column>
									<el-table-column prop="name" label="选手" width="180"></el-table-column>
									<el-table-column prop="votes" label="票数" align="center">
										<template slot-scope="scope">
											{{scope.row.votes}} 票
										</template>
									</el-table-column>
								</el-table>
							</div>
						</el-tab-pane>
						<el-tab-pane label="完结报告" name='完结报告' v-if="dataInfo.status >8">
							<table class="tableClass" width="100%" cellpadding="0" cellspacing="0" >
								<tr>
									<td rowspan="3" width="40" class="tableLeftBg4">
										<span>
											<p>完</p>
											<p>结</p>
											<p>报</p>
											<p>告</p>
										</span>
									</td>
									<th  width="170"><span>活动总结</span></th>
									<td><span>{{dataInfo.report}}</span></td>
								</tr>
								<tr>
									<th><span>活动费用</span></th>
									<td><span>{{dataInfo.expenses}}</span></td>
								</tr>
								<tr>
									<th><span>提交时间</span></th>
									<td><span v-if="dataInfo.reportTime != 0 && dataInfo.reportTime != null && dataInfo.reportTime != '' ">{{dataInfo.reportTime | formatDate}}</span></td>
								</tr>
							</table>
							<table class="tableClass" width="100%" cellpadding="0" cellspacing="0" v-if='dataInfo.reportAttachment && dataInfo.reportAttachment.length'>
								<tr>
									<td rowspan="3" width="40" class="tableLeftBg5">
										<span>
											<p>附</p>
											<p>件</p>
										</span>
									</td>
									<td>
										<ul class="acitvityUrl" v-if="dataInfo.reportAttachment && dataInfo.reportAttachment.length">
											<!-- <li @click="getBigImage(item)" v-for='item in urls.attachments2'><img :src="item"></li> -->
											<li @click="getBigImage(item.url)" v-for='item in dataInfo.reportAttachment'>
												<span v-if="item.type == 1"><img :src="item.url"></span>
												<span v-if="item.type == 2"><img src="../../assets/images/video@2x.png"></span>
												<span v-if="item.type == 3"><img src="../../assets/images/word@2x.png"></span>
												<span v-if="item.type == 4"><img src="../../assets/images/excel@2x.png"></span>
												<span v-if="item.type == 5"><img src="../../assets/images/pdf@2x.png"></span>
											</li>
										</ul>
									</td>
								</tr>
							</table>
						</el-tab-pane>
						<el-tab-pane :label="'发放'+hoursUnit" :name="'发放'+hoursUnit" v-if='dataInfo.status >8'>
							<div v-if='dataInfo.status == 9||dataInfo.status ==10' style="border: 1px rgba(255, 0, 0, 0.6) solid;background-color: #FFE6E6;color: rgba(255, 0, 0, 0.6);padding: 5px;">
			            		温馨提示：{{hoursUnit}}发放针对所有活动参与人员，且仅发放一次，发放后无法撤回或修改！
			            	</div>
							<div style="padding:10px; clear: both; overflow: hidden;">
								<el-button  style='float: right;' @click='show.filtrate = true' v-if='(dataInfo.status == 9||dataInfo.status ==10)&&(!show.filtrate)' type="primary" size="mini">智能修改{{hoursUnit}}</el-button>
								<el-button style='float: right;' @click='amendHours()' v-if='show.filtrate' type="primary" size="mini">确定修改</el-button>
								<el-button  style='float: right;margin-right: 10px;' @click='deselect()' v-if='show.filtrate' size="mini">取消修改</el-button>
<!--								<el-button type="primary" size="mini" style='float: right;margin-right: 10px;' @click='userCounts' v-if='(dataInfo.status == 9||dataInfo.status ==10)&&(!show.filtrate)' v-perms="'/communist/activity/finish/grant'">发放{{hoursUnit}}</el-button>-->
								<el-button type="primary" size="mini" style='float: right;margin-right: 10px;' @click='userCounts' v-if='(dataInfo.status == 9||dataInfo.status ==10)&&(!show.filtrate)'>发放{{hoursUnit}}</el-button>
                <el-button @click='resetParams'  v-if='show.filtrate' style='float: right;margin-right: 10px;' size="mini">重置</el-button>
              </div>
							<div v-show='show.filtrate'>
								<el-form ref="form" :inline="true" :model="form" label-width="100px">
									<el-form-item label="签到次数" style='width: 300px;'>
									    <el-input placeholder="请输入次数" v-model="memberInfoParams.signIn" style='width: 100px;'></el-input> 次
									</el-form-item>
									<el-form-item label="签退次数" style='width: 300px;'>
									    <el-input placeholder="请输入次数" v-model="memberInfoParams.signBack" style='width: 100px;'></el-input> 次
									</el-form-item>
									<el-form-item label="活动签到签退" style='width: 100%;'>
									    <div class="capacity">
									    	<el-radio v-model="memberInfoParams.signType" label="" border size="small">不限</el-radio>
									    	<el-radio v-model="memberInfoParams.signType" label="1" border size="small">只有签到记录</el-radio>
									    	<el-radio v-model="memberInfoParams.signType" label="2" border size="small">只有签退记录</el-radio>
									    	<el-radio v-model="memberInfoParams.signType" label="3" border size="small">签到签退记录均有</el-radio>
									    	<el-radio v-model="memberInfoParams.signType" label="4" border size="small">无签到签退记录</el-radio>
									    </div>
									</el-form-item>
									<el-form-item label="成员身份" style='width: 100%;'>
									    <div class="capacity">
									    	<el-radio v-model="memberInfoParams.identity" label="" border size="small">不限</el-radio>
									    	<el-radio v-model="memberInfoParams.identity" label="2" border size="small">管理员</el-radio>
									    	<el-radio v-model="memberInfoParams.identity" label="3" border size="small">签到员</el-radio>
									    	<el-radio v-model="memberInfoParams.identity" label="1" border size="small">成员</el-radio>
									    </div>
									</el-form-item>
									<el-form-item label="是否交作业" style='width: 100%;'>
									    <div class="capacity">
									    	<el-radio v-model="memberInfoParams.submitTask" label="" border size="small">不限</el-radio>
									    	<el-radio v-model="memberInfoParams.submitTask" label="1" border size="small">已交作业</el-radio>
									    	<el-radio v-model="memberInfoParams.submitTask" label="0" border size="small">未交作业</el-radio>
									    </div>
									</el-form-item>
									<div>
										<el-form-item label="搜索" style='width: 50%;'>
										    <el-input placeholder="请输入姓名学号搜索" maxlength=30  v-model="memberInfoParams.keyWord" style='width: 200px;'></el-input>
										</el-form-item>
										<div style="margin-left: 40px; margin-bottom: 30px;">
											<el-button @click='getReport(1)' type="primary" size="mini">搜索</el-button>
										</div>
									</div>
								</el-form>
							</div>
							<div>
								<el-table  @selection-change="handleSelectionChange" :data="HoursMembers" stripe size="mini" style="width: 100%">
									<el-table-column type="selection" v-if='(dataInfo.status != 12&&dataInfo.status != 11)&&show.filtrate'></el-table-column>
									<el-table-column prop="userName" label="姓名" ></el-table-column>
									<el-table-column prop="code" label="学号"></el-table-column>
									<el-table-column prop="identity" label="身份">
										<div slot-scope="scope">
                      						{{scope.row.identity == 1 ? '普通成员' : (scope.row.identity == 2 ? '管理员' : '签到员') }}
									    </div>
									</el-table-column>
									<el-table-column :formatter="durationFormatter" prop="participationLength" label="参与时长">
          							</el-table-column>
									<el-table-column  width="200" prop="signList"   label="签到签退">
			                        	<div slot-scope="scope">
			                             	<span v-html='formatSign(scope.row.signList)'> </span>
		                        		</div>
			                      	</el-table-column>
			                      	<el-table-column label="作业">
                						<div slot-scope="scope">
                							<span id="" v-if='scope.row.isSubmit==1' @click="homeWork(scope.row.userId)">
                								<u>查看</u>
                							</span>
                							<span v-else> - -</span>
										</div>
									</el-table-column>
									<el-table-column  :label="'发放' + hoursUnit" width="220" align="center" fixed="right">
										<div slot-scope="scope">
											<!-- 可转载站点功能未完成 -->
											<div style="margin-right: 10px;">
												<el-input style='float: right;width: 80px;margin-right: 10px;' :disabled='(dataInfo.status != 12&&dataInfo.status != 11&&show.filtrate) ? false : true' v-model="scope.row.hours" type="text" @blur='isModifications(scope.row)'></el-input>
											</div>
										</div>
									</el-table-column>
								</el-table>
								<div style="padding-top: 20px;">
									<div style="float: left;"><el-button type="text" class="opreat-btn" v-if='multipleSelection.length' @click='show.modification = true'>批量修改{{hoursUnit}}</el-button></div>
									<qu-pagination :total="memberInfoParams.total" @change="changePage3"></qu-pagination>
								</div>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>
			</div>
	</section>

</template>

<script>
import listMixins from '@/mixins/form'
import {formatDate,getOssToken,getAliyunImageUrl,backAliyunImageUrl} from '@/utils/filters'
import axios from 'axios'
export default {
	mixins:[listMixins],
	data(){
		return {
			userList:[],
			activeName:'详情',
			urls:{
				attachments1:[],
				attachments2:[]
			},
			loadin:true,
			applyType:'1',
			hoursUnit:localStorage.getItem("hoursUnit"),
			dataInfo:'',
			id:this.$route.query.id,
			memberPersonalList:[],
			memberPersonalParams:{
				id:this.$route.query.id,
				current:1,
				size:10,
				status:'',
				keyWord:'',
				total:0,
			},
			memberPersonalType:[{
				id:'',
				name:'不限'
			},{
				id:'1',
				name:'待审核'
			},{
				id:'2',
				name:'审核通过'
			},{
				id:'3',
				name:'审核驳回'
			},],
			memberTeamList:[],
			memberTeamParams:{
				id:this.$route.query.id,
				current:1,
				size:10,
				status:'',
				keyWord:'',
				total:0,
				teamName:'',
				userName:'',
			},
			show:{
				teamUserShow:false,
				filtrate:false,
				dialogVisibleRefuse:false,
				dialogVisibleAdopt:false,
				modification:false,
				lookHomeWork:false,
				grant:false,
				hint:false
			},
			teamUser:'',
			voteData: [],
			HoursMembers: [],
			memberInfoParams:{
				current:1,
				size:10,
				id:this.$route.query.id,
				keyWord:'',
				signIn:'',
				signBack:'',
				signType:'',
				identity:'',
				submitTask:'',
				total:0,
			},
			isOld:false,
			multipleSelection:[],
			ruleFormRefuse:{},
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
            hours:'',
            homeWorks:'',
            userCount:'',
		}
	},
	mounted(){

		this.getDataInfo(this.id)
		this.getReport()
	},
	methods:{
		//删除学生
    deleteStudent(id,type){

      this.$confirm('是否删除此成员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('activity/delete/activity_member', {
					activityId:this.id,
          userId: id,
					type:type
        }).then(res => {
          if (res.code === '200') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.memberPersonal()
            this.memberTeam()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
        })
      }).catch(() => {

      })

    },
		//取消修改
		deselect(){
			if(this.userList.length){
				this.$confirm('是否确定取消修改?', '提示', {
		        	confirmButtonText: '确定',
		        	cancelButtonText: '取消',
		        	type: 'warning'
		      	}).then(() => {
		      		this.userList=[]
		            this.resetParams()
		            this.show.filtrate = false
					this.multipleSelection = []
					this.getReport()
		      	})
			}else{
				this.userList=[]
	            this.resetParams()
	            this.show.filtrate = false
				this.multipleSelection = []
				this.getReport()
			}


		},
		//修改学时
		amendHours(){

			if(this.userList.length){
				this.$confirm('是否确定修改?', '提示', {
		        	confirmButtonText: '确定',
		        	cancelButtonText: '取消',
		        	type: 'warning'
		      	}).then(() => {
		      		this.$http.post('/activity/update/member/hour-list', {
						userList:this.userList,
						activityId:this.id
					}).then( (res) => {
						this.show.filtrate = false
						this.multipleSelection = []
		                this.$message({
		                    type: 'success',
		                    message: '修改成功!'
		                });
		                this.userList=[]
		                this.resetParams()

		            })
		      	})

			}else{
				this.userList=[]
		        this.resetParams()
				this.show.filtrate = false
				this.multipleSelection = []
			}
		},
		importAllStudent(){
	        axios({
	         method: 'get',
	         url: '/activity/sign/list/export',
	         responseType: 'blob',
	         params: {
				activityId:this.id
	         }
	       }).then((res) => {
	         if (!res) {
	           return
	         }
	         var filename = name;
	         let url = window.URL.createObjectURL(res)
	         let link = document.createElement('a')
	         link.style.display = 'none'
	         link.href = url
	         link.setAttribute('download', '签到记录' + '.xlsx')
	         document.body.appendChild(link)
	         link.click()
	       })
	    },
		//发放学时
		submitGrant(){
			this.show.grant = false
			this.show.hint = true
			this.$store.commit('setClick',true)

		 if (this.dataInfo.activityExampleId && this.dataInfo.finishExampleId) {
			 this.isOld = false
		 }else{
			 this.isOld = true
		 }

		 let urls = ""

		 if (this.isOld) {
			 urls = "/activity/grantOld"
		 }else{
			 urls = "/activity/grant"
		 }

			this.$http.post(urls, {
				id:this.id,
				method:'success'
			}).then( (res) => {
				this.show.hint = false
				this.getDataInfo()
        if (res.code == '200'){
          this.$message({
              type: 'success',
              message: '发放成功!'
          });
        }


        })
		},
		userCounts(){
			this.$http.get('/activity/user/count', {params: {activityId:this.id}}).then(res => {
				this.show.grant = true
				this.userCount = res.data
			}).catch(err => {
			});
		},
		isModifications(row){
			let reg = /^[0-9]{1}\d*(\.[0-9]{1,2})?$/;
       if (!reg.test(row.hours)) {
          this.$message({
               type: 'error',
               message: '填写'+this.hoursUnit+'在0.00-999.99之间，且只能保留两位小数点'
           });
           for(var i=0; i<this.userList.length; i++){
              if(this.userList[i].id == row.id){
                 this.userList.splice(i, 1);
              }
            }
          return
        }else if(row.hours<0.00||row.hours>999.99){
          this.$message({
               type: 'error',
               message: '填写'+this.hoursUnit+'在0.00-999.99之间，且只能保留两位小数点'
           });
           for(var i=0; i<this.userList.length; i++){
              if(this.userList[i].id == row.id){
                 this.userList.splice(i, 1);
              }
           }
          return
        }
        if(this.userList.length){
          for(var i=0; i<this.userList.length; i++){
            if(this.userList[i].id == row.id){
              this.userList[i].hours = row.hours
            }else{
              this.userList.push({
                id:row.id,
                hours:row.hours
              })
            }
          }
          let obj = {}
          this.userList = this.userList.reduce((item, next) => {
            obj[next.id] ? '' : obj[next.id] = true && item.push(next)
            return item
          }, [])
        }else{
          this.userList.push({
            id:row.id,
            hours:row.hours
          })
        }
		},
		homeWork(userId){
			this.$http.get("/activity/check/task",{params:{
				userId:userId,
				activityId:this.id
			}
			}).then(res =>{
				// res.data.urls = res.data.urls.split(',')
				// var s = []
				// for(var i=0;i<res.data.urls.length;i++){
				// 	s.push(getAliyunImageUrl(res.data.urls[i],100,100))
				// }
				//
				// res.data.urls = s
				this.show.lookHomeWork = true
				this.homeWorks = res.data
			})
		},
		submitModification(hours, ids, index){
			var that = this
			let reg = /^[0-9]{1}\d*(\.[0-9]{1,2})?$/;
        	if (!reg.test(hours)) {
            	this.$message({
                   type: 'error',
                   message: '填写'+this.hoursUnit+'在0.00-999.99之间，且只能保留两位小数点'
               });
            	return
            }else if(hours<0.00||hours>999.99){
            	this.$message({
                   type: 'error',
                   message: '填写'+this.hoursUnit+'在0.00-999.99之间，且只能保留两位小数点'
               });
            	return
            }

				this.multipleSelection.forEach( item => {
					for(var i=0; i<this.userList.length; i++){
						if(this.userList[i].id == item.id){
							 this.userList.splice(i, 1);
						}
					}
				})
				this.multipleSelection.forEach( item => {
					this.userList.push({
						id:item.id,
						hours:hours
					})
		       })
				this.multipleSelection = []
                this.hours = '';
                this.show.modification = false;
                this.getReport()


		},
		//驳回
        reJectAcitivity(id){
                this.show.dialogVisibleAdopt = true
				this.ruleFormReject.id = this.id
        },
        submitFormReject() {
            if (this.ruleFormReject.remark) {
            	this.$store.commit('setClick',true)
                this.$http.post('/activity/grant',this.ruleFormReject).then( (res) => {

                   if (res.code == '200') {
                     this.$message({
                       type: 'success',
                       message: '驳回成功!'
                     });
                     this.show.dialogVisibleAdopt = false;
                     this.ruleFormReject.remark = '';
                     this.ruleFormReject.id = '';
                     this.getDataInfo(this.id)
                   }



                })
            } else {
                this.$message({
                    type: 'error',
                    message: '请填写驳回理由'
                });
            }

        },
		//拒绝完结报告
        refuseAcitivity(id){
               this.show.dialogVisibleRefuse = true
               this.ruleFormRefuse.id = this.id
        },
        submitFormRefuse() {
            if (this.ruleFormRefuse.remark) {
            	this.$store.commit('setClick',true)
                this.$http.post('/activity/grant', this.ruleFormRefuse).then( (res) => {
                  if (res.code == '200') {
                    this.show.dialogVisibleRefuse = false;
                    this.ruleFormRefuse.remark = '';
                    this.ruleFormRefuse.id = '';
                    this.$message({
                      type: 'success',
                      message: '拒绝成功!'
                    });
                    this.getDataInfo(this.id)
                  }

                })
            } else {
                this.$message({
                    type: 'error',
                    message: '请填写拒绝理由'
                });
            }
        },
		resetParams(){
			this.memberInfoParams={
				current:1,
				size:10,
				id:this.$route.query.id,
				keyWord:'',
				signIn:'',
				signBack:'',
				signType:'',
				identity:'',
				submitTask:'',
				total:0,
			}
			this.getReport()
		},
		durationFormatter(row, column, cellValue){
			if (cellValue < 60) {
                return cellValue + "分钟";
            } else if (cellValue < 24 * 60) {
                return parseInt((cellValue / 60)) + "小时" + (cellValue % 60) + "分钟";
            } else {
                var day = parseInt(cellValue / (60 * 24));
                var hour = parseInt((cellValue - day * 60 * 24) / 60);
                var min = (cellValue - day * 60) % 60;
                return day + "天" + hour + "小时" + min + "分钟";
            }

//	      	if (cellValue >= 24) {
//	        	if (cellValue%24 == 0) {
//	              	return parseInt(cellValue/24) + '天'
//	        	}else{
//	              	return parseInt(cellValue/24) + '天' + cellValue%24 + '小时'
//	        	}
//    		}else{
//      		return cellValue + '小时'
//    		}

    	},
		handleSelectionChange(val) {
          this.multipleSelection = val

        },
		getReport(type){
			if(type == 1){
				this.memberInfoParams.current = 1
				this.memberInfoParams.total = 1
			}
			this.$http.get("/activity/member/info/all",{params:this.memberInfoParams
			}).then(res =>{
				if(this.userList.length){
					for(var i=0; i<res.data.list.length; i++){
						for(var f=0; f<this.userList.length;f++){
							if(res.data.list[i].id == this.userList[f].id){
								res.data.list[i].hours = this.userList[f].hours
							}
						}
					}
				}
				this.HoursMembers = res.data.list
				this.memberInfoParams.total = res.data.total
			})
		},
		getBigImage(item){
			   window.open(item,"_blank")
            // window.open(backAliyunImageUrl(item),"_blank")
         },
		getVote(){
			this.$http.get("/activity/vote/player",{params:{activityId:this.id}}).then(res =>{
				this.voteData = res.data
			})
		},
		loockTeam(teamId){
			this.$http.get('/activity/team/members', {params: {teamId:teamId}}).then(res => {
				this.show.teamUserShow = true
				this.teamUser = res.data
			}).catch(err => {
			});
		},
		changePage1(current, size) {
			this.memberPersonalParams.current = current
			this.memberPersonalParams.size = size
			this.memberPersonal()
		},
		changePage2(current, size) {
			this.memberTeamParams.current = current
			this.memberTeamParams.size = size
			this.memberTeam()
		},
		changePage3(current, size){
			this.memberInfoParams.current = current
			this.memberInfoParams.size = size
			this.getReport()
		},
		changeApplyType(val){
			if(val == 1){
				this.memberPersonal()
			}else{
				this.memberTeam()
			}
		},
		memberTeam(type){
			if(type == 1){
				this.memberTeamParams.current = 1
				this.memberTeamParams.total = 1
			}
			this.$http.get('/activity/member-team', {params: this.memberTeamParams}).then(res => {
				this.memberTeamList = res.data.list
				this.memberTeamParams.total = res.data.total
			}).catch(err => {
			});
		},
		memberPersonal(type){
			if(type == 1){
				this.memberPersonalParams.current = 1
				this.memberPersonalParams.total = 1
			}
			this.$http.get('/activity/member-personal', {params: this.memberPersonalParams}).then(res => {
				this.memberPersonalList = res.data.list
				this.memberPersonalParams.total = res.data.total
			}).catch(err => {
			});
		},
		getDataInfo(){
			var that = this
			that.$http.get('/activity/detail', {params: {id:this.id}}).then(res => {
      			res.data.logo =   getAliyunImageUrl(res.data.logo,100,100)
		    //     if(res.data.attachments){
		    //     	var urls = res.data.attachments
		    //     	that.urls={
		    //     		attachments1:[],
		    //     		attachments2:[]
		    //     	}
		    //     	for(var i=0; i<urls.length;i++){
		    //     		if(urls[i].type == 1){
		    //     			var urls1 = urls[i].url.split(',')
		    //     			for(var f=0; f<urls1.length; f++){
		    //       				that.urls.attachments1.push(getAliyunImageUrl(urls1[f],100,100))
		    //       			}
		    //       		}else{
		    //       			var urls2 = urls[i].url.split(',')
		    //       			for(var f=0; f<urls2.length; f++){
		    //       				that.urls.attachments2.push(getAliyunImageUrl(urls2[f],100,100))
		    //       			}
				//
		    //       		}
		    //     	}
				// }
				that.dataInfo = res.data
				if(that.dataInfo.collegeLimitName){
					that.dataInfo.collegeLimitName = that.dataInfo.collegeLimitName.split(',')
					that.dataInfo.collegeLimitName = that.dataInfo.collegeLimitName.join(' | ')

				}
				if(that.dataInfo.gradeLimit){
					that.dataInfo.gradeLimit = that.dataInfo.gradeLimit.split(',')
					that.dataInfo.gradeLimit = that.dataInfo.gradeLimit.join(' | ')

				}
				if(that.dataInfo.signLimit == 1||that.dataInfo.signLimit == 0){
					that.applyType = '1'
					that.memberPersonal('1')
				}else{
					that.applyType = '2'
					that.memberTeam()
				}
				if(that.dataInfo.isVote==1){
					that.getVote()
				}
			}).catch(err => {
			});
		},
		formatterStatus(cellValue){
			if(cellValue == 1 || cellValue == 2 || cellValue == 3){
				return "审核中"
			}else if(cellValue == 4){
				return "被驳回"
			}else if(cellValue == 5){
				return "报名中"
			}else if(cellValue == 6){
				return "待开始"
			}else if(cellValue == 7){
				return "进行中"
			}else if(cellValue == 8){
				return "待完结"
			}else if(cellValue == 9){
				return "完结审核中"
			}else if(cellValue == 10){
				return "完结被驳回"
			}else if(cellValue == 11){
				return "已完结"
			}else if(cellValue == 12){
				return "已完结"
			}else{
				return "其他"
			}
	  	},
	  	isformatterStatus(cellValue){
	  		if(cellValue == 8){
	        	return true
	        }else if(cellValue == 9){
	        	return true
	        }else if(cellValue == 10){
	        	return true
	        }else if(cellValue == 11){
	        	return true
	        }else if(cellValue == 12){
	        	return true
	        }else{
	        	return false
	        }
	    },
	    formatSign(cellValue){

             if (cellValue.length) {
                 let obj = ''
                 cellValue.forEach( item => {
                   if (item.signType == 1) {
                       obj += '<p>签到' + formatDate(item.signTime) + ' </p>'
                   } else if (item.signType == 2) {
                       obj += '<p>签退' + formatDate(item.signTime) + ' </p>'
                   }
                 })
                return obj
             }
        },
        //删除
	    deleteBatch(id,status,name){
	      	var that = this
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

<style lang="scss">
.acitvityUrl li{
  float:left;
  display:inline;
  width:95px;
  height:110px;
  overflow:hidden;
  margin-right:10px;
  img{
	  width:100%;
	  height:100%;
  }
}
.tableClass{
 border-collapse:collapse;
 margin-bottom:20px;
}
.tableClass th
{
  padding:15px;
  border: 1px solid #E4E4E4;
  font-size:14px;
  color:#333;
}
.tableClass td
{
  padding:15px;
  border: 1px solid #E4E4E4;
  color:#666;
  font-size:14px;
}
.tableClass .tableLeftBg{
	background:#0099FF;
	text-align:center;
	color:#fff;
}
.tableClass .tableLeftBg2{
	background:#6666FF;
	text-align:center;
	color:#fff;
}
.tableClass .tableLeftBg3{
	background:#9966FF;
	text-align:center;
	color:#fff;
}
.tableClass .tableLeftBg4{
	background:#CC66FF;
	text-align:center;
	color:#fff;
}
.tableClass .tableLeftBg5{
	background:#FF6600;
	text-align:center;
	color:#fff;
}
.detail-head {
	font-size: 14px;
	padding: 10px 20px;
}
.detail-head tr {
	height: 32px;
	line-height: 32px;
}
.detail-head .detail-head-title {
	color: #999999;
	margin-right: 10px;
}
.el-tabs--border-card {
	-webkit-box-shadow: none
}
.ctime {
	width: 200px;
	height: 40px;
	position: relative;
	float: right;
	line-height: 40px;
	font-size: 14px;
	color: #909399;
	z-index: 100;
	margin-right: 30px;
}
table th {
	background-color: rgba(242, 243, 251, 1);
}
.omit{
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}

</style>

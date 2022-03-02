<template>
  <section>

    <el-dialog title="添加成员" :visible.sync="dialogVisible" @close="beforeCloseHandler" :close-on-click-modal="false"
               width="580px">
      <div>
        <el-form size="mini" :model="ruleFormbj" :rules="rulebjs" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <!-- <el-form-item label="所属学校" prop="campus">
            <el-col :span="22" >
                <el-select @change="changeSchool"  style="width:100%" v-model="ruleForm.campus" placeholder="请选择学校">
                    <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="所属院系" prop="college">
            <el-col :span="22" >
              <el-select @change="changeCollege"  style="width:100%" v-model="ruleForm.college" placeholder="请选择院系">
                  <el-option v-for="item in colleges" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="所属专业" prop="major">
            <el-col :span="22" >
              <el-select @change="changeMajor" style="width:100%" v-model="ruleForm.major" placeholder="请选择专业">
                  <el-option v-for="item in majors" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="所属班级" prop="class">
            <el-col :span="22" >
              <el-select  style="width:100%" v-model="ruleForm.class" placeholder="请选择班级">
                  <el-option v-for="item in classes" :key="item.id" :label="item.name" :value="item.id">
                     {{ item.name }} {{ item.grade }}
                  </el-option>
              </el-select>
            </el-col>
          </el-form-item> -->

          <el-form-item label="姓名" prop="name">
            <el-col :span="22">
              <el-input v-model="ruleFormbj.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="学号" prop="code">
            <el-col :span="22">
              <el-input v-model="ruleFormbj.code"></el-input>
            </el-col>
          </el-form-item>
          <!--<el-form-item label="班级" prop="class">
            <el-col :span="22">
              <el-select clearable
                         @change="changeClass"
                         style="width:100%"
                         v-model="ruleForm.class"
                         filterable
                         value-key="value"
                         :multiple-limit=1
                         remote
                         placeholder="请输入班级名称搜索"
                         :remote-method="remoteMethod"
                         :loading="loading">
                <el-option
                  v-for="item in options4"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 13px">{{ item.campusName }}-{{ item.grade }}级</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>-->

          <el-form-item label="性别" prop="gender">
            <el-col :span="22">
              <el-radio-group v-model="ruleFormbj.gender">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <el-form-item label="民族">
            <el-col :span="22">
              <el-select style="width:100%" v-model="ruleFormbj.ethnicId" placeholder="请选择民族">
                <el-option v-for="item in ethnices" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="政治面貌">
            <el-col :span="22">
              <el-select style="width:100%" v-model="ruleFormbj.politics" placeholder="选择政治面貌">
                <el-option v-for="item in politics" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="所属校区" prop="campus">
            <el-col :span="22">
              <el-input
                v-model="detail.campusName"
                :disabled="true">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="所属院系" prop="college">
            <el-col :span="22">
              <el-input
                v-model="detail.collegeName"
                :disabled="true">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="所属专业" prop="major">
            <el-col :span="22">
              <el-input
                v-model="detail.majorName"
                :disabled="true">
              </el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="所属年级" prop="grade">
            <el-col :span="22">
              <el-input
                v-model="detail.grade"
                :disabled="true">
              </el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="所属班级" prop="class">
            <el-col :span="22">
              <el-input
                v-model="detail.name"
                :disabled="true">
              </el-input>
            </el-col>
          </el-form-item>


          <!-- <el-form-item label="手机号" v-if="ruleForm.id">
             <el-col :span="14">
               <el-input v-model="ruleForm.mobile"></el-input>
             </el-col>
           </el-form-item>-->
          <el-form-item>
            <el-button  type="increase" @click="submitForms('ruleForm',2)">添加</el-button>

          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog title="批量导入"
               :visible.sync='dialogImportCollegeVisible'
               @close="beforeCloseImportCollegeHandler"
               :close-on-click-modal="false"
               width='650px' id="dialogOrange">
      <div>

        <div v-show="!showfileInfor">

          <div class="uploadLocal" v-show="fileList.length">
            <div class="uploadLocal-circel">
              <p style="padding-top:57px;"><img src="../../assets/images/upload_two@2x.png" style="width:70px;"></p>
              <p style="padding-top:10px;font-size:14px;color:#333;">{{fileListName}}</p>
            </div>
            <div class="uploadLocal-btn">
              <button class="uploadLocal-btnReset" @click="resetUpload">重新上传</button>
              <button class="uploadLocal-btnSubmit" @click="submitUpload">确认导入</button>
            </div>
          </div>

          <el-form v-show="!fileList.length" size='mini' label-width='12px'>
            <div class="importTipsTitle">
									<span class="importTipsTitle-left">
										 请下载导入模板，按格式修改后导入
									</span>
              <span class="importTipsTitle-right">
										<a class="el-button el-button--text el-button--mini" :href='downHref' size='mini'>模板下载</a>
									</span>
            </div>
            <el-form-item label="" prop="name">
              <el-col :span="22">
                <upload-file
                  ref="childUpload"
                  :uploadUrl="Uploadlink"
                  uploadType=".xls,.xlsx"
                  uploadSzie="100"
                  @setFileList="setFileList"
                  uploadSzieTips="只能上传xlx/xlsx文件，且不超过100MB!"
                  @fileInfor="openfileInfor"
                  :dataObj="dataObj2"
                >
                </upload-file>
              </el-col>
            </el-form-item>
          </el-form>

        </div>
        <div class="progress-line" v-if="showProgress ">
          <el-progress :stroke-width="18" :percentage="fileUploadPercent" style="margin-top:30px;"></el-progress>
          <p style="text-align: center;padding: 20px 0px 10px;">正在上传，请您耐心等待...</p>
          <span style="display: block; text-align: center; font-size: 13px; color: #999">请勿关闭浏览窗口</span>
        </div>
        <div class="importFail" v-show="showfileInforDetail  && fileInforamtion.total != fileInforamtion.success">
          <div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_fail@2x.png'></div>
          <div class="importFail-tips">
            <span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功，<span style="color:#FFC600;">{{fileInforamtion.failed}}</span>条导入失败
            <span @click="downFailed()" style="cursor:pointer;color:#4D98FF" v-if="fileInforamtion.failed">下载失败列表</span>
          </div>
          <div class="uploadLocal-btn">
            <button class="uploadLocal-btnReset" @click="resetUpload">重新导入</button>
          </div>
        </div>

        <div class="importSuccess" v-show="showfileInforDetail && fileInforamtion.total == fileInforamtion.success">
          <div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_success@2x.png'></div>
          <div class="importFail-tips">
            <span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功
          </div>
          <div class="uploadLocal-btn">
            <button class="uploadLocal-btnReset" @click="resetUpload">继续导入</button>
          </div>
        </div>
      </div>
    </el-dialog>
    <back></back>
    <div class="main-body">
      <el-tabs v-model="active" @tab-click="changeTab">
        <el-tab-pane label="班级详情" name="orgxiangqing">
          <p class="xinxitou">基本信息</p>
          <div class="detail">
            <el-form size="mini" :model="detail" ref="detail" label-width="100px" class="detail" label-position="left">
              <el-form-item label="logo">
                <el-col :span="22">
                  <img :src="detail.logo" alt="班级LOGO"
                       style="display: inline-block;margin: 15px;width: 100px;height: 100px;margin-bottom: 0"
                       class="nomarglf" onerror="onerror=null;src='/static/images/dstp.png'">

                </el-col>
              </el-form-item>
              <el-form-item label="班级名称" prop="name">
                <el-col :span="22">
            <span>
                {{detail.name}}
            </span>
                </el-col>
              </el-form-item>
              <el-form-item label="所属校区" prop="campusId">
                <el-col :span="22">
            <span>
                {{detail.campusName}}
            </span>
                </el-col>
              </el-form-item>
              <el-form-item label="所属院系" prop="collegeId">
                <el-col :span="22">
            <span>
                {{detail.collegeName}}
            </span>

                </el-col>
              </el-form-item>
              <el-form-item label="所属专业" prop="majorId">
                <el-col :span="22">
            <span>
                {{detail.majorName}}
            </span>

                </el-col>
              </el-form-item>
              <el-form-item label="所属年级" prop="grade">
                <el-col :span="22">
            <span>
                {{detail.grade}}
            </span>

                </el-col>
              </el-form-item>


              <el-form-item label="班级负责人">
                <el-col :span="22">
            <span>
                {{detail.auditorName}} - {{detail.auditorCode}}
            </span>

                </el-col>
              </el-form-item>

              <el-form-item label="辅导员">
                <el-col :span="22">
            <span>
                {{detail.coachName}} - {{detail.coachCode}}
            </span>

                </el-col>
              </el-form-item>
              <el-form-item label="班级简介">
                <el-col :span="22">
            <span>
                {{detail.introduce}}
            </span>

                </el-col>
              </el-form-item>
              <el-form-item label="风采展示">
                <el-col :span="22">
                  <span v-for="imgurl in detail.miens">
                 <img :src="imgurl.url" alt=""
                      style="display: inline-block;margin: 15px;width: 100px;height: 100px;margin-bottom: 0"
                      class="nomarglf">
                  </span>

                </el-col>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="成员列表" name="member">
          <el-tabs v-model="activeName2" type="card" @tab-click="changeType">
            <!--<el-tab-pane label="当前成员" name="2">-->
            <el-form size="mini" :inline="true" class="demo-form-inline">
              <el-form-item label="姓名/学号">
                <el-input v-model="params.keyWord" placeholder="请输入学号搜索"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary" @click.native="search()">查询</el-button>
              </el-form-item>
              <el-form-item style="float:right;">
                 <span>
								<el-button @click="gettianjiachenyuan" type="primary" size="mini">添加成员</el-button>
							</span>
              </el-form-item>
            </el-form>
            <div>
              <el-table ref="multipleTable" class="tableClassNormal" :loading="loading" :data="members"
                        tooltip-effect="dark" @selection-change="handleSelectionChange">
                <el-table-column :selectable="checkAll" type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="code" label="学号"></el-table-column>
                <el-table-column prop="code" label="政治面貌">
                  <template slot-scope="scope">
                    {{scope.row.politics | politicsFmt}}
                  </template>
                </el-table-column>
                <el-table-column prop="code" label="角色">
                  <template slot-scope="scope">
                    {{scope.row.role | roleFmt}}
                  </template>
                </el-table-column>
                <el-table-column prop="code" label="职务">
                  <template slot-scope="scope">
                    {{scope.row.duty}}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="220" align="center">
                  <div slot-scope="scope">
                    <!--<el-button v-if="scope.row.role != 1" @click="deleteMember(scope.row.userId,scope.row.orgId)"-->
                    <!--type="text"-->
                    <!--class="opreat-btn">删除-->
                    <!--</el-button>-->
                    <el-button @click="modifyDuty(scope.row)"
                               type="text"
                               class="opreat-btn">编辑
                    </el-button>

                    <el-button v-if="scope.row.role == 1" @click="ShowruleFormCharge = true" type="text"
                               class="opreat-btn">转让负责人
                    </el-button>

                    <el-button @click="setAdmin(scope.row.orgId,scope.row.userId,scope.row.role,1)"
                               v-if="scope.row.role == 3" type="text"
                               class="opreat-btn">设为管理员
                    </el-button>
                    <el-button @click="setAdmin(scope.row.orgId,scope.row.userId,scope.row.role,0)"
                               v-if="scope.row.role == 2" type="text"
                               class="opreat-btn">取消管理员
                    </el-button>
                  </div>
                </el-table-column>
              </el-table>
            </div>
            <div style="width:98%;margin:0 auto;font-size:14px;padding-top:30px;">
              <!-- <span style="display:block;float:left;">
                <el-button size="mini" type="primary" @click="setAllStatus(1)">删除</el-button>
              </span> -->
              <div class="block text-center" style="float: right;">
                <qu-pagination :total="total" @change="changePage"></qu-pagination>
              </div>
            </div>
            <!--   </el-tab-pane>-->
            <!--<el-tab-pane label="待审成员" name="1">
              <el-form size="mini" :inline="true" class="demo-form-inline">
                <el-form-item label="操作类型">
                  <el-input v-model="params.code" placeholder="请输入学号搜索"></el-input>
                </el-form-item>
                <el-form-item label="姓名/学号">
                  <el-input v-model="params.code" placeholder="请输入学号搜索"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="mini" type="primary" @click.native="search()">查询</el-button>
                </el-form-item>
              </el-form>
              <div>
                <el-table ref="multipleTable" class="tableClassNormal" :loading="loading" :data="members"
                          tooltip-effect="dark" @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="55"></el-table-column>
                  &lt;!&ndash;						<el-table :loading="loading" :data="members" stripe size="mini" style="width: 100%">&ndash;&gt;

                  <el-table-column prop="name" label="姓名"></el-table-column>
                  <el-table-column prop="code" label="学号"></el-table-column>
                  <el-table-column prop="code" label="政治面貌">
                    <template slot-scope="scope">
                      {{scope.row.politics | politicsFmt}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="code" label="角色">
                    <template slot-scope="scope">
                      {{scope.row.role | roleFmt}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="code" label="入团时间">
                    <template slot-scope="scope">
                      {{scope.row.joinTime | parseTime}}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="220" align="center">
                    <div slot-scope="scope">
                      <el-button v-if="scope.row.status != 1" @click="deleteMember(scope.row.id)" type="text"
                                 class="opreat-btn">删除
                      </el-button>
                      <el-button @click="setAdmin(scope.row.id,scope.row.identity)"
                                 v-if="scope.row.identity == 7000||scope.row.identity == 4000" type="text"
                                 class="opreat-btn">设为管理员
                      </el-button>
                      <el-button @click="setAdmin(scope.row.id,scope.row.identity)"
                                 v-if="scope.row.identity == 7002||scope.row.identity == 4002" type="text"
                                 class="opreat-btn">取消管理员
                      </el-button>
                    </div>
                  </el-table-column>
                </el-table>
              </div>
              <div style="width:98%;margin:0 auto;font-size:14px;padding-top:30px;">
              <span style="display:block;float:left;">
                <el-button size="mini" type="primary" @click="setAllStatus(1)">删除</el-button>
              </span>
                <div class="block text-center" style="float: right;">
                  <qu-pagination :total="total" @change="changePage"></qu-pagination>
                </div>
              </div>

            </el-tab-pane>-->
          </el-tabs>

        </el-tab-pane>
        <el-tab-pane label="活动列表" name="activity">
          <actiqita></actiqita>
          <!--<div>-->
            <!--<el-form size="mini" :inline="true" class="demo-form-inline">-->
              <!--<el-form-item label="名称">-->
                <!--<el-input v-model="params.keyWord" maxlength=30 placeholder="请输入名称搜索"></el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item>-->
                <!--<el-button size="mini" type="primary" @click.native="search()">查询</el-button>-->
              <!--</el-form-item>-->
            <!--</el-form>-->
          <!--</div>-->
          <!--<div>-->
            <!--<el-table :loading="loading" :data="activities" stripe size="mini" style="width: 100%">-->
              <!--<el-table-column prop="name" label="活动名称">-->
                <!--<div slot-scope="scope">-->
                  <!--<p><span style="background: blue; color: #fff;" v-if="scope.row.flag==0">历</span>{{scope.row.name}}-->
                  <!--</p>-->
                <!--</div>-->
              <!--</el-table-column>-->
              <!--<el-table-column prop="classifyName" label="活动分类"></el-table-column>-->
              <!--<el-table-column prop="limitType" label="限定类型" show-overflow-tooltip>-->
                <!--<div slot-scope="scope">-->
                  <!--<p>{{scope.row.limitType | formatLimitType}}</p>-->
                <!--</div>-->
              <!--</el-table-column>-->
              <!--<el-table-column label="活动时间" align="center" width="300px">-->
                <!--<template slot-scope="scope">-->
                  <!--<span>{{scope.row.startTime  | formatDate}} 至 </span>-->
                  <!--<span>{{scope.row.endTime  | formatDate}}</span>-->
                <!--</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column prop="admin" label="管理员" align="center"></el-table-column>-->
              <!--<el-table-column prop="mobile" label="联系方式" align="center"></el-table-column>-->
              <!--<el-table-column prop="ctime" label="创建时间" align="center">-->
                <!--<template slot-scope="scope">-->
                  <!--<span>{{scope.row.ctime  | formatDate}}</span>-->
                <!--</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column prop="status" label="状态"></el-table-column>-->
              <!--&lt;!&ndash; <el-table-column label="附件" width="80" align="center">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-button type="text">查看</el-button>-->
                <!--</template>-->
              <!--</el-table-column> &ndash;&gt;-->
              <!--<el-table-column label="操作" align="center">-->
                <!--<div slot-scope="scope">-->
                  <!--&lt;!&ndash; 可转载站点功能未完成 &ndash;&gt;-->
                  <!--<el-button type="text" class="opreat-btn" v-if="scope.row.flag==1"-->
                             <!--@click.native="routerLink('/communist/activity/detail', 'view', scope.row.id)">详情-->
                  <!--</el-button>-->
                  <!--<el-button type="text" class="opreat-btn" v-else-if="scope.row.flag==0"-->
                             <!--@click.native="routerLink('/communist/history/detail', 'view', scope.row.id)">详情-->
                  <!--</el-button>-->
                <!--</div>-->
              <!--</el-table-column>-->
            <!--</el-table>-->
            <!--&lt;!&ndash; <qu-pagination :total="total" @change="changePage"></qu-pagination> &ndash;&gt;-->
          <!--</div>-->
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--编辑职务-->
    <el-dialog :visible.sync="ShowruleFormDuty" width="585px">

      <div slot="title">
				<span class="alertTitle">
				 编辑
				</span>
      </div>

      <div>
        <el-form size="mini" :model="FormCharge" ref="ruleFormDuty" label-width="120px" class="demo-ruleForm">

          <el-form-item label="职务">
            <el-col :span="22">
              <el-input maxLength="10" v-model.trim="ruleFormDuty.duty" style='width: 100%;'></el-input>
            </el-col>
          </el-form-item>


          <el-form-item>
            <el-button :disabled="$store.state.sys.isClick" class="blueButton" @click="submitDuty('ruleFormDuty')">确定
            </el-button>
            <el-button class='marginr-20 piercedBlueButton' @click='ShowruleFormDuty=false'>取消</el-button>
          </el-form-item>
        </el-form>


      </div>


    </el-dialog>
    <!--转让负责人-->
    <el-dialog @close="beforeRoleCloseCharge" :visible.sync="ShowruleFormCharge" width="585px">
      <div slot="title">
      <span class="alertTitle">
       转让负责人
      </span>
      </div>
      <el-form size="mini" :model="FormCharge" :rules="ruleFormCharge" ref="ruleFormCharge" label-width="120px"
               class="demo-ruleForm">

        <el-form-item label="负责人" prop="userId">
          <el-col :span="22">
            <el-select clearable style="width:100%" v-model="FormCharge.userId" filterable value-key="value"
                       :multiple-limit=1 remote placeholder="输入转让负责人的姓名搜索" :remote-method="remoteMethod3"
                       @clear="clear">
              <el-option v-for="item in options43" :key="item.id" :label="item.name +' - '+ item.code"
                         :value="item.id">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button :disabled="$store.state.sys.isClick" class="blueButton" @click="submitCharge('ruleFormCharge')">
            确定
          </el-button>
          <el-button class='marginr-20 piercedBlueButton' @click='ShowruleFormCharge=false'>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
  import axios from "axios";
  import actiqita from '@/components/actiqita'
  import listMixins from "@/mixins/form";
  import { politicsFmt, roleFmt, parseTime } from "@/utils/format";

  export default {
    mixins: [listMixins],
    components: {
      actiqita
    },

    data() {

      return {
        rulebjs: {

          code: [{
            required: true,
            message: '请填写学号',
            trigger: 'blur',
            // validator: validCode
          }
          ],
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }],
          gender: [{
            required: true,
            message: '请选择性别',
            trigger: 'change'
          }],


        },
        ruleFormbj: {
          grade: '',
          major: '',
          college: '',
          politics: '',
          campus: '',
          id: '',
          class: '',
          class2: '',
          code: '',
          name: '',
          ethnicId: 1,
          gender: '1',
          countryCode: '86',
          mobile: ''
        },
        ShowruleFormDuty: false,
        activeName2: "2",
        rules: {
          id: [{
            required: true,
            message: "请选择姓名",
            trigger: "change"
          }],
          joinTime2: [{
            required: true,
            message: "请选择加入时间",
            trigger: "change"
          }]
          // remark: [{
          //   required: true,
          //   message: '请输入备注',
          //   trigger: 'blur'
          // }]
        },
        dataObj2: {
          id: ""
        },

        showfileInfor: false,
        fileInforamtion: {},
        randomData: "",
        fileListName: "",
        fileList: [],
        dialogImportCollegeVisible: false,
        titleName: this.$route.query.nature == 7 ? "党" : "团",
        Uploadlink: this.$route.query.nature == 7 ? "/school/party/import/member" : "/school/group/import/member",
        downHref: this.$route.query.nature == 7 ? "https://2room.oss-cn-beijing.aliyuncs.com/template/%E5%85%9A%E7%BB%84%E7%BB%87%E6%88%90%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx" : "https://2room.oss-cn-beijing.aliyuncs.com/template/%E5%9B%A2%E7%BB%84%E7%BB%87%E6%88%90%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx",
        detail: {},
        active: "orgxiangqing",
        params: {
          current: 1,
          size: 10,
          id: "",
          college: "",
          identity: "",
          code: "",
          nature: "",
          status: 2,
          keyWord: ""
        },
        paramsAcitivity: {
          current: 1,
          size: 10,
          clubId: "",
          startDate: "",
          endDate: "",
          name: ""
        },
        members: [],
        options4: [],
        options43: [],
        activities: [],
        colleges: [{ id: "", name: "全部" }],
        total: 0,
        dialogVisible: false,
        showProgress: false,
        fileUploadPercent: 0,
        showfileInforDetail: false,
        clickAble: true,
        tableDatachenyuan: [],
        ruleForm: {
          joinTime2: "",
          time: "",
          remark: "",
          organizationId: "",
          nature: this.$route.query.nature,
          addmember: []
        },
        ShowruleFormCharge: false,
        FormCharge: {
          userId: ""
        },
        ruleFormDuty: {
          duty: "",
          id: ""
        },
        ruleFormCharge: {
          userId: [{
            required: true,
            message: "请输入书记姓名",
            trigger: "blur"
          }]
        },
        showCharge: false,
        ethnices:[],
        politics: [{id: 0, name: '群众'}, {id: 1, name: '团员'}, {id: 2, name: '党员'}, {id: 3, name: '其他党派'}, {
          id: 4,
          name: '预备党员'
        }],//政治面貌
      };
    },
    methods: {
      submitForms(formName, type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
           if (type == 2) {
              this.$http.post("/school/student/add", this.ruleFormbj).then((res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.dialogVisible = false;
                  this.getMembers();
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      submitDuty(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {

            this.$store.commit("setClick", true);
            this.$http.post("/organization/edit/member/duty", this.ruleFormDuty).then(res => {
              if (res.code == "200") {
                this.$message({
                  type: "success",
                  message: "编辑成功!"
                });
                this.ShowruleFormDuty = false;
                this.getMembers();
              }
            });


          }
        });

      },
      checkAll(row, index) {
        return row.role != 1;
      },
      getEthnic() {
        this.$http.get("school/ethnic/list").then(res => {
          this.ethnices = res.data
        })
      },
      beforeRoleCloseCharge() {
        this.FormCharge.userId = "";
      },
      changeType(val) {
        const that = this;
        that.params.status = val.name;
        that.getMembers();
      },
      remoteMethod3(query) {
        query = query.trim();
        if (query !== "") {
          this.loading = true;
          this.$http.get("/school/students/OrgStudent", {
            params: {
              key: query,
              orgId: this.detail.orgId
            }
          }).then(res => {
            this.options43 = res.data;
          });
        } else {
          this.options43 = [];
        }
      },
      //清除下拉框
      clear() {
        this.options43 = [];
      },
      submitCharge(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.commit("setClick", true);
            this.$http.post("/organization/administration/assignment", {
              userId: this.FormCharge.userId,
              orgId: this.$route.query.id
            }).then(res => {
              if (res.code == "200") {
                this.$message({
                  type: "success",
                  message: "转让负责人成功!"
                });
                this.ShowruleFormCharge = false;
                this.getDataInfo(this.id);
              }
            });
          }
        });
      },
      setAllStatus() {
        let arrAl = [];
        if (this.multipleSelection && this.multipleSelection.length) {
          this.multipleSelection.forEach(item => {
            arrAl.push(item.userId);
          });
        }
        if (arrAl.length) {
          this.$confirm("是否确定将此组织下这" + arrAl.length + "个成员删除,删除后不可恢复，请谨慎操作！", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$http.post("/organization/club/member/delete", {
              userId: arrAl.join(","),
              organizationId: this.id
            }).then(res => {
              if (res.code === "200") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getDataInfo(this.id);
              } else {
                this.$message({
                  type: "error",
                  message: res.msg
                });
              }
            });
          }).catch(() => {
          });
        }
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleAllSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      gettianjiachenyuan() {
        this.dialogVisible = true;
       this. getEthnic()
      },
      quanfan(selection) {
        // if(selection.length!= this.tableDatachenyuan.length) {
        //   console.log('全选')
        // }else {
        //   console.log('全选')
        // }
        console.log(selection);
      },
      dandian(selection, row) {

        // console.log("点点"+row);
        this.ruleForm.addmember = selection;
        console.log(this.ruleForm.addmember);
      },
      cyhandleSelectionChange(val) {
        console.log(val);
        this.ruleForm.addmember = val;

      },
      setProgress(progressInfo) {

        this.showfileInfor = true;
        this.showProgress = true;
        this.showfileInforDetail = false;
        this.fileUploadPercent = 0;
        var s = 1;
        this.Interval = setInterval(() => {
          s++;
          this.fileUploadPercent = s;
          if (s == 90) {
            clearInterval(this.Interval);
          }
        }, 100);
      },
      resetUpload() {
        this.fileList = [];
        this.showfileInfor = false;
        this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        };
        this.$refs.childUpload.closeUpload();
        this.showfileInforDetail = false;
        this.fileUploadPercent = 0;
        this.clickAble = true;
      },
      //显示本地上传发文件
      setFileList(fileList) {
        this.fileList = fileList;
        this.fileListName = fileList[0].name;
      },
      //下载失败模板
      downFailed() {

        axios({
          method: "post",
          url: "school/fail/party/club/members/export",
          responseType: "blob",
          data: {
            nature: this.$route.query.nature,
            randomData: this.randomData
          }

        }).then((res) => {
          if (!res) {
            return;
          }
          var filename = name;
          let url = window.URL.createObjectURL(res);
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "成员失败信息" + ".xlsx");
          document.body.appendChild(link);
          link.click();
        });

      },
      //远程搜索
      remoteMethod(query) {
        if (query !== "") {
          this.loading = true;
          this.$http.get("/school/query/user", {
            params: {
              key: query,
              identity: "1,2"
            }
          }).then(res => {
            this.loading = false;
            this.options4 = res.data;
          });
        } else {
          this.options4 = [];
        }
      },
      submitForm(formName) {
        if (this.ruleForm.addmember.length > 0) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.ruleForm.time = this.ruleForm.joinTime2.getTime();
              this.$http.post("organization/party/member/add", this.ruleForm).then(res => {
                if (res.code == "200") {
                  this.$message({
                    type: "success",
                    message: "添加成功!"
                  });
                  this.dialogVisible = false;
                  this.getMembers();
                }
              });
            }
          });
        } else {
          this.$message({
            type: "error",
            message: "请选择添加成员!"
          });
        }

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      beforeCloseHandler() {
        this.resetForm("ruleForm");
      },
      beforeCloseImportCollegeHandler() {
        this.dialogImportCollegeVisible = false;
        this.$refs.childUpload.closeUpload();
        this.showfileInfor = false;
        this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        };
        this.showfileInforDetail = false;
        this.clickAble = true;
        this.showProgress = false;
        this.fileList = [];
      },
      //导入成功返回
      openfileInfor(res) {
        if (res != false) {
          this.randomData = res.randomData;
          this.showfileInfor = true;
          this.fileInforamtion = res;
          this.fileUploadPercent = 100;
          clearInterval(this.Interval);
          setTimeout(() => {
            this.showfileInfor = true;
            this.showfileInforDetail = true;
            this.showProgress = false;
          }, 2000);
        } else {
          clearInterval(this.Interval);
          this.fileUploadPercent = 0;
          this.showfileInforDetail = false;
          this.showProgress = false;
          this.showfileInfor = false;
          this.clickAble = false;
        }

        // this.dialogImportCollegeVisible = false;
      },
      submitUpload() {
        if (this.clickAble) {
          this.setProgress();
          this.$refs.childUpload.submitUpload2();
        } else {
          this.$message({
            type: "error",
            message: "请重新上传文件"
          });
          return;
        }

      },
      deleteMember(id, orgId) {
        this.$confirm("是否删除该成员?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http.post("/organization/club/member/delete", {
            userId: id,
            organizationId: orgId
          }).then(() => {
            this.getMembers();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
      },
      setAdmin(orgId, id, identity, type) {
        this.$confirm(type == 1 ? "是否确定设为管理员?" : "是否确定取消管理员?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http.post("/organization/club/set-admin", {
            orgId: orgId,
            id: id,
            isAdmin: type
          }).then((res) => {
            if (res.code == 200) {
              this.getMembers();
              this.$message({
                type: "success",
                message: "操作成功!"
              });
            }

          });

        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });

      },
      modifyDuty(row) {
        this.ruleFormDuty.id = row.id;
        this.ruleFormDuty.duty = row.duty;

        this.ShowruleFormDuty = true;
      },
      getDataInfo(id) {
        if (!id) {
          this.loading = false;
          return;
        }
        this.$http.get("/school/classes", {
          params: {
            classId: id,
            current: 0,
            size: 10
          }
        }).then(res => {
          this.detail = res.data.list[0];
          this.ruleFormbj.grade = res.data.list[0].gradeId;
          this.ruleFormbj.major = res.data.list[0].majorId;
          this.ruleFormbj.college = res.data.list[0].collegeId;
          this.ruleFormbj.campus = res.data.list[0].campusId;
          this.ruleFormbj.class = res.data.list[0].id;
          this.loading = true;
          if (res.data.secretaryName != "" && res.data.secretaryName != null) {
            this.showCharge = true;
          }
          this.getMembers();
        }).catch(err => {
          this.loading = false;
        });
      },
      changeTab(tab) {
        this.active = tab.name;
        this.search();
      },
      changePage(current, size) {

        this.params.current = current;
        this.params.size = size;
        this.getMembers();
      },
      getMembers() {

        this.$http.get("/organization/party/member/list", { params: this.params }).then(res => {
          this.members = res.data.list;
          this.total = res.data.total;
        });
      },
      // getActivities() {
      //   this.paramsAcitivity.clubId = this.id;
      //   this.$http.get("/organization/club/activities", { params: this.paramsAcitivity }).then(res => {
      //     this.activities = res.data.list;
      //     // this.total = res.data.total
      //   });
      // },
      search() {
        this.params.current = 1;
        if (this.active == "member") {
          this.getMembers();
        } else if (this.active == "activity") {
          // this.getActivities();
        }
      }
    },
    created() {
      this.params.id = this.$route.query.id;
      this.dataObj2.id = this.$route.query.id;
      this.getDataInfo(this.$route.query.classId);
      this.ruleForm.organizationId = this.$route.query.id;
    },
    mounted() {
    },
    filters: {
      roleFmt(val) {
        return roleFmt(val);
      }, parseTime(val) {
        return parseTime(val);
      },
      politicsFmt(val) {
        return politicsFmt(val);
      },
      formatLimitType(limitType) {
        if (limitType == 0) {
          limitType = "无";
        } else if (limitType == 1) {
          limitType = localStorage.getItem("compulsoryName");
        } else if (limitType == 2) {
          limitType = localStorage.getItem("electiveName");
        }
        return limitType;
      }
    }
  };
</script>
<style>
  .demo-ruleForm .el-table__header .el-table-column--selection .cell .el-checkbox:after {
    color: #909399;
    content: "全选";
    font-size: 14px;
    margin-left: 12px;
  }
</style>
<style scoped lang="scss">
  .detail {
    padding: 10px 20px;
  }

  .detail-avatar {
    width: 100px;
    width: 100px;
    border-radius: 50px;
  }

  .xinxitou {
    border-radius: 5px;
    padding: 8px;
    background: rgb(190, 224, 247);
    padding-left: 18px;
    margin-bottom: 15px;
  }

  .nomarglf {
    margin-left: 0 !important;
  }
</style>

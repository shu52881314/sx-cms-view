<template>
  <section>

    <el-dialog :title='"添加" + titleName +"员"' @close="beforeCloseHandler" :visible.sync="dialogVisible"
               :close-on-click-modal="false" width="550px">

      <div>
        <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-table
            ref="multipleTablecy"
            :data="tableDatachenyuan"
            tooltip-effect="dark"
            style="width: 100%;"
            @selection-change="handleSelectionChanges"
          >
            <el-table-column
              type="selection"
              width="100%">
            </el-table-column>
            <el-table-column
              prop="name"
              label="成员"
              width="100%">
            </el-table-column>
            <el-table-column
              label="学号"
              prop="code"
              width="100%">
            </el-table-column>
          </el-table>
          <el-form-item :label='"入" + titleName + "日期"' prop="joinTime2">
            <el-date-picker style="width:300px"
                            v-model="ruleForm.joinTime2"
                            type="date"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <!-- <el-form-item label="备注" prop="remark">
            <el-input  maxLength="1000" type="textarea" v-model="ruleForm.remark "></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="联系方式" prop="contact">
            <el-input style="width:300px" v-model="ruleForm.contact" placeholder="请输入联系方式"></el-input>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">添加团员</el-button>
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

    <el-dialog title="设置入团时间"
               :visible.sync='updateJoinTimeVisible'
               @close="updateJoinTimeVisible = false,temp.joinTime = '',temp.time = ''"
               :close-on-click-modal="false"
               width='400px'>
      <el-form size="mini">
        <el-form-item :label='"入" + titleName + "日期"' prop="joinTime2">
          <el-date-picker style="width:300px"
                          v-model="temp.time"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="updateJoinTimeVisible = false">取消</el-button>
          <el-button type="primary" @click="updateJoinTimeFunction">确认</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <back></back>
    <div class="main-body">
      <el-tabs v-model="active" @tab-click="changeTab">
        <el-tab-pane label="组织详情" name="orgxiangqing">
          <p class="xinxitou">基本信息</p>
          <div class="detail">
            <el-form size="mini" :model="detail" ref="detail" label-width="100px" class="detail" label-position="left">
              <el-form-item label="logo">
                <el-col :span="22">
                  <img :src="detail.logo" alt="组织LOGO"
                       style="display: inline-block;margin: 15px;width: 100px;height: 100px;margin-bottom: 0"
                       class="nomarglf" onerror="onerror=null;src='/static/images/dstp.png'">
                </el-col>
              </el-form-item>
              <el-form-item label="组织名称" prop="name">
                <el-col :span="22">
            <span>
                {{detail.orgName}}
            </span>
                </el-col>
              </el-form-item>
              <el-form-item v-if="type == 0" label="组织类型" prop="name">
                <el-col :span="22">
                  <span>
                      {{detail.nature | orgTypeFmt}}
                  </span>
                </el-col>
              </el-form-item>

              <el-form-item v-if="type == 0" label="组织级别">
                <el-col :span="22">
                  <span>
                      {{detail.level == 1 ? '校级' :  detail.level == 2 ? '院系级' : '未知类型'}}
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
              <el-form-item v-if="(type == 0 && detail.level == 2) || type != 0" label="所属院系" prop="collegeId">
                <el-col :span="22">
                  <span>
                      {{detail.collegeName}}
                  </span>
                </el-col>
              </el-form-item>
              <el-form-item v-if="type != 0" label="所属专业" prop="majorId">
                <el-col :span="22">
                <span>
                    {{detail.majorName}}
                </span>
                </el-col>
              </el-form-item>
              <el-form-item v-if="type != 0" label="所属年级" prop="grade">
                <el-col :span="22">
                  <span>
                      {{detail.gradeName}}
                  </span>
                </el-col>
              </el-form-item>

              <el-form-item v-if="type == 0" label="加入规则" prop="grade">
                <el-col :span="22">
                  <span>
                      {{detail.rule  | orgRuleFmt}}
                  </span>
                </el-col>
              </el-form-item>

              <el-form-item label="负责人">
                <el-col :span="22">
                  <span>
                      {{detail.fuzeName}} - {{detail.fuzeCode}}
                  </span>
                </el-col>
              </el-form-item>

              <el-form-item v-if="type != 0" label="辅导员">
                <el-col :span="22">
                  <span>
                      {{detail.fudaoName}} - {{detail.fudaoCode}}
                  </span>
                </el-col>
              </el-form-item>

              <el-form-item v-if="type == 0" label="指导老师">
                <el-col :span="22">
                  <span>
                      {{detail.zhidaoName}} - {{detail.zhidaoCode}}
                  </span>
                </el-col>
              </el-form-item>

              <el-form-item v-if="type == 0" label="挂靠机构">
                <el-col :span="22">
                  <span>
                      {{detail.guakaoName ? detail.guakaoName : '无'}}
                  </span>
                </el-col>
              </el-form-item>


              <el-form-item v-if="type == 0" label="上级机构/组织">
                <el-col :span="22">
                  <span>
                      {{detail.parentName ? detail.parentName : '无'}}
                  </span>
                </el-col>
              </el-form-item>

              <el-form-item label="组织简介">
                <el-col :span="22">
                  <span>
                      {{detail.introduce}}
                  </span>
                </el-col>
              </el-form-item>



              <el-form-item label="风采展示">
                <el-col :span="22">
                  <span v-for="imgurl in detail.miens">
                 <img @click="geturl(imgurl.url)" :src="imgurl.url" alt=""
                      style="display: inline-block;margin: 15px;width: 100px;height: 100px;margin-bottom: 0"
                      class="nomarglf">
                  </span>

                </el-col>
              </el-form-item>
            </el-form>
            <el-row class="org-tips">
              审核信息
            </el-row>
            <el-row>
              <el-button @click="showProcess" style="margin:1rem" type="primary">
                查看所有记录
              </el-button>
              <el-table border :loading="loading" :data="processList" stripe size="mini" style="width: 100%">
                <el-table-column label="审核内容" show-overflow-tooltip>
                  <el-row slot-scope="scope">
                    {{scope.row.changeType | changeTypeFmt}}
                  </el-row>
                </el-table-column>
                <el-table-column width="500" label="变更详情" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <!--图片-->
                    <div style="overflow: auto;" v-if="scope.row.changeLast.indexOf('http') > -1||scope.row.changeLast.indexOf('https') > -1">
                      <img @click="geturl(item)" style="padding: .4rem" width="64px" height="64px" :src="item" alt=""
                           v-if="scope.row.changeFist.indexOf('http') > -1||scope.row.changeFist.indexOf('https') > -1"  v-for="(item,index) in scope.row.changeFist.split('|')" >
                      <span v-else>
                       由 '无'
                      </span>
                      改变成
                      <img @click="geturl(item)" style="padding: .4rem" width="64px" height="64px" :src="item" alt=""
                           v-for="(item,index) in scope.row.changeLast.split('|')">
                    </div>

                    <div v-else>
                      {{scope.row.changeContent}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="subManName" label="提交人" show-overflow-tooltip></el-table-column>
                <el-table-column prop="sunTime" label="提交时间" show-overflow-tooltip>
                  <el-row slot-scope="scope">
                    {{scope.row.sunTime | parseTime}}
                  </el-row>
                </el-table-column>
                <el-table-column label="状态" show-overflow-tooltip>
                  <el-row slot-scope="scope">
                    {{scope.row.idea | ideaFmt}}
                  </el-row>
                </el-table-column>
                <el-table-column prop="remark" label="操作" show-overflow-tooltip>
                  <el-row slot-scope="scope">
                    <el-button type="text" @click.native="adoptt(scope.row)">通过</el-button>
                    <el-button @click.native="reject(scope.row)" type="text" style="color: #e8962e">驳回</el-button>
                  </el-row>
                </el-table-column>

              </el-table>
            </el-row>

            <!--审核记录列表-->
            <el-dialog title="审核记录" :visible.sync="dialogProcessVisible">
              <el-table border :loading="isLoading" :data="processAllList" stripe size="mini" style="width: 100%">
                <el-table-column label="审核内容" show-overflow-tooltip>
                  <el-row slot-scope="scope">
                    {{scope.row.changeType | changeTypeFmt}}
                  </el-row>
                </el-table-column>
                <el-table-column width="400" label="变更详情" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <!--图片-->
                    <div style="overflow: auto;" v-if="scope.row.changeLast.indexOf('http') > -1||scope.row.changeLast.indexOf('https') > -1">
                      <img @click="geturl(item)" style="padding: .4rem" width="64px" height="64px" :src="item" alt=""
                           v-if="scope.row.changeFist.indexOf('http') > -1||scope.row.changeFist.indexOf('https') > -1"  v-for="(item,index) in scope.row.changeFist.split('|')" >
                      <span v-else>
                       由 '无'
                      </span>
                      改变成
                      <img @click="geturl(item)" style="padding: .4rem" width="64px" height="64px" :src="item" alt=""
                           v-for="(item,index) in scope.row.changeLast.split('|')">
                    </div>

                    <div v-else>
                      {{scope.row.changeContent}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="subManName" label="提交人" show-overflow-tooltip></el-table-column>
                <el-table-column prop="sunTime" label="提交时间" show-overflow-tooltip>
                  <el-row slot-scope="scope">
                    {{scope.row.sunTime | parseTime}}
                  </el-row>
                </el-table-column>
                <el-table-column label="审核时间" show-overflow-tooltip>
                  <el-row slot-scope="scope">
                    {{scope.row.auditTime | parseTime}}
                  </el-row>
                </el-table-column>
                <el-table-column label="状态" show-overflow-tooltip>
                  <el-row slot-scope="scope">
                    {{scope.row.idea | ideaFmt}}
                  </el-row>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
              </el-table>
              <qu-pagination :current="paramsAudit.current" :total="totals" @change="changePageProcess"
                             ref="mychild"></qu-pagination>
            </el-dialog>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="type == 1" label="成员" name="member">
          <el-tabs v-model="activeName2" type="card" @tab-click="changeType">
            <el-tab-pane label="当前成员" name="2">
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
                  <el-table-column label="政治面貌">
                    <template slot-scope="scope">
                      {{scope.row.politics | politicsFmt}}
                    </template>
                  </el-table-column>
                  <el-table-column label="角色">
                    <template slot-scope="scope">
                      {{scope.row.role | roleFmt}}
                    </template>
                  </el-table-column>

                  <el-table-column label="入团时间">
                    <template slot-scope="scope">
                      {{scope.row.joinTime | parseTime}}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="220" align="center">
                    <div slot-scope="scope">
                      <el-button v-if="scope.row.role != 1" @click="deleteMember(scope.row.userId,scope.row.orgId)"
                                 type="text"
                                 class="opreat-btn">删除
                      </el-button>
                      <el-button type="text" @click="updateJoinTime(scope.row)">编辑入团时间</el-button>
                      <el-button v-if="scope.row.role == 1" @click="ShowruleFormCharge = true" type="text"
                                 class="opreat-btn">转让负责人
                      </el-button>

                      <!--<el-button @click="setAdmin(scope.row.orgId,scope.row.id,scope.row.role,1)"
                                 v-if="scope.row.role == 3" type="text"
                                 class="opreat-btn">设为管理员
                      </el-button>
                      <el-button @click="setAdmin(scope.row.orgId,scope.row.id,scope.row.role,0)"
                                 v-if="scope.row.role == 2" type="text"
                                 class="opreat-btn">取消管理员
                      </el-button>-->
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
            </el-tab-pane>
            <el-tab-pane label="待审成员" name="1">
              <el-form size="mini" :inline="true" class="demo-form-inline">
                <!-- <el-form-item label="操作类型">
                   <el-input v-model="params.code" placeholder="请输入学号搜索"></el-input>
                 </el-form-item>-->
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
                  <!--						<el-table :loading="loading" :data="members" stripe size="mini" style="width: 100%">-->

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
                      <el-button type="text" @click="adopt(scope.row.id,2)" class="opreat-btn">通过</el-button>
                      <el-button type="text" @click="adopt(scope.row.id,0)" class="opreat-btn">驳回</el-button>
                    </div>
                  </el-table-column>
                </el-table>
              </div>
              <div style="width:98%;margin:0 auto;font-size:14px;padding-top:30px;">
              <span style="display:block;float:left;">
                <el-button size="mini" type="primary" @click="listAdopt(2)">批量通过</el-button>
                <el-button size="mini" type="primary" @click="listAdopt(0)">批量驳回</el-button>
              </span>
                <div class="block text-center" style="float: right;">
                  <qu-pagination :total="total" @change="changePage"></qu-pagination>
                </div>
              </div>

            </el-tab-pane>
          </el-tabs>

        </el-tab-pane>
      </el-tabs>
    </div>

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
    <el-dialog :visible.sync="dialogVisibleImg">
      <img width="100%" :src="tempImg" alt="">
    </el-dialog>
  </section>
</template>

<script>
  import axios from 'axios'
  import listMixins from '@/mixins/form';
  import {politicsFmt, roleFmt, parseTime,orgTypeFmt,orgRuleFmt} from '@/utils/format'
  import actiqita from '@/components/actiqita'

  export default {
    mixins: [listMixins],
    components: {
      actiqita
    },
    data() {
      return {
        dialogVisibleImg: false,
        tempImg: '',
        loading: false,
        processList: [],
        isLoading: false,
        processAllList: [],
        dialogProcessVisible: false,
        updateJoinTimeVisible: false,
        activeName2: '2',
        rules: {
          id: [{
            required: true,
            message: '请选择姓名',
            trigger: 'change'
          }],
          joinTime2: [{
            required: true,
            message: '请选择加入时间',
            trigger: 'change'
          }],
          // remark: [{
          //   required: true,
          //   message: '请输入备注',
          //   trigger: 'blur'
          // }]
        },
        dataObj2: {
          id: ''
        },
        showfileInfor: false,
        fileInforamtion: {},
        randomData: '',
        fileListName: '',
        fileList: [],
        dialogImportCollegeVisible: false,
        titleName: '团',
        Uploadlink: this.$route.query.nature == 7 ? '/school/party/import/member' : '/school/group/import/member',
        downHref: this.$route.query.nature == 7 ? 'https://2class.oss-cn-shenzhen.aliyuncs.com/template/%E5%85%9A%E7%BB%84%E7%BB%87%E6%88%90%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx' : 'https://2class.oss-cn-shenzhen.aliyuncs.com/template/%E5%9B%A2%E7%BB%84%E7%BB%87%E6%88%90%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx',
        detail: {},
        active: 'orgxiangqing',
        params: {
          current: 1,
          size: 10,
          id: '',
          college: '',
          identity: '',
          code: '',
          nature: '',
          status: 2,
          keyWord: ''
        },
        type: '',
        orgId: '',
        postUrl: '',
        paramsAudit: {
          type: '',
          orgId: '',
          current: 1,
          size: 10,
        },
        multipleSelection: [],
        paramsAcitivity: {
          current: 1,
          size: 10,
          clubId: '',
          startDate: '',
          endDate: '',
          name: '',
        },
        members: [],
        options4: [],
        options43: [],
        activities: [],
        colleges: [{id: '', name: '全部'}],
        total: 0,
        dialogVisible: false,
        showProgress: false,
        fileUploadPercent: 0,
        showfileInforDetail: false,
        clickAble: true,
        tableDatachenyuan: [],
        ruleForm: {
          joinTime2: '',
          time: '',
          remark: '',
          organizationId: '',
          nature: this.$route.query.nature,
          addmember: [],
        },
        ShowruleFormCharge: false,
        FormCharge: {
          userId: ''
        },
        ruleFormCharge: {
          userId: [{
            required: true,
            message: '请输入负责人姓名',
            trigger: 'blur'
          }]
        },
        showCharge: false,
        temp: {
          time: '',
          joinTime: '',
          userIds: '',
        },
        totals: 0,
      }
    },
    methods: {
      adoptt(item) {
        const that = this;
        that.$confirm('确定审核通过此项目？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = new Object();
          param.applyId = item.applyId;
          param.idea = 1;
          that.$http.post('/organization/auditOrg', param).then(res => {
            console.log(res)
            if (res.code == 200) {
              that.$message({
                type: 'success',
                message: '操作成功'
              });
              that.initOrgProcess();
            } else {
              that.$message({
                type: 'warning',
                message: '操作失败，请联系管理员'
              });
            }
          })
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消审核'
          });
        });
      },
      reject(item) {
        const that = this;
        that.$prompt('请输入驳回原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{1,50}$/,
          inputErrorMessage: '驳回原因1到40个字符'
        }).then(({value}) => {
          let param = new Object();
          param.applyId = item.applyId;
          param.idea = 0;
          param.remark = value;
          that.$http.post('/organization/auditOrg', param).then(res => {
            console.log(res)
            if (res.code == 200) {
              that.$message({
                type: 'success',
                message: '驳回成功'
              });
              that.initOrgProcess();
            } else {
              that.$message({
                type: 'warning',
                message: '操作失败，请联系管理员'
              });
            }
          })
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '取消驳回操作'
          });
        });
        console.log(item)
      },
      geturl(url) {
        this.tempImg = url;
        this.dialogVisibleImg = true;
      },
      showProcess() {
        const that = this;
        that.dialogProcessVisible = true;
        that.loadList();
      }, initOrgProcess() {//初始化组织流程
        const that = this;
        that.loading = true;
        that.$http.get('/organization/auditList', {
          params: {
            orgId: that.orgId,
            type: 1,
            current: 1,
            size: 100
          }
        }).then(res => {
          if (res.code == 200) {
            that.loading = false
            that.processList = res.data.list
          }
        })
      },
      changePageProcess(current, size) {
        this.paramsAudit.current = current
        this.paramsAudit.size = size
        this.loadList()
      },
      loadList() {
        const that = this;
        that.isLoading = true
        that.paramsAudit.orgId = that.orgId;
        that.$http.get('/organization/auditList', {params: that.paramsAudit}).then(res => {
          if (res.code == 200) {
            that.processAllList = res.data.list
            that.totals = res.data.total
            that.isLoading = false
          }
        })
      },
      listAdopt(status) {//批量审核
        if (this.multipleSelection.length <= 0) {
          this.$message({
            type: 'error',
            message: '至少选择一名成员!'
          });
          return;
        } else {
          let arrAl = []
          if (this.multipleSelection && this.multipleSelection.length) {
            this.multipleSelection.forEach(item => {
              arrAl.push(item.id)
            })
          }
          this.adopt(arrAl.join(','), status);
        }
      },
      adopt(id, status) {
        if (status == 2) {
          this.$confirm('确定通过该申请吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/organization/party/audit', {
              ids: id,
              status: status,
            }).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '审核成功!'
                });
                this.getDataInfo(this.id)
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            })
          })
        } else {
          this.$prompt('请输入驳回原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputErrorMessage: '请输入驳回原因'
          }).then(({value}) => {
            this.$http.post('/organization/party/audit', {
              ids: id,
              status: status,
              remark: value
            }).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '驳回成功!'
                });
                this.getDataInfo(this.id)
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        }
      },
      updateJoinTimeFunction() {//设置入团时间
        const that = this;
        that.temp.joinTime = that.temp.time.getTime();
        that.$http.post("/organization/party/editJoinDate", that.temp).then(res => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            that.updateJoinTimeVisible = false;
            that.search();
          }

        })
      },
      updateJoinTime(item) {//编辑入团时间
        const that = this;
        that.updateJoinTimeVisible = true;
        that.temp.time = item.joinTime;
        that.temp.userIds = item.userId;
      },
      checkAll(row, index) {
        return row.role != 1;
      },
      beforeRoleCloseCharge() {
        this.FormCharge.userId = '';
      },
      changeType(val) {
        const that = this;
        that.params.status = val.name;
        that.getMembers();
      },
      remoteMethod3(query) {
        query = query.trim()
        if (query !== '') {
          this.loading = true;
          this.$http.get("/school/students/OrgStudent", {
            params: {
              key: query,
              orgId: this.orgId,
            }
          }).then(res => {
            this.options43 = res.data
          })
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
            this.$store.commit('setClick', true)
            this.$http.post("/organization/administration/assignment", {
              userId: this.FormCharge.userId,
              orgId: this.orgId
            }).then(res => {
              if (res.code == '200') {
                this.$message({
                  type: 'success',
                  message: '转让负责人成功!'
                });
                this.ShowruleFormCharge = false
                this.getDataInfo(this.id)
              }
            })
          }
        })
      },
      setAllStatus() {
        let arrAl = []
        if (this.multipleSelection && this.multipleSelection.length) {
          this.multipleSelection.forEach(item => {
            arrAl.push(item.userId)
          })
        }
        if (arrAl.length) {
          this.$confirm('是否确定将此组织下这' + arrAl.length + '个成员删除,删除后不可恢复，请谨慎操作！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/organization/club/member/delete', {
              userId: arrAl.join(","),
              organizationId: this.id
            }).then(res => {
              if (res.code === '200') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getDataInfo(this.id)
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            })
          }).catch(() => {
          })
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
        this.dialogVisible = true
        this.$http.get('/organization/party/classuser', {
          params: {
            orgId: this.$route.query.id,
            classId: this.$route.query.classId
          }
        }).then(res => {
          this.tableDatachenyuan = res.data

        }).catch(err => {
        });
      },
      quanfan(selection) {
        // if(selection.length!= this.tableDatachenyuan.length) {
        //   console.log('全选')
        // }else {
        //   console.log('全选')
        // }
        console.log(selection)
      },
      handleSelectionChanges(val) {
        this.ruleForm.addmember = val;
      },

      cyhandleSelectionChange(val) {
        console.log(val)
        this.ruleForm.addmember = val;

      },
      setProgress(progressInfo) {

        this.showfileInfor = true
        this.showProgress = true
        this.showfileInforDetail = false
        this.fileUploadPercent = 0
        var s = 1
        this.Interval = setInterval(() => {
          s++
          this.fileUploadPercent = s
          if (s == 90) {
            clearInterval(this.Interval);
          }
        }, 100)
      },
      resetUpload() {
        this.fileList = []
        this.showfileInfor = false
        this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.$refs.childUpload.closeUpload();
        this.showfileInforDetail = false
        this.fileUploadPercent = 0
        this.clickAble = true
      },
      //显示本地上传发文件
      setFileList(fileList) {
        this.fileList = fileList
        this.fileListName = fileList[0].name
      },
      //下载失败模板
      downFailed() {

        axios({
          method: 'post',
          url: 'school/fail/party/club/members/export',
          responseType: 'blob',
          data: {
            nature: this.$route.query.nature,
            randomData: this.randomData
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
          link.setAttribute('download', '成员失败信息' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })

      },
      //远程搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          this.$http.get("/school/query/user", {
            params: {
              key: query,
              identity: '1,2'
            }
          }).then(res => {
            this.loading = false;
            this.options4 = res.data
          })
        } else {
          this.options4 = [];
        }
      },
      submitForm(formName) {

        if (this.ruleForm.addmember.length > 0) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.ruleForm.time = this.ruleForm.joinTime2.getTime()
              this.$http.post("organization/party/member/add", this.ruleForm).then(res => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.dialogVisible = false
                  this.getMembers()
                }
              })
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '请选择添加成员!'
          });
        }

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      beforeCloseHandler() {
        this.resetForm('ruleForm');
      },
      beforeCloseImportCollegeHandler() {
        this.dialogImportCollegeVisible = false;
        this.$refs.childUpload.closeUpload();
        this.showfileInfor = false
        this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.showfileInforDetail = false
        this.clickAble = true
        this.showProgress = false
        this.fileList = []
      },
      //导入成功返回
      openfileInfor(res) {
        if (res != false) {
          this.randomData = res.randomData
          this.showfileInfor = true
          this.fileInforamtion = res
          this.fileUploadPercent = 100
          clearInterval(this.Interval);
          setTimeout(() => {
            this.showfileInfor = true
            this.showfileInforDetail = true
            this.showProgress = false;
          }, 2000)
        } else {
          clearInterval(this.Interval);
          this.fileUploadPercent = 0
          this.showfileInforDetail = false
          this.showProgress = false
          this.showfileInfor = false
          this.clickAble = false
        }

        // this.dialogImportCollegeVisible = false;
      },
      submitUpload() {
        if (this.clickAble) {
          this.setProgress()
          this.$refs.childUpload.submitUpload2()
        } else {
          this.$message({
            type: 'error',
            message: '请重新上传文件'
          });
          return;
        }

      },
      deleteMember(id, orgId) {
        this.$confirm('是否删除该成员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/organization/club/member/delete', {
            userId: id,
            organizationId: orgId,
          }).then(() => {
            this.getMembers();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      setAdmin(orgId, id, identity, type) {
        this.$confirm(type == 1 ? '是否确定设为管理员?' : '是否确定取消管理员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/organization/club/set-admin', {
            orgId: orgId,
            id: id,
            isAdmin: type
          }).then((res) => {
            if (res.code == 200) {
              this.getMembers();
              this.$message({
                type: 'success',
                message: '操作成功!'
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
      getDataInfo(id) {
        if (!id) {
          this.loading = false;
          return;
        }
        this.$http.get(this.postUrl, {
          params: {
            orgId: id
          }
        }).then(res => {
          this.detail = res.data
          this.loading = true;
          this.params.nature = res.data.nature
          if (res.data.secretaryName != '' && res.data.secretaryName != null) {
            this.showCharge = true
          }
          this.getMembers()
          this.loadList()
          this.initOrgProcess()
        }).catch(err => {
          this.loading = false;
        });
      },
      changeTab(tab) {
        this.active = tab.name
        this.search()
      },
      changePage(current, size) {
        this.params.current = current
        this.params.size = size
        this.getMembers()
      },
      getMembers() {
        this.$http.get('/organization/party/member/list', {params: this.params}).then(res => {
          this.members = res.data.list
          this.total = res.data.total
        })
      },
      getActivities() {
        this.paramsAcitivity.clubId = this.id
        this.$http.get('/organization/club/activities', {params: this.paramsAcitivity}).then(res => {
          this.activities = res.data.list
          // this.total = res.data.total
        })
      },
      search() {
        this.params.current = 1
        if (this.active == 'member') {
          this.getMembers()
        } else if (this.active == 'activity') {
          // this.getActivities()
        }
      }
    }
    ,
    created() {
      const that = this;
      that.orgId = that.$route.query.id;
      that.type = that.$route.query.type;
      if (that.type == 0) {
        that.postUrl = '/organization/studentOrg/detail'
      } else {//班团班级接口
        if (that.type == 2) {
          that.prefixStr = '班级';
        } else {
          that.prefixStr = '班团';
        }
        that.postUrl = '/organization/classGroup/detail'
      }
      this.params.id = this.id
      this.dataObj2.id = this.id
      this.getDataInfo(that.orgId)

      this.ruleForm.organizationId = this.id
    }
    ,
    mounted() {
    }
    ,
    filters: {
      orgRuleFmt(val){
        return orgRuleFmt(val);
      },
      orgTypeFmt(val){
        return orgTypeFmt(val);
      },
      parseTime(time) {
        return parseTime(time, '{y}-{m}-{d}');
      },
      NatureFmt(val) {//类型转换器
        switch (val) {
          case 1:
            return '学生会'
          case 2:
            return '社团协会'
          case 3:
            return '其他'
          default:
            return '其他'
        }
      }, LevelFmt(val) {
        switch (val) {
          case 1:
            return '校级'
          case 2:
            return '院系级'
          default:
            return '未知级'
        }
      }, RuleFmt(val) {
        switch (val) {
          case 1:
            return '申请后加入'
          case 2:
            return '允许任何人加入'
          case 3:
            return '不允许任何人加入'
          default:
            return '未知规则'
        }
      }, ideaFmt(val) {
        switch (val) {
          case 0:
            return '驳回'
          case 1:
            return '同意'
          case 2:
            return '审核中'
          default:
            return '未知状态'
        }
      }, changeTypeFmt(val) {
        switch (val) {
          case 1:
            return '成员角色变更负责人'
          case 2:
            return '成员角色变更管理员'
          case 3:
            return '变更LOGO'
          case 4:
            return '变更加入规则'
          case 5:
            return '更改简介'
          case 6:
            return '更改风采'
          default:
            return '未知'
        }
      },
      roleFmt(val) {
        return roleFmt(val);
      }
      ,
      politicsFmt(val) {
        return politicsFmt(val);
      }
      ,
      formatLimitType(limitType) {
        if (limitType == 0) {
          limitType = '无'
        } else if (limitType == 1) {
          limitType = localStorage.getItem("compulsoryName")
        } else if (limitType == 2) {
          limitType = localStorage.getItem("electiveName");
        }
        return limitType;
      }
    }
  }
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

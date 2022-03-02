<template>
  <section>
    <a class="cms-back" href="javascript:void(0)" @click="goBack()"></a>
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
              <button  class="uploadLocal-btnReset" @click="resetUpload">重新上传</button>
              <button class="uploadLocal-btnSubmit"  @click="submitUpload">确认导入</button>
            </div>
          </div>

          <el-form v-show="!fileList.length" size='mini' label-width='12px'>
            <div class="importTipsTitle">
                  <span class="importTipsTitle-left">
                     请下载导入模板，按格式修改后导入
                  </span>
              <span class="importTipsTitle-right">
                    <a class="el-button el-button--text el-button--mini" href='/static/tpls/补录报名人员导入模板.xlsx' size='mini' >模板下载</a>
                  </span>
            </div>
            <el-form-item label="" prop="name">
              <el-col :span="22" >
                <upload-file
                  ref="childUpload"
                  :dataObj="dataObj2"
                  uploadUrl="/school/activity/members"
                  uploadType=".xls,.xlsx"
                  uploadSzie="100"
                  uploadSzieTips="只能上传xlx/xlsx文件，且不超过100MB!"
                  @fileInfor="openfileInfor"
                  @setFileList="setFileList"
                  @setProgress="setProgress"
                >
                </upload-file>
              </el-col>
            </el-form-item>
          </el-form>

        </div>
        <div class="progress-line" v-if="showProgress ">
          <el-progress :stroke-width="18" :percentage="fileUploadPercent" style="margin-top:30px;" ></el-progress>
          <p style="text-align: center;padding: 20px 0px 10px;">正在上传，请您耐心等待...</p>
          <span style="display: block; text-align: center; font-size: 13px; color: #999">请勿关闭浏览窗口</span>
        </div>
        <div class="importFail"  v-show="showfileInforDetail  && fileInforamtion.total != fileInforamtion.success">
          <div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_fail@2x.png'></div>
          <div class="importFail-tips">
            <span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功，<span style="color:#FFC600;">{{fileInforamtion.failed}}</span>条导入失败 <span @click="downFailed()" style="cursor:pointer;color:#4D98FF" v-if="fileInforamtion.failed">下载失败列表</span>
          </div>
          <div class="uploadLocal-btn">
            <button  class="uploadLocal-btnReset" @click="resetUpload">重新导入</button>
          </div>
        </div>

        <div class="importSuccess" v-show="showfileInforDetail && fileInforamtion.total == fileInforamtion.success">
          <div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_success@2x.png'></div>
          <div class="importFail-tips">
            <span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功
          </div>
          <div class="uploadLocal-btn">
            <button  class="uploadLocal-btnReset" @click="resetUpload">继续导入</button>
          </div>
        </div>


      </div>
    </el-dialog>
    <el-dialog title="通过" :visible.sync="dialoghd" :close-on-click-modal="false" width="500px">
      <el-form size="mini" label-width="60px" :model="ruleFormPass" :rules="rules" ref="ruleFormPass" class="demo-ruleForm">

        <el-form-item   prop="hours" :label="hoursUnit">
          <el-col :span="22">
            <el-input :maxlength="7" :placeholder="'请输入' + hoursUnit" v-model="ruleFormPass.hours"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormPass('ruleFormPass')" >确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="驳回" :visible.sync="dialogbhhd" :close-on-click-modal="false" width="30%">
      <el-form size="mini" :model="ruleFormRejecthd" ref="ruleFormReject" class="demo-ruleForm">
        <el-form-item prop="name">
          <el-col :span="22">
            <el-input type="textarea" placeholder="请输入驳回理由(50字以内)" :maxlength="50" v-model="ruleFormRejecthd.auditRemark"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormReject()" >确定</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <el-dialog title="驳回" :visible.sync="dialogVisibleAdopt" :close-on-click-modal="false" width="30%">
      <el-form size="mini" :model="ruleFormReject" ref="ruleFormReject" class="demo-ruleForm">
        <el-form-item prop="name">
          <el-col :span="22">
            <el-input type="textarea" placeholder="请输入驳回理由(50字以内)" :maxlength="50" v-model="ruleFormReject.auditRemark"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="shenhedell()">确定</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <el-dialog :title="'修改'+hoursUnit" :visible.sync="xfdoc" :close-on-click-modal="false" width="30%">
      <el-form size="mini" :model="xfobj" ref="ruleFormReject" class="demo-ruleForm">
        <el-form-item :label="'活动'+hoursUnit+'：'">
          <el-col :span="22">
            <!-- <el-input type="text" maxlength="8" @input="xfobj.hours=xfobj.hours.replace(/[^\d^\.]+/g,'')" placeholder="请输入" v-model="xfobj.hours"></el-input> -->
            <el-input type="text" maxlength="8" @input="xfobj.hours=xfobj.hours.replace(/[^\-?\d.]/g,'')" placeholder="请输入" v-model="xfobj.hours"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="备 注:">
          <el-col :span="22">
            <el-input type="textarea" placeholder="请输入备注(50字以内)" :maxlength="50" v-model="xfobj.remark"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="记录违约:" v-if="xfobj.hours != '' && (xfobj.hours == 0 || xfobj.hours < 0)" >
          <el-col :span="22">
            <el-radio-group v-model="xfobj.foul">
              <el-radio label="0">否（不扣减诚信分）</el-radio>
              <el-radio label="1">是（扣减诚信分）</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button @click="xfdoc = false">取 消</el-button>
          <el-button v-if="num==1" type="primary" @click="xiugai()">确定</el-button>
          <el-button v-if="num==2" type="primary" @click="pilaingfafang()">确定</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <el-dialog title="作业" :visible.sync="zylists" :close-on-click-modal="false" width="30%">
      <el-form size="mini"  ref="ruleFormReject" class="demo-ruleForm">
        <el-form-item>
          <b style="margin-top: 10px; display: inline-block;" v-for="(item,index) in jobFiles">
            <a :href="item.url"
               target="_blank"
               style="color: #00aeff;margin-left: 5px" >{{item.url | fujiancur(item.name)}}，</a>
          </b>
        </el-form-item>
        <el-form-item>
          <el-button @click="zylists = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="附件" :visible.sync="fijians" :close-on-click-modal="false" width="30%" >
      <el-form size="mini"  ref="ruleFormReject" class="demo-ruleForm">
        <el-form-item>
          <b style="margin-top: 10px; display: inline-block;" v-for="item in wanjiedata.files">
            <a :href="item.url"
               target="_blank"
               style="color: #00aeff;margin-left: 5px" >{{item.url | fujiancur(item.name)}},</a>
          </b>
        </el-form-item>
        <el-form-item>
          <el-button @click="zylists = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog  :visible.sync="qinjiabox" :close-on-click-modal="false" width="30%" >
      <el-form size="mini"  ref="ruleFormReject" class="demo-ruleForm">
        <el-form-item>
          <div>
            <p>请假原因：</p>
            <p>{{qingjianr}}</p>
          </div>
          <div v-if="qjbh">
            <p>驳回原因：</p>
            <p>{{bhly}}</p>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="qinjiabox = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div style="position:relative;">
      <el-tabs v-model="actitype" @tab-click="handleClick(actitype)">
        <el-tab-pane label="活动详情" name="1"></el-tab-pane>
        <el-tab-pane label="报名列表" name="2"></el-tab-pane>
        <el-tab-pane label="完结报告" name="3"></el-tab-pane>
        <el-tab-pane :label="'发放'+hoursUnit" name="4"></el-tab-pane>
      </el-tabs>
    </div>

    <div :loading="loading">

      <!-- 活动详情页 -->
      <div class="main-body" v-if="actitype=='1'">
        <p class="xinxitou">基本信息</p>
        <div style="padding: 8px;padding-left: 18px">
          <span>活动名称:</span>
          <span style="margin-left: 10px">{{data.actName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>活动分类:</span>
          <span style="margin-left: 10px">{{data.calssName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>活动主办方:</span>
          <span style="margin-left: 10px">{{data.orgName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>活动承办方/协办方:</span>
          <span style="margin-left: 10px">{{data.xiebanName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>活动时间:</span>
          <span style="margin-left: 10px">{{data.starTime  | formatDate}}~~~{{data.endTime  | formatDate}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px" v-if="data.pitchName&&oto==0">
          <span>活动场地</span>
          <span style="margin-left: 10px">{{data.pitchName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px" v-if="data.pitchAddress&&oto==0">
          <span>活动场地</span>
          <span style="margin-left: 10px">{{data.pitchAddress}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px" v-if="oto==0">
          <span>活动经费</span>
          <span style="margin-left: 10px">{{data.expenditure?data.expenditure:'无'}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px" v-if="oto==0">
          <span>交作业</span>
          <span style="margin-left: 10px">{{data.job==1?'是':'否'}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px" v-if="oto==0&&data.job==1">
          <span>作业是否必交</span>
          <span style="margin-left: 10px">{{data.subJob==1?'必须交':'无需必交'}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span style="vertical-align: top">活动海报:</span>
          <span style="margin-left: 10px">
            <img :src="data.logo+'?x-oss-process=image/resize,m_fill,w_200,h_100,limit_0/auto-orient,1/quality,q_90'" alt="">
            <!--<img :src="data.logo" alt="">-->
          </span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>活动简介:</span>
          <span style="margin-left: 149px;display: inline-block">{{data.introduce}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>附件信息:</span>
          <span style="width: 80%; display: inline-block;">
            <b style="margin-top: 10px; display: inline-block;" v-for="(item,index) in data.files">
              <a :href="item.url"
                 target="_blank"
                 style="color: #00aeff;margin-left: 5px" >{{item.url | fujiancur(item.name)}},
              </a>
            </b>
          </span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>管理员:</span>
          <span style="margin-left: 10px">{{data.adminName}}-{{data.adminCode}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>联系方式:</span>
          <span style="margin-left: 10px">{{data.adminContact}}</span>
        </div>
        <div style='margin-top: 5px;margin-bottom: 15px' v-if="oto==1">
          <span
            style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 15px;font-size: 14px;cursor: pointer" @click="zonghu(1,data.applyStatus,data.statusAll)">查看投票</span>
          <span
            style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 15px;font-size: 14px;cursor: pointer" @click="zonghu(2,data.applyStatus,data.statusAll)">查看问卷</span>
          <span style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 15px;font-size: 14px;cursor: pointer" @click="zonghu(3,data.applyStatus,data.statusAll)">查看测评</span>
          <span
            style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 15px;font-size: 14px;cursor: pointer" @click="zonghu(4,data.applyStatus,data.statusAll)">查看征集</span>
          <span
            style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 15px;font-size: 14px;cursor: pointer" @click="zonghu(5,data.applyStatus,data.statusAll)">查看留言</span>
        </div>
        <p class="xinxitou">报名信息</p>
        <div style="padding: 8px;padding-left: 18px">
          <span>报名是否审核:</span>
          <span style="margin-left: 10px">{{data.signAudit==1?'是':'否'}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>报名截止时间:</span>
          <span style="margin-left: 10px">{{data.enrollEndTime | formatDate}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>活动限制人数:</span>
          <span style="margin-left: 10px">{{data.peopleLimit==0?'不限':data.peopleLimit+'人'}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>可参与院系:</span>
          <span style="margin-left: 10px">{{data.collegeName==null?'不限':data.collegeName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>可参与专业:</span>
          <span style="margin-left: 10px">不限</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>可参与班级:</span>
          <span style="margin-left: 10px">不限</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>可参与年级:</span>
          <span style="margin-left: 10px">{{data.gradeName==null?'不限':data.gradeName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>可参与年制:</span>
          <span style="margin-left: 10px">{{data.yearName==null?'不限':data.yearName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>可参与性别:</span>
          <span style="margin-left: 10px">{{(data.gender==0 ||data.gender==null)?'不限':data.gender==1?'男':data.gender==2?'女':''}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>可参与组织:</span>
          <span style="margin-left: 10px;width: 85%; display: inline-flex;">{{data.zuzhiName==null?'不限':data.zuzhiName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>最低诚信值:</span>
          <span style="margin-left: 10px">{{data.foulLimit==null?'不限':data.foulLimit}}</span>
        </div>
        <p class="xinxitou">其他信息</p>
        <div style="padding: 8px;padding-left: 18px">
          <span>活动创建人:</span>
          <span style="margin-left: 10px">{{data.creatorName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>创建时间:</span>
          <span style="margin-left: 10px">{{data.ctime | formatDate}}</span>
        </div>
        <p class="xinxitou">审核信息</p>
        <div style="padding: 8px;padding-left: 18px">
          <span>当前状态:</span>
          <span style="margin-left: 10px">{{data.applyStatus==2?'审核中':data.applyStatus==1?'通过':data.applyStatus==0?'驳回':''}}</span>
          <span style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 20px;font-size: 14px;cursor: pointer"
            @click="xianshi">{{liutext}}</span>
          <div v-if="data.auditFlow!=null">
            <div style="margin:20px 0 ;" v-if="shenheliuhuo.length>0">
              <div class="title" style="height: 25px; padding: 3px;background:#AAAAAA;color: #fff;display: inline-block; margin-top: 5px;margin-right: 5px">
                活
              </div>
              <div style="display: inline-block; margin-top: 5px;"
                   :style="item.auditIdea==1 ?  'color:green' :  'color:grey'"
                   v-for="(item,index) in shenheliuhuo">
                {{(item.auditorRole==1 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（负责人）' :
                (item.auditorRole==2 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（管理员）' :
                (item.auditorRole==12 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（负责人/管理员）' :
                (item.auditorRole==4 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（辅导员）'
                :(item.auditorRole==5 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（指导老师）' :
                item.namea}}
                <i class="el-icon-caret-right" :style="item.auditIdea==1 ?  'color:green' :  'color:grey'" style="color: #AAAAAA;" v-if="index  == (shenheliuhuo.length - 1) ? false : true"></i>
              </div>
            </div>
            <div style="margin:20px 0 ;" v-if="oto==0&&shenheliuwu.length>0">
              <div class="title" style="height: 25px; padding: 3px;background:#AAAAAA;color: #fff;display: inline-block; margin-top: 5px;margin-right: 5px">
                物
              </div>
              <div style="display: inline-block; margin-top: 5px;"
                   :style="item.auditIdea==1 ?  'color:green' :  'color:grey'"
                   v-for="(item,index) in shenheliuwu">
                {{(item.auditorRole==1 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（负责人）' :
                (item.auditorRole==2 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（管理员）' :
                (item.auditorRole==12 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（负责人/管理员）' :
                (item.auditorRole==4 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（辅导员）'
                :(item.auditorRole==5 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（指导老师）' :
                item.namea}}
                <i class="el-icon-caret-right"
                   :style="item.auditIdea==1 ?  'color:green' : item.index==index ? 'color:orange' : 'color:grey'"
                   style="color: #AAAAAA;" v-if="index  == (shenheliuwu.length - 1) ? false : true"></i>
              </div>
            </div>
            <div style="margin:20px 0 ;" v-if="oto==0&&shenheliuchang.length>0">
              <div class="title"
                   style="height: 25px; padding: 3px;background:#AAAAAA;color: #fff;display: inline-block; margin-top: 5px;margin-right: 5px">
                场
              </div>
              <div style="display: inline-block; margin-top: 5px;"
                   :style="item.auditIdea==1 ?  'color:green' : 'color:grey'" v-for="(item,index) in shenheliuchang">
                {{(item.auditorRole==1 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（负责人）' :
                (item.auditorRole==2 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（管理员）' :
                (item.auditorRole==12 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（负责人/管理员）' :
                (item.auditorRole==4 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（辅导员）'
                :(item.auditorRole==5 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（指导老师）' :
                item.namea}}<i class="el-icon-caret-right" :style="item.auditIdea==1 ?  'color:green' : 'color:grey'"
                               style="color: #AAAAAA;" v-if="index  == (shenheliuchang.length - 1) ? false : true"></i>
              </div>
            </div>

          </div>
          <div v-if="oto==0&&!show">
            <div style="width:68%">
              <el-table border :data="shenhe" stripe size="mini" style="width: 100%">
                <el-table-column label="审核时间"  align="left">
                  <div slot-scope="scope">
                    <p>{{scope.row.auditTime | formatDate }}</p>
                  </div>
                </el-table-column>
                <el-table-column label="审核意见" align="left">
                  <div slot-scope="scope">
                    <p>{{scope.row.auditIdea===""?'待审核':scope.row.auditIdea===1?'通过':scope.row.auditIdea===0?'驳回':'' }}</p>
                  </div>
                </el-table-column>
                <el-table-column label="备注信息"  align="left">
                  <div slot-scope="scope">
                    <p v-if="scope.row.auditIdea===0">{{scope.row.remark }}</p>
                    <p v-if="scope.row.auditIdea===1">分值：{{scope.row.credit }}{{hoursUnit}}</p>
                  </div>
                </el-table-column>
                <el-table-column label="审核类型" align="left">

                  <div slot-scope="scope">
                    <p>{{scope.row.type==1?'活动审核':scope.row.type==2?'物资审核':scope.row.type==3?'场地审核':'' }}</p>
                  </div>
                </el-table-column>
                <el-table-column label="审核人" align="left">
                  <div slot-scope="scope">
                    <p> {{ scope.row.auditorName}}</p>
                  </div>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-if="oto==1&&!show">
            <div style="width:68%">
              <el-table border :data="shenhe" stripe size="mini" style="width: 100%">
                <el-table-column label="审核时间"  align="left">
                  <div slot-scope="scope">
                  <p>{{scope.row.auditTime | formatDate }}</p>
                  </div>
                </el-table-column>
                <el-table-column label="审核意见" align="left">
                  <div slot-scope="scope">
                    <p>{{scope.row.auditIdea===""?'待审核':scope.row.auditIdea===1?'通过':scope.row.auditIdea===0?'驳回':'' }}</p>
                  </div>
                </el-table-column>
                <el-table-column label="备注信息"  align="left">
                  <div slot-scope="scope">
                    <p v-if="scope.row.auditIdea===0">{{scope.row.remark }}</p>
                    <p v-if="scope.row.auditIdea===1">分值：{{scope.row.credit }}{{hoursUnit}}</p>
                  </div>
                </el-table-column>
                <el-table-column label="审核人" align="left">
                  <div slot-scope="scope">
                    <p> {{ scope.row.auditorName}}</p>
                  </div>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div style="margin: 26px auto;width: 48%;" v-if="flag==2&&dshuo==1">
            <span
              style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 20px;font-size: 14px;cursor: pointer" @click="adopthd(data.hours)" v-if="auditType==1">审核通过</span>
            <span
              style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 20px;font-size: 14px;cursor: pointer" @click="showqita(data.hours)" v-if="auditType!=1&&oto==0">审核通过</span>
            <span
              style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 20px;font-size: 14px;cursor: pointer" @click="ejecthd">审核驳回</span>
          </div>
        </div>
      </div>

      <!-- 报名列表页 -->
      <div class="main-body" v-if="actitype=='2'">
        <p class="xinxitou">{{data.actName}}</p>
        <div class="search-box">
          <el-form size="mini" :inline="true" class="demo-form-inline">
            <el-form-item label="审核状态">
              <el-select clearable v-model="params.status" placeholder="请选择审核状态">
                <el-option
                  v-for="item in zhuangtaistatus"
                  :key="item.zhuangtaiId"
                  :label="item.zhuangtaiName"
                  :value="item.zhuangtaiId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户身份">
              <el-select clearable v-model="params.identity" placeholder="请选择审核状态">
                <el-option
                  v-for="item in shenfens"
                  :key="item.shenfenId"
                  :label="item.shenfenName"
                  :value="item.shenfenId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名/学号/工号">
              <el-input v-model="params.keyWord" :maxlength="30" placeholder="请输入姓名/学号/工号搜索"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button size="mini" type="primary" @click="search">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="warning" size="mini" @click="dialogImportCollegeVisible = true">补录学员</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="main-bodys">
          <el-table :loading="loading"   border :data="databm" stripe size="mini" style="width: 100%"  >

            <el-table-column key="11" prop="name"   label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column key="12" label="身份" show-overflow-tooltip>
              <div slot-scope="scope">
                <p>{{scope.row.identity==1?'学生':scope.row.identity==2?'老师':''}}</p>
              </div>
            </el-table-column>
            <el-table-column key="13" prop="code" label="学号/工号" show-overflow-tooltip></el-table-column>
            <el-table-column key="14" prop="collegeName" label="所属院系" show-overflow-tooltip></el-table-column>

            <el-table-column key="15" prop="firstAuditorName" label="报名时间" align="left">
              <div slot-scope="scope">
                <p>{{scope.row.apply_time | formatDate}}</p>
              </div>
            </el-table-column>
            <el-table-column key="16" label="审核状态" show-overflow-tooltip>
              <div slot-scope="scope">
                <p v-if="data.signAudit==1">
                  {{scope.row.status===0?'驳回':scope.row.status==1?'通过':scope.row.status==2?'待审核':''}}</p>
                <p v-if="data.signAudit==0">无</p>
              </div>
            </el-table-column>


            <el-table-column key="17" label="操作" width="160" align="left">
              <div slot-scope="scope">

                <el-button type="text" class="opreat-btn" v-if="parseInt(data.statusAll)<7"
                           @click.native="deleteStudent(scope.row.userId) ">删除
                </el-button>
              </div>
            </el-table-column>
          </el-table>
          <qu-pagination :current2="params.current" :total="total" @change="changePage" ref="mychild"></qu-pagination>
        </div>
      </div>

      <!-- 完结报告页 -->
      <div class="main-body" v-if="actitype=='3'">
        <div v-if="wu==0">
          <p class="xinxitou" style="position: relative">{{data.actName}}
            <span style="background:#e67f1c;color: #fff;float: right;position: absolute;right: 0;top:2px;border-radius: 5px;padding:5px; cursor: pointer" @click="importAllStudent" v-if="oto==0">导出签到记录</span>
          </p>
          <div>
            <div>
              <ul style="overflow: hidden;border: 1px solid #000" v-if="oto==1">
                <li style="float: left;width: 5%;background:#e67f1c">
                  <p style="text-align: center; text-align: center; padding: 75px 17px;">完结报告</p>
                </li>
                <li style="float: left;width: 20%;border-left: 1px solid #000;border-right: 1px solid #000;">
                  <p style="text-align: center;padding: 26px">活动总结</p>
                  <p style="text-align: center;padding: 35px;border-top: 1px solid #000;border-bottom: 1px solid #000; cursor: pointer"  @click="fujiandoc" v-if="wanjiedata.files[0].url">
                    附件(可点击查看全部)
                  </p>
                  <p v-else style="text-align: center;padding: 30px;border-top: 1px solid #000;border-bottom: 1px solid #000; " >附件</p>
                  <p style="text-align: center;padding: 23px">提交时间</p>
                </li>
                <li style="float: left;width: 75%">
                  <p style="padding-left:10px;height: 72.8px;padding-top:7px; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:3;" :title='wanjiedata.summary'>
                    {{wanjiedata.summary}}
                  </p>
                  <p style="padding-left:10px;border-top: 1px solid #000;border-bottom: 1px solid #000;height: 83.8px;overflow: hidden">
                    <b style="margin-top: 8px; display: inline-block;" v-for="item in wanjiedata.files" v-if="item.url">
                      <a :href="item.url"
                         target="_blank"
                         style="color: #00aeff;margin-left: 5px" >{{item.url | fujiancur(item.name)}},
                      </a>
                    </b>
                  </p>
                  <p style="padding-left:10px;line-height:67.8px">{{wanjiedata.time | formatDate}}</p>
                </li>
              </ul>
              <ul style="overflow: hidden;border: 1px solid #000" v-if="oto==0">
                <li style="float: left;width: 5%;background:#e67f1c">
                  <p style="text-align: center; text-align: center; padding: 75px 17px;">完结报告</p>
                </li>
                <li style="float: left;width: 20%;border-left: 1px solid #000;border-right: 1px solid #000;">
                  <p style="text-align: center;padding: 15px">活动经费</p>
                  <p style="text-align: center;padding: 19px;border-top: 1px solid #000">活动总结</p>
                  <p style="text-align: center;padding: 30px;border-top: 1px solid #000;border-bottom: 1px solid #000; cursor: pointer" @click="fujiandoc" v-if="wanjiedata.files[0].url">
                    附件(可点击查看全部)</p>
                  <p v-else style="text-align: center;padding: 30px;border-top: 1px solid #000;border-bottom: 1px solid #000; " >
                    附件</p>
                  <p style="text-align: center;padding: 10px">提交时间</p>
                </li>
                <li style="float: left;width: 75%">
                  <p style="padding-left:10px;border-top: 1px solid #000;border-bottom: 1px solid #000;height: 51.8px">
                    <span style="margin-top: 10px">{{wanjiedata.money}}</span></p>
                  <p style="padding-left:10px;height: 58.8px;  overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; line-height: 25px;    padding-top: 5px;" :title='wanjiedata.summary'>
                    {{wanjiedata.summary}}
                  </p>
                  <p style="padding-left:10px;border-top: 1px solid #000;border-bottom: 1px solid #000;height: 83.8px;overflow: hidden">
                    <b style="margin-top: 8px; display: inline-block;" v-for="item in wanjiedata.files" v-if="item.url">
                      <a :href="item.url" target="_blank"  style="color: #00aeff;margin-left: 5px" >
                        {{item.url | fujiancur(item.name)}},
                      </a>
                    </b>
                  </p>
                  <p style="padding-left:10px;line-height:42.8px">{{wanjiedata.time | formatDate}}</p>
                </li>
              </ul>
            </div>
            <div style="margin-top: 10px">
              <ul style="overflow: hidden;border: 1px solid #000">
                <li style="float: left;width: 5%;background:#1ad5e6">
                  <p style="text-align: center; text-align: center; padding: 98px 17px;">评分统计</p>
                </li>
                <li style="float: left;width: 23%;border-left: 1px solid #000;border-right: 1px solid #000;">
                  <p style="padding: 10px;border-bottom: 1px">
                    <span style="margin-left: 6%"><img src="/static/images/star/st_star_active.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star_active.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star_active.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star_active.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star_active.png" alt=""></span>
                  </p>
                  <p style="padding: 10px;border-bottom: 1px">
                    <span style="margin-left: 6%"><img src="/static/images/star/st_star_active.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star_active.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star_active.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star_active.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star.png" alt=""></span>
                  </p>
                  <p style="padding: 10px;border-bottom: 1px">
                    <span style="margin-left: 6%"><img src="/static/images/star/st_star_active.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star_active.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star_active.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star.png" alt=""></span>
                  </p>
                  <p style="padding: 10px;border-bottom: 1px">
                    <span style="margin-left: 6%"><img src="/static/images/star/st_star_active.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star_active.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star.png" alt=""></span>
                  </p>
                  <p style="padding: 10px;border-bottom: 1px">
                    <span style="margin-left: 6%"><img src="/static/images/star/st_star_active.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star.png" alt=""></span>
                    <span style="margin-left: 3%"><img src="/static/images/star/st_star.png" alt=""></span>
                  </p>
                </li>
                <li style="float: left;width: 72%" class="jd">
                  <p style="padding: 15px 10px;border-bottom: 1px;padding-bottom: 16px">
                    <el-progress :text-inside="true" :stroke-width="24"
                                 :percentage="wanjiedata.sum!=0&&wanjiedata.five!=0?parseInt(( wanjiedata.five/wanjiedata.sum)*100):0"
                                 status="success">
                    </el-progress>
                  </p>
                  <p style="padding: 15px 10px;border-bottom: 1px;padding-bottom: 17px">
                    <el-progress :text-inside="true" :stroke-width="24"
                                 :percentage=" wanjiedata.sum!=0&&wanjiedata.four!=0?parseInt((wanjiedata.four/wanjiedata.sum)*100):0"
                                 status="success">
                    </el-progress>
                  </p>
                  <p style="padding: 15px 10px;border-bottom: 1px;padding-bottom: 17px">
                    <el-progress :text-inside="true" :stroke-width="24"
                                 :percentage="wanjiedata.sum!=0&&wanjiedata.three!=0?parseInt((wanjiedata.three/wanjiedata.sum)*100):0"
                                 status="success">
                    </el-progress>
                  </p>
                  <p style="padding: 15px 10px;border-bottom: 1px;padding-bottom: 17px">
                    <el-progress :text-inside="true" :stroke-width="24"
                                 :percentage="wanjiedata.sum!=0&&wanjiedata.two!=0?parseInt((wanjiedata.two/wanjiedata.sum)*100):0"
                                 status="success">
                    </el-progress>
                  </p>
                  <p style="padding: 15px 10px;border-bottom: 1px;padding-bottom: 16px">
                    <el-progress :text-inside="true" :stroke-width="24"
                                 :percentage="wanjiedata.sum!=0&&wanjiedata.one!=0?parseInt((wanjiedata.one/wanjiedata.sum)*100):0"
                                 status="success">
                    </el-progress>
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <p class="xinxitou">审核信息</p>
          <div style="padding: 8px;padding-left: 18px">
            <span>当前状态:</span>
            <span style="margin-left: 10px">{{wanjiedata.status==2?'审核中':wanjiedata.status==1?'通过':wanjiedata.status==0?'驳回':''}}</span>
            <span
              style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 20px;font-size: 14px;cursor: pointer"
              @click="xianshi">{{liutext}}
            </span>
            <div >

              <div style="margin:20px 0 ;">
                <div style="display: inline-block; margin-top: 5px;"
                     :style="item.auditIdea==1 ?  'color:green' :  'color:grey'" v-for="(item,index) in wanjieliulist">
                  {{(item.auditorRole==1 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（负责人）' :
                  (item.auditorRole==2 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（管理员）' :
                  (item.auditorRole==12 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（负责人/管理员）' :
                  (item.auditorRole==4 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（辅导员）'
                  :(item.auditorRole==5 && item.auditIdea!=1 && item.auditorType!=5) ? item.namea + '（指导老师）' :
                  item.namea}}<i class="el-icon-caret-right" :style="item.auditIdea==1 ?  'color:green' :  'color:grey'"
                                 style="color: #AAAAAA;" v-if="index  == (wanjieliulist.length - 1) ? false : true"></i>
                </div>
              </div>

            </div>

            <div  v-if="!show">
              <div style="width:68%">
                <el-table border :data="wanjieliulist2" stripe size="mini" style="width: 100%">
                  <el-table-column label="审核时间"  align="left">
                    <div slot-scope="scope">
                      <p>{{scope.row.auditTime | formatDate }}</p>
                    </div>
                  </el-table-column>
                  <el-table-column label="审核意见" align="left">
                    <div slot-scope="scope">
                      <p>{{scope.row.auditIdea===""?'待审核':scope.row.auditIdea===1?'通过':scope.row.auditIdea===0?'驳回':'' }}</p>
                    </div>
                  </el-table-column>
                  <el-table-column label="备注信息" prop="remark" align="left"></el-table-column>
                  <el-table-column label="审核人" align="left">
                    <div slot-scope="scope">
                      <p> {{ scope.row.auditorName}}</p>
                    </div>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div style="margin: 26px auto;width: 48%;" v-if="flag==2&&dshuo!=1">
            <span style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 20px;font-size: 14px;cursor: pointer"
                  @click="goxf">审核通过
            </span>
            <span style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 20px;font-size: 14px;cursor: pointer"
                  @click="eject">审核驳回
            </span>
            </div>

          </div>
        </div>
        <div v-if="wu==1" style="height:300px;text-align:center;padding-top:150px;">
          暂无数据
        </div>
      </div>

      <!-- 发放学分页 -->
      <div class="main-body" v-if="actitype=='4'">
        <p class="xinxitou" style="position: relative">{{data.actName}}
          <span style="padding-left: 93px"  v-if="oto==0">活动签到次数: {{data.signNum}}</span>
          <span style="background:#e67f1c;color: #fff;float: right;position: absolute;right: 0;top:2px;border-radius: 5px;padding: 5px;cursor: pointer"
                @click="importAllStudent"
                v-if="oto==0">导出签到记录
          </span>
        </p>
        <div  v-if="flag==2&&dshuo!=1">
          <el-form size="mini" :inline="true" class="demo-form-inline" v-if="oto==0">
            <p style="margin-left: 15px">
              <el-form-item label="签到次数:">
                <el-input v-model="fafangxf.signIn" type="number" placeholder="请输入签到次数"></el-input>
              </el-form-item>
              <el-form-item label="次"></el-form-item>
              <el-form-item label="签退次数:">
                <el-input v-model="fafangxf.signOut" placeholder="请输入签到次数"></el-input>
              </el-form-item>
              <el-form-item label="次"></el-form-item>
            </p>
            <p style="margin-left: 15px">
              <el-form-item label="活动签到签退:">
                <el-radio-group v-model="fafangxf.signType">
                  <el-radio-button label="" style="margin-left: 10px">全部</el-radio-button>
                  <el-radio-button label="1" style="margin-left: 10px">只有签到记录</el-radio-button>
                  <el-radio-button label="2" style="margin-left: 10px">只有签退记录</el-radio-button>
                  <el-radio-button label="3" style="margin-left: 10px">签到签退记录都有</el-radio-button>
                  <el-radio-button label="4" style="margin-left: 10px">无签到签退记录</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </p>
            <p style="margin-left: 15px">
              <el-form-item label="是否交作业:">
                <el-radio-group v-model="fafangxf.iswork">
                  <el-radio-button label="" style="margin-left: 23px">全部</el-radio-button>
                  <el-radio-button label="1" style="margin-left: 10px">是</el-radio-button>
                  <el-radio-button label="0" style="margin-left: 10px">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </p>
            <p style="margin-left: 15px">
              <el-form-item label="成员身份:">
                <el-radio-group v-model="fafangxf.role">
                  <el-radio-button label="" style="margin-left: 37px">全部</el-radio-button>
                  <el-radio-button label="1" style="margin-left: 10px">管理员</el-radio-button>
                  <el-radio-button label="2" style="margin-left: 10px">签到员</el-radio-button>
                  <el-radio-button label="3" style="margin-left: 10px">普通成员</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </p>
            <p style="margin-left: 15px">
              <el-form-item label="请假情况:">
                <el-radio-group v-model="fafangxf.leave">
                  <el-radio-button label="" style="margin-left: 37px">全部</el-radio-button>
                  <el-radio-button label="0" style="margin-left: 10px">未请假</el-radio-button>
                  <el-radio-button label="1" style="margin-left: 10px">请假成功</el-radio-button>
                  <el-radio-button label="2" style="margin-left: 10px">请假失败</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </p>
            <p style="margin-left: 15px">
              <el-form-item label="参与时长:">
                <el-input v-model="fafangxf.shortMinute" type="number" placeholder="请输入最短时长"></el-input>
              </el-form-item>
              <el-form-item> - </el-form-item>
              <el-form-item>
                <el-input v-model="fafangxf.longtMinute" type="number" placeholder="请输入最长时长"></el-input>
              </el-form-item>
            </p>
            <p style="margin-left: 15px">
              <el-form-item label="成员姓名/学号:">
                <el-input v-model="fafangxf.keyWord" :maxlength="30" placeholder="请输入成员姓名/学号搜索"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button size="mini" type="primary" @click="searchxf">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary" @click="retback">重置</el-button>
              </el-form-item>

              <el-form-item style="float: right;">
                <el-button size="mini" type="primary" @click="faxuefen">发放{{hoursUnit}}</el-button>
              </el-form-item>
              <el-form-item style="float: right;">
                <el-button size="mini" type="primary" @click="biliang">批量修改{{hoursUnit}}</el-button>
              </el-form-item>

            </p>
          </el-form>

          <el-form size="mini" :inline="true" class="demo-form-inline" v-if="oto==1">
            <p style="margin-left: 15px">
              <el-form-item label="是否完成活动:">
                <el-radio-group v-model="fafangxfs.fulfill">
                  <el-radio-button label="" style="margin-left: 10px">全部</el-radio-button>
                  <el-radio-button label="1" style="margin-left: 10px">是</el-radio-button>
                  <el-radio-button label="0" style="margin-left: 10px">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </p>
            <p style="margin-left: 15px">
              <el-form-item label="成员身份:">
                <el-radio-group v-model="fafangxfs.role">
                  <el-radio-button label="" style="margin-left: 37px">全部</el-radio-button>
                  <el-radio-button label="1" style="margin-left: 10px">管理员</el-radio-button>
                  <el-radio-button label="3" style="margin-left: 10px">普通成员</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </p>
            <p style="margin-left: 15px">
              <el-form-item label="请假情况:">
                <el-radio-group v-model="fafangxfs.leave">
                  <el-radio-button label="" style="margin-left: 37px">全部</el-radio-button>
                  <el-radio-button label="0" style="margin-left: 10px">未请假</el-radio-button>
                  <el-radio-button label="1" style="margin-left: 10px">请假成功</el-radio-button>
                  <el-radio-button label="2" style="margin-left: 10px">请假失败</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </p>

            <p style="margin-left: 15px">
              <el-form-item label="成员姓名/学号:">
                <el-input v-model="fafangxfs.keyWord" :maxlength="30" placeholder="请输入成员姓名/学号搜索"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary" @click="searchxfs">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary" @click="retbacks">重置</el-button>
              </el-form-item>

              <el-form-item style="float: right;">
                <el-button size="mini" type="primary" @click="faxuefen">发放{{hoursUnit}}</el-button>
              </el-form-item>
              <el-form-item style="float: right;">
                <el-button size="mini" type="primary" @click="biliang">批量修改{{hoursUnit}}</el-button>
              </el-form-item>
            </p>
          </el-form>
        </div>

        <div class="main-body xf" v-if="oto==0">
          <el-table border :loading="loading" :data="xfdata" stripe size="mini" style="width: 100%" ref="multipleTables" @selection-change="handleSelectionChange">
            <!--<el-table-column key="21" v-if="flag==2&&dshuo!=1" style='width: 50px;text-align: center'>-->
              <!--<template slot-scope="scope">-->
                <!--<el-checkbox :value="scope.row.checked" @change="changeBox($event,scope.row)">-->
                <!--</el-checkbox>-->
              <!--</template>-->

            <!--</el-table-column>-->
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column key="22" prop="name" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column  key="23" prop="code" label="学号" show-overflow-tooltip></el-table-column>
            <el-table-column  key="24" label="角色" show-overflow-tooltip>
              <template slot-scope="scope">
                <p>{{scope.row.role==1?'管理员':scope.row.role==2?'签到员':scope.row.role==3?'普通成员':''}}</p>
              </template>
            </el-table-column>
            <el-table-column key="25" prop="diffFenzhong" label="参与时长(分)" show-overflow-tooltip></el-table-column>
            <el-table-column key="26" prop="inTime" label="签到时间" width="150px"></el-table-column>
            <el-table-column key="27" prop="outTime" label="签退时间" width="150px"></el-table-column>
            <el-table-column key="28"  label="请假情况" >
              <template slot-scope="scope">
                <p v-if="scope.row.leave==0">未请假</p>
                <p v-if="scope.row.leave==1" style="color: #4D7DFF;cursor: pointer" @click="qjyy(scope.row.leaveCause,scope.row.leave)">请假成功</p>
                <p v-if="scope.row.leave==2" style="color: #4D7DFF;cursor: pointer" @click="qjyy(scope.row.leaveCause,scope.row.leave,scope.row.leaveAuditRemark)">请假失败</p>
              </template>
            </el-table-column>
            <el-table-column key="29" prop="leaveTime" label="请假时间" ></el-table-column>
            <el-table-column key="30" :label="'发放'+hoursUnit" show-overflow-tooltip>
              <template slot-scope="scope">
                <p v-if="flag==2&&dshuo!=1"><span >{{scope.row.hours?scope.row.hours:scope.row.hours===0?0:data.hours}}</span><span style="margin-left:9px"><el-button
                  type="text" class="opreat-btn" @click="danxgxf(scope.row)">修改{{hoursUnit}}</el-button></span></p>
                <p v-if="flag==1">{{scope.row.hours}}</p>
              </template>
            </el-table-column>
            <el-table-column key="31" prop="remark" label="备注" show-overflow-tooltip></el-table-column>
            <el-table-column key="32" label="作业" show-overflow-tooltip>
              <template slot-scope="scope">
                <p>
                  <el-button type="text" class="opreat-btn" v-if="scope.row.jobFiles.length>0" @click="chakan(scope.row.jobFiles)">查看</el-button>
                  <span v-if="scope.row.jobFiles.length==0">无</span>
                </p>
              </template>
            </el-table-column>
          </el-table>
          <qu-pagination :current2="fafangxf.current" :total="fafangxf.total" @change="changePagexf"
                         ref="mychildsk"></qu-pagination>
        </div>

        <div class="main-body xf" v-if="oto==1">
          <el-table border :loading="loading" :data="xfdata" stripe size="mini" style="width: 100%" ref="multipleTables"  @selection-change="handleSelectionChange">
            <!--<el-table-column key="1" v-if="flag==2&&dshuo!=1" style='width: 50px;text-align: center'>-->
              <!--<template slot-scope="scope">-->
                <!--<el-checkbox :value="scope.row.checked" @change="changeBox($event,scope.row)">-->
                <!--</el-checkbox>-->
              <!--</template>-->

            <!--</el-table-column>-->
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column key="2"  prop="name" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column  key="3" prop="code" label="学号" show-overflow-tooltip></el-table-column>
            <el-table-column  key="4" label="角色" show-overflow-tooltip>
              <template slot-scope="scope">
                <p>{{scope.row.role==1?'管理员':scope.row.role==3?'普通成员':''}}</p>
              </template>
            </el-table-column>
            <el-table-column key="5" label="是否完成活动" show-overflow-tooltip>
              <template slot-scope="scope">
                <p>{{scope.row.fulfill==0?'否':scope.row.fulfill==1?'是':''}}</p>
              </template>
            </el-table-column>
            <el-table-column key="9"  label="请假情况" >
              <template slot-scope="scope">
                <p v-if="scope.row.leave==0">未请假</p>
                <p v-if="scope.row.leave==1" style="color: #4D7DFF;cursor: pointer" @click="qjyy(scope.row.leaveCause,scope.row.leave)">请假成功</p>
                <p v-if="scope.row.leave==2" style="color: #4D7DFF;cursor: pointer" @click="qjyy(scope.row.leaveCause,scope.row.leave,scope.row.leaveAuditRemark)">请假失败</p>
              </template>
            </el-table-column>
            <el-table-column key="10" prop="leaveTime" label="请假时间" ></el-table-column>
            <el-table-column  key="6" :label="'发放'+hoursUnit" show-overflow-tooltip>
              <template slot-scope="scope">
                <p v-if="flag==2&&dshuo!=1"><span >{{scope.row.hours?scope.row.hours:scope.row.hours===0?0:data.hours}}</span><span style="margin-left:9px"><el-button
                  type="text" class="opreat-btn" @click="danxgxf(scope.row)">修改{{hoursUnit}}</el-button></span></p>
                <p v-if="flag==1">{{scope.row.hours}}</p>
              </template>
            </el-table-column>
            <el-table-column key="7" prop="remark" label="备注" show-overflow-tooltip></el-table-column>
            <el-table-column key="8" label="操作" >
              <template slot-scope="scope">
                <div  v-if="scope.row.fulfill!=0">
                  <span type="text" class="opreat-btn" v-if="!scope.row.paperType" >无</span>
                  <p v-if="scope.row.paperType">
                  <el-button type="text" class="opreat-btn" v-if="scope.row.paperType.indexOf('1')>-1" @click="gopage(1,scope.row.actId,scope.row.userId)" >投票</el-button>
                  <el-button type="text" class="opreat-btn" v-if="scope.row.paperType.indexOf('2')>-1" @click="gopage(2,scope.row.actId,scope.row.userId)">问卷</el-button>
                  <el-button type="text" class="opreat-btn" v-if="scope.row.paperType.indexOf('3')>-1" @click="gopage(3,scope.row.actId,scope.row.userId)">测评</el-button>
                  <el-button type="text" class="opreat-btn" v-if="scope.row.paperType.indexOf('4')>-1" @click="gopage(4,scope.row.actId,scope.row.userId)">征集</el-button>
                  <el-button type="text" class="opreat-btn" v-if="scope.row.paperType.indexOf('5')>-1" @click="gopage(5,scope.row.actId,scope.row.userId)">留言</el-button>
              </p>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <qu-pagination :current2="fafangxfs.current" :total="fafangxfs.total" @change="changePagexfs"
                         ref="mychilds"></qu-pagination>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  import {Message} from 'element-ui';
  import {cascade, fujiancur} from '@/utils/filters'
  import axios from 'axios'
  import {
    isFloat
  } from '@/utils/validate'

  var validCode2 = (rule, value, callback) => {
    if (!value) {
      callback(new Error('不能为空'))
    } else if (!isFloat(value)) {
      callback(new Error('请输入正确的格式'))
    } else {
      callback()
    }
  }
  export default {

    data() {

      return {
        qjtitall:'',
        qingjianr:'',
        bhly:'',
        qjbh:false,
        qinjiabox:false,
        auditType:this.$route.query.auditType,
        dialoghd:false,
        // 补录模板
        dialogImportCollegeVisible:false,
        showfileInfor:false,
        fileList:[],
        fileListName:'',
        dataObj2:{
          activityId:this.$route.query.id,
        },
        showProgress:false,
        fileUploadPercent:0,
        showfileInforDetail:false,
        fileInforamtion:{
        },
        //
        ruleFormRejecthd: {
        applyId:this.$route.query.applyid,
          taskId:this.$route.query.taskid,
          status:0,
          auditRemark:'',
          hours: ''
      },
        ruleFormPass: {
          applyId:this.$route.query.applyid,
          taskId:this.$route.query.taskid,
          status:1,
          auditRemark:'',
          hours: ''
        },
        rules:{
          hours: [{
            required: true,
            trigger: 'blur',
            validator: validCode2
          }],
        },
        dialogVisibleAdopt:false,
        ruleFormReject: {
          applyId:this.$route.query.applyid,
          taskId:this.$route.query.taskid,
          status:0,
          auditRemark: '',
        },
        wanjieliulist:[],
        wanjieliulist2:[],
        jobFiles:[],
        zylists:false,
        ruleFormRejects: {
          applyId:this.$route.query.applyid,
          taskId:this.$route.query.taskid,
          status:1,
          auditRemark:'',
        },
        num:'',
        xfdoc: false,
        checkeds: [],

        //修改学分，批量修改学分 数据结构， 学分obj
        xfobj: {
          id: '',
          user_id: '',
          hours: '',
          remark: '',
          foul: "0",
        },

        multipleSelection: [], // 选中的数据二维数组
        ids: [], // 选中的数据id数组
        xfxuanzhonglist: [],
        xfdata: [],
        fafangxf: {
          actId: this.$route.query.id,
          signIn: '',
          signOut: '',
          signType: '',
          role: '',
          shortMinute: '',
          longtMinute: '',
          keyWord: '',
          current: 1,
          size: 10,
          total: 0,
          iswork:'',
          leave: '',
        },
        fafangxfs: {
          actId: this.$route.query.id,
          role: '',
          keyWord: '',
          leave: '',
          current: 1,
          size: 10,
          total: 0,
          fulfill:''
        },
        wu: 0,
        shenfens: [
          {shenfenId: '', shenfenName: '全部'},
          {shenfenId: 1, shenfenName: '学生'},
          {shenfenId: 2, shenfenName: '老师'},
        ],
        zhuangtaistatus: [
          {zhuangtaiId: '', zhuangtaiName: '全部'},
          {zhuangtaiId: 0, zhuangtaiName: '驳回'},
          {zhuangtaiId: 1, zhuangtaiName: '通过'},
          {zhuangtaiId: 2, zhuangtaiName: '待审核'},

        ],
        wanjiedata: '',
        total: '',
        show: true,
        databm: '',
        atiyname: '',
        actitype:this.$route.query.actitype?this.$route.query.actitype:'1',
        activity: '',
        loading: true,
        data: [],
        shenheliuhuo: [],
        shenheliuwu: [],
        shenheliuchang: [],
        shenhe: [],
        tempList: [],//选中数组
        pageList: [],//页码数组
        params: {
          id: this.$route.query.id,
          current: 1,
          size: 10,
          status: '',
          identity: '',
        },
        oto: this.$route.query.oto,
        flag: this.$route.query.flag,
        dshuo: this.$route.query.dshuo,
        liutext: '查看流程',
        fijians:false,
        dialogbhhd:false,
       frompath:'',
        fromquery:{},
        hoursUnit:localStorage.getItem("hoursUnit"),
      }
    },
    // /*watch: {
    //   xfdata (oldVal, newVal) { // 监听数据变化，然后执行分页记忆自动选中回调
    //     this.$nextTick(() => {
    //       this.selectMemoriedDataFn()
    //     })
    //   }
    // },*/
    beforeRouteEnter (to, from, next) {
      next();
      localStorage.setItem("frompath",from.fullPath)
    },
    mounted() {
      this.getxiangqing()
      let activeName= this.actitype
      if (activeName == '2') {
        this.getbaoming()
      }
      if (activeName == '3') {
        this.wanjie()
        this.getwanjieliu()
      }
      if (activeName == '4') {
        if (this.oto==0){
          this.getxuefen()
        } ;
        if (this.oto==1){
          this.getxuefens()
        } ;
      }
    },
    methods: {
      qjyy(con,num,bh){
         if (num==2){
          this.qjbh=true
         }else {
           this.qjbh=false
         }
        if(con!=''){
          this.qingjianr=con
        }else {
          this.qingjianr='无'
        }
        if(bh!=''){
          this.bhly=bh
        }else {
          this.bhly='无'
        }
        this.qinjiabox=true
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      showqita(hours){
        this.ruleFormPass.hours=hours
          if (this.auditType == 2) {

            this.$confirm('确认经费物资无误，予以通过？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http.post("/activity/audit", this.ruleFormPass).then( (res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '审核成功!'
                  });
                  this.$router.push({path:"/proceeding/wait/activity/first/auditing", query: {oto:this.$route.query.oto}})
                }
              })
            }).catch(() => {

            });
          }
          if (this.auditType == 3) {
            this.$confirm('确认场地无误，予以通过？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http.post("/activity/audit", this.ruleFormPass).then( (res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '审核成功!'
                  });
                  this.$router.push({path:"/proceeding/wait/activity/first/auditing", query: {oto:this.$route.query.oto}})
                }
              })
            }).catch(() => {

            });
          }

      },
      zonghu(type,applyStatus,statusAll){
        if(type==1){
          this.$router.push({path:"/proceeding/wait/activity/voteall", query: {actId: this.$route.query.id,type:type,dshuo:this.dshuo,applyStatus:applyStatus,statusAll:statusAll,actitype:this.actitype}})
        }
        if(type==2){
          this.$router.push({path:"/proceeding/wait/activity/questionnaireall", query: {actId: this.$route.query.id,type:type,dshuo:this.dshuo,applyStatus:applyStatus,statusAll:statusAll,actitype:this.actitype}})
        }
        if(type==3){
          this.$router.push({path:"/proceeding/wait/activity/appraisall", query: {actId: this.$route.query.id,type:type,dshuo:this.dshuo,applyStatus:applyStatus,statusAll:statusAll,actitype:this.actitype}})
        }
        if(type==4){
          this.$router.push({path:"/proceeding/wait/activity/collectall", query: {actId: this.$route.query.id,type:type,dshuo:this.dshuo,applyStatus:applyStatus,statusAll:statusAll,actitype:this.actitype}})
        }
        if(type==5){
          this.$router.push({path:"/proceeding/wait/activity/messageboardall", query: {actId: this.$route.query.id,type:type,dshuo:this.dshuo,applyStatus:applyStatus,statusAll:statusAll,actitype:this.actitype}})
        }

      },
      //删除学生
      deleteStudent(id){
        this.$confirm('是否删除此成员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/activity/delete/activity_member', {
            activityId:this.$route.query.id,
            userId: id,

          }).then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getbaoming()
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
      adopthd(hours){

        this.dialoghd = true;

        if (hours) {
          this.ruleFormPass.hours = hours
        }
      },
      ejecthd() {
        this.dialogbhhd = true;
      },
      submitFormPass(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post("/activity/audit", this.ruleFormPass).then( (res) => {
              if (res.code == '200') {
                this.$message({
                  type: 'success',
                  message: '审核成功!'
                });
                this.$router.push({path:"/proceeding/wait/activity/first/auditing", query: {oto:this.$route.query.oto}})
              }

            })
          }
        })
      },
      submitFormReject() {
        if (this.ruleFormRejecthd.auditRemark) {
          this.$http.post('/activity/audit',this.ruleFormRejecthd).then( (res) => {
            if (res.code == '200') {
              this.$message({
                type: 'success',
                message: '驳回成功!'
              });
              this.$router.push({path:"/proceeding/wait/activity/first/auditing", query: {oto:this.$route.query.oto}})
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '请填写原因'
          });
        }
      },
      importAllStudent(){
        axios({
          method: 'get',
          url: '/activity/sign/list/export',
          responseType: 'blob',
          params: {
            activityId:this.$route.query.id
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

      //完结报告页，点击审核通过，其实是跳转到发放学分页
      goxf(){
        let that=this
        that.$confirm(this.hoursUnit+'发放完成即表示完结报告审核通过.', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
         this.actitype='4'
          if (this.oto==0){
            this.getxuefen()
          } ;
          if (this.oto==1){
            this.getxuefens()
          } ;
        })
      },
      //完结报告页，点击审核驳回，打开 驳回对话框
      eject() {
        this.dialogVisibleAdopt = true;
      },
      //完结报告 审核驳回
      shenhedell(){
        let that=this
        if( this.ruleFormReject.auditRemark!=''){
          this.$http.post('/activity/auditFinish', this.ruleFormReject).then(res => {
            if (res.code == '200') {
              that.$message({
                type: 'success',
                message: '已驳回!'
              });
              that.$router.push({path:"/proceeding/wait/activity/report/auditing", query: {oto:that.$route.query.oto}})
            } else {
              that.$message({
                type: "error",
                message: res.msg
              })
            }
          })
        }else {
          this.$message({
            type: "error",
            message: '请填写驳回理由'
          })
        }
      },
      fujiandoc(){
        this.fijians=true
      },
      chakan(jobFiles){
      this.jobFiles=jobFiles
        this.zylists=true
      },
      changeBox(e, row) {
        const that = this;
        row.checked = e;
        if (row.checked) {
          that.tempList.push(row);
        } else {
          let temp = [];
          for (let i = 0; i < that.tempList.length; i++) {
            if (that.tempList[i].id == row.id) {
            } else {
              temp.push(that.tempList[i])
            }
          }
          that.tempList = temp
        }
        that.pageList[that.fafangxf.current - 1] = that.tempList
      },

      //打开批量修改学分 对话框
      biliang(){
        if (this.multipleSelection.length<=0) {
          this.$message({
            type: "error",
            message: '至少请选择一个需要修改的人'
          })
          return
        }
        this.num=2
        this.xfdoc = true
        //this.xfobj.foul = "0"
      },

      //发放学分 函数
      faxuefen(row){
        let that=this
        that.$confirm('确定对所有活动成员进行发放'+this.hoursUnit+'操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http.post('/activity/auditFinish',this.ruleFormRejects).then(res => {
            if (res.code == '200') {
              that.$message({
                type: 'success',
                message: '审核成功!'
              });
              that.$router.push({path:"/proceeding/wait/activity/report/auditing", query: {oto:that.$route.query.oto}})
            } else {
              that.$message({
                type: "error",
                message: res.msg
              })
            }
          })
        }).catch(() => {

        });
      },
      //单条记录 修改学分
      danxgxf(row) {
        this.xfobj.id = row.id
        this.xfobj.user_id = row.user_id
        //this.xfobj.foul = "0"
        this.num=1
        this.xfdoc = true
      },

      //修改学分 函数
      xiugai() {
        if (this.xfobj.hours == '') {
          this.$message({
            type: "error",
            message: '请填写需要修改的'+this.hoursUnit
          })
          return
        }
        if(this.xfobj.hours >= 1000){
          this.$message({
            type: "error",
            message: '分值不能超过999.99！'
          })
          return;
        }

        // if(this.xfobj.hours == 0 && this.xfobj.remark.trim() == ''){
        //   this.$message({
        //     type: "error",
        //     message: '修改' +this.hoursUnit+ '为0，请填写原因!'
        //   })
        //   return;
        // }

        if(this.xfobj.hours > 0){
          this.xfobj.foul = "0";
        }

        let ddta = {
          userList: [],
          activityId: this.$route.query.id,
          hours: '',
          remark: '',
          foul: '',
        }
        console.log(this.xfobj)
        ddta.userList.push(this.xfobj)
        let that = this
        this.$http.post('/activity/update/member/hour-list', ddta).then(res => {
          if (res.code == '200') {
            that.$message({
              type: 'success',
              message: '修改成功'
            });
            this.xfobj.id = ''
            this.xfobj.hours = ''
            this.xfobj.remark = ''
            //this.xfobj.foul = "0"
            if (this.oto==0){
              this.getxuefen()
            } ;
            if (this.oto==1){
              this.getxuefens()
            } ;
            this.xfdoc = false;
          }
          else {
              that.$message({
                type: "error",
                message: res.msg
              })
              this.xfobj.id = ''
              this.xfobj.hours = ''
              this.xfobj.remark = ''
              //this.xfobj.foul = "0"
              //刷新学分类别 线下
              if (this.oto==0){
                this.getxuefen()
              } ;
              //刷新学分类别 线上
              if (this.oto==1){
                this.getxuefens()
              } ;
            }
        })
      },
      //批量修改学分 函数
      pilaingfafang(){
        if (this.xfobj.hours == '') {
          this.$message({
            type: "error",
            message: '请填写需要修改的'+this.hoursUnit})
          return
        }

        // if(this.xfobj.hours == 0 && this.xfobj.remark.trim() == ''){
        //   this.$message({
        //     type: "error",
        //     message: '修改' +this.hoursUnit+ '为0，请填写原因!'
        //   })
        //   return;
        // }

        if(this.xfobj.hours > 0){
          this.xfobj.foul = "0";
        }

        let ddta = {
          userList: [],
          activityId: this.$route.query.id,
          hours: '',
          remark: '',
          foul: '',
        }
        let tempLists=[]
        tempLists =this.multipleSelection
        if (this.xfobj.hours){
          if(this.xfobj.hours >= 1000){
            this.$message({
              type: "error",
              message: '分值不能超过999.99！'
            })
            return;
          }
        }

        for (let i = 0; i < tempLists.length; i++) {
          tempLists[i].user_id = tempLists[i].userId;
          tempLists[i].hours = this.xfobj.hours;
          tempLists[i].remark = this.xfobj.remark;
          tempLists[i].foul = this.xfobj.foul;
        }

        ddta.userList=tempLists
        let that = this
        this.$http.post('/activity/update/member/hour-list', ddta).then(res => {
          if (res.code == '200') {
            that.$message({
              type: 'success',
              message: '修改成功'
            });
            this.xfobj.id = ''
            this.xfobj.hours = ''
            this.xfobj.remark = ''
            //this.xfobj.foul = "0"
            if (this.oto==0){
              this.getxuefen()
            } ;
            if (this.oto==1){
              this.getxuefens()
            } ;

            this.xfdoc = false;
          }
          else {
            that.$message({
              type: "error",
              message: res.msg
            })
            this.xfobj.id = ''
            this.xfobj.hours = ''
            this.xfobj.remark = ''
            //this.xfobj.foul = "0"
            if (this.oto==0){
              this.getxuefen()
            } ;
            if (this.oto==1){
              this.getxuefens()
            } ;
            this.xfdoc = false;
          }
        })
      },

      selectMemoriedDataFn() { // 分页记忆自动选中方法
        const that = this;
        if (that.pageList[that.fafangxf.current - 1]) {
          for (let i = 0; i < that.xfdata.length; i++) {
            let id = that.xfdata[i].id;
            that.xfdata[i].checked = false;
            for (let j = 0; j < that.pageList[that.fafangxf.current - 1].length; j++) {
              let nId = that.pageList[that.fafangxf.current - 1][j].id;
              if (id == nId) {
                let temp = that.xfdata[i];
                temp.checked = true;
                that.$set(that.xfdata, i, temp)
              }
            }
          }
        } else {
          for (let i = 0; i < that.xfdata.length; i++) {
            that.xfdata[i].checked = false;
          }
        }
      },
      retback() {
        this.fafangxf.signIn = ''
        this.fafangxf.signOut = ''
        this.fafangxf.signType = ''
        this.fafangxf.role = ''
        this.fafangxf.shortMinute = ''
        this.fafangxf.longtMinute = ''
        this.fafangxf.keyWord = ''
        this.fafangxf.iswork = ''
        this.fafangxf.leave = ''
      },
      retbacks() {
        console.log(this.fafangxf.leave)
        this.fafangxfs.fulfill = ''
        this.fafangxfs.role = ''
        this.fafangxfs.keyWord = ''
        this.fafangxfs.leave = ''
      },
      indexMethod(index) {
        return index + 1;
      },
      xianshi() {
        if (this.show == false) {
          this.show = true
          this.liutext = '查看流程'
        } else {
          this.show = false
          this.liutext = '隐藏流程'
        }
      },

      getxiangqing() {
        this.$http.get('/activity/detailById', {
          params: {
            actId: this.$route.query.id
          }
        }).then(res => {
          if (res.code == 200) {
            this.data = res.data
            if (res.data.auditFlow.audit.length>0) {
              // this.total = res.data.total
              let count = 0;//需要查找当前的操作人数，找排在最前的元素
              let countw = 0;//需要查找当前的操作人数，找排在最前的元素
              let countc = 0;//需要查找当前的操作人数，找排在最前的元素
              for (var i = 0; i < res.data.auditFlow.audit.length; i++) {
                if (res.data.auditFlow.audit[i].type == 1) {
                  this.shenheliuhuo.push(res.data.auditFlow.audit[i])
                }
                if (res.data.auditFlow.audit[i].type == 2) {
                  this.shenheliuwu.push(res.data.auditFlow.audit[i])
                }
                if (res.data.auditFlow.audit[i].type == 3) {
                  this.shenheliuchang.push(res.data.auditFlow.audit[i])
                }
              }

              /*查找当前审核人是谁*/
              for (let i = 0; i < this.shenheliuhuo.length; i++) {
                if (this.shenheliuhuo[i].auditIdea == '' && count < 1) {
                  this.shenheliuhuo[i].index = i;
                  count++;
                }
              }

              if (this.shenheliuhuo[this.shenheliuhuo.length - 1].auditIdea == 1) {
                /*查找当前审核人是谁*/
                for (let i = 0; i < this.shenheliuwu.length; i++) {
                  if (this.shenheliuwu[i].auditIdea == '' && countw < 1) {
                    this.shenheliuwu[i].index = i;
                    countw++;
                  }
                }
                // console.log(this.shenheliuwu)
                /*查找当前审核人是谁*/
                for (let i = 0; i < this.shenheliuchang.length; i++) {
                  if (this.shenheliuchang[i].auditIdea == '' && countc < 1) {
                    this.shenheliuchang[i].index = i;
                    countc++;
                  }
                }
              }
            }

            if (res.data.auditFlow.auditLog.length>0) {
              // this.total = res.data.total
              let count = 0;//需要查找当前的操作人数，找排在最前的元素
              let countw = 0;//需要查找当前的操作人数，找排在最前的元素
              let countc = 0;//需要查找当前的操作人数，找排在最前的元素
              for (var i = 0; i < res.data.auditFlow.auditLog.length; i++) {
                if (res.data.auditFlow.auditLog[i].type == 1) {
                  this.shenhe.push(res.data.auditFlow.auditLog[i])
                }
                if (res.data.auditFlow.auditLog[i].type == 2) {

                  this.shenhe.push(res.data.auditFlow.auditLog[i])
                }
                if (res.data.auditFlow.auditLog[i].type == 3) {
                  this.shenhe.push(res.data.auditFlow.auditLog[i])
                }
              }

              /*查找当前审核人是谁*/
              for (let i = 0; i < this.shenheliuhuo.length; i++) {
                if (this.shenheliuhuo[i].auditIdea == '' && count < 1) {
                  this.shenheliuhuo[i].index = i;
                  count++;
                }
              }

              if (this.shenheliuhuo[this.shenheliuhuo.length - 1].auditIdea == 1) {
                /*查找当前审核人是谁*/
                for (let i = 0; i < this.shenheliuwu.length; i++) {
                  if (this.shenheliuwu[i].auditIdea == '' && countw < 1) {
                    this.shenheliuwu[i].index = i;
                    countw++;
                  }
                }
                // console.log(this.shenheliuwu)
                /*查找当前审核人是谁*/
                for (let i = 0; i < this.shenheliuchang.length; i++) {
                  if (this.shenheliuchang[i].auditIdea == '' && countc < 1) {
                    this.shenheliuchang[i].index = i;
                    countc++;
                  }
                }
              }
            }
            this.loading = false
          }
        })
      },
      search() {
        this.params.current = 1
        this.getbaoming()
      },
      changePage(current, size) {
        this.params.current = current
        this.params.size = size
        this.getbaoming()
      },
      searchxf() {
        this.fafangxf.current = 1
        this.getxuefen()
      },
      searchxfs() {
        this.fafangxf.current = 1
        this.getxuefens()
      },
      changePagexf(current, size) {
        this.fafangxf.current = current
        this.fafangxf.size = size
        this.getxuefen()
      },
      changePagexfs(current, size) {
        this.fafangxfs.current = current
        this.fafangxfs.size = size
        this.getxuefens()
      },
      async getxuefen() {
        await this.$http.get('/activity/member/info/all', {params: this.fafangxf}).then(res => {
          if (res.code == 200) {
            this.xfdata=[]
            this.fafangxf.total =''
            this.xfdata = res.data.list
            this.fafangxf.total = parseInt(res.data.total)
          }
          this.loading = false
        })
      },
      async getxuefens() {
        await this.$http.get('/activity/member/info/upList', {params: this.fafangxfs}).then(res => {
          if (res.code == 200) {
            this.xfdata=[]
            this.fafangxfs.total =''
            this.xfdata = res.data.list
            this.fafangxfs.total = parseInt(res.data.total)
            // this.selectMemoriedDataFn();
          }
          this.loading = false
        })
      },
      async getbaoming() {
        await this.$http.get('/activity/member-personal', {params: this.params}).then(res => {
          if (res.code == 200) {
            this.databm=[]
            this.total=''
            this.databm = res.data.list
            this.total = res.data.total
          }
          this.loading = false
        })
      },
      getwanjieliu(){
        this.$http.get('/activity/finishAuditFlow',  {params: {
          actId: this.$route.query.id,
        }}).then(res => {
          if (res.code == 200) {
          this.wanjieliulist= res.data.audit
          this.wanjieliulist2= res.data.auditLog
          }
          this.loading = false
        })

      },
      wanjie() {
        this.$http.get('/activity/finishInfo', {
          params: {
            actId: this.$route.query.id
          }
        }).then(res => {
          if (res.code == 200) {
            if(res.data=='未找到此活动完结信息。'){
              this.wu = 1
            }else {
              this.wanjiedata = res.data
            }

          } else {
            this.wu = 1
          }
        })
      },
      handleClick(activeName) {
        this.actitype = activeName
        if (activeName == '2') {
          this.getbaoming()
        }
        if (activeName == '3') {
          this.wanjie()
          this.getwanjieliu()
        }
        if (activeName == '4') {
          if (this.oto==0){
            this.getxuefen()
          } ;
          if (this.oto==1){
            this.getxuefens()
          } ;
        }
      },
      gopage(type,actId,userId){
      if(type==1){
        this.$router.push({path:"/proceeding/wait/activity/votexf", query: {actId:actId,type:type,uid:userId,actitype:this.actitype}})
      }
        if(type==2){
          this.$router.push({path:"/proceeding/wait/activity/questionnairexf", query: {actId:actId,type:type,uid:userId,actitype:this.actitype}})
        }
        if(type==3){
          this.$router.push({path:"/proceeding/wait/activity/appraisalxf", query: {actId:actId,type:type,uid:userId,actitype:this.actitype}})
        }
        if(type==4){
          this.$router.push({path:"/proceeding/wait/activity/collectxf", query: {actId:actId,type:type,uid:userId,actitype:this.actitype}})
        }
        if(type==5){
          this.$router.push({path:"/proceeding/wait/activity/messageboardxf", query: {actId:actId,type:type,uid:userId,actitype:this.actitype}})
        }
      },
      submitUpload() {
        if (this.clickAble){
          this.setProgress()
          this.$refs.childUpload.submitUpload2()
        }else{
          this.$message({
            type: 'error',
            message: '请重新上传文件'
          });
          return;
        }
      },
      resetUpload(){
        this.fileList = []
        this.showfileInfor = false
        this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.showfileInforDetail =false
        this.$refs.childUpload.closeUpload();
        this.clickAble = true
        this.getbaoming()
      },
      //显示本地上传发文件
      setFileList(fileList){
        this.fileList = fileList
        this.fileListName = fileList[0].name
      },
      //下载失败模板
      downFailed(){
        axios({
          method: 'post',
          url: 'school/fail/activity/members/export',
          responseType: 'blob',
          data:{
            randomData:   this.randomData,
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
          link.setAttribute('download', '补录人员失败信息' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })
      },
      beforeCloseImportCollegeHandler() {
        this.fileList = []
        this.showfileInfor = false
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
      },
      //导入成功返回
      openfileInfor(res){
        if (res != false){
          this.randomData = res.randomData
          this.showfileInfor = true
          this.fileInforamtion = res
          this.fileUploadPercent=100
          clearInterval(this.Interval);
          setTimeout(()=>{
            this.showfileInfor =true
            this.showfileInforDetail =true
            this.showProgress=false;
          },2000)
        }else{
          clearInterval(this.Interval);
          this.fileUploadPercent = 0
          this.showfileInforDetail = false
          this.showProgress = false
          this.showfileInfor = false
          this.clickAble = false
        }
        // this.dialogImportCollegeVisible = false;
      },
      setProgress(progressInfo){
        this.showfileInfor =true
        this.showProgress =true
        this.showfileInforDetail =false
        this.fileUploadPercent = 0
        var s = 1
        this.Interval = setInterval(()=>{
          s++
          this.fileUploadPercent = s
          if(s==90){
            clearInterval(this.Interval);
          }
        },100)
      },
      goBack() {
        this.$router.push({
          path:  localStorage.getItem("frompath"),

        })
      },
    },

  }
</script>
<style>
  .jd .el-progress-bar__innerText {
    color: #e6762f;
  }
.xf .cell:first-child {

  text-align: center;
}
  .el-radio-button__inner{
    border-left: 1px solid #dcdfe6;
  }
</style>
<style lang="scss" scoped>
  .main-body div span:first-child {
    width: 12%;
    display: inline-block;
  }

  .el-form-item {
    margin-right: 5px !important;
  }

  .xinxitou {
    border-radius: 5px;

    padding: 8px;
    background: rgb(190, 224, 247);
    padding-left: 18px;
    margin-bottom: 15px;
  }
</style>

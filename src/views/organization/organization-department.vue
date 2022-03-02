<template>
  <div class="rightBg">

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
                  <a class="el-button el-button--text el-button--mini" download="" href='/static/tpls/行政机构模板.xlsx'
                     size='mini'> 模板下载</a>
                </span>
            </div>
            <el-form-item label="" prop="name">
              <el-col :span="22">
                <upload-file
                  ref="childUpload"
                  uploadUrl="/school/administrations/import"
                  uploadType=".xls,.xlsx"
                  uploadSzie="100"
                  uploadSzieTips="只能上传xlx/xlsx文件，且不超过100MB!"
                  @fileInfor="openfileInfor"
                  @setFileList="setFileList"
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

    <el-dialog title="批量导入"
               :visible.sync='dialogImportCollegeVisible2'
               @close="beforeCloseImportCollegeHandler2"
               :close-on-click-modal="false"
               width='650px' id="dialogOrange">
      <div>

        <div v-show="!showfileInfor2">

          <div class="uploadLocal" v-show="fileList2.length">
            <div class="uploadLocal-circel">
              <p style="padding-top:57px;"><img src="../../assets/images/upload_two@2x.png" style="width:70px;"></p>
              <p style="padding-top:10px;font-size:14px;color:#333;">{{fileListName2}}</p>
            </div>
            <div class="uploadLocal-btn">
              <button class="uploadLocal-btnReset" @click="resetUpload2">重新上传</button>
              <button class="uploadLocal-btnSubmit" @click="submitUpload2">确认导入</button>
            </div>
          </div>

          <el-form v-show="!fileList2.length" size='mini' label-width='12px'>
            <div class="importTipsTitle">
                 <span class="importTipsTitle-left">
                    请下载导入模板，按格式修改后导入
                 </span>
              <span class="importTipsTitle-right">
                   <a class="el-button el-button--text el-button--mini" download="" href='/static/tpls/行政机构成员模板.xlsx'
                      size='mini'> 模板下载</a>
                 </span>
            </div>
            <el-form-item label="" prop="name">
              <el-col :span="22">
                <upload-file
                  ref="childUpload2"
                  uploadUrl="/school/whole/organization/member/import"
                  uploadType=".xls,.xlsx"
                  uploadSzie="100"
                  uploadSzieTips="只能上传xlx/xlsx文件，且不超过100MB!"
                  @fileInfor="openfileInfor2"
                  @setFileList="setFileList2"
                >
                </upload-file>
              </el-col>
            </el-form-item>
          </el-form>

        </div>
        <div class="progress-line" v-if="showProgress2">
          <el-progress :stroke-width="18" :percentage="fileUploadPercent" style="margin-top:30px;"></el-progress>
          <p style="text-align: center;padding: 20px 0px 10px;">正在上传，请您耐心等待...</p>
          <span style="display: block; text-align: center; font-size: 13px; color: #999">请勿关闭浏览窗口</span>
        </div>
        <div class="importFail" v-show="showfileInforDetail2  && fileInforamtion2.total != fileInforamtion2.success">
          <div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_fail@2x.png'></div>
          <div class="importFail-tips">
            <span style="color:#4D98FF;">{{fileInforamtion2.success}}</span>条导入成功，<span style="color:#FFC600;">{{fileInforamtion2.failed}}</span>条导入失败
            <span @click="downFailed2()" style="cursor:pointer;color:#4D98FF"
                  v-if="fileInforamtion2.failed">下载失败列表</span>
          </div>
          <div class="uploadLocal-btn">
            <button class="uploadLocal-btnReset" @click="resetUpload2">重新导入</button>
          </div>
        </div>

        <div class="importSuccess" v-show="showfileInforDetail2 && fileInforamtion2.total == fileInforamtion2.success">
          <div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_success@2x.png'></div>
          <div class="importFail-tips">
            <span style="color:#4D98FF;">{{fileInforamtion2.success}}</span>条导入成功
          </div>
          <div class="uploadLocal-btn">
            <button class="uploadLocal-btnReset" @click="resetUpload2">继续导入</button>
          </div>
        </div>


      </div>
    </el-dialog>


    <el-dialog title="批量导入"
               :visible.sync='dialogImportCollegeVisible3'
               @close="beforeCloseImportCollegeHandler3"
               :close-on-click-modal="false"
               width='650px' id="dialogOrange">
      <div>

        <div v-show="!showfileInfor3">

          <div class="uploadLocal" v-show="fileList3.length">
            <div class="uploadLocal-circel">
              <p style="padding-top:57px;"><img src="../../assets/images/upload_two@2x.png" style="width:70px;"></p>
              <p style="padding-top:10px;font-size:14px;color:#333;">{{fileListName3}}</p>
            </div>
            <div class="uploadLocal-btn">
              <button class="uploadLocal-btnReset" @click="resetUpload3">重新上传</button>
              <button class="uploadLocal-btnSubmit" @click="submitUpload3">确认导入</button>
            </div>
          </div>

          <el-form v-show="!fileList3.length" size='mini' label-width='12px'>
            <div class="importTipsTitle">
                  <span class="importTipsTitle-left">
                     请下载导入模板，按格式修改后导入
                  </span>
              <span class="importTipsTitle-right">
                    <a class="el-button el-button--text el-button--mini" download="" href='/static/tpls/机构内成员模板.xlsx'
                       size='mini'> 模板下载</a>
                  </span>
            </div>
            <el-form-item label="" prop="name">
              <el-col :span="22">
                <upload-file
                  ref="childUpload3"
                  :dataObj="dataObj2"
                  uploadUrl="/school/one/administration/member/import"
                  uploadType=".xls,.xlsx"
                  uploadSzie="100"
                  uploadSzieTips="只能上传xlx/xlsx文件，且不超过100MB!"
                  @fileInfor="openfileInfor3"
                  @setFileList="setFileList3"
                >
                </upload-file>
              </el-col>
            </el-form-item>
          </el-form>

        </div>

        <div class="progress-line" v-if="showProgress3">
          <el-progress :stroke-width="18" :percentage="fileUploadPercent" style="margin-top:30px;"></el-progress>
          <p style="text-align: center;padding: 20px 0px 10px;">正在上传，请您耐心等待...</p>
          <span style="display: block; text-align: center; font-size: 13px; color: #999">请勿关闭浏览窗口</span>
        </div>

        <div class="importFail" v-show="showfileInforDetail3  && fileInforamtion3.total != fileInforamtion3.success">
          <div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_fail@2x.png'></div>
          <div class="importFail-tips">
            <span style="color:#4D98FF;">{{fileInforamtion3.success}}</span>条导入成功，<span style="color:#FFC600;">{{fileInforamtion3.failed}}</span>条导入失败
            <span @click="downFailed3()" style="cursor:pointer;color:#4D98FF"
                  v-if="fileInforamtion3.failed">下载失败列表</span>
          </div>
          <div class="uploadLocal-btn">
            <button class="uploadLocal-btnReset" @click="resetUpload3">重新导入</button>
          </div>
        </div>

        <div class="importSuccess" v-show="showfileInforDetail3 && fileInforamtion3.total == fileInforamtion3.success">
          <div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_success@2x.png'></div>
          <div class="importFail-tips">
            <span style="color:#4D98FF;">{{fileInforamtion3.success}}</span>条导入成功
          </div>
          <div class="uploadLocal-btn">
            <button class="uploadLocal-btnReset" @click="resetUpload3">继续导入</button>
          </div>
        </div>


      </div>
    </el-dialog>

    <el-dialog @close="boforeCloseMember" :visible.sync="showMember" width="585px">

      <div slot="title">
      <span class="alertTitle">
            {{ruleFormMember.id ? "修改" : '新增'}}成员</span>
      </div>

      <div>
        <el-form label-position="left" size="mini" :model="ruleFormMember" :rules="rulesMember" ref="ruleFormMember" label-width="120px"
                 class="demo-ruleForm">

          <el-form-item label="成员" prop="userId">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="ruleFormMember.userId" filterable value-key="value"
                         :multiple-limit=1 remote placeholder="输入添加的成员姓名搜索" :remote-method="remoteMethod2"
                         @clear="clear">
                <el-option v-for="item in options42" :key="item.id" :label="item.name +' - '+ item.code"
                           :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>


          <el-form-item label="身份" prop="identity">
            <el-col :span="22">
              <el-radio-group v-model="ruleFormMember.identity">
                <el-radio :label="3">普通成员</el-radio>
                <el-radio :label="2">管理员</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>


          <el-form-item label="职务" prop="duty">
            <el-col :span="22">
              <el-input maxLength="20" placeholder="请输入组织名称(20字以内)" v-model.trim="ruleFormMember.duty"
                        style='width: 100%;'></el-input>
            </el-col>
          </el-form-item>


          <el-form-item>
            <el-button type="primary" :disabled="$store.state.sys.isClick" class="blueButton" v-if="ruleFormMember.id"
                       @click="memberAdd('ruleFormMember',1)">修改
            </el-button>
            <el-button type="primary" :disabled="$store.state.sys.isClick" class="blueButton" v-if="!ruleFormMember.id"
                       @click="memberAdd('ruleFormMember',2)">添加
            </el-button>
            <el-button :disabled="$store.state.sys.isClick" class='marginr-20 piercedBlueButton'
                       @click='showMember=false'>取消
            </el-button>
          </el-form-item>
        </el-form>


      </div>

    </el-dialog>

    <el-dialog @close="beforeRoleCloseTheme" :visible.sync="showTheme" width="585px">

      <div slot="title">
      <span class="alertTitle">
            {{ruleFormTheme.id ? "编辑" : '新增'}}机构</span>
      </div>

      <div>
        <el-form size="mini" :model="ruleFormTheme" :rules="rules" ref="ruleFormTheme" label-width="120px"
                 class="demo-ruleForm">

          <el-form-item label="机构名称" prop="name">
            <el-col :span="22">
              <el-input placeholder="请输入机构名称(30字以内)" maxLength="30" v-model.trim="ruleFormTheme.name"
                        style='width: 100%;'></el-input>
            </el-col>
          </el-form-item>


          <el-form-item label="所属校区" prop="campusId">
            <el-col :span="22">
              <el-select @change="changeSchool" style="width:100%" v-model="ruleFormTheme.campusId" placeholder="请选择学校">
                <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <!--TODO-->
          <el-form-item label="级别" prop="level">
            <el-col :span="22">
              <el-radio-group v-model="ruleFormTheme.level">
                <el-radio :label="1">校级</el-radio>
                <el-radio :label="2">院系级</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>

          <el-form-item label="所属院系" prop="collegeId" v-if="ruleFormTheme.level == 2">
            <el-col :span="22">
              <el-select style="width:100%" v-model="ruleFormTheme.collegeId" placeholder="请选择院系">
                <el-option v-for="item in colleges" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <!--v-if="!this.ruleFormTheme.parentId"-->
          <el-form-item label="所属机构" v-if="!this.ruleFormTheme.parentId">
            <el-col :span="22">
              <el-cascader placeholder="请选择所属机构" :props="defaultProps" style="width:100%" class="selectWidth"
                           expand-trigger="click" v-model="ruleFormTheme.parentIds" clearable :options="classifies"
                           :change-on-select="true" :show-all-levels="true"></el-cascader>
            </el-col>
          </el-form-item>


          <el-form-item label="负责人" prop="userId" v-if="!this.ruleFormTheme.id">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="ruleFormTheme.userId" filterable value-key="value"
                         :multiple-limit=1 remote placeholder="请输入负责人姓名搜索" :remote-method="remoteMethod" @clear="clear"
                         :loading="loading">
                <el-option v-for="item in options4" :key="item.id" :label="item.name" :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span> -->
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :disabled="$store.state.sys.isClick" class="blueButton" v-if="ruleFormTheme.id"
                       @click="themeAdd('ruleFormTheme',1)">确定
            </el-button>
            <el-button type="primary" :disabled="$store.state.sys.isClick" class="blueButton" v-if="!ruleFormTheme.id"
                       @click="themeAdd('ruleFormTheme',2)">添加
            </el-button>
            <el-button class='marginr-20 piercedBlueButton' @click='showTheme=false'>取消</el-button>
          </el-form-item>
        </el-form>


      </div>


    </el-dialog>


    <el-dialog @close="beforeRoleCloseSetCharge" :visible.sync="showSetCharge" width="585px">

      <div slot="title">
      <span class="alertTitle">
        设置负责人
      </span>
      </div>

      <div>
        <el-form size="mini" :model="ruleFormSetCharge" :rules="ruleSetCharge" ref="ruleSetCharge" label-width="120px"
                 class="demo-ruleForm">

          <el-form-item label="负责人" prop="userId">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="ruleFormSetCharge.userId" filterable value-key="value"
                         :multiple-limit=1 remote placeholder="请输入负责人姓名搜索" :remote-method="remoteMethod5" @clear="clear"
                         :loading="loading">
                <el-option v-for="item in options45" :key="item.id" :label="item.name" :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span> -->
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>


          <el-form-item>
            <el-button type="primary" :disabled="$store.state.sys.isClick" class="blueButton"
                       @click="thememSetCharge('ruleSetCharge')">确定
            </el-button>
            <el-button class='marginr-20 piercedBlueButton' @click='showSetCharge=false'>取消</el-button>
          </el-form-item>
        </el-form>


      </div>


    </el-dialog>


    <el-dialog @close="beforeRoleCloseCharge" :visible.sync="ShowruleFormCharge" width="585px">

      <div slot="title">
      <span class="alertTitle">
       转让负责人
      </span>
      </div>

      <div>
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


      </div>


    </el-dialog>

    <el-dialog :visible.sync="ShowruleFormDuty" width="585px">

      <div slot="title">
      <span class="alertTitle">
       编辑职务
      </span>
      </div>

      <div>
        <el-form size="mini" :model="FormCharge" :rules="ruleFormDuty" ref="ruleFormDuty" label-width="120px"
                 class="demo-ruleForm">

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


    <div class="roleMain">

      <div class="roleMain-left">
        <div class="roleMain-left-top" style="position:relative;z-index:998;float:left;margin-left:10px;">
          <el-input v-model="keyWord" style="width:220px;float:left;" placeholder="请输入机构名称搜索"></el-input>
          <img @click="search()" src="../../assets/images/fagnda.png" class="searchRole">
          <span @click="toggleAdd" style="float:left;cursor:pointer;margin-left:15px;margin-top:6px;">
            <img src="../../assets/images/jiahao.png" style="width:18px;">
         </span>

          <!-- <div class="classDian2" id="myPanel" v-if="isAdd" v-clickOutSide="handlerClick"> -->
          <div class="classDian2" id="myPanel" v-if="isAdd">
            <div class="MoreChild" style="height:auto;">
              <div class="MoreChild2">
                <span class="MoreChild3"></span>
                <span><a @click="addOragazion">添加机构</a></span>
                <span><a @click="dialogImportCollegeVisible = true,isAdd = false">导入机构</a></span>
                <span><a @click="dialogImportCollegeVisible2 = true,isAdd = false">导入成员</a></span>
              </div>
            </div>
          </div>

        </div>
        <div style="clear:both"></div>
        <el-tree style="max-height: 700px;overflow-y: auto;" ref="treeBox" node-key="id" :props="defaultProps"
                 :expand-on-click-node="false" highlight-current :accordion="false" :data="data"
                 @node-click="handleNodeClick">

        <span class="custom-tree-node" style='width:190px;' slot-scope="{ node, data }">
           <span
             style="float:left;width:100px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap; -o-text-overflow: ellipsis;">{{ node.label}}</span>

        </span>

        </el-tree>
      </div>


      <div class="roleMain-right" v-if="data.length">

        <div class="orgnazitonTitle">
          <div class="orgnazitonTitle-content" style="float:left;">
            <p><b>{{groupDetail.name}}</b>
              &#12288;<el-button v-if="groupDetail.responsiblePerson == 0" type="text" @click="setChargePerson()"><i
                style="font-size:18px;color:red" class="el-icon-warning"></i> <u
                style="font-size:16px;color:red">去设置负责人</u></el-button>
            </p>
            <p>
              <span v-if="groupDetail.parentName">所属机构：{{groupDetail.parentName}}&#12288;</span>
              <span>级别：{{groupDetail.level == 1 ? "校级" : "院系级"}}&#12288;</span>
              <span>所属校区：
              <span v-if="groupDetail.campusName">{{groupDetail.campusName}}</span>
              <span v-else>
              <el-button @click="editOrgnaziton()" type="text" class="opreat-btn">去设置</el-button>
              </span>
            </span>
              <span v-if="groupDetail.level == 2">所属院系：{{groupDetail.collegeName}}</span>
            </p>
          </div>
          <span style="float:right;">
          <el-button v-perms="'/executive/department/add'" @click="addChildOrgnaziton()" type="text"
                     class="opreat-btn">添加子机构</el-button>&#12288;
          <el-button v-perms="'/executive/department/edit'" @click="editOrgnaziton()" type="text" class="opreat-btn">编辑</el-button>&#12288;
          <el-button v-perms="'/executive/department/delete'" @click="deleteOrgnaziton()" type="text"
                     class="opreat-btn">删除</el-button>
        </span>
        </div>

        <div class="search-box">
        <span class="fl" style="float:left;">
          <el-form size="mini" :inline="true" class="demo-form-inline">

           <el-form-item>
             <el-input v-model="paramsMember.keyWord" maxlength=30 placeholder="请输入姓名搜索"></el-input>
           </el-form-item>
           <el-form-item>
             <el-select v-model="paramsMember.role">
               <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"></el-option>
             </el-select>
           </el-form-item>

            <el-form-item>
              <el-input v-model="paramsMember.duty" maxlength=30 placeholder="请输入职务搜索"></el-input>
           </el-form-item>

           <el-form-item>
             <el-button @click="searchMember()" class='blueButton2 blueButtonSmall' size="mini"
                        type="primary">搜索</el-button>
           </el-form-item>
         </el-form>
        </span>
          <!-- <span class="fl checkoutOrganazion" style="margin-left:30px;margin-top:3px;float:left;">
                <el-checkbox @change="changeSelf">查看本组织</el-checkbox>
          </span> -->
          <span style="float:right;">
          <el-button @click="dialogImportCollegeVisible3 = true" class='blueButton2 blueButtonSmall' size="mini"
                     type="primary">导入成员</el-button>
          <el-button @click="tianjia" class='blueButton2 blueButtonSmall' size="mini"
                     type="increase">添加成员</el-button>
        </span>
        </div>


        <div class="tableWidth">

          <el-table border ref="multipleTable" :data="list" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column prop="code" label="学号/工号"></el-table-column>
            <el-table-column prop="identity" label="身份">
              <template slot-scope="scope">
                {{scope.row.role == 3 ? "普通成员" : (scope.row.role == 2 ? '管理员' : (scope.row.role == 1 ? "负责人"
                : '其他'))}}
              </template>
            </el-table-column>
            <el-table-column prop="duty" label="职务">
              <template slot-scope="scope">
                <span v-if="scope.row.duty">{{scope.row.duty}}</span>
                <span v-else>无</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="操作">
              <template slot-scope="scope">
                <span v-perms="'/executive/department/member/edit'"><el-button type="text"
                                                                                  class='marginr-20 blueTextButton'
                                                                                  @click="modifyDuty(scope.row)"><u>编辑职务</u></el-button></span>
                <span v-perms="'/executive/department/member/delete'"><el-button type="text"
                                                                                    v-if="scope.row.role != 1"
                                                                                    @click="deleteMebmer(scope.row)"
                                                                                    class='marginr-20 blueTextButton'><u>删除</u></el-button></span>
                <span v-perms="'/executive/department/responsible/attorn'"><el-button type="text"
                                                                                         v-if="scope.row.role == 1"
                                                                                         @click="modifyCharge(scope.row)"
                                                                                         class='marginr-20 blueTextButton'><u>转让负责人</u></el-button></span>
                <span v-perms="'/executive/department/Administrators/install'"><el-button type="text"
                                                                                             v-if="scope.row.role == 2"
                                                                                             @click="setMember(scope.row,2)"
                                                                                             class='marginr-20 blueTextButton'><u>设为普通成员</u></el-button></span>
                <span v-perms="'/executive/department/Administrators/install'"><el-button type="text"
                                                                                             v-if="scope.row.role == 3"
                                                                                             @click="setMember(scope.row,1)"
                                                                                             class='marginr-20 blueTextButton'><u>设为管理员</u></el-button></span>
              </template>
            </el-table-column>
          </el-table>

        </div>

        <div style="width:98%;margin:0 auto;font-size:14px;padding-top:30px;">
          <!-- <span class="fl" @click="toggleSelection(list)" style="margin-top:3px;margin-left:15px;">
             <el-checkbox v-model="isCheckAll"> &#12288;全选</el-checkbox>
         </span> -->
          <span class="fl" style="float:left;">
          <el-dropdown size="mini" split-button type="primary" @command="importAllStudent"
                       v-perms="'/executive/department/member/delete'">
            导出
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">导出所选</el-dropdown-item>
              <el-dropdown-item command="b">导出所有</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button v-perms="'/executive/department/member/delete'" size="mini" type="primary"
                     @click="setAllStatus(1)">删除</el-button>
        </span>
          <div class="block text-center  fr">
            <qu-pagination :total="total" @change="getPages"></qu-pagination>
            <!-- <cms-pagination :total="total" @change="getPages"></cms-pagination> -->
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
  import {clickOutSide} from '@/utils/directives'
  import axios from 'axios'
  import {
    cascade2,
    cascade3,
    getNode2
  } from "@/utils/filters"

  export default {
    directives: {
      clickOutSide
    },
    data() {
      return {
        level: '1',
        showEdit: false,
        fileListName: '',
        fileList: [],
        randomData: '',
        fileListName2: '',
        fileList2: [],
        randomData2: '',
        fileListName3: '',
        fileList3: [],
        randomData3: '',
        temporaryList: {},
        ShowruleFormDuty: false,
        ShowruleFormCharge: false,
        FormCharge: {
          userId: ''
        },
        ruleFormDuty: {
          duty: '',
          id: ''
        },
        ruleFormSetCharge: {
          organizationId: '',
          userId: ''
        },
        schools: [
          {
            id: 0,
            name: localStorage.getItem('schoolName')
          }
        ],
        colleges: [],
        naturees: [
          {
            label: '典型社团',
            value: 1,
          },
          {
            label: '示范社团',
            value: 2,
          },
          {
            label: '特色社团',
            value: 3,
          }
        ],
        showfileInfor: false,
        fileInforamtion: {},
        dialogImportCollegeVisible: false,
        showfileInfor2: false,
        fileInforamtion2: {},
        dialogImportCollegeVisible2: false,
        showfileInfor3: false,
        fileInforamtion3: {},
        dialogImportCollegeVisible3: false,
        groupId: '',
        dataObj2: {
          organizationId: ""
        },
        roleMermber: [],
        identites: [{
          label: '普通成员',
          value: 0
        },
          {
            label: '管理员',
            value: 2
          },
        ],
        isShowAdmin: localStorage.getItem("isAdmin") == 1 ? true : false,
        IsRoleChange: '',
        showMember: false,
        roles: [],
        appenderes: [],
        roleMermber2: [],
        options4: [],
        options42: [],
        options43: [],
        options45: [],
        list: [],
        options: [],
        loading: false,
        isAdd: false,
        keyWord: '',
        ruleFormCharge: {
          userId: [{
            required: true,
            message: '请输入负责人姓名',
            trigger: 'blur'
          }]
        },
        ruleSetCharge: {
          userId: [{
            required: true,
            message: '请输入负责人姓名',
            trigger: 'blur'
          }]
        },
        rulesMember: {
          userId: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          identity: [{
            required: true,
            message: '请选择身份',
            trigger: 'blur'
          }],

        },

        rules: {
          name: [{
            required: true,
            message: '请填写名称',
            trigger: 'blur'
          }],
          parentIds: [{
            required: true,
            message: '请选择上级组织',
            trigger: 'change'
          }],
          campusId: [{
            required: true,
            message: '请选择校区',
            trigger: 'change'
          }],
          collegeId: [{
            required: true,
            message: '请选择院系',
            trigger: 'change'
          }],
          userId: [{
            required: true,
            message: '请选择负责人',
            trigger: 'change'
          }],
          introduce: [{
            required: true,
            message: '请名输入简介',
            trigger: 'blur'
          }]
        },
        rules2: {
          name: [{
            required: true,
            message: '请填写名称',
            trigger: 'blur'
          }],
          parentIds: [{
            required: true,
            message: '请选择上级组织',
            trigger: 'change'
          }],
          // roleIds2: [{
          //   required: true,
          //   message: '请选择角色',
          //   trigger: 'change'
          // }],
          responserId: [{
            required: true,
            message: '请选择负责人',
            trigger: 'change'
          }],
          // appenderId2: [{
          //   required: true,
          //   message: '请选择挂靠单位',
          //   trigger: 'change'
          // }],
          // guiderId: [{
          //   required: true,
          //   message: '请选择指导老师',
          //   trigger: 'change'
          // }],
          // introduce: [{
          //   required: true,
          //   message: '请名输入简介',
          //   trigger: 'blur'
          // }]
        },
        remnant: '0',
        groupDetail: {},
        showSetCharge: false,
        showTheme: false,
        showTheme2: false,
        ruleFormTheme: {
          id: '',
          name: "",
          userId: '',
          parentIds: [],
          parentId: '',
          level: 1,
          campusId: '',
          collegeId: '',
          organizationId: '',
        },
        appenderes2: [],
        ruleFormTheme2: {
          id: '',
          name: "",
          nature: 1,
          avatar: '',
          responserId: '',
          parentIds: [],
          parentId: '',
          roleIds: '',
          roleIds2: [],
          guiderId: '',
          guiderId2: '',
          appenderId2: [],
          appenderId: '',
          introduce: '',
        },
        ruleFormMember: {
          userId: '',
          identity: 3,
          duty: '',
          orgId: ''
        },
        defaultProps: {
          children: 'children',
          value: 'id',
          label: 'name'
        },
        ruleForm: {
          current: 1,
          size: 10,
          type: 1,
          keyWord: ''
        },
        paramsMember: {
          orgId: '',
          role: '',
          current: 1,
          size: 10,
          keyWord: '',
          duty: ''
        },
        params: {
          current: 1,
          size: 10,
          type: 1,
          keyWord: ''
        },
        types: [{
          id: '',
          name: '身份不限'
        },
          {
            id: 1,
            name: '负责人'
          },
          {
            id: 2,
            name: '管理员'
          },
          {
            id: 3,
            name: '普通成员'
          }
        ],
        currentID: '',
        data: [],
        classifies: [],
        total: 0,
        isCheckAll: false,

        fileUploadPercent: 0,
        showfileInforDetail: false,
        clickAble: true,
        showProgress: false,
        showfileInforDetail2: false,
        clickAble2: true,
        showProgress2: false,
        showfileInforDetail3: false,
        clickAble3: true,
        showProgress3: false,

      }
    },
    created() {
      this.getRole();
      this.getCampus();
      // this.getMembers()

      // this.$http.get("/backend/school-department/allList", {
      //   params: {
      //     name: ''
      //   }
      // }).then(res => {
      //   this.appenderes = cascade2(0, res.data)
      //   this.appenderes2 =  res.data
      // })
      //
      //
      // // this.getAllRole();
      // if (localStorage.getItem("isAdmin") == 1) {
      //
      //   this.$http.get("/backend/school-department/role/department/list", {
      //     params: {
      //       departmentId: 0
      //     }
      //   }).then(res => {
      //     this.roles = cascade2(0, res.data)
      //   })
      //   this.IsRoleChange = ""
      // } else {
      //   this.IsRoleChange = "parentIds"
      // }


    },
    mounted() {


    },
    methods: {
      tianjia(){
        this.showMember = true
        this.ruleFormMember.identity=3
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
      setProgress2(progressInfo) {

        this.showfileInfor2 = true
        this.showProgress2 = true
        this.showfileInforDetail2 = false
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
      setProgress3(progressInfo) {

        this.showfileInfor3 = true
        this.showProgress3 = true
        this.showfileInforDetail3 = false
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
          url: 'school/fail/department/export',
          responseType: 'blob',
          data: {
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
          link.setAttribute('download', '行政机构失败信息' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })

      },
      resetUpload2() {
        this.fileList2 = []
        this.showfileInfor2 = false
        this.fileInforamtion2 = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.$refs.childUpload2.closeUpload();
        this.showfileInforDetail2 = false
        this.fileUploadPercent = 0
        this.clickAble2 = true
      },
      //显示本地上传发文件
      setFileList2(fileList) {
        this.fileList2 = fileList
        this.fileListName2 = fileList[0].name
      },
      //下载失败模板
      downFailed2() {

        axios({
          method: 'post',
          url: 'school/fail/allDepartment/members/export',
          responseType: 'blob',
          data: {
            randomData: this.randomData2
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
      resetUpload3() {
        this.fileList3 = []
        this.showfileInfor3 = false
        this.fileInforamtion3 = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.$refs.childUpload3.closeUpload();
        this.showfileInforDetail3 = false
        this.fileUploadPercent = 0
        this.clickAble3 = true
      },
      //显示本地上传发文件
      setFileList3(fileList) {
        this.fileList3 = fileList
        this.fileListName3 = fileList[0].name
      },
      //下载失败模板
      downFailed3() {

        axios({
          method: 'post',
          url: 'school/fail/oneDepartment/members/export',
          responseType: 'blob',
          data: {
            randomData: this.randomData3
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
          link.setAttribute('download', '机构成员失败信息' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })

      },
      toggleAdd() {
        this.isAdd = !this.isAdd
        this.currentID = ''
      },
      beforeRoleCloseSetCharge() {
        this.$refs['ruleSetCharge'].resetFields();
      },
      setChargePerson() {
        this.showSetCharge = true
      },
      handlerClick() {
        this.isAdd = false
      },
      importAllStudent(command) {

        if (command == "a") {

          var arrAl = []
          if (this.multipleSelection && this.multipleSelection.length) {
            this.multipleSelection.forEach(item => {
              arrAl.push(item.userId)
            })
          }


          if (arrAl.length) {


            axios({
              method: 'get',
              url: 'organization/administration/member/export',
              responseType: 'blob',
              params: {
                userIds: arrAl.join(","),
                administrationId: this.groupId

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
              link.setAttribute('download', '成员列表' + '.xlsx')
              document.body.appendChild(link)
              link.click()
            })

          }

        } else {


          axios({
            method: 'get',
            url: '/organization/administration/member/export',
            responseType: 'blob',
            params: {
              userIds: "",
              administrationId: this.groupId

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
            link.setAttribute('download', '成员列表' + '.xlsx')
            document.body.appendChild(link)
            link.click()
          })


        }


      },
      setMember(row, type) {
        let tem = ""
        if (type == 1) {
          tem = "管理员"
        } else {
          tem = "普通人员"
        }

        this.$confirm('是否确定将“' + row.userName + '”设为' + tem, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/organization/club/set-admin',
            {
              id: row.userId,
              orgId: this.groupId,
              isAdmin: type,
            }
          ).then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '设置成功!'
              });
              this.getMembers();
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
      modifyDuty(row) {
        this.ruleFormDuty.id = row.id
        this.ruleFormDuty.duty = row.duty
        this.ShowruleFormDuty = true
      },
      modifyCharge(row) {
        this.ShowruleFormCharge = true
      },
      beforeRoleCloseCharge() {
        this.FormCharge.userId = '';
      },
      getCampus() {
        this.$http.get('/school/all/campus').then(res => {
          this.schools = res.data
        })
      },
      changeSchool(value) {
        this.$http.get('/school/all/college/cascader', {params: {campusId: value}}).then(res => {
          this.colleges = res.data
          this.ruleFormTheme.collegeId = ""
        })
      },
      isShowModify(data) {


        let isadmin = localStorage.getItem("isAdmin")


        if (isadmin == 0 && data.isExistence == 0) {

          return false
        } else {

          return true
        }


        //
        // if ( data.parentId == 0) {
        //
        //    return false
        // }else{
        //
        //    return true
        // }


      },
      isShowModify2(data) {


        let isadmin = localStorage.getItem("isAdmin")


        if (isadmin == 0 && data.parentIds == 0) {

          return false
        } else {

          return true
        }


      },
      descInput(desc) {
        var txtVal = desc.length;
        this.remnant = txtVal;
      },
      boforeCloseMember() {
        this.ruleFormMember = {
          userId: '',
          identity: 0,
          duty: '',
          administrationId: ''
        }
      },
      beforeCloseImportCollegeHandler() {
        this.fileList = []

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
      },
      //导入成功返回
      openfileInfor(res) {
        if (res != false) {
          this.randomData = res.randomData
          this.showfileInfor = true
          this.fileInforamtion = res
          this.getRole()
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
          this.$refs.childUpload.submitUpload2()
          this.setProgress()
        } else {
          this.$message({
            type: 'error',
            message: '请重新上传文件'
          });
          return;
        }
      },
      beforeCloseImportCollegeHandler2() {
        this.fileList2 = []
        this.dialogImportCollegeVisible2 = false;
        this.$refs.childUpload2.closeUpload();
        this.showfileInfor2 = false
        this.fileInforamtion2 = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.showfileInforDetail2 = false
        this.clickAble2 = true
        this.showProgress2 = false
      },
      //导入成功返回
      openfileInfor2(res) {
        if (res != false) {
          this.randomData2 = res.randomData
          this.showfileInfor2 = true
          this.fileInforamtion2 = res
          this.getRole()
          this.fileUploadPercent = 100
          clearInterval(this.Interval);
          setTimeout(() => {
            this.showfileInfor2 = true
            this.showfileInforDetail2 = true
            this.showProgress2 = false;
          }, 2000)
        } else {
          clearInterval(this.Interval);
          this.fileUploadPercent = 0
          this.showfileInforDetail2 = false
          this.showProgress2 = false
          this.showfileInfor2 = false
          this.clickAble2 = false
        }
        // this.dialogImportCollegeVisible = false;
      },
      submitUpload2() {
        if (this.clickAble2) {
          this.$refs.childUpload2.submitUpload2()
          this.setProgress2()
        } else {
          this.$message({
            type: 'error',
            message: '请重新上传文件'
          });
          return;
        }

      },
      beforeCloseImportCollegeHandler3() {

        this.fileList3 = []
        this.dialogImportCollegeVisible3 = false;
        this.$refs.childUpload3.closeUpload();
        this.showfileInfor3 = false
        this.fileInforamtion3 = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.showfileInforDetail3 = false
        this.clickAble3 = true
        this.showProgress3 = false
      },
      //导入成功返回
      openfileInfor3(res) {
        if (res != false) {
          this.randomData3 = res.randomData
          this.showfileInfor3 = true
          this.fileInforamtion3 = res
          this.fileUploadPercent = 100
          clearInterval(this.Interval);
          setTimeout(() => {
            this.showfileInfor3 = true
            this.showfileInforDetail3 = true
            this.showProgress3 = false;
          }, 2000)
        } else {
          clearInterval(this.Interval);
          this.fileUploadPercent = 0
          this.showfileInforDetail3 = false
          this.showProgress3 = false
          this.showfileInfor3 = false
          this.clickAble3 = false
        }
        // this.dialogImportCollegeVisible = false;
      },
      submitUpload3() {
        if (this.clickAble3) {
          this.$refs.childUpload3.submitUpload2()
          this.setProgress3()
        } else {
          this.$message({
            type: 'error',
            message: '请重新上传文件'
          });
          return;
        }

      },
      setAllStatus() {
        let arrAl = []
        if (this.multipleSelection && this.multipleSelection.length) {
          this.multipleSelection.forEach(item => {
            arrAl.push(item.id)
          })
        }
        if (arrAl.length) {
          this.$confirm('是否删除所选成员?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/organization/delete/members', {
              ids: arrAl.join(","),
              orgId: this.groupId
            }).then(res => {
              if (res.code === '200') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getMembers()
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            })
          }).catch(() => {

          })
        } else {
          this.$message({
            type: 'error',
            message: '至少选中一名成员'
          });
        }
      },
      //编辑成员
      modifyMember(row) {


        this.ruleFormMember.id = row.memberId

        this.showMember = true

        this.$http.get("/backend/school-user-department/member/detail", {
          params: {
            departmentId: row.departmentId,
            // departmentId: row.departmentId,
            userId: row.userId,
          }
        }).then(res => {


          if (res.code == '200') {
            this.ruleFormMember.identity = res.data.identity
            this.ruleFormMember.duty = res.data.duty


            let arr = res.data.list.map(item => {
              return item.roleId
            })

            this.ruleFormMember.roleIds = arr


            this.$http.get("/backend/school-department/role/list", {
              params: {
                departmentId: row.departmentId
              }
            }).then(res => {
              this.roleMermber = cascade2(0, res.data)
              this.roleMermber2 = res.data

              let lastArr = getNode2(this.roleMermber2, this.ruleFormMember.roleIds.join(","))
              this.ruleFormMember.roleIds = lastArr
            })
          }
        })
      },
      searchMember() {
        this.paramsMember.current = 1;
        this.paramsMember.size = 10;
        this.getMembers()
      },
      deleteOrgnaziton() {
        if ((this.temporaryList.children && this.temporaryList.children.length) || this.list.length > 1) {
          this.$alert('<p><b>当前机构不可删除</b><p>请删除此机构下的成员或子机构后，再删除此机构', '删除机构', {
            dangerouslyUseHTMLString: true
          })


        } else {


          this.$confirm('是否删除此机构?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            this.$http.post('/organization/administration/delect', {
              organizationId: this.groupDetail.id
            }).then(res => {
              if (res.code === '200') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getRole()
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            })
          })
        }
      },
      //移除
      deleteMebmer(item) {
        this.$confirm('是否删除此成员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/organization/delete/members', {
            ids: item.id,
            orgId: this.groupId
          }).then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getMembers()
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
      changeSelf(value) {
        if (value) {
          this.paramsMember.sublevel = 0
        } else {
          this.paramsMember.sublevel = 1
        }
        this.getMembers()
      },
      getMembers() {
        this.$http.get("/organization/administration/members", {
          params: this.paramsMember
        }).then(res => {
          this.list = res.data.list
          this.total = res.data.total;
        })
      },
      getPages(pageNo, pageSize) {
        this.paramsMember.current = pageNo;
        this.paramsMember.size = pageSize;
        this.getMembers();
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
      changeOrganaziton(value) {

        if (value.length) {
          this.$http.get("/backend/school-department/role/department/list", {
            params: {
              departmentId: value[value.length - 1]
            }
          }).then(res => {
            this.roles = cascade2(0, res.data)
            this.ruleFormTheme.roleIds2 = []
            this.ruleFormTheme2.roleIds2 = []
          })
        } else {
          this.$http.get("/backend/school-department/role/department/list", {
            params: {
              departmentId: 0
            }
          }).then(res => {
            this.roles = cascade2(0, res.data)
          })
        }
      },
      getAllRole() {
        this.$http.get("/backend/role/list", {
          params: {
            name: ''
          }
        }).then(res => {
          this.roles = cascade2(0, res.data)

        })
      },
      uploadSuccessed(url) {
        this.ruleFormTheme.avatar = url
      },
      uploadSuccessed2(url) {
        this.ruleFormTheme2.avatar = url
      },
      //清除下拉框
      clear() {
        this.options4 = [];

      },
      remoteMethod2(query) {
        query = query.trim()
        if (query !== '') {
          this.loading = true;
          this.$http.get("organization/search/members/list", {
            params: {
              keyWord: query,
              type: 1,
              identity: 2
            }
          }).then(res => {
            this.loading = false;
            this.options42 = res.data
          })


        } else {
          this.options42 = [];
        }
      },
      remoteMethod3(query) {
        query = query.trim()
        if (query !== '') {
          this.loading = true;
          this.$http.get("/school/students/OrgStudent", {
            params: {
              key: query,
              type: 2,
              orgId: this.groupId,
              identity: 2
            }
          }).then(res => {
            this.options43 = res.data
          })
        } else {
          this.options43 = [];
        }
      },
      remoteMethod(query) {
        query = query.trim()
        if (query != '') {
          this.loading = true;

          this.$http.get("/organization/responsible-person/list", {
            params: {
              keyWord: query
            }
          }).then(res => {

            this.loading = false;
            this.options4 = res.data
          })


        } else {
          this.options4 = [];
        }
      },
      remoteMethod5(query) {
        query = query.trim()
        if (query !== '') {
          this.loading = true;

          this.$http.get("school/select-user/by/name", {
            params: {
              keyWord: query
            }
          }).then(res => {
            this.loading = false;
            this.options45 = res.data
          })


        } else {
          this.options45 = [];
        }
      },
      submitDuty(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {


            this.$store.commit('setClick', true)
            this.$http.post("organization/edit/member/duty", this.ruleFormDuty).then(res => {
              if (res.code == '200') {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.ShowruleFormDuty = false
                this.getMembers()
              }
            })


          }
        })

      },
      thememSetCharge(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {

            this.$store.commit('setClick', true)

            this.ruleFormSetCharge.organizationId = this.groupId

            this.$http.post("/organization/responsible-person/set", this.ruleFormSetCharge).then(res => {
              if (res.code == '200') {
                this.$message({
                  type: 'success',
                  message: '设置负责人成功!'
                });
                this.showSetCharge = false
                this.getMembers()
                this.getGroupDetail()
              }
            })


          }
        })

      },
      submitCharge(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.commit('setClick', true)
            this.$http.post("/organization/administration/assignment", {
              userId: this.FormCharge.userId,
              orgId: this.groupId
            }).then(res => {
              if (res.code == '200') {
                this.$message({
                  type: 'success',
                  message: '转让负责人成功!'
                });
                this.ShowruleFormCharge = false
                this.getMembers()
              }
            })
          }
        })
      },
      themeAdd(formName, type) {

        let that = this

        this.$refs[formName].validate((valid) => {
          if (valid) {

            this.$store.commit('setClick', true)

            if (type == 1) {


              this.$http.post("organization/administration/edit", that.ruleFormTheme).then((res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.getRole()
                  this.showTheme = false;

                } else {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  });
                }

              })
            } else {

              if (this.ruleFormTheme.parentIds.length) {
                let value = this.ruleFormTheme.parentIds
                this.ruleFormTheme.parentId = value[value.length - 1]
              } else {

                if (!this.ruleFormTheme.parentId) {
                  this.ruleFormTheme.parentId = 0
                }

              }


              this.$http.post("organization/administration/add", this.ruleFormTheme).then((res) => {

                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.showTheme = false;
                  this.getRole()
                } else {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  });
                }
              })

            }

          }
        })

      },
      themeAdd2(formName, type) {


        this.$refs[formName].validate((valid) => {
          if (valid) {

            this.$store.commit('setClick', true)

            if (type == 1) {

              if (this.ruleFormTheme2.parentIds.length) {
                let value = this.ruleFormTheme2.parentIds
                this.ruleFormTheme2.parentId = value[value.length - 1]
              } else {
                this.ruleFormTheme2.parentId = 0
              }

              if (this.ruleFormTheme2.roleIds2.length) {
                let value2 = this.ruleFormTheme2.roleIds2
                this.ruleFormTheme2.roleIds = value2[value2.length - 1]
              }

              if (this.ruleFormTheme2.appenderId2.length) {
                let value3 = this.ruleFormTheme2.appenderId2
                this.ruleFormTheme2.appenderId = value3[value3.length - 1]
              }

              var n = Number(this.ruleFormTheme2.guiderId);
              if (isNaN(n)) {
                this.ruleFormTheme2.guiderId = this.ruleFormTheme2.guiderId2
              }

              var n = Number(this.ruleFormTheme2.responserId);
              if (isNaN(n)) {
                this.ruleFormTheme2.responserId = this.ruleFormTheme2.responserId2
              }


              this.$http.post("/backend/school-department/editClub", this.ruleFormTheme2).then((res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.getRole()
                  this.showTheme2 = false;

                } else {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  });
                }

              })
            } else {

              if (this.ruleFormTheme2.parentIds.length) {
                let value = this.ruleFormTheme2.parentIds
                this.ruleFormTheme2.parentId = value[value.length - 1]
              } else {
                this.ruleFormTheme2.parentId = 0
              }

              if (this.ruleFormTheme2.roleIds2.length) {
                let value2 = this.ruleFormTheme2.roleIds2
                this.ruleFormTheme2.roleIds = value2[value2.length - 1]
              }

              if (this.ruleFormTheme2.appenderId2.length) {
                let value3 = this.ruleFormTheme2.appenderId2
                this.ruleFormTheme2.appenderId = value3[value3.length - 1]
              }


              this.$http.post("/backend/school-department/addClub", this.ruleFormTheme2).then((res) => {

                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.showTheme2 = false;
                  this.getRole()
                } else {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  });
                }
              })

            }

          }
        })

      },
      memberAdd(formName, type) {


        this.$refs[formName].validate((valid) => {
          if (valid) {


            this.$store.commit('setClick', true)
            if (type == 1) {

              this.ruleFormMember.departmentId = this.groupId


              if (this.ruleFormMember.roleIds.length) {
                let value = this.ruleFormMember.roleIds
                this.ruleFormMember.roleId = value[value.length - 1]
              }


              this.$http.post("/backend/school-user-department/edit", this.ruleFormMember).then((res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.showMember = false;
                  this.getMembers()

                } else {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  });
                }

              })
            } else {
              this.ruleFormMember.orgId = this.groupId
              // if (this.ruleFormMember.roleIds.length) {
              //   let value = this.ruleFormMember.roleIds
              //   this.ruleFormMember.roleId = value[value.length - 1]
              // }


              this.$http.post("/organization/administration/member/add", this.ruleFormMember).then((res) => {

                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.showMember = false;
                  this.getMembers()
                } else {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  });
                }
              })

            }

          }
        })

      },

      modifyRole(data) {


        this.currentID = ''

        if (data.isAssociation) {
          this.showTheme2 = true
        } else {
          this.showTheme = true
        }

        this.$http.get("/backend/school-department/detail", {
          params: {
            id: data.id
          }
        }).then(res => {
          if (data.isAssociation) {
            this.ruleFormTheme2.id = res.data.id
            this.ruleFormTheme2.avatar = res.data.avatar
            this.ruleFormTheme2.name = res.data.name
            this.ruleFormTheme2.nature = res.data.nature

            this.$http.get("/backend/school-department/role/department/list", {
              params: {
                departmentId: res.data.parentId
              }
            }).then(ress => {


              this.roles = cascade2(0, ress.data)
              let arr = res.data.roleList.map(item => {
                return item.roleId
              })
              // this.ruleFormTheme2.roleIds2 = arr
              let lastArr2 = getNode2(ress.data, arr.join(","))

              this.ruleFormTheme2.roleIds2 = lastArr2
            })


            this.ruleFormTheme2.responserId = res.data.responserName
            this.ruleFormTheme2.responserId2 = res.data.responserId

            this.ruleFormTheme2.guiderId = res.data.guiderName
            this.ruleFormTheme2.guiderId2 = res.data.guiderId

            this.ruleFormTheme2.introduce = res.data.introduce
            this.ruleFormTheme2.appenderId2 = getNode2(this.appenderes2, res.data.appenderId)


          } else {

            this.ruleFormTheme.id = res.data.id
            this.ruleFormTheme.avatar = res.data.avatar
            this.ruleFormTheme.name = res.data.name


            this.$http.get("/backend/school-department/role/list", {
              params: {
                departmentId: res.data.parentId
              }
            }).then(ress => {


              this.roles = cascade2(0, ress.data)
              let arr = res.data.roleList.map(item => {
                return item.roleId
              })

              let lastArr = getNode2(ress.data, arr.join(","))

              this.ruleFormTheme.roleIds2 = lastArr
            })


            // let arr = res.data.roleList.map(item => {
            //   return item.roleId
            // })
            // this.ruleFormTheme.roleIds2 = arr

            this.ruleFormTheme.guiderId = res.data.guiderName
            this.ruleFormTheme.guiderId2 = res.data.guiderId
            // this.ruleFormTheme.responserId = res.data.responserId
            this.ruleFormTheme.responserId = res.data.responserName
            this.ruleFormTheme.responserId2 = res.data.responserId
            this.ruleFormTheme.introduce = res.data.introduce


          }

        })


        // this.showTheme = true
        // this.currentID = ""
        // this.ruleFormTheme.id = data.id
        // this.ruleFormTheme.name = data.name
      },
      deleteRole(data) {
        this.currentID = ""
        let tem = data.isAssociation ? '社团' : '组织'
        this.$confirm('是否删除此' + tem + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/backend/school-department/delete', {
            id: data.id
          }).then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getRole();
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
      beforeRoleCloseTheme() {
        this.remnant = "0"
        this.$refs['ruleFormTheme'].resetFields();
        this.ruleFormTheme = {
          id: '',
          name: "",
          userId: '',
          parentIds: [],
          parentId: '',
          level: 1,
          campusId: '',
          collegeId: '',
          organizationId: '',
        }
        this.clear();
      },
      beforeRoleCloseTheme2() {
        this.remnant = "0"
        this.$refs['ruleFormTheme2'].resetFields();
        this.ruleFormTheme2 = {
          id: '',
          name: "",
          nature: 1,
          avatar: '',
          responserId: '',
          parentIds: [],
          parentId: '',
          roleIds: '',
          roleIds2: [],
          guiderId: '',
          guiderId2: '',
          appenderId2: [],
          appenderId: '',
          introduce: '',
        }
      },
      isShowSet(data) {
        if (this.currentID == data.id) {
          return true
        } else {
          return false
        }
      },
      append(data) {
        this.isAdd = false
        if (this.currentID == data.id) {
          this.currentID = ''
        } else {
          this.currentID = data.id
        }

      },
      addOragazion() {
        this.isAdd = false
        this.showTheme = true
        this.showEdit = false
      },
      addChildOrgnaziton() {
        this.ruleFormTheme.parentId = this.groupId
        this.showTheme = true
        this.showEdit = false
      },
      editOrgnaziton() {
        this.showEdit = true;
        this.ruleFormTheme.id = this.groupDetail.id
        this.ruleFormTheme.parentId = this.groupId
        this.level = this.groupDetail.level
        this.ruleFormTheme.name = this.groupDetail.name
        this.ruleFormTheme.level = this.groupDetail.level
        this.ruleFormTheme.campusId = this.groupDetail.campusId
        //this.ruleFormTheme.parentIds = this.groupDetail.parentIds

        if (this.groupDetail.level == 2) {
          this.$http.get('/school/all/college/cascader', {params: {campusId: this.groupDetail.campusId}}).then(res => {
            this.colleges = res.data
            this.ruleFormTheme.collegeId = this.groupDetail.collegeId
          })
        }

        this.showTheme = true


      },
      addOragazion2() {
        this.isAdd = false
        this.showTheme2 = true
      },
      search() {
        this.getRole()
      },
      getGroupRole(id) {
        this.$http.get("/backend/school-department/role/list", {
          params: {
            departmentId: id
          }
        }).then(res => {

          this.roleMermber = cascade2(0, res.data)
          this.roleMermber2 = res.data
        })
      },
      getRole() {

        this.$http.get("/organization/administration/list", {
          params: {
            keyWord: this.keyWord
          }
        }).then(res => {


          this.classifies = cascade3(0, res.data)

          if (this.keyWord) {
            this.data = res.data
          } else {
            this.data = cascade3(0, res.data)
          }

          if (this.data.length) {

            this.temporaryList = this.data[0]

            this.paramsMember.orgId = this.data[0].id
            this.groupId = this.data[0].id
            this.dataObj2 = {organizationId: this.groupId}


            this.getMembers()
            // this.getGroupRole(this.groupId)
            this.getGroupDetail()
            //
            this.$nextTick(() => {
              this.$refs.treeBox.setCurrentKey(this.groupId); // treeBox 元素的ref   value 绑定的node-key
            });

          }
        })

      },
      getGroupDetail() {
        this.$http.get("organization/administration/details", {
          params: {
            organizationId: this.groupId
          }
        }).then(res => {
          this.groupDetail = res.data
        })
      },
      handleNodeClick(data) {

        this.paramsMember.current = 1;
        this.paramsMember.size = 10;
        this.temporaryList = data
        this.paramsMember.keyWord = '';
        this.paramsMember.duty = '';
        this.paramsMember.role = '';
        this.paramsMember.orgId = data.id
        this.groupId = data.id
        this.dataObj2 = {organizationId: this.groupId}
        this.getMembers()
        // this.getGroupRole(this.groupId)
        this.getGroupDetail()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .roleMain-right {
    margin-left: 320px;
    margin-right: 15px;
    margin-top: 20px;
  }

  .orgnazitonTitle {
    width: 100%;
    overflow: hidden;
  }

  .orgnazitonTitle-logo {
    margin-top: 5px;
  }

  .orgnazitonTitle-content {

    font-size: 14px;
    line-height: 30px;

    b {
      font-size: 16px;
    }
  }

  .searchRole {
    position: absolute;
    left: 190px;
    top: 9px;
    cursor: pointer;
  }

  .roleMain {

    border: 1px solid #EBEEF5;
    width: 98%;
    float: left;
    margin-left: 1%;
    background: #fff;
    min-height: calc(100vh - 80px);

    &-left {
      float: left;
      min-height: calc(100vh - 80px);
      width: 300px;
      border-right: 1px solid #EBEEF5;

      &-top {
        width: 260px;
        margin: 20px auto;
      }
    }

    &-right {
    }
  }
</style>

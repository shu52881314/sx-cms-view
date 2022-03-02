<template>
  <section>
    <!--<el-tabs v-model="activeName" @tab-click="goTab">-->
    <!--<el-tab-pane label="校区" name="0"></el-tab-pane>-->
    <!--<el-tab-pane label="院系" name="1"></el-tab-pane>-->
    <!--<el-tab-pane label="专业" name="2"></el-tab-pane>-->
    <!--<el-tab-pane label="班级" name="3"></el-tab-pane>-->
    <!--<el-tab-pane label="学生" name="4"></el-tab-pane>-->
    <!--</el-tabs>-->
    <el-dialog title="批量导入学生"
               :visible.sync='dialogImportCollegeVisible'
               @close="beforeCloseImportCollegeHandler"
               :close-on-click-modal="false"
               width='650px' id="dialogOrange">
      <div>
        <div v-show="!showfileInfor">

          <div class="uploadLocal" v-show="fileList.length">
            <div class="uploadLocal-circel">
              <p style="padding-top:50px;"><img src="../../assets/images/upload_two@2x.png" style="width:70px;"></p>
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
                    <a class="el-button el-button--text el-button--mini" download="" href='/static/tpls/学生模板.xlsx'
                       size='mini'>模板下载</a>
                  </span>
            </div>
            <el-form-item label="" prop="name">
              <el-col :span="22">
                <upload-file
                  ref="childUpload"
                  uploadUrl="/school/student/import"
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
    <el-dialog title="批量导入成绩"
               :visible.sync='dialogImportCollegeVisiblecj'
               @close="beforeCloseImportCollegeHandler"
               :close-on-click-modal="false"
               width='650px' id="dialogOrangecj">
      <div>
        <div v-show="!showfileInfor">

          <div class="uploadLocal" v-show="fileList.length">
            <div class="uploadLocal-circel">
              <p style="padding-top:50px;"><img src="../../assets/images/upload_two@2x.png" style="width:70px;"></p>
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
                    <a class="el-button el-button--text el-button--mini" download="" href='/static/tpls/历史成绩导入模板.xlsx'
                       size='mini'>模板下载</a>
                  </span>
            </div>
            <el-form-item label="" prop="name">
              <el-col :span="22">
                <upload-file
                  ref="childUpload"
                  uploadUrl="/school/historycredit/import"
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
          <el-progress :stroke-width="18" :percentage="fileUploadPercent" style="margin-top:30px;"></el-progress>
          <p style="text-align: center;padding: 20px 0px 10px;">正在上传，请您耐心等待...</p>
          <span style="display: block; text-align: center; font-size: 13px; color: #999">请勿关闭浏览窗口</span>
        </div>
        <div class="importFail" v-show="showfileInforDetail  && fileInforamtion.total != fileInforamtion.success">
          <div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_fail@2x.png'></div>
          <div class="importFail-tips">
            <span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功，<span style="color:#FFC600;">{{fileInforamtion.failed}}</span>条导入失败
            <span @click="downFailedcj()" style="cursor:pointer;color:#4D98FF" v-if="fileInforamtion.failed">下载失败列表</span>
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


    <el-dialog :title="title" :visible.sync="dialogVisible" @close="beforeCloseHandler" :close-on-click-modal="false"
               width="580px">
      <div>
        <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
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
              <el-input v-model="ruleForm.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="学号" prop="code">
            <el-col :span="22">
              <el-input :disabled="dis" v-model="ruleForm.code"></el-input>
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
              <el-radio-group v-model="ruleForm.gender">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <el-form-item label="民族">
            <el-col :span="22">
              <el-select style="width:100%" v-model="ruleForm.ethnicId" placeholder="请选择民族">
                <el-option v-for="item in ethnices" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="政治面貌">
            <el-col :span="22">
              <el-select style="width:100%" v-model="ruleForm.politics" placeholder="选择政治面貌" @change="changepolitics">
                <el-option v-for="item in politics" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="所属校区" prop="campus">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="ruleForm.campus" @change="changeSchoolbj"
                         placeholder="请选择学校">
                <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="所属院系" prop="college">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="ruleForm.college" @change="changeCollegebj"
                         placeholder="请选择院系">
                <el-option v-for="item in colleages" :key="item.id" :label="item.type_name"
                           :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="所属专业" prop="major">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="ruleForm.major" placeholder="请选择专业"
                         @change="changeMajorbj">
                <el-option v-for="item in majores" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="所属年级" prop="grade">
            <el-col :span="22">
              <el-select  style="width:100%" v-model="ruleForm.grade" placeholder="请选择年级" @change="changegradebj">
                <el-option v-for="item in gradees" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="所属班级" prop="class">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="ruleForm.class" placeholder="请选择班级"  @change="changeClassesbj">
                <el-option v-for="item in classes2" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>


          <!-- <el-form-item label="手机号" v-if="ruleForm.id">
             <el-col :span="14">
               <el-input v-model="ruleForm.mobile"></el-input>
             </el-col>
           </el-form-item>-->
          <el-form-item>
            <el-button v-if="!ruleForm.id" type="increase" @click="submitForm('ruleForm',2)">添加</el-button>
            <el-button v-if="ruleForm.id" type="primary" @click="submitForm('ruleForm',1)">修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>


    <div class="main-header">
      <span class="main-title">学生列表</span>
      <div class="main-btn-box">
        <el-button @click="dialogVisible = true,colleages = [],majores = [],classes2 = []" type="increase"
                   size="mini" v-perms="'/student/list/add'">添加学生
        </el-button>
        <el-button type="primary" size="mini" @click="dialogImportCollegeVisible = true" v-perms="'/student/list/add'">
          导入学生
        </el-button>
        <el-button type="primary" size="mini" @click="dialogImportCollegeVisiblecj = true" v-perms="'/student/list/add'">
          导入成绩
        </el-button>
        <el-button type="primary" size="mini" @click="gocj" v-perms="'/student/list/add'">
        查看已导入成绩
        </el-button>
        <el-button @click="importAllStudent" type="warning" size="mini" v-perms="'/student/list/export'"
                   :disabled="dcxs">导出学生
        </el-button>

        <!-- <el-button type="primary" @click="exportStundent" size="mini">导出</el-button> -->
      </div>
    </div>
    <div class="search-box">
      <el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item label="所属学校" prop="campusId">
          <el-col :span="22">
            <el-select clearable style="width:100%" v-model="params.campusId" @change="changeSchool"
                       placeholder="请选择学校">
              <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="院系">
          <el-select clearable v-model="params.collegeId" @change="changeCollege" placeholder="请选择院系">
            <el-option v-for="item in colleages" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-select clearable v-model="params.majorId" placeholder="请选择专业" @change="changeMajor">
            <el-option v-for="item in majores" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select clearable v-model="params.classId" placeholder="请选择班级" @change="changeClasses">
            <el-option v-for="item in classes2" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级">
          <el-select clearable v-model="params.grade" placeholder="请选择年级" @change="changenjes">
            <el-option v-for="item in gradees" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="params.name" maxlength=30 placeholder="请输入姓名搜索" @input="bian"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="params.code" placeholder="请输入学号搜索" @input="bian"></el-input>
        </el-form-item>
        <p>
          <el-form-item label="请假总数">
          <el-input type="number" v-model="params.leaveTotalNum" placeholder="请输入次数" @input="bian"></el-input>
        </el-form-item>
          <el-form-item label="成功次数">
            <el-input type="number" v-model="params.leaveSuccessNum" placeholder="请输入次数" @input="bian"></el-input>
          </el-form-item>
          <el-form-item label="失败次数">
            <el-input type="number" v-model="params.leaveFailNum" placeholder="请输入次数" @input="bian"></el-input>
          </el-form-item>
          <el-form-item :label="'获得'+hoursUnit">
            <el-input type="number" v-model="params.minScore" placeholder="请输入" @input="bian" style="width: 110px"></el-input>
            至
            <el-input type="number" v-model="params.maxScore" placeholder="请输入" @input="bian" style="width: 110px"></el-input>
          </el-form-item>

          <el-form-item>
          <el-button size="mini" type="primary" @click="search()">查询</el-button>
        </el-form-item>

        </p>


      </el-form>
    </div>
    <div class="main-body">
      <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%" >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="姓名" width="100"></el-table-column>
        <el-table-column prop="code" label="学号" width="100"></el-table-column>
        <el-table-column prop="code" label="性别">
          <template slot-scope="scope">
            <span>{{scope.row.gender == 1 ? "男" : (scope.row.gender == 2 ? "女" : "")}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="credit" label="诚信值"></el-table-column>
        <el-table-column prop="ethnic" label="民族"></el-table-column>
        <el-table-column prop="campusName" label="校区"></el-table-column>
        <el-table-column prop="collegeName" label="院系"></el-table-column>
        <el-table-column prop="majorName" label="专业"></el-table-column>
        <el-table-column label="年级" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.gradeName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="className" label="班级"></el-table-column>
        <!-- <el-table-column prop="" label="政治面貌" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.politics==0?'群众':scope.row.politics==1?'团员':scope.row.politics==2?'党员':scope.row.politics==2?'其他党派':'未填写'}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="" label="政治面貌" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.politics | politicsFmt}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="hoursUnit">
          <template slot-scope="scope">
            <span style="color: red;">{{scope.row.sumScore.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="请假总数(成功次数 / 失败次数)" >
          <template slot-scope="scope">
            <span style="color: #4D7DFF;cursor: pointer" @click="goqj(scope.row.id)">{{scope.row.leaveTotalNum}}({{scope.row.leaveSuccessNum}}/{{scope.row.leaveFailNum}})</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" style="color: red;">{{studentStatus(scope.row.status)}}</span>
            <span v-else :style="{color: scope.row.status == 3 ? 'red': 'green'}">{{studentStatus(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <div slot-scope="scope">
            <!-- 可转载站点功能未完成 -->
            <!--<el-button  type="text" size="mini" @click="deleteStudent(scope.row.id)">删除</el-button>-->
            <el-button type="text" class="opreat-btn" size="mini" @click.native="modify(scope.row)"
                       v-perms="'/student/list/edit'">编辑
            </el-button>
            <el-button type="text" class="opreat-btn" size="mini" @click.native="changeStatus(scope.row)"
                       v-perms="'/student/list/edit'">{{scope.row.status == 3 ? '开启' : '禁用' }}
            </el-button>
            <span v-perms="'/student/list/export/activity'">
                <el-button v-if='scope.row.status != 0' type="text" size="mini" :disable="importDisable"
                           @click="importFile(scope.row.id,scope.row.name)">导出</el-button>
            </span>
            <span v-perms="'/student/list/report'">
                 <el-button v-if='scope.row.status != 0' type="text" size="mini"
                            @click="goReport(scope.row.id)">成绩单</el-button>
                 <el-button v-if='scope.row.status != 0' type="text" size="mini"
                            @click="down(scope.row.id, scope.row.name, scope.row.code)">下载</el-button>
            </span>
            <el-button v-if='scope.row.status != 0' type="text" size="mini" class="opreat-btn"
                       @click="resetPassword(scope.row)" v-perms="'/student/list/reset'">重置密码
            </el-button>
          </div>
        </el-table-column>
      </el-table>
      <qu-pagination :total="total" @change="changePage"></qu-pagination>
    </div>
  </section>
</template>
<script>
  import axios from 'axios'
  import bus from '@/main'

  import {politicsFmt} from "@/utils/format";
  // import {
  //     isvalidCode
  // } from '@/utils/validate'
  // // import {vs} from '@/rules'
  // var validCode = (rule, value, callback) => {
  //     if (!value) {
  //         callback(new Error('请输入学号'))
  //     } else if (!isvalidCode(value)) {
  //         callback(new Error('请输入正确的学号'))
  //     } else {
  //         callback()
  //     }
  // }

  export default {
    filters: {
      politicsFmt(val) {
        return politicsFmt(val);
      },
    },
    data() {
      // var that = this
      // var mobile = (rule, value, callback) => {
      // 	if(that.ruleForm.mobile!=''){
      //         let reg = /^1\d{10}$/;
      //     if (!reg.test(that.ruleForm.mobile)) {
      //         callback(new Error('请输入正确的手机号'));
      //     }
      //     }else {
      //         callback();
      //     }
      // };
      return {
        dcxs:false,
        dis: false,
        activeName: '',
        tabsList: ['/student/campus', '/student/college', '/student/major', '/student/class', '/student/list'],
        interval: '',
        isUploadaLoading: false,
        fileListName: '',
        fileList: [],
        randomData: "",
        hoursUnit: localStorage.getItem("hoursUnit"),
        title: '添加学生',
        showfileInfor: false,
        fileInforamtion: {},
        dialogImportCollegeVisible: false,
        dialogImportCollegeVisiblecj: false,
        loading: false,
        params: {
          current: 1,
          size: 10,
          campusId: '',
          collegeId: '',
          majorId: '',
          classId: '',
          grade: '',
          name: '',
          code: '',
          leaveTotalNum: '',
          leaveSuccessNum: '',
          leaveFailNum: '',
          minScore: '',
          maxScore: '',
        },
        isChange: false,
        data: [],
        ethnices: [],
        politics: [{id: 0, name: '群众'}, {id: 1, name: '团员'}, {id: 2, name: '党员'}, {id: 3, name: '其他党派'}, {
          id: 4,
          name: '预备党员'
        }],//政治面貌
        schools: [],
        classes2: [],
        colleges: [],
        colleages: [],
        majors: [],
        majores: [],
        classes: [],
        gradees: [],
        total: 0,
        countryCodes: [{
          value: '86',
          label: "中国"
        }],
        options4: [],
        dialogVisible: false,
        ruleForm: {
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
        rules: {
          campus: [{
            required: true,
            message: '请选择所属学校',
            trigger: 'change'
          }
          ],
          college: [{
            required: true,
            message: '请选择所属院系',
            trigger: 'change'
          }
          ],
          major: [{
            required: true,
            message: '请选择所属专业',
            trigger: 'change'
          }
          ],
          class: [{
            required: true,
            message: '请选择班级',
            trigger: 'change'
          }
          ],
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
          grade: [{
            required: true,
            message: '请选择年级',
            trigger: 'change'
          }]

        },
        importDisable: false,
        fileUploadPercent: 0,
        showProgress: false,
        showfileInforDetail: false,
        clickAble: true,
      }
    },
    methods: {
      goqj(id){
        this.$router.push({
          path:'/student/leavelist',
          query:{uid:id}
        })
      },
      changepolitics(value){
        this.ruleForm.politics =''
        this.ruleForm.politics =value

      },
      changeStatus(item) {
        const that = this;
        let st = item.status == 3 ? 1 : 3
        that.$confirm(item.status == 3 ? '是否启用此学员?' : item.status == 1 ? '是否禁用此学员?' : '', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http.post('/school/student/statusModify', {userId: item.id, status: st}).then(res => {
            if (res.code == 200) {
              that.$message({
                type: 'success',
                message: '修改状态成功!'
              });
              that.fetch()
            }
          })
        })
      },
      goTab() {
        const that = this;
        this.$router.push({path: that.tabsList[parseInt(that.activeName)], query: {type: that.activeName}});
      },
      gocj() {
        this.$router.push({path:'/student/history'});
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
      changeClass() {
        this.isChange = true
      },
      //远程搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          this.$http.get("/school/all/class/cascader", {
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
      //删除学生
      deleteStudent(id) {

        this.$confirm('是否删除此成员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('school/delete/student', {
            id: id,
          }).then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.fetch()
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
      getEthnic() {
        this.$http.get("school/ethnic/list").then(res => {
          this.ethnices = res.data
        })
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
        this.showfileInforDetail = false
        this.$refs.childUpload.closeUpload();
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
          url: 'school/fail/student/export',
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
          link.setAttribute('download', '学生失败信息' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })

      },
      downFailedcj() {

        axios({
          method: 'post',
          url: 'school/fail/historycredit/export',
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
          link.setAttribute('download', '成绩失败信息' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })

      },
      importAllStudent() {
        var that = this;
        that.importDisable = false;
        // const loading = this.$loading({
        //   lock: true,
        //   text: '正在导出中',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)',
        // });
        axios({
          method: 'get',
          url: 'school/export/student',
          responseType: 'blob',
           params: that.params
        }).then((res) => {
          if (!res) {
            return
          }
          var filename = name;
          let url = window.URL.createObjectURL(res)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '学生列表' + '.xlsx')
          document.body.appendChild(link)
          link.click()
          that.importDisable = true;
        })
        // setTimeout(() => {
        //   loading.close();
        // }, 5000);
      },
      importFile(id, name) {
        axios({
          method: 'get',
          url: 'school/user/impot/activity',
          responseType: 'blob',
          params: {
            id: id
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
          link.setAttribute('download', filename + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })
      },
      goReport(id) {
        this.$router.push({path:"/report/" + id, query: {id:id}})
      },
      down(id, name, code) {
        this.$confirm('是否确定下载该生成绩单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
            method: 'get',
            url: 'pdf/genreportpdf',
            responseType: 'blob',
            params: {
              userId: id
            }
          }).then((res) => {
            if (!res) {
              return
            }
            var filename = code + "-" + name;
            let url = window.URL.createObjectURL(res)
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', filename + '.pdf')
            document.body.appendChild(link)
            link.click()
          })
        }).catch(() => {
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
        this.showProgress = false
      },
      //导入成功返回
      openfileInfor(res) {
        if (res != false) {
          this.randomData = res.randomData
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
      exportStundent() {
        window.open(this.$store.state.sys.baseUrl + '/school/college/export/student', '_self')
        // this.$http.get("/school/export/student",{
        //   params:{
        //     name:'',
        //     campus:'',
        //     code:''
        //   }
        // }).then( res => {
        // })
      },
      beforeCloseHandler() {
        this.resetForm('ruleForm');
        this.ruleForm = {
          id: '',
          campus: '',
          college: '',
          major: '',
          class: '',
          ethnicId: 1,
          code: '',
          name: '',
          gender: '1',
          countryCode: '86',
          mobile: '',
          politics:''
        }
        this.params = {
          current: 1,
          size: 10,
          campusId: '',
          collegeId: '',
          majorId: '',
          classId: '',
          grade: '',
          name: '',
          code: ''
        }
        this.colleages = [];
        this.majores = [];
        this.classes2 = [];
        // this.gradees = [];
        this.colleges = []
        this.majors = []
        this.classes = []
        this.isChange = false
      },
      resetPassword(row) {
        this.$http.post('/school/student/password/reset', {id: row.id}).then(res => {
          if (res.code == '200') {
            this.$message({
              type: 'success',
              message: '重置成功!'
            });
          }
        })
      },
      modify(row) {
        const that = this;
        that.dialogVisible = true;
        that.title = "添加学生"
        if (row) {
          that.dis = true;
          that.title = "编辑学生"
          that.showMobile = true
          that.ruleForm.id = row.id;
          that.ruleForm.name = row.name;
          that.ruleForm.code = row.code;
          that.ruleForm.politics = row.politics;
          that.ruleForm.college = row.collegeId;
          that.ruleForm.campus = row.campusId;
          that.ruleForm.major = row.majorId;
          that.ruleForm.class = row.classId;
          that.ruleForm.grade = row.grade;

          that.getClasses2( row.majorId,row.grade)
          that.getGradees()
          that.changeSchool(row.campusId);
          that.changeCollege(row.collegeId);
        console.log(row)
          if (row.ethnicId) {
            that.ruleForm.ethnicId = row.ethnicId;
          }
          if (row.gender) {
            that.ruleForm.gender = row.gender + "";
          }
        } else {
          that.dis = false;
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      submitForm(formName, type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (type == 1) {
              this.$http.post("/school/student/modify", this.ruleForm).then((res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.dialogVisible = false;
                  this.fetch();
                }
              })
            } else if (type == 2) {
              this.$http.post("/school/student/add", this.ruleForm).then((res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.dialogVisible = false;
                  this.fetch();
                } else {
                  this.$message({
                    type: 'eroor',
                    message: res.msg
                  })
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      fetch() {
        const that = this;
        that.loading = true
        that.$http.get('/school/students', {params: that.params}).then(res => {
          that.data = res.data.list
          that.total = res.data.total
          that.loading = false
        })
      },
      getCampus() {
        this.$http.get('/school/all/campus').then(res => {
          this.schools = res.data
        })
      },
      changeSchool(value) {
        this.dcxs=true
        this.params.collegeId = ""
        this.params.majorId = ""
        this.params.classId = ""
        if (!value) {
          this.colleages = [];
          this.majores = [];
          this.classes2 = [];
          // this.gradees = [];
        } else {
          this.$http.get('/school/college/list', {params: {campusId: value}}).then(res => {
            if (res.data.length>0){
              this.colleages = res.data
            } else {
              this.ruleForm.college =''
              this.$message({
                type: 'error',
                message: '该校区下无此院系，前选择其他校区'
              });
            }

          })
        }
      },

      changeCollege(value) {
        this.dcxs=true
        this.params.majorId = ""
        this.params.classId = ""
        if (!value) {
          this.majores = [];
          this.classes2 = [];
          // this.gradees = [];
        } else {
          this.$http.get('/school/major/list', {params: {collegeId: value}}).then(res => {
            if (res.data.length>0){
              this.majores = res.data
            } else {
              this.ruleForm.major=''
              this.$message({
                type: 'error',
                message: '该院系下无此专业，前选择其他院系'
              });
            }

            // console.log(this.majores)
          })
        }
      },
      changeMajor(value) {
        this.dcxs=true
        this.params.classId = ""
        if (!value) {
          this.classes2 = [];
        } else {
          this.$http.get('/school/class/partake/list', {params: {majorId: value}}).then(res => {
            this.classes2 = res.data

          })
        }
      },
      changeClasses(value) {
        this.dcxs=true
        this.params.classId = value
      },
      changenjes(value) {
        this.dcxs=true
        this.params.grade = value
      },
      bian() {
        this.dcxs=true
      },
      changeSchoolbj(value) {
        this.ruleForm.college = ""
        this.ruleForm.major = ""

        this.ruleForm.class = ""
        this.colleages = [];
        this.majores = [];
        this.classes2 = [];
        if (!value) {


        } else {
          this.$http.get('/school/college/list', {params: {campusId: value}}).then(res => {
            if (res.data.length>0){
              this.colleages = res.data
            } else {
              this.ruleForm.college =''
              this.$message({
                type: 'error',
                message: '该校区下无此院系，前选择其他校区'
              });
            }

          })
        }
      },

      changeCollegebj(value) {
        this.ruleForm.major = ""

        this.ruleForm.class = ""
        this.majores = [];
        this.classes2 = [];
        if (!value) {


        } else {
          this.$http.get('/school/major/list', {params: {collegeId: value}}).then(res => {
            if (res.data.length>0){
              this.majores = res.data
            } else {
              this.ruleForm.major=''
              this.$message({
                type: 'error',
                message: '该院系下无此专业，前选择其他院系'
              });
            }

            // console.log(this.majores)
          })
        }
      },
      changeMajorbj(value) {

        this.ruleForm.class = ""
        this.classes2 = [];
        if (!value) {

        } else {
          this.$http.get('/school/class/partake/list', {params: {majorId: value,gradeId: this.ruleForm.grade}}).then(res => {
            this.classes2 = res.data

          })
        }
      },
      changegradebj(value) {

        this.ruleForm.class = ""
        if (!value) {
          this.classes2 = [];
        } else {
          this.$http.get('/school/class/partake/list', {params: {majorId: this.ruleForm.major,gradeId: value}}).then(res => {
            this.classes2 = res.data

          })
        }
      },
      changeClassesbj(value) {
        this.ruleForm.class = value
      },
      search() {
        this.dcxs=false
        this.params.current = 1
        this.fetch()
      },
      changePage(current, size) {
        this.params.current = current
        this.params.size = size
        this.fetch()
      },
      studentStatus(index) {
        if (index == 0) {
          return '未激活'
        } else if (index == 1) {
          return '正常'

        } else if (index == 2) {
          return '冻结'

        } else if (index == 3) {
          return '禁用'

        } else if (index == 4) {
          return '删除'

        }
      },
      getColleges() {
        this.$http.get('/school/college/list').then(res => {
          this.colleages = res.data
        })
      },
      getMajores() {
        this.$http.get('/school/major/list').then(res => {
          this.majores = res.data
        })
      },
      getGradees() {
        this.$http.get('/school/grade/partake/list').then(res => {
          this.gradees = res.data
        })
      },
      getClasses2( majorId,grade) {
        this.$http.get('/school/class/partake/list',{params: {majorId: majorId,gradeId: grade}}).then(res => {
          this.classes2 = res.data
        })
      },
    },
    created() {
      const that = this;
      that.activeName = that.$route.query.type;
      that.fetch()
      that.getCampus()
      that.getGradees()
      that.getEthnic()
    },
    mounted() {

    }
  }
</script>
<style>

</style>

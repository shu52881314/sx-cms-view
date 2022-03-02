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
                  <a class="el-button el-button--text el-button--mini" download="" href='/static/tpls/职工模板.xlsx'
                     size='mini'><i class='el-icon-question'></i>模板下载</a>
                </span>
            </div>
            <el-form-item label="" prop="name">
              <el-col :span="22">
                <upload-file
                  ref="childUpload"
                  uploadUrl="/school/teacher/import"
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


    <el-dialog :title='ruleForm.id ? "编辑职工信息" : "添加职工信息"' :visible.sync="dialogVisible" :close-on-click-modal="false"
               @close="beforeCloseHandler" width="700px">
      <div>

        <el-form label-position="left" size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px"
                 class="demo-ruleForm">
          <el-form-item label="姓名" prop="name">
            <el-col :span="22">
              <el-input placeholder="请输入职工姓名" v-model="ruleForm.name" maxLength="30"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="工号" prop="code">
            <el-col :span="22">
              <el-input placeholder="请输入职工工号" :disabled="ruleForm.id ? true : false" v-model="ruleForm.code"
                        maxLength="30"></el-input>
            </el-col>
          </el-form-item>
          <!-- <el-form-item label="手机号" prop="mobile">
             <el-col :span="22">
               <el-input placeholder="请输入职工手机号" v-model="ruleForm.mobile"></el-input>
             </el-col>
           </el-form-item>-->

          <!--DOTO-->
          <!--<el-form-item label="角色" prop="roleId">
            <el-col :span="22">
              <el-select :disabled="ruleForm.id == 0 ? false : true && IsSelectAdmin" style="width:100%"
                         v-model="ruleForm.roleId" placeholder="请选择">
                <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>-->
          <el-form-item label="性别：" prop="gender">
            <el-col :span="22">
              <el-radio-group v-model="ruleForm.gender">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>


          <el-form-item label="民族：">
            <el-col :span="22">
              <el-select style="width:100%" v-model="ruleForm.ethnicId" placeholder="请选择专业">
                <el-option v-for="item in ethnices" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="所属校区：" >
            <el-col :span="22">
              <el-select @change="changeSchool" clearable style="width:100%" v-model="ruleForm.campusId"
                         placeholder="请选择校区">
                <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="所属院系：">
            <el-col :span="22">
              <el-select style="width:100%" clearable v-model="ruleForm.collegeId"
                         placeholder="请选择院系">
                <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <div v-if="ruleForm.organizations.length > 0" v-for="(orgItem,index) in ruleForm.organizations">
            <el-form-item :label="'所属机构'+ (index + 1) + '：'">
              <el-col :span="22">
                <el-select style="width:100%" v-model="ruleForm.organizations[index].orgId" clearable
                           placeholder="请选择机构">
                  <el-option v-for="item in org" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-col>
            </el-form-item>

            <el-form-item :label="'职务' + (index + 1) + '：'">
              <el-col :span="22">
                <el-input style="width:100%" v-model="ruleForm.organizations[index].duty" clearable
                          placeholder="请输入教职工职务">
                </el-input>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item v-if="ruleForm.organizations.length > 0">
            <el-col :span="22">
              <el-button @click="addOrg" type="primary">
                添加新机构
              </el-button>
            </el-col>
          </el-form-item>
          <!-- <el-form-item label="身份" prop="identity">
              <el-col :span="22">
                  <el-select style="width:100%" v-model="ruleForm.identity" placeholder="请选择">
                      <el-option v-for="item in identitys" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                  </el-select>
              </el-col>
          </el-form-item> -->


          <el-form-item label="备注">
            <el-col :span="22">
              <el-input type="textarea" v-model="ruleForm.comment" maxlength="100"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button v-if="ruleForm.id" type="primary" @click="submitForm('ruleForm',1)">修改</el-button>
            <el-button v-if="!ruleForm.id" type="increase" @click="submitForm('ruleForm',2)">添加</el-button>
          </el-form-item>
        </el-form>

      </div>
    </el-dialog>


    <div class="main-header">
      <span class="main-title">职工列表</span>
      <div class="main-btn-box">
        <el-button type="increase" size="mini" @click="modifyTeacher()"><i class="fa fa-plus"
                                                                           v-perms="'/executive/teacher/user/add'"></i> 添加
        </el-button>
        <el-button type="primary" size="mini" @click="dialogImportCollegeVisible = true" v-perms="'/executive/teacher/user/add'">
          导入
        </el-button>
        <el-button @click="importFile" type="warning" size="mini" v-perms="'/executive/teacher/user/add'">导出</el-button>

      </div>
    </div>

    <div class="search-box">
      <el-form size="mini" :inline="true">
        <el-form-item label="校区：">
          <el-select @change="changeSchool" clearable style="width:100%" v-model="params.campusId"
                     placeholder="请选择校区">
            <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="院系：">
          <el-select ref="department" clearable v-model="params.collegeId"
                     placeholder="请选择院系">
            <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属机构：">
          <el-select ref="department" clearable v-model="params.organizationId"
                     placeholder="请选择机构">
            <el-option v-for="item in org" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input v-model="params.code" placeholder="请输入工号搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="params.name" placeholder="请输入姓名搜索"></el-input>
        </el-form-item>
        <!-- <el-form-item>
             <el-input v-model="params.mobile" size="mini" placeholder="手机号"></el-input>
         </el-form-item>-->
        <el-form-item>
          <el-button size="mini" type="primary" @click="search()"><i class="el-icon-search"></i> 搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="tableData" stripe size="mini" style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="姓名" width="200"></el-table-column>
      <el-table-column prop="code" label="工号"></el-table-column>
      <el-table-column prop="code" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.gender == 1 ? "男" : (scope.row.gender == 2 ? "女" : "")}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ethnic" label="民族"></el-table-column>
      <el-table-column prop="campusName" label="所属校区"></el-table-column>
      <el-table-column prop="collegeName" label="所属院系"></el-table-column>
      <el-table-column prop="organizationName" label="所属机构"></el-table-column>
      <el-table-column prop="comment" label="备注"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status == 0 ? "未激活" : scope.row.status == 1 ? "正常" :scope.row.status == 2 ? "冻结":scope.row.status == 3? "禁用":scope.row.status == 4? "删除":''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <div slot-scope="scope" v-if="showAdminBtn(scope.row.isAdmin)">
          <el-button size="mini" type="text" @click="modifyTeacher(scope.row)" v-perms="'/executive/teacher/user/edit'">编辑
          </el-button>
          <el-button size="mini" type="text" @click="resetPasword(scope.row.id)" v-perms="'/executive/teacher/user/reset'">重置密码
          </el-button>
          <span v-perms="'/executive/teacher/user/prohibit'"><el-button v-if="scope.row.status == 1" size="mini" type="text"
                                                              @click="forbidMember(scope.row.id,3)">禁用</el-button></span>
          <span v-perms="'/executive/teacher/user/prohibit'"><el-button v-if="scope.row.status == 3" size="mini" type="text"
                                                              @click="forbidMember(scope.row.id,1)"
                                                              style="color:red">解禁</el-button></span>
        </div>

      </el-table-column>
    </el-table>

    <qu-pagination :total="params.total" @change="changePage"></qu-pagination>


  </div>
</template>

<script>
  import axios from 'axios'
  import {
    isvalidPhone
  } from '@/utils/validate'

  import {
    cascade
  } from '@/utils/filters'

  var validPhone = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入手机号码'))
    } else if (!isvalidPhone(value)) {
      callback(new Error('请输入正确的11位手机号码'))
    } else {
      callback()
    }
  }

  export default {
    name: "teacher",
    data() {
      return {
        fileListName: '',
        fileList: [],
        randomData: "",
        IsSelectAdmin: false,
        isShowAdmin: localStorage.getItem("isAdmin") == 1 ? true : false,
        isDisable: false,
        schools: [],
        departments: [],
        dialogImportCollegeVisible: false,
        ColleageRequired: true,
        ExecutiveRequired: false,
        collegeOrExecutive: 'college',
        isExecutive: false,
        isColleage: false,
        dialogVisibleUpload: false,
        codeDisabled: false,
        organizations: [],
        colleges: [],
        org: [],
        loading: true,
        showfileInfor: false,
        showProgress: false,
        fileUploadPercent: 0,
        showfileInforDetail: false,
        clickAble: true,
        fileInforamtion: {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        },
        options: [],
        ethnices: [],
        options2: [],
        roles: [],
        identitys: [
          {
            id: 1,
            name: '学生'
          },
          {
            id: 2,
            name: '老师'
          }
        ],
        ruleForm: {
          id: '',
          name: '',
          code: '',
          campusId: '',
          collegeId: '',
          ethnicId: 1,
          gender: '1',
          organizations: [],
          comment: '',
        },
        executives: [],
        rules: {
          name: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          },
          ],
          code: [{
            required: true,
            message: '请输入工号',
            trigger: 'change'
          }],
          campusId: [{
            required: true,
            message: '请选择校区',
            trigger: 'blur'
          }],
          comment: [{
            required: true,
            message: '请填写备注',
            trigger: 'blur'
          },
          ],
        },
        dialogVisible: false,
        tableData: [],
        imageUrl: '',
        multipleSelection: [],
        params: {
          organizationId: '',
          collegeId: '',
          campusId: '',
          code: '',
          name: '',
          mobile: '',
          size: 10,
          current: 1,
          total: 0
        }
      }
    },
    computed: {
      // status:function(){
      //      return 2;
      // }
    },
    created() {
      this.fetchData();
      this.getorganizations();
      this.roleList();
      this.getEthnic();
      this.getCampus();
      this.getOrg();
    },
    methods: {
      addOrg() {
        const that = this;
        for (let i = 0; i < that.ruleForm.organizations.length; i++) {
          let check = that.ruleForm.organizations[i];
          if (!check.orgId) {
            this.$message({
              type: 'error',
              message: '请先选择机构' + (i + 1) + '的值'
            });
            return;
          }
        }
        let tempOrgItem = new Object();
        tempOrgItem.orgId = '';
        tempOrgItem.duty = '';
        that.ruleForm.organizations.push(tempOrgItem);
      },
      getOrg() {//获取机构列表
        this.$http.get('/organization/administration/list', {params: {keyWord: ''}}).then(res => {
          this.org = res.data
        })
      },
      getCampus() {//获取校区
        this.$http.get('/school/all/campus').then(res => {
          this.schools = res.data
        })
      },
      changeSchool(value) {

          this.ruleForm.collegeId=''


        if (value) {
          this.$http.get('/school/all/college/cascader', {params: {campusId: value}}).then(res => {
            this.departments = res.data
          })
        } else {
          this.departments = [];
        }
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
          url: 'school/fail/teacher/export',
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
          link.setAttribute('download', '职工失败信息' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })

      },
      showAdminBtn(type) {
        if (type == 1) {
          if (this.isShowAdmin == 1) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
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
      //修改
      modifyTeacher(row) {
        this.dialogVisible = true;
        if (row) {
          console.log(row)
          this.ruleForm.campusId = row.campusId;


          this.ruleForm.id = row.id;
          this.ruleForm.name = row.name;
          this.ruleForm.code = row.code;
          this.ruleForm.organizations = [];
          this.ruleForm.comment = row.comment;
          if (row.ethnicId) {
            this.ruleForm.ethnicId = row.ethnicId;
          }

          if (row.gender) {
            this.ruleForm.gender = row.gender + '';
          }


          this.changeSchool(row.campusId);
          this.ruleForm.collegeId = row.collegeId;
        } else {//添加成员
          let tempOrg = [];//初始化一组机构选项
          let tempOrgItem = new Object();
          tempOrgItem.orgId = '';
          tempOrgItem.duty = '';
          tempOrg.push(tempOrgItem);
          this.ruleForm.organizations = tempOrg;
        }
      },
      importFile() {
        axios({
          method: 'get',
          url: 'operator/teachers/export',
          responseType: 'blob',
          params: {}
        }).then((res) => {
          if (!res) {
            return
          }
          var filename = name;
          let url = window.URL.createObjectURL(res)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '职工列表' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })
      },
      forbidMember(id, status) {
        this.$confirm(status == 3 ? '是否禁用该职工' : '是否解禁该职工', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/operator/teacher/disable', {
            id: id,
            status: status
          }).then((res) => {
            if (res.code == '200') {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.fetchData()
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          })
        })
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
      changePage(current, size) {
        this.params.current = current
        this.params.size = size
        this.fetchData()
      },
      roleList() {
        this.$http.get('/operator/all-role').then(res => {
          this.roles = res.data
        })
      },
      getorganizations() {

        this.$http.get('/organization/party/list/all', {
          params: {
            nature: 1
          }
        }).then(res => {
          this.organizations = res.data
        })

        this.$http.get('/organization/party/list/all', {
          params: {
            nature: 1
          }
        }).then(res => {
          this.organizations = res.data
        })
      },

      changeExecutive(value) {
        if (value) {
          this.isColleage = true
          this.ruleForm.college = ''
          this.ruleForm.type = 'executive'
          this.ColleageRequired = false
          this.ExecutiveRequired = true
        } else {
          this.isColleage = false
          this.ruleForm.type = ''
          this.ColleageRequired = true
          this.ExecutiveRequired = false
        }
      },
      changeSwitch(id, status) {
        this.$http.put("/api/v1/teacher/delete", {
          id: id,
          status: status
        }).then(() => {

          this.fetchData();
        })
      },
      importTeacher() {
        let Importparams = {};
        Importparams.code = this.params.code
        Importparams.name = this.params.name
        Importparams.mobile = this.params.mobile
        this.$http.get("/api/v1/teacher/export", {
          params: Importparams
        }).then(res => {
          exportOss(res.data.url)
        })

      },
      ImportEecel() {
        this.dialogVisibleUpload = true
      },
      //教职工导入
      getToken() {
        return {
          "Access-Token": localStorage.getItem("Token")
        }
      },
      handleAvatarSuccess(res) {
        let result = JSON.parse(Decrypt(res));
        if (result.code == 200) {
          this.fileInforamtion = result.data
          this.showfileInfor = true;
        } else {
          this.$message({
            type: 'error',
            message: result.msg
          });
        }
      },
      beforeAvatarUpload(file) {
        //const isxls = file.type === 'application/vnd.ms-excel';
        const isLt2M = file.size / 1024 / 1024 < 2;
        // if (!isxls) {
        //   this.$message.error('上传文件只能是 xls 格式!');
        // }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 2MB!');
        }
        return isLt2M;
      },
      beforeCloseHandler() {

        this.resetForm('ruleForm');
        // this.ruleForm = {
        //   id: '',
        //   name: '',
        //   code: '',
        //   roleId: '',
        //   organizations: [],
        //   ethnicId: 1,
        //   gender: '1',
        //   identity: '',
        //   mobile: '',
        //   comment: '',
        // }
        this.ruleForm =  {
          id: '',
            name: '',
            code: '',
            campusId: '',
            collegeId: '',
            ethnicId: 1,
            gender: '1',
            organizations: [],
            comment: '',
        },
        this.IsSelectAdmin = false
      },
      //重置密码
      resetPasword(id) {
        this.$confirm('确定要重置密码吗?重置后密码为教职工号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post("/operator/teacher/reset-password", {
            id: id
          }).then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '重置成功!'
              });
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
      //修改
      getRoles() {
        this.$http.get("/api/v1/system/all-roles").then(res => {
          this.roles = res.data;
        })
      },
      submitForm(formName, type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (type == 1) {
              this.$http.post("/operator/teacher/modify", this.ruleForm).then((res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.dialogVisible = false;
                  this.resetForm('ruleForm')
                  this.fetchData();
                }

              })
            } else if (type == 2) {
              const that = this;
              // for (let i = 0; i < that.ruleForm.organizations.length; i++) {
              //   let check = that.ruleForm.organizations[i];
              //   if (!check.orgId) {
              //     that.$message({
              //       type: 'error',
              //       message: '请先选择机构' + (i + 1) + '的值'
              //     });
              //     return;
              //   }
              // }
              that.$http.post("/operator/teacher/add", that.ruleForm).then((res) => {
                if (res.code == '200') {
                  that.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  that.dialogVisible = false;
                  that.resetForm('ruleForm')
                  that.fetchData();
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      changeFun(val) {
        this.multipleSelection = val;
      },
      fetchData() {
        this.loading = true
        this.$http.get("/operator/teachers", {
          params: this.params
        }).then(res => {
          this.tableData = res.data.list
          this.params.total = res.data.total
          this.loading = false
        })
      },
      search() {
        this.params.current = 1;
        this.fetchData();
      },
      deleteTeacher(id, status) {
        this.$confirm('此操作将永久删除该该教职工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put("/api/v1/teacher/delete", {
            id: id,
            status: status
          }).then((res) => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.fetchData();
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
    }

  }
</script>

<style scoped>
  .el-card {
    box-shadow: 0 0 0 0
  }

  .el-card:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  }

  .downTempalte {
    cursor: pointer;
  }

  .fileTotal b {
    color: red
  }

  .teacher-logo {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    text-align: center;
  }

  .teacher-name {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    text-align: center;
    height: 30px;
    margin-top: 10px;
    font-size: 18px;
    font-weight: bold;
  }

  .teacher-logo img {
    width: 80px;
    height: 80px;
    border-radius: 150px;
  }

  .teacher-code {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    text-align: center;
  }

  .teacher-phone {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    color: #666;
    height: 35px;
    margin-top: 10px;
  }

  .teacher-departement {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    height: 25px;
  }

  .teacher-states {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    margin-top: 10px;
  }

  .teacher-card {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    margin-top: 10px;
    font-size: 14px;
    padding-bottom: 15px;
    min-height: 300px;
  }

  .teacher-btn {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    padding-top: 10px;
    margin-top: 10px;
    border-top: 1px solid #F3F3F5;
  }

  .teacher-btn span {
    cursor: pointer
  }

  .teacher-card-col {
    width: 18%;
    margin-left: 1.5%;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 78px;
    height: 78px;
    line-height: 78px;
    text-align: center;
  }

  .avatar {
    width: 78px;
    height: 78px;
    display: block;
  }
</style>

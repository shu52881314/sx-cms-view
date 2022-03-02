<template>
  <section>
    <!--<el-tabs v-model="activeName" @tab-click="goTab">-->
    <!--<el-tab-pane label="校区" name="0"></el-tab-pane>-->
    <!--<el-tab-pane label="院系" name="1"></el-tab-pane>-->
    <!--<el-tab-pane label="专业" name="2"></el-tab-pane>-->
    <!--<el-tab-pane label="班级" name="3"></el-tab-pane>-->
    <!--<el-tab-pane label="学生" name="4"></el-tab-pane>-->
    <!--</el-tabs>-->

    <el-dialog title="批量导入成绩" :visible.sync='dialogImportCollegeVisiblecj' @close="beforeCloseImportCollegeHandler"
      :close-on-click-modal="false" width='650px' id="dialogOrangecj">
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
                <upload-file ref="childUpload" uploadUrl="/school/historycredit/import" uploadType=".xls,.xlsx"
                  uploadSzie="100" uploadSzieTips="只能上传xlx/xlsx文件，且不超过100MB!" @fileInfor="openfileInfor"
                  @setFileList="setFileList" @setProgress="setProgress">
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
            <span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功，<span
              style="color:#FFC600;">{{fileInforamtion.failed}}</span>条导入失败
            <span @click="downFailedcj()" style="cursor:pointer;color:#4D98FF"
              v-if="fileInforamtion.failed">下载失败列表</span>
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
    <div class="main-header">
      <span class="main-title">已导入成绩</span>
      <div class="main-btn-box">

        <el-button type="primary" size="mini" @click="dialogImportCollegeVisiblecj = true"
          v-perms="'/student/list/add'">
          导入成绩
        </el-button>
        <!-- <el-button type="primary" @click="exportStundent" size="mini">导出</el-button> -->
      </div>
    </div>
    <div class="search-box">
      <el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item label="导入时间">
          <el-form-item>
            <el-col :span="22">
              <el-date-picker @change="changeStartDate" style="width:100%;margin-right: 0px;"
                v-model="dateArray.statTime2" type="datetime" format="yyyy-MM-dd HH:mm" default-time="00:00:00"
                placeholder="请选择开始日期">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <span style="color:#606266;font-size:14px;">至</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-form-item>
            <el-col :span="22">
              <el-date-picker @change="changeendDate" style="width:100%;" start-placeholder="2017 年 03 月 21 日"
                v-model="dateArray.endTime2" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择结束日期">
              </el-date-picker>
            </el-col>
          </el-form-item>

        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="params.name" maxlength=30 placeholder="请输入姓名搜索" @input="cz"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="params.code" placeholder="请输入学号搜索" @input="cz"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-body" style="padding-bottom: 60px">

      <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="100"></el-table-column>
        <el-table-column prop="code" label="学号" width="100"></el-table-column>
        <el-table-column prop="yearName" label="学年"></el-table-column>
        <el-table-column prop="ssemesterName" label="学期"></el-table-column>
        <el-table-column prop="itemName" width="150" label="活动/项目名称"></el-table-column>
        <el-table-column label="来源">
          <template slot-scope="scope">
            <span>{{scope.row.creditType==1?'活动':scope.row.creditType==2?'项目':''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="classfyName" label="所属分类"></el-table-column>
        <el-table-column prop="score" label="分值"></el-table-column>
        <el-table-column label="获得时间">
          <template slot-scope="scope">
            <span>{{scope.row.sendTime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="className" label="导入时间">
          <template slot-scope="scope">
            <span>{{scope.row.importTime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="scope">
            <!-- 可转载站点功能未完成 -->
            <el-button type="text" size="mini" @click="deleteStudent(scope.row.id)">删除
            </el-button>

          </div>
        </el-table-column>
      </el-table>
      <div>
        <span style="    margin-top: 13px;
    display: inline-block;">
          <el-button type="primary" size="mini" :disabled="scsy" @click="scsylist">
            删除所有
          </el-button>
          <el-button type="primary" size="mini" @click="scsx">
            删除所选
          </el-button>
        </span>
        <qu-pagination :total="total" @change="changePage"></qu-pagination>
      </div>

    </div>
  </section>
</template>
<script>
  import axios from 'axios'
  import bus from '@/main'

  import {
    politicsFmt
  } from "@/utils/format";
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

      return {
        scsy: true,
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
        isShow: false,
        pickerOptions1: {
          disabledDate: (time) => {
            let beginDateVal = this.dateArray.statTime2;
            if (beginDateVal) {
              let beginYear = beginDateVal.getFullYear();
              let beginMonth = beginDateVal.getMonth() + 1;
              let beginDate = beginDateVal.getDate();

              let beginDateVal1 = beginYear + '-' + beginMonth + '-' + beginDate + ' ' + '00:00:00';
              let beginDateVal2 = beginDateVal1.replace(/-/g, '/');
              let timestamp = new Date(beginDateVal2).getTime();

              if (beginDateVal) {
                return time.getTime() < timestamp;
              }
            } else {
              return true
            }
          },
          // minTime:dateArray.startDate2
        },
        dateArray: {
          statTime2: '',
          endTime2: '',
        },
        params: {
          current: 1,
          size: 10,
          startTime: '',
          endTime: '',
          name: '',
          code: ''
        },
        multipleSelection: [],
        isChange: false,
        data: [],
        ethnices: [],
        politics: [{
          id: 0,
          name: '群众'
        }, {
          id: 1,
          name: '团员'
        }, {
          id: 2,
          name: '党员'
        }, {
          id: 3,
          name: '其他党派'
        }, {
          id: 4,
          name: '预备党员'
        }], //政治面貌
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
          }],
          college: [{
            required: true,
            message: '请选择所属院系',
            trigger: 'change'
          }],
          major: [{
            required: true,
            message: '请选择所属专业',
            trigger: 'change'
          }],
          class: [{
            required: true,
            message: '请选择班级',
            trigger: 'change'
          }],
          code: [{
            required: true,
            message: '请填写学号',
            trigger: 'blur',
            // validator: validCode
          }],
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
      handleSelectionChange(val) {

        this.multipleSelection = val;
      },
      scsx() {
        var Ids = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          Ids.push(this.multipleSelection[i].id)
        }
        var idsnow = Ids.toString()
        this.$confirm('是否删除所选成员成绩?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/school/historycredit/delete', {
            Ids: idsnow,
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
        }).catch(() => {})

      },
      scsylist() {
        this.$confirm('此操作是不可恢复的，是否删除所有成员成绩?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	this.$confirm('再次确认，此操作是不可恢复的，是否删除所有成员成绩?', '提示', {
        	  confirmButtonText: '确定',
        	  cancelButtonText: '取消',
        	  type: 'warning'
        	}).then(() => {
        		this.$confirm('最后一次确认，此操作是不可恢复的，是否删除所有成员成绩?', '提示', {
        		  confirmButtonText: '确定',
        		  cancelButtonText: '取消',
        		  type: 'warning'
        		}).then(() => {
        		  this.$http.post('/school/historycredit/deleteall', this.params).then(res => {
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
        		}).catch(() => {});
        	}).catch(() => {});
        }).catch(() => {});

      },

      changeStartDate(value) {
        if (value) {
          this.isShow = false
        } else {
          this.isShow = true
          this.dateArray.endTime2 = ""
        }
        this.scsy = true
      },
      changeendDate() {

        this.scsy = true
      },
      cz() {
        this.scsy = true
      },
      changepolitics(value) {
        this.ruleForm.politics = ''
        this.ruleForm.politics = value

      },
      changeStatus(item) {
        const that = this;
        let st = item.status == 3 ? 1 : 3
        that.$confirm(item.status == 3 ? '是否启用此学员?' : item.status == 1 ? '是否禁用此学员?' : '', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http.post('/school/student/statusModify', {
            userId: item.id,
            status: st
          }).then(res => {
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
        this.$router.push({
          path: that.tabsList[parseInt(that.activeName)],
          query: {
            type: that.activeName
          }
        });
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
      //删除成绩
      deleteStudent(id) {

        this.$confirm('是否删除此成员成绩?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/school/historycredit/delete', {
            Ids: id,
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
        }).catch(() => {})
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
        this.$router.push({
          path: "/report/" + id,
          query: {
            id: id
          }
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
          politics: ''
        }
        this.params = {
          current: 1,
          size: 10,

          name: '',
          code: ''
        }
        this.colleages = [];
        this.majores = [];
        this.classes2 = [];
        this.gradees = [];
        this.colleges = []
        this.majors = []
        this.classes = []
        this.isChange = false
      },
      resetPassword(row) {
        this.$http.post('/school/student/password/reset', {
          id: row.id
        }).then(res => {
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

          that.getClasses2(row.majorId, row.grade)
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
        that.$http.get('/school/gethistorycredit', {
          params: that.params
        }).then(res => {
          that.data = res.data.list
          that.total = res.data.total
          that.loading = false
          this.params.startTime = ''
          this.params.endTime = ''
        })
      },
      getCampus() {
        this.$http.get('/school/all/campus').then(res => {
          this.schools = res.data
        })
      },
      changeSchool(value) {
        this.params.collegeId = ""
        this.params.majorId = ""
        this.params.classId = ""
        if (!value) {
          this.colleages = [];
          this.majores = [];
          this.classes2 = [];
          this.gradees = [];
        } else {
          this.$http.get('/school/college/list', {
            params: {
              campusId: value
            }
          }).then(res => {
            if (res.data.length > 0) {
              this.colleages = res.data
            } else {
              this.ruleForm.college = ''
              this.$message({
                type: 'error',
                message: '该校区下无此院系，前选择其他校区'
              });
            }

          })
        }
      },

      changeCollege(value) {
        this.params.majorId = ""
        this.params.classId = ""
        if (!value) {
          this.majores = [];
          this.classes2 = [];
          this.gradees = [];
        } else {
          this.$http.get('/school/major/list', {
            params: {
              collegeId: value
            }
          }).then(res => {
            if (res.data.length > 0) {
              this.majores = res.data
            } else {
              this.ruleForm.major = ''
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
        this.params.classId = ""
        if (!value) {
          this.classes2 = [];
        } else {
          this.$http.get('/school/class/partake/list', {
            params: {
              majorId: value
            }
          }).then(res => {
            this.classes2 = res.data

          })
        }
      },
      changeClasses(value) {
        this.params.classId = value
      },
      changeSchoolbj(value) {
        this.ruleForm.college = ""
        this.ruleForm.major = ""

        this.ruleForm.class = ""
        if (!value) {
          this.colleages = [];
          this.majores = [];
          this.classes2 = [];

        } else {
          this.$http.get('/school/college/list', {
            params: {
              campusId: value
            }
          }).then(res => {
            if (res.data.length > 0) {
              this.colleages = res.data
            } else {
              this.ruleForm.college = ''
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
        if (!value) {
          this.majores = [];
          this.classes2 = [];

        } else {
          this.$http.get('/school/major/list', {
            params: {
              collegeId: value
            }
          }).then(res => {
            if (res.data.length > 0) {
              this.majores = res.data
            } else {
              this.ruleForm.major = ''
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
        if (!value) {
          this.classes2 = [];
        } else {
          this.$http.get('/school/class/partake/list', {
            params: {
              majorId: value,
              gradeId: this.ruleForm.grade
            }
          }).then(res => {
            this.classes2 = res.data

          })
        }
      },
      changegradebj(value) {

        this.ruleForm.class = ""
        if (!value) {
          this.classes2 = [];
        } else {
          this.$http.get('/school/class/partake/list', {
            params: {
              majorId: this.ruleForm.major,
              gradeId: value
            }
          }).then(res => {
            this.classes2 = res.data

          })
        }
      },
      changeClassesbj(value) {
        this.ruleForm.class = value
      },
      search() {

        if (this.dateArray.statTime2) {
          this.params.startTime = this.dateArray.statTime2.getTime();
          console.log(this.dateArray.statTime2)
        }
        if (this.dateArray.endTime2) {
          this.params.endTime = this.dateArray.endTime2.getTime();
        }

        this.params.current = 1
        this.fetch()
        this.scsy = false
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
      getClasses2(campusId, collegeId, majorId, grade) {
        this.$http.get('/school/class/partake/list', {
          params: {
            majorId: majorId,
            gradeId: grade
          }
        }).then(res => {
          this.classes2 = res.data
        })
      },
    },
    created() {
      const that = this;
      that.activeName = that.$route.query.type;
      // that.fetch()

    },
    mounted() {

    }
  }
</script>
<style>

</style>

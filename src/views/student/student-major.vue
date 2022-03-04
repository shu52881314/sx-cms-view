<template>
  <section>
    <!--<el-tabs v-model="activeName" @tab-click="goTab">-->
      <!--<el-tab-pane label="校区" name="0"></el-tab-pane>-->
      <!--<el-tab-pane label="院系" name="1"></el-tab-pane>-->
      <!--<el-tab-pane label="专业" name="2"></el-tab-pane>-->
      <!--<el-tab-pane label="班级" name="3"></el-tab-pane>-->
      <!--<el-tab-pane label="学生" name="4"></el-tab-pane>-->
    <!--</el-tabs>-->
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
                    <a class="el-button el-button--text el-button--mini" download="" href='/static/tpls/专业模板.xlsx'
                       size='mini'><i class='el-icon-question'></i>模板下载</a>
                  </span>
            </div>
            <el-form-item label="" prop="name">
              <el-col :span="22">
                <upload-file
                  ref="childUpload"
                  uploadUrl="/school/major/import"
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


    <el-dialog
      title="添加专业" @close="beforeCloseHandler"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="550px">

      <div>
        <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="所属校区" prop="campus">
            <el-col :span="22">
              <el-select @change="changeSchool" style="width:100%" v-model="ruleForm.campus" placeholder="请选择校区">
                <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="所属院系" prop="college">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="ruleForm.college" placeholder="请选择院系">
                <el-option v-for="item in colleges" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <!-- <el-form-item label="专业代码" prop="code">
            <el-col :span="22" >
                <el-input :disabled="isShowCode" v-model="ruleForm.code"></el-input>
            </el-col>
          </el-form-item> -->
          <el-form-item label="专业名称" prop="name">
            <el-col :span="22">
              <el-input v-model="ruleForm.name" maxlength="30"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="年制" prop="length">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="ruleForm.length" placeholder="请选择年制">
                <el-option v-for="item in lengths" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
            <el-button v-if="ruleForm.id" type="primary" @click="submitForm('ruleForm',1)">修改</el-button>
            <el-button v-if="!ruleForm.id" type="increase" @click="submitForm('ruleForm',2)">添加</el-button>
          </el-form-item>
        </el-form>
      </div>

    </el-dialog>

    <el-dialog
      title="编辑专业" @close="beforeCloseHandler"
      :visible.sync="editor"
      :close-on-click-modal="false"
      width="550px">

      <div>
        <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="所属校区" prop="campus">
            <el-col :span="22">
              <el-select @change="changeSchool" style="width:100%" v-model="ruleForm.campus" placeholder="请选择校区">
                <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="所属院系" prop="college">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="ruleForm.college" placeholder="请选择院系">
                <el-option v-for="item in colleges" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="专业名称" prop="name">
            <el-col :span="22">
              <el-input v-model="ruleForm.name" maxlength="30"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="年制" prop="length">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="ruleForm.length" placeholder="请选择年制">
                <el-option v-for="item in lengths" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button v-if="ruleForm.id" type="primary" @click="submitForm('ruleForm',1)">修改</el-button>
            <el-button v-if="!ruleForm.id" type="increase" @click="submitForm('ruleForm',2)">添加</el-button>
          </el-form-item>
        </el-form>
      </div>

    </el-dialog>


    <div class="main-header" v-if="$root.ItemData && $root.ItemData.length && $root.ItemData.length == 1">
      <span class="main-title">专业管理</span>
    </div>
    <div class="search-box">
      <span style="float:left;">
			<el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item label="校区" prop="campusId">
          <el-col :span="22">
              <el-select @change="changeSchool2" clearable style="width:100%" v-model="params.campusId"
                         placeholder="请选择校区">
                  <el-option v-for="item in schools2" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="院系">
         <el-select @change="changeCollege2" clearable v-model="params.collegeId" placeholder="请选择院系">
           <el-option v-for="item in colleages" :key="item.id" :label="item.name" :value="item.id"></el-option>
         </el-select>
       </el-form-item>
				<el-form-item label="专业名称">
					<el-input v-model="params.name" placeholder="请输入专业名称搜索"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button size="mini" type="primary" @click="search()">查询</el-button>
				</el-form-item>
			</el-form>
     </span>
      <span style="float:right">
					<el-button v-perms="'/student/major/add'" @click="dialogVisible = true" type="increase"
                     size="mini">添加专业</el-button>
          <el-button v-perms="'/student/major/add'" type="primary" size="mini"
                     @click="dialogImportCollegeVisible = true">导入</el-button>

			</span>
    </div>
    <div class="main-body">
      <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="名称" width="240"></el-table-column>
        <el-table-column label="学制" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.length}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="campusName" label="所属校区"></el-table-column>
        <el-table-column prop="collegeName" label="所属院系"></el-table-column>
        <el-table-column label="班级数">
          <template slot-scope="scope">
            <span>{{scope.row.classCount}}个</span>
          </template>
        </el-table-column>
        <el-table-column prop="studentCount" label="学生数">
          <template slot-scope="scope">
            <span>{{scope.row.studentCount}}人</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="党员总数" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.partyCount}}人</span>
          </template>
        </el-table-column>
        <el-table-column label="团员总数" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.groupCount}}人</span>
          </template>
        </el-table-column>
        <el-table-column label="学生总数" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.studentCount}}人</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="220" align="center">
          <div slot-scope="scope">
            <!-- 可转载站点功能未完成 -->
            <el-button type="text" class="opreat-btn" @click="modify(scope.row)" v-perms="'/student/major/edit'">编辑
            </el-button>
            <el-button @click='deleteCampus(scope.row)' v-perms="'/student/major/delete'" size="mini" type="text">删除
            </el-button>
            <!-- <el-button type="text" class="opreat-btn" v-perms="'/student/major/export'">导出学生</el-button> -->
          </div>
        </el-table-column>
      </el-table>
      <qu-pagination :total="total" @change="changePage"></qu-pagination>
    </div>
  </section>
</template>
<script>
  import axios from 'axios'
  import {
    isvalidMajor, isvalidGrade
  } from '@/utils/validate'

  var validMajor = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入专业代码'))
    } else if (!isvalidMajor(value)) {
      callback(new Error('请输入正确的专业代码'))
    } else {
      callback()
    }
  }

  var validGrade = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入年级'))
    } else {
      callback()
    }
  }

  export default {
    data() {
      return {
        activeName: '',
        tabsList: ['/student/campus', '/student/college', '/student/major', '/student/class', '/student/list'],
        fileListName: '',
        fileList: [],
        showfileInfor: false,
        fileInforamtion: {},
        dialogImportCollegeVisible: false,
        loading: false,
        dialogVisible: false,
        editor: false,
        showProgress: false,
        fileUploadPercent: 0,
        showfileInforDetail: false,
        clickAble: true,
        props: {
          label: "name",
          value: "id"
        },
        lengths: [],
        ruleForm: {
          id: '',
          campus: '',
          college: '',
          name: '',
          code: '',
          length: ''
        },
        schools: [{id: 0, name: localStorage.getItem("schoolName")}],
        schools2: [{id: 0, name: localStorage.getItem("schoolName")}],
        rules: {
          campus: [{
            required: true,
            message: '请选择所属校区',
            trigger: 'change'
          }
          ],
          college: [{
            required: true,
            message: '请选择所属院系',
            trigger: 'change'
          }
          ],
          name: [{
            required: true,
            message: '请输入专业名称',
            trigger: 'blur'
          }
          ],
          code: [{
            required: true,
            trigger: 'blur',
            validator: validMajor
          }
          ],
          length: [{
            required: true,
            message: '请选择年制',
            trigger: 'change'
          }
          ]

        },
        randomData: "",
        params: {
          current: 0,
          size: 10,
          option: '',
          name: '',
          campusId: '',
          collegeId: '',
        },
        data: [],
        colleges: [],
        colleages: [],
        total: 0,
        isShowCode: false,
        options: [{id: 0, name: localStorage.getItem("schoolName")}]
      }
    },
    methods: {
      goTab() {
        const that = this;
        this.$router.push({ path: that.tabsList[parseInt(that.activeName)], query: { type:that.activeName }});
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
          url: 'school/fail/major/export',
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
          link.setAttribute('download', '专业失败信息' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })

      },
      changeSchool2(value) {
        if (value) {
          this.$http.get('/school/all/college/cascader', {params: {campusId: value}}).then(res => {
            this.colleages = res.data

          })
        } else {
          this.colleages = []
        }
        console.log(value)
        // this.changeCollege2(value)
      },
      changeCollege2(value) {
        if (value) {
          this.$http.get('/school/all/major/cascader', {params: {collegeId: value}}).then(res => {
            this.majores = res.data
          })
        } else {
          this.majores = []
        }

      },
      deleteCampus(item) {

        this.$confirm('是否确定删除该专业?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http.post('/school/major/delete', {
            id: item.id
          }).then((res) => {

            if (res.code == '200') {
              this.fetch();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }

          })

        }).catch(() => {

        });


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
          this.showfileInfor = true
          this.fileInforamtion = res
          this.fetch()
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      beforeCloseHandler() {
        this.ruleForm = {
          id: '',
          campus: '',
          college: '',
          name: '',
          code: '',
          length: ''
        }
        this.isShowCode = false
        this.resetForm('ruleForm');
      },
      getOptions() {
        this.$http.get('/school/all/college/cascader').then(res => {
          this.options = this.options.concat(res.data)
        })
      },
      changeOption(value) {
        this.params.option = value.join(',')
      },
      fetch() {
        this.loading = true
        this.$http.get('/school/majors', {params: this.params}).then(res => {
          this.data = res.data.list
          this.total = res.data.total
          this.loading = false
        })
      },
      search() {
        this.params.current = 1
        this.fetch()
      },
      changePage(current, size) {
        this.params.current = current
        this.params.size = size
        this.fetch()
      },
      getCampus() {
        this.$http.get('/school/all/campus').then(res => {
          this.schools = res.data
          this.schools2 = res.data
          // this.schools2 = this.schools2.concat(res.data)
          //
          // if(res.data && res.data.length){
          //   this.schools = res.data
          // }else{
          //   this.schools = this.schools.concat(res.data)
          // }

        })
      },
      getLengths() {
        this.$http.get("/school/year/partake/list").then(res => {
          this.lengths = res.data
        })
      },
      changeSchool(value) {
        this.$http.get('/school/all/college/cascader', {params: {campusId: value}}).then(res => {
          this.colleges = res.data
          this.ruleForm.college = ""
        })
      },
      changeCollege(value) {
        this.$http.get('/school/all/major/cascader', {params: {collegeId: value}}).then(res => {
          this.majors = res.data
          this.ruleForm.major = ""
        })
      },
      modify(row) {

        if (row) {

          this.editor = true
          this.isShowCode = true
          this.ruleForm.id = row.id
          this.ruleForm.campus = row.campusId
          this.ruleForm.name = row.name
          this.ruleForm.code = row.code
          this.ruleForm.length = row.lengthId
          this.$http.get('/school/all/college/cascader', {params: {campusId: row.campusId}}).then(res => {
            this.colleges = res.data;
            this.ruleForm.college = row.collegeId;
          })

        } else {
          this.dialogVisible = true;
        }
      },
      submitForm(formName, type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (type == 1) {
              this.$http.post('/school/major/modify', this.ruleForm).then((res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.editor = false;
                  this.fetch();
                }

              })
            } else if (type == 2) {
              this.$http.post('/school/major/add ', this.ruleForm).then((res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.dialogVisible = false;
                  this.fetch();
                } else {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  });
                }
              })
            }
          } else {
            return false;
          }
        });
      },
    },
    created() {
      const that = this;
      that.activeName = that.$route.query.type;
      // this.getOptions()
      that.fetch()
      that.getCampus()
      // that.$http.get('/school/college/list').then(res => {
      //   that.colleages = res.data
      // })
      that.getLengths()
    },
    mounted() {

    }
  }
</script>
<style>

</style>

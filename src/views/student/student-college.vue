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
                    <a class="el-button el-button--text el-button--mini" download="" href='/static/tpls/院系模板.xlsx'
                       size='mini'>下载模板</a>
                  </span>
            </div>
            <el-form-item label="" prop="name">
              <el-col :span="22">
                <upload-file
                  ref="childUpload"
                  uploadUrl="/school/college/import"
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
      title="添加院系" @close="beforeCloseHandler"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="550px">

      <div>
        <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="所属校区" prop="campusId">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="ruleForm.campusId" placeholder="请选择校区">
                <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="院系名称" prop="name">
            <el-col :span="22">
              <el-input v-model="ruleForm.name" maxlength='30'></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="负责人">
            <el-col :span="22">
              <el-select clearable
                         style="width: 100%"
                         v-model="ruleForm.auditor"
                         @change="changeSelect"
                         filterable
                         value-key="value"
                         :multiple-limit=1
                         remote
                         placeholder="请输入负责人"
                         :remote-method="remoteMethod"
              >
                <el-option
                  v-for="item in options4"
                  :key="item.id"
                  :label="item.name +' - '+ item.code"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
            <el-button v-if="!ruleForm.id" type="primary" @click="submitForm('ruleForm',2)">确定</el-button>
          </el-form-item>
        </el-form>
      </div>

    </el-dialog>

    <el-dialog
      title="编辑院系" @close="beforeCloseHandler"
      :visible.sync="editor"
      :close-on-click-modal="false"
      width="550px">

      <div>
        <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="所属校区" prop="campusId">
            <el-col :span="22">
              <el-select style="width:100%" v-model="ruleForm.campusId" placeholder="请选择学校">
                <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="院系名称" prop="name">
            <el-col :span="22">
              <el-input v-model="ruleForm.name" maxlength='30'></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="负责人">
            <el-col :span="22">
              <el-select clearable
                         style="width: 100%"
                         v-model="ruleForm.auditor"
                         @change="changeSelect"
                         filterable
                         value-key="value"
                         :multiple-limit=1
                         remote
                         placeholder="请输入负责人"
                         :remote-method="remoteMethod"
              >

                <el-option
                  v-for="item in options4"
                  :key="item.id"
                  :label="item.name +' - '+ item.code"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="editor = false">取 消</el-button>
            <el-button v-if="ruleForm.id" type="primary" @click="submitForm('ruleForm',1)">修改</el-button>
          </el-form-item>
        </el-form>
      </div>

    </el-dialog>

    <div class="main-header" v-if="$root.ItemData && $root.ItemData.length && $root.ItemData.length == 1">
      <span class="main-title" 院系管理></span>

    </div>
    <div class="search-box">
     <span style="float:left;">
			<el-form size="mini" :inline="true" class="demo-form-inline">
				<el-form-item label="校区">
					<el-select clearable v-model="params.campus" placeholder="请选择校区">
						<el-option v-for="option in options" :key="option.id" :label="option.name" :value="option.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="院系名称">
					<el-input v-model="params.name" placeholder="请输入院系名称搜索"></el-input>
				</el-form-item>
		<el-form-item label="负责人">
					<el-select v-model="params.fuzeren" placeholder="请选择负责人">
						<el-option v-for="option in optionfzr" :key="option.id" :label="option.name" :value="option.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="mini" type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
    </span>
      <span style="float:right;">
					<el-button v-perms="'/student/college/add'" @click="dialogVisible = true" type="increase"
                     size="mini">添加院系</el-button>
          <el-button v-perms="'/student/college/import'" type="primary" size="mini"
                     @click="dialogImportCollegeVisible = true">导入</el-button>
			</span>
    </div>
    <div class="main-body">
      <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="名称" width="240"></el-table-column>
        <el-table-column prop="campusName" label="所属校区">
          <template slot-scope="scope">
            <span>{{scope.row.campusName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="majorCount" label="专业数" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.majorCount}}个</span>
          </template>
        </el-table-column>
        <el-table-column prop="classCount" label="班级数" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.classCount}}个</span>
          </template>
        </el-table-column>
        <el-table-column prop="studentCount" label="学生数" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.studentCount}}人</span>
          </template>
        </el-table-column>
        <el-table-column prop="auditor" label="负责人" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.auditor">{{scope.row.auditor}}</span>
            <span v-else style="color:red">暂无设置</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="partyCount" label="党员总数"  align="center">
          <template slot-scope="scope">
             <span >{{scope.row.partyCount}}人</span>
           </template>
        </el-table-column>
        <el-table-column prop="groupCount" label="团员总数"  align="center">
          <template slot-scope="scope">
             <span >{{scope.row.groupCount}}人</span>
           </template>
        </el-table-column>
        </el-table-column>
        <el-table-column prop="studentCount" label="学生总数" align="center">
            <template slot-scope="scope">
               <span >{{scope.row.studentCount}}人</span>
             </template>
        </el-table-column> -->
        <!--          </el-table-column>-->
        <el-table-column label="操作" width="220" align="center">
          <div slot-scope="scope">
            <!-- 可转载站点功能未完成 -->
            <el-button type="text" class="opreat-btn" @click="modify(scope.row)" v-perms="'/student/college/edit'">编辑
            </el-button>
            <el-button @click='deleteCampus(scope.row)' v-perms="'/student/college/delete'" size="mini" type="text">删除
            </el-button>
            <!--<el-button type="text" class="opreat-btn" @click.native="exportFile(scope.row.id)" v-perms="'/student/college/export'">导出学生</el-button>-->
            <!-- <el-button type="text" class="opreat-btn" @click.native="deleteBatch($api.siteDelete,scope.row.id)">删除</el-button> -->
          </div>
        </el-table-column>
      </el-table>
      <qu-pagination :total="total" @change="changePage"></qu-pagination>
    </div>
  </section>
</template>
<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        optionfzr: [
          {id: '', name: '全部'},
          {id: 1, name: '已完成'},
          {id: 2, name: '未完成'},
        ],
        activeName: '',
        fileListName: '',
        fileList: [],
        options4: [],
        editor: false,
        loading: false,
        tabsList: ['/student/campus', '/student/college', '/student/major', '/student/class', '/student/list'],
        dialogVisible: false,
        schools: [{id: 0, name: localStorage.getItem("schoolName")}],
        params: {
          current: 0,
          size: 10,
          campus: '',
          name: '',
          fuzeren: ''
        },
        showfileInfor: false,
        fileInforamtion: {},
        randomData: "",
        dialogImportCollegeVisible: false,
        showProgress: false,
        fileUploadPercent: 0,
        showfileInforDetail: false,
        clickAble: true,
        data: [],
        total: 0,
        ruleForm: {
          id: '',
          name: '',
          campusId: '',
          auditor: ''
        },
        rules: {
          name: [{
            required: true,
            message: '请填写院系名称',
            trigger: 'blur'
          }
          ],
          campusId: [{
            required: true,
            message: '请选择所属校区',
            trigger: 'blur'
          }],
          auditor: [{
            required: true,
            message: '请填写负责人',
            trigger: 'blur'
          }]
        },
        options: [{id: 0, name: localStorage.getItem("schoolName")}]
      }
    },
    methods: {
      goTab() {
        const that = this;
        this.$router.push({path: that.tabsList[parseInt(that.activeName)], query: {type: that.activeName}});
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
          url: 'school/fail/college/export',
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
          link.setAttribute('download', '院系失败信息' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })

      },
      deleteCampus(item) {
        this.$confirm('是否确定删除该院系?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http.post('/school/colleges/delete', {
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
      exportFile(id) {
        this.$http.get("/school/college/export/student", {
          params: {
            id: id
          }
        }).then(res => {
        })
      },
      modify(row) {
        this.editor = true;
        console.log(row)
        if (row) {
          this.ruleForm.id = row.id;
          this.ruleForm.name = row.name;
          this.ruleForm.campusId = row.campusId ? row.campusId : '';

          this.remoteMethod2(row.auditor)

        }
      },
      submitForm(formName, type) {

        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (type == 1) {
              this.$http.post('/school/college/modify', this.ruleForm).then((res) => {

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
              this.$http.post('/school/college/add', this.ruleForm).then((res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.dialogVisible = false;
                  this.fetch();
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
      beforeCloseHandler() {
        this.resetForm('ruleForm');
        this.ruleForm = {
          id: '',
          name: '',
          campus: ''
        }
      },
      getOptions() {
        this.$http.get('/school/all/campus').then(res => {
          this.options = res.data
          this.schools = res.data
          // this.options = this.options.concat(res.data)
          // if(res.data && res.data.length){
          //   this.schools = res.data
          // }else{
          //   this.schools = this.schools.concat(res.data)
          // }
        })
      },
      fetch() {
        this.loading = true
        this.$http.get('/school/colleges', {params: this.params}).then(res => {
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
      changeSelect(value) {
        if (value) {
          this.placeholder = ""
        }
      },
      //远程搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;

          this.$http.get("/school/students/NoPage", {
            params: {
              key: query
            }
          }).then(res => {


            this.loading = false;
            this.options4 = res.data

          })

        } else {
          this.options4 = [];
        }
      },
      remoteMethod2(query) {
        if (query !== '') {
          this.loading = true;

          this.$http.get("/school/students/NoPage", {
            params: {
              key: query
            }
          }).then(res => {


            this.loading = false;
            this.options4 = res.data
            this.ruleForm.auditor=res.data[0].id

          })

        } else {
          this.options4 = [];
        }
      }
    },
    created() {
      const that = this;
      that.activeName = that.$route.query.type;
      that.getOptions()
      that.fetch()
    },
    mounted() {

    }
  }
</script>
<style>

</style>

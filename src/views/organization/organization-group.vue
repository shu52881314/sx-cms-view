<template>
  <section>

    <!--<el-dialog title="批量导入"-->
               <!--:visible.sync='dialogImportCollegeVisible'-->
               <!--@close="beforeCloseImportCollegeHandler"-->
               <!--:close-on-click-modal="false"-->
               <!--width='650px' id="dialogOrange">-->
      <!--<div>-->

        <!--<div v-show="!showfileInfor">-->

          <!--<div class="uploadLocal" v-show="fileList.length">-->
            <!--<div class="uploadLocal-circel">-->
              <!--<p style="padding-top:57px;"><img src="../../assets/images/upload_two@2x.png" style="width:70px;"></p>-->
              <!--<p style="padding-top:10px;font-size:14px;color:#333;">{{fileListName}}</p>-->
            <!--</div>-->
            <!--<div class="uploadLocal-btn">-->
              <!--<button class="uploadLocal-btnReset" @click="resetUpload">重新上传</button>-->
              <!--<button class="uploadLocal-btnSubmit" @click="submitUpload">确认导入</button>-->
            <!--</div>-->
          <!--</div>-->

          <!--<el-form v-show="!fileList.length" size='mini' label-width='12px'>-->
            <!--<div class="importTipsTitle">-->
                  <!--<span class="importTipsTitle-left">-->
                     <!--请下载导入模板，按格式修改后导入-->
                  <!--</span>-->
              <!--<span class="importTipsTitle-right">-->
                    <!--<a class="el-button el-button&#45;&#45;text el-button&#45;&#45;mini" download="" href='/static/tpls/团组织模板.xlsx'-->
                       <!--size='mini'><i class='el-icon-question'></i>模板下载</a>-->
                  <!--</span>-->
            <!--</div>-->
            <!--<el-form-item label="" prop="name">-->
              <!--<el-col :span="22">-->
                <!--<upload-file-->
                  <!--ref="childUpload"-->
                  <!--uploadUrl="/school/group/import"-->
                  <!--uploadType=".xls,.xlsx"-->
                  <!--uploadSzie="100"-->
                  <!--uploadSzieTips="只能上传xlx/xlsx文件，且不超过100MB!"-->
                  <!--@fileInfor="openfileInfor"-->
                  <!--@setFileList="setFileList"-->
                <!--&gt;-->
                <!--</upload-file>-->
              <!--</el-col>-->
            <!--</el-form-item>-->
          <!--</el-form>-->

        <!--</div>-->
        <!--<div class="progress-line" v-if="showProgress ">-->
          <!--<el-progress :stroke-width="18" :percentage="fileUploadPercent" style="margin-top:30px;"></el-progress>-->
          <!--<p style="text-align: center;padding: 20px 0px 10px;">正在上传，请您耐心等待...</p>-->
          <!--<span style="display: block; text-align: center; font-size: 13px; color: #999">请勿关闭浏览窗口</span>-->
        <!--</div>-->
        <!--<div class="importFail" v-show="showfileInforDetail  && fileInforamtion.total != fileInforamtion.success">-->
          <!--<div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_fail@2x.png'></div>-->
          <!--<div class="importFail-tips">-->
            <!--<span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功，<span style="color:#FFC600;">{{fileInforamtion.failed}}</span>条导入失败-->
            <!--<span @click="downFailed()" style="cursor:pointer;color:#4D98FF" v-if="fileInforamtion.failed">下载失败列表</span>-->
          <!--</div>-->
          <!--<div class="uploadLocal-btn">-->
            <!--<button class="uploadLocal-btnReset" @click="resetUpload">重新导入</button>-->
          <!--</div>-->
        <!--</div>-->

        <!--<div class="importSuccess" v-show="showfileInforDetail && fileInforamtion.total == fileInforamtion.success">-->
          <!--<div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_success@2x.png'></div>-->
          <!--<div class="importFail-tips">-->
            <!--<span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功-->
          <!--</div>-->
          <!--<div class="uploadLocal-btn">-->
            <!--<button class="uploadLocal-btnReset" @click="resetUpload">继续导入</button>-->
          <!--</div>-->
        <!--</div>-->


      <!--</div>-->
    <!--</el-dialog>-->
    <div class="main-header">
      <span class="main-title">班团组织列表</span>
      <div class="main-btn-box">
       <!-- <el-button type="increase" size="mini" @click="routerLink('group/edit', 'update', 0,'',4)"
                   v-perms="'/organization/group/add'">添加
        </el-button>-->
        <!--<el-button type="primary" size="mini" @click="dialogImportCollegeVisible = true"-->
                   <!--v-perms="'/organization/group/add'">导入-->
        <!--</el-button>-->
      </div>
    </div>
    <div class="search-box">
      <el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item label="校区：">
          <el-select @change="changeSchool" clearable style="width:100%" v-model="params.campusId"
                     placeholder="请选择校区">
            <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="院系：">
          <el-select ref="department" @change="changeDepartment" clearable v-model="params.collegeId"
                     placeholder="请选择院系">
            <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业：">
          <el-select clearable v-model="params.majorId" placeholder="请选择专业">
            <el-option v-for="item in majors" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级：">
          <el-select clearable v-model="params.gradeId" placeholder="请选择年级">
            <el-option v-for="item in grades" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="班团名称">
          <el-input style="width:180px;" v-model="params.organizationName" clearable maxlength=30
                    placeholder="请输入名称搜索"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-body">
      <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
        <el-table-column prop="name" label="团组织名称"></el-table-column>
        <el-table-column prop="campusName" label="所属校区" align="center"></el-table-column>
        <el-table-column prop="collegeName" label="所属院系" align="center"></el-table-column>
        <el-table-column prop="majorName" label="所属专业" align="center"></el-table-column>
        <el-table-column prop="grade" label="所属年级" align="center"></el-table-column>
        <el-table-column prop="parentName" label="上级机构" align="center"></el-table-column>
        <el-table-column prop="fuzeName" label="班团负责人" align="center"></el-table-column>
        <el-table-column prop="coachName" label="辅导员" align="center"></el-table-column>

        <el-table-column prop="partyCount" label="人数" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.partyCount}}人</span>
          </template>
        </el-table-column>
        <el-table-column prop="actCount" label="活动数" align="center"></el-table-column>
        <el-table-column prop="energy" label="活力值" align="center"></el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <div slot-scope="scope">
            <!-- 可转载站点功能未完成 -->
            <el-button type="text" class="opreat-btn"
                       @click.native="routerLink('group/edit','update',scope.row.id,'',4)"
                       v-perms="'/organization/group/edit'">编辑
            </el-button>
            <el-button type="text" class="opreat-btn"
                       @click.native="routerLink('group/details', 'view', scope.row.id,{classId:scope.row.classId},4)"
                       v-perms="'/organization/group/details'">详情
            </el-button>
            <!--<el-button type="text" class="opreat-btn" v-if="scope.row.isdelorganization=='0'"-->
                       <!--@click="deleteGroup(scope.row.id,scope.row.identity)">删除-->
            <!--</el-button>-->
            <!--<el-button type="text" class="opreat-btn colorGray"-->
                       <!--v-if="scope.row.isdelorganization=='1'||scope.row.isdelorganization=='2'||scope.row.isdelorganization=='3'"-->
                       <!--:title="scope.row.msg_3">删除-->
            <!--</el-button>-->
            <!--              v-perms="'/organization/group/delete'"-->
          </div>
        </el-table-column>
      </el-table>
      <qu-pagination :total="total" @change="changePage"></qu-pagination>
    </div>
  </section>
</template>
<script>
  import axios from 'axios'
  import {levels} from '@/dict'

  export default {
    data() {
      return {
        fileListName: '',
        fileList: [],
        schools: [],//校区
        departments: [],//院系
        majors: [],//专业
        grades: [],//班级
        randomData: "",
        loading: false,
        params: {
          current: 1,
          size: 10,
          organizationName: '',
          status: '',
          gradeId: '',
          majorId: '',
          collegeId: '',
          campusId: ''
        },
        levels: levels,
        data: [],
        total: 0,
        showfileInfor: false,
        fileInforamtion: {},
        dialogImportCollegeVisible: false,
        isDelete: true,
        deleteInfo: '',
        showProgress: false,
        fileUploadPercent: 0,
        showfileInforDetail: false,
        clickAble: true,
      }
    },
    methods: {
      getCampus() {//获取校区
        this.$http.get('/school/all/campus').then(res => {
          this.schools = res.data
        })
      },
      changeDepartment(value) {
        this.params.majorId = ''
        if (value) {
          this.$http.get('/school/all/major/cascader', {params: {collegeId: value}}).then(res => {
            this.majors = res.data
          })
        } else {
          this.majors = null
        }
      },
      changeSchool(value) {
        this.params.collegeId = '';
        this.params.majorId = '';
        if (value) {
          this.$http.get('/school/all/college/cascader', {params: {campusId: value}}).then(res => {
            this.departments = res.data
          })
        } else {
          this.departments = [];
        }
      },
      deleteGroup(id, identityId) {
        this.$confirm('是否删除该团组织?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/organization/party/delete', {
            organizationId: id,
            identityId: identityId
          }).then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.fetch();
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
          url: 'school/fail/party/club/export',
          responseType: 'blob',
          data: {
            randomData: this.randomData,
            nature: 4
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
          link.setAttribute('download', '团组织失败信息' + '.xlsx')
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
        this.showProgress = false
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
      fetch() {
        this.loading = true
        this.$http.get('/organization/party/list', {params: this.params}).then(res => {
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
      }, getGrades() {
        this.$http.get('/school/grade/partake/list').then(res => {
          this.grades = res.data
        })
      }
    },
    created() {
      this.fetch()
      this.getCampus();
      this.getGrades();
    },
    mounted() {

    }
  }
</script>
<style scoped>
  .colorRed {
    color: red;
  }

  .colorGray {
    color: gray;
  }
</style>

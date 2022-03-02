<template>
  <div>
    <back></back>
    <div class="main-header">
      <span class="main-title">奖项详情</span>
    </div>

    <el-dialog title="学生详情" :visible.sync='dialogStudentCollegeVisible' :close-on-click-modal="false" width='750px'>
      <div>
        <div class="studentShow">
          <img :src="getPersonalInf.avatar" class="studentShow-avatar">
          <div class="studentShow-right">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="left" valign="middle">姓名：{{getPersonalInf.userName}}</td>
                <td align="left" valign="middle">专业：{{getPersonalInf.majorName}}</td>
              </tr>
              <tr>
                <td align="left" valign="middle">学号：{{getPersonalInf.code}}</td>
                <td align="left" valign="middle">班级：{{getPersonalInf.className}}</td>
              </tr>
              <tr>
                <td align="left" valign="middle">院系：{{getPersonalInf.collegeName}}</td>
                <td align="left" valign="middle">年级：{{getPersonalInf.grade}}</td>
              </tr>
            </table>
          </div>
        </div>

        <div style='font-size:14px;color:#333;border-bottom:1px solid #dedede;padding-top:20px;padding-bottom:10px;'>
          获奖记录
        </div>

        <el-table :data="Historydata" stripe size="mini" style="width: 100%">
          <el-table-column prop="projectName" label="项目名称" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="optionName" label="奖项名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="type" label="类型" show-overflow-tooltip>
            <div slot-scope="scope">
              {{scope.row.type == 1 ? "自主申请" : (scope.row.type == 2 ? "后台导入" : "其他")}}
            </div>
          </el-table-column>
          <el-table-column prop="hours" label="发放学时" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ctime" label="发放时间" align="left">
            <div slot-scope="scope">
              {{scope.row.ctime | formatDate}}
            </div>
          </el-table-column>

        </el-table>


      </div>
    </el-dialog>


    <el-dialog title="批量导入" :visible.sync='dialogImportCollegeVisible' @close="beforeCloseImportCollegeHandler"
               :close-on-click-modal="false" width='650px' id="dialogOrange">
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
												<a class="el-button el-button--text el-button--mini"
                           href='https://2room.oss-cn-beijing.aliyuncs.com/template/%E5%AF%BC%E5%85%A5%E9%A1%B9%E7%9B%AE%E8%8E%B7%E5%A5%96%E5%AD%A6%E7%94%9F.xlsx'
                           size='mini'>模板下载</a>
		                  </span>
            </div>
            <el-form-item label="" prop="name">
              <el-col :span="22">
                <upload-file ref="childUpload" uploadUrl="/school/hours/apply/import" uploadType=".xls,.xlsx"
                             uploadSzie="100" uploadSzieTips="只能上传xlx/xlsx文件，且不超过100MB!" @fileInfor="openfileInfor"
                             :dataObj="dataObj2" v-on:childByValue='ishaveFile' @setFileList="setFileList">
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


    <div class="main-body">
      <el-form size="mini" label-position="left">
        <el-form-item label="获奖名称：">
          {{data.name}}
        </el-form-item>
        <el-form-item :label="'奖项'+hoursUnit+'：'">
          {{data.score}}
        </el-form-item>
        <el-form-item label="所属项目名称：">
          {{data.proName}}
        </el-form-item>
        <el-form-item label="所属项目分类：">
          {{data.proClassName}}
        </el-form-item>
      </el-form>
    </div>
    <div>

      <div class="main-header">
        <span class="main-title">获奖学生</span>
      </div>

      <div class="search-box">

      <span style="float:left;">
				<el-form size="mini" :inline="true" class="demo-form-inline">
					<el-form-item label="学生">
						<el-input v-model="params.keyWord" placeholder="请输入姓名/学号搜索"></el-input>
					</el-form-item>
          <!-- <el-form-item label="奖项名称">
            <el-select v-model="params.prizeName" placeholder="请选择奖项">
              <el-option v-for="option in options" :key="option.id" :label="option.name" :value="option.id"></el-option>
            </el-select>
          </el-form-item> -->
					<el-form-item label="发放时间">
						<el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              @change='dateChange'>
					    </el-date-picker>
					</el-form-item>

					<el-form-item>
						<el-button size="mini" type="primary" @click='initDataList(1)'>查询</el-button>
					</el-form-item>
				</el-form>
      </span>

        <!--      <span style="float:right">-->
        <!--       <el-button size="mini" type="primary" @click="dialogImportCollegeVisible = true">批量导入</el-button>-->
        <!--      </span>-->

      </div>
      <el-table v-loading="loading" :data="initDataLists" stripe size="mini" style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column prop="userName" label="申请人姓名"></el-table-column>
        <el-table-column prop="code" label="学号"></el-table-column>
<!--        <el-table-column prop="optionName" label="奖项" show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="hours" :label="'发放'+hoursUnit"></el-table-column>
        <el-table-column prop="userName" label="发放时间">
          <template slot-scope='scope'>
            <span>{{scope.row.ctime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="类型">
          <template slot-scope='scope'>
            <span>{{scope.row.TYPE == 1 ? "自主申请" : (scope.row.TYPE == 2 ? "后台导入" : "其他")}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="奖项申请时间">
          <template slot-scope='scope'>
            <span v-if="scope.row.awardsApplyTime">{{scope.row.awardsApplyTime| formatDate }}</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column prop="auditor" label="审核人"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!--<el-button type="text" class="opreat-btn" @click.native="getPersonal(scope.row.userId)">详情</el-button>-->
            <el-button type="text" class="opreat-btn" @click.native="deletes(scope.row)"
                       v-perms="'/communist/project/edit'">删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <div style="padding-top: 20px;">
        <div style="float: left;">
          <el-button type="text" class="opreat-btn" @click='deletespl()' >批量删除(只删除本页选中获奖人)
          </el-button>
        </div>
        <qu-pagination :total="total" @change="changePage"></qu-pagination>

      </div>


      <!-- <div class="main-header" style="padding-top:20px;">
        <span class="main-title">奖项列表</span>
      </div>

      <el-table :data="optionsList" stripe size="mini" style="width: 100%;padding-top:20px;">

        <el-table-column type="index" width="55" label="序号"> </el-table-column>
        <el-table-column prop="name" label="奖项名称"></el-table-column>
        <el-table-column prop="hours" :label="'奖项'+hoursUnit"></el-table-column>
        <el-table-column prop="applyCount" label="申请人数"></el-table-column>
        <el-table-column prop="getCount" label="获奖人数"></el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
                     <el-button type="text" class="opreat-btn" @click.native="routerLink('apply/detail','detail',scope.row.id)" v-perms="'/communist/project/edit'">详情</el-button>
          </template>
        </el-table-column>
      </el-table> -->

    </div>
  </div>
</template>

<script>
  import {formatDate} from '@/utils/filters'
  import axios from 'axios'

  export default {
    data() {
      return {
        dialogStudentCollegeVisible: false,
        fileListName: '',
        fileList: [],
        optionsList: [],
        Historydata: [],
        randomData: "",
        ishaveFile3: true,
        ishaveFile2: '',
        hoursUnit: localStorage.getItem("hoursUnit"),
        applyIds: '',
        dataObj2: {
          optionId: this.$route.query.id
        },
        data: '',
        dialogImportCollegeVisible: false,
        date: [],
        showfileInfor: false,
        fileInforamtion: {},
        getPersonalInf: {},
        loading: true,
        params: {
          optionId: this.$route.query.id,
          current: 1,
          size: 10,
          keyWord: '',
          startTime: '',
          endTime: '',
        },
        initDataLists: [],
        total: 0,
        options: [],
        showProgress: false,
        fileUploadPercent: 0,
        showfileInforDetail: false,
        clickAble: true,

      }
    },
    mounted() {
      this.initData()
      // this.systemClassifys()
      this.initDataList()
    },
    methods: {
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
      //个人详情
      getPersonal(id) {

        this.$http.get("/school/student/info", {params: {userId: id}}).then((res) => {
          if (res.code == '200') {
            this.getPersonalInf = res.data
            this.dialogStudentCollegeVisible = true
          }

        })

       /* this.$http.get("/project/batanin-user/record", {params: {userId: id}}).then((res) => {
          if (res.code == '200') {
            this.Historydata = res.data
          }

        })*/

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
          url: 'school/fail/hours/apply/export',
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
          link.setAttribute('download', '自主申报成员失败信息' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })

      },
      ishaveFile(val) {
        if (this.ishaveFile2 == '') {
          this.ishaveFile2 = val
        }
        if (this.ishaveFile2 != val) {
          this.ishaveFile2 = val
          this.ishaveFile3 = true
        }
      },
      initDataList(type) {
        var that = this
        if (type) {
          that.params.current = 1
        }

        that.$http.get("/project/option/record", {
          params: that.params
        }).then((res) => {
          if (res.code == '200') {
            that.total = res.data.total
            that.initDataLists = res.data.list
            that.loading = false

          } else {
            that.$message({
              type: 'error',
              message: res.msg
            });
          }
        }).catch(() => {
        });
      },
      initData() {
        var that = this
        that.$http.get("/project/option/details", {
          params: {
            optionId: this.$route.query.id
          }
        }).then((res) => {
          if (res.code == '200') {
            that.data = res.data
          } else {
            that.$message({
              type: 'error',
              message: res.msg
            });
          }
        }).catch(() => {
        });
      },
      deletes(item) {

        let that=this
       var list=[]
        list.push(item)
        this.$confirm('是否确定删除此获奖人?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http.post("/project-apply/deleteApply", {list:list}).then((res) => {
            if (res.code == '200') {
              that.$message({
                type: 'success',
                message: '删除成功'
              });
              that.loading = true
              that.initDataLists = []
              that.applyIds = []
              that.initDataList()
            } else {
              that.$message({
                type: 'error',
                message: res.msg
              });
            }
          }).catch(() => {
          });
        })

      },
      deletespl() {

        let that=this

        if (that.applyIds.length>0){
          this.$confirm('是否确定删除所选获奖人?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.$http.post("/project-apply/deleteApply", { list:that.applyIds}).then((res) => {
              if (res.code == '200') {
                that.$message({
                  type: 'success',
                  message: '删除成功'
                });
                that.loading = true
                that.initDataLists = []
                that.applyIds = []
                that.initDataList()
              } else {
                that.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            }).catch(() => {
            });
          })
        }else {
          that.$message({
                    type: 'warning',
                    message: '至少选择一项'
                  });
          return
        };



      },
      dateChange(value) {
        if (value) {
          this.params.startTime = value[0]
          if (value[1]) {
            this.params.endTime = value[1] + 86399000;
          }
        } else {
          this.params.startTime = ''
          this.params.endTime = ''
        }

      },
      systemClassifys() {
        var that = this
        that.$http.get("/project/classify/options", {
          params: {
            projectId: this.$route.query.id
          }
        }).then((res) => {
          if (res.code == '200') {
            this.optionsList = res.data
            // that.options = res.data
            // that.options.unshift({name:'不限',id:''})

          } else {
            that.$message({
              type: 'error',
              message: res.msg
            });
          }
        }).catch(() => {
        });


      },
      beforeCloseImportCollegeHandler() {
        this.fileList = []
        this.showfileInfor = false
        this.dialogImportCollegeVisible = false;
        this.$refs.childUpload.closeUpload();
        this.showfileInfor = false
        this.ishaveFile2 = ''
        this.ishaveFile3 = true
        this.$store.commit('setClick', false)
        this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.showfileInforDetail = false
        this.clickAble = true

      },
      submitUpload() {
        if (this.clickAble) {
          this.setProgress()
          this.$store.commit('setClick', true)
          this.$refs.childUpload.submitUpload2()
          this.ishaveFile3 = false
        } else {
          this.$message({
            type: 'error',
            message: '请重新上传文件'
          });
          return;
        }

      },
      openfileInfor(res) {
        if (res != false) {
          this.randomData = res.randomData
          this.showfileInfor = true
          this.fileInforamtion = res
          this.initDataList()
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

        // this.randomData = res.randomData
        // var that = this
        //   	that.showfileInfor = true
        //   	that.fileInforamtion = res
        //   	if(res.failed == 0){
        //   		that.dialogImportCollegeVisible = false;
        // 		that.loading=true
        // 		that.initDataLists = []
        //   		that.initDataList()
        //   		that.$message({
        //         		type: 'success',
        //         		message: '导入成功'
        //       	});
        //   	}
        //	           	this.dialogImportCollegeVisible = false;
      },
      changePage(current, size) {
        this.loading = true
        this.initDataLists = []
        this.params.current = current
        this.params.size = size
        this.initDataList()
      },
      handleSelectionChange(val) {
        this.applyIds = val;
      },
    },
    filters: {
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

<style scoped>
  .studentShow {
    width: 100%;
    overflow: hidden;
  }

  .studentShow-avatar {
    float: left;
    width: 50px;
    height: 50px;
    border-radius: 50px;
  }

  .studentShow-right {
    margin-left: 70px;
    font-size: 14px;
    line-height: 24px;
  }

  .optionListTitle {
    padding-top: 20px;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 10px;
    width: 100%;
    overflow: hidden;
    font-size: 14px;
    color: #333;
  }
</style>

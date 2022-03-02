<template>
  <div>
    <a class="cms-back" href="javascript:void(0)" @click="goBack()"></a>
    <!--  <back :page="$route.query.nature" goRouter="/communist/project"></back>-->
    <div class="main-header">
      <span class="main-title">基本信息</span>
    </div>


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
							<a class="el-button el-button--text el-button--mini" download="" href='/static/tpls/获奖学生模板.xlsx'
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
        <el-form-item label="项目名称：">
          {{data.name}}
        </el-form-item>
        <el-form-item label="项目分类：">
          {{data.className}}
        </el-form-item>
        <el-form-item :label="hoursUnit+'是否累加：'">
          {{data.scoreSummation ? '是':'否'}}
        </el-form-item>
        <el-form-item :label="'可获得最高'+hoursUnit+'：'">
          {{data.scoreMax}}
        </el-form-item>

        <el-form-item label="奖项有效期：">
          {{data.awardsValid |awardsValidFmt}}
        </el-form-item>

      </el-form>
    </div>
    <div>
      <!-- <div class="search-box">
          <el-form size="mini" :inline="true" class="demo-form-inline">
            <el-form-item label="获奖人">
              <el-input v-model="params.keyWord"  maxlength=30 placeholder="请输入姓名/学号搜索"></el-input>
            </el-form-item>
            <el-form-item label="奖项名称">
              <el-select v-model="params.prizeName" placeholder="请选择奖项">
                <el-option v-for="option in options" :key="option.id" :label="option.name" :value="option.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择日期">
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
        </div>
        <el-table v-loading="loading" :data="initDataLists" stripe size="mini" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column type="index" width="55" label="序号"> </el-table-column>
                <el-table-column prop="userName" label="姓名"></el-table-column>
                <el-table-column prop="userCode" label="学号"></el-table-column>
                <el-table-column prop="optionName" label="奖项" show-overflow-tooltip></el-table-column>
                <el-table-column prop="hours" :label="hoursUnit"></el-table-column>
                <el-table-column prop="userName" :label="'发放'+hoursUnit+'时间'">
                  <template slot-scope='scope'>
                    <span>{{scope.row.time|formatDate()}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
                <el-table-column  label="操作" width="200">
                  <template slot-scope="scope">
                      <el-button type="text" class="opreat-btn" @click.native="routerLink('apply/detail','detail',scope.row.id)" v-perms="'/communist/project/edit'">详情</el-button>
                      <el-button type="text" class="opreat-btn" @click.native="deletes(scope.row.id)" v-perms="'/communist/project/edit'">删除</el-button>
                      </template>
              </el-table-column>

        </el-table>
        <div style="padding-top: 20px;">
          <div style="float: left;"><el-button type="text" class="opreat-btn" @click='deletes()' v-if='applyIds.length'>批量删除(只删除本页选中获奖人)</el-button></div>
          <qu-pagination :total="total" @change="changePage"></qu-pagination>

        </div> -->


      <div class="main-header" style="padding-top:20px;">
        <div class="xinxitou" style="overflow: hidden">
          奖项信息
        <div class="main-btn-box">
          <el-button type="primary" size="mini" @click="dialogImportCollegeVisible=true">批量导入获奖人信息</el-button>
        </div>
        </div>
      </div>

      <el-table :data="optionsList" stripe size="mini" style="width: 100%;padding-top:20px;">

        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column prop="name" label="奖项名称"></el-table-column>
        <el-table-column prop="hours" :label="'奖项'+hoursUnit"></el-table-column>
        <el-table-column prop="applyNum" label="申请人数"></el-table-column>
        <el-table-column prop="passNum" label="获奖人数"></el-table-column>
       
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" class="opreat-btn"
                       @click.native="routerLink('/communist/projectList/detail?projectId=' + params.projectId,'detail',scope.row.id)">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-row class="main-header" style="padding-top:20px;">
          <span class="main-title">填写说明：</span>
          <el-row style="margin-left: 5rem;margin-top: 1rem">
            {{data.explain ? data.explain : '暂未填写说明'}}
          </el-row>
        </el-row>
      </el-row>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        fileListName: '',
        fileList: [],
        optionsList: [],
        randomData: "",
        ishaveFile3: true,
        ishaveFile2: '',
        hoursUnit: localStorage.getItem("hoursUnit"),
        applyIds: '',
        dataObj2: {
          projectId: this.$route.query.id
        },
        data: '',
        date: [],
        dialogImportCollegeVisible: false,
        showfileInfor: false,
        fileInforamtion: {},
        loading: true,
        params: {
          projectId: this.$route.query.id,
          current: 1,
          size: 10,
          prizeName: '',
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
      }
    },
    filters: {
      awardsValidFmt(val) {
        switch (val) {
          case 1:
            return '每学期';
          case 2:
            return '每学年';
          case 3:
            return '在校期';
        }
      },
      formatSourceType(val) {
        var sourceTypeName = ''
        switch (val) {
          case 1:
            sourceTypeName = '指定人员'
            break
          case 2:
            sourceTypeName = '负责人'
            break
          case 3:
            sourceTypeName = '管理员'
            break
          case 4:
            sourceTypeName = '负责人或管理员'
            break
        }
        return sourceTypeName
      },
      formatLimitType(limitType) {
        if (limitType == 0) {
          limitType = '无'
        } else if (limitType == 1) {
          limitType = localStorage.getItem("compulsoryName")
        } else if (limitType == 2) {
          limitType = localStorage.getItem("electiveName");
        }
        return limitType;
      },
      formatSum(val) {
        if (val == 0) {
          val = '不累加'
        } else if (val == 1) {
          val = '累加'
        }
      },
      formatAwards(val) {
        if (val == 1) {
          val = '每学期'
        } else if (val == 2) {
          val = '每学年'
        } else {
          val = '在校期'
        }
      }
    },
    mounted() {
      this.initData()
      //this.systemClassifys()
      // this.initDataList()
    },
    methods: {
      goBack() {
        this.$router.push({
          path: '/communist/project',
          query: {...this.$route.query}
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

        that.$http.get("/project-apply/", {
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
        that.$http.get("/project/details", {
          params: {
            projectId: this.$route.query.id
          }
        }).then((res) => {
          if (res.code == '200') {
            that.data = res.data
            this.optionsList = res.data.options;
          } else {
            that.$message({
              type: 'error',
              message: res.msg
            });
          }
        }).catch(() => {
        });
      },
      deletes(id) {
        var that = this
        let list = []
        if (id) {
          list.push(id)
        } else {
          for (var i = 0; i < this.applyIds.length; i++) {
            list.push(this.applyIds[i].id)
          }
        }
        if (!list.length) {
          return
        }
        this.$confirm('是否确定删除' + list.length + '名获奖人?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http.post("/project-apply/deleteApply", {
            applyIds: list.join(',')
          }).then((res) => {
            if (res.code == '200') {
              that.$message({
                type: 'success',
                message: '删除成功'
              });
              that.loading = true
              that.initDataLists = []
              that.applyIds = []
              //that.initDataList()
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

      }
,
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
      },
      submitUpload() {
        this.setProgress()
        this.$store.commit('setClick', true)
        this.$refs.childUpload.submitUpload2()
        this.ishaveFile3 = false
      },
      openfileInfor(res) {
        if (res != false) {
          console.log(11)
          this.randomData = res.randomData
          this.showfileInfor = true
          this.fileInforamtion = res
          //this.initDataList()
        this.initData()
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
        //this.initDataList()
        //this.systemClassifys()
      },
      handleSelectionChange(val) {
        this.applyIds = val
      },
    }
  }
</script>

<style>
  .optionListTitle {
    padding-top: 20px;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 10px;
    width: 100%;
    overflow: hidden;
    font-size: 14px;
    color: #333;
  }
  .xinxitou {
    border-radius: 5px;
    padding: 8px;
    background: rgb(190, 224, 247);
    padding-left: 18px;
    margin-bottom: 15px;
  }
</style>

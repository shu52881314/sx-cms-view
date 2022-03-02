<template>
  <div>
    <el-dialog title="通过" :visible.sync="dialogVisible" :close-on-click-modal="false" width="500px">
      <el-form size="mini" label-width="60px" class="demo-ruleForm">
        <div id="" style="text-align: center;">
          <p>确定通过该奖项审核？</p>
          <p style="padding: 10px;">通过后该获奖人将获得
            <el-input v-model="ruleFormReject.hours" style='width: 80px;' maxlength='6'></el-input>
            {{hoursUnit}}
          </p>
          <el-button type="primary" @click="adopt()">确定</el-button>
        </div>

      </el-form>
    </el-dialog>

    <back :page="$route.query.nature" goRouter="/proceeding/wait/declare/first/auditing"></back>
    <div class="main-header">
      <span class="main-title">项目申请详情</span>
    </div>

    <div class="main-body content" style="margin: 10px;border: 1px #e4e4e4 solid;color: #000000;padding-bottom: 25px;">
      <div class='body-header'>
        申请信息
      </div>

      <div class="" style="border-bottom:1px solid #e4e4e4">

        <!-- 申请信息 -->
        <div class="body-part1">
          <div class="" style="padding-left: 7px;padding-right: 0px;">
            <img :src="data.avatar" alt="用户头像"
                 style="width:64px;height:64px;border-radius: 100%;border: 1px solid #ccc;">
          </div>
          <div class="">
            <span>姓名：{{data.userName}}</span><br/>
            <span>学号：{{data.code}}</span>
          </div>
          <div class="">
            <span>院系：{{data.collegeName}}</span><br/>
            <span>专业：{{data.majorName}}</span>
          </div>
          <div class="">
            <span>班级：{{data.className}}</span><br/>
            <span>年级：{{data.grade}}</span>
          </div>
          <div class="btn" @click="showMore()" v-if="data.record && data.record.length">
            {{txt}}&nbsp;<img :src="imageSrc" style="width:11px;"/>
          </div>
        </div>
        <!-- 历史获奖记录 -->
        <div class="body-part2" v-if="isShow">
          <div class="" v-for="item in data.record">
            <table border="0">
              <tr style='font-weight:bold;'>
                <td style="padding-left:7px">奖项名称</td>
                <td>类型</td>
                <td>发放学时</td>
                <td>发放时间</td>
                <td style="width:150px"></td>
              </tr>
              <tr>
                <td class="tdFrist" @click="openDetails(item.id,item.type)">{{item.name}}</td>
                <td>
                  {{item.type == 1 ? "自主申请" : (item.type == 2 ? "批量导入" : "其他")}}
                </td>
                <td>
                  <span>{{item.hours}}</span>
                </td>
                <!-- <td>{{item.startTime  | formatD}} - {{item.endTime  | formatD}}</td> -->
                <td v-if="item.grantTime">{{item.grantTime | formatDate}}</td>
                <td style="width:150px"></td>
              </tr>

            </table>
          </div>


        </div>


      </div>

      <div class="body-part3">
        <span style="float:right;color:#9932CC">

				</span>
        <el-form size="mini" label-position="left">
          <el-form-item label="奖项名称：">
            {{project.optionName}}
          </el-form-item>
          <el-form-item label="项目名称：">
            {{project.projectName}}
          </el-form-item>
          <el-form-item label="项目时间：">
            {{project.startTime | formatD}} - {{project.endTime | formatD}}
          </el-form-item>
          <el-form-item :label="'奖项'+hoursUnit+'：'">
            {{project.hours}}
          </el-form-item>

          <el-form-item label="项目分类：">
            {{project.className}}
          </el-form-item>

          <el-form-item label="提交时间：">
            {{project.applyTime | formatDate}}
          </el-form-item>

          <el-form-item label="项目总结：">
            {{project.report}}
          </el-form-item>

        </el-form>
        <div v-if="project.files && project.files.length">
          <span style="display: block;margin-bottom:2rem;font-size: 14px;color: #606266;">证明材料：</span>
          <div class="files">
            <div
              style="padding:.6rem;height:140px;width:140px;display: flex;flex-direction: column;justify-content: center;align-items: center;"
              v-for="item in  project.files">
              <span @click="getBigImage(item.url)" v-if="item.type == 1"><img width="100%" height="100%"
                                                                              :src="item.url"></span>
              <span @click="getBigImage(item.url)" v-if="item.type == 2"><img width="100%" height="100%"
                                                                              src="../../assets/images/video@2x.png"></span>
              <span @click="getBigImage(item.url)" v-if="item.type == 3"><img width="100%" height="100%"
                                                                              src="../../assets/images/word@2x.png"></span>
              <span @click="getBigImage(item.url)" v-if="item.type == 4"><img width="100%" height="100%"
                                                                              src="../../assets/images/excel@2x.png"></span>
              <span @click="getBigImage(item.url)" v-if="item.type == 5"><img width="100%" height="100%"
                                                                              src="../../assets/images/pdf@2x.png"></span>
              <div style="text-align: center">
                <span class="showOverflow" :title="item.name">{{item.name}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-header">
      <span class="main-title">审核信息</span>
    </div>

    <div class="main-body content" style="margin: 10px;border: 1px #e4e4e4 solid;color: #000000;padding-bottom: 25px;">
      <div class='body-header'>
        当前状态：{{project.status == 2 ? '审核中' : project.status == 1 ? '通过' : project.stauts==0 ? '驳回' :
        '未知状态'}}
      </div>
      <div class="" style="border-bottom:1px solid #e4e4e4;display: flex;">
        <div v-if="item.type"
             :style="item.index==index ? 'color:orange' : item.auditIdea==1 ?  'color:green' : 'color:grey'"
             style="padding:.5rem;display: flex;align-items: center" v-for="(item,index) in audit">
          {{(item.auditorRole==1 && item.auditIdea!=1 && item.type!=5) ? item.namea + '（负责人）' :
          (item.auditorRole==2 && item.auditIdea!=1 && item.type!=5) ? item.namea + '（管理员）' :
          (item.auditorRole==12 && item.auditIdea!=1 && item.type!=5) ? item.namea + '（负责人/管理员）' :
          (item.auditorRole==4 && item.auditIdea!=1 && item.type!=5) ? item.namea + '（辅导员）' : item.namea}}
          <i class="el-icon-caret-right"
             :style="item.auditIdea==1 ?  'color:green' : item.index==index ? 'color:orange' : 'color:grey'"
             style="color: #AAAAAA;" v-if="index  == (audit.length - 1) ? false : true"></i>
        </div>
        <el-button @click.native="show ? show = false : show = true" size="mini" type="primary">查看流程</el-button>
      </div>

      <div v-if="show">
        <el-table border :data="auditLog" stripe size="mini" style="width: 100%">
          <el-table-column prop="auditTime" label="审核时间" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.auditTime | parseTime}}
            </template>
          </el-table-column>
          <el-table-column prop="auditIdea" label="审核意见" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.auditIdea === 1 ? '通过' : scope.row.auditIdea === 0 ? '驳回' : '待审'}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注信息" align="center"></el-table-column>
          <el-table-column prop="auditorName" label="审核人" align="center"></el-table-column>
        </el-table>
      </div>
      <div>
        <el-button type="primary" @click="rejectProject">驳回</el-button>
        <el-button type="primary" @click="dialog(project.applyId,1,project.hours)">通过</el-button>
      </div>
    </div>


    <el-dialog title="驳回" :visible.sync="dialogVisibleAdopt" :close-on-click-modal="false" width="30%">
      <el-form size="mini" :model="ruleFormReject" ref="ruleFormReject" class="demo-ruleForm">
        <el-form-item prop="name">
          <el-col :span="22">
            <el-input type="textarea" placeholder="请输入原因" v-model="ruleFormReject.comment" maxlength='50'></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormReject()">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {parseTime} from '@/utils/format.js'

  export default {
    data() {
      return {
        show: false,
        detailsShow: false,
        dataHistory: {},
        imageSrc: require("../../assets/images/classification_down@2x.png"),
        isShow: false,
        txt: "查看历史获奖记录",
        hours: '',
        dialogVisible: false,
        dialogVisibleAdopt: false,
        ruleFormReject: {
          id: '',
          appId: '',
          taskId: '',
          comment: '',
          result: 0,
          hours: '',
        },
        hoursUnit: localStorage.getItem("hoursUnit"),
        id: this.$route.query.id,
        exampleId: this.$route.query.type,
        data: '',
        project: {},
        auditLog:[],
        audit: []
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      dialog(id, status, hours) {
        this.id = id
        this.dialogVisible = true
        this.ruleFormReject.hours = hours
        this.ruleFormReject.result = status
        this.ruleFormReject.appId = this.project.applId
        this.ruleFormReject.taskId = this.project.taskId
        console.log(this.ruleFormReject)
      },
      getBigImage(item) {
        window.open(item, "_blank")
      },
      openDetails(id, type) {
        this.detailsShow = !this.detailsShow
        this.$http.get("/project/record/details", {
          params: {
            type: type,
            applyId: id
          }
        }).then((res) => {
          this.dataHistory = res.data;
        })
      },
      showMore() {
        this.isShow = !this.isShow;
        this.isShow ? this.txt = "收起历史获奖记录" : this.txt = "查看历史获奖记录";
        this.isShow ? this.imageSrc = require("../../assets/images/classification_up@2x.png") : this.imageSrc = require("../../assets/images/classification_down@2x.png");
      },
      initData() {
        this.$http.get("/school/student/info", {params: {userId: this.$route.query.userId}}).then((res) => {
          this.data = res.data;
        })
        this.$http.get("/project/wait/apply/list", {
          params: {
            current: 1,
            size: 10, id: this.$route.query.id
          }
        }).then((res) => {
          this.project = res.data.list[0];
          for (let i = 0; i < this.project.files.length; i++) {
            let temp = this.project.files[i];
            let type = temp.url.substring(temp.url.lastIndexOf('.') + 1)
            if (type.indexOf('jpeg') != -1 || type.indexOf('jpg') != -1 || type.indexOf('jfif') != -1 || type.indexOf('bmp') != -1 || type.indexOf('gif') != -1 || type.indexOf('png') != -1 || type.indexOf('tiff') != -1) {
              temp.type = 1;
            } else if (type.indexOf('mp4')) {
              temp.type = 2;
            } else if (type.indexOf('docx') || type.indexOf('doc')) {
              temp.type = 3;
            } else if (type.indexOf('xlsx') || type.indexOf('xls')) {
              temp.type = 4;
            } else if (type.indexOf('pdf')) {
              temp.type = 5;
            }
            temp.name = temp.url.substring(temp.url.indexOf('$') + 1, temp.url.lastIndexOf('$'))
          }

          this.$http.get("/project/audit/log", {params: {applyId: this.$route.query.id}}).then((re) => {
            //  this.audit = re.data.audit;
            let tempLog = [];
            let count = 0;
            for (let i = 0; i < re.data.audit.length; i++) {
              let log = re.data.audit[i];
              if (log.auditIdea == '' && count < 1) {
                log.index = i;
                count++;
              }
              tempLog.push(log);
            }
            this.audit = tempLog;
            this.auditLog = re.data.auditLog;
            // this.data = res.data;
            // if(this.data.url){
            // 	this.data.url = this.data.url.split(',')
            // }
          })
        })


      },
      //驳回
      rejectProject() {
        this.dialogVisibleAdopt = true;
        this.ruleFormReject.result = 0;
        this.ruleFormReject.appId = this.project.applId
        this.ruleFormReject.taskId = this.project.taskId
      },
      //驳回提交
      submitFormReject() {
        if (!this.exampleId) {
          if (this.ruleFormReject.comment) {
            this.$http.post('/project/auditPass', this.ruleFormReject).then((res) => {
              if (res.code == 200) {
                this.dialogVisibleAdopt = false;
                this.$message({
                  type: 'success',
                  message: '驳回成功!'
                });
                this.ruleFormReject.comment = '';
                this.initData();
                setTimeout(function () {
                  window.location.href = '/proceeding/wait/declare/first/auditing'
                }, 1)
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: '请填写原因'
            });
          }
        } else {
          if (this.ruleFormReject.comment) {
            this.$http.post('/project/auditPass', this.ruleFormReject).then((res) => {
              if (res.code == 200) {
                this.dialogVisibleAdopt = false;
                this.$message({
                  type: 'success',
                  message: '驳回成功!'
                });
                setTimeout(function () {
                  window.location.href = '/proceeding/wait/declare/first/auditing'
                }, 1)
                this.ruleFormReject.comment = '';
                this.initData();
              }

            })
          } else {
            this.$message({
              type: 'error',
              message: '请填写原因'
            });
          }
        }
      },
      openBigImg(img) {
        window.open(img, "_blank")
      },
      //通过
      adopt() {
        const that = this;
        that.$http.post('/project/auditPass', this.ruleFormReject).then((res) => {
          if (res.code == 200) {
            this.dialogVisible = false;
            this.$message({
              type: 'success',
              message: '审核成功!'
            });
            this.ruleFormReject.hours = '';
            setTimeout(function () {
              window.location.href = '/proceeding/wait/declare/first/auditing'
            }, 1)
            this.initData();
          }
        })
      }
    },
    filters: {
      parseTime(val) {
        return parseTime(val);
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
      }
    }
  }
</script>

<style>
  .showOverflow {
    font-size: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }

  .projectImg li {
    float: left;
    display: inline;
    width: 100px;
    margin-right: 20px;
    margin-bottom: 20px;
  }

  .projectImg li img {
    width: 100px;
    height: 100px;
  }

  .body-header {
    padding: 12px;
    border-bottom: 1px solid #e4e4e4;
  }

  .body-part1 {
    padding: 12px;

    display: flex;
    position: relative;
    font-size: 13px;
  }

  .body-part1 div {
    padding: 20px 40px;
    padding-bottom: 0px;
  }

  .body-part1 span {
    display: block;
    padding-top: 3px;
  }

  .btn {
    position: absolute;
    cursor: pointer;
    top: 22px;
    right: 0;
    padding-right: 7px !important;
  }

  .body-part2 {
    padding: 12px;

    display: flex;
    flex-wrap: wrap;

    font-size: 13px;
  }

  .tdFrist {
    padding-left: 7px;
    cursor: pointer;
    color: #4d98ff;
  }

  td {
    padding: 7px;
    padding-left: 30px;
  }

  .body-part3 {
    padding: 12px;
    font-size: 13px;
  }

  .part3A span {
    padding-right: 195px;
  }

  .part3D {
    padding: 7px;
  }

  .part3F {
    padding: 7px;
  }

  .files {
    padding-right: 30%;
    display: flex;
    flex-wrap: wrap;
  }

  .filesBox {
    /*border: 1px solid #e4e4e4;*/
    padding: 5px;
    height: 72px;
    width: 300px;
    margin-bottom: 20px;
  }

  .filesBox span {
    cursor: pointer;
  }

  .filesBox img {
    float: left;
  }

  .filesBox div {

    padding-top: 12px;
    padding-left: 67px;
  }

  .part3Btn {
    margin: 0 auto;
    width: 300px;
    padding-top: 25px;
  }
</style>

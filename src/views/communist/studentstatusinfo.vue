<template>
  <section>
    <a class="cms-back" href="javascript:void(0)" @click="goBack()"></a>


    <div style="position:relative;">
      <el-tabs v-model="actitype" @tab-click="handleClick(actitype)">
        <el-tab-pane label="活动详情" name="1"></el-tab-pane>
      </el-tabs>


    </div>
    <el-dialog title="修改学籍" :visible.sync="dialogVisible" @close="beforeCloseHandler" :close-on-click-modal="false"
               width="580px">
      <div>
        <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">

          <el-form-item label="姓名" prop="name">
            <el-col :span="22">
              <el-input v-model="ruleForm.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="学号" prop="code">
            <el-col :span="22">
              <el-input v-model="ruleForm.code"></el-input>
            </el-col>
          </el-form-item>
          
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
              <el-select clearable style="width:100%" v-model="ruleForm.politics" placeholder="选择政治面貌" @change="changepolitics">
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


    
          <el-form-item>
           
            <el-button  type="primary" @click="submitForm('ruleForm')">提交修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog title="驳回" :visible.sync="dialogbhhd" :close-on-click-modal="false" width="30%">
      <el-form size="mini" :model="ruleFormRejecthd" ref="ruleFormReject" class="demo-ruleForm">
        <el-form-item prop="name">
          <el-col :span="22">
            <el-input type="textarea" placeholder="请输入驳回理由(50字以内)" :maxlength="50" v-model="ruleFormRejecthd.comment"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormReject()" >确定</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <div :loading="loading">
      <div class="main-body" v-if="actitype=='1'">
        <p class="xinxitou">基本信息</p>
        <div style="padding: 8px;padding-left: 18px">
          <span>姓名:</span>
          <span style="margin-left: 10px">{{data.name}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>学号:</span>
          <span style="margin-left: 10px">{{data.code}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>性别:</span>
          <span style="margin-left: 10px">{{data.gender==1?'男':data.gender==2?'女':''}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>民族:</span>
          <span style="margin-left: 10px">{{data.ethnicName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>政治面貌:</span>
          <span style="margin-left: 10px" v-if="data.politics">{{data.politics | politicsFmt}}</span>
          <span style="margin-left: 10px" v-else>无</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>所属校区:</span>
          <span style="margin-left: 10px">{{data.campusName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>所属院系:</span>
          <span style="margin-left: 10px">{{data.collegeName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>所属专业:</span>
          <span style="margin-left: 10px">{{data.majorName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>所属年级:</span>
          <span style="margin-left: 10px">{{data.gradeName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
        <span>所属班级:</span>
        <span style="margin-left: 10px">{{data.className}}</span>
      </div>
        <p class="xinxitou" style="margin-top: 20px">审核信息</p>
        <div style="border: 1px solid #ccc;width:60%;margin-top: 15px;font-size: 14px;margin-bottom: 15px ">
          <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
            <span style="padding: 0 20px;min-width: 140px">修改内容</span>
            <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">
            <i v-for="item in data.auditInfo.content" style="display: block;padding: 5px 10px;font-style: normal;    ">{{item}}</i>
            </span>
          </p>
          <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
            <span style="padding: 0 20px;min-width: 140px">修改原因</span>
            <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">{{data.auditInfo.cause}}</span>
          </p>
          <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
            <span style="padding: 0 20px;min-width: 140px">提交时间</span>
            <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">{{data.auditInfo.submitTime | formatDate}}</span>
          </p>
        </div>

        <div style="padding: 8px;padding-left: 18px">
          <span style="width: 50px">状态:</span>
          <span style="margin-left: 10px">{{data.auditStatus==2?'审核中':data.auditStatus==1?'通过':data.auditStatus==0?'驳回':''}}</span>
          <span
            style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 20px;font-size: 14px;cursor: pointer"
            @click="xianshi">{{liutext}}</span>
          <div v-if="data.auditFlow!=null">

            <div style="margin:20px 0 ;" >
              <div style="display: inline-block; margin-top: 5px;" v-for="(item,index) in data.auditFlow" >
                <span :style="item.currentNode==1 ?  'color: orange':item.nodeStatus==1 ?  'color:green' : 'color:grey'" >{{item.nodeName}}</span>
                <i class="el-icon-caret-right" :style="item.currentNode==1 ?  'color: orange':item.nodeStatus==1 ?  'color:green' : 'color:grey'"
                               style="color: #AAAAAA;" v-if="index  == (data.auditFlow.length - 1) ? false : true"></i>
              </div>
            </div>


          </div>
          <div v-if="!show">
            <div style="width:68%">
              <el-table border :data="shenhe" stripe size="mini" style="width: 100%">
                <el-table-column label="审核时间"  align="left">
                  <div slot-scope="scope">
                    <p>{{scope.data.auditTime | formatDate }}</p>
                  </div>
                </el-table-column>
                <el-table-column label="审核意见" align="left">
                  <div slot-scope="scope">
                    <p>{{scope.data.auditIdea===1?'通过':scope.data.auditIdea===0?'驳回':'' }}</p>
                  </div>
                </el-table-column>
                <!--<el-table-column label="备注信息" prop="auditRemark" align="left"></el-table-column>-->

                <el-table-column label="审核人" align="left">
                  <div slot-scope="scope">
                    <p> {{ scope.data.auditorName}}</p>
                  </div>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div style="margin: 26px auto;width: 48%;" >
            <span
              style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 20px;font-size: 14px;cursor: pointer;text-align: center;" @click="adopthd" >同意</span>

            <span
              style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 20px;font-size: 14px;text-align: center;cursor: pointer" @click="ejecthd">驳回</span>
            <span
              style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 20px;font-size: 14px;text-align: center;cursor: pointer" @click="modify">修改</span>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>
<script>
  import {Message} from 'element-ui';
  import {cascade, fujiancur} from '@/utils/filters'
  import axios from 'axios'
  import {politicsFmt} from "@/utils/format";
  import {
    isFloat
  } from '@/utils/validate'


  export default {
    filters: {
      politicsFmt(val) {
        return politicsFmt(val);
      },
    },
    data() {

      return {


        dialoghd:false,
        // 补录模板
        dialogImportCollegeVisible:false,
        showfileInfor:false,
        fileList:[],
        fileListName:'',
        dataObj2:{
          activityId:this.$route.query.id,
        },
        showProgress:false,
        fileUploadPercent:0,
        showfileInforDetail:false,
        fileInforamtion:{

        },
        //
        ruleFormRejecthd: {
          applyId:this.$route.query.applyId,
          taskId:this.$route.query.taskId,
          result:0,
          comment:'',
        },
        ruleFormPass: {
          applyId:this.$route.query.applyId,
          taskId:this.$route.query.taskId,
          result:1,
          comment:'',
        },
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
        dialogVisible: false,
        dialogVisibleAdopt:false,
        ruleFormReject: {
          applyId:this.$route.query.applyid,
          taskId:this.$route.query.taskid,
          status:0,
          auditRemark: '',
        },
        wanjieliulist:[],
        wanjieliulist2:[],
        jobFiles:[],
        zylists:false,
        ruleFormRejects: {
          applyId:this.$route.query.applyid,
          taskId:this.$route.query.taskid,
          status:1,
          auditRemark:'',
        },
        num:'',
        xfdoc: false,
        checkeds: [],
        xfobj: {
          id: '',
          hours: '',
          remark: '',
        },

        multipleSelection: [], // 选中的数据二维数组
        ids: [], // 选中的数据id数组
        xfxuanzhonglist: [],
        xfdata: [],
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
        fafangxfs: {
          actId: this.$route.query.id,
          role: '',
          keyWord: '',
          current: 1,
          size: 10,
          total: 0,
          fulfill:''
        },
        wu: 0,
        shenfens: [
          {shenfenId: '', shenfenName: '全部'},
          {shenfenId: 1, shenfenName: '学生'},
          {shenfenId: 2, shenfenName: '老师'},
        ],
        zhuangtaistatus: [
          {zhuangtaiId: '', zhuangtaiName: '全部'},
          {zhuangtaiId: 0, zhuangtaiName: '驳回'},
          {zhuangtaiId: 1, zhuangtaiName: '通过'},
          {zhuangtaiId: 2, zhuangtaiName: '待审核'},

        ],
        wanjiedata: '',
        total: '',
        show: true,
        databm: '',
        atiyname: '',
        actitype:'1',
        activity: '',
        loading: true,
        data: [],
        shenhe: [],
        tempList: [],//选中数组
        pageList: [],//页码数组
        params: {
          id: this.$route.query.id,
          current: 1,
          size: 10,
          status: '',
          identity: '',
        },

        liutext: '查看流程',
        fijians:false,
        dialogbhhd:false,
        frompath:'',
        fromquery:{},

      }
    },

    beforeRouteEnter (to, from, next) {
      next();
      localStorage.setItem("frompath",from.fullPath)
    },
    mounted() {

      this.getxiangqing()
      let activeName= this.actitype


    },
    methods: {
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
      changepolitics(value){
        this.ruleForm.politics =''
        this.ruleForm.politics =value

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
        this.gradees = [];
        this.colleges = []
        this.majors = []
        this.classes = []
        this.isChange = false
      },
      modify() {
        const that = this;
        that.dialogVisible = true;
        that.ruleForm.id =this. data.userId;
        that.ruleForm.name =this. data.name;
        that.ruleForm.code = this.data.code;
        that.ruleForm.politics = this.data.politics;
        that.ruleForm.college =this. data.collegeId;
        that.ruleForm.campus = this.data.campusId;
        that.ruleForm.major =this. data.majorId;
        that.ruleForm.class =this. data.classId;
        that.ruleForm.grade = this.data.gradeId;
        that.ruleForm.ethnicId = this.data.ethnicid;
        that.getCampus()
        that.getClasses2(this.data.majorId, this.data.grade)
        that.getGradees()
        that.changeSchool(this.data.campusId);
        that.changeCollege(this.data.collegeId);
        that.getEthnic()
        that.ruleForm.gender = this.data.gender+ "" ;
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
          this.$http.get('/school/college/list', { params: { campusId: value } }).then(res => {
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
          this.$http.get('/school/major/list', { params: { collegeId: value } }).then(res => {
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
      getEthnic() {
        this.$http.get("school/ethnic/list").then(res => {
          this.ethnices = res.data
        })
      },
      getCampus() {
        this.$http.get('/school/all/campus').then(res => {
          this.schools = res.data
        })
      },
      getGradees() {
        this.$http.get('/school/grade/partake/list').then(res => {
          this.gradees = res.data
        })
      },
      getClasses2(majorId, grade) {
        this.$http.get('/school/class/partake/list', { params: { majorId: majorId, gradeId: grade } }).then(res => {
          this.classes2 = res.data
        })
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      adopthd() {

        this.submitFormPass()

      },
      ejecthd() {

        this.dialogbhhd = true;

      },
      submitFormPass() {
        this.$http.post("/unit/change/audit", this.ruleFormPass).then((res) => {
          if (res.code == '200') {
            this.$message({
              type: 'success',
              message: '审核成功!'
            });
            this.$router.push({ path: "/proceeding/wait/studentstatus" })
          }

        })
      },
      submitFormReject() {
        if (this.ruleFormRejecthd.comment) {


          this.$http.post('/unit/change/audit', this.ruleFormRejecthd).then((res) => {
            if (res.code == '200') {

              this.$message({
                type: 'success',
                message: '驳回成功!'
              });
              this.$router.push({ path: "/proceeding/wait/studentstatus" })
            }

          })
        } else {
          this.$message({
            type: 'error',
            message: '请填写原因'
          });
        }

      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post("/school/student/modify", this.ruleForm).then((res) => {
              if (res.code == '200') {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                this.$router.push({ path: "/proceeding/wait/studentstatus" })
              }
            })
          } else {
            return false;
          }
        });
      },

      shenhedell() {
        let that = this

        if (this.ruleFormReject.auditRemark != '') {
          this.$http.post('/activity/auditFinish', this.ruleFormReject).then(res => {
            if (res.code == '200') {
              that.$message({
                type: 'success',
                message: '已驳回!'
              });
              that.$router.push({
                path: "/proceeding/wait/activity/report/auditing",
                query: { oto: that.$route.query.oto }
              })
            } else {
              that.$message({
                type: "error",
                message: res.msg
              })
            }
          })

        } else {
          this.$message({
            type: "error",
            message: '请填写驳回理由'
          })
        }

      },
      fujiandoc() {
        this.fijians = true

      },
      chakan(jobFiles) {
        this.jobFiles = jobFiles
        this.zylists = true
      },
      changeBox(e, data) {
        const that = this;
        data.checked = e;
        if (data.checked) {
          that.tempList.push(data);
        } else {
          let temp = [];
          for (let i = 0; i < that.tempList.length; i++) {
            if (that.tempList[i].id == data.id) {

            } else {
              temp.push(that.tempList[i])
            }
          }
          that.tempList = temp
        }
        that.pageList[that.fafangxf.current - 1] = that.tempList
      },


      indexMethod(index) {
        return index + 1;
      },
      xianshi() {
        if (this.show == false) {
          this.show = true
          this.liutext = '查看流程'
        } else {
          this.show = false
          this.liutext = '隐藏流程'
        }

      },

      getxiangqing() {

        this.$http.get('/unit/change/auditdetail', {
          params: {
            applyId: this.$route.query.applyId,
            taskId: this.$route.query.taskId
          }
        }).then(res => {

          if (res.code == 200) {

            this.data = res.data
            this.shenhe = res.data.auditLog


            this.loading = false
          }
        })
      },


      handleClick(activeName) {
        this.actitype = activeName
      },


      goBack() {
        this.$router.push({
          path: localStorage.getItem("frompath"),

        })
      },

    }
  }
</script>
<style>
  .jd .el-progress-bar__innerText {
    color: #e6762f;
  }
  .xf .cell:first-child {

    text-align: center;
  }
  .el-radio-button__inner{
    border-left: 1px solid #dcdfe6;
  }
</style>
<style lang="scss" scoped>
  .main-body div span:first-child {

    display: inline-block;
  }

  .el-form-item {
    margin-right: 5px !important;
  }

  .xinxitou {
    border-radius: 5px;

    padding: 8px;
    background: rgb(190, 224, 247);
    padding-left: 18px;
    margin-bottom: 15px;
  }
</style>

<template>
  <section>
    <div v-if="chenggong==false">
      <p class="xinxitou">基本信息</p>
      <el-form :model="activity" :rules="rules" ref="activity" label-width="155px" class="demo-activity">
        <el-form-item label="活动名称：" prop="name">
          <el-input v-model="activity.name" style="width:30%" placeholder="请输入活动名称" maxlength='30'></el-input>
        </el-form-item>

        <el-form-item label="活动分类：" prop="categoryId">
          <el-select clearable v-model="activity.categoryId" placeholder="请选择活动分类" style="width:30%" @change="flzc">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="活动类型：" prop="activitytypeId">
          <el-select clearable v-model="activity.activitytypeId" placeholder="请选择活动类型" style="width:30%">
            <el-option
              v-for="item in hdlex"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动主办方：" prop="orgId">
          <el-select clearable v-model="activity.orgId" placeholder="请选择活动主办方" style="width:30%" @change="getmod">
            <el-option
              v-for="item in organizationes"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动承办/协办方：" >
          <el-select clearable v-model="activity.coorganizerId" placeholder="请选择活动承办/协办方：
" style="width:30%">
            <el-option
              v-for="item in xb"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间：" prop="activityDate">
          <el-date-picker class="activityWidth" :editable="false" type="datetimerange" v-model="activity.activityDate"
                          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm">
          </el-date-picker>
        </el-form-item>


        <el-form-item label="上传海报：" prop="img">
          <upload id="uploadSquar" :image='activity.img' upload="/upload/image" @uploadSuccessed="uploadSuccessed2" type="1">

          </upload>
        </el-form-item>
        <el-form-item label="活动简介：" prop="desc">
          <el-col :span="22">
            <el-input type="textarea" v-model="activity.desc" placeholder="请输入活动简介" maxlength='300'
                      style="width: 30%"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="上传附件：">
          <uploadMore @deleteList="deleteFile" type="1" :imageList='activity.attachUrls2'
                      @uploadSuccessed="uploadSuccessed">
          </uploadMore>
        </el-form-item>
        <el-form-item label="管理员：" prop="adminId">
          <el-select
            clearable
            style="width:30%"
            v-model="activity.adminId"
            filterable
            value-key="value"
            :multiple-limit=1
            remote
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            @clear="clear"
            :loading="loading">
            <el-option
              v-for="item in options4"
              :key="item.id"
              :label="item.name "
              :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式：" prop="contact">
          <el-input style="width: 30%" v-model="activity.contact" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <p class="xinxitou">报名信息</p>
        <el-form-item label="报名是否审核：" prop="signLimit">
          <el-radio-group v-model="activity.signLimit">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="报名截止日期：" prop="bms">
          <el-date-picker style="width: 30%" class="selectWidth" :editable="false" format="yyyy-MM-dd HH:mm"
                          type="datetime" v-model="activity.bms">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动限制人数：">

          <el-input type="number"  v-model.number="activity.peopleLimit" style="width: 30%"></el-input>

        </el-form-item>

        <el-form-item label="参与院系：">
          <el-radio-group v-model="activity.departmentIdLimit2" @change="clears">
            <el-radio label="0">全部</el-radio>
            <el-radio label="1">选择</el-radio>
          </el-radio-group>
          <template>
            <div>
              <el-select style="width:30%" v-model="activity.departmentIdzc" multiple
                         placeholder="请选择" :disabled="activity.departmentIdLimit2==1?false:true">
                <el-option
                  v-for="item in departments"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="参与年级：">

          <el-radio-group v-model="activity.gradeLimits2" @change="clears">
            <el-radio label="0">全部</el-radio>
            <el-radio label="1">选择</el-radio>
          </el-radio-group>
          <template>
            <div>
              <el-select style="width:30%" multiple v-model="activity.gradeIdzc" placeholder="请选择"
                         :disabled="activity.gradeLimits2==1?false:true">
                <el-option v-for="tag in grades" :key="tag.id" :value="tag.id"
                           :label="tag.name"></el-option>
              </el-select>

            </div>
          </template>
        </el-form-item>
        
        <el-form-item label="参与年制：">

          <el-radio-group v-model="activity.year2" @change="clears">
            <el-radio label="0">全部</el-radio>
            <el-radio label="1">选择</el-radio>
          </el-radio-group>
          <template>
            <div>
              <el-select style="width:30%" v-model="activity.yearzc" multiple
                         placeholder="请选择" :disabled="activity.year2==1?false:true">
                <el-option
                  v-for="item in years"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </template>
        </el-form-item>
        
        <el-form-item label="参与性别：">
          <el-radio-group v-model="activity.sexId">
            <el-radio :label="0">不限</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="参与组织：">
          <el-radio-group v-model="activity.tribeIdLimit2" @change="clears">
            <el-radio label="0">全部</el-radio>
            <el-radio label="1">选择</el-radio>
          </el-radio-group>
          <template>
            <div>
              <el-select filterable style="width:30%" v-model="activity.cyorgIdzc" multiple
                         placeholder="请选择" :disabled="activity.tribeIdLimit2==1?false:true">
                <el-option
                  v-for="item in tribes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </template>
        </el-form-item>
        
        <el-form-item label="最低诚信值：">
          <el-input type="number"  v-model.number="activity.foulLimit" maxlength="3" placeholder="不填表示不限制" style="width: 30%"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submit('activity')" style="margin: 15px;">确认提交</el-button>
        </el-form-item>

      </el-form>

    </div>
    <div v-if="chenggong==true">

      <div class="book-container">
        <div class="book-list">
          <span class="book-item" @click="gocp(1)"><img src="/static/images/book-icon/vote.png" alt="" class="icon">
            <span class="desc"><span>添加投票</span></span>
          </span>
          <span class="book-item" @click="gocp(2)"><img src="/static/images/book-icon/questionnaire.png" alt="" class="icon">
            <span class="desc"><span>添加问卷</span></span>
          </span>
          <span class="book-item" @click="gocp(3)"><img src="/static/images/book-icon/evaluation.png" alt="" class="icon">
            <span class="desc"><span>添加测评</span></span>
          </span>
          <span class="book-item" @click="gocp(5)"><img src="/static/images/book-icon/message.png" alt="" class="icon">
            <span class="desc"><span>添加留言</span></span>
          </span>
          <span class="book-item" @click="gocp(4)"><img src="/static/images/book-icon/solicitation.png" alt="" class="icon">
            <span class="desc"><span>添加征集</span></span>
          </span>
          <span class="book-item" @click="xianshangchuangjian"><img src="/static/images/book-icon/success.png" alt="" class="icon">
            <span class="desc" ><span>创建完成</span></span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  import { cascade, formatDate, getOssToken, getAliyunImageUrl } from "@/utils/filters";
  import listMixins from "@/mixins/form";

  import { Message } from "element-ui";
  import axios from "axios";

  export default {
    mixins: [listMixins],
    data() {
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("手机号不能为空"));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error("请输入正确的手机号"));
          }
        }
      };
      var checkhb = (rule, value, callback) => {
        console.log(value);
        if (!value) {
          return callback(new Error("请上传海报"));
        } else {
          callback();
        }
      };
      return {
        actiy: "",
        chenggong: false,
        category: "",
        years: [],
        pitchNames: [],
        organizationes: [],
        hdlex: [],
        xb: [],
        IsAlldepartment: false,
        IsAlldepartmentVote: false,
        IsAlltribe: false,
        IsAllclass: false,
        active: 0,
        activityNormal: {},
        activity: {
          material: "",
          ishomeworksLimit: "0",
          oto: "1",
          name: "",
          substanceLimit: "0",
          pitchId: "",
          homeworkLimit: "0",
          activitytypeId: "",
          coorganizerId: "",
          orgId: "",
          address: "",
          peopleLimit: "",
          activityDate: [],
          startTime: "",
          endTime: "",
          enrollEndTime: "",
          bmDate: "",
          bms: "",
          desc: "",
          adminId: "",

          categoryId: "",
          collegeLimit: "0",
          departmentIdLimit2: "0",
          departmentId: [],
          classLimit: "0",
          gradeLimits2: "0",
          gradeId: [],
          gradeLimit: [],
          sexId: 0,
          organizationLimit: "0",
          tribeIdLimit2: "0",
          cyorgId: [],
          contact: "",
          signLimit: "0",
          isVote: 0,
          isVoteEveryDay: 0,
          voteTime: "",
          voteStartTime: "",
          img: "",
          attachUrls2: [],
          value13: "",
          year2: "0",
          yearzc: [],
          cyorgIdzc: [],
          gradeIdzc: [],
          departmentIdzc: [],
          foulLimit: '',
        },
        IsActiveStep1: true,
        IsActiveStep2: false,
        IsActiveStep3: false,
        rules: {
          img: [{
            required: true, validator: checkhb
          }],
          name: [{
            required: true, message: "请输入活动名称", trigger: "blur"
          }],
          material: [{
            required: true, message: "请输入活动名称", trigger: "blur"
          }],
          activityDate: [{
            required: true, message: "请输入活动名称", trigger: "blur"
          }],
          substanceLimit: [{
            required: true, message: "请选择", trigger: "change"
          }],
          orgId: [{
            required: true, message: "请输入活动主办方", trigger: "blur"
          }],
          activitytypeId: [{
            required: true, message: "请输入活动类型", trigger: "blur"
          }],
          coorganizerId: [{
            required: true, message: "请选择活动协办方", trigger: "change"
          }],
          address: [{
            required: true, message: "请填写活动地点", trigger: "blur"
          }],
          categoryId: [{
            required: true, message: "请选择活动分类", trigger: "blur"
          }],
          homeworkLimit: [{
            required: true, message: "请选择", trigger: "change"
          }],
          ishomeworksLimit: [{
            required: true, message: "请选择", trigger: "change"
          }],
          activityDate: [{
            required: true, message: "请选择活动日期", trigger: "change"
          }],

          bms: [{
            required: true, message: "请选择报名结束日期", trigger: "change"
          }],
          desc: [{
            required: true, message: "请输入活动简介", trigger: "blur"
          }],
          pitchId: [{
            required: true, message: "请输选择地址", trigger: "change"
          }],
          adminId: [{
            required: true, message: "请选择活动管理员", trigger: "change"
          }],
          // tagId: [{
          //     required: true,message: '请选择活动标签',trigger: 'change'
          // }],

          orgId: [{
            required: true, message: "请选择主办方", trigger: "change"
          }],
          categoryId: [{
            required: true, message: "请选择活动分类", trigger: "change"
          }],
          activitytypeId: [{
            required: true, message: "请输入活动类型", trigger: "change"
          }],
          gradeLimits: [{
            required: true, message: "请选择参与年级", trigger: "change"
          }],
          signLimit: [{
            required: true, message: "请选择", trigger: "change"
          }],
          contact: [{ required: true, validator: checkPhone, trigger: "blur" }]

        },
        tags: [],
        tribes: [],
        departments: [],
        grades: [],
        departmentStateAll: false,
        departmentStateAllLimit: false,
        gradeStateAll: false,
        gradeLimitAll: false,
        tribeStateAll: false,
        departmentState: true,
        gradeState: true,
        tribeState: true,
        isVote: false,
        options4: [],
        list: [],
        options: [],
        loading: false,
        states: [
          {
            id: 1,
            code: "111",
            name: "学生1"
          },
          {
            id: 2,
            code: "121",
            name: "学生2"
          }
        ],
        wuzi: false,
        changdi: false
      };
    },
    created() {
      this.getClassify();
      this.getSponsor();
      this.getxb();
      //
      this.getlx();
      this.getpitch();
      this.getdepartment();
      this.getyear();
      this.getOraganziton();
      this.getClass();
      this.getgly();
    },
    methods: {
      xianshangchuangjian(){
        /*保存活动*/
        this.$http.post('/activity/saveActExam', {activityId: this.actiy}).then(res => {
          if (res.code == 200) {
            this.$confirm("活动已创建完成，请在移动端“我的”>“我创建”中进行查看", "提示", {
              confirmButtonText: "确定",
              // cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              location.reload()
            });

          }
        })
      },
      gocp(papertype) {
        let newurl = "/proceeding/wait/createpaper?papertype=" + papertype + "&actiyId=" + this.actiy;
        window.open(newurl, "_blank");
      },
      getgly() {
        this.options4 = [];
        let obj = {
          id: parseInt(localStorage.getItem("operatorId")),
          name: localStorage.getItem("name")
        };

        this.options4.push(obj);
        if (this.options4.length > 0) {
          this.activity.adminId = parseInt(localStorage.getItem("operatorId"));
        }
        ;

      },
      getmod(val) {
        console.log(val);
        if (val != "") {

          this.getActivitTplByParty(val);
        }

      },
      getActivitTplByParty(val) {
        // 获取模板
        this.$http.get("/school/getActivitTplByParty", { params: { orgId: val, classId: this.activity.categoryId } }).then(res => {
          if (res.data) {
            console.log(res.data);
            this.wuzi = res.data.materials_status;
            this.changdi = res.data.pitch_status;
          }

        });
      },
      clears(){

        if (this.activity.departmentIdLimit2 =='0'){
          this.activity.departmentIdzc=[]
        } ;
        if (this.activity.gradeLimits2 =='0'){
          this.activity.gradeIdzc=[]
        } ;
        if (this.activity.year2 =='0'){
          this.activity.yearzc=[]
        } ;
        if (this.activity.tribeIdLimit2 =='0'){
          this.activity.cyorgIdzc=[]
        } ;
      },
      flzc(val) {
        this.activity.year = [];
        this.activity.gradeId = [];
        this.activity.departmentId = [];

        if (val == "") {
          this.getdepartment();
          this.getClass();
          this.getyear();
        } else {
          for (let i = 0; i < this.options.length; i++) {
            if (val == this.options[i].id) {
              let e = this.options[i];

              if (e.classLimit.collegeList.length <= 0 && e.classLimit.gradeList.length <= 0 && e.classLimit.yearList.length <= 0) {

                this.getdepartment();
                this.getClass();
                this.getyear();
                return;
              }
              if (e.classLimit.collegeList.length > 0) {

                this.departments = e.classLimit.collegeList;


              } else {

                this.getdepartment();
              }

              if (e.classLimit.gradeList.length > 0) {

                this.grades = e.classLimit.gradeList;

              } else {

                this.getClass();
              }
              if (e.classLimit.yearList.length > 0) {
                this.years = e.classLimit.yearList;

              } else {

                this.getyear();
              }
            }
          }
        }


      },


      getpitch() {
        this.$http.get("/school/partake/pitch-list").then(res => {
          this.pitchNames = res.data;
        });
      },
      getClass() {
        this.$http.get("/school/grade/partake/list").then(res => {
          this.grades = res.data;
        });
      },
      getyear() {
        this.$http.get("/school/year/partake/list").then(res => {
          this.years = res.data;
        });
      },
      getOraganziton() {
        this.$http.get("/school/org/partake/list").then(res => {
          this.tribes = res.data;
        });
      },
      getxb() {
        this.$http.get("/dict/organization-assist-list").then(res => {
          this.xb = res.data;
        });
      },
      getlx() {
        this.$http.get("/school/type/partake/type-list").then(res => {
          this.hdlex = res.data;
        });
      },
      getdepartment() {
        this.$http.get("/school/college/list").then(res => {
          this.departments = res.data;
        });
      },
      getClassify() {
        this.$http.get("/dict/all-class-limit").then(res => {
          this.options = res.data;
        });
      },
      getSponsor() {
        this.$http.get("/dict/organization-list", {}).then(res => {
          this.organizationes = res.data;
        });
      },
      uploadSuccessed(url) {

        for (let i=0;i<url.length;i++){
          url[i].progress=100;
        }
        var that = this;
        this.$set(this.activity, "attachUrls2", url);
      },
      deleteFile(value) {
        this.activity.attachUrls2 = this.activity.attachUrls2.filter((item, index) => {
          return item.name != value.name;
        });
      },
      uploadSuccessed2(url) {

        var that = this;
        this.$set(this.activity, "img", url);
      },
      changeAdmin(value) {
        if (value) {
          this.$http.get("/api/v1/tribe/user", {
            params: {
              userId: value
            }
          }).then(res => {
            this.sponsors = res.data;
          });
        }

      },
      changeTag(value) {
        this.activity.tagId = value;
        this.$http.get("/api/v1/activity/classifies", {
          params: {
            tagId: this.activity.tagId
          }
        }).then(res => {
          this.classifies = cascade("0", res.data);
        });
      },


      handleCheckedGradeChange(value) {
        let checkedCount = value.length;
        this.gradeStateAll = checkedCount === this.grades.length;
      },

      handleGradeLimitChange(value) {
        let checkedCount = value.length;
        this.gradeLimitAll = checkedCount === this.grades.length;
      },

      //是否投票
      changeVote(value) {
        if (value) {
          this.rules.voteTime = [{ required: true, message: "请选择投票开始时间", trigger: "blur" }];
        } else {

          this.rules.voteTime = "";
        }
      },
      //远程搜索
      remoteMethod(query) {
        if (query !== "") {
          this.loading = true;

          this.$http.get("/school/students/NoPage", {
            params: {
              key: query,
              identity: ""
            }
          }).then(res => {
            this.loading = false;
            this.options4 = res.data;
          });


        }
      },
      //清除下拉框
      clear() {
        this.options4 = [];

      },
      submitNormal(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.IsActiveStep1 = false;
            this.IsActiveStep2 = true;
            this.IsActiveStep3 = false;
            this.active = 1;
          } else {
            return false;
          }
        });
      },
      backactivityNormal() {
        this.IsActiveStep1 = true;
        this.IsActiveStep2 = false;
        this.IsActiveStep3 = false;
        this.active = 0;
      },
      backactivityClass() {
        this.IsActiveStep1 = false;
        this.IsActiveStep2 = true;
        this.IsActiveStep3 = false;
        this.active = 1;
      },
      submitClass(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.IsActiveStep1 = false;
            this.IsActiveStep2 = false;
            this.IsActiveStep3 = true;
            this.active = 2;
          } else {
            return false;
          }
        });
      },
      submit(formName) {

        var that = this;
        console.log(that.activity.bmDate);
        this.$refs[formName].validate((valid) => {

          if (valid) {

            that.activity.sDate = that.activity.activityDate[0].getTime();
            that.activity.eDate = that.activity.activityDate[1].getTime();

            that.activity.bmDate = that.activity.bms.getTime();
            that.activity.year = that.activity.yearzc.toString();
            that.activity.cyorgId = that.activity.cyorgIdzc.toString();
            that.activity.gradeId = that.activity.gradeIdzc.toString();
            that.activity.departmentId = that.activity.departmentIdzc.toString();
            if (this.activity.peopleLimit == "") {
              this.activity.peopleLimit = 0;
            }
            if( this.activity.departmentId==''){
              this.activity.departmentId=0
            }
            if( this.activity.gradeId==''){
              this.activity.gradeId=0
            }
            if( this.activity.year==''){
              this.activity.year=0
            }
            if( this.activity.cyorgId==''){
              this.activity.cyorgId=0
            }
            if (this.activity.foulLimit <= 0) {
            	this.activity.foulLimit = ''
            }else if(this.activity.foulLimit >= 100){
            	this.activity.foulLimit = ''
            }
            //
            // if(typeof that.activity.collegeLimit == 'object'){
            //   that.activity.collegeLimit = that.activity.collegeLimit.join(',');
            // }
            //
            // if(typeof that.activity.gradeLimits  == 'object'){
            //   that.activity.gradeLimit = that.activity.gradeLimits.join(',');
            // }
            //
            // if(typeof that.activity.organizationLimit == 'object'){
            //   that.activity.organizationLimit = that.activity.organizationLimit.join(',');
            // }


            // if (this.activitySuccess.voteDepartmentIdLimit) {
            //   this.activitySuccess.voteDepartmentIdLimit = this.activitySuccess.voteDepartmentIdLimit.join(',');
            // }


            //
            // that.activity.voteStartTime = new Date(that.activity.voteTime).getTime();


            // var n = Number(this.activity.adminId);
            // if (isNaN(n)) {
            //   this.activity.adminId = this.activity.adminId;
            // }
            //
            //
            // if (this.activity.attachUrls2.length) {
            //   this.activity.attachUrls = this.activity.attachUrls2.map(item => {
            //     return item.url;
            //   });
            //   this.activity.attachUrls = this.activity.attachUrls.join(",");
            // }


            // this.activity  = Object.assign(this.activityNormal, this.activityClass, this.activitySuccess);

            that.$confirm("投票,问卷,测评,征集,留言必须添加其中一项才视为有效活动,是否继续添加?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              that.$http.post("/activity/establish", that.activity).then(res => {
                if (res.code == "200") {
                  that.$refs["activity"].resetFields();
                  this.$store.state.sys.fileProgresss=[]
                  that.chenggong = true;
                  that.actiy = res.data;
                }
              });
            });


          } else {
            return false;
          }
        });


      }
    },
    beforeDestroy(){
      this.$store.state.sys.fileProgresss=[]
    }
  };
</script>
<style lang="scss" scoped>
  .xinxitou {
    border-radius: 5px;
    margin-left: 10px;
    padding: 8px;
    background: rgb(190, 224, 247);
    padding-left: 18px;
    margin-bottom: 15px;
  }
  .book-container{
    box-sizing: border-box;
  }
  .book-list{
    width: 60%;
    margin: 0 auto;
    margin-top: 5%;
    text-align: center;
  }
  .book-item{
    display: inline-block;
    width: 15%;
    margin-right: 4%;
    text-align: center;
    cursor: pointer;
  }
  .book-item span{
    margin-top: 10px;
    display: block;
  }
  .book-item:nth-child(6){
    margin: 0 auto;
    display: inline-block;
    margin-top: 50px;
    margin-right: 2%;
    width: 14%;
  }
</style>

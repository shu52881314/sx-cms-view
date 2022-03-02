<template>
<section>

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
            <button  class="uploadLocal-btnReset" @click="resetUpload">重新上传</button>
            <button class="uploadLocal-btnSubmit"  @click="submitUpload">确认导入</button>
           </div>
         </div>

          <el-form v-show="!fileList.length" size='mini' label-width='12px'>
              <div class="importTipsTitle">
                <span class="importTipsTitle-left">
                   请下载导入模板，按格式修改后导入
                </span>
                <span class="importTipsTitle-right">
                  <a class="el-button el-button--text el-button--mini" href='https://2room.oss-cn-beijing.aliyuncs.com/template/%E5%9B%A2%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF%20.xlsx' size='mini' >模板下载</a>
                </span>
              </div>
              <el-form-item label="" prop="name">
               <el-col :span="22" >
                 <upload-file
                   ref="childUpload"
                    uploadUrl="/school/ideology/group/import/member"
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
          <el-progress :stroke-width="18" :percentage="fileUploadPercent" style="margin-top:30px;" ></el-progress>
          <p style="text-align: center;padding: 20px 0px 10px;">正在上传，请您耐心等待...</p>
          <span style="display: block; text-align: center; font-size: 13px; color: #999">请勿关闭浏览窗口</span>
        </div>

           <div class="importFail"  v-show="showfileInforDetail  && fileInforamtion.total != fileInforamtion.success">
              <div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_fail@2x.png'></div>
              <div class="importFail-tips">
                  <span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功，<span style="color:#FFC600;">{{fileInforamtion.failed}}</span>条导入失败
                   <span @click="downFailed()" style="cursor:pointer;color:#4D98FF" v-if="fileInforamtion.failed">下载失败列表</span>
              </div>
              <div class="uploadLocal-btn">
               <button  class="uploadLocal-btnReset" @click="resetUpload">重新导入</button>
              </div>
           </div>

           <div class="importSuccess" v-show="showfileInforDetail && fileInforamtion.total == fileInforamtion.success">
             <div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_success@2x.png'></div>
             <div class="importFail-tips">
                 <span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功
              </div>
             <div class="uploadLocal-btn">
              <button  class="uploadLocal-btnReset" @click="resetUpload">继续导入</button>
             </div>
           </div>


     </div>
   </el-dialog>


  <!-- <el-dialog title="导入"
   :visible.sync='dialogImportCollegeVisible'
   @close="beforeCloseImportCollegeHandler"
   :close-on-click-modal="false"
   width='650px'>
     <div>
         <el-form size='mini' label-width='12px'>
             <el-row>
                 <el-col :span='17' style="margin-left: 12px">
                     <p><el-tag type="warning"><i class='el-icon-warning'></i>为了提高数据导入成功率，请使用模板,并严格按照图例格式填写！</el-tag></p>
                 </el-col>
                 <el-col :span='3'>
                     <a class="el-button el-button--text el-button--mini" href='https://res.qutuo.net/download/template/%E5%AF%BC%E5%85%A5%E5%9B%A2%E5%91%98%E6%A8%A1%E6%9D%BF.xlsx' size='mini' >模板下载</a>
                 </el-col>
             </el-row>

             <el-form-item label="" prop="name">
               <el-col :span="22" >
                 <upload-file
                   ref="childUpload"
                   uploadUrl="/school/ideology/group/import/member"
                   uploadType=".xls,.xlsx"
                   uploadSzie="100"
                   uploadSzieTips="只能上传xlx/xlsx文件，且不超过100MB!"
                   @fileInfor="openfileInfor"
                    >
                   </upload-file>
               </el-col>
             </el-form-item>
             <el-form-item class="upload-info" v-if="showfileInfor">
               <p>
                 共导入：
                 <b class="fileInforColor1">
                   {{fileInforamtion.total}}
                 </b> 个数据
                 <span class="fileInforColor2">
                   （成功导入<b >{{fileInforamtion.success}}</b>个
                 </span> ;
                 <span class="fileInforColor3">
                     失败<b>{{fileInforamtion.failed}}</b>个）
                 </span>
              </p>
             </el-form-item>
             <el-form-item style="text-align:center;">
               <el-button   type="primary" @click="submitUpload">确定导入</el-button>
             </el-form-item>
         </el-form>
     </div>
   </el-dialog> -->

  <el-dialog title="添加团员" @close="beforeCloseHandler" :visible.sync="dialogVisible" :close-on-click-modal="false" width="550px">

    <div>
      <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="userId">
                     <el-select clearable
                      style="width:300px"
                       v-model="ruleForm.userId"
                       filterable
                       value-key="value"
                       :multiple-limit=1
                       remote
                       placeholder="请输入关键词"
                       :remote-method="remoteMethod"
                       :loading="loading">
                       <el-option
                         v-for="item in options4"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
                           <span style="float: left">{{ item.name }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                       </el-option>
                     </el-select>

        </el-form-item>
        <el-form-item label="归属团组织" prop="organizationIds">
            <el-col :span="22">
              <el-cascader    style="width:300px"  class="selectWidth" expand-trigger="click" v-model="ruleForm.organizationIds" clearable :options="classifies" :change-on-select="true" :show-all-levels="true"></el-cascader>
            </el-col>
        </el-form-item>

        <el-form-item label="入团日期" prop="joinTime2">
          <el-date-picker style="width:300px"
           v-model="ruleForm.joinTime2"
           type="date"
           placeholder="选择日期">
         </el-date-picker>


        </el-form-item>
        <!-- <el-form-item label="联系方式" prop="contact">
          <el-input style="width:300px" v-model="ruleForm.contact" placeholder="请输入联系方式"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">添加团员</el-button>
        </el-form-item>
      </el-form>
    </div>

  </el-dialog>

  <el-dialog :title="transFormTitle" @close="beforeCloseTransForm" :visible.sync="dialogVisibleTransForm" :close-on-click-modal="false" width="750px">
    <div>
      <el-form size="mini" :model="ruleFormTrans" :rules="rulesTrans" ref="ruleFormTrans" label-width="135px" class="demo-ruleForm">
        <el-form-item :label="transFormTitle + '日期'" prop="time">
            <el-date-picker style="width:300px"
             v-model="ruleFormTrans.time"
             type="date"
             placeholder="选择日期">
           </el-date-picker>
        </el-form-item>
        <el-form-item label="意见" prop="opinion">
            <el-input
              type="textarea"
              :rows="6"
              maxlength="300"
              v-model="ruleFormTrans.opinion">
            </el-input>
        </el-form-item>
        <el-form-item label="附件" prop="attachUrls">
            <el-col :span="22">
              <upload id="upImgStyle" :image='ruleFormTrans.attachUrls'  upload="/upload/image" @uploadSuccessed="uploadSuccessed">
              </upload>
            </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="subruleFormTrans('ruleFormTrans')">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <div class="main-header">
    <span class="main-title">团员列表</span>
    <div class="main-btn-box">
      <el-button v-perms="'/ideology/group/member/Administration/add'" type="primary" size="mini" @click="dialogVisible = true">添加团员</el-button>
      <el-button v-perms="'/ideology/group/member/Administration/import'" type="primary" size="mini"  @click="dialogImportCollegeVisible = true">导入团员</el-button>
      <el-button  @click="importFile" type="primary" size="mini">导出</el-button>
    </div>
  </div>
  <div class="search-box">
    <el-form size="mini" :inline="true" class="demo-form-inline">
      <!-- <el-form-item label="入团日期">
        <el-date-picker clearable size="mini" class="selectWidth" :editable="false" type="daterange" v-model="dateArray" @change='change' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item> -->

      <el-form-item label="入团日期" :rules="rules">
        <el-form-item >
            <el-col :span="22">
              <el-date-picker
               @change="changeStartDate"
               style="width:100%;"
               v-model="dateArray.startDate2"
               type="datetime"
               placeholder="请选择开始日期">
             </el-date-picker>
            </el-col>
        </el-form-item>
        <span style="color:#606266;font-size:14px;">至</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-form-item   >
            <el-col :span="22">
              <el-date-picker
               :disabled="isShow"
               style="width:100%;"
               start-placeholder="2017 年 03 月 21 日"
               v-model="dateArray.endDate2"
               type="datetime"
               placeholder="请选择结束日期"
               default-time="23:59:59"
               :picker-options="pickerOptions1">
             </el-date-picker>
            </el-col>
        </el-form-item>

     </el-form-item>

      <el-form-item label="归属团组织">
        <el-select clearable v-model="params.organizationId" placeholder="请选择团组织">
          <el-option v-for="option in organizations" :key="option.id" :label="option.name" :value="option.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="params.keyword" maxlength=30  placeholder="请输入名称搜索"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button size="mini" type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="main-body">
    <el-table :loading="loading" :data="data" stripe size="mini" style="width: 100%">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="code" label="学号"></el-table-column>
      <el-table-column prop="sex" label="性别">
        <div slot-scope="scope">
          {{scope.row.sex == 1 ? "男" : "女"}}
        </div>
      </el-table-column>
      <el-table-column prop="organizationName" label="归属团组织"></el-table-column>
      <el-table-column prop="identity" label="身份">
        <div slot-scope="scope">
          {{scope.row.identity == 3 ? "入团积极分子" : (scope.row.identity == 4 ? "发展对象" : (scope.row.identity == 5 ? "预备团员" : "团员" ) ) }}
        </div>
      </el-table-column>
      <el-table-column prop="joinDate" label="入团时间">
        <div slot-scope="scope">
          {{scope.row.joinDate | formatDate }}
        </div>
      </el-table-column>
      <!-- <el-table-column prop="contact" label="联系方式"></el-table-column> -->
      <el-table-column label="操作" width="160" align="left">
        <div slot-scope="scope">
          <!-- 可转载站点功能未完成 -->
          <el-button v-perms="'/ideology/group/member/Administration/details'" type="text" class="opreat-btn" @click.native="routerLink('/ideology/party/member/AdministrationShow','view',scope.row.id,'','1')" >详情</el-button>

        </div>
      </el-table-column>
    </el-table>
    <qu-pagination :total="total" @change="changePage"></qu-pagination>
  </div>
</section>
</template>
<script>
import axios from 'axios'
import {cascade} from '@/utils/filters'
import { Message } from 'element-ui';
export default {
  data() {
    return {

      fileListName:'',
      fileList:[],
      randomData:"",
      pickerOptions1: {
        disabledDate: (time) => {
          let beginDateVal = this.dateArray.startDate2;
          if (beginDateVal) {
            let beginYear = beginDateVal.getFullYear();
            let beginMonth = beginDateVal.getMonth() + 1;
            let beginDate = beginDateVal.getDate();

            let beginDateVal1 = beginYear + '-' + beginMonth + '-' + beginDate + ' ' + '00:00:00';
            let beginDateVal2 = beginDateVal1.replace(/-/g,'/');
            let timestamp = new Date(beginDateVal2).getTime();

             if (beginDateVal) {
                 return time.getTime() < timestamp   ;
             }
          }else {
            return true
          }
        }
      },
      isShow:true,
      dateArray: {
        startDate2:'',
        endDate2:'',
      },
      showfileInfor:false,
      fileInforamtion:{

      },
      dialogImportCollegeVisible: false,
      ruleFormTrans:{
         time:'',
         opinion:'',
         attachUrls:'',
         userId:'',
         identity:''
      },
      dialogVisible: false,
      ruleForm: {
        userId: '',
        organizationIds: [],
        organizationId: '',
        joinTime2: '',
        joinTime: '',
        contact: ''
      },
      options4:[],
      transFormTitle:'',
      classifies:[],
      rulesTrans:{
        time: [{
          required: true,
          message: '请选择转换日期',
          trigger: 'change'
        }],
        opinion: [{
          required: true,
          message: '请填写意见',
          trigger: 'blur'
        }],
        attachUrls: [{
          required: true,
          message: '请上传附件',
          trigger: 'change'
        }],
      },
      rules: {
        userId: [{
          required: true,
          message: '请选择姓名',
          trigger: 'change'
        }],
        organizationIds: [{
          required: true,
          message: '请选择归属组织',
          trigger: 'change'
        }],
        identity: [{
          required: true,
          message: '请选择身份',
          trigger: 'change'
        }],
        joinTime2: [{
          required: true,
          message: '请选择加入时间',
          trigger: 'change'
        }],
        contact: [{
          required: true,
          message: '请输入联系方式',
          trigger: 'blur'
        }],
        startDate2: [{
                required: true,
                message: '请选择开始日期',
                trigger: 'change'
            }
        ],
        endDate2: [{
                required: true,
                message: '请选择结束日期',
                trigger: 'change'
            }
        ]
      },
      dialogVisibleTransForm:false,
      showProgress:false,
      fileUploadPercent:0,
      showfileInforDetail:false,

      loading: false,
      params: {
        current: 1,
        size: 10,
        organizationId: '',
        startTime: '',
        endTime: '',
        keyword: ''
      },
      organizations: [],
      data: [],
      total: 0,
      clickAble:true,
    }
  },
  created() {
    this.getOrgnaziton()
    this.getClasses()
    this.fetch()
  },
  mounted() {

  },
  methods:{
    setProgress(progressInfo){

      this.showfileInfor =true
      this.showProgress =true
      this.showfileInforDetail =false
      this.fileUploadPercent = 0
      var s = 1
      this.Interval = setInterval(()=>{
        s++
        this.fileUploadPercent = s
        if(s==90){
          clearInterval(this.Interval);
        }
      },100)
    },
    resetUpload(){
      this.fileList = []
      this.clickAble = true
      this.showfileInfor = false
      this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
      }
      this.$refs.childUpload.closeUpload();
      this.showfileInforDetail =false
    },
    //显示本地上传发文件
    setFileList(fileList){
      this.fileList = fileList
      this.fileListName = fileList[0].name
    },
    //下载失败模板
    downFailed(){

      axios({
        method: 'post',
        url: 'school/fail/party/groups/members/export',
        responseType: 'blob',
        data:{
         randomData:   this.randomData,
         nature:4
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
       link.setAttribute('download', '团员失败信息' + '.xlsx')
       document.body.appendChild(link)
       link.click()
     })
  },
    open() {
        this.$message('请选择结束日期');
      },
    // change(value) {
    //   if (this.dateArray) {
    //     this.params.startTime = this.dateArray.startDate2.getTime();
    //     this.params.endTime = this.dateArray.endDate2.getTime();
    //   } else {
    //     this.dateArray = []
    //     this.params.startTime = ""
    //     this.params.endTime = ""
    //   }
    // },
    changeStartDate(value){
      if (value) {
        this.isShow = false
      }else{
        this.isShow = true
        this.dateArray.endDate2 = ""
      }


    },
    importFile(){

      axios({
       method: 'get',
       url: 'ideology/party/member/list/export',
       responseType: 'blob',
       params: {

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
       link.setAttribute('download', '团员列表' + '.xlsx')
       document.body.appendChild(link)
       link.click()
     })

    },
    beforeCloseImportCollegeHandler() {
      this.fileList = []
          this.dialogImportCollegeVisible = false;
          this.$refs.childUpload.closeUpload();
          this.showfileInfor = false
          this.fileInforamtion = {
              total: 0,
              success: 0,
              failed: 0,
              exists: 0
          }
          this.showfileInforDetail =false
          this.clickAble = true
    },
    //导入成功返回
      openfileInfor(res){
        if (res !=false ){
          this.randomData = res.randomData
            this.showfileInfor = true
            this.fileInforamtion = res
            this.fileUploadPercent=100
              clearInterval(this.Interval);
                setTimeout(()=>{
                  this.showfileInfor =true
                  this.showfileInforDetail =true
                  this.showProgress=false;
                },2000)
        }else{
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
        }else{
          this.$message({
            type: 'error',
            message: '请重新上传文件'
          });
          return;
        }

     },
    uploadSuccessed(url) {
      this.ruleFormTrans.attachUrls = url
    },
    transIdentity(status,id){
      if (status == 3) {
        this.transFormTitle = "转为发展对象"
      }else if (status == 4) {
        this.transFormTitle = "转为预备团员"
      }else if (status == 5) {
        this.transFormTitle = "转为团员"
      }
      this.dialogVisibleTransForm  = true

      this.ruleFormTrans.identity = status + 1
      this.ruleFormTrans.userId = id


    },
    subruleFormTrans(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
           this.ruleFormTrans.time = this.ruleFormTrans.time.getTime()
           this.$http.post("ideology/party/transfer",this.ruleFormTrans).then( res => {
              if( res.code == '200' ){
                this.$message({
                  type: 'success',
                  message: '转换成功!'
                });
                this.dialogVisibleTransForm = false
                this.fetch()
              }
           })
        }
      })
    },
    beforeCloseTransForm(){
        this.resetForm('ruleFormTrans');
    },
    getClasses(){
      this.$http.get('/organization/party/list/all',{
        params:{
          nature:4
        }
      }).then(res => {
          this.classifies = cascade("0", res.data)
      })
    },
    fetch() {
      this.loading = true
      this.$http.get('/ideology/party/member/list', {
        params: this.params
      }).then(res => {
        this.data = res.data.list
        this.total = res.data.total
        this.loading = false
      })
    },
    search() {
      if (this.dateArray.startDate2 && this.dateArray.endDate2) {
        this.params.startTime = this.dateArray.startDate2.getTime();
        this.params.endTime = this.dateArray.endDate2.getTime();
      }
      if (this.dateArray.startDate2 && !this.dateArray.endDate2) {
        this.open()
        return
      }
       if (!this.dateArray.startDate2 && !this.dateArray.endDate2){
        this.dateArray = []
        this.params.startTime = ""
        this.params.endTime = ""
      }
      this.params.current = 1
      this.fetch()
    },
    changePage(current, size) {
      this.params.current = current
      this.params.size = size
      this.fetch()
    },
    beforeCloseHandler() {
      this.resetForm('ruleForm');
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // change(value) {
    //   if (this.dateArray && this.dateArray.length) {
    //     this.params.startTime = this.dateArray[0].getTime();
    //     this.params.endTime = this.dateArray[1].getTime();
    //   } else {
    //     this.dateArray = []
    //     this.params.startTime = ""
    //     this.params.endTime = ""
    //   }
    // },
    getOrgnaziton() {
      this.$http.get('/organization/party/list', {
        params: {
          current: 1,
          size: 100,
          nature: '4',
        }
      }).then(res => {
        this.organizations = res.data.list
      })
    },
    //远程搜索
     remoteMethod(query) {
       if (query !== '') {
         this.loading = true;

         this.$http.get("/school/query/user",{params:{
             key:query,
             identity:'1,2'
         }}).then(res => {
             this.loading = false;
             this.options4 =  res.data
         })

       } else {
         this.options4 = [];
       }
    },
    submitForm(formName) {
         this.$refs[formName].validate((valid) => {
           if (valid) {
             this.ruleForm.joinTime =  this.ruleForm.joinTime2.getTime()
             if (this.ruleForm.organizationIds.length) {
               this.ruleForm.organizationId = this.ruleForm.organizationIds.join(",")
             }

             this.$http.post("ideology/party/member/add",this.ruleForm).then( res => {
                if( res.code == '200' ){
                  this.$message({
	                  type: 'success',
	                  message: '添加成功!'
	                });
                  this.dialogVisible = false
                  this.fetch()
                }
             })



           }
         })
    }
  },
}
</script>
<style >
#upImgStyle i{
	border-radius:0;
	height: 140px;
	width: 280px;
	line-height: 140px;
}
#upImgStyle img{
	border-radius:0;
	height: 140px;
	width: 280px;
	line-height: 140px;
}

</style>

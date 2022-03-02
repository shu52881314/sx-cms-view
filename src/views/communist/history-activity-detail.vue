<template>
  <section>
    <back :page="$route.query.nature" :status="$route.query.status" goRouter="/communist/historyActivity"></back>
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
                    <a class="el-button el-button--text el-button--mini" href='https://2class.oss-cn-shenzhen.aliyuncs.com/template/%E5%8E%86%E5%8F%B2%E6%B4%BB%E5%8A%A8%E5%AD%A6%E7%94%9F%E5%AF%BC%E5%85%A5.xlsx' size='mini' >模板下载</a>
                  </span>
            </div>
            <el-form-item label="" prop="name">
              <el-col :span="22" >
                <upload-file
                  ref="childUpload"
                  :dataObj="dataObj2"
                  uploadUrl="/school/historyActivityMember/import"
                  uploadType=".xls,.xlsx"
                  uploadSzie="100"
                  uploadSzieTips="只能上传xlx/xlsx文件，且不超过100MB!"
                  @fileInfor="openfileInfor"
                  @setFileList="setFileList"
                  @setProgress="setProgress"
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
            <span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功，<span style="color:#FFC600;">{{fileInforamtion.failed}}</span>条导入失败 <span @click="downFailed()" style="cursor:pointer;color:#4D98FF" v-if="fileInforamtion.failed">下载失败列表</span>
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
    <el-dialog
      title="添加成员" @close="beforeCloseHandler"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="650px">
      <div>
        <el-form  :model="ruleForm" :rules="rules"  ref="ruleForm" label-width="110px" class="demo-ruleForm"  size="mini">
          <el-form-item label="姓名" prop="code">
            <el-col :span="22" >
              <el-select clearable
                         style="width:100%"
                         v-model="ruleForm.code"
                         filterable
                         value-key="value"
                         :multiple-limit=1
                         remote
                         placeholder="请输入关键词"
                         :remote-method="remoteMethod"
                         :loading="loading">
                <el-option
                  v-for="item in options4"
                  :key="item.code"
                  :label="item.name +' - '+ item.code"
                  :value="item.code">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item :label="hoursUnit" required>
            <el-col :span="22" >
              <el-input v-model="ruleForm.hours" ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog title="编辑历史活动" :visible.sync="dialogEditVisible" :close-on-click-modal="false" width="40%">
      <div>
        <el-form size="mini" :model="editActivityForm" ref="editActivityForm" :rules="rules" class="demo-ruleForm"  label-width="120px">
          <el-form-item label="活动名称"  prop="name">
            <el-col :span="16">
              <el-input  placeholder="请输入活动名称" maxlength='30' v-model="editActivityForm.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="活动主办方" prop="organizationId">
            <el-col :span="16">
              <el-select style="width:100%" clearable filterable  v-model="editActivityForm.organizationId"  placeholder="请选择主办方" @change="changeOrganization"  value-key="value" :multiple-limit=1 remote :remote-method="getSponsor" @clear="clearOrganization" :loading="loading">
                <el-option v-for="item in organizationes" :key="item.id" :label="item.name +' - '+ item.type" :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.type }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="管理员" prop="administratorId">
            <el-col :span="16">
              <el-select clearable style="width:100%" v-model="editActivityForm.administratorId" filterable value-key="value" :multiple-limit=1 remote placeholder="请输入关键词" :remote-method="getAdministrator" @clear="clear" :loading="loading">
                <el-option v-for="item in administrator" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="活动分类" prop="classifyIds2" placeholder="请选择活动分类">
            <el-col :span="16">
              <el-cascader  class="activityWidth" v-model="editActivityForm.classifyIds2" :options="optionsClassify" :show-all-levels="true" @change="handleChange" ></el-cascader>
            </el-col>
          </el-form-item>
          <el-form-item label='活动限定类型' v-if='showLimit'>
            <el-col :span="16">
              <el-select :disabled = 'selectAble' v-model="editActivityForm.limitType" :placeholder="selectPlaceholder" @change='selectChange'>
                <el-option
                  v-for="item in limitTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item :label='"活动"+this.hoursUnit' prop="hours">
            <el-col :span="16">
              <el-input v-model="editActivityForm.hours" :placeholder='"请输入"+this.hoursUnit'></el-input>
            </el-col>
          </el-form-item>
          <el-form-item  label="活动时间" style="margin-bottom:20px;"  prop="activityDate">
            <el-col :span="16">
              <el-date-picker
                style="width:100%;"
                @change="changeDate"
                v-model="activityDate"
                type="datetime"
                :picker-options="startDatePicker"
                placeholder="请选择活动时间">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="活动简介" >
            <el-col :span="16">
              <el-input type="textarea" v-model="editActivityForm.introduce" placeholder="请输入活动简介(300字以内)" maxlength='300'></el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitEditForm('editActivityForm')">确定</el-button>
            <el-button @click="dialogEditVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <div class="main-header">
      <span class="main-title">活动详情</span>
    </div>
    <div  class="main-body">
      <div class="detail" style="padding: 10px 20px 10px 0px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="left" width="120" rowspan="4">
              <img style="width:100px;height:100px;" src="../../assets/images/auto-activity.png"/>
            </td>
            <td align="left" colspan="3">
              <span class="detail-head-title " style="font-size: 20px;font-weight: bold;">{{dataInfo.name}}</span>
            </td>
            <td align="right" width="300">
								<el-button type="primary" size="mini" @click='dialogImportCollegeVisible = true' >导入成员</el-button>
								<el-button type="primary" size="mini" @click='dialogVisible = true' >添加成员</el-button>
								<el-button type="primary" size="mini" @click="editActivity">编辑</el-button>
            </td>
          </tr>
          <tr>
            <td align="left">
              <span class="detail-head-title">活动分类:</span>
              <span>{{dataInfo.activityClassifyName}}</span>
            </td>
            <td align="left" >
              <span>限定类型:{{dataInfo.limitType | formatLimitType }}</span>
            </td>
            <td align="left">
              <span class="detail-head-title">{{hoursUnit}}:</span>
              <span>{{dataInfo.hours}}</span>
            </td>
          </tr>
          <tr>
            <td align="left" >
              <span class="detail-head-title">主办方:</span>
              <span>{{dataInfo.organizationName}}</span>
            </td>
            <td align="left" >
              <span class="detail-head-title">管理员:</span>
              <span>{{dataInfo.administratorName}}</span>
            </td>
            <td align="left" >
              <span class="detail-head-title">活动时间:</span>
              <span>{{dataInfo.activityTime | formatDate}}</span>
            </td>
          </tr>
          <tr>
            <td align="left" colspan="3">
              <span class="detail-head-title">活动简介:</span>
              <span>{{dataInfo.introduce}}</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="detail-body">
        <div class="ctime" style="width: 400px;text-align: right;">创建人员: {{dataInfo.creatorName}}&nbsp;&nbsp;创建时间: {{dataInfo.ctime| formatDate}}<span></span></div>
        <el-form size="mini" :inline="true" class="demo-form-inline" @submit.native.prevent>
          <el-form-item label="姓名/学号">
            <el-input v-model="memberPersonalParams.key" placeholder="请输入姓名/学号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="memberPersonal()">查询</el-button>
          </el-form-item>
        </el-form>
              <el-table border :data="memberPersonalList"  size="mini" style="width: 100%"  @selection-change="handleSelectionChange" >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="55" label="序号"> </el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="code" label="学号"></el-table-column>
                <el-table-column  :label="'发放' + hoursUnit" width="220" align="center" >
                  <div slot-scope="scope" style="text-align: center">
                    {{scope.row.hours}}
                  </div>
                </el-table-column>
                <el-table-column label="操作" align="right">
                  <div slot-scope="scope">
                    <el-button  type="text" size="mini" @click="deleteStudent(scope.row.id)">删除</el-button>
                  </div>
                </el-table-column>
              </el-table>
        <div style="padding-top: 20px;">
          <div style="float: left;"><el-button type="text" class="opreat-btn" @click='deletes()' v-if='memberIds.length'>批量删除(只删除本页选中活动人员)</el-button></div>
              <qu-pagination :total="memberPersonalParams.total" @change="changePage"></qu-pagination>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
  import listMixins from '@/mixins/form'
  import {formatDate,getOssToken,getAliyunImageUrl,backAliyunImageUrl} from '@/utils/filters'
  import axios from 'axios'
  import {cascade} from '@/utils/filters'
  export default {
    mixins:[listMixins],
    data(){
      let checkHour= (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入"+this.hoursUnit))
        } else if (!this.checkHours(value)) {
          callback(new Error(this.hoursUnit+'为0-999.99'))
        } else {
          callback()
        }
      }
      let activityDate= (rule, value, callback) => {
        if (this.activityDate === "") {
          callback(new Error("请选择活动日期"))
        }  else {
          callback()
        }
      }
      return {
        dialogEditVisible:false,
        isShow : true,
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
          },
          // minTime:dateArray.startDate2
        },
        editActivityForm: {
          id:this.$route.query.id,
          classifyIds2:[],
          activityClassifyId:'',
          limitType:'',
          name: '',
          organizationId: '',
          organizationIds: '',
          administratorId:'',
          administratorIds:'',
          hours:'',
          activityTime: '',
          activityDate: '',
          introduce: ''
        },
        startDatePicker:this.beginDate(),
        optionsClassify:[],
        administrator: [],
        organizationes: [],
        limitTypeOptions:[],
        selectPlaceholder:'',
        showLimit:false,
        randomData:'',
        fileListName:'',
        fileList:[],
        showfileInfor:false,
        fileInforamtion:{},
        dialogImportCollegeVisible: false,
        dataObj2:{
          historyActivityId:'',
        },
        showProgress:false,
        fileUploadPercent:0,
        showfileInforDetail:false,
        clickAble:true,
        activeName:'详情',
        loadin:true,
        hoursUnit:localStorage.getItem("hoursUnit"),
        dataInfo:{},
        id:this.$route.query.id,
        memberPersonalList:[],
        memberPersonalParams:{
          id:this.$route.query.id,
          current:1,
          size:10,
          key:'',
        },
        dialogVisible:false,
        options4:[],
        loading: false,
        rules: {
          code: [{required: true, message: '请输入姓名或学号搜索',trigger: 'blur' }],
          name: [{required: true, message: '请输入活动名称',trigger: 'blur' }],
          activityDate: [{ required: true,validator: activityDate,trigger: 'change'}],
          hours: [{ required: true,validator: checkHour,trigger: 'blur'}],
          administratorId: [{required: true,message: '请选择活动管理员',trigger: 'change' }],
          classifyIds2: [{required: true, message: '请选择活动分类',trigger: 'change'}],
          organizationId: [{required: true,message: '请选择主办方', trigger: 'change'}]
        },
        ruleForm:{
          id:this.$route.query.id,
          code:'',
          hours:''
        },
        selectAble:true,
        //批量删除
        memberIds:'',
        activityDate:''
      }
    },
    mounted(){
      this.getDataInfo(this.id);
      this.memberPersonal();
      this.systemClassifys();
      this.dataObj2.historyActivityId = this.id
    },
    methods:{
      //修改时间
      changeDate(val){
        this.activityDate=val;
        this.editActivityForm.activityDate=val;
      },
      //批量删除
      handleSelectionChange(val) {
        this.memberIds = val
      },
      deletes() {
        var that = this
        let list = []
        for (var i = 0; i < this.memberIds.length; i++) {
          list.push(this.memberIds[i].id)
        }
        if (!list.length) {
          return
        }
        this.$confirm('是否确定删除' + list.length + '名活动成员吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http.post("/historyActivity/batchDelActivityMember", {
            memberIds: list.join(',')
          }).then((res) => {
            if (res.code == '200') {
              that.$message({
                type: 'success',
                message: '删除成功'
              });
              that.loading = true
              that.memberPersonalList = []
              that.memberIds = []
              that.memberPersonal()
            } else {
              that.$message({
                type: 'error',
                message: res.msg
              });
            }
          }).catch(() => {});
        })

      },
      //编辑
      editActivity(){
        let that=this;
        that.editActivityForm=JSON.parse(JSON.stringify(that.dataInfo));
        that.editActivityForm.classifyIds2 = that.dataInfo.activityClassifyId.split(",").map(function(data) {
          return +data;
        });
        that.activityDate=JSON.parse(JSON.stringify(formatDate(that.dataInfo.activityTime)))
        that.editActivityForm.activityDate=JSON.parse(JSON.stringify(formatDate(that.dataInfo.activityTime)))
        if(that.dataInfo.limitType=='无'){
          that.showLimit = false
        }else if(that.dataInfo.limitType==localStorage.getItem("compulsoryName")){
          that.showLimit=true
        }else{
          that.showLimit=true
        }
        that.editActivityForm.hours=that.dataInfo.hours.toString()
        that.editActivityForm.historyActivityId=that.dataInfo.id
        that.editActivityForm.organizationIds=that.dataInfo.organizationId
        that.editActivityForm.administratorIds=that.dataInfo.administratorId
        that.editActivityForm.organizationId = that.dataInfo.organizationName;
        that.editActivityForm.administratorId = that.dataInfo.administratorName;
        that.dialogEditVisible=true;
      },
      checkHours(str){
        if(str.match(/^\d{1,3}(\.\d{1,2})?$/)){  //判断输入的密码是否符合判定的内容
          return true;
        } else {
          return false;
        }
      },
      beginDate(){//提出开始时间必须小于今天
        let self = this
        return {
          disabledDate(time){
            var times = '';
            times= time.getTime() > Date.now()
            return times//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      getSponsor(query) {
        if (query !== '') {
          this.loading = true;
          this.$http.get("/historyActivity/getOrganization", {
            params: {key: query}
          }).then(res => {
            this.loading = false;
            this.organizationes = res.data
          })
        } else {
          this.organizationes = [];
        }
      },
      clearOrganization(){
        this.organizationes = [];
      },
      changeOrganization(val){
        this.editActivityForm.organizationId=val
      },
      selectChange(value){
      },
      handleChange(value){
        var categoryId=value[value.length-1];
        if(categoryId!=null){
          this.getLimitType(categoryId);
        }
      },
      getLimitType(id){
        this.$http.get('/qu-activity-classify/info',{params:{classifyId:id}}).then(res => {
          if(res.data.length==0){
            this.showLimit=false
            this.editActivityForm.limitType = '0'
          }
          if(res.data.length==1){
            this.showLimit=true
            this.selectAble = true
            this.editActivityForm.limitType = res.data[0].value
          }
          if (res.data.length==2){
            this.showLimit=true
            this.selectAble = false
            this.editActivityForm.limitType = res.data[0].value
          }
          this.limitTypeOptions = res.data
        })
      },
      //提交表单
      submitEditForm(formName){
        var that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(typeof that.editActivityForm.activityDate=='string'){
              that.editActivityForm.activityTime= new Date(that.editActivityForm.activityDate).getTime()
            }else{
              that.editActivityForm.activityTime = that.editActivityForm.activityDate.getTime()
            }
            that.editActivityForm.activityClassifyId = that.editActivityForm.classifyIds2.join(',');
            if (that.editActivityForm.limitType == localStorage.getItem("compulsoryName") || that.editActivityForm.limitType == 1) {
              that.editActivityForm.limitType = 1
            } else if (that.editActivityForm.limitType == localStorage.getItem("electiveName") || that.editActivityForm.limitType == 2) {
              that.editActivityForm.limitType = 2
            } else {
              that.editActivityForm.limitType = 0
            }
            var n = this.editActivityForm.administratorId;
            if (typeof n!='number') {
              this.editActivityForm.administratorId = this.editActivityForm.administratorIds
            }
            var m = this.editActivityForm.organizationId;
            if (typeof m!='number') {
              this.editActivityForm.organizationId = this.editActivityForm.organizationIds
            }
            that.$store.commit('setClick', true)
            that.$http.post('/historyActivity/editHistoryActivity', that.editActivityForm).then(res => {
              if (res.code == '200') {
                that.$refs['editActivityForm'].resetFields();
                that.$message({
                  type: 'success',
                  message: '历史活动编辑成功!'
                });
                that.dialogEditVisible=false;
                this.getDataInfo(this.id);
              } else {
                that.$message({
                  type: "error",
                  message: res.msg
                })
              }
            })
          }
        })
      },
      //远程搜索
      getAdministrator(query) {
        if (query !== '') {
          this.loading = true;
          this.$http.get("/historyActivity/getAdministrator", {
            params: {key: query}
          }).then(res => {
            this.loading = false;
            this.administrator = res.data
          })
        } else {
          this.administrator = [];
        }
      },
      //清除下拉框
      clear() {
        this.administrator = [];
      },
      systemClassifysListChange(value){
        this.params.activityClassifyId = value[value.length-1]
      },
      systemClassifys(){
        this.$http.get('/activity/classifies/list').then(res => {
          this.systemClassifysList = cascade("0", res.data)
          this.optionsClassify = cascade("0", res.data)
          this.systemClassifysList.unshift({label:'不限',value:''})
        })
      },
      open() {
        this.$message('请选择结束日期');
      },
      changeStartDate(value){
        if (value) {
          this.isShow = false
        }else{
          this.isShow = true
          this.dateArray.endDate2 = ""
        }
      },
      //编辑
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let reg = /^\d{1,3}(\.\d{1,2})?$/;
            if (!reg.test(this.ruleForm.hours)) {
              this.$message({
                type: 'error',
                message: '填写'+this.hoursUnit+'在0.00-999.99之间，且只能保留两位小数点'
              });
              return
            }
            this.$http.post("/historyActivity/addHistoryActivityMember", this.ruleForm).then((res) => {
              if (res.code === '200') {
                this.memberPersonal();
                this.dialogVisible = false
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                });
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            })
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //远程搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          this.$http.get("/historyActivity/getUserName", {
            params: {key: query}
          }).then(res => {
            this.loading = false;
            this.options4 = res.data
          })
        } else {
          this.options4 = [];
        }
      },
      beforeCloseHandler() {
        this.resetForm('ruleForm');
      },
      //批量导入
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
        this.showfileInfor = false
        this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.showfileInforDetail =false
        this.$refs.childUpload.closeUpload();
        this.clickAble = true
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
          url: 'school/fail/historyActivityMember/export',
          responseType: 'blob',
          data:{
            randomData:this.randomData,
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
          link.setAttribute('download', '历史活动成员失败信息' + '.xlsx')
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
      },
      //导入成功返回
      openfileInfor(res){
        if (res != false){
          this.randomData = res.randomData
          this.showfileInfor = true
          this.fileInforamtion = res
          this.fileUploadPercent=100
          this.memberPersonal()
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
      },
      submitUpload() {
        if (this.clickAble){
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
      //删除学生
      deleteStudent(id){
        this.$confirm('是否删除此成员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/historyActivity/delStoryActivityMember', {
            id: id
          }).then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.memberPersonal()
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
      changePage(current, size) {
        this.memberPersonalParams.current = current
        this.memberPersonalParams.size = size
        this.memberPersonal()
      },
      memberPersonal(){
        this.$http.get('/historyActivity/historyActivityMemberList', {params: this.memberPersonalParams}).then(res => {
          this.memberPersonalList = res.data.list
          this.memberPersonalParams.total = res.data.total
        }).catch(err => {
        });
      },
      getDataInfo(){
        var that = this
        that.$http.get('/historyActivity/historyActivityDetail', {params: {id:this.id}}).then(res => {
          that.dataInfo = res.data
          if(that.dataInfo.activityClassifyName){
            that.dataInfo.activityClassifyName = that.dataInfo.activityClassifyName.replace(/,/g,"/");
          }
          that.ruleForm.hours=that.dataInfo.hours;
        }).catch(err => {
        });
      },
    },
    filters:{
      formatLimitType(limitType) {
        if(limitType==0){
          limitType='无'
        }else if(limitType==1){
          limitType=localStorage.getItem("compulsoryName")
        }else if(limitType==2){
          limitType=localStorage.getItem("electiveName");
        }
        return limitType;
      }
    }
  }
</script>

<style lang="scss">
  .acitvityUrl li{
    float:left;
    display:inline;

    width:95px;
    height:110px;
    overflow:hidden;
    margin-right:10px;
    img{
      width:100%;
      height:100%;
    }
  }
  .tableClass{
    border-collapse:collapse;
    margin-bottom:20px;
  }
  .tableClass th
  {
    padding:15px;
    border: 1px solid #E4E4E4;
    font-size:14px;
    color:#333;
  }
  .tableClass td
  {
    padding:15px;
    border: 1px solid #E4E4E4;
    color:#666;
    font-size:14px;
  }
  .tableClass .tableLeftBg{
    background:#0099FF;
    text-align:center;
    color:#fff;
  }
  .tableClass .tableLeftBg2{
    background:#6666FF;
    text-align:center;
    color:#fff;
  }
  .tableClass .tableLeftBg3{
    background:#9966FF;
    text-align:center;
    color:#fff;
  }
  .tableClass .tableLeftBg4{
    background:#CC66FF;
    text-align:center;
    color:#fff;
  }
  .tableClass .tableLeftBg5{
    background:#FF6600;
    text-align:center;
    color:#fff;
  }
  .detail-head {
    font-size: 14px;
    padding: 10px 20px;
  }
  .detail-head tr {
    height: 32px;
    line-height: 32px;
  }
  .detail-head .detail-head-title {
    color: #999999;
    margin-right: 10px;
  }
  .el-tabs--border-card {
    -webkit-box-shadow: none
  }
  .ctime {
    width: 200px;
    height: 40px;
    position: relative;
    float: right;
    line-height: 40px;
    font-size: 14px;
    color: #909399;
    z-index: 100;
    margin-right: 30px;
  }
  table th {
    background-color: rgba(242, 243, 251, 1);
  }
  .omit{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

</style>

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
                <a class="el-button el-button--text el-button--mini" download="" href="/static/tpls/历史活动模板.xls" size='mini' >模板下载</a>
               </span>
            </div>
            <el-form-item label="" prop="name">
              <el-col :span="22" >
                <upload-file
                  ref="childUpload"
                  uploadUrl="/school/historyActivity/import"
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
    <div class="main-header">
      <span class="main-title">历史活动</span>
      <p style="color:#999; font-size: 12px; margin-top: 5px;">历史活动主要对线下举办的活动学分进行认定，可通过批量导入及添加的方式进行操作。</p>
      <el-button @click="addactivity" style="position:absolute;right:0px;top:2px;"  type="increase" size="mini" v-perms="'/communist/historyActivity/add'">添加历史活动</el-button>
      <el-button  style="position:absolute;right:120px;top:2px;"  type="primary" size="mini" @click='dialogImportCollegeVisible = true' v-perms="'/communist/historyActivity/import'">导入历史活动</el-button>
      <el-button   style="position:absolute;right:240px;top:2px;"   @click="importFile" type="warning" size="mini">导出</el-button>
    </div>

		<div class="search-box">
			<el-form size="mini" :inline="true" class="demo-form-inline">
        	<el-form-item label="选择分类">
					<el-cascader
            :options="systemClassifysList"
            @change="systemClassifysListChange"
            change-on-select>
				  </el-cascader>
				</el-form-item>
				<el-form-item label="活动日期">
          <el-form-item   >
              <el-col :span="22">
                <el-date-picker
                 @change="changeStartDate"
                 style="width:100%;margin-right: 0px;"
                 v-model="dateArray.startDate2"
                 type="datetime"
                 default-time="00:00:00"
                 placeholder="请选择开始日期">
               </el-date-picker>
              </el-col>
          </el-form-item>
          <span style="color:#606266;font-size:14px;">至</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-form-item    >
              <el-col :span="22">
                <el-date-picker
                 :disabled="isShow"
                 style="width:100%;"
                 start-placeholder="2017 年 03 月 21 日"
                 v-model="dateArray.endDate2"
                 type="datetime"
                 default-time="23:59:59"
                 placeholder="请选择结束日期" :picker-options="pickerOptions1">
               </el-date-picker>
              </el-col>
          </el-form-item>

				</el-form-item>
        <el-form-item label="名称">
					<el-input v-model="params.name" maxlength=30 placeholder="请输入名称搜索"></el-input>
				</el-form-item>
        <el-form-item label="主办方">
          <el-select clearable v-model="params.organizationId"  placeholder="请选择主办方">
                      <el-option
                        v-for="item in organization"
                        :key="item.organizationId"
                        :label="item.organizationName"
                        :value="item.organizationId">
                      </el-option>
          </el-select>
				</el-form-item>
        <el-form-item label="添加人">
          <el-select clearable style="width:100%" v-model="params.creatorId" filterable value-key="value" :multiple-limit=1 remote placeholder="请选择添加人" :remote-method="getCreaterUser" @clear="clearCreaterUser" :loading="loading">
                <el-option v-for="item in createrUser" :key="item.id" :label="item.name" :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                </el-option>
              </el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="mini" type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>

		</div>
		<div class="main-body">
				<el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%" >
          <el-table-column prop="name" label="活动名称" width="240" show-overflow-tooltip></el-table-column>
          <el-table-column prop="organizationName" label="主办方"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="administratorName" label="管理员"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="activityClassifyName" label="活动分类"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="limitType" label="限定类型"  show-overflow-tooltip>
            <div slot-scope="scope">
              <p>{{scope.row.limitType | formatLimitType}}</p>
            </div>
          </el-table-column>
          <el-table-column prop="hours" :label="hoursUnit"  align="left"></el-table-column>
          <el-table-column prop="personCount" label="活动人数"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="activityTime" label="活动时间"  align="left">
            <div slot-scope="scope">
              <p> {{scope.row.activityTime  | formatDate}}</p>
            </div>
          </el-table-column>
          <el-table-column prop="creatorName" label="添加人"  align="left"></el-table-column>
          <el-table-column  label="操作" width="160" align="left">
            <div slot-scope="scope">
              <!-- 可转载站点功能未完成 -->
              <el-button type="text" class="opreat-btn" @click.native="routerLink('history/detail','view',scope.row.id,'',params.current)" >详情</el-button>
              <el-button type="text" class="opreat-btn"  @click.native="editActivity(scope.row)" >修改</el-button>
              <el-button type="text" class="opreat-btn" v-if="scope.row.isdelHistroyActivity==0"   @click.native="deleteBatch(scope.row.id) ">删除</el-button>
              <el-button type="text" class="opreat-btn" style="color: #666" v-if="scope.row.isdelHistroyActivity==1" :title="scope.row.msg" >删除</el-button>
            </div>
          </el-table-column>
        </el-table>
        <qu-pagination :current2="params.current" :total="total" @change="changePage"></qu-pagination>
		</div>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="40%" @close="beforeCloseHandler">
      <el-col :span="22" style="color:red;padding-bottom:20px;" v-if="activity.id==''">
        添加的历史活动默认为已完结状态，导入活动成员后自动发放学时
      </el-col>
      <div>
      <el-form size="mini" :model="activity" ref="activity" :rules="rules" class="demo-ruleForm"  label-width="120px">
        <el-form-item label="活动名称"  prop="name">
          <el-col :span="16">
            <el-input  placeholder="请输入活动名称" maxlength='30' v-model="activity.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="活动主办方" prop="organizationId">
          <el-col :span="16">
            <el-select style="width:100%" clearable filterable  v-model="activity.organizationId"  placeholder="请选择主办方" @change="changeOrganization"  value-key="value" :multiple-limit=1 remote :remote-method="getSponsor" @clear="clearOrganization" :loading="loading">
              <el-option v-for="item in organizationes" :key="item.id" :label="item.name +' - '+ item.type" :value="item.id">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.type }}</span>
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
          <el-form-item label="管理员" prop="administratorId">
            <el-col :span="16">
              <el-select clearable style="width:100%" v-model="activity.administratorId" filterable value-key="value" :multiple-limit=1 remote placeholder="请输入关键词" :remote-method="remoteMethod" @clear="clear" :loading="loading">
                <el-option v-for="item in options4" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="活动分类" prop="classifyIds2" placeholder="请选择活动分类">
            <el-col :span="16">
              <el-cascader   v-model="activity.classifyIds2" :options="optionsClassify" :show-all-levels="true" @change="handleChange" ></el-cascader>
            </el-col>
          </el-form-item>
          <el-form-item label='活动限定类型' v-if='showLimit'>
            <el-col :span="16">
              <el-select :disabled = 'selectAble' v-model="activity.limitType" :placeholder="selectPlaceholder" @change='selectChange'>
                <el-option
                  v-for="item in limitTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="活动学时" prop="hours">
             <el-col :span="16">
                 <el-input v-model="activity.hours" placeholder='活动学时'></el-input>
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
            <el-input type="textarea" v-model="activity.introduce" placeholder="请输入活动简介(300字以内)" maxlength='300'></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('activity')">确定</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { Message } from 'element-ui';
import {cascade,formatDate} from '@/utils/filters'
import axios from 'axios'
export default {
  data() {
    let checkHour= (rule, value, callback) => {
      if (value === "") {
        callback(new Error("活动学时"))
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
      title:'添加历史活动',
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
      hoursUnit:localStorage.getItem("hoursUnit"),
      createrUser:[],
    	organizationes:[],
      organization:[],
      dateArray: {
        startDate2:'',
        endDate2:'',
      },
      loading: false,
			params: {
				current: 1,
				size: 10,
				classify: '',
				startDate: '',
				endDate: '',
        organizationId:'',
        creatorId:'',
				name: '',
        activityClassifyId:''
			},
			data: [],
			total: 0,
			options: [{id: '', name: '不限'}],
      systemClassifysList:[],
      dialogVisible:false,
      activity: {
        id:'',
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
      optionsClassify:[],
      options4: [],
      limitTypeOptions:[],
      selectPlaceholder:'',
      showLimit:false,
      rules: {
        name: [{required: true, message: '请输入活动名称',trigger: 'blur' }],
        activityDate: [{ required: true,validator: activityDate,trigger: 'change'}],
        hours: [{ required: true,validator: checkHour,trigger: 'blur'}],
        administratorId: [{required: true,message: '请选择活动管理员',trigger: 'change' }],
        classifyIds2: [{required: true, message: '请选择活动分类',trigger: 'change'}],
        organizationId: [{required: true,message: '请选择主办方', trigger: 'change'}]
      },
      showfileInfor:false,
      fileInforamtion:{},
      dialogImportCollegeVisible: false,
      showProgress:false,
      fileUploadPercent:0,
      showfileInforDetail:false,
      clickAble:true,
      fileListName:'',
      fileList:[],
      startDatePicker:this.beginDate(),
      selectAble:true,
      activityDate:'',
    }
  },
	methods:{
    //修改时间
    changeDate(val){
       this.activityDate=val;
       this.activity.activityDate=val;
    },
    beforeCloseHandler() {
      this.activity={
          id:'',
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
      }
    },
    addactivity(){
      let that=this;
      that.title='添加历史活动';
      that.dialogVisible=true;
    },
    //打开弹窗，赋值
    editActivity(row){
       let that=this;
       that.title='编辑历史活动';
       that.activity=JSON.parse(JSON.stringify(row));
       that.activity.classifyIds2 = row.activityClassifyId.split(",").map(function(data) {
        return +data;
      });
       that.activityDate=JSON.parse( JSON.stringify( formatDate(row.activityTime)))
       that.activity.activityDate=JSON.parse( JSON.stringify( formatDate(row.activityTime)))
      if(that.activity.limitType==0){
        that.showLimit = false
      }else if(that.activity.limitType==1){
        that.activity.limitType=localStorage.getItem("compulsoryName")
        that.showLimit=true
      }else{
        that.activity.limitType=localStorage.getItem("electiveName");
        that.showLimit=true
      }
      that.activity.hours=that.activity.hours.toString()
      that.activity.historyActivityId=that.activity.id
      that.activity.organizationIds=that.activity.organizationId
      that.activity.administratorIds=that.activity.administratorId
      if (that.activity.administratorId) {
        that.remoteMethod(row.administratorName)
        setTimeout( () => {
          that.activity.administratorId = that.activity.administratorId
        },500)
      }
      if (that.activity.organizationId) {
        that.getSponsor(row.organizationName)
        setTimeout( () => {
          that.activity.organizationId = that.activity.organizationId
        },500)
      }
      // that.activity.organizationId = row.organizationName
      // that.activity.administratorId = row.administratorName
       that.dialogVisible=true;
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
    //导入开始
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
        url: 'school/fail/historyActivity/export',
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
        link.setAttribute('download', '历史活动失败信息' + '.xlsx')
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
        this.fetch();
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
    //导入结束
    //远程搜索
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
      this.activity.organizationId=val
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
          this.activity.limitType = '0'
        }
        if(res.data.length==1){
          this.showLimit=true
          this.selectAble = true
          this.activity.limitType = res.data[0].value
        }
        if (res.data.length==2){
          this.showLimit=true
          this.selectAble = false
          this.activity.limitType = res.data[0].value
        }
        this.limitTypeOptions = res.data
      })
    },
    //提交表单
    submitForm(formName){
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {

          if(typeof that.activity.activityDate=='string'){
            that.activity.activityTime= new Date(that.activity.activityDate).getTime()
          }else{
            that.activity.activityTime = that.activity.activityDate.getTime()
          }
          that.activity.activityClassifyId = that.activity.classifyIds2.join(',');
          if (that.activity.limitType == localStorage.getItem("compulsoryName") || that.activity.limitType == 1) {
            that.activity.limitType = 1
          } else if (that.activity.limitType == localStorage.getItem("electiveName") || that.activity.limitType == 2) {
            that.activity.limitType = 2
          } else {
            that.activity.limitType = 0
          }
          var n = this.activity.administratorId;
          if (typeof n!='number') {
            this.activity.administratorId = this.activity.administratorIds
          }
          var m = this.activity.organizationId;
          if (typeof m!='number') {
            this.activity.organizationId = this.activity.organizationIds
          }
          that.$store.commit('setClick', true)
          if(that.activity.id==''){
            that.$http.post('/historyActivity/addHistoryActivity', that.activity).then(res => {
              if (res.code == '200') {
                that.$refs['activity'].resetFields();
                that.$message({
                  type: 'success',
                  message: '历史活动添加成功!'
                });
                that.dialogVisible=false;
                that.fetch();
              } else {
                that.$message({
                  type: "error",
                  message: res.msg
                })
              }
            })
          }else{
            that.$http.post('/historyActivity/editHistoryActivity', that.activity).then(res => {
              if (res.code == '200') {
                that.$refs['activity'].resetFields();
                that.$message({
                  type: 'success',
                  message: '历史活动编辑成功!'
                });
                that.dialogVisible=false;
                that.fetch();
                that.activity={}
                that.activityDate=''
              } else {
                that.$message({
                  type: "error",
                  message: res.msg
                })
              }
            })
          }
        }
      })
    },
    //远程搜索
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.$http.get("/historyActivity/getAdministrator", {
          params: {key: query}
        }).then(res => {
          this.loading = false;
          this.options4 = res.data
        })
      } else {
        this.options4 = [];
      }
    },
    //清除下拉框
    clear() {
      this.options4 = [];
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
    importFile(){
      axios({
       method: 'get',
       url: '/activity/list/HistoryActivityExport',
       responseType: 'blob',
       params: this.params
     }).then((res) => {
       if (!res) {
         return
       }
       var filename = name;
       let url = window.URL.createObjectURL(res)
       let link = document.createElement('a')
       link.style.display = 'none'
       link.href = url
       link.setAttribute('download', '历史活动列表' + '.xlsx')
       document.body.appendChild(link)
       link.click()
     })

    },
    getOrganization(){
      this.$http.get("/activity/organization/list",{params:{
          type:1
        }}).then(res => {
        this.organization = res.data
      })
    },
    getCreaterUser(query){
      this.$http.get("/historyActivity/getCreaterUser",{params:{
          key:query
        }}).then(res => {
        this.createrUser = res.data
      })
    },
    clearCreaterUser() {
      this.createrUser = [];
    },
		fetch() {
			this.loading = true
			this.$http.get('/historyActivity/historyActivityList', {params: this.params}).then(res => {
        if (res.code == '200') {
          this.data = res.data.list
  				this.total = res.data.total
  				this.loading = false
        }
			})
		},
		search() {
      if (this.dateArray.startDate2 && this.dateArray.endDate2) {
        this.params.startDate = this.dateArray.startDate2.getTime();
        this.params.endDate = this.dateArray.endDate2.getTime();
      }
      if (this.dateArray.startDate2 && !this.dateArray.endDate2) {
        this.open()
        return
      }
      if (!this.dateArray.startDate2 && !this.dateArray.endDate2) {
        this.dateArray = []
        this.params.startDate = ""
        this.params.endDate = ""
      }
			this.params.current = 1
			this.fetch()
		},
		changePage(current, size){
			this.params.current = current
			this.params.size = size
			this.fetch()
		},
		deleteBatch(id,status,name){
			var that = this
			var ids = id+''
			this.$confirm('此操作将永久删除该活动 是否继续?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
						}).then(() => {
				this.$http.post('/historyActivity/delHistoryActivity', {
					id:id
				}).then(res => {
					if(res.code == '200'){
               	that.$message({
										type: 'success',
										message: '删除成功!'
				           });
				      	that.fetch()
					}
					}).catch(error => {
				});
			})
		}
	},
	created(){
    this.systemClassifys()
		this.getSponsor()
		this.getOrganization()
		this.getCreaterUser()
	},
	mounted(){

    if (this.$route.query.page) {
      this.params.current = parseInt(this.$route.query.page)
    }

    this.fetch()

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
<style>

</style>

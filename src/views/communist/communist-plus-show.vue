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
                    <a class="el-button el-button--text el-button--mini" download="" href='/static/tpls/加分项模板.xlsx' size='mini' >模板下载</a>
                  </span>
                </div>
                <el-form-item label="" prop="name">
                 <el-col :span="22" >
                   <upload-file
                   ref="childUpload"
                   :dataObj="dataObj2"
                   uploadUrl="/school/remark-punish/project/member/import"
                   uploadType=".xls,.xlsx"
                   uploadSzie="100"
                   uploadSzieTips="只能上传xlx/xlsx文件，且不超过100MB!"
                   @fileInfor="openfileInfor"
                   v-on:childByValue='ishaveFile'
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




       <back></back>
	    <el-dialog
		title="添加加分项学生" @close="beforeCloseHandler"
		:visible.sync="dialogVisible"
		:close-on-click-modal="false"
		width="650px">
		<div>
		<el-form  :model="ruleForm" :rules="rules"  ref="ruleForm" label-width="110px" class="demo-ruleForm">
			<el-form-item label="学生" prop="userId">
				<el-col :span="22" >
					 <el-select clearable
                        style="width:100%"
                         v-model="ruleForm.userId"
                         filterable
                         value-key="value"
                         :multiple-limit=1
                         remote
                         placeholder="请输入姓名/学号"
                         :remote-method="remoteMethod"
                         :loading="loading">
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
			<el-form-item :label=" '加' + hoursUnit" prop="hours">
				<el-col :span="22" >
					<el-input maxlength="6" v-model="ruleForm.hours"></el-input>
				</el-col>
			</el-form-item>
		  <el-form-item label="备注" prop="des">
				<el-col :span="22" >
					<el-input type="textarea"  :rows="2" v-model="ruleForm.des" maxlength='300'></el-input>
				</el-col>
			</el-form-item>
			<el-form-item>
			<el-button :disabled="$store.state.sys.isClick"  type="primary" @click="submitForm('ruleForm')">添加</el-button>
			</el-form-item>
		</el-form>
		</div>
		</el-dialog>


		<div class="main-header">
			<span class="main-title">
				<p style="width: 60%;">加分项详情</p>
				<span style="font-size:12px;color:#999">学生有突出表现获得加分的，可进行添加或批量导入</span>
			</span>
			<div class="main-btn-box" style="margin-right:40px;">
          <el-button   type="primary" size="mini" @click="dialogImportCollegeVisible = true" >导入学生</el-button>
					<el-button @click="dialogVisible = true" type="primary" size="mini" v-perms="'/communist/plus/student/add'">添加学生</el-button>
			</div>
		</div>

		<div class="plusShow-towTitle">
			<p style="font-size:16px;color:#333; margin-bottom: 10px;">{{showDetail.name}}</p>
      <div style="overflow: hidden;"><div style="width: 30%;float: left;">分类名称：{{showDetail.classifyName}}</div><div style="width: 20%;float: left;">限定类型：{{showDetail.limitType | formatLimitType}}</div></div>
      <div style="overflow: hidden;"><div style="width: 30%;float: left;">添加时间：{{showDetail.ctime | formatDate}}</div><div style="width: 20%;float: left;">添加人：{{showDetail.creatorName}}</div></div>
			<div style="word-wrap: break-word;">备注：{{showDetail.des}}</div>
		</div>

		<div class="search-box">
			<el-form size="mini" :inline="true" class="demo-form-inline">
				<el-form-item label="日期">
					<el-date-picker  @change="changeDate" clearable size="mini" class="selectWidth" :editable="false" type="daterange" v-model="dateArray" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item >
					<el-input v-model="params.keyWord" placeholder="请输入姓名/学号搜索"  maxlength=30 ></el-input>
				</el-form-item>

				<el-form-item>
					<el-button size="mini" type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</div>

		<div class="main-body">
		<el-table :loading="loading" :data="data" stripe size="mini" style="width: 100%" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55"></el-table-column>
		      <el-table-column type="index" width="55" label="序号"> </el-table-column>
          <el-table-column prop="userName" label="姓名"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="code" label="学号"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="hours" :label="'加' + hoursUnit"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="ctime" label="添加时间">
              <div slot-scope="scope">
                  {{scope.row.ctime | formatDate}}
              </div>
          </el-table-column>
          <el-table-column prop="des" label="备注"  show-overflow-tooltip></el-table-column>
          <el-table-column  label="操作">
            <div slot-scope="scope">
              <el-button type="text" class="opreat-btn" @click.native='deletes(scope.row.id)'>删除</el-button>
            </div>
          </el-table-column>
        </el-table>
        <div style="padding-top: 20px;">
					<div style="float: left;"><el-button type="text" class="opreat-btn" @click='deletes()' v-if='applyIds.length'>批量删除(仅删除本页选中学生)</el-button></div>
					<qu-pagination :total="total" @change="changePage"></qu-pagination>

				</div>
		</div>
  </section>
</template>
<script>
import axios from 'axios'
import listMixins from '@/mixins/form'
import {
      isFloat
  } from '@/utils/validate'

export default {
	  mixins:[listMixins],
  data() {
let that = this
			 var validCode2 = (rule, value, callback) => {
			     if (!value) {
			         callback(new Error('请输入'+that.hoursUnit))
			     } else if (!isFloat(value)) {
			         callback(new Error('请输入正确的'+that.hoursUnit))
			     }else if(value<0.01||value>999.99){
			     		 callback(new Error('填写'+that.hoursUnit+'位数有误，填写的'+that.hoursUnit+'在0.01-999.99之间'))
			     } else {
			         callback()
			     }
			 };
    return {
      randomData:'',
      fileListName:'',
      fileList:[],
    	ishaveFile3:true,
    	ishaveFile2:'',
    	applyIds:[],
           hoursUnit:localStorage.getItem("hoursUnit"),
            dataObj2:{
              projectId:'',
              type:1
            },
           IsClick:false,
            dialogVisible: false,
            loading: false,
            dateArray:[],
            options4:[],
			params: {
				current: 1,
				size: 10,
				startDate: '',
				endDate: '',
				projectId:'',
				keyWord: '',
			},
			ruleForm: {
         name: '',
         parents:[],
				 des: '',
				 type:1,
				 projectId:'',
			},
			rules:{
         hours: [{
            required: true,
            trigger: 'blur',
            validator: validCode2
         }],
				 userId: [{
                  required: true,message: '请选择学生',trigger: 'change'
				 }],
				 des: [{
                  required: true,message: '请输入备注',trigger: 'blur'
                 }],
			},
			data: [],
			total: 0,
			showDetail:{},
			options: [{id: '', name: '不限'}],
      showfileInfor:false,
      fileInforamtion:{

      },
      dialogImportCollegeVisible: false,
      showProgress:false,
      fileUploadPercent:0,
      showfileInforDetail:false,
      clickAble:true,
    }
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
      this.fileUploadPercent = 0
      this.showfileInfor = false
      this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
      }
      this.$refs.childUpload.closeUpload();
      this.showfileInforDetail =false
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
       url: 'school/fail/hours/export',
       responseType: 'blob',
       data:{
        randomData:   this.randomData,
        type:1
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
       link.setAttribute('download', '加分项成员失败信息' + '.xlsx')
       document.body.appendChild(link)
       link.click()
     })

    },
		ishaveFile(val){
			if(this.ishaveFile2 == ''){
				this.ishaveFile2 = val
			}
			if(this.ishaveFile2 != val){
				this.ishaveFile2 = val
				this.ishaveFile3 = true
			}
	  },
    beforeCloseImportCollegeHandler() {
      this.fileList = []
      this.showfileInfor = false
          this.dialogImportCollegeVisible = false;
          this.$refs.childUpload.closeUpload();
          this.showfileInfor = false
					this.ishaveFile2 = ''
					this.ishaveFile3 = true
					this.$store.commit('setClick',false)
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

        if(res != false){

          this.randomData = res.randomData
          this.showfileInfor = true
          this.fileInforamtion = res
          if(res.failed == 0){
	          		this.dialogImportCollegeVisible = false;
		      			this.loading=true
		      			this.data = []
	          		this.fetch()
	          		this.$message({
                  		type: 'success',
                  		message: '导入成功'
                	});
	          	}
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
          // this.fileList = []
        }

          // this.dialogImportCollegeVisible = false;
      },
      submitUpload() {

        if (this.clickAble){
          this.setProgress()
        	this.$store.commit('setClick',true)
            this.$refs.childUpload.submitUpload2()
            this.ishaveFile3 = false
        }else{
          this.$message({
            type: 'error',
            message: '请重新上传文件'
          });
          return;
        }

     },
		 submitForm(formName){

         this.$refs[formName].validate((valid) => {
            if (valid) {

				this.ruleForm.classifyId = this.ruleForm.parents.join(',');

			this.$store.commit('setClick',true)

              this.$http.post("/reward-punish/project/member/add", this.ruleForm).then((res) => {

                  if (res.code === '200') {
			          this.fetch();
			          this.dialogVisible = false
                      this.$message({
                          type: 'success',
                          message: '添加成功!'
                      });
                  }
              })

            }
          })


      },
		 //远程搜索
        remoteMethod(query) {
          if (query !== '') {
            this.loading = true;

            this.$http.get("/school/query/user/list",{params:{
                key:query
            }}).then(res => {
                this.loading = false;
                this.options4 =  res.data
            })


          } else {
            this.options4 = [];
          }
       },
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		beforeCloseHandler() {
			this.resetForm('ruleForm');
		},
        changeDate(){
            if (this.dateArray && this.dateArray.length) {
                this.params.startDate = this.dateArray[0].getTime();
                if(this.dateArray[1].getTime()){
                	this.params.endDate = this.dateArray[1].getTime()+86399000;
                }
                }else{
                this.dateArray = []
                this.params.startDate = ""
                this.params.endDate = ""
                }
	   },
	   getDetail(){
		   this.$http.get('/reward-punish/project/detail', {params: {projectId:this.id}}).then(res => {
      	this.showDetail = res.data
		    })
	   },
		fetch() {
			this.loading = true
			this.$http.get('/reward-punish/project/member/list', {params: this.params}).then(res => {
				this.data = res.data.list
				this.total = res.data.total
				this.loading = false
			})
		},
		search() {
			this.params.current = 1
			this.fetch()
		},
		changePage(current, size){
			this.params.current = current
			this.params.size = size
			this.data = []
			this.fetch()
		},
		handleSelectionChange(val) {
			this.applyIds = val
       },
    deletes(id){
			 	var that = this
			 	let list =[]
			 	var s = ''
			 	if(id){
			 		list.push(id)
			 		s = '是否确定删除该学生?'
			 	}else{
			 		for(var i = 0; i<this.applyIds.length; i++){
			 			list.push(this.applyIds[i].id)
			 		}
			 		s = '是否确定删除'+list.length+'名加分项学生?'
			 	}
			 	if(!list.length){
			 		return
			 	}
			 	this.$confirm(s, '提示', {
		            confirmButtonText: '确定',
		            cancelButtonText: '取消',
		            type: 'warning'
		        }).then(() => {
		          	that.$http.post("/reward-punish/project/apply/delete",{
		          		applyIds:list.join(','),
		          		type:'1'
		          	}).then( (res) => {
	                  	if (res.code == '200') {
	                  		that.$message({
	                      		type: 'success',
	                      		message: '删除成功'
	                    	});
		      				that.loading=true
		      				that.data = []
	                    	that.applyIds = []
	                  		that.fetch()
	                  	}else{
	                    	that.$message({
	                      	type: 'error',
	                      	message: res.msg
	                    	});
	                  	}
	                	}).catch(() => {
	              	});
		        }).catch(() => {
			        this.$message({
			          type: 'info',
			          message: '已取消'
			        });
			      });

	  		},
	},
	created(){
		this.params.projectId = this.id
		this.ruleForm.projectId = this.id
    this.dataObj2.projectId = this.id
	},
	mounted(){
		this.getDetail()
		this.fetch();
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
<style scoped>
  .plusShow-towTitle{
	  font-size:14px;
	  line-height:25px;
	  padding-top:20px;
	  color:#999
  }
</style>

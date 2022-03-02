<template>
<section>
<!-- <back v-if="id"></back> -->
<div class="main-header">
    <span class="main-title">发布活动</span>
</div>
<div class="main-body">



    <el-form  :model="activity" size="medium" :rules="rules" ref="activity"  label-width="120px" class="demo-ruleForm">

         <div>
           <el-row class="activity-info">
			 <div class="basic-title"><span>基本信息</span></div>
              <el-col  :md="13">


                  <el-form-item label="活动名称" prop="name">
                      <el-col :span="22">
                          <el-input  v-model="activity.name" placeholder="请输入活动名称" maxlength='30'></el-input>
                      </el-col>
                  </el-form-item>

                  <el-form-item label="活动主办方" prop="organizationId">
                      <el-col :span="22">
                          <el-select class="activityWidth" clearable v-model="activity.organizationId"  placeholder="请选择主办方">
                            <el-option
                              v-for="item in organizationes"
                              :key="item.organizationId"
                              :label="item.organizationName"
                              :value="item.organizationId">
                            </el-option>
                          </el-select>
                      </el-col>
                  </el-form-item>

                  <el-form-item label="活动地点" prop="address">
                      <el-col :span="22">
                          <el-input v-model="activity.address" placeholder="请输入活动地点" maxlength='100'></el-input>
                      </el-col>
                  </el-form-item>

                  <el-form-item label="活动人数" prop="peopleLimit">
                      <el-col :span="22">
                          <el-input v-model.number="activity.peopleLimit"></el-input>
                      </el-col>
                  </el-form-item>


                  <el-form-item label="活动日期" prop="activityDate">
                      <el-col :span="22">
                          <el-date-picker class="activityWidth" :editable="false" type="datetimerange" v-model="activity.activityDate" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm">
                          </el-date-picker>
                      </el-col>
                  </el-form-item>

                  <el-form-item label="报名结束日期" prop="enrollEndTimes">
                      <el-col :span="22">
                          <el-date-picker  class="selectWidth" :editable="false" format="yyyy-MM-dd HH:mm" type="datetime" v-model="activity.enrollEndTimes">
                          </el-date-picker>
                      </el-col>
                  </el-form-item>

                  <el-form-item label="活动简介" prop="introduce">
                      <el-col :span="22">
                          <el-input type="textarea" v-model="activity.introduce" placeholder="请输入活动简介" maxlength='300'></el-input>
                      </el-col>
                  </el-form-item>

                  <!--<el-form-item label="活动学时" prop="hours">
                     <el-col :span="22">
                         <el-input v-model="activity.hours"></el-input>
                     </el-col>
                 </el-form-item>-->

                  <el-form-item label="活动管理员" prop="managerId">
                    <el-col :span="22" >
                        <el-select
                        clearable
                        style="width:100%"
                         v-model="activity.managerId"
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
                           :label="item.name +' - '+ item.code"
                           :value="item.id">
                             <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                         </el-option>
                       </el-select>
                    </el-col>
                  </el-form-item>

               </el-col>
           </el-row>

            <el-row class="activity-info">
			 <div class="basic-title"><span>活动分类</span></div>
              <el-col  :md="13">


                 <!-- <el-form-item label="活动标签" prop="tagId">
                     <el-col :span="22">
                         <el-select  class="activityWidth" v-model="activity.tagId">
                             <el-option v-for="tag in tags" :value-key="tag.id" :key="tag.id" :value="tag.id" :label="tag.name"></el-option>
                         </el-select>
                     </el-col>
                 </el-form-item> -->

                 <el-form-item label="活动分类" prop="classifyIds2" placeholder="请选择活动分类">
                     <el-col :span="22">
                         <el-cascader class="activityWidth" v-model="activity.classifyIds2"  :options="options" change-on-select :show-all-levels="true"></el-cascader>
                     </el-col>
                 </el-form-item>

                 <el-form-item label="参与院系" prop="departmentIdLimit3">
                     <el-col :span="22">


                         <el-radio-group @change="departmentStateChange" v-model="activity.departmentIdLimit2">
                             <el-radio label="0">全部</el-radio>
                             <el-radio label="1">选择</el-radio>
                         </el-radio-group>

                         <template>
                              <div v-show="activity.departmentIdLimit2==1">
                                <el-select @change="departmentStateChange2" style="width:100%"   v-model="activity.departmentIdLimit3" multiple placeholder="请选择">
                                   <el-option
                                     v-for="item in departments"
                                     :key="item.id"
                                     :label="item.name"
                                     :value="item.id">
                                   </el-option>
                                 </el-select>
                              </div>
                         </template>
                     </el-col>
                 </el-form-item>
                 <el-form-item label="参与年级" prop="gradeLimits">
                     <el-col :span="22">

                           <el-select style="width:100%" multiple v-model="activity.gradeLimits"  placeholder="请选择">
                             <el-option v-for="tag in grades" :value-key="tag.id" :key="tag.id" :value="tag.id" :label="tag.name"></el-option>
                           </el-select>

                         <!-- <el-checkbox v-model="gradeStateAll" @change="gradeStateChange">全选</el-checkbox>
                         <div style="margin: 15px 0;"></div>
                         <el-checkbox-group  @change="handleCheckedGradeChange" v-model="activity.gradeLimit">
                             <el-checkbox  v-for="item in grades" :key="item" :label="item">{{item}}级</el-checkbox>
                         </el-checkbox-group> -->

                     </el-col>
                 </el-form-item>
                 <el-form-item label="参与性别" prop="genderLimit">
                     <el-col :span="22">
                         <el-radio-group v-model="activity.genderLimit">
                             <el-radio :label="0">不限</el-radio>
                             <el-radio :label="1">男</el-radio>
                             <el-radio :label="2">女</el-radio>
                         </el-radio-group>
                     </el-col>
                 </el-form-item>
                 <el-form-item label="参与组织"  prop="tribeIdLimit3">
                     <el-col :span="22">


                         <el-radio-group @change="tribeStateChange" v-model="activity.tribeIdLimit2">
                             <el-radio label="0">全部</el-radio>
                             <el-radio label="1">选择</el-radio>
                         </el-radio-group>

                         <template>
                              <div v-show="activity.tribeIdLimit2 == 1">
                                <el-select @change="handleCheckedTribeChange" filterable style="width:100%"   v-model="activity.tribeIdLimit3" multiple placeholder="请选择">
                                   <el-option
                                     v-for="item in tribes"
                                     :key="item.id"
                                     :label="item.name"
                                     :value="item.id">
                                   </el-option>
                                 </el-select>
                              </div>
                         </template>

                     </el-col>
                 </el-form-item>

                 <el-form-item label="联系方式" prop="contact">
                     <el-col :span="22">
                         <el-input v-model="activity.contact"></el-input>
                     </el-col>
                 </el-form-item>

            </el-col>
           </el-row>

            <el-row class="activity-info">
			 <div class="basic-title"><span>其他信息</span></div>
              <el-col  :md="13">


				 <el-form-item label="报名需要审核">
                     <el-col :span="22">
                         <el-radio-group v-model="activity.signAudit">
                             <el-radio label="1">是</el-radio>
                             <el-radio label="0">否</el-radio>
                         </el-radio-group>
                     </el-col>
                 </el-form-item>
                 <el-form-item label="报名方式">
                     <el-col :span="22">
                         <el-radio-group v-model="activity.signLimit">
                             <el-radio label="0">不限</el-radio>
                             <el-radio label="1">个人</el-radio>
                             <el-radio label="2">团队</el-radio>
                         </el-radio-group>
                     </el-col>
                 </el-form-item>
                 <el-form-item label="是否投票">
                     <el-col :span="22">
                         <el-switch @change="changeVote" v-model="activity.isVote" :active-value="1" :inactive-value="0"> </el-switch>
                     </el-col>
                 </el-form-item>
                 <template>


              <div  v-if="activity.isVote">
                 <el-form-item label="每日投票">
                     <el-col :span="22">
                         <el-radio-group v-model="activity.isVoteEveryDay">
                             <el-radio :label="0">是</el-radio>
                             <el-radio :label="1">否</el-radio>
                         </el-radio-group>
                     </el-col>
                 </el-form-item>
                     <el-form-item label="投票开始时间" prop="voteTime">
                       <el-col :span="22" >
                         <el-col :span="22" >
                           <el-date-picker class="selectWidth" v-model="activity.voteTime"
                           type="datetimerange"
                           range-separator="至"
                           start-placeholder="开始日期"
                           end-placeholder="结束日期">
                         </el-date-picker>
                         </el-col>
                       </el-col>
                     </el-form-item>
                   </div>
                 </template>

               </el-col>
           </el-row>

           <el-row>
              <el-col :md="13">
                  <el-form-item label="上传海报" prop="logo">
                     <upload id="uploadSquar" :image='activity.logo' upload="/upload/image" @uploadSuccessed="uploadSuccessed2">

					</upload>
                 </el-form-item>
                 <el-form-item label="上传附件">
                   <uploadMore type="1" :imageList='activity.attachUrls2'  upload="/upload/image" @uploadSuccessed="uploadSuccessed">
                   </uploadMore>
                 </el-form-item>

                 <el-form-item>
                      <el-button  type="primary" @click="submit('activity')">确认提交</el-button>
                 </el-form-item>
             </el-col>
           </el-row>

         </div>

     </el-form>
	</div>

  </section>

</template>
<script>
import {cascade,formatDate,getOssToken,getAliyunImageUrl} from '@/utils/filters'
import listMixins from '@/mixins/form'
export default {
    mixins:[listMixins],
    data() {
        return {
           organizationes:[],
           IsAlldepartment:false,
           IsAlldepartmentVote:false,
           IsAlltribe:false,
           active: 0,
           activityNormal:{},
           activity:{
             name:'',
             organizationId:'',
             address:'',
             peopleLimit:'',
             activityDate:[],
             startTime:'',
             endTime:'',
             enrollEndTime:'',
             enrollEndTimes:'',
             introduce:'',
             managerId:'',

             classifyIds2:[],
             collegeLimit:"0",
             departmentIdLimit2:"0",
             departmentIdLimit3:[],
             gradeLimits: [],
             gradeLimit: [],
             genderLimit:0,
             organizationLimit:"0",
             tribeIdLimit2:"0",
             tribeIdLimit3:[],
             contact:'',
             signAudit:'0',
             signLimit:'0',
             isVote:0,
             isVoteEveryDay:0,
             voteTime:[],
             voteStartTime:'',
             logo:'',
             attachUrls:[],
             attachUrls2:[],
           },
           IsActiveStep1:true,
           IsActiveStep2:false,
           IsActiveStep3:false,
              rules: {
              	logo:[{
              		required: true,message: '请上传海报',trigger: 'blur'
              	}],
               name: [{
                 required: true,message: '请输入活动名称',trigger: 'blur'
               }],
                organizationId: [{
                  required: true,message: '请输入活动主办方',trigger: 'blur'
                }],
                address: [{
                    required: true,message: '请填写活动地点',trigger: 'blur'
                }],
                peopleLimit: [
                  {required: true,message: '请输入参与人数',trigger: 'blur'},
                  { type: 'number', message: '参与人数必须为数字值'}
                ],
                activityDate: [{
                   required: true,message: '请选择活动日期',trigger: 'change'
                }],
                enrollEndTimes: [{
                    required: true,message: '请选择报名结束日期',trigger: 'change'
                }],
                 introduce: [{
                    required: true,message: '请输入活动简介',trigger: 'blur'
                }],
                hours: [{
                    required: true,message: '请输入活动学时',trigger: 'blur'
                }],
                managerId: [{
                    required: true,message: '请选择活动管理员',trigger: 'change'
                }],
                // tagId: [{
                //     required: true,message: '请选择活动标签',trigger: 'change'
                // }],
                classifyIds2: [{
                    required: true,message: '请选择活动分类',trigger: 'change'
                }],
                organizationId: [{
                    required: true,message: '请选择主办方',trigger: 'change'
                }],
                gradeLimits: [{
                    required: true,message: '请选择参与年级',trigger: 'change'
                }],
                contact: [{
                    required: true,message: '请输入联系方式',trigger: 'blur'
                }],

            },
            tags: [],
            tribes: [],
            departments: [],
            grades: [],
            departmentStateAll:false,
            departmentStateAllLimit:false,
            gradeStateAll:false,
            gradeLimitAll:false,
            tribeStateAll:false,
            departmentState: true,
            gradeState: true,
            tribeState: true,
            isVote:false,
            options4: [],
            list: [],
            options:[],
            loading: false,
            states: [
                {
                    id:1,
                    code:'111',
                    name:'学生1'
                },
                {
                    id:2,
                    code:'121',
                    name:'学生2'
                }
            ]
        }
    },
    created() {
        this.getSponsor();
        this.getClassify();
        // this.getTags();
        this.getdepartment()
        this.getOraganziton()
        this.getClass()
    },
    mounted() {
         if(this.id){
            this.getInfo(this.id)
         }

    },
    methods: {
        getInfo(id){
            this.$http.get('/activity/detail', {params: {id:id}}).then(res => {
                 this.activity.name = res.data.activityName
                 this.activity.organizationId = res.data.organizationId
                 this.activity.address = res.data.address
                 this.activity.peopleLimit = res.data.peopleLimit
                 this.activity.enrollEndTimes =  new Date(res.data.enrollEndTime)
                 this.activity.introduce = res.data.introduce
                 // this.activity.tagId = res.data.tagId
                 this.activity.contact = res.data.contact

                 this.activity.activityDate = [  new Date(res.data.startTime) , new Date(res.data.endTime)]

  	            this.activity.classifyIds2=res.data.classifyId.split(",").map(function(data){
                     return +data;
  	            });

             this.activity.managerId = res.data.adminName
             this.activity.adminId = res.data.adminId

                if(res.data.collegeLimit == "0"){
                    this.activity.departmentIdLimit2 = "0"
                }else{
                    this.activity.departmentIdLimit2 = "1"
                    this.activity.departmentIdLimit3 = res.data.collegeLimit.split(",")
                    this.activity.departmentIdLimit3 = this.activity.departmentIdLimit3.map(item=>{
                      return parseInt(item)
                    })
                }

                this.activity.gradeLimit = res.data.gradeLimit.split(",")
                this.activity.gradeLimits = res.data.gradeLimit.split(",")

                if(res.data.organizationLimit == "0"){
                     this.activity.tribeIdLimit2 = "0"
                }else{
                      this.activity.tribeIdLimit2 = "1"

                      this.activity.tribeIdLimit3 = res.data.organizationLimit.split(",")
                      this.activity.tribeIdLimit3 = this.activity.tribeIdLimit3.map(item=>{
                        return parseInt(item)
                      })
                }

                this.activity.logo  =  getAliyunImageUrl(res.data.logo,100,100)

                this.activity.attachUrls2  = res.data.urls.split(",")

               this.activity.attachUrls2 = this.activity.attachUrls2.map( item => {

                  return   getAliyunImageUrl(item,100,100)
                })

                this.activity.attachUrls2  = this.activity.attachUrls2.map(item => {
                  return{
                    url:item
                  }
                })


                this.activity.signAudit  = res.data.signAudit + ''
                this.activity.signLimit  = res.data.signLimit + ''
                this.activity.isVote  = res.data.isVote

                if (res.data.isVote) {
                     this.activity.voteTime = [res.data.voteStartTime,res.data.voteEndTime]
                }




			}).catch(err => {

			});
        },
        demossdf(value){
        },
        getClass(){
            this.$http.get("/school/grade/partake/list").then(res => {
                this.grades = res.data
            })
        },
        getOraganziton(){
            this.$http.get("/organization/department",{params:{nature:''}}).then(res => {
                this.tribes = res.data
            })
        },
        getTags(){
			this.$http.get('/school/activity/tag/list').then(res => {
				this.tags = res.data
			})
        },
        getdepartment(){
            this.$http.get('/school/college/list').then(res => {
				    this.departments = res.data
		 	})
        },
        getClassify(){
			this.$http.get('/activity/classifies/list').then(res => {
				this.options = cascade("0", res.data)
			})
		},
        getSponsor(){
          this.$http.get('/activity/organization/list',{
  	        params:{
  	          type:3
  	        }
  	      }).then(res => {
              this.organizationes = res.data
  	      })
		   },
       uploadSuccessed(url) {

        var that = this
        this.$set(this.activity,'attachUrls2', url)
       },
       uploadSuccessed2(url) {

        var that = this
        this.$set(this.activity,'logo', url)
       },
        changeAdmin(value){
          if (value) {
            this.$http.get('/api/v1/tribe/user', {
                params: {
                    userId: value
                }
            }).then(res => {
                this.sponsors = res.data
            })
          }

        },
        changeTag(value) {
            this.activity.tagId = value;
            this.$http.get('/api/v1/activity/classifies', {
                params: {
                    tagId: this.activity.tagId
                }
            }).then(res => {
                this.classifies = cascade("0", res.data)
            })
        },
        //参与院系选择
        departmentStateChange(val) {
            if (val==0) {
              this.IsAlldepartment = false;
              // this.rules.departmentIdLimit3 = "";
              this.activity.collegeLimit = "0"
            }else{
              this.IsAlldepartment = true;
              // this.rules.departmentIdLimit3 = [{required: true,message: '请选择参与院系',trigger: 'change'}];
              this.activity.collegeLimit = this.activity.departmentIdLimit3
            }
        },
        departmentStateChange2(value){
           this.activity.collegeLimit = value
        },
        //限制院系选择
        departmentLimitChange(val) {
          if (val==0) {
            this.IsAlldepartmentVote = false;
            this.rules.voteDepartmentIdLimit3 = "";
            this.activitySuccess.collegeLimit = "0"
          }else{
            this.IsAlldepartmentVote = true;
            this.rules.voteDepartmentIdLimit3 = [{required: true,message: '请选择参与院系',trigger: 'change'}];
            this.activitySuccess.collegeLimit = this.activityClass.voteDepartmentIdLimit3
          }
        },

        handleCheckedGradeChange(value){
          let checkedCount = value.length;
          this.gradeStateAll = checkedCount === this.grades.length;
        },

        handleGradeLimitChange(value){
          let checkedCount = value.length;
          this.gradeLimitAll = checkedCount === this.grades.length;
        },
        //参与部落选择
        tribeStateChange(val) {
          if (val==0) {
            this.IsAlltribe = false;
            this.rules.tribeIdLimit3 = "";
            this.activity.organizationLimit = "0"
          }else{
            this.IsAlltribe = true;
            this.rules.tribeIdLimit3 = [{required: true,message: '请选择参与部落',trigger: 'change'}];
            this.activity.organizationLimit = this.activity.tribeIdLimit3
          }
        },
        handleCheckedTribeChange(value){
          this.activity.organizationLimit = value
        },
        //是否投票
        changeVote(value){
          if (value) {
            this.rules.voteTime = [{required: true,message: '请选择投票开始时间',trigger: 'blur'}];
          }else{

            this.rules.voteTime = ''
          }
        },
        //远程搜索
        remoteMethod(query) {
          if (query !== '') {
            this.loading = true;

            this.$http.get("/school/students/NoPage",{params:{
                key:query
            }}).then(res => {
                this.loading = false;
                this.options4 =  res.data
            })


          } else {
            this.options4 = [];
          }
       },
       //清除下拉框
       clear(){
            this.options4 = [];

       },
       submitNormal(formName){
         this.$refs[formName].validate((valid) => {
             if (valid) {
                this.IsActiveStep1 = false;
                this.IsActiveStep2 = true;
                this.IsActiveStep3 = false;
                this.active = 1;
             }else{
               return false;
             }
         })
       },
       backactivityNormal(){
         this.IsActiveStep1 = true;
         this.IsActiveStep2 = false;
         this.IsActiveStep3 = false;
         this.active = 0;
       },
       backactivityClass(){
         this.IsActiveStep1 = false;
         this.IsActiveStep2 = true;
         this.IsActiveStep3 = false;
         this.active = 1;
       },
       submitClass(formName){
         this.$refs[formName].validate((valid) => {
             if (valid) {
                this.IsActiveStep1 = false;
                this.IsActiveStep2 = false;
                this.IsActiveStep3 = true;
                this.active = 2;
             }else{
               return false;
             }
         })
       },
        submit(formName) {
			     var that = this
          this.$refs[formName].validate((valid) => {

              if (valid) {

                that.activity.startTime = that.activity.activityDate[0].getTime();
                that.activity.endTime = that.activity.activityDate[1].getTime();
                that.activity.enrollEndTime = that.activity.enrollEndTimes.getTime();
                that.activity.classifyIds  = that.activity.classifyIds2.join(',');

                 if(typeof that.activity.collegeLimit == 'object'){
                        that.activity.collegeLimit = that.activity.collegeLimit.join(',');
                 }

                 if(typeof that.activity.gradeLimits  == 'object'){
                        that.activity.gradeLimit = that.activity.gradeLimits.join(',');
                 }

                 if(typeof that.activity.organizationLimit == 'object'){
                        that.activity.organizationLimit = that.activity.organizationLimit.join(',');
                 }


                 // if (this.activitySuccess.voteDepartmentIdLimit) {
                 //   this.activitySuccess.voteDepartmentIdLimit = this.activitySuccess.voteDepartmentIdLimit.join(',');
                 // }



                 if (that.activity.isVote) {
                   that.activity.voteStartTime  = new Date(that.activity.voteTime[0]).getTime();
                   that.activity.voteEndTime  = new Date(that.activity.voteTime[1]).getTime();
                 }

                var n = Number(this.activity.managerId);
                if (isNaN(n)){
                    this.activity.managerId  =   this.activity.adminId
                }


                if (this.activity.attachUrls2.length) {
                    this.activity.attachUrls = this.activity.attachUrls2.map( item => {
                      return item.url
                    })
                    this.activity.attachUrls = this.activity.attachUrls.join(",")
                }


                // this.activity  = Object.assign(this.activityNormal, this.activityClass, this.activitySuccess);


                 if (that.id) {
                   that.activity.id = that.id
                   that.$http.post('/activity/edit', that.activity).then(res => {
                      if (res.code == '200') {
                          that.$refs['activity'].resetFields();
                          that.$message({
                              type: 'success',
                              message: '活动修改成功!'
                          });
                           that.$router.push("/ideology/party/activity")

                      }else{
                        // that.$refs['activity'].resetFields();
                        that.$message({
                          type:"error",
                          message:res.msg
                        })
                      }
                  })

                 } else{

                   that.$http.post('/activity/establish', that.activity).then(res => {
                      if (res.code == '200') {
                          that.$refs['activity'].resetFields();
                          that.$message({
                              type: 'success',
                              message: '活动发布成功!'
                          });
                           that.$router.push("/ideology/party/activity")

                      }else{
                        // that.$refs['activity'].resetFields();
                        that.$message({
                          type:"error",
                          message:res.msg
                        })
                      }
                  })


                 }




              }else{
                return false;
              }
            })


        }
    }
}
</script>
<style scoped>

.activityWidth{
    width:100%
}
.activity-info {
	margin-bottom: 20px;
	border: 1px solid rgba(242, 243, 251, 1);
}
.basic-title {
	height: 40px;
	line-height: 40px;
	margin-bottom: 20px;
	background-color: rgba(242, 243, 251, 1);
}
.basic-title span {
	margin: auto 20px;
}

.el-checkbox {
    margin-left: 0;
    margin-right: 30px;
}

.moreIntroduce {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 200px;
}

.panel-options {
    width: 98%;
    overflow: hidden;
    margin: 0px auto;
    padding-bottom: 10px;
    font-size: 14px;
}

.nav-tabs>li {
    float: left;
    margin-right: 15px;
}

.nav-tabs>li>a {
    float: left;
    padding-bottom: 10px;
}

.nav-tabs>li:hover a {
    color: #008AFF
}

.nav-tabs>.active a {
    color: #008AFF;
    border-bottom: 2px solid #008AFF;
}

.showActivy {
    line-height: 30px;
}

.showActivy td {
    padding-bottom: 20px;
}

.selectWidth {
    width: 100%;
}

.avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader-icon:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 29px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

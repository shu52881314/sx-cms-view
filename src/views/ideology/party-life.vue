<template>
<section>



  <el-dialog title="添加党员" @close="beforeCloseHandler" :visible.sync="dialogVisible" :close-on-click-modal="false" width="550px">

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
        <el-form-item label="归属党组织" prop="organizationIds">
            <el-col :span="22">
              <el-cascader    style="width:300px"  class="selectWidth" expand-trigger="click" v-model="ruleForm.organizationIds" clearable :options="classifies" :change-on-select="true" :show-all-levels="true"></el-cascader>
            </el-col>
        </el-form-item>
        <el-form-item label="身份" prop="identity">
          <el-select  style="width:300px" clearable v-model="ruleForm.identity" placeholder="请选择身份">
            <el-option v-for="option in identitys" :key="option.id" :label="option.name" :value="option.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入党日期" prop="joinTime">
          <el-date-picker style="width:300px"
           v-model="ruleForm.joinTime"
           type="date"
           placeholder="选择日期">
         </el-date-picker>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input style="width:300px" v-model="ruleForm.contact" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">添加党员</el-button>
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
          <el-button type="primary" @click="subruleFormTrans('ruleFormTrans')">添加党员</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <div class="main-header">
    <span class="main-title">党组织生活</span>
    <div class="main-btn-box">
      <el-button type="primary" size="mini" v-perms="'/ideology/meeting/add'" @click.native="routerLink('meeting/edit','update')">新增党组织生活</el-button>
      <el-button type="primary" size="mini" v-perms="'/ideology/meeting/entry'" @click.native="routerLink('meeting/edit','update', 0,'',1)">录入党组织生活</el-button>
    </div>
  </div>
  <div class="search-box">
    <el-form size="mini" :inline="true" class="demo-form-inline">
      <el-form-item label="开始日期">
        <!-- <el-date-picker clearable size="mini" class="selectWidth" :editable="false" type="daterange" v-model="dateArray" @change='change' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker> -->

        <el-form-item  >
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
        <el-form-item >
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
      <el-form-item label="状态">
        <el-select clearable v-model="params.status" placeholder="请选择分类">
          <el-option v-for="option in identitys" :key="option.id" :label="option.name" :value="option.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="名称">
        <el-input v-model="params.keyword" placeholder="请输入名称搜索"  maxlength=30 ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button size="mini" type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="main-body">
    <el-table :loading="loading" :data="data" stripe size="mini" style="width: 100%">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="theme" label="会议主题"></el-table-column>
      <el-table-column prop="startTime" label="会议开始时间">
        <div slot-scope="scope">
          {{scope.row.startTime | formatDate }}
        </div>
      </el-table-column>
      <el-table-column prop="address" label="会议地点"></el-table-column>
      <el-table-column prop="joinUsersCount" label="参与人员"></el-table-column>
      <el-table-column prop="createUserName" label="创建人"></el-table-column>
      <el-table-column prop="status" label="状态">
        <div slot-scope="scope">
           {{scope.row.status == 1 ? '未开始' : (scope.row.status == 2 ? '进行中' : '已结束') }}
        </div>
      </el-table-column>
      <el-table-column label="操作" width="160" align="left">
        <div slot-scope="scope">
          <!-- 可转载站点功能未完成 -->
          <el-button  v-perms="'/ideology/meeting/details'" type="text" class="opreat-btn" @click.native="routerLink('meeting/show','view',scope.row.id,'','1')">详情</el-button>
        </div>
      </el-table-column>
    </el-table>
    <qu-pagination :total="total" @change="changePage"></qu-pagination>
  </div>
</section>
</template>
<script>
import {cascade} from '@/utils/filters'
import { Message } from 'element-ui';
export default {
  data() {
    return {
      isShow:true,
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
      ruleFormTrans:{
         time:'',
         opinion:'',
         attachUrls:'',
         userId:'',
         identity:''
      },
      dialogVisible: false,
      ruleForm: {
        id: '',
        campus: '',
        college: '',
        majorId: '',
        name: ''
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
        joinTime: [{
          required: true,
          message: '请选择加入时间',
          trigger: 'change'
        }],
        contact: [{
          required: true,
          message: '请输入联系方式',
          trigger: 'blur'
        }]
      },
      dialogVisibleTransForm:false,
      dateArray: {
        startDate2 : '',
        endDate2 : ''
      },
      loading: false,
      params: {
        type:1,
        current: 1,
        size: 10,
        status: '',
        startTime: '',
        endTime: '',
        keyword: ''
      },
      identitys: [
        {
          id: '',
          name: '不限'
        },
        {
          id: 1,
          name: '未开始'
        },
        {
          id: 2,
          name: '进行中'
        },
        {
          id: 3,
          name: '已结束'
        }
      ],
      data: [],
      total: 0,
    }
  },
  created() {

    this.fetch()
  },
  mounted() {

  },
  methods:{
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
    uploadSuccessed(url) {
      this.ruleFormTrans.attachUrls = url
    },

    subruleFormTrans(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
           this.ruleFormTrans.time = this.ruleFormTrans.time.getTime()
        }
      })
    },
    beforeCloseTransForm(){
        this.resetForm('ruleFormTrans');
    },

    fetch() {
      this.loading = true
      console.log (this.params,'this.params')
      this.$http.get('/ideology/meeting/list', {
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
      if (!this.dateArray.startDate2 && !this.dateArray.endDate2) {
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
      // if (this.dateArray && this.dateArray.length) {
      //   this.params.startTime = this.dateArray[0].getTime();
      //   this.params.endTime = this.dateArray[1].getTime();
      // } else {
      //   this.dateArray = []
      //   this.params.startTime = ""
      //   this.params.endTime = ""
      // }
    //   if (this.dateArray) {
    //     this.params.startTime = this.dateArray.startDate2.getTime();
    //     this.params.endTime = this.dateArray.endDate2.getTime();
    //   } else {
    //     this.dateArray = []
    //     this.params.startTime = ""
    //     this.params.endTime = ""
    //   }
    //
    // },

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

             this.$http.post("###",this.ruleForm).then( res => {
                if( res.code == '200' ){

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

<template>
<section>





  <div class="main-header">
    <span class="main-title">先进党组织</span>
    <div class="main-btn-box">
      <el-button type="primary" v-perms="'/ideology/advanced/party/add'" @click="routerLink('party/edit', 'update',0,'','1')" size="mini">新增征集主题</el-button>
    </div>
  </div>
  <div class="search-box">
    <el-form size="mini" :inline="true" class="demo-form-inline">
      <el-form-item label="报名截止日期">
        <!-- <el-date-picker clearable size="mini" class="selectWidth" :editable="false" type="daterange" v-model="dateArray" @change='change' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker> -->
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
        <el-form-item  >
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
        <el-select clearable v-model="params.status" >
          <el-option v-for="option in statuses" :key="option.id" :label="option.name" :value="option.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="params.keyword" maxlength=30  placeholder="请输入关键字搜索"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button size="mini" type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="main-body">
    <el-table :loading="loading" :data="data" stripe size="mini" style="width: 100%">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="theme" label="评选征集"></el-table-column>
      <el-table-column prop="applyEndTime" label="报名截止时间">
        <div slot-scope="scope">
          {{scope.row.applyEndTime | formatDate }}
        </div>
      </el-table-column>
      <el-table-column prop="voteStartTime" label="投票时间">
        <div slot-scope="scope">
          {{scope.row.voteStartTime | formatDate }} -
          {{scope.row.voteEndTime | formatDate }}
        </div>
      </el-table-column>
      <el-table-column prop="code" label="参与党组织">
        <div slot-scope="scope">
          {{ scope.row.joinPartyOrganizationList.length == 0 ? '不限' : scope.row.joinPartyOrganizationList.length }}
        </div>
      </el-table-column>
      <el-table-column prop="submittedCount" label="已提交"></el-table-column>
      <el-table-column prop="waitAuditCount" label="待审核"></el-table-column>
      <el-table-column prop="status" label="状态">
        <div slot-scope="scope">
          {{scope.row.status == 1 ? '征集中' :  (scope.row.status == 2 ? '征集结束' : (scope.row.status == 3 ? '投票中' : '投票结束') ) }}
        </div>
      </el-table-column>
      <el-table-column label="操作" width="160" align="left">
        <div slot-scope="scope">
          <!-- 可转载站点功能未完成 -->
          <el-button  v-perms="'/ideology/advanced/party/details'" type="text" class="opreat-btn" @click.native="routerLink('party/show','view',scope.row.id,'','1')">详情</el-button>
        </div>
      </el-table-column>
    </el-table>
    <qu-pagination :total="total" @change="changePage"></qu-pagination>
  </div>
</section>
</template>
<script>
import { Message } from 'element-ui';
import {cascade} from '@/utils/filters'
export default {
  data() {
    return {
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
        }
      },
      statuses:[
        {
          id:'',
          name:'不限'
        },
        {
          id:1,
          name:'征集中'
        },
        {
          id:2,
          name:'征集结束'
        },
        {
          id:3,
          name:'投票中'
        },
        {
          id:4,
          name:'投票结束'
        }
      ],
      dialogVisible: false,
      ruleForm: {
        userId: '',
        status:'0',
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
        startDate2:'',
        endDate2:'',
      },
      loading: false,
      params: {
        current: 1,
        size: 10,
        status: '',
        startTime: '',
        endTime: '',
        keyword: '',
        type:1
      },
      organizations: [],
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
    beforeCloseTransForm(){
        this.resetForm('ruleFormTrans');
    },

    fetch() {
      this.loading = true
      this.$http.get('/ideology/advanced/list', {
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
    submitForm(formName) {
         this.$refs[formName].validate((valid) => {
           if (valid) {
             this.ruleForm.joinTime =  this.ruleForm.joinTime.getTime()
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

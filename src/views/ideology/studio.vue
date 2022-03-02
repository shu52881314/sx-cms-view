<template>
<section>

  <div class="main-header">
    <span class="main-title">活动征集</span>
    <div class="main-btn-box">
      <el-button v-perms="'/ideology/studio/add'" @click="routerLink('studio/edit', 'update')" type="primary" size="mini">新增活动征集</el-button>

    </div>
  </div>
  <div class="search-box">
    <el-form size="mini" :inline="true" class="demo-form-inline">
      <el-form-item label="创建日期">
        <!-- <el-date-picker clearable size="mini" class="selectWidth" :editable="false" type="daterange" v-model="dateArray" @change='change' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker> -->

        <el-form-item   >
            <el-col :span="22">
              <el-date-picker
               @change="changeStartDate"
               style="width:100%;"
               v-model="dateArray.startDate2"
               type="date"
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
               type="date"
               default-time="23:59:59"
               placeholder="请选择结束日期" :picker-options="pickerOptions1">
             </el-date-picker>
            </el-col>
        </el-form-item>

      </el-form-item>
      <el-form-item label="状态">
        <el-select clearable v-model="params.status	" placeholder="请选择分类">
          <el-option v-for="option in statues" :key="option.id" :label="option.name" :value="option.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input style="width:250px;" v-model="params.keyword" maxlength=30  placeholder="根据主题名称、创建人进行搜索"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="main-body">
    <el-table :loading="loading" :data="data" stripe size="mini" style="width: 100%">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="createUserName" label="创建人"></el-table-column>
      <el-table-column prop="theme" label="征集主题"></el-table-column>
      <el-table-column prop="applyEndTime" label="报名截止时间">
				<div slot-scope="scope">
					{{scope.row.applyEndTime | formatDate }}
				</div>
			</el-table-column>
      <el-table-column prop="endTime" label="公示结束时间">
				<div slot-scope="scope">
					{{scope.row.endTime | formatDate }}
				</div>
			</el-table-column>
      <el-table-column prop="auditedCount" label="已审核"></el-table-column>
      <el-table-column  label="待审核">
        <div slot-scope="scope">
          <span style="color:red" v-if="scope.row.waitAuditCount != 0">  {{scope.row.waitAuditCount }} </span>
          <span v-else>  {{scope.row.waitAuditCount }} </span>
        </div>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <div slot-scope="scope">
          {{scope.row.status == 1 ? "征集中" : (scope.row.status == 2 ? "公示中" : (scope.row.status == 3 ? "公示结束" : "已发放学时" ) ) }}
        </div>
      </el-table-column>
			<el-table-column prop="code" label="创建时间">
				<div slot-scope="scope">
					{{scope.row.ctime | formatDate }}
				</div>
			</el-table-column>
      <el-table-column label="操作" width="160" align="left">
        <div slot-scope="scope">

          <el-button  @click.native="routerLink('studio/show','view',scope.row.id)" type="text" class="opreat-btn">详情</el-button>
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
        keyword: ''
      },
      statues: [
				{
          id: '',
          name: '全部'
        },
				{
          id: 1,
          name: '征集中'
        },
        {
          id: 2,
          name: '公示中'
        },
        {
          id: 3,
          name: '公示结束'
        }
      ],
      data: [],
      total: 0,
    }
  },
  created() {
    this.getClasses()
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


    getClasses(){
      this.$http.get('/organization/party/list/all',{
        params:{
          nature:7
        }
      }).then(res => {
          // this.Temclassifies = res.data
          this.classifies = cascade("0", res.data)
          // this.classifies = res.data;
          // this.getDataInfo(this.id)
      })
    },
    fetch() {
      this.loading = true
      this.$http.get('/ideology/studio/list', {
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

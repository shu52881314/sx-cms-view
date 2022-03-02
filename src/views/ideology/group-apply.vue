<template>
  <section>

    <el-dialog title="申请信息" :visible.sync="dialogVisiblesee" :close-on-click-modal="false" width="750px">
			<div class="poartyInforMain">
				<div class="poartyInforMain-title">
					 <span class="poartyInforMain-title-left">
							标题
					 </span>
					 <div class="poartyInforMain-title-right">
								 {{attachShow.applyTitle}}
					 </div>
				</div>
				<div class="poartyInforMain-title">
					 <span class="poartyInforMain-title-left">
							内容
					 </span>
					 <div class="poartyInforMain-title-right">
								 {{attachShow.applyContent}}
					 </div>
				</div>
				<div class="poartyInforMain-title">
					 <span class="poartyInforMain-title-left">
							附件
					 </span>
					 <div class="poartyInforMain-title-right">
						 <span v-for="item2 in attachShow.applyAttachList">
               <img style="width:100px;height:100px;float:left;margin-right:15px;" :src="item2.url">

						 </span>
					 </div>
				</div>
			</div>
		</el-dialog>

		<el-dialog title="通过申请" :visible.sync="dialogVisible" :close-on-click-modal="false" width="30%">
        <el-form size="mini" :model="ruleFormPass" ref="ruleFormPass" class="demo-ruleForm">
          <el-form-item>
              <el-col :span="22">
                  <el-input type="textarea" placeholder="请输入意见" v-model="ruleFormPass.remark"></el-input>
              </el-col>
          </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitFormPass()">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

		<el-dialog title="驳回申请" :visible.sync="dialogVisibleAdopt" :close-on-click-modal="false" width="30%">
        <el-form size="mini" :model="ruleFormReject" ref="ruleFormReject" class="demo-ruleForm">
            <el-form-item prop="name">
                <el-col :span="22">
                    <el-input type="textarea" placeholder="请输入驳回理由(200字以内)" maxlength='200' v-model="ruleFormReject.remark"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitFormReject()">确定</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>

		<div class="main-header">
			<span class="main-title">团员申请</span>
		</div>

		<div class="search-box">
			<el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item label="日期">
         <!-- <el-date-picker @change="changeDate" clearable size="mini" class="selectWidth" :editable="false" type="datetimerange" v-model="dateArray" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
         </el-date-picker> -->

         <el-form-item   >
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
                default-time="23:59:59"
                placeholder="请选择结束日期" :picker-options="pickerOptions1">
              </el-date-picker>
             </el-col>
         </el-form-item>

       </el-form-item>
        <el-form-item label="状态">
					<el-select clearable v-model="params.status" placeholder="请选择分类">
						<el-option v-for="option in statues" :key="option.id" :label="option.name" :value="option.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="params.keyword"  maxlength=30 placeholder="请输入姓名/团组织名称搜索"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button size="mini" type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="main-body">
				<el-table :loading="loading" :data="data" stripe size="mini" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="userName" label="姓名"></el-table-column>
          <el-table-column prop="userCode" label="学号" ></el-table-column>
          <el-table-column prop="organizationName" label="所属团组织" ></el-table-column>
          <el-table-column label="申请日期" align="center">
          	<template slot-scope="scope">
							<span>{{scope.row.applyTime  | formatDate}}</span>
						</template>
          </el-table-column>
          <!-- <el-table-column prop="applyIdentity" label="申请成为">
            <div slot-scope="scope">
              {{scope.row.applyIdentity == 3 ? "入党积极分子" : (scope.row.applyIdentity == 4 ? "发展对象" : (scope.row.applyIdentity == 5 ? "预备党员" : "党员" ) ) }}
            </div>
          </el-table-column> -->
          <el-table-column prop="activityName" label="附件">
              <div slot-scope="scope">
              <el-button @click="openMore(scope.row)" type="text" class="opreat-btn">查看</el-button>
              </div>
          </el-table-column>
          <el-table-column prop="auditUserName" label="操作人"></el-table-column>
          <el-table-column  label="操作" align="center">
            <div slot-scope="scope">
              <!-- 可转载站点功能未完成 -->
              <span v-perms="'/ideology/group/fee/administration/examine'">
                <el-button v-if="scope.row.status == 1" type="text" class="opreat-btn" @click="adopt(scope.row,2)">通过</el-button>
                <el-button v-if="scope.row.status == 1" type="text" class="opreat-btn" @click="adopt(scope.row,3)">驳回</el-button>
              </span>
              <el-button @click="seeReason(scope.row.auditRemark)" v-if="scope.row.status == 2" type="text" class="opreat-btn">通过意见</el-button>
              <el-button @click="seeReason(scope.row.auditRemark)" v-if="scope.row.status == 3" type="text" class="opreat-btn">查看驳回理由</el-button>
            </div>
          </el-table-column>
        </el-table>
        <qu-pagination :total="total" @change="changePage"></qu-pagination>
		</div>
  </section>
</template>
<script>
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
      dialogVisiblesee:false,
      attachShow:{},
      statues:[
        {
          id:"",
          name:'不限'
        },
        {
          id:1,
          name:'待审核'
        },
        {
          id:2,
          name:'已通过'
        },
        {
          id:3,
          name:'已驳回'
        }
      ],
      loading: false,
			params: {
				current: 0,
				size: 10,
				status: '',
				startTime: '',
				endTime: '',
				keyword: '',
        type:1
			},
			dateArray:{
        startDate2 : '',
        endDate2 : ''
      },
			dialogVisible:false,
			dialogVisibleAdopt:false,
			data: [],
			ruleFormPass: {
                id: '',
                handleType:2,
                remark:'',
                type:2
			},
			ruleFormReject: {
        id: '',
        handleType:3,
        remark:'',
        type:2
      },
			total: 0
    }
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
    // change(value) {
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
    seeReason(reason){

      this.$alert(reason, '标题', {
       confirmButtonText: '确定'
     });

    },
    openMore(item){
      this.dialogVisiblesee = true
      this.attachShow = item
    },
		 changeDate(){
            if (this.dateArray && this.dateArray.length) {
              this.params.startTime = this.dateArray[0].getTime();
              this.params.endTime = this.dateArray[1].getTime();
            }else{
              this.dateArray = []
              this.params.startTime = ""
              this.params.endTime = ""
            }
     },
		// //驳回
		// eject(id) {
		// 		this.dialogVisibleAdopt = true;
		// 		this.ruleFormReject.id = id;
		// },
		submitFormPass() {
      if (this.ruleFormPass.remark) {
          this.$http.post('ideology/party/member/examine',this.ruleFormPass).then( () => {
              this.dialogVisible = false;
              this.ruleFormPass.remark = '';
              this.fetch();
              this.$message({
                type: 'success',
                message: '通过成功!'
              });
          })
      } else {
          this.$message({
              type: 'error',
              message: '请填写意见'
          });
      }

		},
		  submitFormReject() {
            if (this.ruleFormReject.remark) {
                this.$http.post('ideology/party/member/examine',this.ruleFormReject).then( (res) => {
                  if (res.code == '200') {
                    this.dialogVisibleAdopt = false;
                    this.ruleFormReject.remark = '';
                    this.fetch();
                  this.$message({
                    type: 'success',
                    message: '驳回成功!'
                  });
                  }

                })
            } else {
                this.$message({
                    type: 'error',
                    message: '请填写原因'
                });
            }

        },

		fetch() {
			this.loading = true
			this.$http.get('/ideology/studio/party/apply/list', {params: this.params}).then(res => {
      	this.data = res.data.list
				this.total = res.data.total
				this.loading = false
			})
		},
		adopt(row,status){
      if (status == 2) {
        //通过
        this.ruleFormPass.id = row.id;
        this.dialogVisible = true;
      }else{
        //驳回
        this.ruleFormReject.id = row.id;
        this.dialogVisibleAdopt = true;
      }


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
		changePage(current, size){
			this.params.current = current
			this.params.size = size
			this.fetch()
		}
	},
	created(){
		this.fetch()
	},
	mounted(){

	}
}
</script>
<style lang="scss">
.poartyInforMain{
  width:100%;
  max-height:300px;
  overflow:auto;
  &-title{
    width:100%;
    overflow:hidden;
    line-height:26px;
    padding-top:20px;
    &-left{
      float:left;
      width:40px;
    }
    &-right{
      margin-left:50px;
    }
  }
}
</style>

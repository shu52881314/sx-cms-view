<template>
  <section>
		<div class="main-header">
			<span class="main-title">打卡任务</span>
			<div class="main-btn-box">
					<el-button type="increase" size="mini" @click="routerLink('signTask/edit', 'add')" v-perms="'/communist/signTask/add'">新增</el-button>
			</div>
		</div>

		<div class="search-box">
			<el-form size="mini" :inline="true" class="demo-form-inline">
				<el-form-item>
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
				<el-form-item>
					<el-select clearable  size="mini" v-model="params.status" placeholder="状态">
							<el-option v-for="item in statuss" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="params.name" maxlength=30  placeholder="请输入名称搜索"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button size="mini" type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</div>

		<div class="main-body">
				<el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
          <el-table-column type="index" label="序号" :index="indexMethod"></el-table-column>
        <el-table-column prop="name" label="任务名称"></el-table-column>
        <el-table-column prop="address" label="打卡地点"></el-table-column>
        <el-table-column label="起止日期">
            <template slot-scope="scope">
               <span> {{scope.row.startDate | formatD }} 至 {{scope.row.endDate | formatD }}</span>
            </template>
        </el-table-column>
        <el-table-column  prop="signTime" label="打卡时间">
          <template slot-scope="scope">
             <span v-for="item in scope.row.signTime" style="padding-right:10px;">
               {{ item.startTime }} - {{ item.endTime}}<br>
             </span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="collegeLimit" label="参与院系">
          <template slot-scope="scope">
            共 {{ scope.row.collegeLimit.length }} 个院系

          </template>
        </el-table-column>
        <el-table-column prop="gradeLimit" label="参与年级">
          <template slot-scope="scope">
            共 {{ scope.row.gradeLimit.length }} 个年级
          </template>
        </el-table-column> -->
        <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
               <span> {{scope.row.status === 0 ? '删除' : (scope.row.status === 1 ? '待开始' : (scope.row.status === 2 ? '进行中' : (scope.row.status === 3 ? '已结束' : '强制结束') ))}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="ctime" label="创建时间">
            <template slot-scope="scope">
               <span> {{scope.row.ctime | formatDate }}</span>
            </template>
        </el-table-column>
          <el-table-column  label="操作" width="160" align="center">
            <div slot-scope="scope">
              <!-- 可转载站点功能未完成 -->
              <!-- <el-button type="text" class="opreat-btn" @click.native="routerLink('activity/detail','view',scope.row.id)">详情</el-button> -->
              <el-button type="text" class="opreat-btn" @click.native="routerLink('signTask/edit', 'update', scope.row.id)" v-perms="'/communist/signTask/edit'">修改</el-button>
              <el-button type="text" class="opreat-btn" @click.native="deleteBatch(scope.row.id) " v-perms="'/communist/signTask/edit'" v-if="scope.row.status != 4">强制结束</el-button>
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
      loading: false,
			params: {
				current: 1,
				size: 10,
				name: '',
				startDate: '',
				endDate: '',
				status: ''
			},
      dateArray:{
        startDate2 : '',
        endDate2 : ''
      },
			  statuss:[
              {
                  value: 1,
                  label: '待开始'
              },
              {
                  value: 2,
                  label: '进行中'
              },
              {
                  value: 3,
                  label: '已结束'
              },
              {
                  value: 4,
                  label: '强制结束'
              }
     ],
			classifies: [{id: '', name: '全部'}],
			data: [],
			total: 0,
			options: [{id: '', name: '不限'}]
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
    //     this.params.startDate = this.dateArray.startDate2.getTime();
    //     this.params.endDate = this.dateArray.endDate2.getTime();
    //   } else {
    //     this.dateArray = []
    //     this.params.startDate = ""
    //     this.params.endDate = ""
    //   }
    //
    // },
		indexMethod(index) {
            return index + 1
        },
		  changeDate(){
            if (this.dateArray && this.dateArray.length) {
              this.params.startDate = this.dateArray[0].getTime();
              this.params.endDate = this.dateArray[1].getTime();
            }else{
              this.dateArray = []
              this.params.startDate = ""
              this.params.endDate = ""
            }
     },
		getClassify() {
			this.$http.get('/activity/classify').then(res => {
				this.classifies = this.classifies.concat(res.data)
			})
		},
		fetch() {
			this.loading = true
			this.$http.get('/sign/list', {params: this.params}).then(res => {
				this.data = res.data.list
				this.total = res.data.total
				this.loading = false
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
		deleteBatch(id){
			var that = this
			// var ids = id+''
			this.$confirm('是否强制结束该打卡事项?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
						}).then(() => {
				this.$http.post('/sign/delete', {id:id}).then(res => {
					if(res.code == '200'){
             that.$message({
										type: 'success',
										message: '操作成功!'
								});
								this.fetch()
					}

								// that.initTableData(that.$api.employeeList, that.params)
					}).catch(error => {
				});
			})
		},
	},
	created(){
		this.getClassify()
		this.fetch()
	},
	mounted(){

	}
}
</script>
<style>

</style>

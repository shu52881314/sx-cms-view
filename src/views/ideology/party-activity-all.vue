<template>
  <section>
		<div class="main-header">
			<span class="main-title">全部活动</span>
      <div class="main-btn-box">
        <el-button  @click="importFile" type="primary" size="mini">导出</el-button>
      </div>
		</div>
		<div class="search-box">
			<el-form size="mini" :inline="true" class="demo-form-inline">
				<el-form-item label="分类">
					<el-select clearable v-model="params.classify" placeholder="请选择分类">
						<el-option v-for="option in classifies" :key="option.id" :label="option.name" :value="option.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="活动日期">
					<el-date-picker clearable size="mini" class="selectWidth" :editable="false" type="daterange" v-model="dateArray" @change='change' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
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
				<el-table :loading="loading" :data="data" stripe size="mini" style="width: 100%">
          <el-table-column prop="name" label="名称" width="240" show-overflow-tooltip></el-table-column>
          <el-table-column prop="classifyName" label="分类" width="160" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="activityLimitType" label="限定类型"  show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="orgName" label="主办方" width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="administrator" label="管理员" width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="hours" :label="hoursUnit" width="80" align="center"></el-table-column>
          <el-table-column prop="firstAuditorName" label="初审人"  align="center"></el-table-column>
          <el-table-column prop="lastAuditorName" label="终审人"  align="center"></el-table-column>
					<el-table-column prop="status" label="状态" width="80" align="center" :formatter="formatterStatus"></el-table-column>
          <el-table-column  label="操作" width="160" align="left">
            <div slot-scope="scope">
              <!-- 可转载站点功能未完成 -->
              <el-button type="text" class="opreat-btn" @click.native="routerLink('/communist/activity/detail','view',scope.row.id)" v-perms="'/ideology/party/activity/details'">详情</el-button>
              <el-button type="text" class="opreat-btn"  v-if="scope.row.status < 8" @click.native="routerLink('activity/found', 'update', scope.row.id)" v-perms="'/ideology/party/activity/modify'">修改</el-button>
              <el-button type="text" class="opreat-btn"  v-if="scope.row.status < 7"  @click.native="deleteBatch(scope.row.id,scope.row.status,scope.row.name) " v-perms="'/ideology/party/activity/delete'">删除</el-button>
            </div>
          </el-table-column>
        </el-table>
        <qu-pagination :total="total" @change="changePage"></qu-pagination>
		</div>
  </section>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      hoursUnit:localStorage.getItem("hoursUnit"),
    	dateArray:[],
      loading: false,
			params: {
        type:3,
				current: 0,
				size: 10,
				classify: '',
				startDate: '',
				endDate: '',
				name: ''
			},
			classifies: [{id: '', name: '全部'}],
			data: [],
			total: 0,
			options: [{id: '', name: '不限'}]
    }
  },
	methods:{
    importFile(){

      axios({
       method: 'get',
       url: 'activity/list/export',
       responseType: 'blob',
       params: {
           type:3
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
       link.setAttribute('download', '党建活动' + '.xlsx')
       document.body.appendChild(link)
       link.click()
     })

    },
		change(value){
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
			this.$http.get('/activity/classify',{params:{parentId:0}}).then(res => {
				this.classifies = this.classifies.concat(res.data)
			})
		},
		fetch() {
			this.loading = true
			this.$http.get('/activity/list', {params: this.params}).then(res => {
        this.data = res.data.list
				this.total = res.data.total
				this.loading = false
			})
		},
		search() {
// 			if(this.dateArray){
// 				this.params.startDate = this.dateArray[0].getTime();
//         this.params.endDate = this.dateArray[1].getTime();
// 			}

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
			this.$confirm('此操作将永久删除该活动及其附带的学分及违约记录，是否继续?', '提示', {
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  type: 'warning'
			}).then(() => {
				this.$confirm('再次确认：此操作将永久删除该活动及其附带的学分及违约记录，是否继续?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					this.$confirm('最后一次确认：此操作将永久删除该活动及其附带的学分及违约记录，是否继续?', '提示', {
					  confirmButtonText: '确定',
					  cancelButtonText: '取消',
					  type: 'warning'
					}).then(() => {
						this.$http.post('/activity/delete', {
						id:id,
						status:status,
						}).then(res => {
							if(res.code == '200'){
							  that.$message({
								type: 'success',
								message: '删除成功!'
							  });
							  that.fetch()
							}
						}).catch(error => {});
					}).catch(error => {});
				}).catch(error => {});
			}).catch(error => {});
		},
		formatterStatus(row, column, cellValue){
        if(cellValue == 1){
          return "待初审"
        }else if(cellValue == 2){
          return "待终审"
        }else if(cellValue == 3){
          return "初审驳回"
        }else if(cellValue == 4){
          return "终审驳回"
        }else if(cellValue == 5){
          return "报名中"
        }else if(cellValue == 6){
          return "报名结束"
        }else if(cellValue == 7){
          return "进行中"
        }else if(cellValue == 8){
          return "已结束待提交报告"
        }else if(cellValue == 9){
          return "已提交报告待审核"
        }else if(cellValue == 10){
          return "提交报告驳回"
        }else if(cellValue == 11){
          return "已完结"
        }else if(cellValue == 12){
          return "已发放学分"
        }
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
